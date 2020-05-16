import Config from './config';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable, from, Subscriber } from 'rxjs';
import urljoin from 'url-join';
import { Query } from '../models/query';
import { RequestHelper } from '../helpers/request.helper';
import { Room } from '../models/room';
import { CrudService } from './crud';

export class RoomService implements CrudService<Room, number> {        

    token: string;

    constructor(token: string) {
        this.token = token;
    }
    
    public getAll(query?: Query, progressSubscriber?: Subscriber<ProgressEvent>): Observable<Array<Room>> { 
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room'),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public count(query?: Query, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> { 
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room', 'count'),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public getById(id: number, query?: Query, progressSubscriber?: Subscriber<ProgressEvent>): Observable<Room> {
         let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room', id.toString()),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public createOrUpdate(model: Room, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressSubscriber);
        } else if (model['id']) {
            return this.update(model, progressSubscriber);       
        }
    }

    public create(model: Room, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room'),            
            'POST',
            model,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public update(model: Room, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room'),            
            'PUT',
            model,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public deleteById(id: any, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'room', id.toString()),            
            'DELETE',
            null,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }
}