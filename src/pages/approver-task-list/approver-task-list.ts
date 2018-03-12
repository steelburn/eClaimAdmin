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
<<<<<<< HEAD
import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view.component';

=======
import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view';
import { EntertainmentClaimViewPage } from '../../pages/entertainment-claim-view/entertainment-claim-view';
import { MedicalClaimViewPage } from '../../pages/medical-claim-view/medical-claim-view';
import { OvertimeClaimViewPage } from '../../pages/overtime-claim-view/overtime-claim-view';
import { PrintClaimViewPage } from '../../pages/print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../../pages/gift-claim-view/gift-claim-view';
>>>>>>> ad3954c9663bf1abb3f47bfbf7b353161c198dbc

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
    // this.claimrefguid = 'd9a3c051-e674-7c5b-81c4-dd9cd2f89b26'
    this.claimrefguid = 'fdadf529-5277-28ef-8298-b176c38d9ebb'
    // this.claimrefguid = 'eb341cca-cf4d-8b69-d66a-b5d01e06a77b'
    // this.claimrefguid = '12fa8f8a-f8b7-82f2-5efb-1dcc39f21391'
    //this.claimrefguid = 'e60dee1f-0460-5f14-c74f-9bbfc04e6877'       
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
    // this.navCtrl.push(TravelClaimViewPage, {
      // this.navCtrl.push(EntertainmentClaimViewPage, {
        // this.navCtrl.push(MedicalClaimViewPage, {
          // this.navCtrl.push(OvertimeClaimViewPage, {
            // this.navCtrl.push(PrintClaimViewPage, {
              this.navCtrl.push(GiftClaimViewPage, {
      cr_GUID: claimRequestGUID,
      level_no: level,
      approver_GUID : localStorage.getItem('g_USER_GUID')
    });
  }

  approveClaims() {

  }

}
