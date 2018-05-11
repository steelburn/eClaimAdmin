import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BanksetupPage } from '../banksetup/banksetup';
import { BranchsetupPage } from '../branchsetup/branchsetup';
import { CashcardsetupPage } from '../cashcardsetup/cashcardsetup';
import { ClaimtypePage } from '../claimtype/claimtype';
import { CompanysetupPage } from '../companysetup/companysetup';
import { DesignationsetupPage } from '../designationsetup/designationsetup';
import { DepartmentsetupPage } from '../departmentsetup/departmentsetup';
import { MileagesetupPage } from '../mileagesetup/mileagesetup';
import { PaymenttypesetupPage } from '../paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../qualificationsetup/qualificationsetup';
import { SubsciptionsetupPage } from '../subsciptionsetup/subsciptionsetup';
import { RolesetupPage } from '../rolesetup/rolesetup';
import { TenantsetupPage } from '../tenantsetup/tenantsetup';
import { UserPage } from '../user/user';
import { SocRegistrationPage } from '../soc-registration/soc-registration';
import { CountrysetupPage } from '../countrysetup/countrysetup';
import { StatesetupPage } from '../statesetup/statesetup';

import { TenantCompanySetup_Model } from '../../models/tenantcompanysetup_model';
import { TenantCompanySiteSetup_Model } from '../../models/tenantcompanysitesetup_model';
import { TenantCompanySetup_Service } from '../../services/tenantcompanysetup_service';
import { TenantCompanySiteSetup_Service } from '../../services/tenantcompanysitesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { CustomerSetupPage } from '../customer-setup/customer-setup';

import { UUID } from 'angular2-uuid';

import { LoginPage } from '../login/login';
import { Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';


/**
 * Generated class for the SetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html', providers: [TenantCompanySetup_Service, TenantCompanySiteSetup_Service, BaseHttpService]
})
export class SetupPage {
  tenant_company_entry: TenantCompanySetup_Model = new TenantCompanySetup_Model();
  tenant_company_site_entry: TenantCompanySiteSetup_Model = new TenantCompanySiteSetup_Model();

  Branchform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_branch' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public branchs: any; public hqDetails: any;

  public AddBranchsClicked: boolean = false;
  public EditBranchsClicked: boolean = false;
  public Exist_Record: boolean = false;

  public AddBranchesClicked: boolean = false;
  public branch_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public BRANCHNAME_ngModel_Add: any;
  public COMPANYNAME_ngModel_Add: any;
  public ISHQ_FLAG_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddBranchsClick() {
    this.AddBranchsClicked = true;
    this.ClearControls();
    this.COMPANYNAME_ngModel_Add = this.branchs[0]["NAME"];
  }

  public CloseBranchsClick() {
    if (this.AddBranchsClicked == true) {
      this.AddBranchsClicked = false;
    }
    if (this.EditBranchsClicked == true) {
      this.EditBranchsClicked = false;
    }
  }

  public EditClick(BRANCH_GUID: any) {
    // this.ClearControls();
    // this.EditBranchsClicked = true;
    // var self = this;
    // this.branchsetupservice
    //   .get(BRANCH_GUID)
    //   .subscribe((data) => {
    //     self.branch_details = data;
    //     this.NAME_ngModel_Edit = self.branch_details.NAME; localStorage.setItem('Prev_br_Name', self.branch_details.NAME);
    //   });
  }

  public DeleteClick(BRANCH_GUID: any) {
    // let alert = this.alertCtrl.create({
    //   title: 'Remove Confirmation',
    //   message: 'Do you want to remove ?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'OK',
    //       handler: () => {
    //         console.log('OK clicked');
    //         var self = this;
    //         this.branchsetupservice.remove(BRANCH_GUID)
    //           .subscribe(() => {
    //             self.branchs = self.branchs.filter((item) => {
    //               return item.BRANCH_GUID != BRANCH_GUID
    //             });
    //           });
    //       }
    //     }
    //   ]
    // }); alert.present();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private TenantCompanySetupService: TenantCompanySetup_Service, private tenantcompanysitesetupservice: TenantCompanySiteSetup_Service, private alertCtrl: AlertController) {

    if (localStorage.getItem("g_USER_GUID") != null) {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/vw_tenantcompanysitedetails?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.branchs = data.resource;
        });

      this.Branchform = fb.group({
        COMPANYNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        BRANCHNAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ISHQ_FLAG: ["", Validators.required],
      });
    }
    else {
      this.navCtrl.push(LoginPage);
    }
  }

  goToBanksetup() {
    this.navCtrl.push(BanksetupPage)
  }

  goToBranchsetup() {
    this.navCtrl.push(BranchsetupPage)
  }

  goToCashcardsetup() {
    this.navCtrl.push(CashcardsetupPage)
  }

  goToClaimtypesetup() {
    this.navCtrl.push(ClaimtypePage)
  }

  goToUser() {
    this.navCtrl.push(UserPage)
  }

  goToCustomer() {
    this.navCtrl.push(CustomerSetupPage);
  }

  goToSOC() {
    this.navCtrl.push(SocRegistrationPage)
  }

  goToCompanysetup() {
    this.navCtrl.push(CompanysetupPage)
  }

  goToDesignationsetup() {
    this.navCtrl.push(DesignationsetupPage)
  }

  goToDepartmentsetup() {
    this.navCtrl.push(DepartmentsetupPage)
  }

  goToPaymenttypesetup() {
    this.navCtrl.push(PaymenttypesetupPage)
  }

  goToStatesetup() {
    this.navCtrl.push(StatesetupPage)
  }

  goToCountrysetup() {
    this.navCtrl.push(CountrysetupPage)
  }

  goToQualificationsetup() {
    this.navCtrl.push(QualificationsetupPage)
  }

  goToMileagesetup() {
    this.navCtrl.push(MileagesetupPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');
  }

  Save() {
    if (this.Branchform.valid) {
      this.Save_Tenant_Company();
    }
  }

  Save_Tenant_Company() {
    //----------Check if the new tenant_company entered then take new guid else take the previous-------------
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company?filter=(NAME=" + this.COMPANYNAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {

        if (data.resource[0] != undefined) {
          this.tenant_company_entry.TENANT_COMPANY_GUID = data.resource[0]["TENANT_COMPANY_GUID"];
          this.Save_Tenant_Company_Site();
        }
        else {
          this.tenant_company_entry.TENANT_COMPANY_GUID = UUID.UUID();
          this.tenant_company_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
          this.tenant_company_entry.NAME = this.COMPANYNAME_ngModel_Add.trim();

          this.tenant_company_entry.ACTIVATION_FLAG = "1";

          this.tenant_company_entry.CREATION_TS = new Date().toISOString();
          this.tenant_company_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.tenant_company_entry.UPDATE_TS = new Date().toISOString();
          this.tenant_company_entry.UPDATE_USER_GUID = "";

          this.TenantCompanySetupService.save(this.tenant_company_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                this.Save_Tenant_Company_Site();
              }
            })
        }
      });

  }

  Save_Tenant_Company_Site() {
    this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = UUID.UUID();
    this.tenant_company_site_entry.TENANT_COMPANY_GUID = this.tenant_company_entry.TENANT_COMPANY_GUID;
    this.tenant_company_site_entry.SITE_NAME = this.BRANCHNAME_ngModel_Add.trim();
    this.tenant_company_site_entry.ACTIVATION_FLAG = "1";
    this.tenant_company_site_entry.CREATION_TS = new Date().toISOString();
    this.tenant_company_site_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
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
          //Check if previous tenant_company_site is hq active but current tenant_company_site is updating to hq active then previous tenant_company_site will inactive.      
          if (this.ISHQ_FLAG_ngModel_Add == true) {
            this.UpdateHQ();
          }
          else {
            alert('Company & Site Registered successfully');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      })
  }

  UpdateHQ() {
    if (this.ISHQ_FLAG_ngModel_Add == true) {
      //-------------Get all the details of previous tenant_company_site------------------------------
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/tenant_company_site?filter=(TENANT_COMPANY_SITE_GUID=" + localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.hqDetails = data.resource;
          this.tenant_company_site_entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
          this.tenant_company_site_entry.TENANT_COMPANY_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
          this.tenant_company_site_entry.SITE_NAME = this.hqDetails[0]["SITE_NAME"];
          this.tenant_company_site_entry.REGISTRATION_NUM = this.hqDetails[0]["REGISTRATION_NUM"];
          this.tenant_company_site_entry.ADDRESS = this.hqDetails[0]["ADDRESS"];
          this.tenant_company_site_entry.ADDRESS2 = this.hqDetails[0]["ADDRESS2"];
          this.tenant_company_site_entry.ADDRESS3 = this.hqDetails[0]["ADDRESS3"];
          this.tenant_company_site_entry.CONTACT_NO = this.hqDetails[0]["CONTACT_NO"];
          this.tenant_company_site_entry.EMAIL = this.hqDetails[0]["EMAIL"];
          this.tenant_company_site_entry.ACTIVATION_FLAG = this.hqDetails[0]["ACTIVATION_FLAG"];

          this.tenant_company_site_entry.CONTACT_PERSON = this.hqDetails[0]["CONTACT_PERSON"];
          this.tenant_company_site_entry.CONTACT_PERSON_CONTACT_NO = this.hqDetails[0]["CONTACT_PERSON_CONTACT_NO"];
          this.tenant_company_site_entry.CONTACT_PERSON_EMAIL = this.hqDetails[0]["CONTACT_PERSON_EMAIL"];
          this.tenant_company_site_entry.WEBSITE = this.hqDetails[0]["WEBSITE"];

          this.tenant_company_site_entry.CREATION_TS = this.hqDetails[0]["CREATION_TS"];
          this.tenant_company_site_entry.CREATION_USER_GUID = this.hqDetails[0]["CREATION_USER_GUID"];
          this.tenant_company_site_entry.UPDATE_TS = new Date().toISOString();
          this.tenant_company_site_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.tenant_company_site_entry.ISHQ = "0";

          this.tenantcompanysitesetupservice.update(this.tenant_company_site_entry)
            .subscribe((response) => {
              if (response.status == 200) {
                alert('Company & Site Registered successfully');
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
              }
            })
        });
    }
  }

  getBranchList() {

  }

  Update(BRANCH_GUID: any) {

  }

  ClearControls() {
    this.BRANCHNAME_ngModel_Add = "";
    this.COMPANYNAME_ngModel_Add = "";

    this.NAME_ngModel_Edit = "";
  }

}
