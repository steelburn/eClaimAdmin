import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { MedicalClaim_Model } from '../../models/medicalclaim_model';
//import { MasterClaim_Model } from '../../models/masterclaim_model';
import { MedicalClaim_Service } from '../../services/medicalclaim_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

 import { Camera, CameraOptions } from '@ionic-native/camera';
//import {Camera} from 'ionic-native';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { ClaimRefMain_Model } from '../../models/ClaimRefMain_Model';
import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';

import {  LoadingController, ActionSheetController,  Platform, Loading, ToastController } from 'ionic-angular';
import { Services } from '../Services';


/**
 * Generated class for the MedicalclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-medicalclaim',
  templateUrl: 'medicalclaim.html', providers: [MedicalClaim_Service, BaseHttpService, FileTransfer]
})
export class MedicalclaimPage {
//   isReadyToSave: boolean;
//   medicalclaim_entry: MedicalClaim_Model = new MedicalClaim_Model();
//  // masterclaim_entry: MasterClaim_Model = new MasterClaim_Model();
//   Mcform: FormGroup;
//   private myData: any;

//   baseResourceUrl1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_request' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
//   baseResource_Url1: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

//   baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/claim_request_detail' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
//   baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
//   public Exist_Record: boolean = false;

//   public Medical_Date_ngModel:any;
//   public Medical_Amount_ngModel:any;
//   public Medical_Description_ngModel: any;
  Medicalform: FormGroup;
  Travel_Amount_ngModel: any;
  travelAmount: any;
  validDate = new Date().toISOString();
  isCustomer: boolean = false;
  Customer_GUID: any;
  Soc_GUID: any;
  ClaimRequestMain: any;
  public MainClaimSaved: boolean = false;

  constructor(platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private api: Services, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private medicalservice: MedicalClaim_Service, private alertCtrl: AlertController, private camera: Camera,  public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController ) {
  

  
    // this.translateToEnglish();
    // this.translate.setDefaultLang('en'); //Fallback language
    // platform.ready().then(() => {
    // });

    this.Medicalform = fb.group({
     
      travel_date:  ['', Validators.required],      
      description: ['', Validators.required],      
     vehicleType: ['', Validators.required],
        });
   
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
            //claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CREATION_TS = new Date().toISOString();
            claimReqMainRef.UPDATE_TS = new Date().toISOString();
            // claimReqMainRef.FROM = this.Travel_From_ngModel;
            // claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
            // claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
           // claimReqMainRef.SOC_GUID = this.Travel_SOC_No_ngModel;
           if(this.isCustomer){
            claimReqMainRef.CUSTOMER_GUID = this.Customer_GUID ;
          }
          else{
            claimReqMainRef.SOC_GUID = this.Soc_GUID;
          }
          claimReqMainRef.CUSTOMER_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;
          claimReqMainRef.SOC_GUID = this.isCustomer ? this.Customer_GUID : this.Soc_GUID;

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
          //claimReqMainRef.MILEAGE_GUID = this.VehicleId;
          claimReqMainRef.CLAIM_TYPE_GUID = '58c59b56-289e-31a2-f708-138e81a9c823';
          claimReqMainRef.TRAVEL_DATE = value.travel_date;
          // claimReqMainRef.START_TS = value.start_DT;
          // claimReqMainRef.END_TS = value.end_DT;
          claimReqMainRef.DESCRIPTION = value.description;
          //claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel;
          claimReqMainRef.CREATION_TS = new Date().toISOString();
          claimReqMainRef.UPDATE_TS = new Date().toISOString();
          // claimReqMainRef.FROM = this.Travel_From_ngModel;
          // claimReqMainRef.DESTINATION = this.Travel_Destination_ngModel;
          // claimReqMainRef.DISTANCE_KM = this.Travel_Distance_ngModel;
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


 

  // save(){    
  //   //debugger;
  //   //this.getImage();
  //   //this.uploadFile();
  //     if (this.Mcform.valid) {
  //       let headers = new Headers();
  //       headers.append('Content-Type', 'application/json');
  //       let options = new RequestOptions({ headers: headers });
  //       let url: string;
  //       let request_id = UUID.UUID();
  //       //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Medical_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //       url = this.baseResource_Url + "claim_request_detail?filter=(CLAIM_REQUEST_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //       this.http.get(url, options)
  //         .map(res => res.json())
  //         .subscribe(
  //         data => {
  //           let res = data["resource"];
  //           if (res.length == 0) {
  //             console.log("No records Found");
  //             if (this.Exist_Record == false) {
  //              // this.entertainment_entry.SOC_GUID = this.Entertainment_SOC_No_ngModel.trim();
  //               this.medicalclaim_entry.DESCRIPTION = this.Medical_Description_ngModel.trim();
  //               this.medicalclaim_entry.CLAIM_AMOUNT = this.Medical_Amount_ngModel.trim();
  //               //this.medicalclaim_entry.CLAIM_AMOUNT = this.Medical_Date_ngModel.trim();
  //               //this.entertainment2_entry.ATTACHMENT_ID = this.Entertainment_FileUpload_ngModel.trim();

  //               // this.masterclaim_entry.CLAIM_AMOUNT = this.Medical_Amount_ngModel.trim();
  //               // this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
  //               // this.masterclaim_entry.CREATION_TS = new Date().toISOString();
  //               // this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
                
  //       this.medicalclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
  //       this.medicalclaim_entry.CREATION_TS = new Date().toISOString();
  //       this.medicalclaim_entry.CREATION_USER_GUID = '1';
  //       this.medicalclaim_entry.UPDATE_TS = new Date().toISOString();
  //       this.medicalclaim_entry.UPDATE_USER_GUID = "";
  //     //this.uploadFile();

  //     // this.medicalservice.save_main_claim_request(this.masterclaim_entry)
  //     // .subscribe((response) => {
  //     //   if (response.status == 200) {
  //     //     //alert('Medicalclaim Registered successfully');
  //     //     //location.reload();
  //     //     this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //     //   }
  //     // });

  //       this.medicalservice.save_claim_request_detail(this.medicalclaim_entry)
  //         .subscribe((response) => {
  //           if (response.status == 200) {
  //             alert('Medicalclaim Registered successfully');
  //             //location.reload();
  //             this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //           }
  //         });
  //     }
  //   }
  //   else {
  //     console.log("Records Found");
  //     alert("The Medicalclaim is already Exist.")      
  //   }    
  //   },
  //   err => {
  //   this.Exist_Record = false;
  //   console.log("ERROR!: ", err);
  //   });
  //   }    
  //   }

}
