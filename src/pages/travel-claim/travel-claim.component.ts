import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../../config/constants';
import { ImageUpload_model } from '../../models/image-upload.model';
//import { TravelClaim_Model } from '../../models/travelclaim_model';
//import { TravelClaim_Service } from '../../services/travelclaim_service';
import { Services } from '../Services';
import { BaseHttpService } from '../../services/base-http';
import { UUID } from 'angular2-uuid';
import { FileTransfer } from '@ionic-native/file-transfer';
import { LoadingController, ActionSheetController, Loading, ToastController } from 'ionic-angular';
import { AddTollPage } from '../add-toll/add-toll.component';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { DecimalPipe } from '@angular/common';
import { UserclaimslistPage } from '../userclaimslist/userclaimslist';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-travelclaim',
  templateUrl: 'travel-claim.html', providers: [Services, BaseHttpService, FileTransfer, DecimalPipe]
})
export class TravelclaimPage {
  isReadyToSave: boolean;

  vehicles: any[];
  customers: any[];
  storeCustomers: any[];
  storeProjects: any[];
  public projects: any[];
  Travelform: FormGroup;
  TenantGUID: any;
  userGUID: any;
  items: string[];
  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;

  public Travel_Date_ngModel: any;
  public Travel_Description_ngModel: any;
  public Travel_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  public Start_DT_ngModel: any;
  public End_DT_ngModel: any;
  public Travel_From_ngModel: any;
  public Travel_Destination_ngModel: any;
  public Travel_Distance_ngModel: any;
  public Travel_Mode_ngModel: any = 'car';
  public Travel_Amount_ngModel: any;
  Project_Lookup_ngModel: any;
  Travel_Customer_ngModel: any;
  Customer_Lookup_ngModel: any;
  Customer_GUID: any;
  Soc_GUID: any;
  isFormSubmitted = false;
  tollParkLookupClicked = false;

  //public socGUID : any;
  public AddTravelClicked: boolean = false;
  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false;
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  public MainClaimSaved: boolean = false;
  claimFor: string = 'seg_project';
  currency = localStorage.getItem("cs_default_currency");

  DestinationPlaceID: string;
  OriginPlaceID: string;
  CloudFilePath: string;
  uploadFileName: string;
  loading: Loading;
  Travel_Type_ngModel: any;
  VehicleId: any;
  VehicleRate: any;
  travelAmount: number;
  validDate = new Date().toISOString();
  ClaimRequestMain: any;
  isCustomer: boolean = false;
  claimDetailsData: any[];
  tollParkAmount: number = 0;
  travelAmountNgmodel: any;
  PublicTransValue: boolean = false;
  chooseFile: boolean = false;
  ImageUploadValidation: boolean = false;
  min_claim_amount: any; min_claim: any;
  max_claim_amount: any; max_claim: any;
  /********FORM EDIT VARIABLES***********/
  vehicleCategory: any;
  isPublicTransport: boolean = false;
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData: any;
  rejectedLevel: any;

  constructor(public numberPipe: DecimalPipe, public profileMng: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams, public translate: TranslateService, fb: FormBuilder, public http: Http, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, public toastCtrl: ToastController) {

    // Lakshman
    this.min_claim_amount = localStorage.getItem('cs_min_claim_amt');
    this.min_claim = this.numberPipe.transform(this.min_claim_amount, '1.2-2');
    this.max_claim_amount = localStorage.getItem('cs_max_claim_amt');
    this.max_claim = this.numberPipe.transform(this.max_claim_amount, '1.2-2');
    let currency = localStorage.getItem("cs_default_currency");
    // Lakshman

    this.profileMng.CheckSessionOut();
    this.userGUID = localStorage.getItem('g_USER_GUID');
    this.isFormEdit = this.navParams.get('isFormEdit');
    this.claimRequestGUID = this.navParams.get('cr_GUID');
    this.TenantGUID = localStorage.getItem('g_TENANT_GUID');
    //this.PayType=;

    // if (this.isFormEdit)
    // this.GetDataforEdit();
    if (this.isFormEdit) {
      this.api.getApiModel('view_work_flow_history', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(STATUS=Rejected)').subscribe(res => {
        this.claimRequestData = res['resource'];
        if (this.claimRequestData.length > 0) {
          this.rejectedLevel = this.claimRequestData[0]['PROFILE_LEVEL'];
          this.profileMng.initiateLevels(this.rejectedLevel);
        }
        else
          this.profileMng.initiateLevels('1');
        this.GetDataforEdit();
        this.MainClaimSaved = true;
      })

    }
    else {
      this.LoadCustomers();
      this.LoadProjects();
      this.LoadVehicles();
      this.LoadPayments();
      this.onTravelTypeSelect('Local');
      this.Travel_Type_ngModel = 'Local';
      this.Travel_Mode_ngModel = 'Car';


    }
    this.Travelform = fb.group({
      avatar1: null,
      avatar: null,
      PayType: '',
      soc_no: '',
      distance: '',
      uuid: '',
      travelType: '',
      //PublicTransValidation: ['', Validators.required],
      travel_date: '',
      destination: ['', Validators.required],
      start_DT: ['', Validators.required],
      end_DT: ['', Validators.required],
      description: ['', Validators.required],
      origin: ['', Validators.required],
      vehicleType: ['', Validators.required],
      claimTypeGUID: '',
      meal_allowance: '',
      attachment_GUID: '',
      //travel_amount: ['', Validators.required],
      claim_amount: ['', Validators.required],
      from_id: '', to_id: ''

    });

  }

  getCurrency(amount: number) {
    amount = Number(amount);
    if (amount > 99999) {
      // alert('Amount should not exceed RM99999.')
      // // this.travelAmountNgmodel = null;
      // this.travelAmount = 0;
      // this.totalClaimAmount = 0;
    }
    else {
      this.travelAmountNgmodel = this.numberPipe.transform(amount, '1.2-2');
      this.travelAmount = amount;
      this.totalClaimAmount = amount;
    }
  }

  // Lakshman
  // getCurrency(amount: number) {
  //   amount = Number(amount);
  //   let amount_test=this.numberPipe.transform(amount, '1.2-2');
  //   if (amount <this.min_claim_amount || amount>this.max_claim_amount) {
  //     // this.travelAmountNgmodel = null
  //     // this.claimAmount = 0;
  //         this.travelAmount = 0;
  //     this.totalClaimAmount = 0;
  //   } 
  //   else {
  //     // this.claimAmount = amount;
  //     this.travelAmountNgmodel = this.numberPipe.transform(amount, '1.2-2');
  //     this.travelAmount = amount;
  //     this.totalClaimAmount = amount;
  //   }
  // } 
  // Lakshman

  totalClaimAmount: number;
  ionViewWillEnter() {
    //if(!this.isFormEdit)
    this.LoadClaimDetails();

  }

  imageURLEdit: any = null
  GetDataforEdit() {
    this.isFormSubmitted = true;
    //TODO: Take data by Effective Date
    this.api.getApiModel('main_mileage', 'filter=TENANT_GUID=' + this.TenantGUID).subscribe(data => {
      this.vehicles = data["resource"];
      this.api.getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID).subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID).subscribe(data => {
          this.storeProjects = this.projects = data["resource"];
          this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(data => {
            this.claimRequestData = data["resource"];
            this.api.getApiModel('main_payment_type', 'filter=TENANT_GUID=' + this.TenantGUID).subscribe(data => {
              this.paymentTypes = data["resource"];
              // this.imageURLEdit = this.claimRequestData[0].ATTACHMENT_ID;
              if (this.claimRequestData[0].ATTACHMENT_ID !== null)
                this.imageURLEdit = this.api.getImageUrl(this.claimRequestData[0].ATTACHMENT_ID);
              this.PublicTransValue = true;
              this.travelAmountNgmodel = this.numberPipe.transform(this.claimRequestData[0].MILEAGE_AMOUNT, '1.2-2');
              this.totalClaimAmount = this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT;

              if (this.claimRequestData[0].SOC_GUID === null) {
                this.claimFor = 'seg_customer'
                this.isCustomer = true;
                if (this.storeCustomers != undefined)
                  this.storeCustomers.forEach(element => {
                    if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
                      this.Customer_Lookup_ngModel = element.NAME
                      this.Customer_GUID = element.CUSTOMER_GUID
                    }
                  });
              }
              else {
                this.claimFor = 'seg_project'
                this.isCustomer = false;
                if (this.storeCustomers != undefined)
                  this.storeProjects.forEach(element => {
                    if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
                      this.Project_Lookup_ngModel = element.project_name
                      this.Travel_SOC_No_ngModel = element.soc
                      this.Soc_GUID = element.SOC_GUID
                    }
                  });
              }
              // this.Start_DT_ngModel = new Date(this.claimRequestData[0].START_TS).toISOString();
              // this.End_DT_ngModel = new Date(this.claimRequestData[0].END_TS).toISOString();
              this.Start_DT_ngModel = moment(this.claimRequestData[0].START_TS).format('YYYY-MM-DDTHH:mm');
              this.End_DT_ngModel = moment(this.claimRequestData[0].END_TS).format('YYYY-MM-DDTHH:mm');

              // this.Travel_Mode_ngModel = this.claimRequestData[0].MILEAGE_GUID;

              this.Travel_From_ngModel = this.claimRequestData[0].FROM;
              this.Travel_Destination_ngModel = this.claimRequestData[0].DESTINATION;
              this.DestinationPlaceID = this.claimRequestData[0].to_place_id;
              this.OriginPlaceID = this.claimRequestData[0].from_place_id;
              this.Travel_Distance_ngModel = this.claimRequestData[0].DISTANCE_KM;
              this.LoadClaimDetails();
              this.Travel_Description_ngModel = this.claimRequestData[0].DESCRIPTION

              this.paymentTypes.forEach(element => {
                if (this.claimRequestData[0].claim_method_guid === element.PAYMENT_TYPE_GUID) {
                  this.PayType = element.PAYMENT_TYPE_GUID;
                }
              });

              this.vehicles.forEach(element => {
                if (this.claimRequestData[0].MILEAGE_GUID === '427b1ef9-6474-297c-acac-a430199ab882')
                  this.isPublicTransport = true;
                if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
                  {
                    this.Travel_Mode_ngModel = element.CATEGORY;
                    this.VehicleRate = element.RATE_PER_UNIT;
                    // this.onVehicleSelect(element)
                  }
                }
              });
              if (this.claimRequestData[0].TRAVEL_TYPE === '1') {
                this.Travel_Type_ngModel = 'Outstation';
                this.isTravelLocal = false;
              }
              else {
                this.Travel_Type_ngModel = 'Local'
                this.isTravelLocal = true;
              }
            });
          });
        });
      })
    })

  }

  GetSocNo(item: any) {
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
    if (this.claimFor == 'seg_customer') this.isCustomer = true;
    else this.isCustomer = false;
  }
  paymentTypes: any[]; PayType: any
  LoadPayments() {
    this.api.getApiModel('main_payment_type', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.paymentTypes = data["resource"];
        this.PayType = this.paymentTypes.filter(s => s.NAME == localStorage.getItem("cs_default_payment_type"))[0].PAYMENT_TYPE_GUID;
      }
      );
  }

  LoadProjects() {
    this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeProjects = this.projects = data["resource"];
      })
  }

  LoadCustomers() {
    this.api.getApiModel('view_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
      })
  }

  LoadVehicles() {
    this.api.getApiModel('main_mileage', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.vehicles = data["resource"];
        if (!this.isFormEdit) {
          this.vehicles.forEach(element => {
            if (element.CATEGORY === 'Car') {
              this.onVehicleSelect(element);
            }
          });
        }
      })
  }

  LoadClaimDetails() {
    this.tollParkAmount = 0;
    return new Promise((resolve) => {
      this.api.getApiModel('view_claim_details', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
        this.claimDetailsData = res['resource'];
        this.claimDetailsData.forEach(element => {
          if (element.ATTACHMENT_ID !== null)
            element.ATTACHMENT_ID = this.api.getImageUrl(element.ATTACHMENT_ID);
          //this.imageURLEdit = this.api.getImageUrl(element.ATTACHMENT_ID);
          this.tollParkAmount += this.roundNumber(element.AMOUNT, 12);
        });
        if (this.isFormSubmitted) {
          this.tollParkAmount = this.tollParkAmount === undefined ? 0 : this.tollParkAmount;
          this.totalClaimAmount = this.travelAmount + this.tollParkAmount;

          this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
            .subscribe(data => {
              this.claimRequestData = data;
              this.claimRequestData["resource"][0].CLAIM_AMOUNT = this.totalClaimAmount;
              this.api.updateApiModel('main_claim_request', this.claimRequestData, true).subscribe(res => {
              })
            })
        }
        else
          this.totalClaimAmount = 0;
        resolve(this.tollParkAmount);
      })
    });
  }

  roundNumber(number: any, decimals: any) {
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber);
  }

  GetDistance() {
    if (this.tollParkAmount > 0) {
      alert('You have added toll/parking/accommodation details to previous path. Please review the details.')
    }
    let url = 'http://api.zen.com.my/api/v2/google/distancematrix/json?destinations=place_id:' + this.DestinationPlaceID + '&origins=place_id:' + this.OriginPlaceID + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    var destination: any;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      let temp = data["rows"][0]["elements"][0];
      // console.table(data)
      if (temp["distance"] != null) {
        let DistKm: string = data["rows"][0]["elements"][0]["distance"]["text"];
        // console.log(DistKm)
        DistKm = DistKm.replace(',', '')
        this.Travel_Distance_ngModel = destination = DistKm.substring(0, DistKm.length - 2)
        this.Travel_Distance_ngModel = this.numberPipe.transform(this.Travel_Distance_ngModel, '1.2-2');
        // this.Travel_Mode_ngModel = this.vehicleCategory;
        if (!this.isPublicTransport)
          //Added by bijay on 24/09/2018
          this.travelAmount = this.roundNumber(destination * this.VehicleRate, 2);
        // this.travelAmountNgmodel = this.numberPipe.transform(this.travelAmount, '1.2-2');
        this.travelAmountNgmodel = this.travelAmount;
        this.travelAmount = this.travelAmount === undefined ? 0 : this.travelAmount;
        this.tollParkAmount = this.tollParkAmount === undefined ? 0 : this.tollParkAmount;
        //Added by bijay on 24/09/2018
        this.totalClaimAmount = this.roundNumber(this.travelAmount + this.tollParkAmount, 2);
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
    if (this.Travel_From_ngModel != undefined && this.Travel_Destination_ngModel != undefined) {
      this.GetDistance();
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
    //this.AddLookupClicked = true;
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

  searchLocation(key: any) {
    let val = key.target.value;
    //val = val.replace(/ /g, '');
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    else {
      val = val.replace(/ /g, '');
    }
    // var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=50000&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    var url = 'http://api.zen.com.my/api/v2/google/place/autocomplete/json?json?radius=500&components=country:MY&input=' + val + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.currentItems = data["predictions"];
      console.table(this.currentItems);
    });
  }

  // Search project start:

  searchProject(searchString: any) {
    let val = searchString.target.value;
    if (!val || !val.trim()) {
      this.projects = this.storeProjects;
      return;
    }
    this.projects = this.filterProjects({
      project_name: val, soc: val
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

  showAddToll(claimDetailGuid: string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.claimRequestGUID,
      ClaimReqDetailGuid: claimDetailGuid,
      ClaimMethod: '03048acb-037a-11e8-a50c-00155de7e742',
      ClaimMethodName: 'Toll'
    });
  }

  showAddParking(claimDetailGuid: string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.claimRequestGUID,
      ClaimReqDetailGuid: claimDetailGuid,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-00155de7e742',
      ClaimMethodName: 'Parking'
    });
  }

  showAddAccommodation(claimDetailGuid: string) {
    this.CloseTollParkLookup();
    this.navCtrl.push(AddTollPage, {
      MainClaim: this.claimRequestGUID,
      ClaimReqDetailGuid: claimDetailGuid,
      ClaimMethod: '0ebb7e5f-037a-11e8-a50c-ssh55de7e742',
      ClaimMethodName: 'Accommodation'
    });
  }

  showMealAllowance(claimDetailGuid: string) {
    this.CloseTollParkLookup();
    if (claimDetailGuid === null) {
      this.api.getApiModel('claim_request_detail', 'filter=(CLAIM_REQUEST_GUID=' + this.claimRequestGUID + ')AND(CLAIM_METHOD_GUID=0ebb7e5f-ssha-11e8-a50c-ssh55de7e742)').subscribe(data => {
        if (data['resource'].length === 1) { alert('Meal Allowance is already applied.'); return; }
        this.navCtrl.push(AddTollPage, {
          MainClaim: this.claimRequestGUID,
          ClaimReqDetailGuid: claimDetailGuid,
          ClaimMethod: '0ebb7e5f-ssha-11e8-a50c-ssh55de7e742',
          ClaimMethodName: 'Meal Allowance'
        });
      })
    }
    else {
      this.navCtrl.push(AddTollPage, {
        MainClaim: this.claimRequestGUID,
        ClaimReqDetailGuid: claimDetailGuid,
        ClaimMethod: '0ebb7e5f-ssha-11e8-a50c-ssh55de7e742',
        ClaimMethodName: 'Meal Allowance'
      });
    }
  }

  imageOptional: boolean = false;
  onPaySelect(payBy: any) {
    if (payBy.REQUIRE_ATTACHMENT === 0) {
      this.imageOptional = true;
    }
    else
      this.imageOptional = false;
  }

  onVehicleSelect(vehicle: any) {
    this.VehicleId = vehicle.MILEAGE_GUID;
    this.VehicleRate = vehicle.RATE_PER_UNIT;
    this.vehicleCategory = vehicle.CATEGORY;
    this.PublicTransValue = true;
    if (vehicle.AUTO_CALCULATE === 0) {
      this.isPublicTransport = true;
      //alert(localStorage.getItem("cs_default_payment_type"));
      // this.PayType="Cash"; //localStorage.getItem("cs_default_payment_type");
      if (this.isFormEdit)
        this.PublicTransValue = true;
      //this.travelAmount = undefined;
      else
        this.PublicTransValue = false;
    }
    else
      this.isPublicTransport = false;
    if (this.Travel_From_ngModel != undefined && this.Travel_Destination_ngModel != undefined) {
      this.GetDistance();
    }
  }

  allowanceGUID: any;
  onAllowanceSelect(allowance: any) {
    this.allowanceGUID = allowance.ALLOWANCE_GUID;
  }

  imageGUID: any;

  displayImage: any
  // CloseDisplayImage() {
  //   this.displayImage = false;
  // }
  // imageURL: string;
  // DisplayImage(val: any) {
  //   this.displayImage = true;
  //   this.imageURL = val;
  //   if (val !== null) { 
  //     this.imageURL = this.api.getImageUrl(val); 
  //     this.displayImage = true; 
  //     this.isImage = this.api.isFileImage(val); 
  //   }
  // }

  isImage: boolean = false;
  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'image/jpeg')
        this.isImage = true;
      else
        this.isImage = false;
      this.Travelform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Travelform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
    //this.disableButton = false;
    this.PublicTransValue = true;
    // this.PublicTransValue = false;

    this.ImageUploadValidation = false;
  }

  uniqueName: any
  fileName1: string;
  ProfileImage: any;
  newImage: boolean = true;
  private ProfileImageDisplay(e: any, fileChoose: string): void {
    let reader = new FileReader();
    if (e.target.files && e.target.files[0]) {

      const file = e.target.files[0];
      this.Travelform.get(fileChoose).setValue(file);
      if (fileChoose === 'avatar1')
        this.fileName1 = file.name;

      reader.onload = (event: any) => {
        this.ProfileImage = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    this.imageGUID = this.uploadFileName;
    this.chooseFile = true;
    this.newImage = false;
    this.onFileChange(e);
    this.ImageUploadValidation = true;
    this.saveIm();
  }

  disableButton: any;
  saveIm() {
    let uploadImage = this.UploadImage();
    uploadImage.then(() => {
      //this.imageGUID(this.uploadFileName, formvalues)
      // console.table(resJson)
      // let imageResult = this.SaveImageinDB();
      // imageResult.then((objImage: ImageUpload_model) => { 
      this.ImageUploadValidation = true;
      //  this.imageGUID = objImage.Image_Guid
      this.imageGUID = this.uniqueName;
      // , formvalues
      //this.disableButton = true;
      //this.PublicTransValue = false;
      // this.PublicTransValue = true;
      this.chooseFile = false;
    })
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1000);
  }

  SaveImageinDB() {
    let objImage: ImageUpload_model = new ImageUpload_model();
    objImage.Image_Guid = UUID.UUID();
    objImage.IMAGE_URL = this.CloudFilePath + this.uploadFileName;
    objImage.CREATION_TS = new Date().toISOString();
    objImage.Update_Ts = new Date().toISOString();
    return new Promise((resolve) => {
      this.api.postData('main_images', objImage.toJson(true)).subscribe(() => {
        // let res = response.json();
        // let imageGUID = res["resource"][0].Image_Guid;
        resolve(objImage.toJson());
      })
    })
  }

  UploadImage() {
    this.CloudFilePath = 'eclaim/'
    this.uniqueName = new Date().toISOString() + this.uploadFileName;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    return new Promise((resolve) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uniqueName, this.Travelform.get('avatar').value, options)
        .map((response) => {
          this.loading.dismissAll()
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }


  validateDate(startDate: any, endDate: any) {
    let today = moment(new Date()).format('YYYY-MM-DDTHH:mm');
    let start = startDate;
    let end = endDate;
    if (start > end || today < start) {
      alert('The Date Range is not valid.')
      return false;
    }
    return true;
  }

  TollParkLookup() {
    this.tollParkLookupClicked = true;
    this.LoadClaimDetails();
    this.tollParkAmount = 0;
  }
  CloseTollParkLookup() {
    this.tollParkLookupClicked = false;
  }

  isTravelLocal: any;
  onTravelTypeSelect(value: any) {
    if (value === 'Local') this.isTravelLocal = true;
    else this.isTravelLocal = false;
  }
  valueChange(value: any) {

  }
  submitAction(formValues: any) {
    let amount = Number(this.totalClaimAmount);
    if (amount < this.min_claim_amount || amount > this.max_claim_amount) {
      this.travelAmountNgmodel = null;
      this.totalClaimAmount = 0;
      alert("Claim amount should be " + this.currency + " " + this.min_claim_amount + " - " + this.max_claim_amount + " ");
      return;
    }
    else {
      this.travelAmountNgmodel = this.travelAmountNgmodel;
    }

    formValues.travel_date = formValues.start_DT;
    if (this.api.isClaimExpired(formValues.travel_date, false))
      return;
    if (this.Customer_GUID === undefined && this.Soc_GUID === undefined) {
      alert('Please select "project" or "customer" to continue.');
      return;
    }
    if (this.validateDate(this.Start_DT_ngModel, this.End_DT_ngModel)) {
      if (!this.isFormSubmitted) {
        this.isFormSubmitted = true;
        formValues.uuid = this.claimRequestGUID = UUID.UUID();
        // formValues.travel_date = formValues.start_DT
        formValues.claimTypeGUID = '58c59b56-289e-31a2-f708-138e81a9c823';
        formValues.meal_allowance = this.allowanceGUID;
        formValues.distance = this.Travel_Distance_ngModel;
        formValues.vehicleType = this.VehicleId;
        formValues.attachment_GUID = this.imageGUID;
        formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
        formValues.PayType = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;

        formValues.from_id = this.OriginPlaceID;
        formValues.to_id = this.DestinationPlaceID;


        this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
        this.MainClaimSaved = true;
      }
      else {
        this.api.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
          .subscribe(data => {
            this.claimRequestData = data;
            // this.claimRequestData["resource"][0].STATUS = 'Pending';

            this.claimRequestData["resource"][0].MILEAGE_GUID = this.VehicleId;
            this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.start_DT;
            this.claimRequestData["resource"][0].START_TS = formValues.start_DT;
            this.claimRequestData["resource"][0].END_TS = formValues.end_DT;
            this.claimRequestData["resource"][0].MILEAGE_AMOUNT = this.travelAmount;
            this.claimRequestData["resource"][0].CLAIM_AMOUNT = this.totalClaimAmount;
            this.claimRequestData["resource"][0].UPDATE_TS = new Date().toISOString();
            this.claimRequestData["resource"][0].FROM = formValues.origin;
            this.claimRequestData["resource"][0].DESTINATION = formValues.destination;
            this.claimRequestData["resource"][0].DISTANCE_KM = this.Travel_Distance_ngModel;
            this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
            this.claimRequestData["resource"][0].ATTACHMENT_ID = this.imageGUID;
            this.claimRequestData["resource"][0].TRAVEL_TYPE = formValues.travelType === 'Outstation' ? '1' : '0';
            this.claimRequestData["resource"][0].claim_method_guid = this.PayType === undefined ? 'f74c3366-0437-51ec-91cc-d3fad23b061c' : this.PayType;
            if (this.claimRequestData["resource"][0].STATUS === 'Rejected') {
              this.claimRequestData["resource"][0].PROFILE_LEVEL = this.rejectedLevel;
              this.claimRequestData["resource"][0].STAGE = localStorage.getItem('edit_stage');
              this.claimRequestData["resource"][0].ASSIGNED_TO = localStorage.getItem('edit_superior');
              if (this.rejectedLevel === 3)
                this.claimRequestData["resource"][0].STATUS = 'Approved';
              else
                this.claimRequestData["resource"][0].STATUS = 'Pending';
            }
            else {
              this.claimRequestData["resource"][0].STATUS = 'Pending';
            }

            if (this.isCustomer) {
              this.claimRequestData["resource"][0].CUSTOMER_GUID = this.Customer_GUID;
              this.claimRequestData["resource"][0].SOC_GUID = null;
            }
            else {
              this.claimRequestData["resource"][0].SOC_GUID = this.Soc_GUID;
              this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
            }

            this.api.updateApiModel('main_claim_request', this.claimRequestData, true).subscribe(() => {
              // if (isClaim && modelJSON.STATUS != 'Draft')
              // if (this.claimRequestData["resource"][0].STATUS != 'Draft') {

              // Send Email------------------------------------------------
              // this.api.sendEmail(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, formValues.start_DT, formValues.end_DT, moment(this.claimRequestData["resource"][0].CREATION_TS).format('YYYY-MM-DDTHH:mm'), formValues.start_DT, this.claimRequestGUID);
              //Commented By bijay on 24/09/2018 as per scheduler implemented
              // this.api.sendEmail_New(this.claimRequestData["resource"][0].CLAIM_TYPE_GUID, formValues.start_DT, formValues.end_DT, moment(this.claimRequestData["resource"][0].CREATION_TS).format('YYYY-MM-DDTHH:mm'), formValues.start_DT, this.claimRequestGUID, formValues.origin, formValues.destination, formValues.description, this.Soc_GUID, this.Customer_GUID);
              // ----------------------------------------------------------
              //}

              alert('Claim details updated successfully.');
              this.navCtrl.push(UserclaimslistPage);
            })
          })
        // this.profileMng.save(formValues, this.travelAmount, this.isCustomer)
        // this.MainClaimSaved = true;
      }
    }
  }

  EditDetail(claimDetailId: string, claimMethodGuid: string) {
    if (this.claimRequestGUID === null)
      this.claimRequestGUID = localStorage.getItem("g_CR_GUID")
    if (claimMethodGuid === '03048acb-037a-11e8-a50c-00155de7e742') { this.showAddToll(claimDetailId) }
    else if (claimMethodGuid === '0ebb7e5f-037a-11e8-a50c-00155de7e742') { this.showAddParking(claimDetailId) }
    else if (claimMethodGuid === '0ebb7e5f-ssha-11e8-a50c-ssh55de7e742') { this.showMealAllowance(claimDetailId) }
    else if (claimMethodGuid === '0ebb7e5f-037a-11e8-a50c-ssh55de7e742') { this.showAddAccommodation(claimDetailId) }

  }
  DeleteDetail(claimDetailId: string) {
    this.api.deleteApiModel('claim_request_detail', claimDetailId).subscribe(() => {
      this.tollParkAmount = 0;
      this.LoadClaimDetails();
      alert('Claim detail has been deleted successfully.');
    });
  }

}
