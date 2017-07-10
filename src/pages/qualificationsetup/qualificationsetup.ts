import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the QualificationsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-qualificationsetup',
  templateUrl: 'qualificationsetup.html',
})
export class QualificationsetupPage {
  Qualificationform: FormGroup;
   public AddQualificationClicked: boolean = false; 
   
    public AddQualificationClick() {

        this.AddQualificationClicked = true; 
    }

      public CloseQualificationClick() {

        this.AddQualificationClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {
         this.Qualificationform = fb.group({
      
      qualificationtname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationsetupPage');
  }

}
