import {Injectable} from '@angular/core';
import {Headers,RequestOptions, URLSearchParams} from '@angular/http';

import * as constants from '../app/config/constants';
import {DesignationSetup_Model} from '../models/designationsetup_model';
import {BaseHttpService} from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DesignationSetup_Service 
{	
	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
	
	constructor(private httpService: BaseHttpService) {};
	
    private handleError (error: any) {
	   let errMsg = (error.message) ? error.message :
	   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	   console.log(errMsg); // log to console instead
	   //localStorage.setItem('session_token', '');       
	  return Observable.throw(errMsg);
	}

	query (params?:URLSearchParams): Observable<DesignationSetup_Model[]> 
    {       
        //let bank :any;
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map(() => {
					let banks: Array<DesignationSetup_Model> = [];
					// result.resource.forEach((bank) => {
					// 	banks.push(BankSetup_Model.fromJson(bank));
					// });  
					return banks;
				}).catch(this.handleError);
	};
	
	
	save (designation_main: DesignationSetup_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, designation_main.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	update (designation_main: DesignationSetup_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);		
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl, designation_main.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	get_bank (params?: URLSearchParams): Observable<DesignationSetup_Model[]> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');		
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params ,headers: queryHeaders})
			.map(() => {
					let banks: Array<DesignationSetup_Model> = [];
					// result.resource.forEach((bank) => {
					//  	banks.push(BankSetup_Model.fromJson(bank));
					//  });
					return banks;
				}).catch(this.handleError);
	};
	
	remove (id: string) {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id,{ headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				return result.DESIGNATION_GUID;
			});
	}

	remove_multiple(id: string, tablename: string) {       
		let url_multiple = this.baseResource_Url + tablename + "?filter=(TENANT_GUID=" + id + ")";		
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

	get (id: string, params?: URLSearchParams): Observable<DesignationSetup_Model> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let designation: DesignationSetup_Model = DesignationSetup_Model.fromJson(result);//alert(JSON.stringify(designation)); 
				return designation; 
			}).catch(this.handleError);	
	};
}
