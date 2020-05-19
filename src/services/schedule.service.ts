import Config from './config';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable, from, Subscriber } from 'rxjs';
import urljoin from 'url-join';
import { Query } from '../models/query';
import { RequestHelper } from '../helpers/request.helper';
import { Schedule } from '../models/schedule';
import { CrudService } from './crud';

export class ScheduleService implements CrudService<Schedule, number> {        

    token: string;

    constructor(token: string) {
        this.token = token;
    }
    
    public getAll(query?: Query): Observable<Array<Schedule>> { 
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule'),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public count(query?: Query): Observable<number> { 
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule', 'count'),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public getById(id: number, query?: Query): Observable<Schedule> {
         let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule', id.toString()),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public createOrUpdate(model: Schedule): Observable<number> {
        if (!model['id']) {
            return this.create(model);
        } else if (model['id']) {
            return this.update(model);       
        }
    }

    public create(model: Schedule): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule'),            
            'POST',
            model,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public update(model: Schedule): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule'),            
            'PUT',
            model,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public deleteById(id: any): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'schedule', id.toString()),            
            'DELETE',
            null,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public getByRoomId(id: number, query?: Query): Observable<Schedule> {
        let request = RequestHelper.getRequest(
           urljoin(Config.serverUrl, 'schedule',"room-id", id.toString()),            
           'GET',
           null,
           query,
       );
       
       return ajax(request).pipe(
           map(res => res.response)
       );
   }
}