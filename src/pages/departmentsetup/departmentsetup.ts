import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
/**
 * Generated class for the DepartmentsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-departmentsetup',
  templateUrl: 'departmentsetup.html',
})
export class DepartmentsetupPage {

   Departmentform: FormGroup;
   public AddDepartmentClicked: boolean = false; 
   
    public AddDepartmentClick() {

        this.AddDepartmentClicked = true; 
    }

      public CloseDepartmentClick() {

        this.AddDepartmentClicked = false; 
    }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb:FormBuilder) {

        this.Departmentform = fb.group({
      
      departmentname:'',
     
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsetupPage');
  }

}
