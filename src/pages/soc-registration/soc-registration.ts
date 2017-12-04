import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SocRegistrationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-soc-registration',
  templateUrl: 'soc-registration.html',
})
export class SocRegistrationPage {
  public AddSocClicked: boolean = false;
  public AddSocClick() {
    
        this.AddSocClicked = true;
      }
    
      public CloseSocClick() {
    
        this.AddSocClicked = false;
      }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocRegistrationPage');
  }

}
