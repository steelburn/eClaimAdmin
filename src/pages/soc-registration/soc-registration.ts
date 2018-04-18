import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { SocMain_Model } from '../../models/socmain_model';
import { SocProject_Model } from '../../models/soc_project_model';
import { SocCustomer_Model } from '../../models/soc_customer_model';
import { SocMain_Service } from '../../services/socmain_service';

import { Tenant_Main_Model } from '../../models/tenant_main_model';
import { View_SOC_Model } from '../../models/view_soc_model';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';


/**
 * Generated class for the SocRegistrationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-soc-registration',
  templateUrl: 'soc-registration.html', providers: [SocMain_Service, BaseHttpService]
})
export class SocRegistrationPage {
  soc_entry: SocMain_Model = new SocMain_Model();
  project_entry: SocProject_Model = new SocProject_Model();
  customer_entry: SocCustomer_Model = new SocCustomer_Model();
  tenant_entry: Tenant_Main_Model = new Tenant_Main_Model();
  view_entry: View_SOC_Model = new View_SOC_Model();
  Socform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  
  public socs: View_SOC_Model[] = [];
  public soc_main: SocMain_Model[] = [];
  public soc_project: SocProject_Model[] = [];
  public soc_customer: SocCustomer_Model[] = [];

  public soc_details_main: any;
  public soc_details_project: any;
  public soc_details_customer: any;

  public AddSocClicked: boolean = false;
  public EditSocClicked: boolean = false;
  public Exist_Record: boolean = false;

  // public subscription_details: any; 
  public exist_record_details: any;

  public SOC_NO_ngModel_Add: any;
  public PROJECT_NAME_ngModel_Add: any;
  public CUSTOMER_NAME_ngModel_Add: any;
  
  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddSocClick() {
    if (this.Edit_Form == false) {
      this.AddSocClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry !! You are in Edit Mode.');
    }
  }

  public CloseSocClick() {
    if (this.AddSocClicked == true) {
      this.AddSocClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  public EditClick(id: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();
    this.ClearControls();
    this.AddSocClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    let SocEditUrl = this.baseResource_Url + "view_soc_edit?filter=(SOC_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(SocEditUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          this.soc_details_main = data["resource"];

          this.Tenant_Add_ngModel = self.soc_details_main[0]["TENANT_GUID"]; localStorage.setItem('PREV_TENANT_GUID', self.soc_details_main[0]["TENANT_GUID"]);
          this.SOC_NO_ngModel_Add = self.soc_details_main[0]["SOC_NO"]; localStorage.setItem('PREV_SOC_NO', self.soc_details_main[0]["SOC_NO"]);
          this.PROJECT_NAME_ngModel_Add = self.soc_details_main[0]["PROJECT_NAME"]; localStorage.setItem('PREV_PROJECT_NAME', self.soc_details_main[0]["PROJECT_NAME"]);
          this.CUSTOMER_NAME_ngModel_Add = self.soc_details_main[0]["CUSTOMER_NAME"]; localStorage.setItem('PREV_CUSTOMER_NAME', self.soc_details_main[0]["CUSTOMER_NAME"]);

          this.loading.dismissAll();
        });
  }

  public DeleteClick(SOC_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Do you want to remove ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
            var self = this;

            //before delete get id of main_customer and main_project table, according to that id delete the record
            let SocEditUrl = this.baseResource_Url + "view_soc_edit?filter=(SOC_GUID=" + SOC_GUID + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
            this.http.get(SocEditUrl)
              .map(res => res.json())
              .subscribe(
                data => {
                  this.soc_details_main = data["resource"];

                  //Remove from main_customer-----------------------
                  this.socservice.remove_customer(self.soc_details_main[0]["CUSTOMER_GUID"])
                    .subscribe(() => {
                      self.socs = self.socs.filter((item) => {
                        return item.SOC_GUID != SOC_GUID;
                      });
                    });

                  //Remove from main_project------------------------
                  this.socservice.remove_project(self.soc_details_main[0]["PROJECT_GUID"])
                    .subscribe(() => {
                      self.socs = self.socs.filter((item) => {
                        return item.SOC_GUID != SOC_GUID;
                      });
                    });

                  //Remove from soc_main----------------------------
                  this.socservice.remove_soc(SOC_GUID)
                    .subscribe(() => {
                      self.socs = self.socs.filter((item) => {
                        return item.SOC_GUID != SOC_GUID
                      });
                    });
                });
          }
        }
      ]
    }); alert.present();
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private socservice: SocMain_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry !! Please Login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();

      //Clear localStorage value--------------------------------      
      if (localStorage.getItem('PREV_TENANT_GUID') == null) {
        localStorage.setItem('PREV_TENANT_GUID', null);
      }
      else {
        localStorage.removeItem("PREV_TENANT_GUID");
      }

      if (localStorage.getItem('PREV_SOC_NO') == null) {
        localStorage.setItem('PREV_SOC_NO', null);
      }
      else {
        localStorage.removeItem("PREV_SOC_NO");
      }

      if (localStorage.getItem('PREV_PROJECT_NAME') == null) {
        localStorage.setItem('PREV_PROJECT_NAME', null);
      }
      else {
        localStorage.removeItem("PREV_PROJECT_NAME");
      }

      if (localStorage.getItem('PREV_CUSTOMER_NAME') == null) {
        localStorage.setItem('PREV_CUSTOMER_NAME', null);
      }
      else {
        localStorage.removeItem("PREV_CUSTOMER_NAME");
      }      

      //fill all the tenant details----------------------------
      if (localStorage.getItem("g_USER_GUID") == "sva") {
        let tenantUrl: string = this.baseResource_Url + 'tenant_main?order=TENANT_ACCOUNT_NAME&' + this.Key_Param;
        this.http
          .get(tenantUrl)
          .map(res => res.json())
          .subscribe(data => {
            this.tenants = data.resource;
          });
        this.AdminLogin = true;
      }
      else {
        this.AdminLogin = false;
      }

      //Display Grid---------------------------------------------
      if (localStorage.getItem("g_USER_GUID") == "sva") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_soc_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = true;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_soc_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = false;
      }

      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.socs = data.resource;

          this.loading.dismissAll();
        });
      //-------------------------------------------------------
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.Socform = fb.group({
          soc: ["", Validators.required],
          project_name: ["", Validators.required],
          customer_name: ["", Validators.required],
        });
      }
      else
      {
        this.Socform = fb.group({
          soc: ["", Validators.required],
          project_name: ["", Validators.required],
          customer_name: ["", Validators.required],
          TENANT_NAME: [null, Validators.required],
        });
      }
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocRegistrationPage');
  }

  Save() {
    //Save Customer----------------
    this.SaveCustomer();
  }

  SaveCustomer() {
    //for Save Set Entities-------------------------------------------------------------    
    if (this.Add_Form == true) {
      this.customer_entry.CUSTOMER_GUID = UUID.UUID();
      this.customer_entry.CREATION_TS = new Date().toISOString();
      this.customer_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.customer_entry.UPDATE_TS = new Date().toISOString();
      this.customer_entry.UPDATE_USER_GUID = "";
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.customer_entry.CUSTOMER_GUID = this.soc_details_main[0]["CUSTOMER_GUID"];
      this.customer_entry.CREATION_TS = this.soc_details_main[0]["CREATION_TS"];
      this.customer_entry.CREATION_USER_GUID = this.soc_details_main[0]["CREATION_USER_GUID"];
      this.customer_entry.UPDATE_TS = new Date().toISOString();
      this.customer_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
    }
    //Common Entities-------------------------------------------------------------------
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.customer_entry.TENANT_GUID = this.Tenant_Add_ngModel.trim();
    }
    else {
      this.customer_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    this.customer_entry.NAME = this.CUSTOMER_NAME_ngModel_Add.trim();

    //Loader-------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...',
    });
    this.loading.present();
    //-------------------------------------

    if (this.Tenant_Add_ngModel != localStorage.getItem('PREV_TENANT_GUID') || this.SOC_NO_ngModel_Add.trim().toUpperCase() != localStorage.getItem('PREV_SOC_NO').toUpperCase() || this.PROJECT_NAME_ngModel_Add != localStorage.getItem('PREV_PROJECT_NAME') || this.CUSTOMER_NAME_ngModel_Add != localStorage.getItem('PREV_CUSTOMER_NAME')) {
      let val = this.CheckDuplicate();
      val.then((res) => {
        if (res.toString() == "0") {
          //**************Save service if it is new details***************************
          if (this.Add_Form == true) {
            this.socservice.save_customer(this.customer_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  //alert('Customer Registered successfully');
                  this.SaveProject();
                  //this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              });
          }
          //**************Update service if it is new details*************************
          else {
            this.socservice.update_customer(this.customer_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  //alert('Customer Updated successfully');
                  this.SaveProject();
                }
              });
          }
        }
        else {
          alert("The SOC is already Exist.");
          this.loading.dismissAll();
        }
      });
      val.catch((err) => {
        console.log(err);
      });
    }
    else {
      //Simple update----------------------------------------------------------
      this.socservice.update_customer(this.customer_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Customer Updated successfully');
            this.SaveProject();
          }
        });
    }
  }

  SaveProject() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.project_entry.PROJECT_GUID = UUID.UUID();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.project_entry.PROJECT_GUID = this.soc_details_main[0]["PROJECT_GUID"];
    }
    //Common Entities-------------------------------------------------------------------
    this.project_entry.NAME = this.PROJECT_NAME_ngModel_Add.trim();
    this.project_entry.CUSTOMER_GUID = this.customer_entry.CUSTOMER_GUID;
    this.project_entry.CUSTOMER_LOCATION_GUID = "NA";
    this.project_entry.TENANT_GUID = this.customer_entry.TENANT_GUID;
    this.project_entry.ACTIVATION_FLAG = "1";
    this.project_entry.CREATION_TS = this.customer_entry.CREATION_TS;
    this.project_entry.CREATION_USER_GUID = this.customer_entry.CREATION_USER_GUID;
    this.project_entry.UPDATE_TS = this.customer_entry.UPDATE_TS;
    this.project_entry.UPDATE_USER_GUID = this.customer_entry.UPDATE_USER_GUID;

    //**************Save service if it is new details***************************
    if (this.Add_Form == true) {
      this.socservice.save_project(this.project_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Project Registered successfully');
            this.SaveSOC();
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
    //**************Update service if it is new details*************************
    else {
      this.socservice.update_project(this.project_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            //alert('Project Updated successfully');
            this.SaveSOC();
          }
        });
    }
  }

  SaveSOC() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.soc_entry.SOC_GUID = UUID.UUID();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.soc_entry.SOC_GUID = this.soc_details_main[0]["SOC_GUID"];
    }
    //Common Entities-------------------------------------------------------------------
    this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add.trim();
    this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID;
    this.soc_entry.TENANT_GUID = this.customer_entry.TENANT_GUID;
    this.soc_entry.CREATION_TS = this.customer_entry.CREATION_TS;
    this.soc_entry.CREATION_USER_GUID = this.customer_entry.CREATION_USER_GUID;
    this.soc_entry.UPDATE_TS = this.customer_entry.UPDATE_TS;
    this.soc_entry.UPDATE_USER_GUID = this.customer_entry.UPDATE_USER_GUID;

    //**************Save service if it is new details***************************
    if (this.Add_Form == true) {
      this.socservice.save_main(this.soc_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('SOC Registered successfully');
            //this.loading.dismissAll();

            //Remove all storage values-----------------------------------------
            localStorage.removeItem("PREV_TENANT_GUID");
            localStorage.removeItem("PREV_SOC_NO");
            localStorage.removeItem("PREV_PROJECT_NAME");
            localStorage.removeItem("PREV_CUSTOMER_NAME");
            //------------------------------------------------------------------

            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
    //**************Update service if it is new details*************************
    else {
      this.socservice.update_soc(this.soc_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('SOC Updated successfully');
            //this.loading.dismissAll();

            //Remove all storage values-----------------------------------------            
            localStorage.removeItem("PREV_TENANT_GUID");
            localStorage.removeItem("PREV_SOC_NO");
            localStorage.removeItem("PREV_PROJECT_NAME");
            localStorage.removeItem("PREV_CUSTOMER_NAME");
            //------------------------------------------------------------------

            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        });
    }
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "view_soc_details?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')AND(soc=' + this.SOC_NO_ngModel_Add.trim() + ')AND(project_name=' + this.PROJECT_NAME_ngModel_Add.trim() + ')AND(customer_name=' + this.CUSTOMER_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "view_soc_details?filter=(TENANT_GUID=" + this.Tenant_Add_ngModel + ')AND(soc=' + this.SOC_NO_ngModel_Add.trim() + ')AND(project_name=' + this.PROJECT_NAME_ngModel_Add.trim() + ')AND(customer_name=' + this.CUSTOMER_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    let result: any;
    return new Promise((resolve) => {
      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(data => {
          result = data["resource"];
          resolve(result.length);
        });
    });
  }

  ClearControls() {
    this.Tenant_Add_ngModel = "";
    this.SOC_NO_ngModel_Add = "";
    this.PROJECT_NAME_ngModel_Add = "";
    this.CUSTOMER_NAME_ngModel_Add = "";
  }
}












