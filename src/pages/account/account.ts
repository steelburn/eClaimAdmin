import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Item } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import CryptoJS from 'crypto-js';
import { TitleCasePipe } from '@angular/common';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { GlobalFunction } from '../../shared/GlobalFunction';
import * as constants from '../../app/config/constants';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserMain_Model } from '../../models/user_main_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { UserQualification_Model } from '../../models/user_qualification_model';
import { UserCertification_Model } from '../../models/user_certification_model';
import { UserSpouse_Model } from '../../models/user_spouse_model';
import { UserChildren_Model } from '../../models/user_children_model';
import { ViewUser_Model } from '../../models/viewuser_model';
import { View_Dropdown_Model } from '../../models/view_dropdown';
import { UserSetup_Service } from '../../services/usersetup_service';
import { BaseHttpService } from '../../services/base-http';
import { Services } from '../Services';

import { UserRole_Model } from '../../models/user_role_model'
import { UUID } from 'angular2-uuid';
import { elementDef } from '@angular/core/src/view/element';
import { LoginPage } from '../login/login';
import { Conditional } from '@angular/compiler';
import { ImageUpload_model } from '../../models/image-upload.model';
declare var cordova: any;

@Component({
  selector: 'page-account',
  templateUrl: 'account.html', providers: [UserSetup_Service, BaseHttpService, FileTransfer, Transfer, TitleCasePipe]
})
export class AccountPage {
  username: string;
  Userform: FormGroup;

  //--------------PERSONAL_DETAILS-----------------------
  public User_Name_Edit_ngModel: any;
  public User_StaffID_Edit_ngModel: any;
  public User_Email_Edit_ngModel: any;
  public User_ICNo_Edit_ngModel: any;
  public User_LoginId_Edit_ngModel: any;
  public User_Password_Edit_ngModel: any;
  public User_PersonalNo_Edit_ngModel: any;
  public User_DOB_Edit_ngModel: any;
  public User_CompanyNo_Edit_ngModel: any;
  public User_Gender_Edit_ngModel: any;
  public User_Marital_Edit_ngModel: any;

  //------------EMPLOYMENT_DETAILS---------------------------
  public User_Company_Edit_ngModel: any;
  public User_Branch_Edit_ngModel: any;
  public User_Designation_Edit_ngModel: any;
  public User_Department_Edit_ngModel: any;
  public User_JoinDate_Edit_ngModel: any;
  public User_ConfirmationDate_Edit_ngModel: any;
  public User_ResignationDate_Edit_ngModel: any;
  public User_EmployeeType_Edit_ngModel: any;
  public User_Employment_Edit_ngModel: any;
  public User_Approver1_Edit_ngModel: any;

  //-------------EDUCATIONAL_QUALIFICATION--------------------
  public User_HighestQualification_Edit_ngModel: any;
  public User_University_Edit_ngModel: any;
  public User_Major_Edit_ngModel: any;
  public User_EduYear_Edit_ngModel: any;

  //--------------PROFESSIONAL_CERTIFICATIONS-------------------
  public User_Certification_Edit_ngModel: any;
  public User_CertificationGrade_Edit_ngModel: any;
  public User_CertificationYear_Edit_ngModel: any;
  public User_CertificationAttachment_Edit_ngModel: any;
  public attachment_ref: any;

  //-------------RESIDENTIAL_ADDRESS----------------------------
  public User_Address1_Edit_ngModel: any;
  public User_PostCode_Edit_ngModel: any;
  public User_Address2_Edit_ngModel: any;
  public User_Country_Edit_ngModel: any;
  public User_Address3_Edit_ngModel: any;
  public User_State_Edit_ngModel: any;

  //-------------FAMILY_DETAILS---------------------------------
  public User_Spouse_Name_Edit_ngModel: any;
  public User_Spouse_IcNumber_Edit_ngModel: any;

  public User_Child_Name_Edit_ngModel: any;
  public User_Child_IcNumber_Edit_ngModel: any;
  public User_Child_Gender_Edit_ngModel: any;
  public User_SpouseChild_Edit_ngModel: any;

  //-------------EMERGENCY_CONTACT_DETAILS-------------------------
  public User_EMG_CONTACT_NAME1_Edit_ngModel: any;
  public User_EMG_CONTACT_NAME2_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP_Edit_ngModel: any;
  public User_EMG_RELATIONSHIP2_Edit_ngModel: any;
  public User_EMG_CONTACT_NO1_Edit_ngModel: any;
  public User_EMG_CONTACT_NO2_Edit_ngModel: any;

  //---------------PAYROLL_DETAILS----------------------------------
  public User_EPF_NUMBER_Edit_ngModel: any;
  public User_BANK_NAME_Edit_ngModel: any;
  public User_INCOMETAX_NO_Edit_ngModel: any;
  public User_ACCOUNT_NUMBER_Edit_ngModel: any;

  //----------------ROLE DETAILS-------------------------------------
  public ROLE_ngModel_Edit: any;

  // constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData, fb: FormBuilder) {
  constructor(private alertCtrl: AlertController, public nav: NavController, public userData: UserData, fb: FormBuilder, public viewCtrl: ViewController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private api: Services, private userservice: UserSetup_Service, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: Transfer, public toastCtrl: ToastController, public platform: Platform, private fileTransfer_new: FileTransfer, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") != null) {
      //---------Bind Company---------------------
      this.GetCompany("tenant_company", "NAME");

      //---------Bind Country---------------------
      this.BindCountry("main_country", "NAME");

      //--------Bind Qualification----------------
      this.BindQualification("main_qualification_type", "TYPE_NAME");

      //--------Bind Role--------------------------
      this.BindRole();

      //Display Controls----------------------------
      this.Edit_Personaldetails(localStorage.getItem("g_USER_GUID"));

      this.Userform = fb.group({
        // -------------------PERSONAL DETAILS--------------------
        avatar1: null,
        avatar2: null,
        avatar3: null,

        NAME: [null, Validators.required],
        EMAIL: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
        LOGIN_ID: [null],
        PASSWORD: [null],
        CONTACT_NO: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        COMPANY_CONTACT_NO: [null],
        MARITAL_STATUS: ['', Validators.required],
        PERSONAL_ID_TYPE: [null],
        PERSONAL_ID: [null],
        DOB: [null],
        GENDER: [null, Validators.required],

        // -------------------EMPLOYMENT DETAILS--------------------
        DESIGNATION_GUID: [null, Validators.required],
        TENANT_COMPANY_GUID: [null, Validators.required],
        DEPT_GUID: [null, Validators.required],
        JOIN_DATE: [null, Validators.required],
        CONFIRMATION_DATE: [null],
        RESIGNATION_DATE: [],
        BRANCH: [null, Validators.required],
        EMPLOYEE_TYPE: [null, Validators.required],
        APPROVER1: [null, Validators.required],
        EMPLOYEE_STATUS: [null, Validators.required],

        // -------------------EDUCATIONAL QUALIFICATION--------------------
        HIGHEST_QUALIFICATION: [null, Validators.required],
        UNIVERSITY: [null],
        MAJOR: [null],
        EDU_YEAR: [null],

        // -------------------PROFESSIONAL CERTIFICATIONS--------------------
        CERTIFICATION: [null],
        CERTIFICATION_YEAR: [null],
        CERTIFICATION_GRADE: [null],
        ATTACHMENT_PROFESSIONAL: [null],

        // -------------------RESIDENTIAL ADDRESS----------------------------
        USER_ADDRESS1: [null, Validators.required],
        USER_ADDRESS2: [null],
        USER_ADDRESS3: [null],
        USER_POSTCODE: ['', Validators.required],
        USER_COUNTRY: ['', Validators.required],
        USER_STATE: ['', Validators.required],

        // -------------------FAMILY DETAILS----------------------------------
        //--------For Spouse----------
        SPOUSENAME: [null],
        SPOUSE_ICNUMBER: [null],
        //--------For Child----------
        CHILDNAME: [null],
        CHILD_ICNUMBER: [null],
        CHILD_GENDER: [null],
        SPOUSE_CHILD: [null],

        // -------------------EMERGENCY CONTACT DETAILS------------------------
        EMG_CONTACT_NAME1: [null, Validators.required],
        EMG_RELATIONSHIP: [null, Validators.required],
        EMG_CONTACT_NO1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        EMG_CONTACT_NAME2: [null],
        EMG_RELATIONSHIP2: [null],
        EMG_CONTACT_NO2: [null],

        // -------------------PAYROLL DETAILS------------------------
        EPF_NUMBER: [null],
        INCOMETAX_NO: [null],
        BANK_NAME: ['', Validators.required],
        ACCOUNT_NUMBER: [null, Validators.required],

        //-------------------ROLE DETAILS---------------------------
        ROLE_NAME: [null],
      });
    }
    else {
      this.nav.push(LoginPage);
    }
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

  loading: Loading;
  USER_GUID_FOR_UPDATE: any; view_user_details: any;

  baseResourceUrl2_URL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/zcs/_table/user_address?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  MaritalStatusMarried: boolean = false;

  USER_INFO_GUID_FOR_UPDATE: any;
  USER_GUID_FOR_COMPANY_CONTACT: any;
  USER_GUID_FOR_CONTACT: any;
  USER_QUALIFICATION_GUID_FOR_UPDATE: any;
  USER_GUID_FOR_ADDRESS: any;

  public ProfessionalCertification: any[] = [];
  public FamilyDetails: any[] = [];
  public ChildrenDetails: any[] = [];

  public Profile_Image_Display: any;

  public Edit_Personaldetails(id: any) {
    this.ClearControls();

    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.USER_GUID_FOR_UPDATE = id;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url_user_edit = this.baseResourceUrl2_URL + "view_user_edit?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Professional_Certification = this.baseResourceUrl2_URL + "user_certification?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Spouse = this.baseResourceUrl2_URL + "user_spouse?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Children = this.baseResourceUrl2_URL + "user_children?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    let url_user_Image = this.baseResourceUrl2_URL + "view_image_retrieve?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // debugger;
    //----------------Get the Details from Db and bind Controls---------------------------------
    this.http.get(url_user_edit, options)
      .map(res => res.json())
      .subscribe(
        data => {
          this.view_user_details = data["resource"];

          //------------------------PERSONAL DETAILS----------------------------------
          this.User_Name_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["FULLNAME"]);
          this.User_Email_Edit_ngModel = this.view_user_details[0]["EMAIL"];
          this.User_LoginId_Edit_ngModel = this.view_user_details[0]["LOGIN_ID"];
          this.User_Password_Edit_ngModel = this.view_user_details[0]["PASSWORD"];
          this.User_PersonalNo_Edit_ngModel = this.view_user_details[0]["CONTACT_NO"];
          this.User_CompanyNo_Edit_ngModel = this.view_user_details[0]["COMPANY_CONTACT_NO"];
          this.User_Marital_Edit_ngModel = this.view_user_details[0]["MARITAL_STATUS"];
          if (this.view_user_details[0]["MARITAL_STATUS"] == "1") {
            this.MaritalStatusMarried = true;
          }
          else {
            this.MaritalStatusMarried = false;
          }
          this.User_StaffID_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID_TYPE"];
          this.User_ICNo_Edit_ngModel = this.view_user_details[0]["PERSONAL_ID"];
          this.User_DOB_Edit_ngModel = this.view_user_details[0]["DOB"];
          this.User_Gender_Edit_ngModel = this.view_user_details[0]["GENDER"];

          //------------------------EMPLOYMENT DETAILS----------------------------------
          this.USER_INFO_GUID_FOR_UPDATE = this.view_user_details[0]["USER_INFO_GUID"];

          this.USER_GUID_FOR_COMPANY_CONTACT = this.view_user_details[0]["USER_COMPANY_GUID"];
          this.USER_GUID_FOR_CONTACT = this.view_user_details[0]["CONTACT_INFO_GUID"];

          this.User_Company_Edit_ngModel = this.view_user_details[0]["COMPANY_GUID"]; this.GetBranch("tenant_company_site", this.User_Company_Edit_ngModel, "SITE_NAME");

          this.GetDesignation('main_designation', 'NAME');
          this.GetDepartment('main_department', 'NAME');
          this.BindBank('main_bank', 'NAME');
          this.BindApprover1("view_get_tenant_admin");
          this.BindRole();

          if (this.view_user_details[0]["DESIGNATION_GUID"] != null) {
            this.User_Designation_Edit_ngModel = this.view_user_details[0]["DESIGNATION_GUID"];
          }
          if (this.view_user_details[0]["DEPT_GUID"] != null) {
            this.User_Department_Edit_ngModel = this.view_user_details[0]["DEPT_GUID"];
          }

          this.User_JoinDate_Edit_ngModel = this.view_user_details[0]["JOIN_DATE"];
          this.User_ConfirmationDate_Edit_ngModel = this.view_user_details[0]["CONFIRMATION_DATE"];
          this.User_ResignationDate_Edit_ngModel = this.view_user_details[0]["RESIGNATION_DATE"];
          this.User_Branch_Edit_ngModel = this.view_user_details[0]["BRANCH"];
          this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"];

          if (this.view_user_details[0]["MANAGER_USER_GUID"] != null) {
            this.User_Approver1_Edit_ngModel = this.view_user_details[0]["MANAGER_USER_GUID"];
          }

          this.User_Employment_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_STATUS"];

          //------------------------EDUCATIONAL QUALIFICATION----------------------------
          this.USER_QUALIFICATION_GUID_FOR_UPDATE = this.view_user_details[0]["USER_QUALIFICATION_GUID"];
          this.User_HighestQualification_Edit_ngModel = this.view_user_details[0]["QUALIFICATION_GUID"];
          this.User_University_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["UNIVERSITY"]);
          this.User_Major_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["MAJOR"]);
          this.User_EduYear_Edit_ngModel = this.view_user_details[0]["YEAR"];

          //------------------------RESIDENTIAL ADDRESS----------------------------------
          this.USER_GUID_FOR_ADDRESS = this.view_user_details[0]["USER_ADDRESS_GUID"];
          this.User_Address1_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS1"]);
          this.User_Address2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS2"]);
          this.User_Address3_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["USER_ADDRESS3"]);
          this.User_PostCode_Edit_ngModel = this.view_user_details[0]["POST_CODE"];
          this.User_Country_Edit_ngModel = this.view_user_details[0]["COUNTRY_GUID"]; this.BindState('main_state', this.User_Country_Edit_ngModel, 'NAME');
          this.User_State_Edit_ngModel = this.view_user_details[0]["STATE_GUID"];

          //------------------------EMERGENCY CONTACT DETAILS---------------------------
          this.User_EMG_CONTACT_NAME1_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_CONTACT_NAME_1"]);
          this.User_EMG_RELATIONSHIP_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_RELATIONSHIP_1"]);
          this.User_EMG_CONTACT_NO1_Edit_ngModel = this.view_user_details[0]["EMG_CONTACT_NUMBER_1"];
          this.User_EMG_CONTACT_NAME2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_CONTACT_NAME_2"]);
          this.User_EMG_RELATIONSHIP2_Edit_ngModel = this.titlecasePipe.transform(this.view_user_details[0]["EMG_RELATIONSHIP_2"]);
          this.User_EMG_CONTACT_NO2_Edit_ngModel = this.view_user_details[0]["EMG_CONTACT_NUMBER_2"];

          //------------------------PAYROLL CONTACT DETAILS-----------------------------
          this.User_EPF_NUMBER_Edit_ngModel = this.view_user_details[0]["PR_EPF_NUMBER"];
          this.User_INCOMETAX_NO_Edit_ngModel = this.view_user_details[0]["PR_INCOMETAX_NUMBER"];

          // if (this.view_user_details[0]["BANK_GUID"] != null) {
          this.User_BANK_NAME_Edit_ngModel = this.view_user_details[0]["BANK_GUID"];
          // }

          this.User_ACCOUNT_NUMBER_Edit_ngModel = this.view_user_details[0]["PR_ACCOUNT_NUMBER"];

          this.loading.dismissAll();
        });

    //------------------------PROFESSIONAL CERTIFICATIONS--------------------------
    this.http.get(url_user_Professional_Certification, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: data["resource"][item]["certificate_guid"], NAME: data["resource"][item]["name"], GRADE: data["resource"][item]["grade"], YEAR: data["resource"][item]["passing_year"], ATTACHMENT: data["resource"][item]["attachment"] });
          }
        });

    //------------------------FAMILY DETAILS---------------------------------------
    //------------------------SPOUSE--------------------------        
    this.http.get(url_user_Spouse, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.FamilyDetails.push({ SPOUSE_GUID: data["resource"][item]["SPOUSE_GUID"], NAME: data["resource"][item]["NAME"], ICNO: data["resource"][item]["ICNO"] });
          }
        });

    //------------------------CHILDREN------------------------        
    this.http.get(url_user_Children, options)
      .map(res => res.json())
      .subscribe(
        data => {
          for (var item in data["resource"]) {
            this.ChildrenDetails.push({ CHILD_GUID: data["resource"][item]["CHILD_GUID"], NAME: data["resource"][item]["NAME"], ICNO: data["resource"][item]["ICNO"], GENDER: data["resource"][item]["GENDER"], SPOUSE: data["resource"][item]["SPOUSE"] });
          }
        });

    //------------------------Profile Image------------------------
    this.http.get(url_user_Image, options)
      .map(res => res.json())
      .subscribe(
        data => {
          if (data["resource"].length <= 0) {
            this.Profile_Image_Display = "assets/img/noPreview.png";
          }
          else {
            this.Profile_Image_Display = constants.DREAMFACTORY_INSTANCE_URL + "/api/v2/files/" + data["resource"][0]["IMAGE_URL"] + "?api_key=" + constants.DREAMFACTORY_API_KEY;
          }
        });

    //------------------------Role-------------------------------
    let CheckRole: any = [];
    let User_Role_url = this.baseResourceUrl2_URL + "user_role?filter=(USER_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    this.http
      .get(User_Role_url)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
        for (var itemA in this.roles) {
          CheckRole.push(this.roles[itemA]["ROLE_GUID"]);
        }
        this.ROLE_ngModel_Edit = CheckRole;
      });
  }

  BaseTableURL: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  tenants: any;

  GetTenant_GUID(Tenant_company_guid: string) {
    let TableURL = this.BaseTableURL + "tenant_company" + '?filter=(TENANT_COMPANY_GUID=' + Tenant_company_guid + ')&' + this.Key_Param;
    return new Promise((resolve, reject) => {
      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data["resource"];
          resolve(this.tenants[0].TENANT_GUID);
        });
    });
  }

  designations: any;
  GetDesignation(TableName: string, SortField: string) {
    let TableURL: string; let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.designations = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  companies: any;
  GetCompany(TableName: string, SortField: string) {
    let TableURL: string;
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    }
    else {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }
    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.companies = data["resource"];
      });
  }

  departments: any
  GetDepartment(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.departments = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }
  
  branches: any;
  GetBranch(TableName: string, FilterField: String, SortField: string) {
    // debugger;
    let TableURL: string;
    if (this.User_Company_Edit_ngModel != undefined) {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_COMPANY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;
    }

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.branches = data["resource"]; console.log(data["resource"]);
      });
  }

  countries: any;
  BindCountry(TableName: string, SortField: string) {
    let TableURL: string;
    TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data["resource"];
      });
  }

  states: any;
  BindState(TableName: string, FilterField: string, SortField: string) {
    let TableURL: string;
    TableURL = this.BaseTableURL + TableName + '?filter=(COUNTRY_GUID=' + FilterField + ')&' + 'order=' + SortField + '&' + this.Key_Param;

    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.states = data["resource"];
      });
  }

  banks: any;
  BindBank(TableName: string, SortField: string) {
    let TableURL: string;
    let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      TableURL = this.BaseTableURL + TableName + '?filter=(TENANT_GUID=' + res.toString() + ')&order=' + SortField + '&' + this.Key_Param;

      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          this.banks = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  qualifications: any;
  BindQualification(TableName: string, SortField: string) {
    let TableURL: string;
    TableURL = this.BaseTableURL + TableName + '?order=' + SortField + '&' + this.Key_Param;
    this.http
      .get(TableURL)
      .map(res => res.json())
      .subscribe(data => {
        this.qualifications = data["resource"];
      });
  }

  approvers: any;
  BindApprover1(ViewName: string) {
    let TableURL_Approver: string; let TempUser_Company_ngModel: any;
    TempUser_Company_ngModel = this.view_user_details[0]["COMPANY_GUID"];

    let val = this.GetTenant_GUID(TempUser_Company_ngModel);
    val.then((res) => {
      if (localStorage.getItem("g_USER_GUID") == "sva" || localStorage.getItem("g_IS_TENANT_AMDIN") == "1") {
        TableURL_Approver = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')&' + this.Key_Param;
      }
      else {
        TableURL_Approver = this.BaseTableURL + ViewName + '?filter=(TENANT_GUID=' + res.toString() + ')AND(USER_GUID!=' + this.view_user_details[0]["USER_GUID"] + ')&' + this.Key_Param;
      }

      this.http
        .get(TableURL_Approver)
        .map(res => res.json())
        .subscribe(data => {
          this.approvers = data["resource"];
        });
    });
    val.catch((err) => {
      // This is never called
      console.log(err);
    });
  }

  roles: any
  BindRole() {
    let roleUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(roleUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data["resource"];
      });
  }

  DisplayFamily_Edit() {
    if (this.User_Marital_Edit_ngModel == "1" || this.User_Marital_Edit_ngModel == "2") {
      this.MaritalStatusMarried = true;
    }
    else {
      this.MaritalStatusMarried = false;
    }
  }
  
  CertificateSaveFlag: boolean = false; 
  AddProfessionalCertificationForEdit() {
    if (this.User_Certification_Edit_ngModel != undefined && this.User_Certification_Edit_ngModel.trim() != "") {
      if (this.User_CertificationGrade_Edit_ngModel != undefined && this.User_CertificationGrade_Edit_ngModel.trim() != "") {
        if (this.User_CertificationYear_Edit_ngModel.toString() != undefined && this.User_CertificationYear_Edit_ngModel.toString().trim() != "") {

          if (this.CertificateSaveFlag == false) {
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Certification_Edit_ngModel.trim()), GRADE: this.User_CertificationGrade_Edit_ngModel.trim(), YEAR: this.User_CertificationYear_Edit_ngModel.trim(), ATTACHMENT_EDIT: this.attachment_ref });
          }
          else {
            this.ProfessionalCertification = this.ProfessionalCertification.filter(item => item.CERTIFICATE_GUID != localStorage.getItem("CERTIFICATE_GUID"));
            this.ProfessionalCertification.push({ CERTIFICATE_GUID: localStorage.getItem("CERTIFICATE_GUID"), NAME: this.titlecasePipe.transform(this.User_Certification_Edit_ngModel.trim()), GRADE: this.User_CertificationGrade_Edit_ngModel.trim(), YEAR: this.User_CertificationYear_Edit_ngModel.toString().trim(), ATTACHMENT_EDIT: this.attachment_ref });

            this.CertificateSaveFlag = false;
            localStorage.removeItem("SPOUSE_GUID");
          }

          //Clear the Controls------------------------
          this.User_Certification_Edit_ngModel = "";
          this.User_CertificationGrade_Edit_ngModel = "";
          this.User_CertificationYear_Edit_ngModel = "";
          this.User_CertificationAttachment_Edit_ngModel = "";
        }
        else {
          alert("Fill Year !!");
        }
      }
      else {
        alert("Fill Grade !!");
      }
    }
    else {
      alert("Fill Certificate Name !!");
    }
  }  

  EditProfessionalCertificationForEdit(CERTIFICATE_GUID: string) {
    for (var item in this.ProfessionalCertification) {
      if (this.ProfessionalCertification[item]["CERTIFICATE_GUID"] == CERTIFICATE_GUID) {
        this.User_Certification_Edit_ngModel = this.ProfessionalCertification[item]["NAME"];
        this.User_CertificationGrade_Edit_ngModel = this.ProfessionalCertification[item]["GRADE"];
        this.User_CertificationYear_Edit_ngModel = this.ProfessionalCertification[item]["YEAR"];

        localStorage.setItem("CERTIFICATE_GUID", this.ProfessionalCertification[item]["CERTIFICATE_GUID"]);

        this.CertificateSaveFlag = true;
        return;
      }
    }
  }

  RemoveProfessionalCertification(CERTIFICATE_GUID: string) {
    if (this.CertificateSaveFlag == false) {
      this.ProfessionalCertification = this.ProfessionalCertification.filter(item => item.CERTIFICATE_GUID != CERTIFICATE_GUID);
    }
    else {
      alert('Sorry!! You are in Edit Mode.');
    }
  }
  
  SpouseSaveFlag: boolean = false; 
  AddFamilyDetailsForEdit() {
    if (this.User_Spouse_Name_Edit_ngModel != undefined && this.User_Spouse_Name_Edit_ngModel.trim() != "") {
      if (this.User_Spouse_IcNumber_Edit_ngModel != undefined && this.User_Spouse_IcNumber_Edit_ngModel.trim() != "") {
        if (this.SpouseSaveFlag == false) {
          this.FamilyDetails.push({ SPOUSE_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_Edit_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_Edit_ngModel.trim() });
        }
        else {
          this.FamilyDetails = this.FamilyDetails.filter(item => item.SPOUSE_GUID != localStorage.getItem("SPOUSE_GUID"));
          this.FamilyDetails.push({ SPOUSE_GUID: localStorage.getItem("SPOUSE_GUID"), NAME: this.titlecasePipe.transform(this.User_Spouse_Name_Edit_ngModel.trim()), ICNO: this.User_Spouse_IcNumber_Edit_ngModel.trim() });
          this.SpouseSaveFlag = false;
          localStorage.removeItem("SPOUSE_GUID");
        }
        this.User_Spouse_Name_Edit_ngModel = "";
        this.User_Spouse_IcNumber_Edit_ngModel = "";
      }
      else {
        alert("Fill IC Number !!");
      }
    }
    else {
      alert("Fill Spouse Name !!");
    }
  }

  EditFamilyDetailsForEdit(SPOUSE_GUID: string) {
    for (var item in this.FamilyDetails) {
      if (this.FamilyDetails[item]["SPOUSE_GUID"] == SPOUSE_GUID) {
        this.User_Spouse_Name_Edit_ngModel = this.FamilyDetails[item]["NAME"];
        this.User_Spouse_IcNumber_Edit_ngModel = this.FamilyDetails[item]["ICNO"];
        localStorage.setItem("SPOUSE_GUID", this.FamilyDetails[item]["SPOUSE_GUID"]);

        this.SpouseSaveFlag = true;
        return;
      }
    }
  }

  RemoveFamilyDetails(SPOUSE_GUID: string) {
    if (this.SpouseSaveFlag == false) {
      this.FamilyDetails = this.FamilyDetails.filter(item => item.SPOUSE_GUID != SPOUSE_GUID);
      this.SpouseSaveFlag = false;
    }
    else {
      alert("Sorry !! You are in Edit Mode.");
    }

  }
  
  public ChildSaveFlag: boolean = false;
  AddChildrenForEdit() {
    if (this.User_Child_Name_Edit_ngModel != undefined && this.User_Child_Name_Edit_ngModel.trim() != "") {
      if (this.User_Child_IcNumber_Edit_ngModel != undefined && this.User_Child_IcNumber_Edit_ngModel.trim() != "") {
        if (this.User_Child_Gender_Edit_ngModel != undefined && this.User_Child_Gender_Edit_ngModel != "") {
          if (this.User_SpouseChild_Edit_ngModel != undefined && this.User_SpouseChild_Edit_ngModel != "") {
            if (this.ChildSaveFlag == false) {
              this.ChildrenDetails.push({ CHILD_GUID: UUID.UUID(), NAME: this.titlecasePipe.transform(this.User_Child_Name_Edit_ngModel.trim()), ICNO: this.User_Child_IcNumber_Edit_ngModel.trim(), GENDER: this.User_Child_Gender_Edit_ngModel.trim(), SPOUSE: this.User_SpouseChild_Edit_ngModel.trim() });
            }
            else {
              this.ChildrenDetails = this.ChildrenDetails.filter(item => item.CHILD_GUID != localStorage.getItem("CHILD_GUID"));
              this.ChildrenDetails.push({ CHILD_GUID: localStorage.getItem("CHILD_GUID"), NAME: this.titlecasePipe.transform(this.User_Child_Name_Edit_ngModel.trim()), ICNO: this.User_Child_IcNumber_Edit_ngModel.trim(), GENDER: this.User_Child_Gender_Edit_ngModel.trim(), SPOUSE: this.User_SpouseChild_Edit_ngModel.trim() });

              this.ChildSaveFlag = false;
              localStorage.removeItem("CHILD_GUID");
            }
            //------Clear Controls ----------------
            this.User_Child_Name_Edit_ngModel = "";
            this.User_Child_IcNumber_Edit_ngModel = "";
            this.User_Child_Gender_Edit_ngModel = "";
            this.User_SpouseChild_Edit_ngModel = "";
          }
          else {
            alert("Select Spouse !!");
          }
        }
        else {
          alert("Select Gender !!");
        }
      }
      else {
        alert("Fill Child IC Number !!")
      }
    }
    else {
      alert("Fill Child Name !!");
    }
  }

  EditChildrenForEdit(CHILD_GUID: string) {
    for (var item in this.ChildrenDetails) {
      if (this.ChildrenDetails[item]["CHILD_GUID"] == CHILD_GUID) {
        this.User_Child_Name_Edit_ngModel = this.ChildrenDetails[item]["NAME"];
        this.User_Child_IcNumber_Edit_ngModel = this.ChildrenDetails[item]["ICNO"];
        this.User_Child_Gender_Edit_ngModel = this.ChildrenDetails[item]["GENDER"];
        this.User_SpouseChild_Edit_ngModel = this.ChildrenDetails[item]["SPOUSE"];

        localStorage.setItem("CHILD_GUID", this.ChildrenDetails[item]["CHILD_GUID"]);

        this.ChildSaveFlag = true;
        return;
      }
    }
  }

  RemoveChildren(CHILD_GUID: string) {
    if (this.ChildSaveFlag == false) {
      this.ChildrenDetails = this.ChildrenDetails.filter(item => item.CHILD_GUID != CHILD_GUID);
      this.ChildSaveFlag = false;
    }
    else {
      alert('Sorry!! You are in Edit Mode.');
    }
  }

  ClearControls() {
    this.User_Name_Edit_ngModel = "";
    this.User_Email_Edit_ngModel = "";
    this.User_LoginId_Edit_ngModel = "";
    this.User_Password_Edit_ngModel = "";
    this.User_PersonalNo_Edit_ngModel = "";
    this.User_CompanyNo_Edit_ngModel = "";
    this.User_Marital_Edit_ngModel = "";
    this.User_StaffID_Edit_ngModel = "";
    this.User_ICNo_Edit_ngModel = "";
    this.User_DOB_Edit_ngModel = "";
    this.User_Gender_Edit_ngModel = "";

    this.User_Designation_Edit_ngModel = "";
    this.User_Company_Edit_ngModel = "";
    this.User_Department_Edit_ngModel = "";
    this.User_JoinDate_Edit_ngModel = "";
    this.User_ConfirmationDate_Edit_ngModel = "";
    this.User_ResignationDate_Edit_ngModel = "";
    this.User_Branch_Edit_ngModel = "";

    this.User_EmployeeType_Edit_ngModel = "";
    this.User_Employment_Edit_ngModel = "";

    this.User_HighestQualification_Edit_ngModel = "";
    this.User_University_Edit_ngModel = "";
    this.User_Major_Edit_ngModel = "";
    this.User_EduYear_Edit_ngModel = "";

    this.User_Certification_Edit_ngModel = "";
    this.User_CertificationYear_Edit_ngModel = "";
    this.User_CertificationGrade_Edit_ngModel = "";

    this.User_Address1_Edit_ngModel = "";
    this.User_Address2_Edit_ngModel = "";
    this.User_Address3_Edit_ngModel = "";
    this.User_PostCode_Edit_ngModel = "";
    this.User_Country_Edit_ngModel = "";
    this.User_State_Edit_ngModel = "";

    this.User_Spouse_Name_Edit_ngModel = "";
    this.User_Spouse_IcNumber_Edit_ngModel = "";

    this.User_Child_Name_Edit_ngModel = "";
    this.User_Child_IcNumber_Edit_ngModel = "";
    this.User_Child_Gender_Edit_ngModel = "";
    this.User_SpouseChild_Edit_ngModel = "";

    this.User_EMG_CONTACT_NAME1_Edit_ngModel = "";
    this.User_EMG_RELATIONSHIP_Edit_ngModel = "";
    this.User_EMG_CONTACT_NO1_Edit_ngModel = "";
    this.User_EMG_CONTACT_NAME2_Edit_ngModel = "";
    this.User_EMG_RELATIONSHIP2_Edit_ngModel = "";
    this.User_EMG_CONTACT_NO2_Edit_ngModel = "";

    this.User_EPF_NUMBER_Edit_ngModel = "";
    this.User_INCOMETAX_NO_Edit_ngModel = "";
    this.User_BANK_NAME_Edit_ngModel = "";

    this.MaritalStatusMarried = false;

    this.ROLE_ngModel_Edit = "";
  }

  Update(USER_GUID: any){
    alert('Development in progress.');
  }

}
