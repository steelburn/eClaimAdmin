import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
//import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
//import { ClaimHistory_Model } from '../../models/ClaimHistory_Model';
import { ClaimhistorydetailPage } from '../claimhistorydetail/claimhistorydetail';
import { ResourceLoader } from '@angular/compiler';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';

// import { Observable } from 'rxjs/Observable';
// import { Subject }    from 'rxjs/Subject';
// import { of }         from 'rxjs/observable/of';

// import {
//    debounceTime, distinctUntilChanged, switchMap
//  } from 'rxjs/operators';
// import { Response } from '@angular/http/src/static_response';


/**
 * Generated class for the ClaimhistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimhistory',
  templateUrl: 'claimhistory.html', providers: [BaseHttpService]
})
export class ClaimhistoryPage {
  searchboxValue: string;
  claimhistorys: any[];
  claimhistorys1: any[];

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(TENANT_COMPANY_SITE_GUID=' + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService) {
    this.BindData();
  }

  BindData() {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorys1 = data["resource"];
        this.claimhistorys = this.claimhistorys1;
      });
  }

  onSearchInput(ev: any) {
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimhistorys = this.claimhistorys1.filter((item) => {
        return ((item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) > -1)
          || (item.DEPARTMENT.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
          || (item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)
          );
      })
    }
    else {
      this.claimhistorys = this.claimhistorys1
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistoryPage');
  }


  goToClaimHistoryDetail(claimrefguid: any, userguid: any, month: any) {
    this.navCtrl.push(ClaimhistorydetailPage, {
      claimRefGuid: claimrefguid,
      userGuid: userguid,
      Month: month
    })
  }




  //   goToEmailTest(){
  //     var queryHeaders = new Headers();
  //     queryHeaders.append('Content-Type', 'application/json');
  //     queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
  //     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //     let options = new RequestOptions({ headers: queryHeaders });

  // let body = {
  //   "template": "",           
  //   "template_id": 0,        
  //   "to": [
  //     {
  //       "name": "ajay varma",
  //       "email": "ajayvarma403@gmail.com"
  //     }
  //   ],
  //   "cc": [
  //     {
  //       "name": "fdf",
  //       "email": "ajayvarma403@gmail.com"
  //     }
  //   ],
  //   "bcc": [
  //     {
  //       "name": "asd",
  //       "email": "ajayvarma403@gmail.com"
  //     }
  //   ],
  //   "subject": "Test",
  //   "body_text": "",
  //   "body_html": "",
  //   "from_name": "Ajay DAV",
  //   "from_email": "ajay1591ani@gmail.com",
  //   "reply_to_name": "",
  //   "reply_to_email": ""
  //       };

  // this.http.post(this.emailUrl, body,options)
  // .map(res => res.json())
  // .subscribe(data => {
  //  // this.result= data["resource"];
  //   alert(JSON.stringify(data));
  // });

  // }    

}
