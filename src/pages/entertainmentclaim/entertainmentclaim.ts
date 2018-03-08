import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { EntertainmentClaim_Model } from '../../models/entertainmentclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { EntertainmentClaim_Service } from '../../services/entertainmentclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { View_SOC_Model } from '../../models/view_soc_model';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Services } from '../Services';
import { ClaimRefMain_Model } from '../../models/ClaimRefMain_Model';
import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';

/**
 * Generated class for the EntertainmentclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-entertainmentclaim',
  templateUrl: 'entertainmentclaim.html', providers: [EntertainmentClaim_Service, BaseHttpService, FileTransfer]
})
export class EntertainmentclaimPage {
 
  Entertainmentform: FormGroup;
  
 // vehicles;
  storeProjects: any; 
  projects: any; 
  customers: any; 
  storeCustomers: any;

  public assignedTo: any;
  public profileLevel: any; 
  public stage: any;
  public profileJSON: any;

  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;  
  public Travel_Mode_ngModel: any;
  Travel_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any; 
  Soc_GUID: any;

  public socGUID: any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  //DestinationPlaceID: string;
  //OriginPlaceID: string;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  travelAmount: any;
  validDate = new Date().toISOString();
  isCustomer: boolean = false;
  claimFor: any;
  ClaimRequestMain: any;

  constructor(platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, private api: Services, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private entertainmentservice: EntertainmentClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
  
    this.Entertainmentform = fb.group({
      soc_no: '', 
      travel_date: ['', Validators.required],
      description: ['', Validators.required],
      vehicleType: ['', Validators.required]     
    });
    this.LoadProjects();    
    this.LoadCustomers();
  }

  GetSocNo(item: any){
    this.Travel_SOC_No_ngModel = item.soc;
    this.Project_Lookup_ngModel = item.project_name;
    this.Soc_GUID = item.SOC_GUID;
    this.CloseProjectLookup();
  }

  GetCustomer(guid: any, name: any) {
    this.Customer_Lookup_ngModel = name;
    this.Customer_GUID = guid;
    this.CloseCustomerLookup();
  }  

   claimForChanged() {
    // console.log(this.claimFor)
    if (this.claimFor == 'customer') this.isCustomer = true;
    else this.isCustomer = false;
  }

  LoadProjects() {
    this.http
      .get(Services.getUrl('soc_registration'))
      .map(res => res.json())
      .subscribe(data => {
      this.storeProjects=  this.projects = data["resource"];
        console.table(this.projects)
      }
      );
  }

  LoadCustomers() {
    this.http
      .get(Services.getUrl('main_customer'))
      .map(res => res.json())
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        // console.table(this.projects)
      }
      );
  }

  public CloseTravelClick() {
    this.AddToLookupClicked = false;
    this.AddTravelClicked = false;
  }

  public CloseProjectLookup() {
    if (this.ProjectLookupClicked == true) {
      this.ProjectLookupClicked = false;
    }
  }

  public CloseCustomerLookup() {
    if (this.CustomerLookupClicked == true) {
      this.CustomerLookupClicked = false;
    }
  }

  public AddLookupClick() {
    this.AddLookupClicked = true;
    this.currentItems = null;
  }

  public AddToLookupClick() {
    this.AddLookupClicked = true;
    this.AddToLookupClicked = true;
    this.currentItems = null;
  }

  public ProjectLookup() {
    this.ProjectLookupClicked = true;
   
    // this.projects = null;
  }

  public CustomerLookup() {
    this.CustomerLookupClicked = true;
    // this.projects = null;
  }

  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
    // this.projects = this.filterProjects({
    //   project_name: val
    // });
  }

  // filterProjects(params?: any) {
  //   if (!params) {
  //     return this.storeProjects;
  //   }

  //   return this.projects.filter((item) => {
  //     for (let key in params) {
  //       let field = item[key];
  //       if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
  //         return item;
  //       } else if (field == params[key]) {
  //         return item;
  //       }
  //     }
  //     return null;
  //   });
  // }

  searchCustomer(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.customers = this.storeCustomers;
      return;
    }
    // this.customers = this.filterCustomer({
    //   NAME: val
    // });
  }

  takePhoto() {
    // Camera.getPicture().then((imageData) => {
    //     this.imageURL = imageData
    // }, (err) => {
    //     console.log(err);
    // });
  }

  save(value: any) {
    let userGUID = localStorage.getItem('g_USER_GUID');
    let tenantGUID = localStorage.getItem('g_TENANT_GUID');
    let month = new Date(value.travel_date).getMonth() + 1;
    let year = new Date(value.travel_date).getFullYear();
    let claimRefGUID;
    let url = Services.getUrl('main_claim_ref', 'filter=(USER_GUID=' + userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')');
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(claimRefdata => {
        if (claimRefdata["resource"][0] == null) {
          let claimReqRef: ClaimRefMain_Model = new ClaimRefMain_Model();
          claimReqRef.CLAIM_REF_GUID = UUID.UUID();
          claimReqRef.USER_GUID = userGUID;
          claimReqRef.TENANT_GUID = tenantGUID;
          claimReqRef.REF_NO = userGUID + '/' + month + '/' + year;
          claimReqRef.MONTH = month;
          claimReqRef.YEAR = year;
          claimReqRef.CREATION_TS = new Date().toISOString();
          claimReqRef.UPDATE_TS = new Date().toISOString();

          this.api.postData('main_claim_ref', claimReqRef.toJson(true)).subscribe((response) => {
            var postClaimRef = response.json();
            claimRefGUID = postClaimRef["resource"][0].CLAIM_REF_GUID;

            let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
            claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
            claimReqMainRef.TENANT_GUID = tenantGUID;
            claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
            //claimReqMainRef.MILEAGE_GUID = this.VehicleId;
            claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
            claimReqMainRef.TRAVEL_DATE = value.travel_date;           
            claimReqMainRef.DESCRIPTION = value.description;
            // claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CREATION_TS = new Date().toISOString();
            claimReqMainRef.UPDATE_TS = new Date().toISOString();           
           // claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
           if(this.isCustomer){
            claimReqMainRef.CUSTOMER_GUID = this.Customer_GUID ;
          }
          else{
            claimReqMainRef.SOC_GUID = this.Soc_GUID;
          }
          // claimReqMainRef.CUSTOMER_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
          // claimReqMainRef.SOC_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;

            this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
              var postClaimMain = response.json();
              this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;
              this.MainClaimSaved = true;
              alert('Claim Has Registered.')
            })
          })
        }
        else {
          claimRefGUID = claimRefdata["resource"][0].CLAIM_REF_GUID;

          let claimReqMainRef: ClaimReqMain_Model = new ClaimReqMain_Model();
          claimReqMainRef.CLAIM_REQUEST_GUID = UUID.UUID();
          claimReqMainRef.TENANT_GUID = tenantGUID;
          claimReqMainRef.CLAIM_REF_GUID = claimRefGUID;
         // claimReqMainRef.MILEAGE_GUID = this.VehicleId;
          claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
          claimReqMainRef.TRAVEL_DATE = value.travel_date;          
          claimReqMainRef.DESCRIPTION = value.description;
          // claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CREATION_TS = new Date().toISOString();
          claimReqMainRef.UPDATE_TS = new Date().toISOString();         
          //claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
          if(this.isCustomer){
            claimReqMainRef.CUSTOMER_GUID = this.Customer_GUID ;
          }
          else{
            claimReqMainRef.SOC_GUID = this.Soc_GUID;
          }
        this.api.postData('main_claim_request', claimReqMainRef.toJson(true)).subscribe((response) => {
            var postClaimMain = response.json();
            this.ClaimRequestMain = postClaimMain["resource"][0].CLAIM_REQUEST_GUID;  

            this.MainClaimSaved = true;
            alert('Claim Has Registered.')
          })
        }

      })
  }
}
