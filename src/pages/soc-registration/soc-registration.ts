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
  Socform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_main' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_project' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl2: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_customer' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl3: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/soc_registration' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  // public socs: SocMain_Model[] = []; 
  // public socs: SocProject_Model[] = []; 
  // public socs: SocMain_Model[] = []; 

  public soc_main: SocMain_Model[] = [];
  public soc_project: SocProject_Model[] = [];
  public soc_customer: SocCustomer_Model[] = [];
  public socs: any;

  public EditSocClicked: boolean = false;
  public Exist_Record: boolean = false;

  // public subscription_details: any; 
  public exist_record_details: any;

  public SOC_NO_ngModel_Add: any;
  public PROJECT_NAME_ngModel_Add: any;
  public CUSTOMER_NAME_ngModel_Add: any;

  public AddSocClicked: boolean = false;
  public AddSocClick() {
    //this.ClearControls();
    this.AddSocClicked = true;
  }

  public CloseSocClick() {

    this.AddSocClicked = false;
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

}










