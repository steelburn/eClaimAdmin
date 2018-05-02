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

/**
 * Generated class for the ClaimapprovertasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



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
  checkboxDataList: Checkboxlist[]=[];
  loginUserGuid:string;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider,public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService) {

   this.loginUserGuid=localStorage.getItem("g_USER_GUID");
    this.claimrefguid = navParams.get("claimRefGuid");
    // alert(this.claimrefguid);
    if (this.claimrefguid != 'null') {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO=' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData();
  }
  BindData() {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimrequestdetails = data["resource"];
        this.claimrequestdetails1 = this.claimrequestdetails;
      });
    //console.table(this.claimrequestdetails);
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

  getCheckboxValue(event: Checkbox, claimRequestGuid: any,level:number) {
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);

    let checkboxData: Checkboxlist = new Checkboxlist(event.checked,claimRequestGuid,level);
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

approveClaims() {
    //console.table(this.claimrequestdetails);
    let count=0;
if(this.checkboxDataList.length>0)
{
// for(let i=0;i<this.checkboxDataList.length;i++)
// {
  this.checkboxDataList.forEach(element => {
    if(element.Checked)
    {
      //debugger;
      this.profileMngProvider.ProcessProfileMng(null, this.loginUserGuid, element.level, element.ClaimRequestGuid, true);
      count++;
      
     // 
    }
  });

//}
if(count>0)
{
  alert("Claim(s) approved successfully.");
}
}
else{alert("Please select the claim(s) which you want to approve.")}
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimapprovertasklistPage');
  }

}
