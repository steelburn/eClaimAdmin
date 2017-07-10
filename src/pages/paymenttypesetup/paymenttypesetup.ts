import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the PaymenttypesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-paymenttypesetup',
  templateUrl: 'paymenttypesetup.html',
})
export class PaymenttypesetupPage {
Paymentform: FormGroup;
   public AddPaymenttypeClicked: boolean = false; 
   
    public AddPaymenttypeClick() {

        this.AddPaymenttypeClicked = true; 
    }

      public ClosePaymenttypeClick() {

        this.AddPaymenttypeClicked = false; 
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder) {
        this.Paymentform = fb.group({
      
      paymentname:'',
     
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymenttypesetupPage');
  }

}
