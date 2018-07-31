import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

import { TravelClaimViewPage } from '../../pages/travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../../pages/entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../../pages/overtime-claim-view/overtime-claim-view';
import { PrintClaimViewPage } from '../../pages/print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../../pages/gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../../pages/miscellaneous-claim-view/miscellaneous-claim-view';

import { EntertainmentclaimPage } from '../../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../../pages/travel-claim/travel-claim.component';
import { PrintclaimPage } from '../../pages/printclaim/printclaim';
import { GiftclaimPage } from '../../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../../pages/overtimeclaim/overtimeclaim';
import { MiscellaneousClaimPage } from '../../pages/miscellaneous-claim/miscellaneous-claim';

import { ApiManagerProvider } from '../../providers/api-manager.provider';

import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the UserclaimslistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userclaimslist',
  templateUrl: 'userclaimslist.html', providers: [BaseHttpService, ExcelService]
})
export class UserclaimslistPage {
  userClaimhistorydetails: any[];
  userClaimhistorydetails1: any[];
  claimTypeList: any[];
  yearsList: any[] = [];
  userdetails: any;
  currentYear: number = new Date().getFullYear();
  prevYear: number = new Date().getFullYear();
  //claimrefguid:any;
  //userguid:any;
  //month:any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  searchboxValue: string;
  Pending: any; Rejected: any; Approved: any; Paid: any;
  public page: number = 1;
  constructor(private excelService: ExcelService, private api: ApiManagerProvider, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http) {

    //  this.claimrefguid=navParams.get("claimRefGuid");
    //  this.userguid=navParams.get("userGuid");
    //  this.month=navParams.get("Month");
    //alert(this.userguid);
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(USER_GUID=' + localStorage.getItem("g_USER_GUID") + ')AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID=' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    console.log(this.baseResourceUrl);

    // this.onSearchInput();
    this.BindYears();
    this.BindClaimTypes();

    this.Rejected = navParams.get("Rejected");
    this.Pending = navParams.get("Pending");
    this.Approved = navParams.get("Approved");
    this.Paid = navParams.get("Paid");

    this.searchboxValue = this.Rejected || this.Pending || this.Approved || this.Paid;
    if (this.searchboxValue != undefined) {
      this.onSearchInput();
    }
    else { this.BindData(); }

    this.getuserDetails();

    this.excelService = excelService;
  }

  ExcelData: any[] = [];
  BindData() {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.userClaimhistorydetails1 = data["resource"];
        let key: any;
        this.userClaimhistorydetails1.forEach(element => {
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
        this.userClaimhistorydetails = this.userClaimhistorydetails1;
        // for (var item in data["resource"]) {
        //   this.ExcelData.push({ ClaimType: data["resource"][item]["CLAIMTYPE"], Date: data["resource"][item]["TRAVEL_DATE"], Status: data["resource"][item]["STATUS"], Stage: data["resource"][item]["STAGE"], Amount: data["resource"][item]["CLAIM_AMOUNT"] });
        // }
      });

  }

  onSearchInput() {
    // alert('hi')    
    // this.searchboxValue='hi';

    // debugger;

    let val = this.searchboxValue;
    // alert(this.searchboxValue)
    if (val && val.trim() != '') {

      // Lakshman June-13,2018
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.userClaimhistorydetails1 = data["resource"];
          //this.userClaimhistorydetails1 = this.userClaimhistorydetails;
          this.userClaimhistorydetails1.forEach(element => {
            switch (element.PROFILE_LEVEL) {
              case 1: element.STAGE_GUID = 'Superior'; break;
              case 2: element.STAGE_GUID = 'Finance Executive'; break;
              case 3:
              case -1: element.STAGE_GUID = 'Finance & Admin'; break;
              // case 4: element.STAGE_GUID = 'Finance Manager'; break;
              // case 5: element.STAGE_GUID = 'Finance & Admin'; break;
            }
          });
          this.userClaimhistorydetails = this.userClaimhistorydetails1.filter((item) => {
            let claimtype: number;
            let status: number;
            let stage: number;
            let amount: number;
            let date: number;
            // console.log(item);
            if (item.CLAIMTYPE != null) { claimtype = item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase()) }
            if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
            if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
            if (item.STAGE != null) { stage = item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase()) }
            if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
            return (
              (claimtype > -1)
              || (date > -1)
              || (status > -1)
              || (stage > -1)
              || (amount > -1)
            );
          })
        });
      // Lakshman June-13,2018

      // this.userClaimhistorydetails = this.userClaimhistorydetails1.filter((item) => {
      //   let claimtype: number;
      //   let status: number;
      //   let stage: number;
      //   let amount: number;
      //   let date: number;
      //   // console.log(item);
      //   if (item.CLAIM_TYPE != null) { claimtype = item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase()) }
      //   if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
      //   if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
      //   if (item.STAGE != null) { stage = item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase()) }
      //   if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
      //   return (
      //     (claimtype > -1)
      //     || (date > -1)
      //     || (status > -1)
      //     || (stage > -1)
      //     || (amount > -1)
      //   );
      // })
    }
    else {
      this.userClaimhistorydetails = this.userClaimhistorydetails1;
    }
  }

  getuserDetails() {
    this.http
      .get(this.baseResourceUrl1)
      .map(res => res.json())
      .subscribe(data => {
        //alert(JSON.stringify(data));
        this.userdetails = data["resource"];
        //alert(this.userdetails);
      });
  };

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

  claimRequestGUID: string; level: string; designation: string;

  ClaimNavigation(designation: string, claimRequestGUID: string, level: string, claimType: any, navType: number) {
    this.claimRequestGUID = claimRequestGUID;
    this.level = level;
    this.designation = designation;
    switch (claimType) {
      case '2d8d7c80-c9ae-9736-b256-4d592e7b7887': if (navType === 1) this.pushPage(GiftClaimViewPage); else this.editPage(GiftclaimPage); break;
      case '37067b3d-1bf4-33a3-2b60-3ca40baf589a': if (navType === 1) this.pushPage(OvertimeClaimViewPage); else this.editPage(OvertimeclaimPage); break;
      case '84b3cee2-9f9d-ccb9-89a1-1e70cef19f86': if (navType === 1) this.pushPage(MiscellaneousClaimViewPage); else this.editPage(MiscellaneousClaimPage); break;

      case '58c59b56-289e-31a2-f708-138e81a9c823': if (navType === 1) this.pushPage(TravelClaimViewPage); else this.editPage(TravelclaimPage); break;
      case 'd9567482-033a-6d92-3246-f33043155746': if (navType === 1) this.pushPage(PrintClaimViewPage); else this.editPage(PrintclaimPage); break;
      case 'f3217ecc-19d7-903a-6c56-78fdbd7bbcf1': if (navType === 1) this.pushPage(EntertainmentClaimViewPage); else this.editPage(EntertainmentclaimPage); break;
    }
  }

  pushPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isApprover: false,
      approverDesignation: this.designation,
      cr_GUID: this.claimRequestGUID,
      level_no: this.level,
      approver_GUID: localStorage.getItem('g_USER_GUID')
    });
  }

  editPage(claimType: any) {
    this.navCtrl.push(claimType, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }

  DeleteClaimRequest(claimReqGuid: any) {
    let alert1 = this.alertCtrl.create({
      title: 'Confirm delete claim',
      message: 'Are you sure you want to delete this claim?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            return
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.api.deleteApiModel('main_claim_request', claimReqGuid).subscribe(() => {
              this.BindData();
              alert('Claim has been deleted successfully.');
            });
          }
        }
      ]
    })
    alert1.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserclaimslistPage');
  }

  ExportExcelClicked: boolean = false; ExcelColumns: any[] = [];
  ExportToExcel() {
    this.ExportExcelClicked = true;
    this.ExcelColumns = [];
    this.ExcelColumns.push({ Columns: 'Claim Type' });
    this.ExcelColumns.push({ Columns: 'Date' });
    this.ExcelColumns.push({ Columns: 'Status' });
    this.ExcelColumns.push({ Columns: 'Stage' });
    this.ExcelColumns.push({ Columns: 'Amount(RM)' });
  }

  CloseExportExcel() {
    this.ExportExcelClicked = false;
    this.checked.length = 0;
  }

  checked: any[] = [];
  SelectColumn(e: any, SelectedColumn: any) {
    if (e.checked == true) {
      this.checked.push(SelectedColumn);
    } else {
      let index = this.RemoveCheckedFromArray(SelectedColumn);
      this.checked.splice(index, 1);
    }
  }

  RemoveCheckedFromArray(checkbox: String) {
    return this.checked.findIndex((category) => {
      return category === checkbox;
    })
  }

  SubmitExportExcel() {
    this.ExcelData = [];
    if (this.checked.length > 0) {
      for (var item in this.userClaimhistorydetails) {
        if (this.checked.length > 0) {
          let ctr: number = 0;
          let jsonStr = '';
          for (var chkItem in this.checked) {
            ctr = ctr + 1;
            switch (this.checked[chkItem]["Columns"]) {
              case "Claim Type":
                if (this.checked.length == 1) {
                  jsonStr += '{"ClaimType":"' + this.userClaimhistorydetails[item]["CLAIMTYPE"] + '"';
                }
                else {
                  jsonStr += '{"ClaimType":"' + this.userClaimhistorydetails[item]["CLAIMTYPE"] + '",';
                }
                break;
              case "Date":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Date":"' + this.userClaimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '"Date":"' + this.userClaimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Date":"' + this.userClaimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '{"Date":"' + this.userClaimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                break;
              case "Status":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Status":"' + this.userClaimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '"Status":"' + this.userClaimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Status":"' + this.userClaimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '{"Status":"' + this.userClaimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                break;
              case "Stage":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Stage":"' + this.userClaimhistorydetails[item]["STAGE"] + '"';
                  }
                  else {
                    jsonStr += '"Stage":"' + this.userClaimhistorydetails[item]["STAGE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Stage":"' + this.userClaimhistorydetails[item]["STAGE"] + '"';
                  }
                  else {
                    jsonStr += '{"Stage":"' + this.userClaimhistorydetails[item]["STAGE"] + '",';
                  }
                }
                break;
              case "Amount(RM)":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Amount":"' + this.userClaimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"Amount":"' + this.userClaimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Amount":"' + this.userClaimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"Amount":"' + this.userClaimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
                  }
                }
                break;
            }
            if (ctr == this.checked.length) {
              jsonStr += '}';
            }
          }
          this.ExcelData.push(JSON.parse(jsonStr));
        }
      }
      this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
    }
    else {
      alert('Please select one item.');
    }
  }

  SearchClaimsData(ddlmonth: string, ddlClaimTypes: string, ddlStatus: string, ddlYear: number) {
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(USER_GUID=' + localStorage.getItem("g_USER_GUID") + ')AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.BindData();
    if (this.userClaimhistorydetails.length != 0) {
      if (ddlmonth.toString() !== "All") { this.userClaimhistorydetails = this.userClaimhistorydetails.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
      if (ddlStatus.toString() !== "All") { this.userClaimhistorydetails = this.userClaimhistorydetails.filter(s => s.STATUS.toString() === ddlStatus.toString()) }
      if (ddlClaimTypes.toString() !== "All") { this.userClaimhistorydetails = this.userClaimhistorydetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }

    }
  }

}
