import {Injectable} from '@angular/core';
import {Http, Headers,RequestOptions, URLSearchParams} from '@angular/http';

import * as constants from '../app/config/constants';
//import {EntertainmentClaim_Model} from '../models/entertainment_model';
import {UserInfo_Model} from '../models/usersetup_info_model';
import {UserMain_Model} from '../models/user_main_model';
import {UserContact_Model} from '../models/user_contact_model';
import { UserCompany_Model } from '../models/user_company_model';
import {UserAddress_Model} from '../models/usersetup_address_model';
import { ViewUser_Model } from '../models/viewuser_model';
import {BaseHttpService} from './base-http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { NavController } from 'ionic-angular';

class ServerResponse {
	constructor(public resource: any) {
        
	}
};

@Injectable()

export class UserSetup_Service 
{	
	baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_info';
	baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_main';
	baseResource_Url2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_contact';
	baseResource_Url3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_company';
	baseResource_Url4: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	// baseResourceUrl5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site';
	// baseResource_Url5: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/user_address';
	baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	baseResourceView: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display';
	baseResourceView_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

	public USER_GUID:any;
	
	constructor(private httpService: BaseHttpService, private nav: NavController) {};
	
    private handleError (error: any) {
	   let errMsg = (error.message) ? error.message :
	   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	   console.log(errMsg); // log to console instead
	   //localStorage.setItem('session_token', '');       
	  return Observable.throw(errMsg);
    }
    
    query (params?:URLSearchParams): Observable<UserInfo_Model[]> 
    {       
        //let bank :any;
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let banks: Array<UserInfo_Model> = [];
				
				// result.resource.forEach((bank) => {
				// 	banks.push(BankSetup_Model.fromJson(bank));
				// });  
				return banks;
				
			}).catch(this.handleError);
    };
    
    save_user_info (user_info: UserInfo_Model): Observable<any> 
	{
		alert('hi');
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl1, user_info.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_main (user_main: UserMain_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl2, user_main.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_contact (user_contact: UserContact_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl3, user_contact.toJson(true),options)
			.map((response) => {
				return response;
			});
	}

	save_user_company (user_company: UserCompany_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl4, user_company.toJson(true),options)
			.map((response) => {
				return response;
			});
	}
	
	save_user_address (user_address: UserAddress_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl, user_address.toJson(true),options)
			.map((response) => {
				return response;
			});
	}


	//Edit
	// edit_user_info (user_info: UserInfo_Model): Observable<any> 
	// {
	// 	alert('hi');
	// 	var queryHeaders = new Headers();
    // 	queryHeaders.append('Content-Type', 'application/json');
    // 	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    // 	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
	// 	let options = new RequestOptions({ headers: queryHeaders });
	// 	return this.httpService.http.post(this.baseResourceUrl1, user_info.toJson(true),options)
	// 		.map((response) => {
	// 			return response;
	// 		});
	// }

	edit_user_main (user_main: UserMain_Model): Observable<any> 
	{
		
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		
		let options = new RequestOptions({ headers: queryHeaders });
		console.log(JSON.stringify(user_main));
		return this.httpService.http.patch(this.baseResourceUrl2, user_main.toJson(true),options)
		
			.map((response) => {
				//console.log(this.baseResourceUrl2);
				alert('cpmpl');
				return response;
			});
	}

	edit_user_info (user_info: UserInfo_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		
		let options = new RequestOptions({ headers: queryHeaders });
		console.log(JSON.stringify(user_info));
		return this.httpService.http.patch(this.baseResourceUrl1, user_info.toJson(true),options)
		
			.map((response) => {
				//console.log(this.baseResourceUrl2);
				alert('cpmpl');
				return response;
			});
	}

	edit_user_contact (user_contact: UserContact_Model): Observable<any> 
	{
		alert('step1');
		var queryHeaders = new Headers();
		queryHeaders.append('Content-Type', 'application/json');
		alert('step2');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		alert('step3');
		let options = new RequestOptions({ headers: queryHeaders });
		alert('step4');
		console.log(JSON.stringify(user_contact));
		return this.httpService.http.patch(this.baseResourceUrl3, user_contact.toJson(true),options)
		
			.map((response) => {
				//console.log(this.baseResourceUrl2);
				alert('cpmpl');
				alert('hey');
				return response;
			});
	}

	// edit_user_contact (user_contact: UserContact_Model): Observable<any> 
	// {
	// 	var queryHeaders = new Headers();
    // 	queryHeaders.append('Content-Type', 'application/json');
    // 	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    // 	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
	// 	let options = new RequestOptions({ headers: queryHeaders });
	// 	return this.httpService.http.post(this.baseResourceUrl3, user_contact.toJson(true),options)
	// 		.map((response) => {
	// 			return response;
	// 		});
	// }

	edit_user_company (user_company: UserCompany_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.post(this.baseResourceUrl4, user_company.toJson(true),options)
			.map((response) => {
				return response;
			});
	}
	
	edit_user_address (user_address: UserAddress_Model): Observable<any> 
	{
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		let options = new RequestOptions({ headers: queryHeaders });
		return this.httpService.http.patch(this.baseResourceUrl, user_address.toJson(true),options)
			.map((response) => {
				return response;
			});
	} 



	// tenant_user_company (tenant_company: UserCompany_Model): Observable<any> 
	// {
	// 	var queryHeaders = new Headers();
    // 	queryHeaders.append('Content-Type', 'application/json');
    // 	//queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    // 	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
	// 	let options = new RequestOptions({ headers: queryHeaders });
	// 	return this.httpService.http.post(this.baseResourceUrl5, tenant_company.toJson(true),options)
	// 		.map((response) => {
	// 			return response;
	// 		});
	// }


	// get_info(params?: URLSearchParams): Observable<UserInfo_Model[]> {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .get(this.baseResource_Url1, { search: params, headers: queryHeaders })
    //         .map((response) => {
    //             var result: any = response.json();
    //             let users: Array<UserInfo_Model> = [];

    //             // result.resource.forEach((branches) => {
    //             //  	branches.push(BranchSetup_Model.fromJson(branch));
	// 			//  });
	// 			console.table(result)
    //             return users;
    //         }).catch(this.handleError);
	// };
	

	// get_main(params?: URLSearchParams): Observable<UserMain_Model[]> {
    //     var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
    //     //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    //     return this.httpService.http
    //         .get(this.baseResourceUrl2, { search: params, headers: queryHeaders })
    //         .map((response) => {
    //             var result: any = response.json();
    //             let users: Array<UserMain_Model> = [];

    //             // result.resource.forEach((branches) => {
    //             //  	branches.push(BranchSetup_Model.fromJson(branch));
	// 			//  });
	// 			console.table(result)
    //             return users;
    //         }).catch(this.handleError);
	// };
	
	//'use strict';
	//'use strict';
	// get(id: string, params?: URLSearchParams): Observable<ViewUser_Model> {  
		
	// 	let url = this.baseResourceView + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY; 
	// 	//alert(url);
	// 	//console.log(url);
	// 	var queryHeaders = new Headers();
    //     queryHeaders.append('Content-Type', 'application/json');
	// 	 let options = new RequestOptions({ headers: queryHeaders });
		
	// 	return this.httpService.http
	// 	.get(url)
    //         .map((response) => {
	// 			//var result: any = JSON.stringify(response);;
	// 			var result: any = response.json();
	// 			// alert('hi');
	// 			//JSON.stringify(response);
	// 			// let x=JSON.parse(result);
	// 			//  console.log(x["name"]);
	// 			// //alert(JSON.stringify(result));
				
	// 			// let name=JSON.parse(result['name']).results;
	// 			// alert(name);
	// 			// let viewuser: ViewUser_Model = ViewUser_Model.fromJson(x);
	// 			// alert(JSON.stringify(viewuser));
	// 			//console.log(viewuser["name"]);
	// 			// console.log(UserInfo_Model.length);
	// 			 //return viewuser;
	// 			// //console.log('');
	// 			console.log(result);
	// 			return result;
				
    //         }).catch(this.handleError);
	// }



// 	get(id: string, params?: URLSearchParams): Observable<ViewUser_Model> { 
// 		//alert('service edit function');       
// 		//alert(id);  
//         var queryHeaders = new Headers();
//         queryHeaders.append('Content-Type', 'application/json');
//         //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
// 		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
// 		//let url = this.baseResourceView + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY; 
// //alert(id);
//         return this.httpService.http
//             .get(this.baseResourceView +  "?filter=(USER_GUID=" + id+ ')&api_key=' + constants.DREAMFACTORY_API_KEY , { search: params, headers: queryHeaders })
//             .map((response) => {
// 				// var result: any = response.json();
// 				var result: any = response.json();
// 				console.log(result);
// 				// for (var i = 0, len = result.length; i < len; i++) {
// 				// 	let x=result[i].name; 
// 				// 	alert(x);
// 				// 	}
// 				// let z=JSON.parse(<string>result);
// 				// let x=JSON.stringify(result);
// 				// let y=JSON.parse(x)
// 				// console.log(y);
// 				//console.log(x);
// 				let viewtype: ViewUser_Model = ViewUser_Model.fromJson(result);
// 				 console.log(viewtype);
//                 return result;
//             }).catch(this.handleError);
// 	};


	get(id: string, params?: URLSearchParams): Observable<UserAddress_Model> { 
		 alert('stating of service');
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
       
		queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		//let url = this.baseResourceView + "?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY; 
//alert(id);
        return this.httpService.http
			.get(this.baseResourceUrl +  "?filter=(USER_GUID=" + id+ ')&api_key=' + constants.DREAMFACTORY_API_KEY , { search: params, headers: queryHeaders })
			// .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
            .map((response) => {
				
				var result: any = response.json();
				console.log(result);
				alert(this.baseResourceUrl);
				let viewtype: UserAddress_Model = UserAddress_Model.fromJson(result);
				 console.log(viewtype);
				 alert(JSON.stringify(viewtype));
				 alert('end of service');
				return viewtype;
				
			}).catch(this.handleError);
			
	};



	
// 	get2(id: string, params?: URLSearchParams): Observable<UserAddress_Model> { 
// 		alert('service edit function');       
//         var queryHeaders = new Headers();
//         queryHeaders.append('Content-Type', 'application/json');
//         //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
//         queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
// //alert(id);
//         return this.httpService.http
//             .get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders })
//             .map((response) => {
//                 var result: any = response.json();
//                 let viewtype: UserAddress_Model = UserAddress_Model.fromJson(result);
//                 return viewtype;
//             }).catch(this.handleError);
//     };



get_bijay (id: string): Observable<ViewUser_Model> {
	var queryHeaders = new Headers();
	queryHeaders.append('Content-Type', 'application/json');
	//queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
	
	return this.httpService.http
		//.get(this.baseResourceUrl + '/' + id, { search: params, headers: queryHeaders})
		.get(this.baseResourceView +  "?filter=(USER_GUID=" + id+ ')&api_key=' + constants.DREAMFACTORY_API_KEY , { headers: queryHeaders })
		.map((response) => {			
			var result: any = response.json();
			let user: ViewUser_Model = ViewUser_Model.fromJson(result);
			//alert(JSON.stringify(user)); 
			return user; 
		}).catch(this.handleError);	
};
}
