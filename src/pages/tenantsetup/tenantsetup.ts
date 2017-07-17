import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the TenantsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tenantsetup',
  templateUrl: 'tenantsetup.html',
})
export class TenantsetupPage {
Tenantform: FormGroup;
   public AddTenantClicked: boolean = false; 
   
    public AddTenantClick() {

        this.AddTenantClicked = true; 
    }

      public CloseTenantClick() {

        this.AddTenantClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {
     this.Tenantform = fb.group({
      
      tenantname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantsetupPage');
  }

}
