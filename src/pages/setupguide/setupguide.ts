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

/**
 * Generated class for the SetupguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setupguide',
  templateUrl: 'setupguide.html', providers: [BaseHttpService]
})
export class SetupguidePage {
  Branchform: FormGroup;
  CompanyClicked: boolean; HQClicked: boolean; BranchClicked: boolean; DepartmentClicked: boolean; DesignationClicked: boolean;
  tenants: any; departments: any; designations: any;

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

  //-----------For Department Model-----------------------
  DepartmentSaveFlag: boolean = false;
  Department_Name_ngModel: any;
  Department_Desc_ngModel: any;

  //-----------For Designation Model----------------------
  DesignationSaveFlag: boolean = false;
  Designation_Name_ngModel: any;
  Designation_Desc_ngModel: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private alertCtrl: AlertController) {
    //on the page load all the details of tenant get display----------------------------------
    this.BindControls();

    this.CompanyClicked = true; this.HQClicked = false; this.BranchClicked = false; this.DepartmentClicked = false; this.DesignationClicked = false;
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
    this.navCtrl.push(SetupPage);
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
              this.Branches.push({ BRANCH_GUID: UUID.UUID(), BRANCH_NAME: this.Branch_Name_ngModel.trim(), BRANCH_REGNO: this.Branch_Regno_ngModel.trim(), BRANCH_EMAIL: this.Branch_Email_ngModel.trim(), BRANCH_CONTACTNO: this.Branch_Contactno_ngModel.trim() });
            }
            else {
              this.Branches = this.Branches.filter(item => item.BRANCH_GUID != localStorage.getItem("BRANCH_GUID"));
              this.Branches.push({ BRANCH_GUID: localStorage.getItem("BRANCH_GUID"), BRANCH_NAME: this.Branch_Name_ngModel.trim(), BRANCH_REGNO: this.Branch_Regno_ngModel.trim(), BRANCH_EMAIL: this.Branch_Email_ngModel.trim(), BRANCH_CONTACTNO: this.Branch_Contactno_ngModel.trim() });

              this.BranchSaveFlag = false;
              localStorage.removeItem("BRANCH_GUID");
            }

            //Clear the Controls------------------------
            this.Branch_Name_ngModel = "";
            this.Branch_Regno_ngModel = "";
            this.Branch_Email_ngModel = "";
            this.Branch_Contactno_ngModel = "";
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
    let Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_tenant_setup_guide' + '?filter=(TENANT_GUID='+ localStorage.getItem('g_TENANT_GUID') +')and(USER_GUID='+ localStorage.getItem('g_USER_GUID') +')&api_key=' + constants.DREAMFACTORY_API_KEY;
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
        this.HQregno_ngModel = this.tenants[0]["COMPANY_REGNO"];
        this.Tenantemail_ngModel = this.tenants[0]["EMAIL"];
        this.Tenantcontactno_ngModel = this.tenants[0]["CONTACT_NO"];

        //-----------For Branch Model---------------------------
        this.BranchSaveFlag = false;
        this.Branches = [];
        this.Branch_Name_ngModel = "";
        this.Branch_Regno_ngModel = "";
        this.Branch_Email_ngModel = "";
        this.Branch_Contactno_ngModel = "";
        this.Branches.push({ 
          BRANCH_GUID: this.tenants[0]["TENANT_COMPANY_SITE_GUID"], 
          BRANCH_NAME: this.tenants[0]["SITE_NAME"], 
          BRANCH_REGNO: this.tenants[0]["BRANCH_REG_NO"], 
          BRANCH_EMAIL: this.tenants[0]["EMAIL"], 
          BRANCH_CONTACTNO: this.tenants[0]["CONTACT_NO"] 
        });

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
            for(var item in this.departments){
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
            for(var item in this.departments){
              this.Designation.push({ DESIGNATION_GUID: this.designations[item]["DESIGNATION_GUID"], DESIGNATION_NAME: this.designations[item]["NAME"], DESIGNATION_DESC: this.designations[item]["DESCRIPTION"] });             
            }            
          });
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
}
