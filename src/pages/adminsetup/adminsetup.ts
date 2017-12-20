import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubsciptionsetupPage } from '../subsciptionsetup/subsciptionsetup';
import { TenantsetupPage } from '../tenantsetup/tenantsetup';
import { TranslatePage } from '../translate/translate';
import { PeermissionPage } from '../peermission/peermission';
/**
 * Generated class for the AdminsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-adminsetup',
  templateUrl: 'adminsetup.html',
})
export class AdminsetupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToSubscriptionsetup(){
    this.navCtrl.push(SubsciptionsetupPage)
  }

  
  goToTenantsetup(){
    this.navCtrl.push(TenantsetupPage)
  }

  goToTranslate(){
    this.navCtrl.push(TranslatePage)
  }

  goToPermission(){
    this.navCtrl.push(PeermissionPage)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminsetupPage');
  }

}
