import { Query } from '../models/query';
import { Observable } from 'rxjs';

export interface CrudService<TModel, TId> {
    getAll(query: Query) : Observable<Array<TModel>>;
    getById(id: TId): Observable<TModel>;
    createOrUpdate?(model: TModel): Observable<TId>;
    create?(model: TModel): Observable<TId>;
    update?(model: TModel): Observable<TId>;
    deleteById?(id: TId): Observable<TId>;
}