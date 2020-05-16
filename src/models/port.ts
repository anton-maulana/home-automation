import { BaseEntity } from "./baseEntity";


export interface Port extends BaseEntity<number> { 
    description?: string;
    name?: string;
    value?: number;
}

