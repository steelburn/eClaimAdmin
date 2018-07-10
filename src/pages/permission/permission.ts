import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
// import { RoleSetup_Model } from '../../models/rolesetup_model';
// import { RoleSetup_Service } from '../../services/rolesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the PermissionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-Permission',
  templateUrl: 'Permission.html', providers: [BaseHttpService]
})
export class PermissionPage {
  
  Permissionform: FormGroup;
  public AddPermissionClicked: boolean = false;
  public EditPermissionClicked: boolean = false;
  
  modules: any;
  tenants: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private alertCtrl: AlertController) {
    //Bind Tenant-------------------------------------
    this.BindTenant();

    //Bind Role----------------------------------------
      this.BindModule();
    
    this.Permissionform = fb.group({
      TENANTNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      MODULES: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],      
    });
  }

  public AddPermissionClick() {
    this.AddPermissionClicked = true;
    
    //this.ClearControls();
  }

  public ClosePermissionClick() {
    if (this.AddPermissionClicked == true) {
      this.AddPermissionClicked = false;
    }
    if (this.EditPermissionClicked == true) {
      this.EditPermissionClicked = false;
    }
  }

  BindModule() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.modules = data.resource;
      });
  }

  BindTenant() {
    let url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_main' + '?order=TENANT_ACCOUNT_NAME&api_key=' + constants.DREAMFACTORY_API_KEY;    
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.tenants = data.resource;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PermissionPage');
  }

}
