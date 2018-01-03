import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
import { View_SOC_Model } from '../../models/view_soc_model';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

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
  view_entry: View_SOC_Model = new View_SOC_Model();
  Socform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_project' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_registration' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  public socs: SocMain_Model[] = []; 
  // public socs: SocProject_Model[] = []; 
  // public socs: SocMain_Model[] = []; 

  public soc_main: SocMain_Model[] = [];
  public soc_project: SocProject_Model[] = [];
  public soc_customer: SocCustomer_Model[] = [];
  
 // public socs: any;

  public soc_details_main: any; 
  public soc_details_project: any; 
  public soc_details_customer: any; 

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

  public AddSocClicked: boolean = false;
  public AddSocClick() {
    //this.ClearControls();
    this.AddSocClicked = true;
  }

  public CloseSocClick() {

    this.AddSocClicked = false;
  }

  // public EditClick(SOC_GUID: any) {
  //   alert('edit click');
  //   // PROJECT_GUID: any, CUSTOMER_GUID: any
  //  // this.ClearControls();
  //   this.AddSocClicked = true;
  //   var self = this;
  //   alert('edit click2');
  //   this.socservice
  //     .get1(SOC_GUID)
  //     .subscribe((data) => {
  //     self.soc_details_main = data;
  //     alert('edit click3');
  //     this.SOC_NO_ngModel_Edit = self.soc_details_main.soc; 
  //     alert(self.soc_details_main);
  //     alert(SOC_GUID);
  //     //localStorage.setItem('Prev_dep_Name', self.department_details.NAME); 
  //     //this.PROJECT_NAME_ngModel_Edit = self.soc_details.PROJECT_NAME;
  //     //this.CUSTOMER_NAME_ngModel_Edit = self.soc_details.CUSTOMER_NAME;
   
  // });
public emg(){
  alert('edit function');
}
  public EditClick(id: any) {
    this.SOC_GUID_UPDATE = id;
    //this.EditUserClicked = true;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    //let url: string;
    let url = this.baseResourceUrl3 + "soc_registration?filter=(SOC_GUID=" + id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
   
    this.http.get(url, options)
      .map(res => res.json())
      .subscribe(
      data => {
        let res = data["resource"];
        this.soc_details_main = data["resource"];
        //this.USER_GUID_FOR_CONTACT =this.view_user_details[0]["CONTACT_INFO_GUID"];
        this.SOC_NO_ngModel_Edit = this.soc_details_main[0]["soc"];
       
      });
      // this.http.get(url2, options)
      // .map(res => res.json())
      // .subscribe(
      // data => {
      //   let res = data["resource"];
      //   this.view_user_details = data["resource"];
      //   this.USER_INFO_GUID_FOR_UPDATE =this.view_user_details[0]["USER_INFO_GUID"];
      //   this.User_Designation_Edit_ngModel = this.view_user_details[0]["DESIGNATION_GUID"];
      //   this.User_Company_Edit_ngModel = this.view_user_details[0]["TENANT_COMPANY_GUID"];
      //   this.User_Department_Edit_ngModel = this.view_user_details[0]["DEPT_GUID"];
      //   this.User_JoinDate_Edit_ngModel = this.view_user_details[0]["JOIN_DATE"];
      //   this.User_ConfirmationDate_Edit_ngModel = this.view_user_details[0]["CONFIRMATION_DATE"];
      //   this.User_ResignationDate_Edit_ngModel = this.view_user_details[0]["RESIGNATION_DATE"];
      //   this.User_Branch_Edit_ngModel = this.view_user_details[0]["BRANCH"];
      //   this.User_EmployeeType_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_TYPE"];
      //   this.User_Approver1_Edit_ngModel = this.view_user_details[0]["APPROVER1"];
      //   this.User_Approver2_Edit_ngModel = this.view_user_details[0]["APPROVER2"];
      //   this.User_Employment_Edit_ngModel = this.view_user_details[0]["EMPLOYEE_STATUS"];
      // });
      // this.http.get(url3, options)
      // .map(res => res.json())
      // .subscribe(
      // data => {
      //   let res = data["resource"];
      //   this.view_user_details = data["resource"];
      //   this.USER_GUID_FOR_ADDRESS =  this.view_user_details[0]["USER_ADDRESS_GUID"];
      //   this.User_Address1_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS1"];
      //   this.User_Address2_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS2"];
      //   this.User_Address3_Edit_ngModel = this.view_user_details[0]["USER_ADDRESS3"];
      // });

//   this.socservice
//   .get2(PROJECT_GUID)
//   .subscribe((data) => {
//   self.soc_details_project = data;
//   this.SOC_NO_ngModel_Edit = self.soc_details_project.SOC_NO; 
//   //localStorage.setItem('Prev_dep_Name', self.department_details.NAME); 
//   this.PROJECT_NAME_ngModel_Edit = self.soc_details_project.PROJECT_NAME;
//   //this.CUSTOMER_NAME_ngModel_Edit = self.soc_details.CUSTOMER_NAME;

// });
// this.socservice
// .get3(CUSTOMER_GUID)
// .subscribe((data) => {
// self.soc_details_customer = data;
// this.SOC_NO_ngModel_Edit = self.soc_details_customer.SOC_NO; 
// //localStorage.setItem('Prev_dep_Name', self.department_details.NAME); 
// //this.PROJECT_NAME_ngModel_Edit = self.soc_details.PROJECT_NAME;
// this.CUSTOMER_NAME_ngModel_Edit = self.soc_details_customer.CUSTOMER_NAME;

// });
}

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private socservice: SocMain_Service, private alertCtrl: AlertController) {
      this.http
      .get(this.baseResourceUrl3)
      .map(res => res.json())
      .subscribe(data => {
        this.socs = data.resource;
     console.table(this.socs)
    });
    this.Socform = fb.group({

      soc: ["", Validators.required],
      project_name: ["", Validators.required],
      customer_name: ["", Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocRegistrationPage');
  }

  Save() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let url: string;
    url = this.baseResource_Url + "soc_main?filter=(SOC_NO=" + this.SOC_NO_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url, options)
      .map(res => res.json())
      .subscribe(
      data => {
        let res = data["resource"];
        if (res.length == 0) {
          console.log("No records Found");
          if (this.Exist_Record == false) {

            this.customer_entry.NAME = this.CUSTOMER_NAME_ngModel_Add.trim();
            
            this.customer_entry.CUSTOMER_GUID = UUID.UUID();
            this.customer_entry.CREATION_TS = new Date().toISOString();
            this.customer_entry.CREATION_USER_GUID = "1";
            this.customer_entry.UPDATE_TS = new Date().toISOString();
            this.customer_entry.UPDATE_USER_GUID = "";

            alert(this.project_entry.CREATION_USER_GUID);




            this.socservice.save_customer(this.customer_entry)
              .subscribe((response) => {
                if (response.status == 200) {
                  alert('Customer Registered successfully');
                  //location.reload();
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);

                  this.project_entry.NAME = this.PROJECT_NAME_ngModel_Add.trim();
                  this.project_entry.PROJECT_GUID = UUID.UUID();
                  this.project_entry.CUSTOMER_GUID =  this.customer_entry.CUSTOMER_GUID;
                  this.project_entry.CUSTOMER_LOCATION_GUID = "1";
                  this.project_entry.TENANT_GUID = "1";
                  this.project_entry.ACTIVATION_FLAG = "1";
                  this.project_entry.CREATION_TS = new Date().toISOString();
                  this.project_entry.CREATION_USER_GUID = "1";
                  this.project_entry.UPDATE_TS = new Date().toISOString();
                  this.socservice.save_project(this.project_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('Project Registered successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);

                        this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add.trim();
                        this.soc_entry.PROJECT_GUID = this.project_entry.PROJECT_GUID               
                        this.soc_entry.SOC_GUID = UUID.UUID();
                        this.soc_entry.CREATION_TS = new Date().toISOString();
                        this.soc_entry.CREATION_USER_GUID = "1";
                        this.soc_entry.UPDATE_TS = new Date().toISOString();
                        this.socservice.save_main(this.soc_entry)
                          .subscribe((response) => {
                            if (response.status == 200) {
                              alert('SOC Main Registered successfully');
                              //location.reload();
                              this.navCtrl.setRoot(this.navCtrl.getActive().component);
                            }
                          });
                      }
                    });

                }
              });
          }
        }
        else {
          console.log("Records Found");
          alert("The Subscription is already Exist.")

        }
      },
      err => {
        this.Exist_Record = false;
        console.log("ERROR!: ", err);
      });
  }



  SOC_GUID_UPDATE : any;
  Update(SOC_GUID: any) {
        if (this.Socform) {
          let url: string;
         
                if (this.Exist_Record == false) {
                  
                  this.view_entry.soc = this.SOC_NO_ngModel_Edit;
                  this.view_entry.SOC_GUID = this.SOC_GUID_UPDATE;
              

                  this.socservice.edit_soc(this.view_entry)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        alert('soc_main updated successfully');
                        //location.reload();
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      }
                    });



//   USER_GUID_FOR_UPDATE : any;
//   Update(USER_GUID: any) {
//         if (this.Socform) { 
//           // let headers = new Headers();
//           // headers.append('Content-Type', 'application/json');
//           // let options = new RequestOptions({ headers: headers });

//           let url: string;
//           //let request_id = UUID.UUID();
//           //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
//           //url = this.baseResourceUrl2 + "user_main?filter=(USER_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

//           // url = this.baseResourceUrl2_URL + "user_main?filter=(EMAIL=" + this.User_Email_Edit_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;          
//           // this.http.get(url)
//           //   .map(res => res.json())
//           //   .subscribe(
//           //   data => {
//           //     let res = data["resource"];
              
//           //     if (res.length == 0) {
//                 if (this.Exist_Record == false) {
                  
//                   this.soc_entry.SOC_NO = this.SOC_NO_ngModel_Add;
//                   this.soc_entry.SOC_GUID = SOC_GUID;
//                   this.soc_entry.PROJECT_GUID = this.PROJECT_NAME_ngModel_Edit;
                  
//                   this.soc_entry.CREATION_TS = new Date().toISOString();
//                   this.soc_entry.CREATION_USER_GUID = "1";
//                   this.soc_entry.UPDATE_TS = new Date().toISOString();

//                   this.socservice.update_soc(this.soc_entry)
//                     .subscribe((response) => {
//                       if (response.status == 200) {
//                         alert('user_main updated successfully');
//                         //location.reload();
//                         this.navCtrl.setRoot(this.navCtrl.getActive().component);
//                       }
//                     });

//                   this.project_entry.NAME = this.PROJECT_NAME_ngModel_Edit.trim();
//                   this.project_entry.PROJECT_GUID = PROJECT_GUID;
//                   this.project_entry.CUSTOMER_GUID =  this.customer_entry.CUSTOMER_GUID;
//                   this.project_entry.CUSTOMER_LOCATION_GUID = "1";
//                   this.project_entry.TENANT_GUID = "1";
//                   this.project_entry.ACTIVATION_FLAG = "1";
//                   this.project_entry.CREATION_TS = new Date().toISOString();
//                   this.project_entry.CREATION_USER_GUID = "1";
//                   this.project_entry.UPDATE_TS = new Date().toISOString();
                   
//                     this.socservice.update_project(this.project_entry)
//                     .subscribe((response) => {
//                       if (response.status == 200) {
//                         alert('user_project Updated successfully');                       
//                         this.navCtrl.setRoot(this.navCtrl.getActive().component);
//                       }
//                     });

//                     this.customer_entry.NAME = this.CUSTOMER_NAME_ngModel_Edit.trim();
            
//                     this.customer_entry.CUSTOMER_GUID = CUSTOMER_GUID;
//                     this.customer_entry.CREATION_TS = new Date().toISOString();
//                     this.customer_entry.CREATION_USER_GUID = "1";
//                     this.customer_entry.UPDATE_TS = new Date().toISOString();
//                     this.customer_entry.UPDATE_USER_GUID = "";
              
//                     this.socservice.update_customer(this.customer_entry)
//                       .subscribe((response) => {
//                         if (response.status == 200) {
//                           alert('Customer Registered successfully');
//                           //location.reload();
//                           this.navCtrl.setRoot(this.navCtrl.getActive().component);
//                       }
//                     });
// }
//         }
//       }
    }
  }
}
}












