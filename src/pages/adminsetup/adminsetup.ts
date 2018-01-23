import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubsciptionsetupPage } from '../subsciptionsetup/subsciptionsetup';
import { TenantsetupPage } from '../tenantsetup/tenantsetup';
import { TranslatePage } from '../translate/translate';
import { PeermissionPage } from '../peermission/peermission';
import {RolesetupPage} from'../rolesetup/rolesetup';
import {RolemodulesetupPage} from'../rolemodulesetup/rolemodulesetup';
import {PagesetupPage} from'../pagesetup/pagesetup';
import {ModulesetupPage} from'../modulesetup/modulesetup';
import {SubmodulesetupPage} from'../submodulesetup/submodulesetup';

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

  goToRolesetup(){
    this.navCtrl.push(RolesetupPage)
  }

  goToRoleModulesetup(){
    this.navCtrl.push(RolemodulesetupPage)
  }

  goToPagesetup(){
    this.navCtrl.push(PagesetupPage)
  }

  goToModulesetup(){
    this.navCtrl.push(ModulesetupPage)
  }

  goToSubModulesetup(){
    this.navCtrl.push(SubmodulesetupPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminsetupPage');
  }

}
