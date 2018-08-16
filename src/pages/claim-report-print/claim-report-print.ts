import { Component, Input, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ClaimReportPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report-print',
  templateUrl: 'claim-report-print.html',
})
export class ClaimReportPrintPage {

  @Input() claimsListPrint: any[];
  @Input() claimsListSummery: any[];
  @Input() empData: any;
  @Input() year: any;
  @Input() month: any;
  @Input() totalClaimAmount: number;
  @Input() claimsSocSummery: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   // this.getSocSummery();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPrintPage');
  }
  // ionViewWillEnter()
  // {
  //   this.getSocSummery();
  // }

  // ngOnInit()
  // {
  //   this.getSocSummery();
  // }
  // ngAfterContentInit()
  // {
  //   this.getSocSummery();
  // }
  // ngAfterViewInit()
  // {
  //   this.getSocSummery();
  // }
  // getSocSummery() {
  //   if (this.claimsListPrint.length != 0) {
  //     this.claimsListPrint.forEach(element => {

  //       if (element.SOC_GUID != null && this.claimsSocSummery.find(e => e.SOC_GUID == element.SOC_GUID) === undefined) {
  //         this.claimsSocSummery.push([{ "SOC_GUID": element.SOC_GUID, "SOC": element.SOC, "Total": element.Total }]);
  //       }
  //       else if (element.CUSTOMER_GUID != null && this.claimsSocSummery.find(e => e.SOC_GUID == element.CUSTOMER_GUID) === undefined) {
  //         this.claimsSocSummery.push([{ "SOC_GUID": element.CUSTOMER_GUID, "SOC": element.CUSTOMER_NAME, "Total": element.Total }]);
  //       }
  //       else {
  //         if (element.SOC_GUID != null)
  //           this.claimsSocSummery.find(e => e.SOC_GUID === element.SOC_GUID).Total += element.Total;
  //         else
  //           this.claimsSocSummery.find(e => e.SOC_GUID === element.CUSTOMER_GUID).Total += element.Total;
  //       }
  //     });
  //   }
  // }
}
