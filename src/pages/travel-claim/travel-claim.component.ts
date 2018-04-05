import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { ImageUpload_model } from '../../models/ImageUpload_model';
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
import {AddTollPage} from '../../pages/add-toll/add-toll.component';

import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http'; 


/**
 * Generated class for the TravelclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travel-claim.html', providers: [Services, BaseHttpService, FileTransfer]
})
export class TravelclaimPage {         
  isReadyToSave: boolean; 
 
  vehicles: any[];
  customers: any[];
  //storeProjects: any;
  //storeCustomers: any; 
  storeCustomers: any[]; 
  storeProjects: any[]; 
  public projects: any[];
  Travelform: FormGroup;

  userGUID: any;

  items: string[];  
  public assignedTo: any;
  public profileLevel: any; 
  public stage: any;
  public profileJSON: any;

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
  public Travel_Date_ngModel: any;
  Travel_Description_ngModel: any;

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

   /********FORM EDIT VARIABLES***********/
   isFormEdit: boolean = false;
   claimRequestGUID: any;
   claimRequestData: any[];
   ngOnInit(): void {
     this.userGUID = localStorage.getItem('g_USER_GUID'); 
     this.isFormEdit = this.navParams.get('isFormEdit');
      this.claimRequestGUID = this.navParams.get('cr_GUID'); //dynamic
     //this.claimRequestGUID = 'aa124ed8-5c2d-4c39-d3bd-066857c45617';
     if (this.isFormEdit)
       this.GetDataforEdit();
   }

   GetDataforEdit() {
    this.http
      .get(Services.getUrl('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.claimRequestData = data["resource"];
        console.log(this.claimRequestData)
        if (this.claimRequestData[0].SOC_GUID === null) {
          this.claimFor = 'customer'
          this.storeCustomers.forEach(element => {
            if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
              this.Customer_Lookup_ngModel = element.NAME
            }
          });
        }
        else {
          this.claimFor = 'project'
          this.storeProjects.forEach(element => {
            if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
              this.Project_Lookup_ngModel = element.project_name
              this.Travel_SOC_No_ngModel = element.soc
            }
          });
        }
        this.Travel_Date_ngModel = this.claimRequestData[0].TRAVEL_DATE;
        this.Travel_From_ngModel = this.claimRequestData[0].FROM;
        this.Travel_Destination_ngModel = this.claimRequestData[0].DESTINATION;
        this.Travel_Distance_ngModel = this.claimRequestData[0].DISTANCE_KM;
        //this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT
        this.Travel_Amount_ngModel = this.claimRequestData[0].CLAIM_AMOUNT;
        this.Travel_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
       
        this.vehicles.forEach(element => {
          if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
            this.Travel_Mode_ngModel = element.CATEGORY
          }
        });
        console.table(this.claimRequestData)
        console.log(this.claimRequestData[0].SOC_GUID)
        console.log(this.claimRequestData[0].MILEAGE_GUID)
        console.log(this.claimRequestData[0].DESCRIPTION)
      }
      );
  } 
 
  constructor(platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private api: Services, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) 
  {   
    this.Travelform = fb.group({
      avatar: null,
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
    this.readProfile();
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
  
  //---------------------Language module start---------------------//
  public translateToMalayClicked: boolean = false;
  public translateToEnglishClicked: boolean = true;

  public translateToEnglish() {
    this.translate.use('en');
    this.translateToMalayClicked = !this.translateToMalayClicked;
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
  }

  public translateToMalay() {
    this.translate.use('ms');
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
    this.translateToMalayClicked = !this.translateToMalayClicked;
  }
  //---------------------Language module end---------------------//
 
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
         console.table(this.projects)
      }
      );
  } 

  TenantGUID = localStorage.getItem('g_TENANT_GUID');
//console.log(TenantGUID);
  LoadVehicles() {
    console.log(this.TenantGUID);
    this.http
      .get(Services.getUrl('main_mileage', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.vehicles = data["resource"];        
        console.table(this.vehicles);
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

//   onSearchInput(ev: any) {  
//     let val = ev.target.value;
//     if (val && val.trim() != '') {
//      this.projects = this.projects.filter((item) => {
   
//        console.log(item);
//        return ((item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) > -1) 
//        || ((item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) > -1) 
//        || (item.YEAR.toString().toLowerCase().indexOf(val.toLowerCase()) > -1))
//        || (item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
//      ) 
//      );
//      })
//    }
//    else
//    {
//     //  this.BindData();
//     return null;
//    }
// }

// Search project start:
    
  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
   this.projects=  this.filterProjects({
    project_name: val
    });
  }


  filterProjects(params?: any) {
    if (!params) {
      return this.storeProjects;
    }

    return this.projects.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }
  
  searchCustomer(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.customers = this.storeCustomers;
      return;
    }
    this.customers = this.filterCustomer({
      NAME: val
    });
  }

  filterCustomer(params?: any) {
    if (!params) {
      return this.storeCustomers;
    }

    return this.customers.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

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
    console.log(vehicle.MILEAGE_GUID);
    console.log(vehicle.RATE_PER_UNIT);
    console.log(vehicle.CATEGORY);
    console.log(this.VehicleId);
  }

  

  // fileChange(){
  //   alert('file change');
  //   let fileList: FileList = event.target.files;
  //   if(fileList.length > 0) {
  //       let file: File = fileList[0];
  //       let formData:FormData = new FormData();
  //       formData.append('uploadFile', file, file.name);
  //       let headers = new Headers();
  //       /** No need to include Content-Type in Angular 4 */
  //       headers.append('Content-Type', 'multipart/form-data');
  //       headers.append('Accept', 'application/json');
  //       let options = new RequestOptions({ headers: headers });
  //       this.http.post(`${this.apiEndPoint}`, formData, options)
  //           .map(res => res.json())
  //           .catch(error => Observable.throw(error))
  //           .subscribe(
  //               data => console.log('success'),
  //               error => console.log(error)
  //           )
  //   }
  // }


  save(value: any) {    
    let tenantGUID = localStorage.getItem('g_TENANT_GUID');
    let month = new Date(value.travel_date).getMonth() + 1;
    let year = new Date(value.travel_date).getFullYear();
    let claimRefGUID;
    let url = Services.getUrl('main_claim_ref', 'filter=(USER_GUID=' + this.userGUID + ')AND(MONTH=' + month + ')AND(YEAR=' + year + ')');
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(claimRefdata => {
        if (claimRefdata["resource"][0] == null) {
          let claimReqRef: ClaimRefMain_Model = new ClaimRefMain_Model();
          claimReqRef.CLAIM_REF_GUID = UUID.UUID();
          claimReqRef.USER_GUID = this.userGUID;
          claimReqRef.TENANT_GUID = tenantGUID;
          claimReqRef.REF_NO = this.userGUID + '/' + month + '/' + year;
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
            claimReqMainRef.ASSIGNED_TO = this.assignedTo;                    
            claimReqMainRef.PROFILE_LEVEL = this.profileLevel;           
            claimReqMainRef.PROFILE_JSON = this.profileJSON;
            claimReqMainRef.STATUS = 'Pending';
            claimReqMainRef.STAGE = this.stage;
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
          claimReqMainRef.ASSIGNED_TO = this.assignedTo;        
          claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
          claimReqMainRef.PROFILE_LEVEL = this.profileLevel;
          claimReqMainRef.PROFILE_JSON = this.profileJSON;
          claimReqMainRef.STATUS = 'Pending';
          //claimReqMainRef.STATUS = 'Pending';
          claimReqMainRef.STAGE = this.stage;
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

  emailUrl: string = 'http://api.zen.com.my/api/v2/emailnotificationtest?api_key=' + constants.DREAMFACTORY_API_KEY;

  sendEmail() {
    let name: string; let email: string
    name = 'shabbeer'; email = 'shabbeer@zen.com.my'
    var queryHeaders = new Headers();
    queryHeaders.append('Content-Type', 'application/json');
    queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    let options = new RequestOptions({ headers: queryHeaders });

    let body = {
      "template": "",
      "template_id": 0,
      "to": [
        {
          "name": name,
          "email": email
        }
      ],
      "cc": [
        {
          "name": name,
          "email": email
        }
      ],
      "bcc": [
        {
          "name": name,
          "email": email
        }
      ],
      "subject": "Test",
      "body_text": "",
      "body_html": '<HTML><HEAD> <META name=GENERATOR content="MSHTML 10.00.9200.17606"></HEAD> <BODY> <DIV style="FONT-FAMILY: Century Gothic"> <DIV style="MIN-WIDTH: 500px"><BR> <DIV style="PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 10px; PADDING-RIGHT: 10px"><IMG style="WIDTH: 130px" alt=zen2.png src="http://zentranet.zen.com.my/_catalogs/masterpage/Layout/images/zen2.png"></DIV> <DIV style="MARGIN: 0px 100px; BACKGROUND-COLOR: #ec008c"> <DIV style="FONT-SIZE: 30px; COLOR: white; PADDING-BOTTOM: 10px; TEXT-ALIGN: center; PADDING-TOP: 10px; PADDING-LEFT: 20px; PADDING-RIGHT: 20px"><B><I>Notification</I></B></DIV></DIV><BR> <DIV style="FONT-SIZE: 12px; TEXT-ALIGN: center; PADDING-TOP: 20px">Dear [%Variable: @Employee%]<BR><BR>Your&nbsp;[%Variable: @LeaveType%] application has been forwarded to your superior for approval.  <H1 style="FONT-SIZE: 14px; TEXT-ALIGN: center; PADDING-TOP: 10px"><BR><B>Leave Details :</B><BR></H1> <TABLE style="FONT-SIZE: 12px; FONT-FAMILY: Century Gothic; MARGIN: 0px auto"> <TBODY> <TR> <TD style="TEXT-ALIGN: left">EMPLOYEE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @Employee%]</TD></TR> <TR> <TD>START DATE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @StartDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">END DATE </TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @EndDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">APPLIED DATE</TD> <TD style="PADDING-BOTTOM: 6px; PADDING-TOP: 6px; PADDING-LEFT: 6px; PADDING-RIGHT: 6px">:</TD> <TD colSpan=2>[%Variable: @AppliedDate%]</TD></TR> <TR> <TD style="TEXT-ALIGN: left">DAYS</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left">[%Variable: @NoOfDays%] </TD> <TD style="TEXT-ALIGN: left">[%Variable: @HalfDay%]</TD></TR></TR> <TR> <TD>LEAVE TYPE</TD> <TD>:</TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Variable: @LeaveType%]</TD></TR> <TR> <TD style="TEXT-ALIG: left">REASON</TD> <TD>: </TD> <TD style="TEXT-ALIGN: left" colSpan=2>[%Current Item:Reason%]</TD></TR></TBODY></TABLE><BR> <DIV style="TEXT-ALIGN: center; PADDING-TOP: 20px">Thank you.</DIV></DIV></DIV></DIV></BODY></HTML>',
      "from_name": "Ajay DAV",
      "from_email": "ajay1591ani@gmail.com",
      "reply_to_name": "",
      "reply_to_email": ""
    };
    this.http.post(this.emailUrl, body, options)
      .map(res => res.json())
      .subscribe(data => {
        // this.result= data["resource"];
        alert(JSON.stringify(data));
      });
  }

  showAddToll() {
    //let AddTollModal = this.modalCtrl.create(AddTollPage);
    //AddTollModal.present;
    this.navCtrl.push(AddTollPage, {
      DetailsType: 'Toll',
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '03048acb-037a-11e8-a50c-00155de7e742'
    });
  }

  showAddParking() {
    this.navCtrl.push(AddTollPage, {
      DetailsType: 'Parking',
      MainClaim: this.ClaimRequestMain,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-00155de7e742'
    });
  }

  readProfile() {
    return this.http.get('assets/profile.json').map((response) => response.json()).subscribe(data => {
      this.profileJSON = JSON.stringify(data);
      //levels: any[];
       let levels: any[] = data.profile.levels.level
      console.table(levels)
      levels.forEach(element => {
        if (element['-id'] == '1') {
          this.profileLevel = '1';
          if (element['approver']['-directManager'] === '1') {
            this.http
              .get(Services.getUrl('user_info', 'filter=USER_GUID=' + this.userGUID))
              .map(res => res.json())
              .subscribe(data => {
                let userInfo: any[] = data["resource"]
                userInfo.forEach(userElm => {
                  this.assignedTo = userElm.MANAGER_USER_GUID
                  this.http
                    .get(Services.getUrl('user_info', 'filter=USER_GUID=' + userElm.MANAGER_USER_GUID))
                    .map(res => res.json())
                    .subscribe(data => {
                      let userInfo: any[] = data["resource"]
                      userInfo.forEach(approverElm => {
                        this.stage = approverElm.DEPT_GUID
                      });
                    });
                });
                // console.log('Direct Manager Exists')
              });
            // console.log('Direct Manager ' + element['approver']['-directManager'])
            let varf: any[]= element['conditions']['condition']
            varf.forEach(condElement => {
              if (condElement['-status'] === 'approved') {
                console.log('Next Level ' + condElement['nextlevel']['#text'])
              }
              console.log('Status ' + condElement['-status'])
            });
          }
          else {
            this.assignedTo = element['approver']['#text']
            this.http
              .get(Services.getUrl('user_info', 'filter=USER_GUID=' + this.assignedTo))
              .map(res => res.json())
              .subscribe(data => {
                let userInfo: any[] = data["resource"]
                userInfo.forEach(approverElm => {
                  this.stage = approverElm.DEPT_GUID
                });
              });
              
          }
        }
      });
    });
  }
}
