import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { DepartmentSetup_Model } from '../../models/departmentsetup_model';
import { DepartmentSetup_Service } from '../../services/departmentsetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the DepartmentsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-departmentsetup',
  templateUrl: 'departmentsetup.html', providers: [DepartmentSetup_Service, BaseHttpService]
})
export class DepartmentsetupPage {
  department_entry: DepartmentSetup_Model = new DepartmentSetup_Model();
  Departmentform: FormGroup;

  baseResourceUrl: string = "";
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public departments: DepartmentSetup_Model[] = [];

  public AddDepartmentClicked: boolean = false;
  public EditDepartmentClicked: boolean = false;
  public Exist_Record: boolean = false;

  public department_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  //---------------------------------------------------------------------

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;

  public AddDepartmentClick() {
    if (this.Edit_Form == false) {
      this.AddDepartmentClicked = true; this.Add_Form = true; this.Edit_Form = false;
      this.ClearControls();
    }
    else {
      alert('Sorry !! You are in Edit Mode.');
    }
  }

  public EditClick(DEPARTMENT_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddDepartmentClicked = true; this.Add_Form = false; this.Edit_Form = true;

    var self = this;
    this.departmentsetupservice
      .get(DEPARTMENT_GUID)
      .subscribe((data) => {
        self.department_details = data;
        this.Tenant_Add_ngModel = self.department_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.department_details.NAME; localStorage.setItem('Prev_Name', self.department_details.NAME); localStorage.setItem('Prev_TenantGuid', self.department_details.TENANT_GUID);
        this.DESCRIPTION_ngModel_Add = self.department_details.DESCRIPTION;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(DEPARTMENT_GUID: any) {
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
            this.departmentsetupservice.remove(DEPARTMENT_GUID)
              .subscribe(() => {
                self.departments = self.departments.filter((item) => {
                  return item.DEPARTMENT_GUID != DEPARTMENT_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseDepartmentClick() {
    if (this.AddDepartmentClicked == true) {
      this.AddDepartmentClicked = false;
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private departmentsetupservice: DepartmentSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry !! Please Login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: 'Loading...',
      });
      this.loading.present();

      //Clear all storage values-------------------------------
      localStorage.removeItem("Prev_Name");
      localStorage.removeItem("Prev_TenantGuid");

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
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_department_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = true;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_department_details' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.AdminLogin = false;
      }

      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.departments = data.resource;

          this.loading.dismissAll();
        });
      //-------------------------------------------------------

      this.Departmentform = fb.group({
        NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        DESCRIPTION: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        TENANT_NAME: [null],
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsetupPage');
  }

  Save() {
    if (this.Departmentform.valid) {
      //for Save Set Entities-------------------------------------------------------------
      if (this.Add_Form == true) {
        this.department_entry.DEPARTMENT_GUID = UUID.UUID();
        this.department_entry.CREATION_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.department_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.department_entry.CREATION_USER_GUID = 'sva';
        }
        this.department_entry.UPDATE_TS = new Date().toISOString();
        this.department_entry.UPDATE_USER_GUID = "";
      }
      //for Update Set Entities------------------------------------------------------------
      else {
        this.department_entry.DEPARTMENT_GUID = this.department_details.DEPARTMENT_GUID;
        this.department_entry.CREATION_TS = this.department_details.CREATION_TS;
        this.department_entry.CREATION_USER_GUID = this.department_details.CREATION_USER_GUID;
        this.department_entry.UPDATE_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.department_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.department_entry.UPDATE_USER_GUID = 'sva';
        }
      }

      this.department_entry.NAME = this.NAME_ngModel_Add.trim();
      this.department_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();

      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.department_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
      }
      else {
        this.department_entry.TENANT_GUID = this.Tenant_Add_ngModel;
      }

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      if (this.NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('Prev_Name').toUpperCase() || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid')) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-------------------------------------------------------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************
              this.departmentsetupservice.save(this.department_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Department Registered successfully');

                    //Remove all storage values-----------------------------------------
                    localStorage.removeItem("Prev_Name");
                    localStorage.removeItem("Prev_TenantGuid");
                    //------------------------------------------------------------------

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************
              this.departmentsetupservice.update(this.department_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Department updated successfully');

                    //Remove all storage values-----------------------------------------
                    localStorage.removeItem("Prev_Name");
                    localStorage.removeItem("Prev_TenantGuid");
                    //------------------------------------------------------------------

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
          }
          else {
            alert("The Department is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------------------------------------------------------
        this.departmentsetupservice.update(this.department_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Department updated successfully');

              //Remove all storage values-----------------------------------------
              localStorage.removeItem("Prev_Name");
              localStorage.removeItem("Prev_TenantGuid");
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
      url = this.baseResource_Url + "main_department?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')AND(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_department?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')AND(TENANT_GUID=' + this.Tenant_Add_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.Tenant_Add_ngModel = "";
  }
}