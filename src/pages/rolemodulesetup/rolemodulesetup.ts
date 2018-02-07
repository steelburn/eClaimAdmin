import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { GlobalFunction } from '../../shared/GlobalFunction';

/**
 * Generated class for the RolemodulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolemodulesetup',
  templateUrl: 'rolemodulesetup.html', providers: [BaseHttpService]
})
export class RolemodulesetupPage {
  public AddRoleModuleClicked: boolean = false;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
  

  Rolemoduleform: FormGroup;
  roles:any;

  public AddRoleModuleClick() {

    this.AddRoleModuleClicked = true;

  }

  public CloseRoleModuleClick() {

    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public http: Http, private httpService: BaseHttpService) {
    //Bind role------------------
    this.GetRole();

    this.Rolemoduleform = fb.group({
      ROLENAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      MODULE1: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

  GetRole(){
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data["resource"];
      });
  }

  Save_RoleModule() {

  }
}
