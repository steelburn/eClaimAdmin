import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the ClaimhistorydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimhistorydetail',
  templateUrl: 'claimhistorydetail.html', providers: [BaseHttpService, ExcelService]
})
export class ClaimhistorydetailPage {
  claimhistorydetails: any[];
  claimhistorydetails1: any[];
  userdetails: any;
  claimrefguid: any;
  userguid: any;
  month: any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  searchboxValue: string;
  FinanceLogin: boolean = false;
  loginUserRole:string;
  public page:number = 1;
  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService) {
    this.claimrefguid = navParams.get("claimRefGuid");
    this.userguid = navParams.get("userGuid");
    this.month = navParams.get("Month");
   this.loginUserRole=localStorage.getItem("g_ROLE_NAME");
    //alert(this.userguid);
    //this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //console.log(this.baseResourceUrl);

    //this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    // this.claimrefguid = navParams.get("claimRefGuid");
    // alert(this.claimrefguid);

    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      this.FinanceLogin = true;
      if(this.loginUserRole==="Finance Admin")
      {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;      }
      else
      {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;      }
     
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)&api_key=' + constants.DREAMFACTORY_API_KEY;
    }

    this.BindData();
    if (this.FinanceLogin) {
      this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID=' + this.userguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.getuserDetails();
    }

    this.excelService = excelService;
  }

  getuserDetails() {
    this.http
      .get(this.baseResourceUrl1)
      .map(res => res.json())
      .subscribe(data => {
        this.userdetails = data["resource"];
      });
  };

  ExcelData: any[] = [];
  BindData() {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorydetails = data["resource"];
        if(this.claimhistorydetails.length!=0 && this.loginUserRole==="Finance Admin")
        {
          this.claimhistorydetails.forEach(element => {
            if(element.STATUS.toString()==="Approved" && element.PROFILE_LEVEL.toString()==="3")
            {element.STATUS="Paid";}
          });
        }
        this.claimhistorydetails1 = this.claimhistorydetails;

        for (var item in data["resource"]) {
          this.ExcelData.push({ Name: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPARTMENT"], Month: data["resource"][item]["MONTH"], ClaimType : data["resource"][item]["CLAIM_TYPE"], Date: data["resource"][item]["TRAVEL_DATE"], Status: data["resource"][item]["STATUS"], Amount: data["resource"][item]["CLAIM_AMOUNT"] });
        }
      });
  }
  onSearchInput(ev: any) {
    // alert('hi')
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimhistorydetails = this.claimhistorydetails1.filter((item) => {
        let claimtype: number;
        let status: number;
        let amount: number;
        let date: number;
        
        if (item.CLAIM_TYPE != null) { claimtype = item.CLAIM_TYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (claimtype > -1)
          || (date > -1)
          || (status > -1)
          || (amount > -1)
        );
      })
    }
    else {
      this.claimhistorydetails = this.claimhistorydetails1;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistorydetailPage');
  }

  ExportToExcel(evt: any) {
    // this.excelService.exportAsExcelFile(this.claimhistorydetails,'Data');
    this.excelService.exportAsExcelFile(this.ExcelData,'Data');
  }

}
