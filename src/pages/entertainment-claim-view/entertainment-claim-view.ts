import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Services } from '../Services';
import * as constants from '../../config/constants';
import { ClaimWorkFlowHistoryModel } from '../../models/claim-work-flow-history.model';
import {EntertainmentclaimPage} from '../../pages/entertainmentclaim/entertainmentclaim';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { ExcelService } from '../../providers/excel.service';



@IonicPage()
@Component({
  selector: 'page-entertainment-claim-view',
  templateUrl: 'entertainment-claim-view.html', providers: [ExcelService]
})
export class EntertainmentClaimViewPage {

  totalClaimAmount:number=0; 
  claimRequestData: any[];
  Remarks_NgModel: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Approver_GUID: any;
  isApprover: any;
  //isRemarksAccepted: boolean =false;
  isRemarksAccepted: any;
  level: any;
  approverDesignation: any;

  constructor(private excelService: ExcelService, public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
  
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = navParams.get('level_no');
    this.approverDesignation = this.navParams.get("approverDesignation");

    this.LoadMainClaim();
  }

  // isAccepted(val:string) {   
  //   this.isRemarksAccepted = val==='Accepted'?true:false;
  //   alert('Claim '+val)
  // } 

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

// SubmitAction() {
//   if (!this.isRemarksAccepted) {
//     if (this.Remarks_NgModel === undefined) {
//       alert('Please input valid Remarks');
//       return;
//     }
//   }
//   this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
// }

EditClaim() {
  this.navCtrl.push(EntertainmentclaimPage, {
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

// ExcelData: any[] = [];
// ExportToExcel(evt: any) {
//   // this.excelService.exportAsExcelFile(this.userClaimhistorydetails, 'Data');
//   this.excelService.saveFile("", 'Data');    
// }
}
