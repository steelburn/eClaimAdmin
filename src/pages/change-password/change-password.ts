import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as constants from '../../app/config/constants';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseHttpService } from '../../services/base-http';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

import { UserMain_Model } from '../../models/user_main_model';
import { UserSetup_Service } from '../../services/usersetup_service';

import { LoginPage } from '../login/login';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html', providers: [UserSetup_Service, BaseHttpService]
})
export class ChangePasswordPage {
  ChangePasswordForm: FormGroup;
  usermain_entry: UserMain_Model = new UserMain_Model();

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private userservice: UserSetup_Service, private httpService: BaseHttpService) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry, please login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      if (localStorage.getItem("g_USER_GUID") == "sva") {
        alert('Sorry, you are not authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
      else {
        //Get the details of user according to user_guid.
        //------------------------------------------------
        this.GetUser_Main_Details(localStorage.getItem("g_USER_GUID"));
        //------------------------------------------------
      }
    }
    this.ChangePasswordForm = fb.group({
      Current_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      New_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      Confirm_Password: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  url = this.baseResource_Url + "user_main?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  user_details: any;

  GetUser_Main_Details(user_id: string) {
    this.http
      .get(this.url)
      .map(res => res.json())
      .subscribe(data => {
        this.user_details = data.resource; //console.log(this.user_details);
      });
  }

  Current_Password_ngModel: any = "";
  New_Password_ngModel: any = "";
  Confirm_Password_ngModel: any = "";

  ChangeePassword() {
    if (this.ChangePasswordForm.valid) {
      //check current password is match with database
      debugger;
      if (this.user_details[0]["PASSWORD"] == CryptoJS.SHA1(this.Current_Password_ngModel.trim().toUpperCase())) {
        if (this.Current_Password_ngModel.trim().toUpperCase() != this.Confirm_Password_ngModel.trim().toUpperCase()) {
          if (this.New_Password_ngModel.trim().toUpperCase() == this.Confirm_Password_ngModel.trim().toUpperCase()) {            
            this.usermain_entry.TENANT_GUID = this.user_details[0]["TENANT_GUID"];
            this.usermain_entry.USER_GUID = localStorage.getItem("g_USER_GUID");
            this.usermain_entry.STAFF_ID = this.user_details[0]["STAFF_ID"];
            this.usermain_entry.LOGIN_ID = this.user_details[0]["LOGIN_ID"];
            this.usermain_entry.PASSWORD = CryptoJS.SHA1(this.Confirm_Password_ngModel.trim()).toString();
            this.usermain_entry.EMAIL = this.user_details[0]["EMAIL"];
            this.usermain_entry.ACTIVATION_FLAG = this.user_details[0]["ACTIVATION_FLAG"];

            this.usermain_entry.CREATION_TS = this.user_details[0]["CREATION_TS"];
            this.usermain_entry.CREATION_USER_GUID = this.user_details[0]["CREATION_USER_GUID"];

            this.usermain_entry.UPDATE_TS = new Date().toISOString();
            this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

            this.userservice.update_user_main(this.usermain_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  alert('Password sucessfully changed.');
                  this.navCtrl.push(LoginPage);
                }
              });
          }
          else {
            alert('New password and confirm password is not same.');
          }
        }
        else {
          alert('Current password and confirm password is same.');
        }
      }
      else{
        alert('Current password is not correct.');
      }
    }
  }
}
