import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { Services } from '../Services';
import { TravelclaimPage } from '../travel-claim/travel-claim.component';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';

@IonicPage()
@Component({
  selector: 'page-travel-claim-view',
  templateUrl: 'travel-claim-view.html',
})
export class TravelClaimViewPage {
  totalClaimAmount: number = 0;
  claimRequestData: any[];
  claimDetailsData: any[];
  tollParkLookupClicked = false;
  tollParkAmount: number = 0;
  claimRequestGUID: any;
  Remarks_NgModel: any;
  ToggleNgModel: any; Approver_GUID: any;
  isApprover: any;
  isRemarksAccepted: boolean = false;
  level: any;
  approverDesignation: any;
  // totalAmount: number = 0;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = this.navParams.get('level_no');
    this.LoadMainClaim();
    this.approverDesignation = this.navParams.get("approverDesignation");
  }

  isAccepted(val: string) {
    this.isRemarksAccepted = val === 'accepted' ? true : false;
    if (!this.isRemarksAccepted) {
      if (this.Remarks_NgModel === undefined) {
        alert('Please enter valid remarks');
        return;
      }
    }
    this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted, 1);
  }

  imageURL: any;
  isImage: boolean = false;
  TravelType: any;
  LoadMainClaim() {
    let claimResult = this.LoadClaimDetails();
    claimResult.then((tollorParkAmount: number) => {
      this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimRequestData = res['resource'];
        this.claimRequestData.forEach(element => {

          element.START_TS = new Date(element.START_TS.replace(/-/g, "/"))
          element.CREATION_TS = new Date(element.CREATION_TS.replace(/-/g, "/"))
          element.END_TS = new Date(element.END_TS.replace(/-/g, "/"))
          if (element.ATTACHMENT_ID !== null) {
            this.imageURL = this.api.getImageUrl(element.ATTACHMENT_ID);
          }
          this.TravelType = element.TRAVEL_TYPE === '0' ? 'Local' : 'Outstation';
          this.totalClaimAmount = element.CLAIM_AMOUNT;
        });
        //  this.totalClaimAmount += tollorParkAmount;
      })
    })
  }

  LoadClaimDetails() {
    return new Promise((resolve) => {
      this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimDetailsData = res['resource'];
        this.claimDetailsData.forEach(element => {
          if (element.ATTACHMENT_ID !== null) {
            element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          }
          this.tollParkAmount += element.AMOUNT;
        });
        resolve(this.tollParkAmount);
      })
    });
  }

  EditClaim() {
    this.navCtrl.push(TravelclaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }

  CloseTollParkLookup() {
    this.tollParkLookupClicked = false;
  }

  TollParkLookup() {
    this.tollParkLookupClicked = true;
    this.LoadClaimDetails();
    this.tollParkAmount = 0;
  }

  displayImage: any
  // CloseDisplayImage() {
  //   this.displayImage = false;
  // }

  // imageURL: string;
  // DisplayImage(val: any) {
  //   this.displayImage = true;
  //   this.imageURL = val;
  //   if (val !== null) { 
  //     this.imageURL = this.api.getImageUrl(val); 
  //     this.displayImage = true; 
  //     this.isImage = this.api.isFileImage(val); 
  //   }
  // }


  isImageUrl: boolean = true;
  CheckAttachment() {
    this.isImageUrl = true;
  }
}
