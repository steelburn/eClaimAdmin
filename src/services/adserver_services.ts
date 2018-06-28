import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import * as constants from '../app/config/constants';
import { UserMain_Model } from '../models/user_main_model';
import { BaseHttpService } from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

class ServerResponse {
	constructor(public resource: any) {

	}
};
@Injectable()
export class AdServer_Service {
	baseResource_Url: string = constants.AD_URL;
	constructor(private httpService: BaseHttpService) { };

	User_Authentication(user_main: UserMain_Model): Observable<any> {		
		let url: string = this.baseResource_Url + '/user/bijay/authenticate';

		var queryHeaders = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		queryHeaders.append('Access-Control-Allow-Origin', "*");
        queryHeaders.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');        
        queryHeaders.append('Accept', 'application/json');
		queryHeaders.append('Content-Type', 'application/json');
		
		let options = new RequestOptions({ headers: queryHeaders, withCredentials: true });
		//user_main.toJson(true)
		return this.httpService.http.post(url, '{"password": "bijay234"}', options)
			// .map((response) => {
			// 	return response;
			// });
			.map((response) => {
				var result: any = response.json();
				alert(JSON.stringify(result));
				return result;
			});
	}

	GetSingleUser() {
		debugger;
		var queryHeaders = new Headers();
		queryHeaders.append('Access-Control-Allow-Origin', '*');
		queryHeaders.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
		queryHeaders.append('Accept', 'application/json');
		queryHeaders.append('Content-Type', 'application/json');

		let options = new RequestOptions({ headers: queryHeaders });
		let url: string;
		url = this.baseResource_Url + '/user/bijay';

		return this.httpService.http
			.get(url, options)
			.map((response) => {
				var result: any = response.json();
				// let bank: BankSetup_Model = BankSetup_Model.fromJson(result); alert("In GetExist" + JSON.stringify(result));
				return result;
			}).catch(this.handleError);
	}

	private handleError(error: any) {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log(errMsg); // log to console instead    
		return Observable.throw(errMsg);
	}
}