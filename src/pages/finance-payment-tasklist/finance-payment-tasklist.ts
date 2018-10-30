import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FinancePaymentTasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-finance-payment-tasklist',
  templateUrl: 'finance-payment-tasklist.html',
})
export class FinancePaymentTasklistPage {
  role: any;month: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = "Payment";
    this.month = navParams.get("month");
    if (this.month != undefined) {
      this.month = this.month.substring(0, 3);
    }
    // console.log(this.month)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancePaymentTasklistPage');
  }

}
