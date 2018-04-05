import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

import { BaseHttpService } from '../../services/base-http';
import * as constants from '../../app/config/constants';
import { SetupPage } from '../../pages/setup/setup';

import { TenantMainSetup_Model } from '../../models/tenantmainsetup_model';
import { TenantMainSetup_Service } from '../../services/tenantmainsetup_service';

import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';

import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';

import { UserMain_Model } from '../../models/user_main_model';
// import { UserInfo_Model } from '../../models/usersetup_info_model';
// import { UserContact_Model } from '../../models/user_contact_model';
// import { UserCompany_Model } from '../../models/user_company_model';
// import { UserAddress_Model } from '../../models/usersetup_address_model';

import { UserSetup_Service } from '../../services/usersetup_service';

import { DepartmentSetup_Model } from '../../models/departmentsetup_model';
import { DepartmentSetup_Service } from '../../services/departmentsetup_service';

import { DesignationSetup_Model } from '../../models/designationsetup_model';
import { DesignationSetup_Service } from '../../services/designationsetup_service';

/**
 * Generated class for the SetupguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setupguide',
  templateUrl: 'setupguide.html', providers: [BaseHttpService, TenantMainSetup_Service, TenantCompanySetup_Service, TenantCompanySiteSetup_Service, UserSetup_Service, DepartmentSetup_Service, DesignationSetup_Service]
})
export class SetupguidePage {
  Branchform: FormGroup; loading: Loading;
  CompanyClicked: boolean; HQClicked: boolean; BranchClicked: boolean; DepartmentClicked: boolean; DesignationClicked: boolean;
  tenants: any; departments: any; designations: any; tenant_company_sites: any;

  Department: any[] = [];
  Designation: any[] = [];
  Branches: any[] = [];

  //-----------For Tenant Company Model-------------------
  Tenant_Name_ngModel: any;
  Userid_ngModel: any;
  Password_ngModel: any;

  //-----------For Tenant HQ Model------------------------
  Companyname_ngModel: any;
  HQregno_ngModel: any;
  Tenantemail_ngModel: any;
  Tenantcontactno_ngModel: any;

  //-----------For Branch Model---------------------------
  BranchSaveFlag: boolean = false;
  Branch_Name_ngModel: any;
  Branch_Regno_ngModel: any;
  Branch_Email_ngModel: any;
  Branch_Contactno_ngModel: any;
  Branch_ISHQ_FLAG_ngModel: any;

  //-----------For Department Model-----------------------
  DepartmentSaveFlag: boolean = false;
  Department_Name_ngModel: any;
  Department_Desc_ngModel: any;

  //-----------For Designation Model----------------------
  DesignationSaveFlag: boolean = false;
  Designation_Name_ngModel: any;
  Designation_Desc_ngModel: any;
  //------------------------------------------------------

  tenant_main_entry: TenantMainSetup_Model = new TenantMainSetup_Model();
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  usermain_entry: UserMain_Model = new UserMain_Model();
  // userinfo_entry: UserInfo_Model = new UserInfo_Model();
  // usercontact_entry: UserContact_Model = new UserContact_Model();
  // usercompany_entry: UserCompany_Model = new UserCompany_Model();
  // useraddress_entry: UserAddress_Model = new UserAddress_Model();

  department_entry: DepartmentSetup_Model = new DepartmentSetup_Model();
  designation_entry: DesignationSetup_Model = new DesignationSetup_Model();

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, private loadingCtrl: LoadingController, public http: Http, private httpService: BaseHttpService, private alertCtrl: AlertController, private TenantMainSetupService: TenantMainSetup_Service, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service, private userservice: UserSetup_Service, private departmentsetupservice: DepartmentSetup_Service, private designationsetupservice: DesignationSetup_Service) {
    //on the page load all the details of tenant get display----------------------------------
    this.BindControls();

    this.CompanyClicked = true; this.HQClicked = false; this.BranchClicked = false; this.DepartmentClicked = false; this.DesignationClicked = false;
    this.Branch_ISHQ_FLAG_ngModel = false;
    this.Branchform = fb.group({
      //-----------For Tenant Company-------------------
      TENANT_NAME: [''],
      USER_ID: [''],
      PASSWORD: [''],

      //-----------For Tenant HQ------------------------
      COMPANY_NAME: [''],
      HQ_REGNO: [''],
      TENANT_EMAIL: [''],
      TENANT_CONTACTNO: [''],

      //-----------For Branch---------------------------
      BRANCH_NAME: [''],
      BRANCH_REGNO: [''],
      BRANCH_EMAIL: [''],
      BRANCH_CONTACT_NO: [''],
      //ISHQ_FLAG: [''],

      //-----------For Department-----------------------
      DEPARTMENT_NAME: [''],
      DEPARTMENT_DESCRIPTION: [''],

      //-----------For Designation----------------------
      DESINATION_NAME: [''],
      DESIGNATION_DESC: [''],

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupguidePage');
  }

  SkipSetup() {
    this.navCtrl.push(SetupPage);
  }

  SaveCompany() {
    this.CompanyClicked = false;
    this.HQClicked = true;
  }

  SaveHQ() {
    this.HQClicked = false;
    this.BranchClicked = true;

    //One Record should entry to Branch for HQ---------------
    //Check if the same record exist then it will be update else insert----------------     \    
    if (this.Branches.length <= 0) {
      this.Branches.push({ BRANCH_GUID: UUID.UUID(), BRANCH_NAME: this.Companyname_ngModel.trim(), BRANCH_REGNO: this.HQregno_ngModel.trim(), BRANCH_EMAIL: this.Tenantemail_ngModel.trim(), BRANCH_CONTACTNO: this.Tenantcontactno_ngModel.trim(), ISHQ: true });
    }
    else {
      for (var item in this.Branches) {
        if (this.Branches[item]["ISHQ"] == true) {
          let HQ_BRANCH_GUID: string = this.Branches[item]["BRANCH_GUID"];

          this.Branches.splice(parseInt(item), 1);
          this.Branches.push({ BRANCH_GUID: HQ_BRANCH_GUID, BRANCH_NAME: this.Companyname_ngModel.trim(), BRANCH_REGNO: this.HQregno_ngModel.trim(), BRANCH_EMAIL: this.Tenantemail_ngModel.trim(), BRANCH_CONTACTNO: this.Tenantcontactno_ngModel.trim(), ISHQ: true });         
        }
      }
    }
  }

  BackHQ() {
    this.CompanyClicked = true;
    this.HQClicked = false;
  }

  SaveBranch() {
    this.BranchClicked = false;
    this.DepartmentClicked = true;
  }

  BackBranch() {
    this.HQClicked = true;
    this.BranchClicked = false;
  }

  SaveDepartment() {
    this.DesignationClicked = true;
    this.DepartmentClicked = false;
  }

  BackDepartment() {
    this.BranchClicked = true;
    this.DepartmentClicked = false;
  }

  SaveDesignation() {
    //Save/Update to User_main---------------------------------------
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();

    this.Save_User_Main();

    // this.loading.dismissAll();
    // this.navCtrl.push(SetupPage);

    //Save/Update to Tenant_main-------------------------------------
    //Save/Update to Tenant_company----------------------------------
    //Save/Update to Tenant_compny_site------------------------------
    //Save/Update to user_main---------------------------------------

    //this.navCtrl.push(SetupPage);
  }

  BackDesignation() {
    this.DesignationClicked = false;
    this.DepartmentClicked = true;
  }

  AddDesignation() {
    if (this.Designation_Name_ngModel != undefined && this.Designation_Name_ngModel.trim() != "") {
      if (this.Designation_Desc_ngModel != undefined && this.Designation_Desc_ngModel.trim() != "") {
        if (this.DesignationSaveFlag == false) {
          this.Designation.push({ DESIGNATION_GUID: UUID.UUID(), DESIGNATION_NAME: this.Designation_Name_ngModel.trim(), DESIGNATION_DESC: this.Designation_Desc_ngModel.trim() });
        }
        else {
          this.Designation = this.Designation.filter(item => item.DESIGNATION_GUID != localStorage.getItem("DESIGNATION_GUID"));
          this.Designation.push({ DESIGNATION_GUID: localStorage.getItem("DESIGNATION_GUID"), DESIGNATION_NAME: this.Designation_Name_ngModel.trim(), DESIGNATION_DESC: this.Designation_Desc_ngModel.trim() });

          this.DesignationSaveFlag = false;
          localStorage.removeItem("DESIGNATION_GUID");
        }

        //Clear the Controls------------------------
        this.Designation_Name_ngModel = "";
        this.Designation_Desc_ngModel = "";
      }
      else {
        alert("Fill Description !!");
      }
    }
    else {
      alert("Fill Designation !!");
    }
  }

  AddDepartment() {
    if (this.Department_Name_ngModel != undefined && this.Department_Name_ngModel.trim() != "") {
      if (this.Department_Desc_ngModel != undefined && this.Department_Desc_ngModel.trim() != "") {
        if (this.DepartmentSaveFlag == false) {
          this.Department.push({ DEPARTMENT_GUID: UUID.UUID(), DEPARTMENT_NAME: this.Department_Name_ngModel.trim(), DEPARTMENT_DESC: this.Department_Desc_ngModel.trim() });
        }
        else {
          this.Department = this.Department.filter(item => item.DEPARTMENT_GUID != localStorage.getItem("DEPARTMENT_GUID"));
          this.Department.push({ DEPARTMENT_GUID: localStorage.getItem("DEPARTMENT_GUID"), DEPARTMENT_NAME: this.Department_Name_ngModel.trim(), DEPARTMENT_DESC: this.Department_Desc_ngModel.trim() });

          this.DepartmentSaveFlag = false;
          localStorage.removeItem("DEPARTMENT_GUID");
        }

        //Clear the Controls------------------------
        this.Department_Name_ngModel = "";
        this.Department_Desc_ngModel = "";
      }
      else {
        alert("Fill Description !!");
      }
    }
    else {
      alert("Fill Department !!");
    }
  }

  AddBranch() {
    if (this.Branch_Name_ngModel != undefined && this.Branch_Name_ngModel.trim() != "") {
      if (this.Branch_Regno_ngModel != undefined && this.Branch_Regno_ngModel.trim() != "") {
        if (this.Branch_Email_ngModel != undefined && this.Branch_Email_ngModel.trim() != "") {
          if (this.Branch_Contactno_ngModel != undefined && this.Branch_Contactno_ngModel.trim() != "") {
            if (this.BranchSaveFlag == false) {
              this.Branches.push({ BRANCH_GUID: UUID.UUID(), BRANCH_NAME: this.Branch_Name_ngModel.trim(), BRANCH_REGNO: this.Branch_Regno_ngModel.trim(), BRANCH_EMAIL: this.Branch_Email_ngModel.trim(), BRANCH_CONTACTNO: this.Branch_Contactno_ngModel.trim(), ISHQ: this.Branch_ISHQ_FLAG_ngModel });
            }
            else {
              this.Branches = this.Branches.filter(item => item.BRANCH_GUID != localStorage.getItem("BRANCH_GUID"));
              this.Branches.push({ BRANCH_GUID: localStorage.getItem("BRANCH_GUID"), BRANCH_NAME: this.Branch_Name_ngModel.trim(), BRANCH_REGNO: this.Branch_Regno_ngModel.trim(), BRANCH_EMAIL: this.Branch_Email_ngModel.trim(), BRANCH_CONTACTNO: this.Branch_Contactno_ngModel.trim(), ISHQ: this.Branch_ISHQ_FLAG_ngModel });

              this.BranchSaveFlag = false;
              localStorage.removeItem("BRANCH_GUID");
            }

            //Clear the Controls------------------------
            this.Branch_Name_ngModel = "";
            this.Branch_Regno_ngModel = "";
            this.Branch_Email_ngModel = "";
            this.Branch_Contactno_ngModel = "";
            this.Branch_ISHQ_FLAG_ngModel = false;
          }
          else {
            alert('Fill Contact No. !!');
          }
        }
        else {
          alert('Fill Email !!');
        }
      }
      else {
        alert('Fill Registration No. !!');
      }
    }
    else {
      alert("Fill Branch Name !!");
    }
  }

  EditDesignation(DESIGNATION_GUID: string) {
    for (var item in this.Designation) {
      if (this.Designation[item]["DESIGNATION_GUID"] == DESIGNATION_GUID) {
        this.Designation_Name_ngModel = this.Designation[item]["DESIGNATION_NAME"];
        this.Designation_Desc_ngModel = this.Designation[item]["DESIGNATION_DESC"];

        localStorage.setItem("DESIGNATION_GUID", this.Designation[item]["DESIGNATION_GUID"]);

        this.DesignationSaveFlag = true;
        return;
      }
    }
  }

  EditDepartment(DEPARTMENT_GUID: string) {
    for (var item in this.Department) {
      if (this.Department[item]["DEPARTMENT_GUID"] == DEPARTMENT_GUID) {
        this.Department_Name_ngModel = this.Department[item]["DEPARTMENT_NAME"];
        this.Department_Desc_ngModel = this.Department[item]["DEPARTMENT_DESC"];

        localStorage.setItem("DEPARTMENT_GUID", this.Department[item]["DEPARTMENT_GUID"]);

        this.DepartmentSaveFlag = true;
        return;
      }
    }
  }

  EditBranch(BRANCH_GUID: string) {
    for (var item in this.Branches) {
      if (this.Branches[item]["BRANCH_GUID"] == BRANCH_GUID) {
        this.Branch_Name_ngModel = this.Branches[item]["BRANCH_NAME"];
        this.Branch_Regno_ngModel = this.Branches[item]["BRANCH_REGNO"];
        this.Branch_Email_ngModel = this.Branches[item]["BRANCH_EMAIL"];
        this.Branch_Contactno_ngModel = this.Branches[item]["BRANCH_CONTACTNO"];
        this.Branch_ISHQ_FLAG_ngModel = this.Branches[item]["ISHQ"];

        localStorage.setItem("BRANCH_GUID", this.Branches[item]["BRANCH_GUID"]);

        this.BranchSaveFlag = true;
        return;
      }
    }
  }

  RemoveDesignation(DESIGNATION_GUID: string) {
    if (this.DesignationSaveFlag == false) {
      this.Designation = this.Designation.filter(item => item.DESIGNATION_GUID != DESIGNATION_GUID);
    }
    else {
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  RemoveDepartment(DEPARTMENT_GUID: string) {
    if (this.DepartmentSaveFlag == false) {
      this.Department = this.Department.filter(item => item.DEPARTMENT_GUID != DEPARTMENT_GUID);
    }
    else {
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  RemoveBranch(BRANCH_GUID: any) {
    if (this.BranchSaveFlag == false) {
      this.Branches = this.Branches.filter(item => item.BRANCH_GUID != BRANCH_GUID);
    }
    else {
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  BindControls() {
    let Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_tenant_setup_guide' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')and(USER_GUID=' + localStorage.getItem('g_USER_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.http
      .get(Url)
      .map(res => res.json())
      .subscribe(data => {
        this.tenants = data.resource;

        //-----------For Tenant Company Model-------------------
        this.Tenant_Name_ngModel = this.tenants[0]["TENANT_ACCOUNT_NAME"];
        this.Userid_ngModel = this.tenants[0]["LOGIN_ID"];
        this.Password_ngModel = this.tenants[0]["PASSWORD"];

        //-----------For Tenant HQ Model------------------------
        this.Companyname_ngModel = this.tenants[0]["NAME"];
        this.HQregno_ngModel = this.tenants[0]["Company_RegNo"];
        this.Tenantemail_ngModel = this.tenants[0]["EMAIL"];
        this.Tenantcontactno_ngModel = this.tenants[0]["CONTACT_NO"];

        //-----------For Branch Model---------------------------
        this.BranchSaveFlag = false;
        this.Branches = [];
        this.Branch_Name_ngModel = "";
        this.Branch_Regno_ngModel = "";
        this.Branch_Email_ngModel = "";
        this.Branch_Contactno_ngModel = "";

        let Url_Tenant_Company_Site: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/tenant_company_site' + '?filter=(TENANT_COMPANY_GUID=' + localStorage.getItem('g_TENANT_COMPANY_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http
          .get(Url_Tenant_Company_Site)
          .map(res => res.json())
          .subscribe(data => {
            this.tenant_company_sites = data.resource;
            for (var item in this.tenant_company_sites) {             
              var HQflag;
              if (this.tenant_company_sites[item]["ISHQ"] == 1) {
                HQflag = true;
              }
              else {
                HQflag = false;
              }
              this.Branches.push({
                BRANCH_GUID: this.tenant_company_sites[item]["TENANT_COMPANY_SITE_GUID"],
                BRANCH_NAME: this.tenant_company_sites[item]["SITE_NAME"],
                BRANCH_REGNO: this.tenant_company_sites[item]["REGISTRATION_NUM"],
                BRANCH_EMAIL: this.tenant_company_sites[item]["EMAIL"],
                BRANCH_CONTACTNO: this.tenant_company_sites[item]["CONTACT_NO"],
                ISHQ: HQflag
              });
            }
          });


        // var HQflag;
        // if (this.tenants[0]["ISHQ"] == 1) {
        //   HQflag = true;
        // }
        // else {
        //   HQflag = false;
        // }

        // this.Branches.push({
        //   BRANCH_GUID: this.tenants[0]["TENANT_COMPANY_SITE_GUID"],
        //   BRANCH_NAME: this.tenants[0]["SITE_NAME"],
        //   BRANCH_REGNO: this.tenants[0]["BRANCH_REG_NO"],
        //   BRANCH_EMAIL: this.tenants[0]["EMAIL"],
        //   BRANCH_CONTACTNO: this.tenants[0]["CONTACT_NO"],
        //   ISHQ: HQflag
        // });

        //-----------For Department Model-----------------------
        this.DepartmentSaveFlag = false;
        this.Department = [];
        this.Department_Name_ngModel = "";
        this.Department_Desc_ngModel = "";

        let Url_Dept: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http
          .get(Url_Dept)
          .map(res => res.json())
          .subscribe(data => {
            this.departments = data.resource;
            for (var item in this.departments) {
              this.Department.push({ DEPARTMENT_GUID: this.departments[item]["DEPARTMENT_GUID"], DEPARTMENT_NAME: this.departments[item]["NAME"], DEPARTMENT_DESC: this.departments[item]["DESCRIPTION"] });
            }
          });

        //-----------For Designation Model----------------------
        this.DesignationSaveFlag = false;
        this.Designation = [];
        this.Designation_Name_ngModel = "";
        this.Designation_Desc_ngModel = "";

        let Url_Desig: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_designation' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http
          .get(Url_Desig)
          .map(res => res.json())
          .subscribe(data => {
            this.designations = data.resource;
            for (var item in this.designations) {
              this.Designation.push({ DESIGNATION_GUID: this.designations[item]["DESIGNATION_GUID"], DESIGNATION_NAME: this.designations[item]["NAME"], DESIGNATION_DESC: this.designations[item]["DESCRIPTION"] });
            }
          });
        this.loading.dismissAll();
      });
  }

  ClearControls() {
    //-----------For Tenant Company Model-------------------
    this.Tenant_Name_ngModel = "";
    this.Userid_ngModel = "";
    this.Password_ngModel = "";

    //-----------For Tenant HQ Model------------------------
    this.Companyname_ngModel = "";
    this.HQregno_ngModel = "";
    this.Tenantemail_ngModel = "";
    this.Tenantcontactno_ngModel = "";

    //-----------For Branch Model---------------------------
    this.BranchSaveFlag = false;
    this.Branches = [];
    this.Branch_Name_ngModel = "";
    this.Branch_Regno_ngModel = "";
    this.Branch_Email_ngModel = "";
    this.Branch_Contactno_ngModel = "";
    this.Branch_ISHQ_FLAG_ngModel = false;

    //-----------For Department Model-----------------------
    this.DepartmentSaveFlag = false;
    this.Department = [];
    this.Department_Name_ngModel = "";
    this.Department_Desc_ngModel = "";

    //-----------For Designation Model----------------------
    this.DesignationSaveFlag = false;
    this.Designation = [];
    this.Designation_Name_ngModel = "";
    this.Designation_Desc_ngModel = "";
  }

  Save_User_Main() {
    this.usermain_entry.TENANT_GUID = localStorage.getItem('g_TENANT_GUID');
    this.usermain_entry.USER_GUID = localStorage.getItem('g_USER_GUID');
    this.usermain_entry.STAFF_ID = this.tenants[0]["STAFF_ID"];

    this.usermain_entry.LOGIN_ID = this.Userid_ngModel.trim();
    this.usermain_entry.PASSWORD = this.Password_ngModel.trim();

    this.usermain_entry.EMAIL = this.tenants[0]["USER_EMAIL"];
    this.usermain_entry.ACTIVATION_FLAG = this.tenants[0]["USER_ACTIVATION_FLAG"];
    this.usermain_entry.CREATION_TS = this.tenants[0]["USER_CREATION_TS"];
    this.usermain_entry.CREATION_USER_GUID = this.tenants[0]["USER_CREATION_GUID"];
    this.usermain_entry.UPDATE_TS = new Date().toISOString();
    this.usermain_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.userservice.update_user_main(this.usermain_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          // alert('User main updated sucessfully !!');
          this.Save_Tenant_Main();
        }
      });
  }

  Save_Tenant_Main() {
    this.tenant_main_entry.TENANT_GUID = localStorage.getItem('g_TENANT_GUID');
    this.tenant_main_entry.PARENT_TENANT_GUID = "";
    this.tenant_main_entry.TENANT_ACCOUNT_NAME = this.Tenant_Name_ngModel.trim();
    this.tenant_main_entry.ACTIVATION_FLAG = this.tenants[0]["ACTIVATION_FLAG"];
    this.tenant_main_entry.CREATION_TS = this.tenants[0]["CREATION_TS"];
    this.tenant_main_entry.CREATION_USER_GUID = this.tenants[0]["USER_GUID"];
    this.tenant_main_entry.UPDATE_TS = new Date().toISOString();
    this.tenant_main_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

    this.TenantMainSetupService.update(this.tenant_main_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Tenant Main Registered successfully');
          this.Save_Tenant_Company();
        }
      })
  }

  Save_Tenant_Company() {
    this.tenant_company_entry.TENANT_COMPANY_GUID = this.tenants[0]["TENANT_COMPANY_GUID"];
    this.tenant_company_entry.TENANT_GUID = this.tenant_main_entry.TENANT_GUID;
    this.tenant_company_entry.NAME = this.Companyname_ngModel.trim();
    this.tenant_company_entry.REGISTRATION_NO = this.HQregno_ngModel.trim();
    this.tenant_company_entry.ACTIVATION_FLAG = this.tenant_main_entry.ACTIVATION_FLAG;
    this.tenant_company_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
    this.tenant_company_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
    this.tenant_company_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
    this.tenant_company_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;

    this.TenantCompanySetupService.update(this.tenant_company_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          //alert('Tenant Company Registered successfully');
          this.Save_Tenant_Company_Site();
        }
      })
  }

  Save_Tenant_Company_Site() {
    //Before insert data to db first delete all the records of particular tenant_company then insert once again.
    this.tenantcompanysitesetupservice.remove_multiple(this.tenants[0]["TENANT_COMPANY_GUID"], "tenant_company_site")
    .subscribe(
      (response) => {
        if (response.status == 200) {
          for (var item in this.Branches) {
            this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = this.Branches[item]["BRANCH_GUID"];
            this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
            this.tenant_company_site_entry.SITE_NAME = this.Branches[item]["BRANCH_NAME"];
            this.tenant_company_site_entry.REGISTRATION_NUM = this.Branches[item]["BRANCH_REGNO"];
            this.tenant_company_site_entry.ADDRESS = "";
            this.tenant_company_site_entry.ADDRESS2 = "";
            this.tenant_company_site_entry.ADDRESS3 = "";
            this.tenant_company_site_entry.CONTACT_NO = this.Branches[item]["BRANCH_CONTACTNO"];
            this.tenant_company_site_entry.EMAIL = this.Branches[item]["BRANCH_EMAIL"];
            this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
            this.tenant_company_site_entry.CONTACT_PERSON = "";
            this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = "";
            this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = "";
            this.tenant_company_site_entry.WEBSITE = "";
            this.tenant_company_site_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
            this.tenant_company_site_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
            this.tenant_company_site_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
            this.tenant_company_site_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;
            if (this.Branches[item]["ISHQ"] == true) {
              this.tenant_company_site_entry.ISHQ = "1";
            }
            else {
              this.tenant_company_site_entry.ISHQ = "0";
            }
            //this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
            this.tenantcompanysitesetupservice.save(this.tenant_company_site_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  // this.InsertDepartment();
      
                  //alert('Tenant company Site Registered successfully');
                  //this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }
              })
          }
        }
      });    
    this.InsertDepartment();
  }

  InsertDepartment() {
    //Before insert data to db first delete all the records of particular tenant then insert once again.
    this.departmentsetupservice.remove_multiple(this.tenant_company_entry.TENANT_GUID, "main_department")
      .subscribe(
        (response) => {
          if (response.status == 200) {
            for (var item in this.Department) {
              this.department_entry.DEPARTMENT_GUID = this.Department[item]["DEPARTMENT_GUID"];
              this.department_entry.NAME = this.Department[item]["DEPARTMENT_NAME"];
              this.department_entry.DESCRIPTION = this.Department[item]["DEPARTMENT_DESC"];
              this.department_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
              this.department_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
              this.department_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
              this.department_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;
              this.department_entry.TENANT_GUID = this.tenant_company_entry.TENANT_GUID;

              this.departmentsetupservice.save(this.department_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    //alert('Department Registered successfully');

                    //this.InsertDesignation();
                  }
                })
            }
            this.InsertDesignation();
          }
        });
  }

  InsertDesignation() {
    let SaveDesigFlag: boolean = false;

    //Before insert data to db first delete all the records of particular tenant then insert once again.
    this.designationsetupservice.remove_multiple(this.tenant_company_entry.TENANT_GUID, "main_designation")
      .subscribe(
        (response) => {
          if (response.status == 200) {
            for (var item in this.Designation) {
              this.designation_entry.DESIGNATION_GUID = this.Designation[item]["DESIGNATION_GUID"];
              this.designation_entry.NAME = this.Designation[item]["DESIGNATION_NAME"];
              this.designation_entry.DESCRIPTION = this.Designation[item]["DESIGNATION_DESC"];
              this.designation_entry.CREATION_TS = this.tenant_main_entry.CREATION_TS;
              this.designation_entry.CREATION_USER_GUID = this.tenant_main_entry.CREATION_USER_GUID;
              this.designation_entry.UPDATE_TS = this.tenant_main_entry.UPDATE_TS;
              this.designation_entry.UPDATE_USER_GUID = this.tenant_main_entry.UPDATE_USER_GUID;
              this.designation_entry.TENANT_GUID = this.tenant_company_entry.TENANT_GUID;

              this.designationsetupservice.save(this.designation_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
              
                    //alert('Designation Registered successfully');
                    SaveDesigFlag = true; 
                  }
                });
            }
            // if (SaveDesigFlag == true) {
              alert('Setup done successfully !!');
              this.loading.dismissAll();
              this.navCtrl.push(SetupPage);
            // }                       
          }          
        });
  }

}
