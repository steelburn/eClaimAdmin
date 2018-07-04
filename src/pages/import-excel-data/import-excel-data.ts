import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common'
import { test_model } from '../../models/testmodel';
import { SocCustomer_Model } from '../../models/soc_customer_model';
import { SocProject_Model } from '../../models/soc_project_model';
import { SocMain_Model } from '../../models/socmain_model';

import { SocCustomerLocation_Model } from '../../models/soc_customer_location_model';
import { UserMain_Model } from '../../models/user_main_model';
import { UserInfo_Model } from '../../models/usersetup_info_model';
import { UserAddress_Model } from '../../models/usersetup_address_model';
import { UserCompany_Model } from '../../models/user_company_model';
import { UserContact_Model } from '../../models/user_contact_model';
import { UserQualification_Model } from '../../models/user_qualification_model';
import { UserRole_Model } from '../../models/user_role_model';

import * as constants from '../../config/constants';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as XLSX from 'xlsx';
import { UUID } from 'angular2-uuid';
import { Constants } from './../util/constants';

/**
 * Generated class for the ImportExcelDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-import-excel-data',
  templateUrl: 'import-excel-data.html',
  providers: [DatePipe]
})
export class ImportExcelDataPage {
  // test_model: test_model = new test_model();  

  test_model: SocProject_Model = new SocProject_Model();
  // test_model: SocMain_Model = new SocMain_Model();
  
  SocCustomerLocation_Model: SocCustomerLocation_Model = new SocCustomerLocation_Model();
  UserMain_Model: UserMain_Model = new UserMain_Model();

  baseResourceurl_Excel: string;
  new_data: any[];
  chooseFile: boolean = false;

  main_customer_location_Url: any;
  main_customer_location_data: any[];
  constructor(public datepipe: DatePipe,public navCtrl: NavController, public navParams: NavParams, public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportExcelDataPage');
  }

  // For main_customer
  chooseFile_main_customer: boolean = false;
  SocCustomer_Model: SocCustomer_Model = new SocCustomer_Model();
  arrayBuffer_main_customer: any;
  file_main_customer: File;
  main_customer_Url: any;
  main_customer_data: any[];

  main_customer(event: any) {
    this.chooseFile_main_customer = true;
    this.file_main_customer = event.target.files[0];
  }
  main_customer_click() {
     this.main_customer_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer_main_customer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      this.main_customer_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.main_customer_data)
      console.log(this.main_customer_data.length)
     
      this.main_customer_data.forEach(element => {        
        // For main_customer
        this.SocCustomer_Model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        this.SocCustomer_Model.TENANT_GUID = element.TENANT_GUID;
        this.SocCustomer_Model.NAME = element.NAME;
        this.SocCustomer_Model.DESCRIPTION = element.DESCRIPTION;
        this.SocCustomer_Model.CREATION_TS = new Date().toISOString();;
        this.SocCustomer_Model.CREATION_USER_GUID = 'sva_test';
        this.SocCustomer_Model.UPDATE_TS = new Date().toISOString();;
        this.SocCustomer_Model.UPDATE_USER_GUID = 'sva_test';


        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve, reject) => {
          this.http.post(this.main_customer_Url, this.SocCustomer_Model.toJson(true), options)
            .map((response) => {
              return response;
            }).subscribe((response) => {
              resolve(response.json());
            })
        })
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_customer);
  }

  // For main_project
  chooseFile_incomingfile:boolean = false;
  arrayBuffer: any;
  file: File;
  incomingfile(event: any) {
    this.chooseFile_incomingfile = true;
    this.file = event.target.files[0];
  }

  Upload() {
    //  debugger;
    //this.chooseFile = true;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/newtable?&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/main_customer?&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/main_project?&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.baseResourceurl_Excel = constants.DREAMFACTORY_TABLE_URL + '/soc_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.new_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.new_data)
      console.log(this.new_data.length)
      // for(var i=0 ; i<=this.new_data.length ; i++)
      // {
      this.new_data.forEach(element => {
        // alert('hi')
        // this.test_model.Sno = element.SNo;
        // this.test_model.NAME = element.Name;
        // this.test_model.GUID=UUID.UUID();

        

        // 2)For main_project table
        this.test_model.PROJECT_GUID = element.PROJECT_GUID;
        this.test_model.NAME = element.NAME;
        this.test_model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        this.test_model.CUSTOMER_LOCATION_GUID = element.CUSTOMER_LOCATION_GUID;
        this.test_model.TENANT_GUID = element.TENANT_GUID;
        this.test_model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;
        // this.test_model.ACTIVATION_FLAG = "1";

        this.test_model.CREATION_TS = new Date().toISOString();;
        this.test_model.CREATION_USER_GUID = 'sva_test';
        this.test_model.UPDATE_TS = new Date().toISOString();;
        this.test_model.UPDATE_USER_GUID = 'sva_test';      


        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve, reject) => {
          this.http.post(this.baseResourceurl_Excel, this.test_model.toJson(true), options)
            .map((response) => {
              // alert('Imported successfully')
              return response;

            }).subscribe((response) => {
              resolve(response.json());
              // alert('Import Failed')
            })
        })

      });
      // alert('Imported successfully')
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  // For main_customer_location
  chooseFile_main_customer_location:boolean = false;
  arrayBuffer_main_customer_location: any;
  file_main_customer_location: File;
  main_customer_location(event: any) {
    this.chooseFile_main_customer_location = true;
    this.file = event.target.files[0];
  }
  main_customer_location_click() {
     this.main_customer_location_Url = constants.DREAMFACTORY_TABLE_URL + '/main_customer_location?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer_main_customer_location = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer_location);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.main_customer_location_data)
      console.log(this.main_customer_location_data.length)
     
      this.main_customer_location_data.forEach(element => {
        
        // For main_customer_location
        this.SocCustomerLocation_Model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        this.SocCustomerLocation_Model.CUSTOMER_LOCATION_GUID = element.CUSTOMER_LOCATION_GUID;
        this.SocCustomerLocation_Model.NAME = element.NAME;
        this.SocCustomerLocation_Model.DESCRIPTION = element.DESCRIPTION;
        this.SocCustomerLocation_Model.REGISTRATION_NO = element.REGISTRATION_NO;
        this.SocCustomerLocation_Model.ADDRESS1 = element.ADDRESS1;
        this.SocCustomerLocation_Model.ADDRESS2 = element.ADDRESS2;
        this.SocCustomerLocation_Model.ADDRESS3 = element.ADDRESS3;
        this.SocCustomerLocation_Model.CONTACT_PERSON = element.CONTACT_PERSON;
        this.SocCustomerLocation_Model.CONTACT_PERSON_MOBILE_NO = element.CONTACT_PERSON_MOBILE_NO;
        this.SocCustomerLocation_Model.CONTACT_NO1 = element.CONTACT_NO1;
        this.SocCustomerLocation_Model.CONTACT_NO2 = element.CONTACT_NO2;
        this.SocCustomerLocation_Model.EMAIL = element.EMAIL;
        this.SocCustomerLocation_Model.DIVISION = element.DIVISION;


        this.SocCustomerLocation_Model.CREATION_TS = new Date().toISOString();;
        this.SocCustomerLocation_Model.CREATION_USER_GUID = 'sva_test';
        this.SocCustomerLocation_Model.UPDATE_TS = new Date().toISOString();;
        this.SocCustomerLocation_Model.UPDATE_USER_GUID = 'sva_test';


        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve, reject) => {
          this.http.post(this.main_customer_location_Url, this.SocCustomerLocation_Model.toJson(true), options)
            .map((response) => {
              return response;
            }).subscribe((response) => {
              resolve(response.json());
            })
        })
      });
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  // For soc_main
  chooseFile_soc_main:boolean = false;
  SocMain_Model: SocMain_Model = new SocMain_Model();
  arrayBuffer_soc_main: any;
  file_soc_main: File;
  soc_main_Url: any;
  soc_main_data: any[];

  soc_main(event: any) {
    this.chooseFile_soc_main = true;
    this.file_soc_main = event.target.files[0];
  }
  soc_main_click() {
     this.soc_main_Url = constants.DREAMFACTORY_TABLE_URL + '/soc_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer_main_customer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_customer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      this.soc_main_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.soc_main_data)
      console.log(this.soc_main_data.length)
     
      this.soc_main_data.forEach(element => {        
        // For soc_main table
        this.SocMain_Model.SOC_GUID = element.SOC_GUID;
        this.SocMain_Model.SOC_NO = element.SOC_NO;
        this.SocMain_Model.PROJECT_GUID = element.PROJECT_GUID;
        this.SocMain_Model.TENANT_GUID = element.TENANT_GUID;
        this.SocMain_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;

        this.SocMain_Model.CREATION_TS = new Date().toISOString();;
        this.SocMain_Model.CREATION_USER_GUID = 'sva_test';
        this.SocMain_Model.UPDATE_TS = new Date().toISOString();;
        this.SocMain_Model.UPDATE_USER_GUID='sva_test';


        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve, reject) => {
          this.http.post(this.soc_main_Url, this.SocMain_Model.toJson(true), options)
            .map((response) => {
              return response;
            }).subscribe((response) => {
              resolve(response.json());
            })
        })
      });
    }
    fileReader.readAsArrayBuffer(this.file_soc_main);
  }

   // For user_main
   chooseFile_user_main:boolean = false;
   arrayBuffer_user_main: any;
   file_user_main: File;
   user_main_Url:any;
   user_main(event: any) {
     this.chooseFile_user_main = true;
     this.file_user_main = event.target.files[0];
   } 
   user_main_click() {
      this.user_main_Url = constants.DREAMFACTORY_TABLE_URL + '/user_main?&api_key=' + constants.DREAMFACTORY_API_KEY;
     let fileReader = new FileReader();
     fileReader.onload = (e) => {
       this.arrayBuffer_user_main = fileReader.result;
       var data = new Uint8Array(this.arrayBuffer_user_main);
       var arr = new Array();
       for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
       var bstr = arr.join("");
       var workbook = XLSX.read(bstr, { type: "binary" });
       // zero for first sheet
       var first_sheet_name = workbook.SheetNames[0];
       var worksheet = workbook.Sheets[first_sheet_name];
       // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
 
       this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
       console.log(this.main_customer_location_data)
       console.log(this.main_customer_location_data.length)
      
       this.main_customer_location_data.forEach(element => {         
         // For user_main
         this.UserMain_Model.USER_GUID = element.USER_GUID;
         this.UserMain_Model.TENANT_GUID = element.TENANT_GUID;
         this.UserMain_Model.STAFF_ID = element.STAFF_ID;
         this.UserMain_Model.LOGIN_ID = element.LOGIN_ID;
         this.UserMain_Model.PASSWORD = element.PASSWORD;
         this.UserMain_Model.EMAIL = element.EMAIL;
         this.UserMain_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;
         this.UserMain_Model.IS_TENANT_ADMIN = element.IS_TENANT_ADMIN;
         
         this.UserMain_Model.CREATION_TS = new Date().toISOString();;
         this.UserMain_Model.CREATION_USER_GUID = 'sva_test';
         this.UserMain_Model.UPDATE_TS = new Date().toISOString();;
         this.UserMain_Model.UPDATE_USER_GUID = 'sva_test';
 
 
         var queryHeaders = new Headers();
         queryHeaders.append('Content-Type', 'application/json');
         queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
         let options = new RequestOptions({ headers: queryHeaders });
         return new Promise((resolve, reject) => {
           this.http.post(this.user_main_Url, this.UserMain_Model.toJson(true), options)
             .map((response) => {
               return response;
             }).subscribe((response) => {
               resolve(response.json());
             })
         })
       });
     }
     fileReader.readAsArrayBuffer(this.file_user_main); 
   }

   // For user_info
   chooseFile_user_info:boolean = false;
   arrayBuffer_user_info: any;
   file_user_info: File;
   user_info_Url:any;
   UserInfo_Model: UserInfo_Model = new UserInfo_Model();
   user_info_data: any[];

   user_info(event: any) {
     this.chooseFile_user_info = true;
     this.file_user_info = event.target.files[0];
   } 
   user_info_click() {
      this.user_info_Url = constants.DREAMFACTORY_TABLE_URL + '/user_info?&api_key=' + constants.DREAMFACTORY_API_KEY;
     let fileReader = new FileReader();
     fileReader.onload = (e) => {
       this.arrayBuffer_user_info = fileReader.result;
       var data = new Uint8Array(this.arrayBuffer_user_info);
       var arr = new Array();
       for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
       var bstr = arr.join("");
      //  var workbook = XLSX.read(bstr, { type: "binary" });
      var workbook = XLSX.read(bstr, { type: "binary", cellDates:true, cellNF:false, cellText:false });
       // zero for first sheet
       var first_sheet_name = workbook.SheetNames[0];
       var worksheet = workbook.Sheets[first_sheet_name];
       // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      
      //  this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true})
      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet)
       console.log(this.main_customer_location_data)
       console.log(this.main_customer_location_data.length)
      
       this.main_customer_location_data.forEach(element => {
         
        // this.date=new Date();
        // let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
         // For user_info
         this.UserInfo_Model.USER_INFO_GUID = element.USER_INFO_GUID;
         this.UserInfo_Model.USER_GUID = element.USER_GUID;
         this.UserInfo_Model.FULLNAME = element.FULLNAME;
         this.UserInfo_Model.NICKNAME = element.NICKNAME;
         this.UserInfo_Model.SALUTATION = element.SALUTATION;
         this.UserInfo_Model.MANAGER_USER_GUID = element.MANAGER_USER_GUID;
         this.UserInfo_Model.PERSONAL_ID_TYPE = element.PERSONAL_ID_TYPE;
         this.UserInfo_Model.PERSONAL_ID = element.PERSONAL_ID;
         this.UserInfo_Model.DOB = element.DOB;
         this.UserInfo_Model.GENDER = element.GENDER;
         this.UserInfo_Model.JOIN_DATE = element.JOIN_DATE;
//  let x=new Date(element.JOIN_DATE); 
          // this.UserInfo_Model.JOIN_DATE =this.fd(element.JOIN_DATE, 'd MMM yy HH:mm', 'en');;
        // this.UserInfo_Model.JOIN_DATE = XLSX.utils.format_cell(element.JOIN_DATE, {dateNF:"YYYY-MM-DD"});
        // this.UserInfo_Model.JOIN_DATE = this.datepipe.transform(element.JOIN_DATE, 'yyyy-MM-dd');
        // ;Constants.DATE_TIME_FMT
         this.UserInfo_Model.MARITAL_STATUS = element.MARITAL_STATUS;
         this.UserInfo_Model.BRANCH = element.BRANCH;
         this.UserInfo_Model.EMPLOYEE_TYPE = element.EMPLOYEE_TYPE;
         this.UserInfo_Model.APPROVER1 = element.APPROVER1;
         this.UserInfo_Model.APPROVER2 = element.APPROVER2;
         this.UserInfo_Model.EMPLOYEE_STATUS = element.EMPLOYEE_STATUS;
         this.UserInfo_Model.DEPT_GUID = element.DEPT_GUID;
         this.UserInfo_Model.DESIGNATION_GUID = element.DESIGNATION_GUID;
         this.UserInfo_Model.RESIGNATION_DATE = element.RESIGNATION_DATE;
         this.UserInfo_Model.TENANT_COMPANY_GUID = element.TENANT_COMPANY_GUID;
         this.UserInfo_Model.CONFIRMATION_DATE = element.CONFIRMATION_DATE;
         this.UserInfo_Model.TENANT_COMPANY_SITE_GUID = element.TENANT_COMPANY_SITE_GUID;
         this.UserInfo_Model.EMG_CONTACT_NAME_1 = element.EMG_CONTACT_NAME_1;
         this.UserInfo_Model.EMG_RELATIONSHIP_1 = element.EMG_RELATIONSHIP_1;
         this.UserInfo_Model.EMG_CONTACT_NUMBER_1 = element.EMG_CONTACT_NUMBER_1;
         this.UserInfo_Model.EMG_CONTACT_NAME_2 = element.EMG_CONTACT_NAME_2;
         this.UserInfo_Model.EMG_RELATIONSHIP_2 = element.EMG_RELATIONSHIP_2;
         this.UserInfo_Model.EMG_CONTACT_NUMBER_2 = element.EMG_CONTACT_NUMBER_2;
         this.UserInfo_Model.PR_EPF_NUMBER = element.PR_EPF_NUMBER;
         this.UserInfo_Model.PR_INCOMETAX_NUMBER = element.PR_INCOMETAX_NUMBER;
         this.UserInfo_Model.BANK_GUID = element.BANK_GUID;
         this.UserInfo_Model.PR_ACCOUNT_NUMBER = element.PR_ACCOUNT_NUMBER;
         this.UserInfo_Model.ATTACHMENT_ID = element.ATTACHMENT_ID;
         
         this.UserInfo_Model.CREATION_TS = new Date().toISOString();;
         this.UserInfo_Model.CREATION_USER_GUID = 'sva_test';
         this.UserInfo_Model.UPDATE_TS = new Date().toISOString();;
         this.UserInfo_Model.UPDATE_USER_GUID = 'sva_test';
 
 
         var queryHeaders = new Headers();
         queryHeaders.append('Content-Type', 'application/json');
         queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
         let options = new RequestOptions({ headers: queryHeaders });
         return new Promise((resolve, reject) => {
           this.http.post(this.user_info_Url, this.UserInfo_Model.toJson(true), options)
             .map((response) => {
               return response;
             }).subscribe((response) => {
               resolve(response.json());
             })
         })
       });
     }
     fileReader.readAsArrayBuffer(this.file_user_info);
 
   }

    // For user_address
    chooseFile_user_address:boolean = false;
    arrayBuffer_user_address: any;
    file_user_address: File;
    user_address_Url:any;
    UserAddress_Model: UserAddress_Model = new UserAddress_Model();
    user_address_data: any[];
 
    user_address(event: any) {
      this.chooseFile_user_address = true;
      this.file_user_address = event.target.files[0];
    } 
    user_address_click() {
       this.user_address_Url = constants.DREAMFACTORY_TABLE_URL + '/user_address?&api_key=' + constants.DREAMFACTORY_API_KEY;
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer_user_address = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer_user_address);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        // zero for first sheet
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
  
        this.user_address_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
        console.log(this.user_address_data)
        console.log(this.user_address_data.length)
       
        this.user_address_data.forEach(element => {
          
          // For user_address
          this.UserAddress_Model.USER_ADDRESS_GUID = element.USER_ADDRESS_GUID;
          this.UserAddress_Model.USER_GUID = element.USER_GUID;
          this.UserAddress_Model.ADDRESS_TYPE = element.ADDRESS_TYPE;
          this.UserAddress_Model.USER_ADDRESS1 = element.USER_ADDRESS1;
          this.UserAddress_Model.USER_ADDRESS2 = element.USER_ADDRESS2;
          this.UserAddress_Model.USER_ADDRESS3 = element.USER_ADDRESS3;
          this.UserAddress_Model.POST_CODE = element.POST_CODE;
          this.UserAddress_Model.COUNTRY_GUID = element.COUNTRY_GUID;
          this.UserAddress_Model.STATE_GUID = element.STATE_GUID;        
          
          this.UserAddress_Model.CREATION_TS = new Date().toISOString();;
          this.UserAddress_Model.CREATION_USER_GUID = 'sva_test';
          this.UserAddress_Model.UPDATE_TS = new Date().toISOString();;
          this.UserAddress_Model.UPDATE_USER_GUID = 'sva_test';
  
  
          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve, reject) => {
            this.http.post(this.user_address_Url, this.UserAddress_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        });
      }
      fileReader.readAsArrayBuffer(this.file_user_address);
  
    }

     // For user_company
     chooseFile_user_company:boolean = false;
     arrayBuffer_user_company: any;
     file_user_company: File;
     user_company_Url:any;
     UserCompany_Model: UserCompany_Model = new UserCompany_Model();
     user_company_data: any[];
  
     user_company(event: any) {
       this.chooseFile_user_company = true;
       this.file_user_company = event.target.files[0];
     } 
     user_company_click() {
        this.user_company_Url = constants.DREAMFACTORY_TABLE_URL + '/user_company?&api_key=' + constants.DREAMFACTORY_API_KEY;
       let fileReader = new FileReader();
       fileReader.onload = (e) => {
         this.arrayBuffer_user_company = fileReader.result;
         var data = new Uint8Array(this.arrayBuffer_user_company);
         var arr = new Array();
         for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
         var bstr = arr.join("");
         var workbook = XLSX.read(bstr, { type: "binary" });
         // zero for first sheet
         var first_sheet_name = workbook.SheetNames[0];
         var worksheet = workbook.Sheets[first_sheet_name];
         // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
   
         this.user_company_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
         console.log(this.user_company_data)
         console.log(this.user_company_data.length)
        
         this.user_company_data.forEach(element => {
           
           // For user_company
           this.UserCompany_Model.USER_COMPANY_GUID = element.USER_COMPANY_GUID;
           this.UserCompany_Model.USER_GUID = element.USER_GUID;
           this.UserCompany_Model.TENANT_COMPANY_SITE_GUID = element.TENANT_COMPANY_SITE_GUID;
           this.UserCompany_Model.COMPANY_CONTACT_NO = element.COMPANY_CONTACT_NO;
                     
           this.UserCompany_Model.CREATION_TS = new Date().toISOString();;
           this.UserCompany_Model.CREATION_USER_GUID = 'sva_test';
           this.UserCompany_Model.UPDATE_TS = new Date().toISOString();;
           this.UserCompany_Model.UPDATE_USER_GUID = 'sva_test';
   
   
           var queryHeaders = new Headers();
           queryHeaders.append('Content-Type', 'application/json');
           queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
           let options = new RequestOptions({ headers: queryHeaders });
           return new Promise((resolve, reject) => {
             this.http.post(this.user_company_Url, this.UserCompany_Model.toJson(true), options)
               .map((response) => {
                 return response;
               }).subscribe((response) => {
                 resolve(response.json());
               })
           })
         });
       }
       fileReader.readAsArrayBuffer(this.file_user_company);
   
     }

      // For user_contact
      chooseFile_user_contact:boolean = false;
      arrayBuffer_user_contact: any;
      file_user_contact: File;
      user_contact_Url:any;
      UserContact_Model: UserContact_Model = new UserContact_Model();
      user_contact_data: any[];
   
      user_contact(event: any) {
        this.chooseFile_user_contact = true;
        this.file_user_contact = event.target.files[0];
      } 
      user_contact_click() {
         this.user_contact_Url = constants.DREAMFACTORY_TABLE_URL + '/user_contact?&api_key=' + constants.DREAMFACTORY_API_KEY;
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer_user_contact = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer_user_contact);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          // zero for first sheet
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    
          this.user_contact_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
          console.log(this.user_contact_data)
          console.log(this.user_contact_data.length)
         
          this.user_contact_data.forEach(element => {
            
            // For user_contact
            this.UserContact_Model.CONTACT_INFO_GUID = element.CONTACT_INFO_GUID;
            this.UserContact_Model.USER_GUID = element.USER_GUID;
            this.UserContact_Model.TYPE = element.TYPE;
            this.UserContact_Model.CONTACT_NO = element.CONTACT_NO;
            this.UserContact_Model.DESCRIPTION = element.DESCRIPTION;
            this.UserContact_Model.REMARKS = element.REMARKS;
                      
            this.UserContact_Model.CREATION_TS = new Date().toISOString();;
            this.UserContact_Model.CREATION_USER_GUID = 'sva_test';
            this.UserContact_Model.UPDATE_TS = new Date().toISOString();;
            this.UserContact_Model.UPDATE_USER_GUID = 'sva_test';
    
    
            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve, reject) => {
              this.http.post(this.user_contact_Url, this.UserContact_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  resolve(response.json());
                })
            })
          });
        }
        fileReader.readAsArrayBuffer(this.file_user_contact);
    
      }

      // For user_qualification
      chooseFile_user_qualification: boolean = false;
      arrayBuffer_user_qualification: any;
      file_user_qualification: File;
      user_qualification_Url:any;
      UserQualification_Model: UserQualification_Model = new UserQualification_Model();
      user_qualification_data: any[];
   
      user_qualification(event: any) {
        this.chooseFile_user_qualification = true;
        this.file_user_qualification = event.target.files[0];
      } 
      user_qualification_click() {
         this.user_qualification_Url = constants.DREAMFACTORY_TABLE_URL + '/user_qualification?&api_key=' + constants.DREAMFACTORY_API_KEY;
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer_user_qualification = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer_user_qualification);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          // zero for first sheet
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    
          this.user_qualification_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
          console.log(this.user_qualification_data)
          console.log(this.user_qualification_data.length)
         
          this.user_qualification_data.forEach(element => {
            
            // For user_qualification
            this.UserQualification_Model.USER_QUALIFICATION_GUID = element.USER_QUALIFICATION_GUID;
            this.UserQualification_Model.QUALIFICATION_GUID = element.QUALIFICATION_GUID;
            this.UserQualification_Model.USER_GUID = element.USER_GUID;
            this.UserQualification_Model.HIGHEST_QUALIFICATION = element.HIGHEST_QUALIFICATION;
            this.UserQualification_Model.MAJOR = element.MAJOR;
            this.UserQualification_Model.UNIVERSITY = element.UNIVERSITY;
            this.UserQualification_Model.YEAR = element.YEAR;
            this.UserQualification_Model.ATTACHMENT = element.ATTACHMENT;
                      
            this.UserQualification_Model.CREATION_TS = new Date().toISOString();;
            this.UserQualification_Model.CREATION_USER_GUID = 'sva_test';
            this.UserQualification_Model.UPDATE_TS = new Date().toISOString();;
            this.UserQualification_Model.UPDATE_USER_GUID = 'sva_test';    
    
            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
            let options = new RequestOptions({ headers: queryHeaders });
            return new Promise((resolve, reject) => {
              this.http.post(this.user_qualification_Url, this.UserQualification_Model.toJson(true), options)
                .map((response) => {
                  return response;
                }).subscribe((response) => {
                  resolve(response.json());
                })
            })
          });
        }
        fileReader.readAsArrayBuffer(this.file_user_qualification);    
      }

       // For user_role
       chooseFile_user_role: boolean = false;
       arrayBuffer_user_role: any;
       file_user_role: File;
       user_role_Url:any;
       UserRole_Model: UserRole_Model = new UserRole_Model();
       user_role_data: any[];
    
       user_role(event: any) {
         this.chooseFile_user_role = true;
         this.file_user_role = event.target.files[0];
       } 
       user_role_click() {
          this.user_role_Url = constants.DREAMFACTORY_TABLE_URL + '/user_role?&api_key=' + constants.DREAMFACTORY_API_KEY;
         let fileReader = new FileReader();
         fileReader.onload = (e) => {
           this.arrayBuffer_user_role = fileReader.result;
           var data = new Uint8Array(this.arrayBuffer_user_role);
           var arr = new Array();
           for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
           var bstr = arr.join("");
           var workbook = XLSX.read(bstr, { type: "binary" });
           // zero for first sheet
           var first_sheet_name = workbook.SheetNames[0];
           var worksheet = workbook.Sheets[first_sheet_name];
           // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
     
           this.user_role_data = XLSX.utils.sheet_to_json(worksheet, { raw: true })
           console.log(this.user_role_data)
           console.log(this.user_role_data.length)
          
           this.user_role_data.forEach(element => {
             
             // For user_role
             this.UserRole_Model.USER_ROLE_GUID = element.USER_ROLE_GUID;
             this.UserRole_Model.USER_GUID = element.USER_GUID;
             this.UserRole_Model.ROLE_GUID = element.ROLE_GUID;
             this.UserRole_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;
                                   
             this.UserRole_Model.CREATION_TS = new Date().toISOString();;
             this.UserRole_Model.CREATION_USER_GUID = 'sva_test';
             this.UserRole_Model.UPDATE_TS = new Date().toISOString();;
             this.UserRole_Model.UPDATE_USER_GUID = 'sva_test';    
     
             var queryHeaders = new Headers();
             queryHeaders.append('Content-Type', 'application/json');
             queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
             let options = new RequestOptions({ headers: queryHeaders });
             return new Promise((resolve, reject) => {
               this.http.post(this.user_role_Url, this.UserRole_Model.toJson(true), options)
                 .map((response) => {
                   return response;
                 }).subscribe((response) => {
                   resolve(response.json());
                 })
             })
           });
         }
         fileReader.readAsArrayBuffer(this.file_user_role);    
       }

}
