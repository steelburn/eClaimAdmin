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
  role: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = "Payment";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancePaymentTasklistPage');
  }

}
