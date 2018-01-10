import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { TenantMainSetup_Model } from '../../models/tenantmainsetup_model';
import { TenantMainSetup_Service } from '../../services/tenantmainsetup_service';

import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';

import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';

import { UserMain_Model } from '../../models/user_main_model';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserSetup_Service } from '../../services/usersetup_service';


import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';

/**
 * Generated class for the TenantsetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tenantsetup',
  templateUrl: 'tenantsetup.html', providers: [TenantMainSetup_Service, TenantCompanySetup_Service, TenantCompanySiteSetup_Service, UserSetup_Service, BaseHttpService]
})
export class TenantsetupPage {
  tenant_main_entry: TenantMainSetup_Model = new TenantMainSetup_Model();
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  usermain_entry: UserMain_Model = new UserMain_Model();
  userinfo_entry: UserInfo_Model = new UserInfo_Model();

  Tenantform: FormGroup; TenantUSerform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl_tenantuser: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_tenantuser' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl_tenantuser: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantuser?filter=(TENANT_GUID=" + this.tenant_company_site_entry.SITE_NAME + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  public tenants: TenantCompanySiteSetup_Model[] = [];
  public tenantusers: any;

  //Set the Model Name for Add------------------------------------------
  public TENANT_NAME_ngModel_Add: any;
  public TENANT_COMPANY_NAME_ngModel_Add: any;
  public COMPANY_SITE_NAME_ngModel_Add: any;
  public ADDRESS1_ngModel_Add: any;
  public ADDRESS2_ngModel_Add: any;
  public ADDRESS3_ngModel_Add: any;
  public CONTACTNO_ngModel_Add: any;
  public EMAIL_ngModel_Add: any;
  public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_NO_ngModel_Add: any;
  public CONTACT_PERSON_EMAIL_ngModel_Add: any;
  public WEBSITE_ngModel_Add: any;
  public ISHQ_FLAG_ngModel_Add: any;
  public ACTIVE_FLAG_ngModel_Add: any;

  public SITE_NAME_ngModel_Add: any;
  public REGISTRATION_NUM_ngModel_Add: any;
  public ADDRESS_ngModel_Add: any;
  //public EMAIL_ngModel_Add: any;
  public CONTACT_NO_ngModel_Add: any;
  //public WEBSITE_ngModel_Add: any;
  //public CONTACT_PERSON_ngModel_Add: any;
  public CONTACT_PERSON_CONTACT_NO_ngModel_Add: any;
  //public CONTACT_PERSON_EMAIL_ngModel_Add: any;

  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public SITE_NAME_ngModel_Edit: any;
  public REGISTRATION_NUM_ngModel_Edit: any;
  public ADDRESS_ngModel_Edit: any;
  public EMAIL_ngModel_Edit: any;
  public CONTACT_NO_ngModel_Edit: any;
  public WEBSITE_ngModel_Edit: any;
  public CONTACT_PERSON_ngModel_Edit: any;
  public CONTACT_PERSON_CONTACT_NO_ngModel_Edit: any;
  public CONTACT_PERSON_EMAIL_ngModel_Edit: any;

  //Set the Model Name for Tenant User for Add---------------------------
  public User_Tenantid_ngModel_Add: any;
  public User_Loginid_ngModel_Add: any;
  public User_Password_ngModel_Add: any;
  public User_Email_ngModel_Add: any;
  public User_Role_ngModel_Add: any;
  //---------------------------------------------------------------------

  public AddTUserClicked: boolean = false;
  public AddTTUserClicked: boolean = false;
  public AddTenantClicked: boolean = false;
  public EditTenantClicked: boolean = false;
  public Exist_Record: boolean = false;

  public tenant_details: any;
  public exist_record_details: any;

  public AddTenantClick() {
    this.AddTenantClicked = true;
    this.ClearControls();
  }

  public AddTUserClick(TENANT_COMPANY_SITE_GUID: any) {
    this.AddTUserClicked = true;
    //----------------For tenant User-------------------
    //this.baseResourceUrl_tenantuser = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantuser?filter=(TENANT_GUID=" + this.tenant_company_site_entry.SITE_NAME + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(this.baseResourceUrl_tenantuser)
      .map(res => res.json())
      .subscribe(data => {
        this.tenantusers = data.resource;
        //alert(this.tenantusers[0]["TENANT_GUID"]);

        localStorage.setItem('PREV_TENANT_COMPANY_SITE_GUID', TENANT_COMPANY_SITE_GUID);
      });
    //--------------------------------------------------
  }

  public CloseTUserClick() {

    this.AddTUserClicked = false;
  }

  public AddTTUserClick() {
    this.AddTTUserClicked = true;
    //alert(this.tenantusers[0]["TENANT_GUID"]);
  }

  public CloseTTUserClick() {

    this.AddTTUserClicked = false;
  }

  public EditClick(TENANT_COMPANY_SITE_GUID: any) {
    this.ClearControls();
    console.log(TENANT_COMPANY_SITE_GUID);
    this.EditTenantClicked = true;
    var self = this;
    this.tenantcompanysitesetupservice
      .get(TENANT_COMPANY_SITE_GUID)
      .subscribe((data) => {
        self.tenant_details = data;
        this.SITE_NAME_ngModel_Edit = self.tenant_details.SITE_NAME; localStorage.setItem('Prev_ten_Category', self.tenant_details.SITE_NAME); //console.log(self.mileage_details.CATEGORY);
        this.REGISTRATION_NUM_ngModel_Edit = self.tenant_details.REGISTRATION_NUM;
        this.ADDRESS_ngModel_Edit = self.tenant_details.ADDRESS;
        this.EMAIL_ngModel_Edit = self.tenant_details.EMAIL;
        this.CONTACT_NO_ngModel_Edit = self.tenant_details.CONTACT_NO;
        this.WEBSITE_ngModel_Edit = self.tenant_details.WEBSITE;
        this.CONTACT_PERSON_ngModel_Edit = self.tenant_details.CONTACT_PERSON;
        this.CONTACT_PERSON_CONTACT_NO_ngModel_Edit = self.tenant_details.CONTACT_PERSON_CONTACT_NO;
        this.CONTACT_PERSON_EMAIL_ngModel_Edit = self.tenant_details.CONTACT_PERSON_EMAIL;
      });
  }

  public DeleteClick(TENANT_COMPANY_SITE_GUID: any) {
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
            this.tenantcompanysitesetupservice.remove(TENANT_COMPANY_SITE_GUID)
              .subscribe(() => {
                self.tenants = self.tenants.filter((item) => {
                  this.tenantcompanysitesetupservice.remove(TENANT_COMPANY_SITE_GUID)
                  return item.TENANT_COMPANY_SITE_GUID != TENANT_COMPANY_SITE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseTenantClick() {

    if (this.AddTenantClicked == true) {
      this.AddTenantClicked = false;
    }
    if (this.EditTenantClicked == true) {
      this.EditTenantClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb_tenant: FormBuilder, fb_user: FormBuilder, public http: Http, private httpService: BaseHttpService, private TenantMainSetupService: TenantMainSetup_Service, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service, private userservice: UserSetup_Service, private alertCtrl: AlertController) {
    // if(localStorage.getItem("g_USER_GUID")=="sva"){
    //   alert("bijay");
    // }
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.tenants = data.resource;
      });

    this.Tenantform = fb_tenant.group({
      //SITE_NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],      
      //REGISTRATION_NUM: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      //EMAIL: [null, Validators.compose([Validators.pattern('\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b'), Validators.required])],

      //ADDRESS: ["", Validators.required],
      //CONTACT_NO: ["", Validators.required],
      //WEBSITE: ["", Validators.required],
      //CONTACT_PERSON: ["", Validators.required],
      //CONTACT_PERSON_CONTACT_NO: ["", Validators.required],
      //CONTACT_PERSON_EMAIL: ["", Validators.required],


      TENANT_NAME: ["", Validators.required],
      TENANT_COMPANY_NAME: ["", Validators.required],
      COMPANY_SITE_NAME: ["", Validators.required],
      REGISTRATION_NUM: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      ADDRESS1: ["", Validators.required],
      ADDRESS2: ["", Validators.required],
      ADDRESS3: ["", Validators.required],
      CONTACT_NO: ["", Validators.required],
      EMAIL: [null, Validators.compose([Validators.pattern('\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b'), Validators.required])],
      CONTACT_PERSON: ["", Validators.required],
      CONTACT_PERSON_NO: ["", Validators.required],
      CONTACT_PERSON_EMAIL: [null, Validators.compose([Validators.pattern('\\b[\\w.%-]+@[-.\\w]+\\.[A-Za-z]{2,4}\\b'), Validators.required])],
      WEBSITE: ["", Validators.required],
      ISHQ_FLAG: ["", Validators.required],
      ACTIVE_FLAG: ["", Validators.required],
    });

    this.TenantUSerform = fb_user.group({
      //-------------For Tenant User--------------------
      //TUTENANTID: [null],
      TULOGINID: ["", Validators.required],
      TUPASSWORD: ["", Validators.required],
      TUEMAIL: ["", Validators.required],
      TUSERROLE: ["", Validators.required],
      //------------------------------------------------
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantsetupPage');
  }

  Save_Tenant_Main() {
    this.tenant_main_entry.TENANT_GUID = UUID.UUID();
    this.tenant_main_entry.PARENT_TENANT_GUID = "";
    this.tenant_main_entry.TENANT_ACCOUNT_NAME = this.TENANT_NAME_ngModel_Add.trim();
    if (this.ACTIVE_FLAG_ngModel_Add == true) {
      this.tenant_main_entry.ACTIVATION_FLAG = "1";
    }
    else {
      this.tenant_main_entry.ACTIVATION_FLAG = "0";
    }
    //this.tenant_main_entry.ACTIVATION_FLAG = this.ACTIVE_FLAG_ngModel_Add;
    this.tenant_main_entry.CREATION_TS = new Date().toISOString();
    this.tenant_main_entry.CREATION_USER_GUID = "sva";
    this.tenant_main_entry.UPDATE_TS = new Date().toISOString();
    this.tenant_main_entry.UPDATE_USER_GUID = "";

    this.TenantMainSetupService.save(this.tenant_main_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Tenant Main Registered successfully');
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          this.Save_Tenant_Company();
        }
      })
  }

  Save_Tenant_Company() {
    this.tenant_company_entry.TENANT_COMPANY_GUID = UUID.UUID();
    this.tenant_company_entry.TENANT_GUID = this.tenant_main_entry.TENANT_GUID;
    //localStorage.setItem('tenant_main_entry_TENANT_GUID', this.tenant_main_entry.TENANT_GUID);
    this.tenant_company_entry.NAME = this.TENANT_COMPANY_NAME_ngModel_Add.trim();
    this.tenant_company_entry.REGISTRATION_NO = this.REGISTRATION_NUM_ngModel_Add.trim();
    if (this.ACTIVE_FLAG_ngModel_Add == true) {
      this.tenant_company_entry.ACTIVATION_FLAG = "1";
    }
    else {
      this.tenant_company_entry.ACTIVATION_FLAG = "0";
    }
    this.tenant_company_entry.CREATION_TS = new Date().toISOString();
    this.tenant_company_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
    this.tenant_company_entry.UPDATE_TS = new Date().toISOString();
    this.tenant_company_entry.UPDATE_USER_GUID = "";

    this.TenantCompanySetupService.save(this.tenant_company_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Tenant Company Registered successfully');
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          this.Save_Tenant_Company_Site();
        }
      })
  }

  Save_Tenant_Company_Site() {
    this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
    this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
    this.tenant_company_site_entry.SITE_NAME = this.COMPANY_SITE_NAME_ngModel_Add.trim();
    this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Add.trim();
    this.tenant_company_site_entry.ADDRESS = this.ADDRESS1_ngModel_Add.trim();
    this.tenant_company_site_entry.ADDRESS2 = this.ADDRESS2_ngModel_Add.trim();
    this.tenant_company_site_entry.ADDRESS3 = this.ADDRESS3_ngModel_Add.trim();
    this.tenant_company_site_entry.CONTACT_NO = this.CONTACTNO_ngModel_Add.trim();
    this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Add.trim();
    if (this.ACTIVE_FLAG_ngModel_Add == true) {
      this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
    }
    else {
      this.tenant_company_site_entry.ACTIVATION_FLAG = "0";
    }
    this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Add.trim();
    this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_NO_ngModel_Add.trim();
    this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Add.trim();
    this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Add.trim();
    this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
    this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
    this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
    this.tenant_company_site_entry.UPDATE_USER_GUID = "";
    if (this.ISHQ_FLAG_ngModel_Add == true) {
      this.tenant_company_site_entry.ISHQ = "1";
    }
    else {
      this.tenant_company_site_entry.ISHQ = "0";
    }
    this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Tenant Company Site Registered successfully');
          alert('Tenant Registered successfully');
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      })
  }

  Save_Tenant_User() {
    //alert(localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID'));
    //alert(this.tenantusers[0]["TENANT_GUID"]);

    this.usermain_entry.USER_GUID = UUID.UUID();
    this.usermain_entry.TENANT_GUID = this.tenant_main_entry.TENANT_GUID;
    //this.usermain_entry.TENANT_GUID = this.tenantusers[0]["TENANT_GUID"];
    this.usermain_entry.TENANT_GUID = localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID');

    this.usermain_entry.LOGIN_ID = this.User_Loginid_ngModel_Add.trim();
    this.usermain_entry.PASSWORD = this.User_Password_ngModel_Add.trim();
    this.usermain_entry.EMAIL = this.User_Email_ngModel_Add.trim();
    //this.usermain_entry. = this.User_Role_ngModel_Add.trim();

    this.usermain_entry.ACTIVATION_FLAG = 1;
    this.usermain_entry.CREATION_TS = new Date().toISOString();
    this.usermain_entry.CREATION_USER_GUID = "sva";
    this.usermain_entry.UPDATE_TS = new Date().toISOString();
    this.usermain_entry.UPDATE_USER_GUID = "";

    this.userservice.save_user_main(this.usermain_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          this.Save_Tenant_User_Info();
          
          // alert('Tenant User Registered successfully');
          // this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      })
  }

  Save_Tenant_User_Info() {
    this.userinfo_entry.USER_INFO_GUID = UUID.UUID();
    this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
    this.userinfo_entry.TENANT_COMPANY_GUID = localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID');
    this.userinfo_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem('PREV_TENANT_COMPANY_SITE_GUID');    
    this.userinfo_entry.CREATION_TS = new Date().toISOString();
    this.userinfo_entry.CREATION_USER_GUID = "sva";
    this.userinfo_entry.UPDATE_TS = new Date().toISOString();
    this.userinfo_entry.UPDATE_USER_GUID = "";
    
    // this.userinfo_entry.FULLNAME = "this.User_Name_ngModel.trim()";
    // this.userinfo_entry.MARITAL_STATUS = this.User_Marital_ngModel;
    // this.userinfo_entry.PERSONAL_ID_TYPE = this.User_StaffID_ngModel.trim();
    // this.userinfo_entry.PERSONAL_ID = this.User_ICNo_ngModel.trim();
    // this.userinfo_entry.DOB = this.User_DOB_ngModel.trim();
    // this.userinfo_entry.GENDER = this.User_Gender_ngModel;
    // this.userinfo_entry.USER_INFO_GUID = UUID.UUID();
    // this.userinfo_entry.USER_GUID = this.usermain_entry.USER_GUID;
    // //this.userinfo_entry.USER_GUID = "254a0525-c725-11e6-bb9f-00155de7e742";
    // //this.userinfo_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
    // //this.userinfo_entry.TENANT_COMPANY_GUID = "254a0525-c725-11e6-bb9f-00155de7e742";
    // this.userinfo_entry.CREATION_TS = new Date().toISOString();
    // this.userinfo_entry.CREATION_USER_GUID = "1";
    // this.userinfo_entry.UPDATE_TS = new Date().toISOString();
    // this.userinfo_entry.UPDATE_USER_GUID = "";
    // this.userinfo_entry.DESIGNATION_GUID = this.User_Designation_ngModel.trim();
    // this.userinfo_entry.TENANT_COMPANY_GUID = this.User_Company_ngModel.trim();

    // this.userinfo_entry.DEPT_GUID = this.User_Department_ngModel.trim();
    // // alert(this.User_Department_ngModel.trim());
    // this.userinfo_entry.JOIN_DATE = this.User_JoinDate_ngModel.trim();
    // this.userinfo_entry.CONFIRMATION_DATE = this.User_ConfirmationDate_ngModel.trim();
    // this.userinfo_entry.RESIGNATION_DATE = this.User_ResignationDate_ngModel.trim();
    // this.userinfo_entry.BRANCH = this.User_Branch_ngModel.trim();
    // this.userinfo_entry.EMPLOYEE_TYPE = this.User_EmployeeType_ngModel.trim();
    // this.userinfo_entry.APPROVER1 = this.User_Approver1_ngModel.trim();
    // this.userinfo_entry.APPROVER2 = this.User_Approver2_ngModel.trim();
    // this.userinfo_entry.EMPLOYEE_STATUS = this.User_Employment_ngModel.trim();

    this.userservice.save_user_info(this.userinfo_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('Tenant User Registered successfully');
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }
  Save() {
    if (this.Tenantform.valid) {
      //Validate existing tenant_name and tenant_company_name and tenant_compay_site_name

      //Insert Record for tenant_main------------------------------------------
      this.Save_Tenant_Main();

      //Insert Record for tenant company---------------------------------------
      //this.Save_Tenant_Company();

      //Insert Record for tenant company site----------------------------------
      //this.Save_Tenant_Company_Site();








      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      // let url: string;
      // url = this.baseResource_Url + "tenant_company_site?filter=(SITE_NAME=" + this.tenant_company_site_entry.SITE_NAME + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      // this.http.get(url, options)
      //   .map(res => res.json())
      //   .subscribe(
      //   data => {
      //     let res = data["resource"];
      //     if (res.length == 0) {
      //       console.log("No records Found");
      //       if (this.Exist_Record == false) {
      //         this.tenant_company_site_entry.SITE_NAME = this.COMPANY_SITE_NAME_ngModel_Add.trim();
      //         this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Add.trim();
      //         this.tenant_company_site_entry.ADDRESS = this.ADDRESS_ngModel_Add.trim();
      //         this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_NO = this.CONTACT_NO_ngModel_Add.trim();
      //         this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_CONTACT_NO_ngModel_Add.trim();
      //         this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Add.trim();

      //         this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
      //         this.tenant_company_site_entry.TENANT_COMPANY_GUID = "298204b8-8c85-11e7-91cd-00155de7e742";
      //         this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
      //         this.tenant_company_site_entry.CREATION_USER_GUID = "1";
      //         this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      //         this.tenant_company_site_entry.UPDATE_USER_GUID = "";

      //         this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
      //           .subscribe((response) => {
      //             if (response.status == 200) {
      //               alert('Tenant Registered successfully');                    
      //               this.navCtrl.setRoot(this.navCtrl.getActive().component);
      //             }
      //           })
      //       }
      //     }
      //     else {
      //       console.log("Records Found");
      //       alert("The Tenant is already Exist.")
      //     }

      //   },
      //   err => {
      //     this.Exist_Record = false;
      //     console.log("ERROR!: ", err);
      //   });
    }


  }

  getBankList() {
    let self = this;
    let params: URLSearchParams = new URLSearchParams();
    self.tenantcompanysitesetupservice.get_tenant(params)
      .subscribe((tenants: TenantCompanySiteSetup_Model[]) => {
        self.tenants = tenants;
      });
  }

  Update(TENANT_COMPANY_SITE_GUID: any) {
    if (this.Tenantform.valid) {
      if (this.tenant_company_site_entry.SITE_NAME == null) { this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.REGISTRATION_NUM == null) { this.tenant_company_site_entry.REGISTRATION_NUM = this.REGISTRATION_NUM_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.ADDRESS == null) { this.tenant_company_site_entry.ADDRESS = this.ADDRESS_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.EMAIL == null) { this.tenant_company_site_entry.EMAIL = this.EMAIL_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_NO == null) { this.tenant_company_site_entry.CONTACT_NO = this.CONTACT_NO_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.WEBSITE == null) { this.tenant_company_site_entry.WEBSITE = this.WEBSITE_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON == null) { this.tenant_company_site_entry.CONTACT_PERSON = this.CONTACT_PERSON_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO == null) { this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.CONTACT_PERSON_CONTACT_NO_ngModel_Edit.trim(); }
      if (this.tenant_company_site_entry.CONTACT_PERSON_EMAIL == null) { this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.CONTACT_PERSON_EMAIL_ngModel_Edit.trim(); }

      this.tenant_company_site_entry.CREATION_TS = this.tenant_details.CREATION_TS;
      this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_details.CREATION_USER_GUID;
      this.tenant_company_site_entry.UPDATE_TS = this.tenant_details.UPDATE_TS;
      this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_details.TENANT_COMPANY_GUID;
      this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = TENANT_COMPANY_SITE_GUID;
      this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
      this.tenant_company_site_entry.UPDATE_USER_GUID = "";

      if (this.SITE_NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_ten_Category')) {
        let url: string;
        url = this.baseResource_Url + "tenant_company_site?filter=(SITE_NAME=" + this.SITE_NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.SITE_NAME_ngModel_Edit.trim() + ', Previous Name : ' + localStorage.getItem('Prev_ten_Category'));

            if (res.length == 0) {
              console.log("No records Found");
              this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Tenant updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Tenant is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.tenant_company_site_entry.SITE_NAME == null) { this.tenant_company_site_entry.SITE_NAME = localStorage.getItem('Prev_ten_Category'); }
        this.tenant_company_site_entry.SITE_NAME = this.SITE_NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Tenant Type updated successfully');
              //location.reload();
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  ClearControls() {
    this.COMPANY_SITE_NAME_ngModel_Add = "";
    this.REGISTRATION_NUM_ngModel_Add = "";
    this.EMAIL_ngModel_Add = "";
    this.ADDRESS_ngModel_Add = "";
    this.EMAIL_ngModel_Add = "";
    this.CONTACT_NO_ngModel_Add = "";
    this.WEBSITE_ngModel_Add = "";
    this.CONTACT_PERSON_ngModel_Add = "";
    this.CONTACT_PERSON_CONTACT_NO_ngModel_Add = "";
    this.CONTACT_PERSON_EMAIL_ngModel_Add = "";

    this.SITE_NAME_ngModel_Edit = "";
    this.REGISTRATION_NUM_ngModel_Edit = "";
    this.EMAIL_ngModel_Edit = "";
    this.ADDRESS_ngModel_Edit = "";
    this.EMAIL_ngModel_Edit = "";
    this.CONTACT_NO_ngModel_Edit = "";
    this.WEBSITE_ngModel_Edit = "";
    this.CONTACT_PERSON_ngModel_Edit = "";
    this.CONTACT_PERSON_CONTACT_NO_ngModel_Edit = "";
    this.CONTACT_PERSON_EMAIL_ngModel_Edit = "";

    // this.ISHQ_FLAG_ngModel_Add = false;
    // this.ACTIVE_FLAG_ngModel_Add = false;
  }
}
