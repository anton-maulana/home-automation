import queryString from 'query-string';
import { AjaxRequest } from "rxjs/ajax";
import { Query } from '../models/query';

export class RequestHelper {
    static getRequest(
        url: string,
        method: string,
        body?: any,
        query?: Query): AjaxRequest {
        
        let result: AjaxRequest = {};        
        result.url = url;
        result.method = method;     
        result.headers = {};           
        result.headers['Content-Type'] = 'application/json; charset=utf-8';
        
        if (body)
            result.body = body;

        if (!query)
            return result;

        let qs = {};
        if (query.page && query.perPage) {
            qs['page'] = query.page.toString();
            qs['perPage'] = query.perPage.toString();
        }
        if (query.sort)
            qs['sort'] = query.sort;
        if (query.keywords)
            qs['keywords'] = query.keywords;
        if (query.data) {
            Object.keys(query.data).forEach(key => {
                qs[key] = query.data[key];
            })
        }

        result.url += '?' + queryString.stringify(qs);      
        return result;
    }
}