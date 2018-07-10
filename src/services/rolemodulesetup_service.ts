import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { RoleModuleSetup_Model } from '../models/rolemodulesetup_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

@Injectable()
export class RoleModuleSetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/role_module';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
    Module_New: RoleModuleSetup_Model[] = [];

    constructor(private httpService: BaseHttpService, private nav: NavController) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

    save_multiple_recocrd(module_main: any): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        //alert (JSON.stringify(module_main));
        return this.httpService.http.post(this.baseResourceUrl, module_main, options)
            .map((response) => {
                return response;
            });
    }

    remove(id: string) {
        let url = this.baseResource_Url + "role_module?filter=(ROLE_GUID=" + id + ")";

        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            //.delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .delete(url, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.PAGE_GUID;
            });
    }
}
