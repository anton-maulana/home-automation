import { Observable, Subscriber } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import urljoin from 'url-join';
import { RequestHelper } from '../helpers/request.helper';
import { Port } from '../models/port';
import { Query } from '../models/query';
import Config from './config';
import { CrudService } from './crud';

export class PortService implements CrudService<Port, number> {        

    token: string;

    constructor(token: string) {
        this.token = token;
    }
    
    public getAll(query?: Query, progressSubscriber?: Subscriber<ProgressEvent>): Observable<Array<Port>> { 
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'port'),            
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
            urljoin(Config.serverUrl, 'port', 'count'),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public getById(id: number, query?: Query, progressSubscriber?: Subscriber<ProgressEvent>): Observable<Port> {
         let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'port', id.toString()),            
            'GET',
            null,
            query,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public createOrUpdate(model: Port, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        if (!model['id']) {
            return this.create(model, progressSubscriber);
        } else if (model['id']) {
            return this.update(model, progressSubscriber);       
        }
    }

    public create(model: Port, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'port'),            
            'POST',
            model,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }

    public update(model: Port, progressSubscriber?: Subscriber<ProgressEvent>): Observable<number> {
        let request = RequestHelper.getRequest(
            urljoin(Config.serverUrl, 'port'),            
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
            urljoin(Config.serverUrl, 'port', id.toString()),            
            'DELETE',
            null,
            null,
        );
        
        return ajax(request).pipe(
            map(res => res.response)
        );
    }
}