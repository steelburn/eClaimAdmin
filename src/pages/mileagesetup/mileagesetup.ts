import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the MileagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mileagesetup',
  templateUrl: 'mileagesetup.html',
})
export class MileagesetupPage {
 Mileageform: FormGroup;
   public AddMileageClicked: boolean = false; 
   
    public AddMileageClick() {

        this.AddMileageClicked = true; 
    }

      public CloseMileageClick() {

        this.AddMileageClicked = false; 
    }
  constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {
     this.Mileageform = fb.group({
      
      mileagename:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MileagesetupPage');
  }

}
