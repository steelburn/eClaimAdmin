import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PrintingClaim_Model } from '../../models/printingclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { PrintingClaim_Service } from '../../services/printingclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { LoadingController, ActionSheetController, Platform, Loading, ToastController } from 'ionic-angular';
import { Services } from '../Services';
import { MainClaimReferanceModel } from '../../models/main-claim-ref.model';
import { MainClaimRequestModel } from '../../models/main-claim-request.model';
import { ImageUpload_model } from '../../models/image-upload.model';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { DecimalPipe } from '@angular/common';
import { DashboardPage } from '../dashboard/dashboard';
import { UserclaimslistPage } from '../../pages/userclaimslist/userclaimslist';

@IonicPage()
@Component({
  selector: 'page-printclaim',
  templateUrl: 'printclaim.html', providers: [PrintingClaim_Service, BaseHttpService, FileTransfer]
})
export class PrintclaimPage {

  uploadFileName: string;
  loading = false;
  CloudFilePath: string;
  @ViewChild('fileInput') fileInput: ElementRef;

  public MainClaimSaved: boolean = false;
  Printing_Date_ngModel: any;
  Printing_Description_ngModel: any;
  Printing_Amount_ngModel: any;
  Customer_GUID: any;
  Soc_GUID: any;
  ClaimRequestMain: any;
  isCustomer: boolean = false;
  Printform: FormGroup;
  travelAmount: any;
  validDate = new Date().toISOString();
  claimFor: string = 'seg_customer';
  public Print_SOC_No_ngModel: any;
  public Travel_ProjectName_ngModel: any;
  Project_Lookup_ngModel: any;
  Customer_Lookup_ngModel: any;
  storeProjects: any[]; 
  customers: any[]; 
  storeCustomers: any[]; 
  public projects: any[];
  TenantGUID: any;

  ProjectLookupClicked: boolean = false;
  CustomerLookupClicked: boolean = false; 
  public AddLookupClicked: boolean = false;
  public AddToLookupClicked: boolean = false;
  currentItems: any;
  
  userGUID: any;

  public assignedTo: any;
  public profileLevel: any;
  public stage: any;
  public profileJSON: any;

  /********FORM EDIT VARIABLES***********/
  isFormEdit: boolean = false;
  claimRequestGUID: any;
  claimRequestData: any;
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
        // if (this.claimRequestData[0].SOC_GUID === null) {
        //   this.claimFor = 'customer'
        //   this.storeCustomers.forEach(element => {
        //     if (element.CUSTOMER_GUID === this.claimRequestData[0].CUSTOMER_GUID) {
        //       this.Customer_Lookup_ngModel = element.NAME
        //     }
        //   });
        // }
        // else {
        //   this.claimFor = 'project'
        //   this.storeProjects.forEach(element => {
        //     if (element.SOC_GUID === this.claimRequestData[0].SOC_GUID) {
        //       this.Project_Lookup_ngModel = element.project_name
        //       this.Print_SOC_No_ngModel = element.soc
        //     }
        //   });
        // }
        // this.Print_Date_ngModel = this.claimRequestData[0].TRAVEL_DATE;
        this.Printing_Date_ngModel = new Date(this.claimRequestData[0].TRAVEL_DATE).toISOString();
        // this.travelAmount = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Printing_Amount_ngModel = this.claimRequestData[0].MILEAGE_AMOUNT;
        this.Printing_Description_ngModel = this.claimRequestData[0].DESCRIPTION;
        // this.vehicles.forEach(element => {
        //   if (element.MILEAGE_GUID === this.claimRequestData[0].MILEAGE_GUID) {
        //     this.Travel_Mode_ngModel = element.CATEGORY
        //   }
        // });       
      }
      );
  }  

  constructor(private apiMng: ApiManagerProvider,public profileMng: ProfileManagerProvider, platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private api: Services, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private printingservice: PrintingClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
      this.TenantGUID = localStorage.getItem('g_TENANT_GUID'); 
    this.Printform = fb.group({
      claimTypeGUID:'',
      avatar: null,
      soc_no: '',
      travel_date: ['', Validators.required],
      description: ['', Validators.required],
      //vehicleType: ['', Validators.required],
      claim_amount: ['', Validators.required],
      attachment_GUID: ''
    });
    this.LoadProjects();
    this.LoadCustomers();
    //this.readProfile();   
  }

  GetSocNo(item: any){
    this.Print_SOC_No_ngModel = item.soc;
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

  LoadProjects() {
    this.api.getApiModel('soc_registration', 'filter=TENANT_GUID=' + this.TenantGUID)
      .subscribe(data => {
        this.storeProjects = this.projects = data["resource"];
      })
  }

  LoadCustomers() {
    this.http
      .get(Services.getUrl('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID))
      .map(res => res.json())
      .subscribe(data => {
        this.storeCustomers = this.customers = data["resource"];
        // console.table(this.projects)
      }
      );
  }

  // LoadCustomers() {
  //   this.api.getApiModel('main_customer', 'filter=TENANT_GUID=' + this.TenantGUID)
  //     .subscribe(data => {
  //       this.storeCustomers = this.customers = data["resource"];
  //     })
  // }

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

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Printform.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.Printform.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  } 

  saveIm(formValues: any) {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {
      this.submitAction(this.uploadFileName, formValues);
      // console.table(resJson)
      // let imageResult = this.SaveImageinDB();
      // imageResult.then((objImage: ImageUpload_model) => {
      //   // console.table(objImage)
      //   let result = this.submitAction(objImage.Image_Guid, formValues);
      // })
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
    return new Promise((resolve, reject) => {
      this.api.postData('main_images', objImage.toJson(true)).subscribe((response) => {
        // let res = response.json();
        // let imageGUID = res["resource"][0].Image_Guid;
        resolve(objImage.toJson());
      })
    })
  }

  UploadImage() {
    this.CloudFilePath = 'eclaim/'

    this.loading = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.Printform.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }

  submitAction(imageGUID: any, formValues: any) {
    if (this.isFormEdit) {
      this.apiMng.getApiModel('main_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID)
        .subscribe(data => {
          this.claimRequestData = data;
          this.claimRequestData["resource"][0].ATTACHMENT_ID = imageGUID;
          this.claimRequestData["resource"][0].CLAIM_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].MILEAGE_AMOUNT = formValues.claim_amount;
          this.claimRequestData["resource"][0].TRAVEL_DATE = formValues.travel_date;
          this.claimRequestData["resource"][0].DESCRIPTION = formValues.description;
  
          //this.claimRequestData[0].claim_amount= formValues.claim_amount;
          // if (this.isCustomer) {
          //   this.claimRequestData["resource"][0].CUSTOMER_GUID = formValues.soc_no;
          //   this.claimRequestData["resource"][0].SOC_GUID = null;
          // }
          // else {
          //   this.claimRequestData["resource"][0].SOC_GUID = formValues.soc_no;
          //   this.claimRequestData["resource"][0].CUSTOMER_GUID = null;
          // }
          //this.claimRequestData[0].STATUS = 'Pending';
         // this.apiMng.updateMyClaimRequest(this.claimRequestData[0]).subscribe(res => alert('Claim details are submitted successfully.'))
         this.apiMng.updateApiModel('main_claim_request',this.claimRequestData).subscribe(res =>
          {
            alert('Claim details are submitted successfully.')
            this.navCtrl.push(UserclaimslistPage);
         });
        })
    }
    else {
    formValues.claimTypeGUID = 'd9567482-033a-6d92-3246-f33043155746';
    formValues.attachment_GUID = imageGUID;
    this.travelAmount = formValues.claim_amount;
    formValues.soc_no = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
    this.profileMng.save(formValues, this.travelAmount, this.isCustomer)

  } 
    }
  } 
}
