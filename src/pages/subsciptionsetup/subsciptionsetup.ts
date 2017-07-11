import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the SubsciptionsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subsciptionsetup',
  templateUrl: 'subsciptionsetup.html',
})
export class SubsciptionsetupPage {
Subscriptionform: FormGroup;
   public AddSubscriptionClicked: boolean = false; 
   
    public AddSubscriptionClick() {

        this.AddSubscriptionClicked = true; 
    }

      public CloseSubscriptionClick() {

        this.AddSubscriptionClicked = false; 
    }
  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {

        this.Subscriptionform = fb.group({
      
      subscriptionname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubsciptionsetupPage');
  }

}
