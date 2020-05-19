import { observable, action, runInAction, computed } from "mobx";
import { Port } from "../../models/port";
import { Query } from "../../models/query";
import { RootStore } from "../../core/store";
import { Subject } from "rxjs";
import { CrudService } from "../../services/crud";

export enum CrudState {
    Initial,
    Fetching,
    Submitting,
    Refreshing,
    Deleting,
    Done
}

export default class CrudStore<TEntity, TId, TService extends CrudService<TEntity, TId>> {
    rootStore: RootStore;
    refresh$: Subject<void> = new Subject<void>();
    service: TService;

    constructor(rootStore: RootStore, service: TService){
        this.rootStore = rootStore;
        this.service = service;
    }

    @action
    reset(resetFor: "entity" | "entities" = null){
        if(!resetFor) {
            this.entities = [];
            this.entity = null;
        } else {
            resetFor === "entity" && (this.entity = null);
            resetFor === "entities" && (this.entities = []);
        }
    }

    @action
    setEntity(entity: TEntity){
        this.entity = entity;
    }

    @observable entities: TEntity[] = [];
    @observable entity: TEntity = null;
    @observable state: CrudState = CrudState.Initial;

    @computed 
    get isLoading(): boolean {
        return (this.state !== CrudState.Done)
    }

    @action setNullEntities(): void { this.entities = null;}
    
    onFetch?(entities: TEntity);
    onUpdate?(entity: TEntity, state: CrudState, isError: boolean);
    
    @action
    getEntitites(query: Query, refresh: boolean = false) {
        this.state = refresh ?
            CrudState.Refreshing :
            CrudState.Fetching;

        this.service.getAll(query).subscribe(
            result => {
                runInAction(() => {
                    if(refresh)
                        this.entities = result;
                    else
                        this.entities.push(...result);
                    this.entities = result;
                    this.state = CrudState.Done;
                })
            },
            error => {
                runInAction(() => {
                    this.entities = [];
                    this.state = CrudState.Done;
                })
            }
        );
    }

    @action 
    createOrUpdate(model: TEntity, refresh: boolean = false) {
        this.state = CrudState.Submitting;
        this.onUpdate && this.onUpdate(model, CrudState.Submitting, false);

        this.service.createOrUpdate(model).subscribe(
            result => {
                runInAction(() => {
                    this.onUpdate && this.onUpdate(model, CrudState.Done, false);
                    this.state = CrudState.Done;
                });
                refresh && this.refresh$.next();
            },
            error => {
                console.log(error);
                runInAction(() => {
                    this.onUpdate && this.onUpdate(model, CrudState.Done, true);
                    this.state = CrudState.Done;                    
                })
            }
        )
    }

    @action 
    getEntity(id: any) {
        this.state = CrudState.Fetching;
        this.service.getById(id).subscribe(
            result => {
                runInAction(() => {
                    this.entity = result;
                    this.onFetch && this.onFetch(result);
                    this.state = CrudState.Done;
                })
            },
            error => {
                console.log(error);
                runInAction(() => {
                    this.state = CrudState.Done;
                })
            }
        )
    }

    @action 
    delete(id: TId, refresh: boolean = false) {
        this.state = CrudState.Deleting;
        this.service.deleteById(id).subscribe(
            result => {
                runInAction(() => {
                    this.state = CrudState.Done;
                })
                refresh && this.refresh$.next();
            },
            error => {
                console.log(error);
                runInAction(() => {
                    this.state = CrudState.Done;
                })
            }
        )
    }
    
}