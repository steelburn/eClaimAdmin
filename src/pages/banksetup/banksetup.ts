import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControlDirective, FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html',
})
export class BanksetupPage {
Bankform: FormGroup;
   public BankRegisterClicked: boolean = false; 
    public BankRegisterClick() {

        this.BankRegisterClicked = !this.BankRegisterClicked;
    }

  constructor(private fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams) 
  {
   this.Bankform = fb.group({
      
      //fullname: ['', Validators.compose([Validators.maxLength(10),Validators.minLength(5), Validators.pattern('[a-zA-Z ]*'), Validators.required])],        
      
      bankname:'',
     
    });
  }
  // BankRegisterClick() {
  //    alert('hi');

  //       //this.BankRegisterClicked = !this.BankRegisterClicked;
  //   }
  
    
  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

}
