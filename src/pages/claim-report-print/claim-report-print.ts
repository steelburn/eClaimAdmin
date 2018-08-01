import { Component, Input } from '@angular/core';
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.claimsListPrint.forEach(element => {
      element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
      element.START_TS = new Date(element.START_TS.replace(/-/g, "/"))
      element.END_TS = new Date(element.END_TS.replace(/-/g, "/"))

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPrintPage');
  }

}
