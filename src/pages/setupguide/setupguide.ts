import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the SetupguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setupguide',
  templateUrl: 'setupguide.html',
})
export class SetupguidePage {
  Branchform: FormGroup;
  CompanyClicked: boolean; HQClicked: boolean; BranchClicked: boolean; DepartmentClicked: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,fb: FormBuilder) {
    this.CompanyClicked = true; this.HQClicked = false; this.BranchClicked = false; this.DepartmentClicked = false;
    this.Branchform = fb.group({

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupguidePage');
  }

  SaveCompany(){
    this.CompanyClicked = false;
    this.HQClicked = true;
  }

  SaveHQ(){
    this.HQClicked = false;
    this.BranchClicked = true;
  }

  BackHQ(){
    this.CompanyClicked = true;
    this.HQClicked = false;
  }

  SaveBranch(){
    this.BranchClicked = false;
    this.DepartmentClicked = true;
  }

  BackBranch(){
    this.HQClicked = true;
    this.BranchClicked = false;
  }

  SaveDepartment(){

  }

  BackDepartment(){
    this.BranchClicked = true;
    this.DepartmentClicked = false;
  }

}
