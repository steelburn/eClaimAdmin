import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the ClaimtypePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimtype',
  templateUrl: 'claimtype.html',
})
export class ClaimtypePage {

  Claimtypeform: FormGroup;
   public AddClaimtypeClicked: boolean = false; 
   
    public AddClaimtypeClick() {

        this.AddClaimtypeClicked = true; 
    }

      public CloseClaimtypeClick() {

        this.AddClaimtypeClicked = false; 
    }


  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {

     this.Claimtypeform = fb.group({
      
      claimname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimtypePage');
  }

}
