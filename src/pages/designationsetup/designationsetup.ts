import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the DesignationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-designationsetup',
  templateUrl: 'designationsetup.html',
})
export class DesignationsetupPage {

   Designationform: FormGroup;
   public AddDesignationClicked: boolean = false; 
   
    public AddDesignationClick() {

        this.AddDesignationClicked = true; 
    }

      public CloseDesignationClick() {

        this.AddDesignationClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder) {

        this.Designationform = fb.group({
      
      designationname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesignationsetupPage');
  }

}
