import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../config/constants';
// import { BaseHttpService } from '../../services/base-http';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';
import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view';


@IonicPage()
@Component({
  selector: 'page-approver-task-list',
  templateUrl: 'approver-task-list.html',
})
export class ApproverTaskListPage {
  baseResourceUrl: string;
  claimrequestdetails: any;
  selectAll: boolean;
  claimrefguid: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.claimrefguid = 'e60dee1f-0460-5f14-c74f-9bbfc04e6877'
    //this.claimrefguid ='8254ea7a-e64f-a2f5-4d4c-7225de2d3559'
     //this.claimrefguid =navParams.get("claimRefGuid");
    if (this.claimrefguid != 'null') {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + '/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = data["resource"]; 
        console.table(this.claimrequestdetails);      
      });
  }

  checkAllCheckBoxes(event: Checkbox) {
    if (event.checked) { this.selectAll = true; }
    else {
      this.selectAll = false;
    }


  }

  getCheckboxValue(event: Checkbox, claimRequestGuid: any) {
    // console.log(event);
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);
  }

  viewClaim(claimRequestGUID: string,level:number) {
    console.log(claimRequestGUID)
    this.navCtrl.push(TravelClaimViewPage, {
      cr_GUID: claimRequestGUID,
      level_no: level,
      approver_GUID : localStorage.getItem('g_USER_GUID')
    });
  }

  approveClaims() {

  }

}
