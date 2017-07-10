import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the BranchsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-branchsetup',
  templateUrl: 'branchsetup.html',
})
export class BranchsetupPage {

  Branchform: FormGroup;
   public AddBranchsClicked: boolean = false; 
   
    public AddBranchsClick() {

        this.AddBranchsClicked = true; 
    }

      public CloseBranchsClick() {

        this.AddBranchsClicked = false; 
    }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {

      this.Branchform = fb.group({
      
      branchname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BranchsetupPage');
  }

}
