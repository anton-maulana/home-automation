import { RootStore } from "../../core/store";
import { Schedule } from "../../models/schedule";
import { ScheduleService } from "../../services/schedule.service";
import CrudStore, { CrudState } from "./crud.store";
import { action, runInAction } from "mobx";
import { Room } from "src/models/room";
import { forkJoin } from "rxjs";

export default class ScheduleStore extends CrudStore<Schedule, number, ScheduleService> {    
    onLoading = {};
    constructor(rootStore: RootStore) {
        super(rootStore, new ScheduleService(null));
    }  

    @action
    saveSchedule(room: Room, schedule: Schedule) {
        this.state = CrudState.Submitting;
        let roomService = this.rootStore.roomStore.service;
        let roomSubscription = roomService.update(room);
        let scheduleSubscription = this.service.createOrUpdate(schedule);

        forkJoin([roomSubscription, scheduleSubscription]).subscribe(
            result => {
                runInAction(() => {
                    this.state = CrudState.Done;
                });
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