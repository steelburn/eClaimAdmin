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

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_project' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_registration' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  public socs: View_SOC_Model[] = [];
  //public socs: SocMain_Model[] = []; 
  // public socs: SocProject_Model[] = []; 
  // public socs: SocMain_Model[] = []; 

  public soc_main: SocMain_Model[] = [];
  public soc_project: SocProject_Model[] = [];
  public soc_customer: SocCustomer_Model[] = [];

  // public socs: any;

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

  public SOC_NO_ngModel_Edit: any;
  public PROJECT_NAME_ngModel_Edit: any;
  public CUSTOMER_NAME_ngModel_Edit: any;

  //public AddSocClicked: boolean = false;


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

  public SOC_GUID_FOR_UPDATE: any;
  public PROJECT_GUID_FOR_UPDATE: any;
  public CUSTOMER_GUID_FOR_UPDATE: any;

  public EditClick(id: any) {
    //--------------Take view_soc_edit--------------------------

    this.TENANT_GUID_UPDATE = id;
    this.EditSocClicked = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url1 = this.baseResource_Url + "main_customer?filter=(TENANT_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url2 = this.baseResource_Url + "main_project?filter=(TENANT_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url = this.baseResource_Url + "soc_registration?filter=(TENANT_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url1, options)
      .map(res => res.json())
      .subscribe(
        data => {
          //let res = data["resource"];
          this.soc_details_main = data["resource"];
          this.CUSTOMER_GUID_FOR_UPDATE = this.soc_details_main[0]["CUSTOMER_GUID"];
          this.CUSTOMER_NAME_ngModel_Edit = this.soc_details_main[0]["NAME"];
        });

    this.http.get(url2, options)
      .map(res => res.json())
      .subscribe(
        data => {
          //let res = data["resource"];
          this.soc_details_main = data["resource"];
          this.PROJECT_GUID_FOR_UPDATE = this.soc_details_main[0]["PROJECT_GUID"];
          this.PROJECT_NAME_ngModel_Edit = this.soc_details_main[0]["NAME"];
        });

    this.http.get(url, options)
      .map(res => res.json())
      .subscribe(
        data => {
          //let res = data["resource"];
          this.soc_details_main = data["resource"];
          this.SOC_GUID_FOR_UPDATE = this.soc_details_main[0]["SOC_GUID"];
          this.SOC_NO_ngModel_Edit = this.soc_details_main[0]["soc"];
        });
  }

  public DeleteClick(TENANT_GUID: any) {
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
            this.socservice.remove(TENANT_GUID)
              .subscribe(() => {
                self.socs = self.socs.filter((item) => {
                  return item.TENANT_GUID != TENANT_GUID
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

      this.Socform = fb.group({
        soc: ["", Validators.required],
        project_name: ["", Validators.required],
        customer_name: ["", Validators.required],
        TENANT_NAME: [null],
      });
    }








    // this.http
    //   .get(this.baseResourceUrl3)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     this.socs = data.resource;
    //     //console.table(this.socs)
    //   });
    //   this.AdminLogin = true;
    // this.Socform = fb.group({      
    //   soc: ["", Validators.required],
    //   project_name: ["", Validators.required],
    //   customer_name: ["", Validators.required],
    //   TENANT_NAME: [null],
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocRegistrationPage');
  }

  Save() {
    //Save Customer
    this.SaveCustomer();

    //Save Project
    //Save SOC

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // let options = new RequestOptions({ headers: headers });
    // let url: string;
    // url = this.baseResource_Url + "soc_main?filter=(SOC_NO=" + this.SOC_NO_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.http.get(url, options)
    //   .map(res => res.json())
    //   .subscribe(
    //     data => {
    //       let res = data["resource"];
    //       if (res.length == 0) {
    //         console.log("No records Found");
    //         if (this.Exist_Record == false) {

    //           this.customer_entry.NAME = this.CUSTOMER_NAME_ngModel_Add.trim();
    //           this.tenant_entry.TENANT_GUID = UUID.UUID();
    //           this.customer_entry.TENANT_GUID = this.tenant_entry.TENANT_GUID;
    //           this.customer_entry.CUSTOMER_GUID = UUID.UUID();
    //           this.customer_entry.CREATION_TS = new Date().toISOString();
    //           this.customer_entry.CREATION_USER_GUID = "1";
    //           this.customer_entry.UPDATE_TS = new Date().toISOString();
    //           this.customer_entry.UPDATE_USER_GUID = "";

    //           this.socservice.save_customer(this.customer_entry)
    //             .subscribe((response) => {
    //               if (response.status == 200) {
    //                 alert('Customer Registered successfully');
    //                 //location.reload();
    //                 this.navCtrl.setRoot(this.navCtrl.getActive().component);

    //                 this.project_entry.NAME = this.PROJECT_NAME_ngModel_Add.trim();
    //                 this.project_entry.PROJECT_GUID = UUID.UUID();
    //                 this.project_entry.CUSTOMER_GUID = this.customer_entry.CUSTOMER_GUID;
    //                 this.project_entry.CUSTOMER_LOCATION_GUID = "1";
    //                 // this.project_entry.TENANT_GUID = "1";
    //                 this.project_entry.TENANT_GUID = this.tenant_entry.TENANT_GUID;
    //                 this.project_entry.ACTIVATION_FLAG = "1";
    //                 this.project_entry.CREATION_TS = new Date().toISOString();
    //                 this.project_entry.CREATION_USER_GUID = "1";
    //                 this.project_entry.UPDATE_TS = new Date().toISOString();
    //                 this.socservice.save_project(this.project_entry)
    //                   .subscribe((response) => {
    //                     if (response.status == 200) {
    //                       alert('Project Registered successfully');
    //                       //location.reload();
    //                       this.navCtrl.setRoot(this.navCtrl.getActive().component);

    //                       this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add.trim();
    //                       this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID
    //                       this.soc_entry.SOC_GUID = UUID.UUID();
    //                       this.soc_entry.TENANT_GUID = this.tenant_entry.TENANT_GUID;
    //                       this.soc_entry.CREATION_TS = new Date().toISOString();
    //                       this.soc_entry.CREATION_USER_GUID = "1";
    //                       this.soc_entry.UPDATE_TS = new Date().toISOString();
    //                       this.socservice.save_main(this.soc_entry)
    //                         .subscribe((response) => {
    //                           if (response.status == 200) {
    //                             alert('SOC Main Registered successfully');
    //                             //location.reload();
    //                             this.navCtrl.setRoot(this.navCtrl.getActive().component);
    //                           }
    //                         });
    //                     }
    //                   });

    //               }
    //             });
    //         }
    //       }
    //       else {
    //         console.log("Records Found");
    //         alert("The soc registration is already Exist.")

    //       }
    //     },
    //     err => {
    //       this.Exist_Record = false;
    //       console.log("ERROR!: ", err);
    //     });
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
      //this.customer_entry.CUSTOMER_GUID = UUID.UUID();
      //this.customer_entry.CREATION_TS = new Date().toISOString();
      //this.customer_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
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
    this.socservice.save_customer(this.customer_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Customer Registered successfully');
          this.SaveProject();
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  SaveProject() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.project_entry.PROJECT_GUID = UUID.UUID();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      //this.project_entry.PROJECT_GUID = UUID.UUID();
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

    this.socservice.save_project(this.project_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Project Registered successfully');
          this.SaveSOC();
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  SaveSOC() {
    //for Save Set Entities-------------------------------------------------------------
    if (this.Add_Form == true) {
      this.soc_entry.SOC_GUID = UUID.UUID();
    }
    //for Update Set Entities------------------------------------------------------------
    else {
      //this.soc_entry.SOC_GUID = UUID.UUID();
    }
    //Common Entities-------------------------------------------------------------------
    this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add.trim();
    this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID;    
    this.soc_entry.TENANT_GUID = this.customer_entry.TENANT_GUID;
    this.soc_entry.CREATION_TS = this.customer_entry.CREATION_TS;
    this.soc_entry.CREATION_USER_GUID = this.customer_entry.CREATION_USER_GUID;
    this.soc_entry.UPDATE_TS = this.customer_entry.UPDATE_TS;
    this.soc_entry.UPDATE_USER_GUID = this.customer_entry.UPDATE_USER_GUID;
    this.socservice.save_main(this.soc_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('SOC Registered successfully');
          
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }



  SOC_GUID_UPDATE: any;
  TENANT_GUID_UPDATE: any;

  Update(TENANT_GUID: any) {
    if (this.Socform) {
      let url: string;

      if (this.Exist_Record == false) {

        this.customer_entry.NAME = this.CUSTOMER_NAME_ngModel_Edit;
        this.customer_entry.CUSTOMER_GUID = this.CUSTOMER_GUID_FOR_UPDATE;
        alert('customer' + this.CUSTOMER_GUID_FOR_UPDATE);
        this.customer_entry.TENANT_GUID = this.TENANT_GUID_UPDATE;
        alert(this.TENANT_GUID_UPDATE);
        this.customer_entry.DESCRIPTION = "1";
        this.customer_entry.CREATION_TS = new Date().toISOString();
        this.customer_entry.CREATION_USER_GUID = "1";
        this.customer_entry.UPDATE_TS = new Date().toISOString();
        this.customer_entry.UPDATE_USER_GUID = "";

        this.socservice.edit_customer(this.customer_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Customer updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });

        this.project_entry.NAME = this.PROJECT_NAME_ngModel_Edit;
        this.project_entry.PROJECT_GUID = this.PROJECT_GUID_FOR_UPDATE;
        this.project_entry.TENANT_GUID = this.TENANT_GUID_UPDATE;
        this.project_entry.CUSTOMER_GUID = this.CUSTOMER_GUID_FOR_UPDATE;
        //alert('project guid' + this.PROJECT_GUID_FOR_UPDATE);
        //this.project_entry.CUSTOMER_GUID =  this.CUSTOMER_GUID_FOR_UPDATE;
        this.project_entry.CUSTOMER_LOCATION_GUID = "1";
        //this.project_entry.TENANT_GUID = "1";
        this.project_entry.ACTIVATION_FLAG = "1";
        this.project_entry.CREATION_TS = new Date().toISOString();
        this.project_entry.CREATION_USER_GUID = "1";
        this.project_entry.UPDATE_TS = new Date().toISOString();


        this.socservice.edit_project(this.project_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Project updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });

        this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Edit.trim();
        //this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID              
        this.soc_entry.PROJECT_GUID = this.PROJECT_GUID_FOR_UPDATE;
        this.soc_entry.SOC_GUID = this.SOC_GUID_FOR_UPDATE;
        this.soc_entry.TENANT_GUID = this.TENANT_GUID_UPDATE;
        this.soc_entry.CREATION_TS = new Date().toISOString();
        this.soc_entry.CREATION_USER_GUID = "1";
        this.soc_entry.UPDATE_TS = new Date().toISOString();

        this.socservice.edit_soc(this.soc_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('SOC Main updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  ClearControls() {
    this.Tenant_Add_ngModel = "";
    this.SOC_NO_ngModel_Add = "";
    this.PROJECT_NAME_ngModel_Add = "";
    this.CUSTOMER_NAME_ngModel_Add = "";
  }
}












