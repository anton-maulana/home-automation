import { BaseEntity } from "./baseEntity";


export interface Room extends BaseEntity<number> { 
    active?: boolean;
    description?: string;
    name?: string;
    isSchedule?: boolean;
}
