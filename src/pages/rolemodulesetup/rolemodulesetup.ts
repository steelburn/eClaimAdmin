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
  templateUrl: 'rolemodulesetup.html',
})
export class RolemodulesetupPage {
  public AddRoleModuleClicked: boolean = false; 

  Rolemoduleform: FormGroup;

  public AddRoleModuleClick() {

      this.AddRoleModuleClicked = true; 

  }

  public CloseRoleModuleClick() {

    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {
    this.Rolemoduleform = fb.group({
      ROLENAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

  Save_RoleModule(){

  }
}
