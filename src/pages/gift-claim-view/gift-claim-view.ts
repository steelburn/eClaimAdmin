import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Services } from '../Services';
import * as constants from '../../config/constants';
import { ClaimWorkFlowHistoryModel } from '../../models/claim-work-flow-history.model';
import {TravelclaimPage} from '../../pages/travelclaim/travelclaim';
import {EntertainmentclaimPage} from '../../pages/entertainmentclaim/entertainmentclaim';
import {GiftclaimPage} from '../../pages/giftclaim/giftclaim';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';

@IonicPage()
@Component({
  selector: 'page-gift-claim-view',
  templateUrl: 'gift-claim-view.html',
})
export class GiftClaimViewPage {

  totalClaimAmount:number=0;
  claimRequestData: any[];
  Remarks_NgModel: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Approver_GUID: any;
  isApprover: any;

  isRemarksAccepted: boolean =false;
  level: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {    
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
    this.LoadMainClaim();
  }

  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        if (element.ATTACHMENT_ID !== null)
        element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
      });
    })
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

  EditClaim() {
    this.navCtrl.push(GiftclaimPage, {
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
