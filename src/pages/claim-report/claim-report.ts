import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Services } from '../Services';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';


/**
 * Generated class for the ClaimReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report',
  templateUrl: 'claim-report.html',
})
export class ClaimReportPage {

  baseResourceUrl: string;
  claimsList: any[];
  deptList: any[];
  employeeList: any[];
  claimTypeList: any[];
  totalClaimAmount: number = 0;
  travelClaimType: boolean = false;
  overTimeClaim: boolean = false;
  todayDate: Date = new Date();

  //for Report print
  totalDistanceLocal: number = 0;
  totalDistanceOutstation: number = 0;
  totalMileageAmount: number = 0;
  totalParkingAmount: number = 0;
  totalTollAmount: number = 0;
  totalAccAmount: number = 0;
  totalMealAmount: number = 0;
  totalPublicTransportAmount: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

    // this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.BindDepartment();
    this.BindClaimTypes();

  }

  BindData() {
    this.totalClaimAmount = 0;
    this.totalDistanceLocal=0;
    this.totalDistanceOutstation = 0;
    this.totalPublicTransportAmount=0;
    this.totalMileageAmount = 0;
    this.totalParkingAmount=0;
    this.totalTollAmount = 0;
    this.totalAccAmount=0;
    this.totalMealAmount=0;
    
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimsList = data["resource"];
        this.claimsList.forEach(element => {
          //alert(element.CLAIM_AMOUNT);
          this.totalClaimAmount = this.totalClaimAmount + element.Total;
          if (element.TRAVEL_TYPE === '0')
          this.totalDistanceLocal = this.totalDistanceLocal + element.DISTANCE_KM;
          else
          this.totalDistanceOutstation = this.totalDistanceOutstation + element.DISTANCE_KM;
          if (element.CATEGORY === 'Public Transport')
            this.totalPublicTransportAmount = this.totalPublicTransportAmount + element.MILEAGE_AMOUNT;
          else
            this.totalMileageAmount = this.totalMileageAmount + element.MILEAGE_AMOUNT;

          this.totalParkingAmount = this.totalParkingAmount + element.ParkingAmount;
          this.totalTollAmount = this.totalTollAmount + element.TollAmount;
          this.totalAccAmount = this.totalAccAmount + element.AccAmount;
          this.totalMealAmount = this.totalMealAmount + element.MealAmount;
        });
        //alert(this.totalClaimAmount);
      });
    //     for(var cl of this.claimsList)
    //     {
    // //this.totalClaimAmount+=cl.
    // console.log(cl);
    // alert(cl);
    //    }
    // this.claimsList.forEach(function (value) {
    // return this.totalClaimAmount+=value.CLAIM_AMOUNT
    // });

    //console.table(this.claimsList);
  }

  BindDepartment() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.deptList = data["resource"];
      });
    //console.log(this.deptList);
  }


  BindEmployeesbyDepartment(dept: string) {
    //alert(dept);
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?filter=(DEPT_GUID=' + dept + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
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

  SearchClaimsData(dept: string, emp: string, month: string, claimType: string) {
    // alert(dept);
    // alert(emp);
    // alert(month);
    // alert(claimType);
    let year = new Date().getFullYear();
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(STAGE_GUID=' + dept + ')AND(USER_GUID=' + emp + ')AND(MONTH=' + month + ')AND(CLAIM_TYPE_GUID=' + claimType + ')AND(YEAR=' + year + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?api_key=' + constants.DREAMFACTORY_API_KEY;

    this.BindData();
    if (claimType == "58c59b56-289e-31a2-f708-138e81a9c823")
      this.travelClaimType = true;
    else
      this.travelClaimType = false;

    if (claimType == "37067b3d-1bf4-33a3-2b60-3ca40baf589a")
      this.overTimeClaim = true;
    else
      this.overTimeClaim = false;
    //console.log(this.baseResourceUrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPage');
  }

  // navigatePrint()
  // {
  //  this.navCtrl.push(ClaimReportPrintPage);
  // }
  printToCart(printSectionId: any) {
    document.getElementById(printSectionId).hidden = false;
    var innerContents = document.getElementById(printSectionId).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
    document.getElementById(printSectionId).hidden = true;
  }
}
