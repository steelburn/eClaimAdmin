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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPrintPage');
  }

}
