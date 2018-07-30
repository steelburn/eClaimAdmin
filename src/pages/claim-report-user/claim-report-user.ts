import { Component, ElementRef, Renderer, } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
/**
 * Generated class for the ClaimReportUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report-user',
  templateUrl: 'claim-report-user.html',
})
export class ClaimReportUserPage {
  monthsList: any[] = [];
  claimsList: any[];
  claimsListPrint:any[];
  totalClaimAmount: number = 0;
  loginUserGuid: string;
  month: string;
  year: string;
  empData: any;
  baseResourceUrlSummery: string;
  claimsListSummery: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private el: ElementRef, private renderer: Renderer, private alertCtrl: AlertController) {
    this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    this.BindMonths();
    this.BindEmpDetails();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportUserPage');
  }

  BindData(printSectionId: any, item: string) {
    if (this.loginUserGuid !== undefined) {
      this.totalClaimAmount = 0;
      this.month = item.split('-')[0];
      this.year = item.split('-')[1];
      this.http
        .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(USER_GUID=' + this.loginUserGuid + ')AND(MONTH=' + this.month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
        .map(res => res.json())
        .subscribe(data => {
          this.claimsList = data["resource"];
          this.claimsListPrint=this.claimsList;
          this.claimsList.forEach(element => {
            this.totalClaimAmount = this.totalClaimAmount + element.Total;
          });
        });
        this.BindSummeryData();
    }

    let alert1 = this.alertCtrl.create({
      title: 'Print Report',
      message: 'Preparing printing...',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            return
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.printToCart(printSectionId);
          }
        }
      ]
    })
    alert1.present();
  }

  BindEmpDetails() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display?filter=(USER_GUID=' + this.loginUserGuid + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.empData = data["resource"];
      });
  }

  BindSummeryData() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report_summery?filter=(USER_GUID=' + this.loginUserGuid + ')AND(MONTH=' + this.month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.claimsListSummery = data["resource"];
      });
      console.log(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report_summery?filter=(USER_GUID=' + this.loginUserGuid + ')AND(MONTH=' + this.month + ')AND(YEAR=' + this.year + ')&api_key=' + constants.DREAMFACTORY_API_KEY);
      console.log (this.claimsListSummery);
  }

  printToCart(printSectionId: any) {
    // let part = this.el.nativeElement.querySelector(printSectionId);
    // this.renderer.setElementStyle(part, 'display', 'block');
    this.renderer;
    window.onload;
    document.getElementById(printSectionId).hidden = false;
    var innerContents = document.getElementById(printSectionId).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
    document.getElementById(printSectionId).hidden = true;
  }

  BindMonths() {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    let item = ''; let val = 12;

    for (let i = 0; i <= 11; i++) {
      if ((currentMonth - i) > 0) {
        item = this.getMonthName(currentMonth - i) + '-' + currentYear;
      }
      else {
        item = this.getMonthName(val) + '-' + (currentYear - 1);
        val--;
      }
      this.monthsList.push(item);
    }
  }

  getMonthName(currentMonth: number) {
    let monthName = currentMonth === 1 ? 'Jan' : currentMonth === 2 ? 'Feb' : currentMonth === 3 ? 'Mar' : currentMonth === 4 ? 'Apr' :
      currentMonth === 5 ? 'May' : currentMonth === 6 ? 'Jun' : currentMonth === 7 ? 'Jul' : currentMonth === 8 ? 'Aug' :
        currentMonth === 9 ? 'Sep' : currentMonth === 10 ? 'Oct' : currentMonth === 11 ? 'Nov' : currentMonth === 12 ? 'Dec' : '';
    return monthName;
  }



}