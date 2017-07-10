import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
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
Bankform: FormGroup;
   public AddBanksClicked: boolean = false; 
   
    public AddBanksClick() {

        this.AddBanksClicked = true; 
    }

      public CloseBanksClick() {

        this.AddBanksClicked = false; 
    }

  constructor(private fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams) 
  {
   this.Bankform = fb.group({
      
      bankname:'',
     
    });
  }

      
  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

}
