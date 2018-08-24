import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { ApiManagerProvider } from './api-manager.provider';
import { ClaimWorkFlowHistoryModel } from '../models/claim-work-flow-history.model';
import { MainClaimRequestModel } from '../models/main-claim-request.model';
import { MainClaimReferanceModel } from '../models/main-claim-ref.model';
import { UUID } from 'angular2-uuid';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { App } from 'ionic-angular';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist';
import moment from 'moment';



@Injectable()

export class ProfileManagerProvider {
  managerInfo: any[];
  levels: any[];
  userGUID: any; TenantGUID: any; previousLevel: number; previousAssignedTo: string; previousStage: string; level: any;
  mainClaimReq: MainClaimRequestModel; claimRequestGUID: any; isRemarksAccepted: any;

  navCtrl: any;
  constructor(public http: Http, public api: ApiManagerProvider, app: App) {
    this.navCtrl = app.getActiveNav()
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.userGUID = localStorage.getItem('g_USER_GUID');
  }

  profileLevel: any; assignedTo: any; stage: any;

  checkMultipleLength: number;
  checkCount: number;


  UpdateProfileInfo(mainClaimReq: MainClaimRequestModel) {
    //debugger;
    this.api.updateClaimRequest(mainClaimReq).subscribe(() => {
      this.checkCount++;
      //  if(this.checkMultipleLength===1)
      //  {
      if (mainClaimReq.STATUS === 'Rejected')
        alert('Claim has been ' + mainClaimReq.STATUS + '.');
      else
        alert('Claim has been Approved.');
      // alert('Claim has been '+mainClaimReq.STATUS+'.');
      this.navCtrl.pop();
    });
  }

  UpdateProfileInfoForMultiple(mainClaimReq: MainClaimRequestModel) {
    //debugger;
    this.api.updateClaimRequest(mainClaimReq).subscribe(() => { });
  }


  getMainClaimReqInfo(claimRef: ClaimWorkFlowHistoryModel, level: any, claimRequestGUID: any, isRemarksAccepted: any) {
    this.level = level;
    this.claimRequestGUID = claimRequestGUID;
    this.isRemarksAccepted = isRemarksAccepted;
    //this.userGUID = localStorage.getItem('g_USER_GUID');

    this.api.getClaimRequestByClaimReqGUID(this.claimRequestGUID).subscribe(data => {
      claimRef.ASSIGNED_TO = this.previousAssignedTo = data[0].ASSIGNED_TO;
      claimRef.PROFILE_LEVEL = this.previousLevel = data[0].PROFILE_LEVEL;
      this.previousStage = data[0].STAGE;
      // data[0].STAGE = this.stage;
      // data[0].ASSIGNED_TO = this.assignedTo;
      // data[0].PROFILE_LEVEL = this.level;
      // if (this.level === '-1')
      //   data[0].STATUS = 'Approved';
      // else if (this.level === '0' || this.isRemarksAccepted === false)
      //   data[0].STATUS = 'Rejected';

      this.mainClaimReq = data[0];

      this.SaveWorkFlow(claimRef, data[0].PROFILE_JSON, level);
      //this.processProfileJSON(data[0].PROFILE_JSON)
    })
  }

  GetDirectManagerByManagerGUID() {
    return new Promise((resolve) => {
      this.api.getApiModel('user_info', 'filter=USER_GUID=' + this.assignedTo).subscribe(res => {
        this.managerInfo = res["resource"]
        this.managerInfo.forEach(userElm => {
          this.stage = userElm.DEPT_GUID;
          if (this.isRequester) {
            this.proceedNext();
          }
        })
      })
      resolve(true);
    })
  }

  GetDirectManager() {
    this.userGUID = localStorage.getItem('g_USER_GUID');

    return new Promise((resolve) => {
      this.api.getApiModel('view_manager_details', 'filter=USER_GUID=' + this.userGUID).subscribe(res => {
        this.managerInfo = res["resource"]
        this.managerInfo.forEach(userElm => {
          this.assignedTo = userElm.MANAGER_GUID;
          this.stage = userElm.MANAGER_DEPT_GUID;
          localStorage.setItem('edit_superior', this.assignedTo)
          localStorage.setItem('edit_stage', this.stage)
          if (this.isRequester) {
            this.proceedNext();
          }
        })
      })
      resolve(true);
    })
  }

  proceedNext() {
    this.isRequester = false;
    let month = new Date(this.formValues.travel_date).getMonth() + 1;
    let year = new Date(this.formValues.travel_date).getFullYear(); this.api.getApiModel('main_claim_ref', 'filter=(USER_GUID=' + this.userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')')
      .subscribe(claimRefdata => {
        if (claimRefdata["resource"][0] == null) {
          this.saveClaimRef(month, year);
        }
        else {
          let claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;
          this.SaveClaim(claimRefGUID);
        }
      })
  }




  SaveWorkFlow(claimRef: ClaimWorkFlowHistoryModel, profile_Json: any, level: any) {

    this.api.postData('claim_work_flow_history', claimRef.toJson(true)).subscribe((response) => {
      //this.api.sendEmail();
    })
    this.processProfileJSON(profile_Json, level)
    this.mainClaimReq.STAGE = this.stage;
    this.mainClaimReq.ASSIGNED_TO = this.assignedTo;
    this.mainClaimReq.PROFILE_LEVEL = this.level;
    this.mainClaimReq.UPDATE_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    // if (this.level === '-1')
    //   this.mainClaimReq.STATUS = 'Paid';
    if (this.level === '-1') {
      this.mainClaimReq.STATUS = 'Paid';
      this.mainClaimReq.ASSIGNED_TO = this.previousAssignedTo;
      this.mainClaimReq.STAGE = this.previousStage;
    }
    // else  if (this.level === '3')
    //   this.mainClaimReq.STATUS = 'Approved';
    // else if (this.level === '0' || this.isRemarksAccepted === false) {

    //   this.mainClaimReq.STATUS = 'Rejected';
    //   this.mainClaimReq.PROFILE_LEVEL = 0;
    //   this.mainClaimReq.STAGE = null;
    //   this.mainClaimReq.ASSIGNED_TO = null;
    // }
    if (this.level === '3')
      this.mainClaimReq.STATUS = 'Approved';
    if (this.level === '0' || this.isRemarksAccepted === false) {
      this.mainClaimReq.STATUS = 'Rejected';
      this.mainClaimReq.ASSIGNED_TO = this.previousAssignedTo;
      this.mainClaimReq.STAGE = this.previousStage;
      this.mainClaimReq.PROFILE_LEVEL = 0;
    }
    if (this.checkMultipleLength === 1)
      this.UpdateProfileInfo(this.mainClaimReq);
    else
      this.UpdateProfileInfoForMultiple(this.mainClaimReq);
    //alert('Claim action submitted successfully.')

    // This is for Approval Send email to User and next approver
    // this.api.EmailNextApprover(this.mainClaimReq.CLAIM_REQUEST_GUID, this.mainClaimReq.ASSIGNED_TO, claimRef.STATUS, this.level);
    
    // if(this.mainClaimReq.STATUS == 'Rejected'){
    //   this.api.EmailNextApprover_New(this.mainClaimReq.CLAIM_REQUEST_GUID);
    // }
    
    //If approver approve or reject applier will get the mail notification--------------
    this.api.EmailNextApprover_New(this.mainClaimReq.CLAIM_REQUEST_GUID);
  }

  // SaveWorkFlow(claimRef: ClaimWorkFlowHistoryModel, profile_Json: any, level: any) {

  //   this.api.postData('claim_work_flow_history', claimRef.toJson(true)).subscribe((response) => {
  //     //this.api.sendEmail();
  //   })
  //   this.processProfileJSON(profile_Json, level)
  //   this.mainClaimReq.STAGE = this.stage;
  //   this.mainClaimReq.ASSIGNED_TO = this.assignedTo;
  //   this.mainClaimReq.PROFILE_LEVEL = this.level;
  //   this.mainClaimReq.UPDATE_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
  //   if (this.level === 2)
  //     this.mainClaimReq.STAGE = 'Finance';
  //   if (this.level === '-1') {
  //     this.mainClaimReq.STATUS = 'Paid';
  //     this.mainClaimReq.ASSIGNED_TO = this.previousAssignedTo;
  //     this.mainClaimReq.STAGE = this.previousStage;
  //   }
  //   if (this.level === '3') {
  //     this.mainClaimReq.STATUS = 'Approved';
  //     this.mainClaimReq.STAGE = 'Finance';
  //   }

  //   if (this.level === '0' || this.isRemarksAccepted === false) {
  //     this.mainClaimReq.STATUS = 'Rejected';
  //     this.mainClaimReq.ASSIGNED_TO = this.previousAssignedTo;
  //     //  this.mainClaimReq.STAGE = this.previousStage;
  //     this.mainClaimReq.PROFILE_LEVEL = 0;
  //   }   
   
  //   if (this.checkMultipleLength === 1)
  //     this.UpdateProfileInfo(this.mainClaimReq);
  //   else
  //     this.UpdateProfileInfoForMultiple(this.mainClaimReq);
  //   //alert('Claim action submitted successfully.')

  //   // This is for Approval Send email to User and next approver
  //   // this.api.EmailNextApprover(this.mainClaimReq.CLAIM_REQUEST_GUID, this.mainClaimReq.ASSIGNED_TO, claimRef.STATUS, this.level);
    
  //   if(this.mainClaimReq.STATUS == 'Rejected'){
  //     this.api.EmailNextApprover_New(this.mainClaimReq.CLAIM_REQUEST_GUID);
  //   }
  // }

  ProcessProfileMng(remarks: any, approverGUID: any, level: any, claimRequestGUID: any, isRemarksAccepted: any, checkBoxLength: number) {
    //debugger
    this.checkMultipleLength = checkBoxLength;
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.userGUID = localStorage.getItem('g_USER_GUID');

    let claimHistoryRef: ClaimWorkFlowHistoryModel = new ClaimWorkFlowHistoryModel();
    claimHistoryRef.CLAIM_WFH_GUID = UUID.UUID();
    claimHistoryRef.CLAIM_REQUEST_GUID = claimRequestGUID;
    claimHistoryRef.REMARKS = remarks;
    claimHistoryRef.STATUS = isRemarksAccepted ? 'Approved' : 'Rejected';
    claimHistoryRef.USER_GUID = approverGUID;
    claimHistoryRef.CREATION_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    claimHistoryRef.UPDATE_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');

    this.getMainClaimReqInfo(claimHistoryRef, level, claimRequestGUID, isRemarksAccepted);
    // this.readProfile(level, claimRequestGUID, isRemarksAccepted) ;
    // claimHistoryRef.ASSIGNED_TO = this.previousAssignedTo;
    // claimHistoryRef.PROFILE_LEVEL = this.previousLevel;
    // this.api.postData('claim_work_flow_history', claimHistoryRef.toJson(true)).subscribe((response) => {
    //   var postClaimMain = response.json();
    //   this.api.sendEmail();

    //   this.UpdateProfileInfo(this.mainClaimReq);
    //   alert('Claim action submitted successfully.')

    // })
  }

  processProfileJSON(stringProfileJSON: any, level: any) {
    let profileJSON = JSON.parse(stringProfileJSON);
    this.levels = profileJSON.profile.levels.level
    let nextLevel;
    this.levels.forEach(element => {
      if (element['-id'] == level) {
        var temp: any[] = element['conditions']['condition'];
        temp.forEach(condElement => {
          if (condElement['nextlevel']['-final'] === 'true')
            nextLevel = '-1';
          else if (condElement['-status'] === 'approved') {
            nextLevel = condElement['nextlevel']['#text'];
          }
          else if (condElement['-status'] === 'rejected') {
            nextLevel = '0';
          }
        });
      }
    });

    this.level = nextLevel;

    if (this.level === '-1' || this.level === '0') {
      this.assignedTo = '';
      this.stage = '';
    }
    else {
      this.getInfoLevels(this.levels, this.level)
      // levels.forEach(element => {
      //   if (element['-id'] == this.level) {
      //     this.profileLevel = this.level;
      //     if (element['approver']['-directManager'] === '1') {
      //       this.GetDirectManager();
      //     }

      //     if (element['approver']['-keytype'] === 'userGUID') {
      //       this.assignedTo = element['approver']['#text'];
      //       this.GetDirectManagerByManagerGUID();
      //     }
      //   }
      // });
    }
  }

  getInfoLevels(levels: any[], level: any) {
    levels.forEach(element => {
      if (element['-id'] == level) {
        this.profileLevel = level;
        if (element['approver']['-directManager'] === '1') {
          let temp = this.GetDirectManager(); temp.then();
        }
        if (element['approver']['-keytype'] === 'userGUID') {
          this.assignedTo = element['approver']['#text'];
          let temp = this.GetDirectManagerByManagerGUID(); temp.then();
        }
      }
    });
  }

  //   getInfoLevels(levels: any[], level: any) {
  //     levels.forEach(element => {
  //       if (element['-id'] == level) {
  //         this.profileLevel = level;
  //         if (element['approver']['-directManager'] === '1') {
  //           let temp = this.GetDirectManager(); temp.then();

  //   // else  if (this.level === '3')
  //   //   this.mainClaimReq.STATUS = 'Approved';
  //   // else if (this.level === '0' || this.isRemarksAccepted === false) {

  //   //   this.mainClaimReq.STATUS = 'Rejected';
  //   //   this.mainClaimReq.PROFILE_LEVEL = 0;
  //   //   this.mainClaimReq.STAGE = null;
  //   //   this.mainClaimReq.ASSIGNED_TO = null;
  //   // }
  //   if (this.level === '3')
  //     this.mainClaimReq.STATUS = 'Approved';
  //   if (this.level === '0' || this.isRemarksAccepted === false) {
  //     this.mainClaimReq.STATUS = 'Rejected';
  //     this.mainClaimReq.ASSIGNED_TO = this.previousAssignedTo;
  //     this.mainClaimReq.STAGE = this.previousStage;
  //     this.mainClaimReq.PROFILE_LEVEL = 0;

  //   }
  //   if (this.checkMultipleLength === 1)
  //     this.UpdateProfileInfo(this.mainClaimReq);
  //   else
  //     this.UpdateProfileInfoForMultiple(this.mainClaimReq);
  //   //alert('Claim action submitted successfully.')

  //   // This is for Approval Send email to User and next approver
  //   this.api.EmailNextApprover(this.mainClaimReq.CLAIM_REQUEST_GUID,this.mainClaimReq.ASSIGNED_TO,claimRef.STATUS);


  // }         


  getProfileForUser() {
    this.api.getClaimRequestByClaimReqGUID('63a9730e-5421-28c1-0c60-e36c1384fac6').subscribe(data => {
      let stringProfileJSON = data[0].PROFILE_JSON
      let profileJSON = JSON.parse(stringProfileJSON);
      let levels = profileJSON.profile.levels.level;
      this.getInfoLevels(levels, '1');

    })
  }


  SaveClaim(claimRefGUID: any) {
    //, amount, isCustomer, value
    let claimReqMainRef: MainClaimRequestModel = new MainClaimRequestModel();
    // if (this.claimRequestGUID != undefined)
    //   claimReqMainRef.CLAIM_REQUEST_GUID = this.claimRequestGUID
    // else
    claimReqMainRef.CLAIM_REQUEST_GUID = this.formValues.uuid === undefined ? UUID.UUID() : this.formValues.uuid;
    // claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
    claimReqMainRef.TENANT_GUID = this.TenantGUID;
    claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
    claimReqMainRef.MILEAGE_GUID = this.formValues.vehicleType;
    claimReqMainRef.ALLOWANCE_GUID = this.formValues.meal_allowance;
    claimReqMainRef.CLAIM_TYPE_GUID = this.formValues.claimTypeGUID;
    claimReqMainRef.TRAVEL_DATE = this.formValues.travel_date;
    claimReqMainRef.START_TS = this.formValues.start_DT;
    claimReqMainRef.END_TS = this.formValues.end_DT;
    claimReqMainRef.MILEAGE_AMOUNT = this.claimAmount;
    claimReqMainRef.CLAIM_AMOUNT = this.claimAmount;
    claimReqMainRef.CREATION_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    claimReqMainRef.UPDATE_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    // claimReqMainRef.UPDATE_TS = new Date().toISOString();
    claimReqMainRef.FROM = this.formValues.origin;
    claimReqMainRef.DESTINATION = this.formValues.destination;
    claimReqMainRef.DISTANCE_KM = this.formValues.distance;
    claimReqMainRef.DESCRIPTION = this.formValues.description;
    claimReqMainRef.ASSIGNED_TO = this.assignedTo;
    claimReqMainRef.PROFILE_LEVEL = parseInt(this.profileLevel);
    claimReqMainRef.PROFILE_JSON = this.profileJSON;
    claimReqMainRef.STATUS = this.formValues.uuid === undefined ? 'Pending' : 'Draft';
    // claimReqMainRef.STATUS = this.formValues.uuid === undefined ? 'Draft' : 'Pending';
    // if (claimReqMainRef.PROFILE_LEVEL === 1) {
    //   claimReqMainRef.STAGE = 'Superior';
    // }
    // else if (claimReqMainRef.PROFILE_LEVEL === 2 || claimReqMainRef.PROFILE_LEVEL === 3) {
    //   claimReqMainRef.STAGE = 'Finance'
    // }
    claimReqMainRef.STAGE = this.stage;
    claimReqMainRef.ATTACHMENT_ID = this.formValues.attachment_GUID;
    claimReqMainRef.TRAVEL_TYPE = this.formValues.travelType === 'Outstation' ? '1' : '0';
    claimReqMainRef.claim_method_guid = this.formValues.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.formValues.PayType;
    claimReqMainRef.from_place_id = this.formValues.from_id;
    claimReqMainRef.to_place_id = this.formValues.to_id;


    if (this.isCustomer) {
      claimReqMainRef.CUSTOMER_GUID = this.formValues.soc_no;
      claimReqMainRef.SOC_GUID = null;
    }
    else {
      claimReqMainRef.SOC_GUID = this.formValues.soc_no;
      claimReqMainRef.CUSTOMER_GUID = null;
    }
    this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
      var postClaimMain = response.json();
      if (claimReqMainRef.STATUS != 'Draft')
      
        // this.api.sendEmail(this.formValues.claimTypeGUID, this.formValues.start_DT, this.formValues.end_DT, new Date().toISOString(), this.formValues.travel_date, claimReqMainRef.CLAIM_REQUEST_GUID);        
        
        //Superior will get mail notification--------------------
        this.api.sendEmail_New(this.formValues.claimTypeGUID, this.formValues.start_DT, this.formValues.end_DT, new Date().toISOString(), this.formValues.travel_date, claimReqMainRef.CLAIM_REQUEST_GUID, this.formValues.origin, this.formValues.destination, this.formValues.description, claimReqMainRef.SOC_GUID, claimReqMainRef.CUSTOMER_GUID);
      
        localStorage.setItem("g_CR_GUID", postClaimMain["resource"][0].CLAIM_REQUEST_GUID);
      // this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
      //this.MainClaimSaved = true;
      if (this.formValues.uuid === undefined) {
        //this.api.presentToast('Claim has submitted successfully.')
        alert('Claim has submitted successfully.')
        this.navCtrl.setRoot(DashboardPage);
      }
      else
        alert('Please click (+) icon to include additional details and submit your claim.')
    })
  }




  saveClaimRef(month: any, year: any) {
    let claimReqRef: MainClaimReferanceModel = new MainClaimReferanceModel();
    claimReqRef.CLAIM_REF_GUID = UUID.UUID();
    claimReqRef.USER_GUID = this.userGUID;
    claimReqRef.TENANT_GUID = this.TenantGUID;
    claimReqRef.REF_NO = this.userGUID + '/' + month + '/' + year;
    claimReqRef.MONTH = month;
    claimReqRef.YEAR = year;
    claimReqRef.STATUS = 'Pending';
    claimReqRef.CREATION_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    claimReqRef.UPDATE_TS = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    this.api.postData('main_claim_ref', claimReqRef.toJson(true)).subscribe((response) => {
      var postClaimRef = response.json();
      let claimRefGUID = postClaimRef["resource"][0].CLAIM_REF_GUID;
      this.SaveClaim(claimRefGUID);
    })
  }

  formValues: any; claimAmount: any; isCustomer: any; profileJSON: any; isRequester: boolean = false;

  save(formValues: any, amount: any, isCustomer: any) {
    this.isRequester = true;
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    this.userGUID = localStorage.getItem('g_USER_GUID');

    this.formValues = formValues;
    this.claimAmount = amount;
    this.isCustomer = isCustomer;
    this.initiateLevels('1');

    // let month = new Date(formValues.travel_date).getMonth() + 1;
    // let year = new Date(formValues.travel_date).getFullYear();

    // this.api.getClaimRequestByClaimReqGUID('3d1a5bd4-7263-1203-dfd1-efbbf1621372').subscribe(data => {

  }

  // month: any; year: any
  initiateLevels(levelNo: string) {

    this.http.get('assets/profile.json').map((response) => response.json()).subscribe(data => {
      let stringProfileJSON = this.profileJSON = JSON.stringify(data);
      // let stringProfileJSON = this.profileJSON= data[0].PROFILE_JSON
      let profileJSON = JSON.parse(stringProfileJSON);
      let levels = profileJSON.profile.levels.level;
      this.getInfoLevels(levels, levelNo);


      // this.api.getApiModel('main_claim_ref', 'filter=(USER_GUID=' + this.userGUID + ')AND(MONTH=' + this.month + ')AND(YEAR=' + this.year + ')')
      //   .subscribe(claimRefdata => {
      //     if (claimRefdata["resource"][0] == null) {
      //       this.saveClaimRef(this.month, this.year);
      //     }
      //     else {
      //       let claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;
      //       this.SaveClaim(claimRefGUID);
      //     }
      //   })

    })
  }

  CheckSessionOut(){
    if (localStorage.getItem("g_USER_GUID") === null) {
      alert('Your session is timedout. Please login now.');
      this.navCtrl.setRoot('LoginPage');
    }
  }
}
