import { Injectable } from '@angular/core';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { TenantCompanySiteSetup_Model } from '../models/tenantcompanysitesetup_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

;

@Injectable()
export class TenantCompanySiteSetup_Service {
    baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site';
    baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

    baseResourceUrl_view: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_tenant_edit';


    constructor(private httpService: BaseHttpService) { };

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg); // log to console instead
        //localStorage.setItem('session_token', '');       
        return Observable.throw(errMsg);
    }

    save(tenant_company_site: TenantCompanySiteSetup_Model): Observable<any> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        //alert(JSON.stringify(tenant_company_site));
        return this.httpService.http.post(this.baseResourceUrl, tenant_company_site.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    update(tenant_main: TenantCompanySiteSetup_Model): Observable<any> {

        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return this.httpService.http.patch(this.baseResourceUrl, tenant_main.toJson(true), options)
            .map((response) => {
                return response;
            });
    }

    get_tenant(params?: URLSearchParams): Observable<TenantCompanySiteSetup_Model[]> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .get(this.baseResourceUrl, { search: params, headers: queryHeaders })
            .map(() => {
                    let branches: Array<TenantCompanySiteSetup_Model> = [];
                    // result.resource.forEach((branch) => {
                    //  	branches.push(BranchSetup_Model.fromJson(branch));
                    //  });
                    return branches;
                }).catch(this.handleError);
    };


    remove(id: string) {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        return this.httpService.http
            .delete(this.baseResourceUrl + '/' + id, { headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                return result.TENANT_COMPANY_SITE_GUID;
            });
    }

    remove_multiple(id: string, tablename: string) {       
        let url_multiple = this.baseResource_Url + tablename + "?filter=(TENANT_COMPANY_GUID=" + id + ")";
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

        return this.httpService.http
            .delete(url_multiple, { headers: queryHeaders })
            .map((response) => {
				//return result.PAGE_GUID;
				return response;
            });
	}

    get(id: string, params?: URLSearchParams): Observable<TenantCompanySiteSetup_Model> {
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        //alert(id);
        return this.httpService.http
            .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            //.get(this.baseResourceUrl_view + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
                var result: any = response.json();
                let tenanttype: TenantCompanySiteSetup_Model = TenantCompanySiteSetup_Model.fromJson(result);
                return tenanttype;
            }).catch(this.handleError);
    };
}




