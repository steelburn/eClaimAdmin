import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the RolesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolesetup',
  templateUrl: 'rolesetup.html',
})
export class RolesetupPage {
Roleform: FormGroup;
   public AddRoleClicked: boolean = false; 
   
    public AddRoleClick() {

        this.AddRoleClicked = true; 
    }

      public CloseRoleClick() {

        this.AddRoleClicked = false; 
    }
  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {

    this.Roleform = fb.group({
      
      rolename:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolesetupPage');
  }

}
