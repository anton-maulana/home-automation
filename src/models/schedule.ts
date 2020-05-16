import { BaseEntity } from "./baseEntity";


export interface Schedule extends BaseEntity<number> { 
    startAt?: Date;
    endAt?: Date;
    fkRoomId?: number;
}
