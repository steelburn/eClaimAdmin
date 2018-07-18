import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Services } from '../Services';
import * as constants from '../../config/constants';
import { ClaimWorkFlowHistoryModel } from '../../models/claim-work-flow-history.model';
import {TravelclaimPage} from '../../pages/travelclaim/travelclaim';
import {MedicalclaimPage} from '../../pages/medicalclaim/medicalclaim';
import {PrintclaimPage} from '../../pages/printclaim/printclaim';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';


@IonicPage()
@Component({
  selector: 'page-print-claim-view',
  templateUrl: 'print-claim-view.html',
})
export class PrintClaimViewPage {
  totalClaimAmount:number=0;
  claimRequestData: any[];
  Remarks_NgModel: any;
  ToggleNgModel: any;
  claimRequestGUID: any;
  Approver_GUID: any;
  isApprover: any;

  level: any;
  isRemarksAccepted: boolean =false;
  approverDesignation: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {   
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');  
    this.approverDesignation = this.navParams.get("approverDesignation");

    this.LoadMainClaim();
  } 

  isAccepted(val: string) {
    this.isRemarksAccepted = val === 'accepted' ? true : false;
    if (!this.isRemarksAccepted) {
          if (this.Remarks_NgModel === undefined) {
            alert('Please enter valid remarks');
            return;
          }
        }
        this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted,1);     
  }

  stringToSplit: string = "";
  tempUserSplit1: string = "";
  tempUserSplit2: string = "";
  tempUserSplit3: string = "";

  isImage: boolean = false;
  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        if (element.ATTACHMENT_ID !== null){
          this.stringToSplit = element.ATTACHMENT_ID ;
          this.tempUserSplit1 = this.stringToSplit.split(".")[0];
          this.tempUserSplit2 = this.stringToSplit.split(".")[1];
          this.tempUserSplit3 = this.stringToSplit.split(".")[2];
          if(this.tempUserSplit3=="jpeg" ||this.tempUserSplit3=="jpg" ||this.tempUserSplit3=="png")
          this.isImage = true
          else {
            this.isImage = false
          }
          element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);

        }
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
      });
    })
}

EditClaim() {
  this.navCtrl.push(PrintclaimPage, {
    isFormEdit: 'true',
    cr_GUID: this.claimRequestGUID
  });
}

displayImage: any
CloseDisplayImage()  {
  this.displayImage = false;
}
imageURL: string;
DisplayImage(val: any) {
  this.displayImage = true;
  this.imageURL = val;
}

}
