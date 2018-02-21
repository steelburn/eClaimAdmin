import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../config/constants'
//import * as constants from '../../app/config/constants';        
//import * as constants_home from '../../app/config/constants_home';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ClaimRefMain_Model } from '../../models/ClaimRefMain_Model';
import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';
//import { TravelClaim_Model } from '../../models/travelclaim_model';
//import { TravelClaim_Service } from '../../services/travelclaim_service';
import { Services } from '../Services';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import {Router, Request, Response, NextFunction} from 'express';
import {AddTollPage} from '../../pages/add-toll/add-toll';

/**
 * Generated class for the TravelclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travelclaim.html', providers: [Services, BaseHttpService, FileTransfer]
})
export class TravelclaimPage {
  isReadyToSave: boolean;
 
  vehicles: any;
  customers: any;
  storeProjects: any;
  storeCustomers: any;  
  public projects: any;
  Travelform: FormGroup;

  items: string[];  

  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  public Travel_From_ngModel: any;
  public Travel_Destination_ngModel: any;
  public Travel_Distance_ngModel: any;
  public Travel_Mode_ngModel: any;
  Travel_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any;
  Soc_GUID: any;

  public socGUID : any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  DestinationPlaceID: string;
  OriginPlaceID: string;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  Start_DT_ngModel: any;
  claimFor: any;
  End_DT_ngModel: any;
  VehicleId: any;
  VehicleRate: any;
  travelAmount: any;
  validDate = new Date().toISOString();
  ClaimRequestMain: any;
  isCustomer: boolean = false;
 
  constructor(platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private api: Services, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
  {   
    this.Travelform = fb.group({
      soc_no: '',
      distance: '', 
      //customer: '',
     // project_name: ['', Validators.required],
      travel_date:  ['', Validators.required],
      destination: ['', Validators.required],
      from: ['', Validators.required],
      start_DT: ['', Validators.required],
      end_DT: ['', Validators.required], 
      description: ['', Validators.required],
      origin: ['', Validators.required],
      vehicleType: ['', Validators.required],
    });   
    this.LoadProjects();
    this.LoadVehicles();
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

  LoadVehicles() {
    this.http
      .get(Services.getUrl('main_mileage'))
      .map(res => res.json())
      .subscribe(data => {
        this.vehicles = data["resource"];
      }
      );
  }

  GetDistance() {
    var origin = this.Travel_From_ngModel;
    var destination;
    var url = 'http://api.zen.com.my/api/v2/google/distancematrix/json?destinations=place_id:' + this.DestinationPlaceID + '&origins=place_id:' + this.OriginPlaceID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      let temp = data["rows"][0]["elements"][0];
      // console.table(data)
      if (temp["distance"] != null) {
        let DistKm: string = data["rows"][0]["elements"][0]["distance"]["text"];
        // console.log(DistKm)
        DistKm = DistKm.replace(',', '')
        this.Travel_Distance_ngModel = DistKm.substring(0, DistKm.length - 2)
      }
      else
        alert('Please select Valid Origin & Destination Places');

    });
  }

  public CloseTravelClick() {
    this.AddToLookupClicked = false;
    this.AddTravelClicked = false;
  }

  public CloseLookupClick() {
    if (this.AddLookupClicked == true) {
      this.AddLookupClicked = false;
    }
    if (this.AddToLookupClicked == true) {
      this.AddToLookupClicked = false;
    }
    let origin = this.Travel_From_ngModel;
    let destination = this.Travel_Distance_ngModel;
    if (origin != '' && destination != '') {
      this.GetDistance();
      // this.Travel_Mode_ngModel = this.vehicleCategory ;
    }
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

  openItem(item: any) {
    if (this.AddToLookupClicked) {
      this.Travel_Destination_ngModel = item.description;
      this.DestinationPlaceID = item.place_id
    }
    else {
      this.Travel_From_ngModel = item.description;
      this.OriginPlaceID = item.place_id;
    }
    this.CloseLookupClick();
  }

  searchLocation(searchLocationString: any) {
    let val = searchLocationString.target.value;
    val = val.replace(/ /g, '');
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=50000&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.currentItems = data["predictions"];
      console.table(this.currentItems);
    });
  }


    
  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
  //  this.projects=  this.filterProjects({
  //   project_name: val
  //   });
  }


  // filterProjects(params?: any) {
  //   if (!params) {

  //     //return this.storeProjects;
  //   }

  //     return this.projects.filter((item) =>{

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

  // filterCustomer(params?: any) {
  //   if (!params) {
  //     return this.storeCustomers;
  //   }

  //   return this.customers.filter((item) => {
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

  takePhoto() {
    // Camera.getPicture().then((imageData) => {
    //     this.imageURL = imageData
    // }, (err) => {
    //     console.log(err);
    // });
  }

  vehicleCategory : any;
  SetPrice(vehicle: any) {
    this.VehicleId = vehicle.MILEAGE_GUID;
    this.VehicleRate = vehicle.RATE_PER_UNIT;
    this.vehicleCategory = vehicle.CATEGORY;
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
            claimReqMainRef.MILEAGE_GUID = this.VehicleId;
            claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
            claimReqMainRef.TRAVEL_DATE = value.travel_date;
            claimReqMainRef.START_TS = value.start_DT;
            claimReqMainRef.END_TS = value.end_DT;
            claimReqMainRef.DESCRIPTION = value.description;
            claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CREATION_TS = new Date().toISOString();
            claimReqMainRef.UPDATE_TS = new Date().toISOString();
            claimReqMainRef.FROM = this.Travel_From_ngModel;
            claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
            claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
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
              console.table( claimReqMainRef);
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
          claimReqMainRef.MILEAGE_GUID = this.VehicleId;
          claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
          claimReqMainRef.TRAVEL_DATE = value.travel_date;
          claimReqMainRef.START_TS = value.start_DT;
          claimReqMainRef.END_TS = value.end_DT;
          claimReqMainRef.DESCRIPTION = value.description;
          claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CREATION_TS = new Date().toISOString();
          claimReqMainRef.UPDATE_TS = new Date().toISOString();
          claimReqMainRef.FROM = this.Travel_From_ngModel;
          claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
          claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
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

  showAddToll() {
    //let AddTollModal = this.modalCtrl.create(AddTollPage);
    //AddTollModal.present;
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '03048acb-037a-11e8-a50c-00155de7e742'
    });
  }

  showAddParking() {
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-00155de7e742'
    });
  }
}
