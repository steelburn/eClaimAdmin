import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the CashcardsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-cashcardsetup',
  templateUrl: 'cashcardsetup.html',
})
export class CashcardsetupPage {
Cashform: FormGroup;
   public AddCashClicked: boolean = false; 
   
    public AddCashClick() {

        this.AddCashClicked = true; 
    }

      public CloseCashClick() {

        this.AddCashClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {
     this.Cashform = fb.group({
      
      cashname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashcardsetupPage');
  }

}
