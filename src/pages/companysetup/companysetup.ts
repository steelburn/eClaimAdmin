import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the CompanysetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-companysetup',
  templateUrl: 'companysetup.html',
})
export class CompanysetupPage {

   Companyform: FormGroup;
   public AddCompanyClicked: boolean = false; 
   
    public AddCompanyClick() {

        this.AddCompanyClicked = true; 
    }

      public CloseCompanyClick() {

        this.AddCompanyClicked = false; 
    }


  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder) {

    this.Companyform = fb.group({
      
      companyname:'',
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanysetupPage');
  }

}
