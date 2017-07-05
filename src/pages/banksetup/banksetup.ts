import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html',
})
export class BanksetupPage {

   public BankRegisterClicked: boolean = false; 
    // public BankRegisterClick() {

    //     this.BankRegisterClicked = !this.BankRegisterClicked;
    // }

  constructor(public navCtrl: NavController, public navParams: NavParams) 
  {
   
  }
  BankRegisterClick() {
     alert('hi');

        //this.BankRegisterClicked = !this.BankRegisterClicked;
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

}
