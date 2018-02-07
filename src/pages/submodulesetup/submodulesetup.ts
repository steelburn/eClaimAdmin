import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';

import { ModuleSetup_Model } from '../../models/modulesetup_model';
import { ModuleSetup_Service } from '../../services/modulesetup_service';

import { LoginPage } from '../login/login';

/**
 * Generated class for the SubmodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 * Done By Bijay
 */
@IonicPage()
@Component({
  selector: 'page-submodulesetup',
  templateUrl: 'submodulesetup.html', providers: [ModuleSetup_Service, BaseHttpService]
})
export class SubmodulesetupPage {
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_page: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl_ModulePage: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  SubModuleform: any;

  public pages: any; 
  public modules: any;

  public AddSubModuleClicked: boolean = false;
  public AddSubModuleClick() {

    this.AddSubModuleClicked = true;

  }

  public CloseSubModuleClick() {

    if (this.AddSubModuleClicked == true) {
      this.AddSubModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private modulesetupservice: ModuleSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      //---------For binding Module---------------
      this.GetModule();

      //-----------For Binding Page-- --------------
      this.GetPage();
      //---------------------------------

      // this.http
      //   .get(this.baseResourceUrl)
      //   .map(res => res.json())
      //   .subscribe(data => {
      //     this.modules = data.resource;
      //   });

      this.SubModuleform = fb.group({
        MODULE: ["", Validators.required],
        NAME: ["", Validators.required],
        DESCRIPTION: ["", Validators.required],
        PAGE: ["", Validators.required]
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }
  }

  GetModule() {
    this.http
      .get(this.baseResourceUrl_ModulePage)
      .map(res => res.json())
      .subscribe(data => {
        this.modules = data["resource"];
      });
  }

  GetPage() {
    this.http
      .get(this.baseResourceUrl_page)
      .map(res => res.json())
      .subscribe(data => {
        this.pages = data["resource"];
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmodulesetupPage');
  }

}
