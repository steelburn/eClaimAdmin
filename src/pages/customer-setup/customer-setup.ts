import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { SocCustomer_Model } from '../../models/soc_customer_model';
import { SocCustomerLocation_Model } from '../../models/soc_customer_location_model';
import { SocMain_Service } from '../../services/socmain_service';

import { Tenant_Main_Model } from '../../models/tenant_main_model';
import { View_SOC_Model } from '../../models/view_soc_model';

import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the CustomerSetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-setup',
  templateUrl: 'customer-setup.html', providers: [SocMain_Service, BaseHttpService, TitleCasePipe]  
})
export class CustomerSetupPage {  
  customer_entry: SocCustomer_Model = new SocCustomer_Model();
  customer_location_entry: SocCustomerLocation_Model = new SocCustomerLocation_Model();
  tenant_entry: Tenant_Main_Model = new Tenant_Main_Model();
  view_entry: View_SOC_Model = new View_SOC_Model();
  Customerform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
 
  public customers: any; public customer_details: any;
  public soc_customer: SocCustomer_Model[] = [];  

  public AddCustomerClicked: boolean = false;  
  public Exist_Record: boolean = false;

  public CUSTOMER_NAME_ngModel_Add: any;
  public LOCATION_NAME_ngModel_Add: any;
  public REGISTRATION_NO_ngModel_Add: any;
  public ADDRESS1_ngModel_Add: any;
  public ADDRESS2_ngModel_Add: any;
  public ADDRESS3_ngModel_Add: any;
  public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_MOBILE_NO_ngModel_Add: any;
  public CONTACT_NO1_ngModel_Add: any;
  public CONTACT_NO2_ngModel_Add: any;
  public EMAIL_ngModel_Add: any;
  public DIVISION_ngModel_Add: any;

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  TitleHeader: string="";

  public AddCustomerClick() {
    if (this.Edit_Form == false) {
      this.AddCustomerClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
      this.TitleHeader = "REGISTER NEW CUSTOMER";
    }
    else {
      alert('Sorry !! You are in Edit Mode.');
    }
  }

  public EditClick(CUSTOMER_GUID: any, CUSTOMER_LOCATION_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    
    this.loading.present();
    this.ClearControls();
    this.AddCustomerClicked = true; this.Add_Form = false; this.Edit_Form = true;
    this.TitleHeader = "UPDATE CUSTOMER";

    var self = this;
    let CustomerEditUrl = this.baseResource_Url + "view_customer_details?filter=(CUSTOMER_GUID=" + CUSTOMER_GUID + ')AND(CUSTOMER_LOCATION_GUID='+ CUSTOMER_LOCATION_GUID +')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http.get(CustomerEditUrl)
      .map(res => res.json())
      .subscribe(
        data => {
          this.customer_details = data["resource"];

          this.Tenant_Add_ngModel = self.customer_details[0]["TENANT_GUID"]; localStorage.setItem('PREV_TENANT_GUID', self.customer_details[0]["TENANT_GUID"]);          
          this.CUSTOMER_NAME_ngModel_Add = self.customer_details[0]["CUSTOMER_NAME"]; localStorage.setItem('PREV_CUSTOMER_NAME', self.customer_details[0]["CUSTOMER_NAME"]);
          this.LOCATION_NAME_ngModel_Add = self.customer_details[0]["CUSTOMER_LOCATION_NAME"];
          this.REGISTRATION_NO_ngModel_Add = self.customer_details[0]["REGISTRATION_NO"];
          this.ADDRESS1_ngModel_Add = self.customer_details[0]["ADDRESS1"];
          this.ADDRESS2_ngModel_Add = self.customer_details[0]["ADDRESS2"];
          this.ADDRESS3_ngModel_Add = self.customer_details[0]["ADDRESS3"];
          this.CONTACT_PERSON_ngModel_Add = self.customer_details[0]["CONTACT_PERSON"];
          this.CONTACT_PERSON_MOBILE_NO_ngModel_Add = self.customer_details[0]["CONTACT_PERSON_MOBILE_NO"];
          this.CONTACT_NO1_ngModel_Add = self.customer_details[0]["CONTACT_NO1"];
          this.CONTACT_NO2_ngModel_Add = self.customer_details[0]["CONTACT_NO2"];
          this.EMAIL_ngModel_Add = self.customer_details[0]["EMAIL"];
          this.DIVISION_ngModel_Add = self.customer_details[0]["DIVISION"];

          this.loading.dismissAll();
        });
  }

  public DeleteClick(CUSTOMER_GUID: any, CUSTOMER_LOCATION_GUID: any) {
    alert('Development on progress....');
  }

  public CloseCustomerClick() {
    if (this.AddCustomerClicked == true) {
      this.AddCustomerClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }
  
  loading: Loading; 
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private socservice: SocMain_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry !! Please Login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      if (localStorage.getItem("g_USER_GUID") != "sva") {

        //Clear localStorage value--------------------------------      
        this.ClearLocalStorage();

        //fill all the tenant details----------------------------
        this.FillTenant();

        //Display Grid---------------------------------------------
        this.DisplayGrid();

        //-------------------------------------------------------
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.Customerform = fb.group({            
            customer_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            location_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            registration_no: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            address1: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            address2: [null],
            address3: [null],
            contact_person: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_person_mobile_no: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_no1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_no2: [null],
            email: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],            
            division: [null],
          });
        }
        else {
          this.Customerform = fb.group({            
            customer_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            location_name: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            registration_no: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            address1: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            address2: [null],
            address3: [null],
            contact_person: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_person_mobile_no: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_no1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            contact_no2: [null],
            email: [null, Validators.compose([Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
            //division: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
            division: [null],
            TENANT_NAME: [null, Validators.required],
          });
        }

      }
      else {
        alert('Sorry!! You are not authorized.');
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    }
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSetupPage');
  }

  ClearLocalStorage() {
    if (localStorage.getItem('PREV_TENANT_GUID') == null) {
      localStorage.setItem('PREV_TENANT_GUID', null);
    }
    else {
      localStorage.removeItem("PREV_TENANT_GUID");
    }    

    if (localStorage.getItem('PREV_CUSTOMER_NAME') == null) {
      localStorage.setItem('PREV_CUSTOMER_NAME', null);
    }
    else {
      localStorage.removeItem("PREV_CUSTOMER_NAME");
    }
  }

  FillTenant() {
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
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_customer_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = true;
    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_customer_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.AdminLogin = false;
    }

    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.customers = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    //Save Customer----------------
    this.SaveCustomer();
  }

  SaveCustomer() {
    //for Save Set Entities-------------------------------------------------------------    
    if (this.Add_Form == true) {
      this.SetEntityForCustomerAdd();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.SetEntityForCustomerUpdate();
    }
    //Common Entities-------------------------------------------------------------------
    this.SetCommonEntityForCustomerAddUpdate();

    //Loader-------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...',
    });
    this.loading.present();
    //-------------------------------------

    if (this.Tenant_Add_ngModel != localStorage.getItem('PREV_TENANT_GUID') || this.CUSTOMER_NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('PREV_CUSTOMER_NAME').toUpperCase()) {
      let val = this.CheckDuplicate();
      val.then((res) => {
        if (res.toString() == "0") {
          //**************Save service if it is new details***************************
          if (this.Add_Form == true) {
            this.InsertCustomer();
          }
          //**************Update service if it is new details*************************
          else {
            this.UpdateCustomer();
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
      this.UpdateCustomer();
    }
  }

  SetEntityForCustomerAdd() {
    this.customer_entry.CUSTOMER_GUID = UUID.UUID();
    this.customer_entry.CREATION_TS = new Date().toISOString();
    this.customer_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.customer_entry.UPDATE_TS = new Date().toISOString();
    this.customer_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForCustomerUpdate() {
    this.customer_entry.CUSTOMER_GUID = this.customer_details[0]["CUSTOMER_GUID"];
    this.customer_entry.CREATION_TS = this.customer_details[0]["CREATION_TS"];
    this.customer_entry.CREATION_USER_GUID = this.customer_details[0]["CREATION_USER_GUID"];
    this.customer_entry.UPDATE_TS = new Date().toISOString();
    this.customer_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForCustomerAddUpdate() {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.customer_entry.TENANT_GUID = this.Tenant_Add_ngModel.trim();
    }
    else {
      this.customer_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
    }
    this.customer_entry.NAME = this.titlecasePipe.transform(this.CUSTOMER_NAME_ngModel_Add.trim());
  }

  InsertCustomer() {
    this.socservice.save_customer(this.customer_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.SaveCustomerLocation();          
        }
      });
  }

  UpdateCustomer() {
    this.socservice.update_customer(this.customer_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //this.UpdateCustomerLocation();
          this.SaveCustomerLocation();
        }
      });
  }

  SaveCustomerLocation() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.SetEntityForCustomerLocationAdd();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      this.SetEntityForCustomerLocationUpdate();
    }
    //Common Entities-------------------------------------------------------------------
    this.SetCommonEntityForCustomerLocationAddUpdate();

    //**************Save service if it is new details***************************
    if (this.Add_Form == true) {
      this.InsertCustomerLocation();
    }
    //**************Update service if it is new details*************************
    else {
      this.UpdateCustomerLocation();
    }
  }

  SetEntityForCustomerLocationAdd() {
    this.customer_location_entry.CUSTOMER_LOCATION_GUID = UUID.UUID();
  }

  SetEntityForCustomerLocationUpdate() {
    this.customer_location_entry.CUSTOMER_LOCATION_GUID = this.customer_details[0]["CUSTOMER_LOCATION_GUID"];
  }

  SetCommonEntityForCustomerLocationAddUpdate() {
    this.customer_location_entry.CUSTOMER_GUID = this.customer_entry.CUSTOMER_GUID;
    this.customer_location_entry.NAME = this.titlecasePipe.transform(this.LOCATION_NAME_ngModel_Add.trim());
    this.customer_location_entry.DESCRIPTION = "NA";
    this.customer_location_entry.REGISTRATION_NO = this.REGISTRATION_NO_ngModel_Add.trim();
    this.customer_location_entry.ADDRESS1 = this.titlecasePipe.transform(this.ADDRESS1_ngModel_Add.trim());
    this.customer_location_entry.ADDRESS2 = this.titlecasePipe.transform(this.ADDRESS2_ngModel_Add.trim());
    this.customer_location_entry.ADDRESS3 = this.titlecasePipe.transform(this.ADDRESS3_ngModel_Add.trim());
    this.customer_location_entry.CONTACT_PERSON = this.titlecasePipe.transform(this.CONTACT_PERSON_ngModel_Add.trim());
    this.customer_location_entry.CONTACT_PERSON_MOBILE_NO = this.CONTACT_PERSON_MOBILE_NO_ngModel_Add.trim();
    this.customer_location_entry.CONTACT_NO1 = this.CONTACT_NO1_ngModel_Add.trim();
    this.customer_location_entry.CONTACT_NO2 = this.CONTACT_NO2_ngModel_Add.trim();
    this.customer_location_entry.EMAIL = this.EMAIL_ngModel_Add.trim().toLowerCase();
    this.customer_location_entry.DIVISION = this.titlecasePipe.transform(this.DIVISION_ngModel_Add.trim());

    this.customer_location_entry.CREATION_TS = this.customer_entry.CREATION_TS;
    this.customer_location_entry.CREATION_USER_GUID = this.customer_entry.CREATION_USER_GUID;
    this.customer_location_entry.UPDATE_TS = this.customer_entry.UPDATE_TS;
    this.customer_location_entry.UPDATE_USER_GUID = this.customer_entry.UPDATE_USER_GUID
  }

  InsertCustomerLocation() {
    this.socservice.save_customer_location(this.customer_location_entry)
      .subscribe((response) => {
        if (response.status == 200) {

          alert('Customer Registered successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageCustomerValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  UpdateCustomerLocation() {
    this.socservice.update_customer_location(this.customer_location_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Customer updated successfully');

          //Remove all storage values-----------------------------------------
          this.RemoveStorageCustomerValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  RemoveStorageCustomerValues() {
    localStorage.removeItem("PREV_TENANT_GUID");
    localStorage.removeItem("PREV_CUSTOMER_NAME");
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {      
      url = this.baseResource_Url + "main_customer?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')AND(NAME=' + this.CUSTOMER_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {      
      url = this.baseResource_Url + "main_customer?filter=(TENANT_GUID=" + this.Tenant_Add_ngModel + ')AND(NAME=' + this.CUSTOMER_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.CUSTOMER_NAME_ngModel_Add = "";
    this.LOCATION_NAME_ngModel_Add = "";
    this.REGISTRATION_NO_ngModel_Add = "";
    this.ADDRESS1_ngModel_Add = "";
    this.ADDRESS2_ngModel_Add = "";
    this.ADDRESS3_ngModel_Add = "";
    this.CONTACT_PERSON_ngModel_Add = "";
    this.CONTACT_PERSON_MOBILE_NO_ngModel_Add = "";
    this.CONTACT_NO1_ngModel_Add = "";
    this.CONTACT_NO2_ngModel_Add = "";
    this.EMAIL_ngModel_Add = "";
    this.DIVISION_ngModel_Add = "";
  }
}