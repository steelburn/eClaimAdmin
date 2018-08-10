import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
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
import { Main_Attendance_Model } from '../../models/main_attendance_model';
import { Device_Raw_Data_Model } from '../../models/device_raw_data_model';
import { Leave_Raw_Data_Model } from '../../models/leave_raw_data_model';

import * as constants from '../../config/constants';

import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';

// import * as constants from '../../app/config/constants';
import * as XLSX from 'xlsx';
import { UUID } from 'angular2-uuid';
import { Constants } from './../util/constants';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import moment from 'moment';

import {Observable} from 'rxjs/Rx';
// import {Observable} from 'rxjs/Observable';
import {saveAs as importedSaveAs} from "file-saver";

// import { ExcelService } from '../../providers/excel.service';
// // import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { saveAs } from 'file-saver/FileSaver';

// import { ConfigService } from 'app/common/services/config.service';
// import { getFileNameFromResponseContentDisposition, saveFile } from 'app/core/helpers/file-download-helper';

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
 providers: [DatePipe, DataTransfer]
})

export class ImportExcelDataPage {
  
  @ViewChild('fileInputAttendance') fileInputAttendance: ElementRef;
  @ViewChild('fileInputLeave') fileInputLeave: ElementRef;

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

  constructor(private apiMng: ApiManagerProvider, public datepipe: DatePipe, public navCtrl: NavController, public navParams: NavParams, public http: Http, private loadingCtrl: LoadingController) {
    this.Get_Device_GUID();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportExcelDataPage');
  }

  //duplicate check for main_customer
  duplicateCheck_mainCustomer(checkData: any) {
    this.apiMng.getApiModel('main_customer', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocCustomer_Model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.SocCustomer_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.SocCustomer_Model.NAME = checkData.NAME;
          this.SocCustomer_Model.DESCRIPTION = checkData.DESCRIPTION;
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
        }
        else {
          return
        }
      })
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
        this.duplicateCheck_mainCustomer(element);
        // For main_customer
        // this.SocCustomer_Model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        // this.SocCustomer_Model.TENANT_GUID = element.TENANT_GUID;
        // this.SocCustomer_Model.NAME = element.NAME;
        // this.SocCustomer_Model.DESCRIPTION = element.DESCRIPTION;
        // this.SocCustomer_Model.CREATION_TS = new Date().toISOString();;
        // this.SocCustomer_Model.CREATION_USER_GUID = 'sva_test';
        // this.SocCustomer_Model.UPDATE_TS = new Date().toISOString();;
        // this.SocCustomer_Model.UPDATE_USER_GUID = 'sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.main_customer_Url, this.SocCustomer_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_customer);
  }

  //duplicate check for main_customer
  duplicateCheck_mainProject(checkData: any) {
    this.apiMng.getApiModel('main_project', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.test_model.PROJECT_GUID = checkData.PROJECT_GUID;
          this.test_model.NAME = checkData.NAME;
          this.test_model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.test_model.CUSTOMER_LOCATION_GUID = checkData.CUSTOMER_LOCATION_GUID;
          this.test_model.TENANT_GUID = checkData.TENANT_GUID;
          this.test_model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;
          this.test_model.CREATION_TS = new Date().toISOString();;
          this.test_model.CREATION_USER_GUID = 'sva_test';
          this.test_model.UPDATE_TS = new Date().toISOString();;
          this.test_model.UPDATE_USER_GUID = 'sva_test';

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve, reject) => {
            this.http.post(this.baseResourceurl_Excel, this.test_model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());
              })
          })
        }
        else {
          return
        }
      })
  }

  // For main_project
  chooseFile_incomingfile: boolean = false;
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
        this.duplicateCheck_mainProject(element);

        // 2)For main_project table
        // this.test_model.PROJECT_GUID = element.PROJECT_GUID;
        // this.test_model.NAME = element.NAME;
        // this.test_model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        // this.test_model.CUSTOMER_LOCATION_GUID = element.CUSTOMER_LOCATION_GUID;
        // this.test_model.TENANT_GUID = element.TENANT_GUID;
        // this.test_model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;
        // // this.test_model.ACTIVATION_FLAG = "1";

        // this.test_model.CREATION_TS = new Date().toISOString();;
        // this.test_model.CREATION_USER_GUID = 'sva_test';
        // this.test_model.UPDATE_TS = new Date().toISOString();;
        // this.test_model.UPDATE_USER_GUID = 'sva_test';      


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // //queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.baseResourceurl_Excel, this.test_model.toJson(true), options)
        //     .map((response) => {
        //       // alert('Imported successfully')
        //       return response;

        //     }).subscribe((response) => {
        //       resolve(response.json());
        //       // alert('Import Failed')
        //     })
        // })

      });
      // alert('Imported successfully')
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  //duplicate check for main_customer_location
  duplicateCheck_mainCustomerLocation(checkData: any) {
    this.apiMng.getApiModel('main_project', 'filter=CUSTOMER_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocCustomerLocation_Model.CUSTOMER_GUID = checkData.CUSTOMER_GUID;
          this.SocCustomerLocation_Model.CUSTOMER_LOCATION_GUID = checkData.CUSTOMER_LOCATION_GUID;
          this.SocCustomerLocation_Model.NAME = checkData.NAME;
          this.SocCustomerLocation_Model.DESCRIPTION = checkData.DESCRIPTION;
          this.SocCustomerLocation_Model.REGISTRATION_NO = checkData.REGISTRATION_NO;
          this.SocCustomerLocation_Model.ADDRESS1 = checkData.ADDRESS1;
          this.SocCustomerLocation_Model.ADDRESS2 = checkData.ADDRESS2;
          this.SocCustomerLocation_Model.ADDRESS3 = checkData.ADDRESS3;
          this.SocCustomerLocation_Model.CONTACT_PERSON = checkData.CONTACT_PERSON;
          this.SocCustomerLocation_Model.CONTACT_PERSON_MOBILE_NO = checkData.CONTACT_PERSON_MOBILE_NO;
          this.SocCustomerLocation_Model.CONTACT_NO1 = checkData.CONTACT_NO1;
          this.SocCustomerLocation_Model.CONTACT_NO2 = checkData.CONTACT_NO2;
          this.SocCustomerLocation_Model.EMAIL = checkData.EMAIL;
          this.SocCustomerLocation_Model.DIVISION = checkData.DIVISION;


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
        }
        else {
          return
        }
      })
  }

  // For main_customer_location
  chooseFile_main_customer_location: boolean = false;
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
        this.duplicateCheck_mainCustomerLocation(element);

        // For main_customer_location
        // this.SocCustomerLocation_Model.CUSTOMER_GUID = element.CUSTOMER_GUID;
        // this.SocCustomerLocation_Model.CUSTOMER_LOCATION_GUID = element.CUSTOMER_LOCATION_GUID;
        // this.SocCustomerLocation_Model.NAME = element.NAME;
        // this.SocCustomerLocation_Model.DESCRIPTION = element.DESCRIPTION;
        // this.SocCustomerLocation_Model.REGISTRATION_NO = element.REGISTRATION_NO;
        // this.SocCustomerLocation_Model.ADDRESS1 = element.ADDRESS1;
        // this.SocCustomerLocation_Model.ADDRESS2 = element.ADDRESS2;
        // this.SocCustomerLocation_Model.ADDRESS3 = element.ADDRESS3;
        // this.SocCustomerLocation_Model.CONTACT_PERSON = element.CONTACT_PERSON;
        // this.SocCustomerLocation_Model.CONTACT_PERSON_MOBILE_NO = element.CONTACT_PERSON_MOBILE_NO;
        // this.SocCustomerLocation_Model.CONTACT_NO1 = element.CONTACT_NO1;
        // this.SocCustomerLocation_Model.CONTACT_NO2 = element.CONTACT_NO2;
        // this.SocCustomerLocation_Model.EMAIL = element.EMAIL;
        // this.SocCustomerLocation_Model.DIVISION = element.DIVISION;


        // this.SocCustomerLocation_Model.CREATION_TS = new Date().toISOString();;
        // this.SocCustomerLocation_Model.CREATION_USER_GUID = 'sva_test';
        // this.SocCustomerLocation_Model.UPDATE_TS = new Date().toISOString();;
        // this.SocCustomerLocation_Model.UPDATE_USER_GUID = 'sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.main_customer_location_Url, this.SocCustomerLocation_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file);

  }

  //duplicate check for soc_main
  duplicateCheck_SOCMain(checkData: any) {
    this.apiMng.getApiModel('soc_main', 'filter=PROJECT_GUID=' + checkData.CUSTOMER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.SocMain_Model.SOC_GUID = checkData.SOC_GUID;
          this.SocMain_Model.SOC_NO = checkData.SOC_NO;
          this.SocMain_Model.PROJECT_GUID = checkData.PROJECT_GUID;
          this.SocMain_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.SocMain_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

          this.SocMain_Model.CREATION_TS = new Date().toISOString();;
          this.SocMain_Model.CREATION_USER_GUID = 'sva_test';
          this.SocMain_Model.UPDATE_TS = new Date().toISOString();;
          this.SocMain_Model.UPDATE_USER_GUID = 'sva_test';

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
        }
        else {
          return
        }
      })
  }

  // For soc_main
  chooseFile_soc_main: boolean = false;
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
        this.duplicateCheck_SOCMain(element);
        // For soc_main table
        // this.SocMain_Model.SOC_GUID = element.SOC_GUID;
        // this.SocMain_Model.SOC_NO = element.SOC_NO;
        // this.SocMain_Model.PROJECT_GUID = element.PROJECT_GUID;
        // this.SocMain_Model.TENANT_GUID = element.TENANT_GUID;
        // this.SocMain_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;

        // this.SocMain_Model.CREATION_TS = new Date().toISOString();;
        // this.SocMain_Model.CREATION_USER_GUID = 'sva_test';
        // this.SocMain_Model.UPDATE_TS = new Date().toISOString();;
        // this.SocMain_Model.UPDATE_USER_GUID='sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.soc_main_Url, this.SocMain_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_soc_main);
  }

  //duplicate check for user_main
  duplicateCheck_userMain(checkData: any) {
    this.apiMng.getApiModel('user_main', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserMain_Model.USER_GUID = checkData.USER_GUID;
          this.UserMain_Model.TENANT_GUID = checkData.TENANT_GUID;
          this.UserMain_Model.STAFF_ID = checkData.STAFF_ID;
          this.UserMain_Model.LOGIN_ID = checkData.LOGIN_ID;
          this.UserMain_Model.PASSWORD = checkData.PASSWORD;
          this.UserMain_Model.EMAIL = checkData.EMAIL;
          this.UserMain_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;
          this.UserMain_Model.IS_TENANT_ADMIN = checkData.IS_TENANT_ADMIN;

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
        }
        else {
          return
        }
      })
  }


  // For user_main
  chooseFile_user_main: boolean = false;
  arrayBuffer_user_main: any;
  file_user_main: File;
  user_main_Url: any;
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
        this.duplicateCheck_userMain(element);
        // For user_main
        //  this.UserMain_Model.USER_GUID = element.USER_GUID;
        //  this.UserMain_Model.TENANT_GUID = element.TENANT_GUID;
        //  this.UserMain_Model.STAFF_ID = element.STAFF_ID;
        //  this.UserMain_Model.LOGIN_ID = element.LOGIN_ID;
        //  this.UserMain_Model.PASSWORD = element.PASSWORD;
        //  this.UserMain_Model.EMAIL = element.EMAIL;
        //  this.UserMain_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;
        //  this.UserMain_Model.IS_TENANT_ADMIN = element.IS_TENANT_ADMIN;

        //  this.UserMain_Model.CREATION_TS = new Date().toISOString();;
        //  this.UserMain_Model.CREATION_USER_GUID = 'sva_test';
        //  this.UserMain_Model.UPDATE_TS = new Date().toISOString();;
        //  this.UserMain_Model.UPDATE_USER_GUID = 'sva_test';


        //  var queryHeaders = new Headers();
        //  queryHeaders.append('Content-Type', 'application/json');
        //  queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        //  let options = new RequestOptions({ headers: queryHeaders });
        //  return new Promise((resolve, reject) => {
        //    this.http.post(this.user_main_Url, this.UserMain_Model.toJson(true), options)
        //      .map((response) => {
        //        return response;
        //      }).subscribe((response) => {
        //        resolve(response.json());
        //      })
        //  })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_main);
  }

  //duplicate check for user_info
  duplicateCheck_userInfo(checkData: any) {
    this.apiMng.getApiModel('user_info', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserInfo_Model.USER_INFO_GUID = checkData.USER_INFO_GUID;
          this.UserInfo_Model.USER_GUID = checkData.USER_GUID;
          this.UserInfo_Model.FULLNAME = checkData.FULLNAME;
          this.UserInfo_Model.NICKNAME = checkData.NICKNAME;
          this.UserInfo_Model.SALUTATION = checkData.SALUTATION;
          this.UserInfo_Model.MANAGER_USER_GUID = checkData.MANAGER_USER_GUID;
          this.UserInfo_Model.PERSONAL_ID_TYPE = checkData.PERSONAL_ID_TYPE;
          this.UserInfo_Model.PERSONAL_ID = checkData.PERSONAL_ID;
          this.UserInfo_Model.DOB = checkData.DOB;
          this.UserInfo_Model.GENDER = checkData.GENDER;
          this.UserInfo_Model.JOIN_DATE = checkData.JOIN_DATE;
          //  let x=new Date(element.JOIN_DATE); 
          // this.UserInfo_Model.JOIN_DATE =this.fd(element.JOIN_DATE, 'd MMM yy HH:mm', 'en');;
          // this.UserInfo_Model.JOIN_DATE = XLSX.utils.format_cell(element.JOIN_DATE, {dateNF:"YYYY-MM-DD"});
          // this.UserInfo_Model.JOIN_DATE = this.datepipe.transform(element.JOIN_DATE, 'yyyy-MM-dd');
          // ;Constants.DATE_TIME_FMT
          this.UserInfo_Model.MARITAL_STATUS = checkData.MARITAL_STATUS;
          this.UserInfo_Model.BRANCH = checkData.BRANCH;
          this.UserInfo_Model.EMPLOYEE_TYPE = checkData.EMPLOYEE_TYPE;
          this.UserInfo_Model.APPROVER1 = checkData.APPROVER1;
          this.UserInfo_Model.APPROVER2 = checkData.APPROVER2;
          this.UserInfo_Model.EMPLOYEE_STATUS = checkData.EMPLOYEE_STATUS;
          this.UserInfo_Model.DEPT_GUID = checkData.DEPT_GUID;
          this.UserInfo_Model.DESIGNATION_GUID = checkData.DESIGNATION_GUID;
          this.UserInfo_Model.RESIGNATION_DATE = checkData.RESIGNATION_DATE;
          this.UserInfo_Model.TENANT_COMPANY_GUID = checkData.TENANT_COMPANY_GUID;
          this.UserInfo_Model.CONFIRMATION_DATE = checkData.CONFIRMATION_DATE;
          this.UserInfo_Model.TENANT_COMPANY_SITE_GUID = checkData.TENANT_COMPANY_SITE_GUID;
          this.UserInfo_Model.EMG_CONTACT_NAME_1 = checkData.EMG_CONTACT_NAME_1;
          this.UserInfo_Model.EMG_RELATIONSHIP_1 = checkData.EMG_RELATIONSHIP_1;
          this.UserInfo_Model.EMG_CONTACT_NUMBER_1 = checkData.EMG_CONTACT_NUMBER_1;
          this.UserInfo_Model.EMG_CONTACT_NAME_2 = checkData.EMG_CONTACT_NAME_2;
          this.UserInfo_Model.EMG_RELATIONSHIP_2 = checkData.EMG_RELATIONSHIP_2;
          this.UserInfo_Model.EMG_CONTACT_NUMBER_2 = checkData.EMG_CONTACT_NUMBER_2;
          this.UserInfo_Model.PR_EPF_NUMBER = checkData.PR_EPF_NUMBER;
          this.UserInfo_Model.PR_INCOMETAX_NUMBER = checkData.PR_INCOMETAX_NUMBER;
          this.UserInfo_Model.BANK_GUID = checkData.BANK_GUID;
          this.UserInfo_Model.PR_ACCOUNT_NUMBER = checkData.PR_ACCOUNT_NUMBER;
          this.UserInfo_Model.ATTACHMENT_ID = checkData.ATTACHMENT_ID;

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
        }
        else {
          return
        }
      })
  }

  // For user_info
  chooseFile_user_info: boolean = false;
  arrayBuffer_user_info: any;
  file_user_info: File;
  user_info_Url: any;
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
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));

      //  this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet, { raw: true})
      this.main_customer_location_data = XLSX.utils.sheet_to_json(worksheet)
      console.log(this.main_customer_location_data)
      console.log(this.main_customer_location_data.length)

      this.main_customer_location_data.forEach(element => {
        this.duplicateCheck_userInfo(element);

        // this.date=new Date();
        // let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
        // For user_info
        //          this.UserInfo_Model.USER_INFO_GUID = element.USER_INFO_GUID;
        //          this.UserInfo_Model.USER_GUID = element.USER_GUID;
        //          this.UserInfo_Model.FULLNAME = element.FULLNAME;
        //          this.UserInfo_Model.NICKNAME = element.NICKNAME;
        //          this.UserInfo_Model.SALUTATION = element.SALUTATION;
        //          this.UserInfo_Model.MANAGER_USER_GUID = element.MANAGER_USER_GUID;
        //          this.UserInfo_Model.PERSONAL_ID_TYPE = element.PERSONAL_ID_TYPE;
        //          this.UserInfo_Model.PERSONAL_ID = element.PERSONAL_ID;
        //          this.UserInfo_Model.DOB = element.DOB;
        //          this.UserInfo_Model.GENDER = element.GENDER;
        //          this.UserInfo_Model.JOIN_DATE = element.JOIN_DATE;
        // //  let x=new Date(element.JOIN_DATE); 
        //           // this.UserInfo_Model.JOIN_DATE =this.fd(element.JOIN_DATE, 'd MMM yy HH:mm', 'en');;
        //         // this.UserInfo_Model.JOIN_DATE = XLSX.utils.format_cell(element.JOIN_DATE, {dateNF:"YYYY-MM-DD"});
        //         // this.UserInfo_Model.JOIN_DATE = this.datepipe.transform(element.JOIN_DATE, 'yyyy-MM-dd');
        //         // ;Constants.DATE_TIME_FMT
        //          this.UserInfo_Model.MARITAL_STATUS = element.MARITAL_STATUS;
        //          this.UserInfo_Model.BRANCH = element.BRANCH;
        //          this.UserInfo_Model.EMPLOYEE_TYPE = element.EMPLOYEE_TYPE;
        //          this.UserInfo_Model.APPROVER1 = element.APPROVER1;
        //          this.UserInfo_Model.APPROVER2 = element.APPROVER2;
        //          this.UserInfo_Model.EMPLOYEE_STATUS = element.EMPLOYEE_STATUS;
        //          this.UserInfo_Model.DEPT_GUID = element.DEPT_GUID;
        //          this.UserInfo_Model.DESIGNATION_GUID = element.DESIGNATION_GUID;
        //          this.UserInfo_Model.RESIGNATION_DATE = element.RESIGNATION_DATE;
        //          this.UserInfo_Model.TENANT_COMPANY_GUID = element.TENANT_COMPANY_GUID;
        //          this.UserInfo_Model.CONFIRMATION_DATE = element.CONFIRMATION_DATE;
        //          this.UserInfo_Model.TENANT_COMPANY_SITE_GUID = element.TENANT_COMPANY_SITE_GUID;
        //          this.UserInfo_Model.EMG_CONTACT_NAME_1 = element.EMG_CONTACT_NAME_1;
        //          this.UserInfo_Model.EMG_RELATIONSHIP_1 = element.EMG_RELATIONSHIP_1;
        //          this.UserInfo_Model.EMG_CONTACT_NUMBER_1 = element.EMG_CONTACT_NUMBER_1;
        //          this.UserInfo_Model.EMG_CONTACT_NAME_2 = element.EMG_CONTACT_NAME_2;
        //          this.UserInfo_Model.EMG_RELATIONSHIP_2 = element.EMG_RELATIONSHIP_2;
        //          this.UserInfo_Model.EMG_CONTACT_NUMBER_2 = element.EMG_CONTACT_NUMBER_2;
        //          this.UserInfo_Model.PR_EPF_NUMBER = element.PR_EPF_NUMBER;
        //          this.UserInfo_Model.PR_INCOMETAX_NUMBER = element.PR_INCOMETAX_NUMBER;
        //          this.UserInfo_Model.BANK_GUID = element.BANK_GUID;
        //          this.UserInfo_Model.PR_ACCOUNT_NUMBER = element.PR_ACCOUNT_NUMBER;
        //          this.UserInfo_Model.ATTACHMENT_ID = element.ATTACHMENT_ID;

        //          this.UserInfo_Model.CREATION_TS = new Date().toISOString();;
        //          this.UserInfo_Model.CREATION_USER_GUID = 'sva_test';
        //          this.UserInfo_Model.UPDATE_TS = new Date().toISOString();;
        //          this.UserInfo_Model.UPDATE_USER_GUID = 'sva_test';


        //          var queryHeaders = new Headers();
        //          queryHeaders.append('Content-Type', 'application/json');
        //          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        //          let options = new RequestOptions({ headers: queryHeaders });
        //          return new Promise((resolve, reject) => {
        //            this.http.post(this.user_info_Url, this.UserInfo_Model.toJson(true), options)
        //              .map((response) => {
        //                return response;
        //              }).subscribe((response) => {
        //                resolve(response.json());
        //              })
        //          })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_info);

  }

  //duplicate check for user_address
  duplicateCheck_userAddress(checkData: any) {
    this.apiMng.getApiModel('user_address', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserAddress_Model.USER_ADDRESS_GUID = checkData.USER_ADDRESS_GUID;
          this.UserAddress_Model.USER_GUID = checkData.USER_GUID;
          this.UserAddress_Model.ADDRESS_TYPE = checkData.ADDRESS_TYPE;
          this.UserAddress_Model.USER_ADDRESS1 = checkData.USER_ADDRESS1;
          this.UserAddress_Model.USER_ADDRESS2 = checkData.USER_ADDRESS2;
          this.UserAddress_Model.USER_ADDRESS3 = checkData.USER_ADDRESS3;
          this.UserAddress_Model.POST_CODE = checkData.POST_CODE;
          this.UserAddress_Model.COUNTRY_GUID = checkData.COUNTRY_GUID;
          this.UserAddress_Model.STATE_GUID = checkData.STATE_GUID;

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
        }
        else {
          return
        }
      })
  }

  // For user_address
  chooseFile_user_address: boolean = false;
  arrayBuffer_user_address: any;
  file_user_address: File;
  user_address_Url: any;
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
        this.duplicateCheck_userAddress(element);

        // For user_address
        // this.UserAddress_Model.USER_ADDRESS_GUID = element.USER_ADDRESS_GUID;
        // this.UserAddress_Model.USER_GUID = element.USER_GUID;
        // this.UserAddress_Model.ADDRESS_TYPE = element.ADDRESS_TYPE;
        // this.UserAddress_Model.USER_ADDRESS1 = element.USER_ADDRESS1;
        // this.UserAddress_Model.USER_ADDRESS2 = element.USER_ADDRESS2;
        // this.UserAddress_Model.USER_ADDRESS3 = element.USER_ADDRESS3;
        // this.UserAddress_Model.POST_CODE = element.POST_CODE;
        // this.UserAddress_Model.COUNTRY_GUID = element.COUNTRY_GUID;
        // this.UserAddress_Model.STATE_GUID = element.STATE_GUID;        

        // this.UserAddress_Model.CREATION_TS = new Date().toISOString();;
        // this.UserAddress_Model.CREATION_USER_GUID = 'sva_test';
        // this.UserAddress_Model.UPDATE_TS = new Date().toISOString();;
        // this.UserAddress_Model.UPDATE_USER_GUID = 'sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.user_address_Url, this.UserAddress_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_address);

  }

  //duplicate check for user_address
  duplicateCheck_userCompany(checkData: any) {
    this.apiMng.getApiModel('user_company', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserCompany_Model.USER_COMPANY_GUID = checkData.USER_COMPANY_GUID;
          this.UserCompany_Model.USER_GUID = checkData.USER_GUID;
          this.UserCompany_Model.TENANT_COMPANY_SITE_GUID = checkData.TENANT_COMPANY_SITE_GUID;
          this.UserCompany_Model.COMPANY_CONTACT_NO = checkData.COMPANY_CONTACT_NO;

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
        }
        else {
          return
        }
      })
  }

  // For user_company
  chooseFile_user_company: boolean = false;
  arrayBuffer_user_company: any;
  file_user_company: File;
  user_company_Url: any;
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
        this.duplicateCheck_userCompany(element);

        // For user_company
        //  this.UserCompany_Model.USER_COMPANY_GUID = element.USER_COMPANY_GUID;
        //  this.UserCompany_Model.USER_GUID = element.USER_GUID;
        //  this.UserCompany_Model.TENANT_COMPANY_SITE_GUID = element.TENANT_COMPANY_SITE_GUID;
        //  this.UserCompany_Model.COMPANY_CONTACT_NO = element.COMPANY_CONTACT_NO;

        //  this.UserCompany_Model.CREATION_TS = new Date().toISOString();;
        //  this.UserCompany_Model.CREATION_USER_GUID = 'sva_test';
        //  this.UserCompany_Model.UPDATE_TS = new Date().toISOString();;
        //  this.UserCompany_Model.UPDATE_USER_GUID = 'sva_test';


        //  var queryHeaders = new Headers();
        //  queryHeaders.append('Content-Type', 'application/json');
        //  queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        //  let options = new RequestOptions({ headers: queryHeaders });
        //  return new Promise((resolve, reject) => {
        //    this.http.post(this.user_company_Url, this.UserCompany_Model.toJson(true), options)
        //      .map((response) => {
        //        return response;
        //      }).subscribe((response) => {
        //        resolve(response.json());
        //      })
        //  })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_company);

  }

  //duplicate check for user_contact
  duplicateCheck_userContact(checkData: any) {
    this.apiMng.getApiModel('user_contact', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserContact_Model.CONTACT_INFO_GUID = checkData.CONTACT_INFO_GUID;
          this.UserContact_Model.USER_GUID = checkData.USER_GUID;
          this.UserContact_Model.TYPE = checkData.TYPE;
          this.UserContact_Model.CONTACT_NO = checkData.CONTACT_NO;
          this.UserContact_Model.DESCRIPTION = checkData.DESCRIPTION;
          this.UserContact_Model.REMARKS = checkData.REMARKS;

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
        }
        else {
          return
        }
      })
  }

  // For user_contact
  chooseFile_user_contact: boolean = false;
  arrayBuffer_user_contact: any;
  file_user_contact: File;
  user_contact_Url: any;
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
        this.duplicateCheck_userContact(element);

        // For user_contact
        // this.UserContact_Model.CONTACT_INFO_GUID = element.CONTACT_INFO_GUID;
        // this.UserContact_Model.USER_GUID = element.USER_GUID;
        // this.UserContact_Model.TYPE = element.TYPE;
        // this.UserContact_Model.CONTACT_NO = element.CONTACT_NO;
        // this.UserContact_Model.DESCRIPTION = element.DESCRIPTION;
        // this.UserContact_Model.REMARKS = element.REMARKS;

        // this.UserContact_Model.CREATION_TS = new Date().toISOString();;
        // this.UserContact_Model.CREATION_USER_GUID = 'sva_test';
        // this.UserContact_Model.UPDATE_TS = new Date().toISOString();;
        // this.UserContact_Model.UPDATE_USER_GUID = 'sva_test';


        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.user_contact_Url, this.UserContact_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_contact);

  }

  //duplicate check for user_qualification
  duplicateCheck_userQualification(checkData: any) {
    this.apiMng.getApiModel('user_qualification', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserQualification_Model.USER_QUALIFICATION_GUID = checkData.USER_QUALIFICATION_GUID;
          this.UserQualification_Model.QUALIFICATION_GUID = checkData.QUALIFICATION_GUID;
          this.UserQualification_Model.USER_GUID = checkData.USER_GUID;
          this.UserQualification_Model.HIGHEST_QUALIFICATION = checkData.HIGHEST_QUALIFICATION;
          this.UserQualification_Model.MAJOR = checkData.MAJOR;
          this.UserQualification_Model.UNIVERSITY = checkData.UNIVERSITY;
          this.UserQualification_Model.YEAR = checkData.YEAR;
          this.UserQualification_Model.ATTACHMENT = checkData.ATTACHMENT;

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
        }
        else {
          return
        }
      })
  }

  // For user_qualification
  chooseFile_user_qualification: boolean = false;
  arrayBuffer_user_qualification: any;
  file_user_qualification: File;
  user_qualification_Url: any;
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
        this.duplicateCheck_userQualification(element);

        // For user_qualification
        // this.UserQualification_Model.USER_QUALIFICATION_GUID = element.USER_QUALIFICATION_GUID;
        // this.UserQualification_Model.QUALIFICATION_GUID = element.QUALIFICATION_GUID;
        // this.UserQualification_Model.USER_GUID = element.USER_GUID;
        // this.UserQualification_Model.HIGHEST_QUALIFICATION = element.HIGHEST_QUALIFICATION;
        // this.UserQualification_Model.MAJOR = element.MAJOR;
        // this.UserQualification_Model.UNIVERSITY = element.UNIVERSITY;
        // this.UserQualification_Model.YEAR = element.YEAR;
        // this.UserQualification_Model.ATTACHMENT = element.ATTACHMENT;

        // this.UserQualification_Model.CREATION_TS = new Date().toISOString();;
        // this.UserQualification_Model.CREATION_USER_GUID = 'sva_test';
        // this.UserQualification_Model.UPDATE_TS = new Date().toISOString();;
        // this.UserQualification_Model.UPDATE_USER_GUID = 'sva_test';    

        // var queryHeaders = new Headers();
        // queryHeaders.append('Content-Type', 'application/json');
        // queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        // let options = new RequestOptions({ headers: queryHeaders });
        // return new Promise((resolve, reject) => {
        //   this.http.post(this.user_qualification_Url, this.UserQualification_Model.toJson(true), options)
        //     .map((response) => {
        //       return response;
        //     }).subscribe((response) => {
        //       resolve(response.json());
        //     })
        // })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_qualification);
  }

  //duplicate check for user_role
  duplicateCheck_userRole(checkData: any) {
    this.apiMng.getApiModel('user_role', 'filter=USER_GUID=' + checkData.USER_GUID)
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.UserRole_Model.USER_ROLE_GUID = checkData.USER_ROLE_GUID;
          this.UserRole_Model.USER_GUID = checkData.USER_GUID;
          this.UserRole_Model.ROLE_GUID = checkData.ROLE_GUID;
          this.UserRole_Model.ACTIVATION_FLAG = checkData.ACTIVATION_FLAG;

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
        }
        else {
          return
        }
      })
  }

  // For user_role
  chooseFile_user_role: boolean = false;
  arrayBuffer_user_role: any;
  file_user_role: File;
  user_role_Url: any;
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
        this.duplicateCheck_userRole(element);

        // For user_role
        //  this.UserRole_Model.USER_ROLE_GUID = element.USER_ROLE_GUID;
        //  this.UserRole_Model.USER_GUID = element.USER_GUID;
        //  this.UserRole_Model.ROLE_GUID = element.ROLE_GUID;
        //  this.UserRole_Model.ACTIVATION_FLAG = element.ACTIVATION_FLAG;

        //  this.UserRole_Model.CREATION_TS = new Date().toISOString();;
        //  this.UserRole_Model.CREATION_USER_GUID = 'sva_test';
        //  this.UserRole_Model.UPDATE_TS = new Date().toISOString();;
        //  this.UserRole_Model.UPDATE_USER_GUID = 'sva_test';    

        //  var queryHeaders = new Headers();
        //  queryHeaders.append('Content-Type', 'application/json');
        //  queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        //  let options = new RequestOptions({ headers: queryHeaders });
        //  return new Promise((resolve, reject) => {
        //    this.http.post(this.user_role_Url, this.UserRole_Model.toJson(true), options)
        //      .map((response) => {
        //        return response;
        //      }).subscribe((response) => {
        //        resolve(response.json());
        //      })
        //  })
      });
    }
    fileReader.readAsArrayBuffer(this.file_user_role);
  }

  //  For main_attendance
  chooseFile_main_attendance: boolean = false;
  arrayBuffer_main_attendance: any;
  file_main_attendance: File; 
  // main_attendance_Url: any;
  loading: Loading;

  Main_Attendance_Model: Main_Attendance_Model = new Main_Attendance_Model();
  Device_Raw_Data_Model: Device_Raw_Data_Model = new Device_Raw_Data_Model();
  main_attendance_data: any[]; attendance_data: any[];

  main_attendance(event: any) {
    this.chooseFile_main_attendance = true;
    this.file_main_attendance = event.target.files[0];
  }


  // main_attendance_click() {
  //   this.main_attendance_Url = constants.DREAMFACTORY_TABLE_URL + '/main_attendance?&api_key=' + constants.DREAMFACTORY_API_KEY;
  //   let fileReader = new FileReader();

  //   // this.loading = this.loadingCtrl.create({
  //   //   content: 'Please wait...',
  //   // });
  //   // this.loading.present();

  //   fileReader.onload = (e) => {
  //     this.arrayBuffer_main_attendance = fileReader.result;
  //     var data = new Uint8Array(this.arrayBuffer_main_attendance);
  //     var arr = new Array();
  //     for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //     var bstr = arr.join("");
  //     var workbook = XLSX.read(bstr, { type: "binary" });
  //     // zero for first sheet
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     this.main_attendance_data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

  //     this.main_attendance_data.forEach(element => {
  //       //Check duplicate & insert record to db---------------------------------
  //       this.duplicateCheck_main_attendance(element);
  //       //----------------------------------------------------------------------
  //     });
  //   }

  //   fileReader.readAsArrayBuffer(this.file_main_attendance);
  // }

  // duplicateCheck_main_attendance(checkData: any) {
  //   this.apiMng.getApiModel('main_attendance', 'filter=(user_id=' + checkData.UserID.trim() + ') AND (attendance_time=' + checkData.Att_Time + ')')
  //     .subscribe(data => {
  //       let checkDataFromDB = data["resource"];
  //       if (checkDataFromDB.length == 0) {
  //         this.Main_Attendance_Model.user_id = checkData.UserID;
  //         this.Main_Attendance_Model.employee_code = checkData.EmployeeCode;
  //         this.Main_Attendance_Model.employee_name = checkData.Name;
  //         this.Main_Attendance_Model.dept = checkData.Dept;
  //         this.Main_Attendance_Model.attendance_time = checkData.Att_Time;
  //         this.Main_Attendance_Model.att_id = checkData.Att_ID;
  //         this.Main_Attendance_Model.dev_id = checkData.Dev_ID;
  //         this.Main_Attendance_Model.photo_id = checkData.Photo_ID;

  //         this.Main_Attendance_Model.CREATION_TS = new Date().toISOString();;
  //         this.Main_Attendance_Model.CREATION_USER_GUID = 'sva_test';
  //         this.Main_Attendance_Model.UPDATE_TS = new Date().toISOString();;
  //         this.Main_Attendance_Model.UPDATE_USER_GUID = 'sva_test';

  //         var queryHeaders = new Headers();
  //         queryHeaders.append('Content-Type', 'application/json');
  //         queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //         let options = new RequestOptions({ headers: queryHeaders });
  //         return new Promise((resolve, reject) => {
  //           this.http.post(this.main_attendance_Url, this.Main_Attendance_Model.toJson(true), options)
  //             .map((response) => {
  //               return response;
  //             }).subscribe((response) => {
  //               resolve(response.json());

  //               this.fileInputAttendance.nativeElement.value = '';
  //               this.chooseFile_main_attendance = false;
  //             })
  //         })
  //       }
  //       else {
  //         this.fileInputAttendance.nativeElement.value = '';
  //         this.chooseFile_main_attendance = false;
  //         return;
  //       }
  //     })
  // }


  attendance_Url: string = "";
  attendance_click() {
    // this.Get_Device_GUID();

    let CurInTime: any; let PrevInTime: any; let OutTime: any;

    this.attendance_Url = constants.DREAMFACTORY_TABLE_URL + '/device_raw_data?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer_main_attendance = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_attendance);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.attendance_data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.attendance_data.forEach(element => {
        //Check duplicate & insert record to db---------------------------------
        this.duplicateCheck_device_raw_data(element);

        //Compare the time and check the exact intime and out time--------------
        // if (element.Dev_ID == "1") {
        //   CurInTime = element.Att_Time;
        //   if (PrevInTime != null) {
        //     if (CurInTime < PrevInTime) {

        //     }
        //   }
        //   PrevInTime = element.Att_Time;
        // }

        //----------------------------------------------------------------------
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_attendance);
  }

  duplicateCheck_device_raw_data(checkData: any) {
    this.apiMng.getApiModel('device_raw_data', 'filter=(REF_NO=' + checkData.UserID.trim() + ') AND (DATA_ENTRY_TS=' + checkData.Att_Time + ')')
      .subscribe(data => {
        let checkDataFromDB = data["resource"];
        if (checkDataFromDB.length == 0) {
          this.Device_Raw_Data_Model.RAW_DATA_GUID = UUID.UUID();
          if (checkData.Dev_ID == "1") {
            this.Device_Raw_Data_Model.DEVICE_GUID = localStorage.getItem("Input_Device_GUID");
          }
          else {
            this.Device_Raw_Data_Model.DEVICE_GUID = localStorage.getItem("Output_Device_GUID");;
          }
          this.Device_Raw_Data_Model.REF_NO = checkData.UserID;
          this.Device_Raw_Data_Model.DATA_ENTRY_TS = checkData.Att_Time;
          this.Device_Raw_Data_Model.CREATION_TS = new Date().toISOString();
          this.Device_Raw_Data_Model.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
          this.Device_Raw_Data_Model.UPDATE_TS = new Date().toISOString();
          this.Device_Raw_Data_Model.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

          var queryHeaders = new Headers();
          queryHeaders.append('Content-Type', 'application/json');
          queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
          let options = new RequestOptions({ headers: queryHeaders });
          return new Promise((resolve, reject) => {
            this.http.post(this.attendance_Url, this.Device_Raw_Data_Model.toJson(true), options)
              .map((response) => {
                return response;
              }).subscribe((response) => {
                resolve(response.json());

                this.fileInputAttendance.nativeElement.value = '';
                this.chooseFile_main_attendance = false;
              })
          })
        }
        else {
          this.fileInputAttendance.nativeElement.value = '';
          this.chooseFile_main_attendance = false;
          return;
        }
      })
  }




Templates_ngModel:any;    
download_file_name: string = "";      

downloadFile_service(): Observable<Blob> {
if(this.Templates_ngModel == "Bank"){
this.download_file_name = "Bank.xlsx";
}
if(this.Templates_ngModel == "Designation"){
  this.download_file_name = "Designation.xlsx";
  }
  if(this.Templates_ngModel == "Department"){
    this.download_file_name = "Department.xlsx";
    }
    if(this.Templates_ngModel == "Mileage"){
      this.download_file_name = "Mileage.xlsx";
      }
      if(this.Templates_ngModel == "Payment Type"){
        this.download_file_name = "Payment_type.xlsx";
        }
        if(this.Templates_ngModel == "Qualification"){
          this.download_file_name = "Qualification.xlsx";
          }
          if(this.Templates_ngModel == "Customer"){
            this.download_file_name = "User_Template.xlsx";
            }
            if(this.Templates_ngModel == "SOC"){
              this.download_file_name = "SOC_Registration.xlsx";
              }
              if(this.Templates_ngModel == "Country"){
                this.download_file_name = "User_Template.xlsx";
                }
                if(this.Templates_ngModel == "State"){
                  this.download_file_name = "State.xlsx";
                  }
                  if(this.Templates_ngModel == "Templates"){
                    this.download_file_name = "User_Template.xlsx";
                    }
const url ='http://api.zen.com.my/api/v2/files/Templates/' + this.download_file_name +'?api_key=' +constants.DREAMFACTORY_API_KEY;
let options = new RequestOptions({responseType: ResponseContentType.Blob });
console.log(url)
return this.http.get(url,options)
.map(res => res.blob())
// .catch(this.handleError)
// .then((response) => {
//   resolve(response)
//   }).catch(err => {
//   errorHandler.checkError(context, err)
//   reject(err)
//   })
//   })responseType: ResponseContentType.Blob ,
}

download() {
this.downloadFile_service().subscribe(blob => {
importedSaveAs(blob, this.download_file_name);
})
}


  devices: any;
  Get_Device_GUID() {
    let url = constants.DREAMFACTORY_TABLE_URL + "/main_device?filter=(TENANT_GUID=" + localStorage.getItem("g_TENANT_GUID") + ') AND (ACTIVATION_FLAG=0)' + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.devices = data["resource"];
        for (var item in data["resource"]) {
          if (data["resource"][item]["ROLE"] == 1) { localStorage.setItem("Input_Device_GUID", data["resource"][item]["DEVICE_GUID"]); }
          if (data["resource"][item]["ROLE"] == 2) { localStorage.setItem("Output_Device_GUID", data["resource"][item]["DEVICE_GUID"]); }
        }
      });
  }

  TempArray: any [] = []; AttendanceArray: any[]= [];
  Insert_User_Attendance() {
    this.TempArray = this.attendance_data.sort((n1,n2) => n1.UserID - n2.UserID || +new Date(n1.Att_Time) - +new Date(n2.Att_Time))
    console.table(this.TempArray);
    let CurUserId: string = ""; let PrevUserId: string = ""; let CurTime: string = ""; let PrevTime: string = ""; let CurDevID: string = ""; let PrevDevID: string = ""; let jsonStr = '';
    let CurDate: string; let PrevDate: string;

    for(var item in this.TempArray){
      CurUserId = ""; CurTime = ""; CurDevID = ""; CurDate = "";
      
      CurUserId = this.TempArray[item]["UserID"]; CurTime = this.TempArray[item]["Att_Time"]; CurDevID = this.TempArray[item]["Dev_ID"];
      CurDate = this.TempArray[item]["Att_Time"].substring(0,10);
      
      if(item == "0"){
        jsonStr += '{"UserID":"' + this.TempArray[item]["UserID"] + '", ';  
        if(CurDevID == "1"){
          if(this.TempArray[item]["Att_Time"] != ""){
            jsonStr += '"In_Time":"' + this.TempArray[item]["Att_Time"] + '", ';
            jsonStr += '"Out_Time":"' + "NA" + '"}';
          }
          else{
            jsonStr += '"In_Time":"' + "NA" + '", ';
            jsonStr += '"Out_Time":"' + this.TempArray[item]["Att_Time"] + '"}';
          }          
        }         
      }
      else{
        if(CurUserId == PrevUserId){
          if(CurDate == PrevDate){

          }
        }
        else{
          jsonStr += '{"UserID":"' + this.TempArray[item]["UserID"] + '", ';
        }
      }

      
      // this.AttendanceArray.push(JSON.parse(jsonStr))

      PrevUserId = ""; PrevTime = ""; PrevDevID = ""; PrevDate = "";
      PrevUserId = this.TempArray[item]["UserID"]; PrevTime = this.TempArray[item]["Att_Time"]; PrevDevID = this.TempArray[item]["Dev_ID"];
      PrevDate = this.TempArray[item]["Att_Time"].substring(0,10);
      // this.AttendanceArray.push({User_Id: this.TempArray[item]["UserID"], })
      
    }
  }

  //  For main_attendance
  chooseFile_main_leave: boolean = false;
  arrayBuffer_main_leave: any;
  file_main_leave: File;

  Leave_Raw_Data_Model: Leave_Raw_Data_Model = new Leave_Raw_Data_Model();  
  main_leave_data: any[]; 

  main_leave(event: any) {
    this.chooseFile_main_leave = true;
    this.file_main_leave = event.target.files[0];
  }
  
  Final_leave_data: any [] = []; leave_Url: string = ""; ctr: any = 0;
  LeaveUpload_click(){
    this.ctr = 0;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();

    this.leave_Url = constants.DREAMFACTORY_TABLE_URL + '/user_leave_raw_data?&api_key=' + constants.DREAMFACTORY_API_KEY;
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.arrayBuffer_main_leave = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer_main_leave);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      // var workbook = XLSX.read(bstr, { type: "binary" });
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      // zero for first sheet
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.main_leave_data = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.Final_leave_data = this.main_leave_data.filter((thing: any, index: any, self: any) =>
            index === self.findIndex((t: any) => (
              t.LEAVE_ID === thing.LEAVE_ID
            ))
          )          
      this.Final_leave_data.forEach(element => {        
        //Check duplicate & insert record to db---------------------------------
        this.duplicateCheck_leave_raw_data(element);                
        //----------------------------------------------------------------------
      });
    }
    fileReader.readAsArrayBuffer(this.file_main_leave);
  }

  duplicateCheck_leave_raw_data(checkData: any){
    this.ctr = this.ctr +1;
    this.apiMng.getApiModel('user_leave_raw_data', 'filter=LEAVE_ID=' + checkData.LEAVE_ID)
    .subscribe(data => {
      let checkDataFromDB = data["resource"];
      if (checkDataFromDB.length == 0) {
        this.Leave_Raw_Data_Model.STAFF_ID = checkData.STAFF_ID;
        this.Leave_Raw_Data_Model.TITLE = checkData.TITLE;
        this.Leave_Raw_Data_Model.START_DATE = moment(checkData.START_DATE).format('YYYY-MM-DD HH:mm') ;
        this.Leave_Raw_Data_Model.END_DATE = moment(checkData.END_DATE).format('YYYY-MM-DD HH:mm');
        this.Leave_Raw_Data_Model.LEAVE_ID = checkData.LEAVE_ID;
        this.Leave_Raw_Data_Model.HALF_DAY_DATE = checkData.HALF_DAY_DATE;

        this.Leave_Raw_Data_Model.CREATION_TS = new Date().toISOString();
        this.Leave_Raw_Data_Model.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        this.Leave_Raw_Data_Model.UPDATE_TS = new Date().toISOString();
        this.Leave_Raw_Data_Model.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");

        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
        let options = new RequestOptions({ headers: queryHeaders });
        return new Promise((resolve, reject) => {
          this.http.post(this.leave_Url, this.Leave_Raw_Data_Model.toJson(true), options)
            .map((response) => {
              return response;
            }).subscribe((response) => {
              resolve(response.json());

              this.fileInputLeave.nativeElement.value = '';
              this.chooseFile_main_leave = false;
            })
        })
      }
      else {
        this.fileInputLeave.nativeElement.value = '';
        this.chooseFile_main_attendance = false;
        return;
      }
    })
    if(this.Final_leave_data.length == this.ctr){
      this.fileInputLeave.nativeElement.value = '';
      this.chooseFile_main_attendance = false; 
      this.loading.dismissAll();
      return;
    }
  }


}
