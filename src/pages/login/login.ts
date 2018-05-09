import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import * as constants from '../../app/config/constants';
import { Conditional } from '@angular/compiler';
import { Cordova } from '@ionic-native/core';
import { SetupPage } from '../setup/setup';
import { AdminsetupPage } from '../adminsetup/adminsetup';
import { SetupguidePage } from '../setupguide/setupguide';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted = false; 

  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  constructor(public navCtrl: NavController, public userData: UserData, public http: Http) {
    localStorage.clear();
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      //-----------Check if the login as super vendor-----------------------
      if (this.login.username.trim() == "sva" && this.login.password.trim() == "sva") {
        localStorage.setItem("g_USER_GUID", "sva");
        
        //navigate to app.component page
        this.userData.login(this.login.username);

        //this.navCtrl.push(AdminsetupPage);
        this.navCtrl.push(SetupguidePage);
      }
      else {        
        let url: string;

        //CryptoJS.SHA256(this.login.password.trim()).toString(CryptoJS.enc.Hex)
        url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username + ')and(PASSWORD=' + CryptoJS.SHA256(this.login.password.trim()).toString(CryptoJS.enc.Hex) + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        //url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username + ')and(PASSWORD=' + this.login.password + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

        this.http
          .get(url)
          .map(res => res.json())
          .subscribe(data => {
            let res = data["resource"];//console.log(data["resource"]);
            if (res.length > 0) {
              localStorage.setItem("g_USER_GUID", res[0]["USER_GUID"]);
              localStorage.setItem("g_TENANT_GUID", res[0]["TENANT_GUID"]);
              localStorage.setItem("g_EMAIL", res[0]["EMAIL"]);
              localStorage.setItem("g_FULLNAME", res[0]["FULLNAME"]);
              localStorage.setItem("g_TENANT_COMPANY_GUID", res[0]["TENANT_COMPANY_GUID"]);
              localStorage.setItem("g_TENANT_COMPANY_SITE_GUID", res[0]["TENANT_COMPANY_SITE_GUID"]);
              localStorage.setItem("g_ISHQ", res[0]["ISHQ"]);
              localStorage.setItem("g_IS_TENANT_AMDIN", res[0]["IS_TENANT_ADMIN"]); 
              
              //Setup Guide for only Hq Users
              if(res[0]["ISHQ"] == "1" && res[0]["IS_TENANT_ADMIN"] == "1"){
                this.navCtrl.push(SetupguidePage);
              }
              else{
                this.navCtrl.push(SetupPage);
              }
              
              //navigate to app.component page
              this.userData.login(this.login.username);
            }
            else {
              localStorage.removeItem("g_USER_GUID");
              localStorage.removeItem("g_TENANT_GUID");
              localStorage.removeItem("g_EMAIL");
              localStorage.removeItem("g_FULLNAME");
              localStorage.removeItem("g_TENANT_COMPANY_GUID");
              localStorage.removeItem("g_TENANT_COMPANY_SITE_GUID");
              localStorage.removeItem("g_ISHQ");
              localStorage.removeItem("g_IS_TENANT_ADMIN");

              alert("Invalid login.")
              this.login.username = "";
              this.login.password = "";
            }
          });
      }

      // this.userData.login(this.login.username);
      // this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
