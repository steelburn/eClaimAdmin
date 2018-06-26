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
        debugger;
        let url: string = this.baseResource_Url + '/user/bijay/authenticate';
        var queryHeaders = new Headers();
		
		// queryHeaders.append("Access-Control-Allow-Origin", "*");
		// queryHeaders.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept");
		queryHeaders.append('Content-Type', 'application/json');
		
		let options = new RequestOptions({ headers: queryHeaders });
        //user_main.toJson(true)
        return this.httpService.http.post(url,{"password": "bijay234"}, options)
			.map((response) => {
				return response;
			});
	}
}