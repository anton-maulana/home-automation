

export interface BaseEntity<TId> { 
    id?: TId;
    createdAt?: Date;
    modifiedAt?: Date;
}
