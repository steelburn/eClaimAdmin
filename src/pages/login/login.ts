import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import * as constants from '../../app/config/constants';
import { Conditional } from '@angular/compiler';
import { Cordova } from '@ionic-native/core';
//import{}
import { EmailComposer } from '@ionic-native/email-composer';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted = false;

  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  constructor(public navCtrl: NavController, public userData: UserData, public http: Http, public emailComposer: EmailComposer) {
    localStorage.clear();
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      //-----------Check if the login as super vendor-----------------------
      if (this.login.username.trim() == "sva" && this.login.password.trim() == "sva") {
        localStorage.setItem("g_USER_GUID", "sva");
        this.navCtrl.push(TabsPage);
      }
      else {
        let url: string;
        url = this.baseResource_Url + "vw_login?filter=(LOGIN_ID=" + this.login.username.trim() + ')and(PASSWORD=' + this.login.password.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        //http://api.zen.com.my/api/v2/zcs/_table/vw_login?filter=(LOGIN_ID=bcfb798b-355e-2a9b-baaf-37289d1f1ba3)and(PASSWORD=password)&api_key=cb82c1df0ba653578081b3b58179158594b3b8f29c4ee1050fda1b7bd91c3881
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

              this.navCtrl.push(TabsPage);
            }
            else {
              localStorage.removeItem("g_USER_GUID");
              localStorage.removeItem("g_TENANT_GUID");
              localStorage.removeItem("g_EMAIL");
              localStorage.removeItem("g_FULLNAME");
              localStorage.removeItem("g_TENANT_COMPANY_GUID");
              localStorage.removeItem("g_TENANT_COMPANY_SITE_GUID");
              localStorage.removeItem("g_ISHQ");

              alert("Invalid Login!!")
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
  onEmail() {

    //   .plugins.email.open({
    //     to:      'max@mustermann.de',
    //     cc:      'erika@mustermann.de',
    //     bcc:     ['john@doe.com', 'jane@doe.com'],
    //     subject: 'Greetings',
    //     body:    'How are you? Nice greetings from Leipzig'
    // });

    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
        this.emailComposer.open({
          //from: 'ajay@zen.com.my',
          to: 'ajay@zen.com.my',
          cc: 'bijay@zen.com.my',
         // bcc: ['john@doe.com', 'jane@doe.com'],
          subject: 'Greetings',
          body: 'How are you? Nice greetings from ZeN'
        });
      }
    });
  }

}
