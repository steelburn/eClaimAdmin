import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { MileageSetup_Model } from '../../models/mileagesetup_model';
import { MileageSetup_Service } from '../../services/mileagesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MileagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-mileagesetup',
  templateUrl: 'mileagesetup.html', providers: [MileageSetup_Service, BaseHttpService]
})
export class MileagesetupPage {
  mileage_entry: MileageSetup_Model = new MileageSetup_Model();
  Mileageform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_mileage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public mileages: MileageSetup_Model[] = [];
  //public mileages: any;

  public AddMileageClicked: boolean = false;
  public EditMileageClicked: boolean = false;
  public Exist_Record: boolean = false;

  public mileage_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public CATEGORY_ngModel_Add: any;
  public RATE_PER_UNIT_ngModel_Add: any;
  public RATE_DATE_ngModel_Add: any;
  public ACTIVATION_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddMileageClick() {
    if (this.Edit_Form == false) {
      this.AddMileageClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry !! You are in Edit Mode.');
    }
  }

  public EditClick(MILEAGE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddMileageClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.mileagesetupservice
      .get(MILEAGE_GUID)
      .subscribe((data) => {
        self.mileage_details = data;

        this.Tenant_Add_ngModel = self.mileage_details.TENANT_GUID;
        this.CATEGORY_ngModel_Add = self.mileage_details.CATEGORY; localStorage.setItem('Prev_Category', self.mileage_details.CATEGORY); localStorage.setItem('Prev_TenantGuid', self.mileage_details.TENANT_GUID); localStorage.setItem('Prev_RateDate', new Date(self.mileage_details.RATE_DATE).toISOString());
        this.RATE_PER_UNIT_ngModel_Add = self.mileage_details.RATE_PER_UNIT;
        this.RATE_DATE_ngModel_Add = new Date(self.mileage_details.RATE_DATE).toISOString();

        if (self.mileage_details.ACTIVATION_FLAG == "1") {
          this.ACTIVATION_FLAG_ngModel_Add = true;
        }
        else {
          this.ACTIVATION_FLAG_ngModel_Add = false;
        }

        this.loading.dismissAll();
      });
  }

  public DeleteClick(MILEAGE_GUID: any) {
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
            this.mileagesetupservice.remove(MILEAGE_GUID)
              .subscribe(() => {
                self.mileages = self.mileages.filter((item) => {
                  return item.MILEAGE_GUID != MILEAGE_GUID
                });
              });
          }
        }
      ]
    }); alert.present();
  }

  public CloseMileageClick() {
    if (this.AddMileageClicked == true) {
      this.AddMileageClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private mileagesetupservice: MileageSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {    
    if (localStorage.getItem("g_USER_GUID") == null){
      alert('Sorry !! Please Login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();

      //Clear all storage values-------------------------------
      localStorage.removeItem("Prev_Category");
      localStorage.removeItem("Prev_TenantGuid");
      localStorage.removeItem("Prev_RateDate");

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
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_mileage_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = true;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_mileage_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = false;
      }

      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.mileages = data.resource;

          this.loading.dismissAll();
        });
      //-------------------------------------------------------

      this.Mileageform = fb.group({
        CATEGORY: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        RATE_PER_UNIT: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        RATE_DATE: ["", Validators.required],
        ACTIVATION_FLAG: ["", Validators.required],
        TENANT_NAME: [null],
      });
    }    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MileagesetupPage');
  }

  Save() {
    if (this.Mileageform.valid) {
      //for Save Set Entities-------------------------------------------------------------
      if (this.Add_Form == true) {
        this.mileage_entry.MILEAGE_GUID = UUID.UUID();

        this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Add.trim();
        this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Add.trim();
        this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Add.trim();
        this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add;

        this.mileage_entry.CREATION_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.mileage_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.mileage_entry.CREATION_USER_GUID = 'sva';
        }
        this.mileage_entry.UPDATE_TS = new Date().toISOString();
        this.mileage_entry.UPDATE_USER_GUID = "";
      }
      //for Update Set Entities------------------------------------------------------------
      else {
        this.mileage_entry.MILEAGE_GUID = this.mileage_details.MILEAGE_GUID;

        if (this.mileage_entry.CATEGORY == null) { this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Add.trim(); }
        if (this.mileage_entry.RATE_PER_UNIT == null) { this.mileage_entry.RATE_PER_UNIT = this.RATE_PER_UNIT_ngModel_Add; }
        if (this.mileage_entry.RATE_DATE == null) { this.mileage_entry.RATE_DATE = this.RATE_DATE_ngModel_Add.trim(); }
        if (this.mileage_entry.ACTIVATION_FLAG == null) { this.mileage_entry.ACTIVATION_FLAG = this.ACTIVATION_FLAG_ngModel_Add; }

        this.mileage_entry.CREATION_TS = this.mileage_details.CREATION_TS;
        this.mileage_entry.CREATION_USER_GUID = this.mileage_details.CREATION_USER_GUID;
        this.mileage_entry.UPDATE_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.mileage_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.mileage_entry.UPDATE_USER_GUID = 'sva';
        }
      }

      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.mileage_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
      }
      else {
        this.mileage_entry.TENANT_GUID = this.Tenant_Add_ngModel;
      }

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //-------------------------------------------------- 

      if (this.CATEGORY_ngModel_Add.trim().toUpperCase() != localStorage.getItem('Prev_Category').toUpperCase() || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid') || this.RATE_DATE_ngModel_Add != localStorage.getItem('Prev_RateDate')) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-------------------------------------------------------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************
              this.mileagesetupservice.save(this.mileage_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Mileage Registered successfully');

                    //Remove all storage values-----------------------------------------
                    localStorage.removeItem("Prev_Category");
                    localStorage.removeItem("Prev_TenantGuid");
                    localStorage.removeItem("Prev_RateDate");
                    //------------------------------------------------------------------

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************
              this.mileagesetupservice.update(this.mileage_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Mileage updated successfully');

                    //Remove all storage values-----------------------------------------
                    localStorage.removeItem("Prev_Category");
                    localStorage.removeItem("Prev_TenantGuid");
                    localStorage.removeItem("Prev_RateDate");
                    //------------------------------------------------------------------

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
          }
          else {
            alert("The Mileage is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------------------------------------------------------
        this.mileagesetupservice.update(this.mileage_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Mileage updated successfully');

              //Remove all storage values-----------------------------------------
              localStorage.removeItem("Prev_Category");
              localStorage.removeItem("Prev_TenantGuid");
              localStorage.removeItem("Prev_RateDate");
              //------------------------------------------------------------------

              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "main_mileage?filter=(CATEGORY=" + this.CATEGORY_ngModel_Add.trim() + ')AND(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')AND(RATE_DATE=' + this.RATE_DATE_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_mileage?filter=(CATEGORY=" + this.CATEGORY_ngModel_Add.trim() + ')AND(TENANT_GUID=' + this.Tenant_Add_ngModel + ')AND(RATE_DATE=' + this.RATE_DATE_ngModel_Add + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.CATEGORY_ngModel_Add = "";
    this.RATE_PER_UNIT_ngModel_Add = "";
    this.RATE_DATE_ngModel_Add = "";
    this.ACTIVATION_FLAG_ngModel_Add = false;
    this.Tenant_Add_ngModel = "";
  }
}