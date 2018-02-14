import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';

import { LoginPage } from '../login/login';
import { RoleSetup_Model } from '../../models/rolesetup_model';
import { RoleSetup_Service } from '../../services/rolesetup_service';

/**
 * Generated class for the RolemodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolemodulesetup',
  templateUrl: 'rolemodulesetup.html', providers: [RoleSetup_Service, BaseHttpService]
})
export class RolemodulesetupPage {
  Rolemoduleform: FormGroup;
  //For Add Module----------------------------
  ROLENAME_ngModel_Add:any;

  //------------------------------------------
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  roles: any;
  modules: any;
  
  public AddRoleModuleClicked: boolean = false; 
  public AddRoleModuleClick() {

      this.AddRoleModuleClicked = true; 

  }

  public CloseRoleModuleClick() {

    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private rolesetupservice: RoleSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //Bind Role----------------------------------------
      this.BindRole();

      //Bind Main Module---------------------------------
      this.BindModule();

      this.Rolemoduleform = fb.group({
        ROLENAME: ["", Validators.required],
        ROLEMAINMODULE: ["", Validators.required],
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }  
  }

  BindRole(){
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
    .get(url)
    .map(res => res.json())
    .subscribe(data => {
      this.roles = data.resource;
    });
  }

  BindModule(){
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
    .get(url)
    .map(res => res.json())
    .subscribe(data => {
      this.modules = data.resource;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

}
