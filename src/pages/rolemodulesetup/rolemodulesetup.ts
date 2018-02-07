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

  public AddRoleModuleClicked: boolean = false; 
  public AddRoleModuleClick() {

      this.AddRoleModuleClicked = true; 

  }

  public CloseRoleModuleClick() {

    if (this.AddRoleModuleClicked == true) {
      this.AddRoleModuleClicked = false;
    }
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder) {
    this.Rolemoduleform = fb.group({
      ROLENAME: ["", Validators.required],
    });    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RolemodulesetupPage');
  }

}
