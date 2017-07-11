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
Qualifyform: FormGroup;
   public AddQualifyClicked: boolean = false; 
   
    public AddQualifyClick() {

        this.AddQualifyClicked = true; 
    }

      public CloseQualifyClick() {

        this.AddQualifyClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {
    this.Qualifyform = fb.group({
      
      qualifyname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QualificationsetupPage');
  }

}
