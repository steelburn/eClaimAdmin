import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { ModuleSetup_Model } from '../../models/modulesetup_model';
import { ModuleSetup_Service } from '../../services/modulesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModulesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modulesetup',
  templateUrl: 'modulesetup.html', providers: [ModuleSetup_Service, BaseHttpService]
})
export class ModulesetupPage {
  module_entry: ModuleSetup_Model = new ModuleSetup_Model();
  Moduleform: FormGroup;
  public pages: any;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_module' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_page: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  public modules: ModuleSetup_Model[] = [];

  public AddModuleClicked: boolean = false;
  public EditModuleClicked: boolean = false;
  public Exist_Record: boolean = false;

  public module_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  public URL_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  public URL_ngModel_Edit: any;
  //---------------------------------------------------------------------


  public AddModuleClick() {
    this.AddModuleClicked = true;
  }

  public CloseModuleClick() {

    if (this.AddModuleClicked == true) {
      this.AddModuleClicked = false;
    }
    if (this.EditModuleClicked == true) {
      this.EditModuleClicked = false;
    }
  }

  public EditClick(MODULE_GUID: any) {

    //this.ClearControls();
    this.EditModuleClicked = true;
    var self = this;
    this.modulesetupservice

      .get(MODULE_GUID)
      .subscribe((data) => {
        self.module_details = data;
        this.NAME_ngModel_Edit = self.module_details.NAME; localStorage.setItem('Prev_module_NAME', self.module_details.NAME);

        this.DESCRIPTION_ngModel_Edit = self.module_details.DESCRIPTION;
        this.URL_ngModel_Edit = self.module_details.URL;
      });
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private modulesetupservice: ModuleSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.GetPage();
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.modules = data.resource;
        });

      this.Moduleform = fb.group({
        NAME: ["", Validators.required],
        DESCRIPTION: ["", Validators.required],
        //URL: [null, Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'), Validators.required])]
        URL: ["", Validators.required]
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModulesetupPage');
  }
  GetPage() {
    this.http
      .get(this.baseResourceUrl_page)
      .map(res => res.json())
      .subscribe(data => {
        this.pages = data["resource"];
      });
  }

  Save() {
    if (this.Moduleform.valid) {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_module?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.module_entry.NAME = this.NAME_ngModel_Add.trim();
              this.module_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
              this.module_entry.URL = this.URL_ngModel_Add.trim();

              this.module_entry.MODULE_GUID = UUID.UUID();
              this.module_entry.CREATION_TS = new Date().toISOString();
              this.module_entry.CREATION_USER_GUID = "1";
              this.module_entry.UPDATE_TS = new Date().toISOString();
              this.module_entry.UPDATE_USER_GUID = "";

              this.modulesetupservice.save(this.module_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('PageSetup Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Cashcard is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }


  Update(MODULE_GUID: any) {
    if (this.Moduleform.valid) {
      if (this.module_entry.NAME == null) { this.module_entry.NAME = this.NAME_ngModel_Edit; }
      if (this.module_entry.DESCRIPTION == null) { this.module_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit; }
      if (this.module_entry.URL == null) { this.module_entry.URL = this.URL_ngModel_Edit; }

      this.module_entry.CREATION_TS = this.module_details.CREATION_TS;
      this.module_entry.CREATION_USER_GUID = this.module_details.CREATION_USER_GUID;
      this.module_entry.MODULE_GUID = MODULE_GUID;
      this.module_entry.UPDATE_TS = new Date().toISOString();
      this.module_entry.UPDATE_USER_GUID = '1';

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_module_NAME')) {
        let url: string;
        url = this.baseResource_Url + "main_module?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_module_NAME'));
            if (res.length == 0) {
              console.log("No records Found");
              this.module_entry.NAME = this.NAME_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.modulesetupservice.update(this.module_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Module updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Module is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.module_entry.NAME == null) { this.module_entry.NAME = localStorage.getItem('Prev_module_NAME'); }
        this.module_entry.NAME = this.NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.modulesetupservice.update(this.module_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Module updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //  }
      }
    }
  }

}
