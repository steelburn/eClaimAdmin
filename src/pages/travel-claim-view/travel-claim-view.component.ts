import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Services } from '../Services';
import * as constants from '../../config/constants';
import { ClaimWorkFlowHistoryModel } from '../../models/claim-work-flow-history.model';
import {TravelclaimPage} from '../../pages/travel-claim/travel-claim.component';
import { UUID } from 'angular2-uuid';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';

@IonicPage()
@Component({
  selector: 'page-travel-claim-view',
  templateUrl: 'travel-claim-view.html',
})
export class TravelClaimViewPage {
  totalClaimAmount:number=0;
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
  // totalAmount: number = 0;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public api1: Services, public http: Http, platform: Platform, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.isApprover = this.navParams.get("isApprover");
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    this.level = this.navParams.get('level_no');
    // this.translateToEnglish();
    // this.translate.setDefaultLang('en'); //Fallback language  

    this.LoadMainClaim();
  }

  isAccepted(val: string) {
    this.isRemarksAccepted = val === 'accepted' ? true : false;
    if (!this.isRemarksAccepted) {
          if (this.Remarks_NgModel === undefined) {
            alert('Please input valid remarks');
            return;
          }
        }
        this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
      
    // alert('Claim ' + val)
  }

  // isAccepted(val:string) {   
  //   this.isRemarksAccepted = val==='Accepted'?true:false;
  //   alert('Claim '+val)
  // }

  // SubmitAction() {

  //   if (!this.isRemarksAccepted) {
  //     if (this.Remarks_NgModel === undefined) {
  //       alert('Please input valid Remarks');
  //       return;
  //     }

  //   }
  //   this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
  // }

  // isAccepted(event: any) {
  //   if (event.checked) {
  //     this.ToggleNgModel = true
  //   }
  // }

  // emailUrl: string = 'http://api.zen.com.my/api/v2/emailnotificationtest?api_key=' + constants.DREAMFACTORY_API_KEY;

  // sendEmail() {
  //   let name: string; let email: string
  //   name = 'shabbeer'; email = 'shabbeer@zen.com.my'
  //   var queryHeaders = new Headers();
  //   queryHeaders.append('Content-Type', 'application/json');
  //   queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
  //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //   let options = new RequestOptions({ headers: queryHeaders });

  //   let body = {
  //     "template": "",
  //     "template_id": 0,
  //     "to": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "cc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "bcc": [
  //       {
  //         "name": name,
  //         "email": email
  //       }
  //     ],
  //     "subject": "Test",
  //     "body_text": "",
  //     "body_html": '<HTML><HEAD> <META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD> <BODY> <DIV style="FONT-FAMILY: Century Gothic"> <DIV style="MIN-WIDTH: 500px"><BR> <DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV> <DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"> <DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR> <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear [%Variable: @Employee%]<BR><BR>Your&nbsp;[%Variable: @LeaveType%] application has been forwarded to your superior for approval.  <H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Leave Details :</B><BR></H1> <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto"> <TBODY> <TR> <TD style="TEXT-ALIGN: left">EMPLOYEE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @Employee%]</TD></TR> <TR> <TD>START DATE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @StartDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">END DATE </TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @EndDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">APPLIED DATE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @AppliedDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">DAYS</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left">[%Variable: @NoOfDays%] </TD> <TD style="TEXT-ALIGN: left">[%Variable: @HalfDay%]</TD></TR></TR> <TR> <TD>LEAVE TYPE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @LeaveType%]</TD></TR> <TR> <TD style="TEXT-ALIG: left">REASON</TD> <TD>: </TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Current Item:Reason%]</TD></TR></TBODY></TABLE><BR> <DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
  //     "from_name": "Ajay DAV",
  //     "from_email": "ajay1591ani@gmail.com",
  //     "reply_to_name": "",
  //     "reply_to_email": ""
  //   };
  //   this.http.post(this.emailUrl, body, options)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       // this.result= data["resource"];
  //       alert(JSON.stringify(data));
  //     });
  // }

  // SubmitAction() {
  //   if (this.ToggleNgModel) {
  //     // || this.Remarks_NgModel.toString().length < 25
  //     let claimHistoryRef: ClaimWorkFlowHistory_Model = new ClaimWorkFlowHistory_Model();
  //     claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
  //     claimHistoryRef.CLAIM_REQUEST_GUID = this.claimRequestGUID;
  //     claimHistoryRef.REMARKS = this.Remarks_NgModel;
  //     claimHistoryRef.STATUS = 'Pending';
  //     claimHistoryRef.USER_GUID = this.Approver_GUID;
  //     console.table(claimHistoryRef);     
  //     this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
  //       var postClaimMain = response.json();
  //       this.sendEmail();
  //       // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
  //       // this.MainClaimSaved = true;
  //       alert('History Saved.')
  //     })

  //   }
  //   else {
  //     if (this.Remarks_NgModel === undefined) {
  //       alert('Please input valid Remarks');
  //     }
  //     let claimHistoryRef: ClaimWorkFlowHistory_Model = new ClaimWorkFlowHistory_Model();
  //     claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
  //     claimHistoryRef.CLAIM_REQUEST_GUID = this.claimRequestGUID;
  //     claimHistoryRef.REMARKS = this.Remarks_NgModel;
  //     claimHistoryRef.STATUS = 'Pending';
  //     claimHistoryRef.USER_GUID = this.Approver_GUID;
  //     console.table(claimHistoryRef)
  //     this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
  //       var postClaimMain = response.json();
  //       this.sendEmail();
  //       // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
  //       // this.MainClaimSaved = true;
  //       alert('History Saved.')
  //     })
  //   }
  // }

  // TollParkLookup() {
  //   this.tollParkLookupClicked = true;
  // }

  LoadMainClaim() {
    this.LoadClaimDetails();
    console.log(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
    this.http
      .get(Services.getUrl('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.claimRequestData = data["resource"];
        this.claimRequestData.forEach(element => {
          element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          this.totalClaimAmount = element.MILEAGE_AMOUNT + element.Allowance;
          console.log(this.totalClaimAmount)
        }); 
        this.totalClaimAmount += this.tollParkAmount ;
      }
      );
  }

  LoadClaimDetails() {
    this.http
      .get(Services.getUrl('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.claimDetailsData = data["resource"];

    this.claimDetailsData.forEach(element => {
      if (element.ATTACHMENT_ID !== null)
          element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
      this.tollParkAmount += element.AMOUNT;
    });   

      }
      );
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
  CloseDisplayImage() {
    this.displayImage = false;
  }

  imageURL: string;
  DisplayImage(val: any) {
    this.displayImage = true;
    this.imageURL = val;
  }

  //---------------------Language module start---------------------//
  // public translateToMalayClicked: boolean = false;
  // public translateToEnglishClicked: boolean = true;

  // public translateToEnglish() {
  //   this.translate.use('en');
  //   this.translateToMalayClicked = !this.translateToMalayClicked;
  //   this.translateToEnglishClicked = !this.translateToEnglishClicked;
  // }

  // public translateToMalay() {
  //   this.translate.use('ms');
  //   this.translateToEnglishClicked = !this.translateToEnglishClicked;
  //   this.translateToMalayClicked = !this.translateToMalayClicked;
  // } 

}
