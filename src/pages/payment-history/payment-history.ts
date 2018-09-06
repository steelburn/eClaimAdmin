import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaymentHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-history',
  templateUrl: 'payment-history.html',
})
export class PaymentHistoryPage {
role:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role="Payment";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentHistoryPage');
  }

}
