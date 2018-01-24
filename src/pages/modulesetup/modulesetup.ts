import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modulesetup',
  templateUrl: 'modulesetup.html',
})
export class ModulesetupPage {
  public AddModuleClicked: boolean = false; 
  public AddModuleClick() {

      this.AddModuleClicked = true; 

  }

  public CloseModuleClick() {

    if (this.AddModuleClicked == true) {
      this.AddModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModulesetupPage');
  }

}
