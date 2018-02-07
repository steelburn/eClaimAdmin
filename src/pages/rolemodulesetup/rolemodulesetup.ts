import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RolemodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolemodulesetup',
  templateUrl: 'rolemodulesetup.html',
})
export class RolemodulesetupPage {
  public AddRoleModuleClicked: boolean = false; 
  public AddRoleModuleClick() {

      this.AddRoleModuleClicked = true; 

  }

  public CloseRoleModuleClick() {

    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

}
