import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';
import { Checkboxlist } from '../../models/checkbox-list.model';

import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../../pages/entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../../pages/overtime-claim-view/overtime-claim-view';
import { MedicalClaimViewPage } from '../../pages/medical-claim-view/medical-claim-view';
import { PrintClaimViewPage } from '../../pages/print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../../pages/gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../../pages/miscellaneous-claim-view/miscellaneous-claim-view';
import { ClaimtasklistPage } from '../claimtasklist/claimtasklist';

@IonicPage()
@Component({
  selector: 'page-claimapprovertasklist',
  templateUrl: 'claimapprovertasklist.html', providers: [BaseHttpService]
})
export class ClaimapprovertasklistPage {

  baseResourceUrl: string;
  claimrequestdetails: any[];
  claimrequestdetails1: any[];
  selectAll: boolean;
  claimrefguid: any;
  searchboxValue: string;
  checkboxDataList: Checkboxlist[] = [];
  loginUserGuid: string;
  claimRequestGUID: any;
  level: any;
  loginUserRole = localStorage.getItem("g_ROLE_NAME");
  claimreqData: any[];
  buttonText:string;
  public page:number = 1;

  deptList: any[];
  employeeList: any[];
  claimTypeList: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService) {

    this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    this.claimrefguid = navParams.get("claimRefGuid");
    // alert(this.claimrefguid);

    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      if (this.loginUserRole === "Finance Admin") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS!=Pending)AND(PROFILE_LEVEL>1)&api_key=' + constants.DREAMFACTORY_API_KEY;
     this.buttonText="Pay";
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL>1)&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.buttonText="Approve";
      }
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=1)AND(YEAR=' +this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.buttonText="Approve";
    }
    this.BindEmployeesbyDepartment();
    this.BindClaimTypes();
    this.BindYears();
    this.BindData();
  }
  BindData() {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = data["resource"];
        let key: any;
        this.claimrequestdetails.forEach(element => {
          if (element.STATUS === 'Rejected') {
         element.STAGE_GUID = null;
          }
          else {
            key = element.PROFILE_LEVEL;
          }

          switch (key) {
            case 1: element.STAGE_GUID = 'Superior'; break;
            case 2: element.STAGE_GUID = 'Finance Executive'; break;
            case 3:
            case -1: element.STAGE_GUID = 'Finance & Admin'; break;
          }
        });
        this.claimrequestdetails1 = this.claimrequestdetails;
      });
   
  }

  onSearchInput(ev: any) {
    // alert('hi')
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimrequestdetails = this.claimrequestdetails1.filter((item) => {
        let fullname: number;
        let claimtype: number;
        let status: number;
        let stage: number;
        let amount: number;
        let date: number;
        //console.log(item);
        if (item.FULLNAME != null) { fullname = item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIMTYPE != null) { claimtype = item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STAGE != null) { stage = item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (fullname > -1)
          || (date > -1)
          || (claimtype > -1)
          || (status > -1)
          || (stage > -1)
          || (amount > -1)
        );
      })
    }
    else {
      this.claimrequestdetails = this.claimrequestdetails1;
    }
  }


  checkAllCheckBoxes(event: Checkbox) {
    if (event.checked) { this.selectAll = true; }
    else {
      this.selectAll = false;
    }
  }

  // getCheckboxValue(event:Checkbox,claimRequestGuid:any){
  //   // console.log(event);
  //   // alert(event.id);
  //   // alert(event.checked);
  //   // alert(claimRequestGuid);
  // }

  getCheckboxValue(event: Checkbox, claimRequestGuid: any, level: number, status: string) {
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);
    debugger;
    let checkboxData: Checkboxlist = new Checkboxlist(event.checked, claimRequestGuid, level, status);
    if (event.checked) {
      this.checkboxDataList.push(checkboxData);
    }
    else {
      let chkItem: Checkboxlist = this.checkboxDataList.find(item => item.ClaimRequestGuid == claimRequestGuid);
      const index: number = this.checkboxDataList.indexOf(chkItem);
      if (index !== -1) {
        this.checkboxDataList.splice(index, 1);
      }
    }
    // console.log(this.checkboxDataList);
    // alert(this.checkboxDataList.length);
    // alert(this.checkboxDataList.find(item => item.Chkid == event.id).Chkid + ","+this.checkboxDataList.find(item => item.Chkid == event.id).Checked+ ","+this.checkboxDataList.find(item => item.Chkid == event.id).claimRequestGuid);
  }

approveAll(){
  return new Promise((resolve, reject) => {

  this.checkboxDataList.forEach(element => {
    if (element.Checked && element.status !== 'Paid') {
      //debugger;
      this.profileMngProvider.ProcessProfileMng(null, this.loginUserGuid, element.level, element.ClaimRequestGuid, true,2);
      this.count++;
    }
  });
  })
}

count:number =0;
  approveClaims() {
    //console.table(this.claimrequestdetails);
   this.count=0;
    //debugger;
    if (this.checkboxDataList.length > 0) {
      let temp = this.approveAll();
      // for(let i=0;i<this.checkboxDataList.length;i++)
      // {
      // this.checkboxDataList.forEach(element => {
      //   if (element.Checked && element.status !== 'Paid') {
      //     debugger;
      //     this.profileMngProvider.ProcessProfileMng(null, this.loginUserGuid, element.level, element.ClaimRequestGuid, true);

      //     count++;

      //     // 
      //   }
      // });

      //}
      temp.then((res) => {
    })
    
    if (this.count > 0 && this.claimrefguid!==null && this.claimrefguid!==undefined) {
      //debugger;
      this.claimreqData = [];
      let pendingFlag = false;
      let approvedFlag = false;
      let url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(STATUS!=Paid)&api_key=' + constants.DREAMFACTORY_API_KEY;
      console.log(url)

      this.api.getApiModel('main_claim_ref', 'filter=CLAIM_REF_GUID=' + this.claimrefguid)
        .subscribe(data => {
          let claimRefObj = data;
          //debugger;
          this.http
            .get(url)
            .map(res => res.json())
            .subscribe(data1 => {
              //debugger;
              this.claimreqData = data1["resource"];
           
          if (this.claimreqData !== null && this.claimreqData !== undefined && this.claimreqData.length > 0) {
            this.claimreqData.forEach(element => {
              //debugger;
              if (element.STATUS == "Pending" && !pendingFlag) {
                pendingFlag = true;
              }
              else if (element.STATUS == "Approved" && !approvedFlag) {
                approvedFlag = true;
              }
            });
          }
          
          if (pendingFlag)
            claimRefObj["resource"][0].STATUS = 'Pending';
          else if (approvedFlag)
            claimRefObj["resource"][0].STATUS = 'Approved';
          else
            claimRefObj["resource"][0].STATUS = 'Paid';
          //debugger;
          this.api.updateApiModel('main_claim_ref', claimRefObj).subscribe(res => {
            alert('Claim has been Approved.')
            this.navCtrl.push(ClaimtasklistPage);
          })
        });
        })
      // this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
      // this.MainClaimSaved = true;
    }
    if (this.claimrefguid===null || this.claimrefguid===undefined) {
      alert('Claim has been Approved.')
      this.navCtrl.setRoot(ClaimapprovertasklistPage);
    }
    this.BindData();
    this.checkboxDataList = [];
    
// if(this.checkboxDataList.length>1)
// {
//   alert('Claim has been Approved.')
//   this.navCtrl.push(ClaimtasklistPage);
// }
    }
    else {
      alert("Please select the claim(s) which you want to approve.")
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimapprovertasklistPage');
  }

  designation:string;
  viewClaim(designation:string,claimRequestGUID: string, level: any, claimType: any) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;
    this.designation = designation;

    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': this.pushPage(GiftClaimViewPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': this.pushPage(OvertimeClaimViewPage); break;
      case '40dbaf56-98e4-77b9-df95-85ec232ff714': this.pushPage(MedicalClaimViewPage); break;
      case '58c59b56-289e-31a2-f708-138e81a9c823': this.pushPage(TravelClaimViewPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': this.pushPage(PrintClaimViewPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': this.pushPage(EntertainmentClaimViewPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': this.pushPage(MiscellaneousClaimViewPage); break;
    }
  }

  pushPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isApprover: true,
      approverDesignation: this.designation,
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }

  
  BindClaimTypes() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.claimTypeList = data["resource"];
      });
  }

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }
  
  BindEmployeesbyDepartment() {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
      });

  }

  
  SearchClaimsData(ddlEmployee: string, ddlClaimTypes: string, ddlStatus: string, ddlYear: number) {
    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      if (this.loginUserRole === "Finance Admin") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS!=Pending)AND(PROFILE_LEVEL>1)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL>1)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')AND(STATUS=Pending)AND(PROFILE_LEVEL=1)AND(YEAR=' +this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData();

    if (this.claimrequestdetails.length != 0) {
      if (ddlEmployee.toString() !== "All") { this.claimrequestdetails = this.claimrequestdetails.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
      if (ddlClaimTypes.toString() !== "All") { this.claimrequestdetails = this.claimrequestdetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }
      if (ddlStatus.toString() !== "All") { this.claimrequestdetails = this.claimrequestdetails.filter(s => s.STATUS.toString() === ddlStatus.toString()) }

    }
  }
  

}
