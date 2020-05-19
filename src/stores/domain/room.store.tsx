import { RootStore } from "../../core/store";
import { Room } from "../../models/room";
import { RoomService } from "../../services/room.service";
import CrudStore, { CrudState } from "./crud.store";
import { forkJoin } from "rxjs";
import { runInAction } from "mobx";

export default class RoomStore extends CrudStore<Room, number, RoomService> {    
    onLoading = {};
    constructor(rootStore: RootStore) {
        super(rootStore, new RoomService(null));
    }

    setOnLoading(){
        this.onLoading = {}
    }

    onUpdate(entity: Room, state: CrudState, isError: boolean) {
        if(state === CrudState.Submitting)
            this.onLoading[entity.id] = true;
        else
            this.onLoading[entity.id] = false;

        if(isError && this.entities){
            let index = this.entities.findIndex(e => e.id === entity.id);
            this.entities[index].active = !entity.active;
        }
    }    

    getRoomAndSchedule(roomId: number){
        //debugger;
        let scheduleService =  this.rootStore.scheduleStore.service;
        let roomSubscription = this.service.getById(roomId);
        let scheduleSubscription = scheduleService.getByRoomId(roomId);
        forkJoin([roomSubscription, scheduleSubscription]).subscribe(
            ([room, schedule]) => {
                if(!room.isSchedule){
                    schedule = Object.assign({}, schedule, {
                        startAt: new Date(),
                        endAt: new Date()
                    })
                }
                runInAction(() => {                     
                    console.log("room", room);
                    console.log("schedule", schedule);
                    this.setEntity(room),
                    this.rootStore.scheduleStore.setEntity(schedule);
                })
            }
        )
    }
}