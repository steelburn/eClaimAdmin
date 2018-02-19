import { Component, ViewChild } from '@angular/core';
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
import { ClaimRefMain_Model } from '../../models/ClaimRefMain_Model';
import { ClaimReqMain_Model } from '../../models/ClaimReqMain_Model';
/**
 * Generated class for the PrintclaimPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-printclaim',
  templateUrl: 'printclaim.html',  providers: [PrintingClaim_Service, BaseHttpService, FileTransfer]
})
export class PrintclaimPage {
 
  public MainClaimSaved: boolean = false;
  Travel_Amount_ngModel: any;
    Customer_GUID: any;
    Soc_GUID: any;  
    ClaimRequestMain: any;
    isCustomer: boolean = false;
    Printform: FormGroup;
    travelAmount: any;
    validDate = new Date().toISOString();

   

    constructor(platform: Platform, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,  private api: Services, public translate: TranslateService, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private printingservice: PrintingClaim_Service, private alertCtrl: AlertController, private camera: Camera, public actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController, private file: File, private filePath: FilePath, private transfer: FileTransfer, public toastCtrl: ToastController) {
       this.Printform = fb.group({
        soc_no: '', 
      travel_date: ['', Validators.required],
      description: ['', Validators.required],
      vehicleType: ['', Validators.required] 
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
            // claimReqMainRef.START_TS = value.start_DT;
            // claimReqMainRef.END_TS = value.end_DT;
            claimReqMainRef.DESCRIPTION = value.description;
            //claimReqMainRef.MILEAGE_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CLAIM_AMOUNT = this.Travel_Amount_ngModel
            claimReqMainRef.CREATION_TS = new Date().toISOString();
            claimReqMainRef.UPDATE_TS = new Date().toISOString();
            //claimReqMainRef.FROM = this.Travel_From_ngModel;
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

  // save() {    
  //       //debugger;
  //       //this.getImage();
  //       //this.uploadFile();
  //       if (this.Printform.valid) {
  //         let headers = new Headers();
  //         headers.append('Content-Type', 'application/json');
  //         let options = new RequestOptions({ headers: headers });    
    
  //         let url: string;
  //         let request_id = UUID.UUID();
  //         //url = this.baseResource_Url + "claim_request_detail?filter=(DESCRIPTION=" + this.Travel_Description_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //         url = this.baseResource_Url + "claim_request_detail?filter=(CLAIM_REQUEST_GUID=" + request_id + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    
  //         this.http.get(url, options)
  //           .map(res => res.json())
  //           .subscribe(
  //           data => {
  //             let res = data["resource"];
  //             if (res.length == 0) {
  //               console.log("No records Found");
  //               if (this.Exist_Record == false) {
  //                 // this.entertainment_entry.SOC_GUID = this.Entertainment_SOC_No_ngModel.trim();
                 
  //                 this.printclaim_entry.DESCRIPTION = this.Printing_Description_ngModel.trim();
  //                 this.printclaim_entry.CLAIM_AMOUNT = this.Printing_ClaimAmount_ngModel.trim();
  //                //this.printclaim_entry.CLAIM_TYPE_GUID = this.masterclaim_entry.CLAIM_TYPE_GUID = "58c59b56-289e-31a2-f708-138e81a9c823";               
  //                 // this.masterclaim_entry.CLAIM_AMOUNT = this.Printing_ClaimAmount_ngModel.trim();
  //                 // this.masterclaim_entry.CLAIM_REQUEST_GUID = UUID.UUID();
  //                 // this.masterclaim_entry.CREATION_TS = new Date().toISOString();
  //                 // this.masterclaim_entry.UPDATE_TS = new Date().toISOString();
  //                 //alert(this.masterclaim_entry.CLAIM_AMOUNT);
    
  //                 this.printclaim_entry.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
  //                 this.printclaim_entry.CREATION_TS = new Date().toISOString();
  //                 this.printclaim_entry.CREATION_USER_GUID = '1';
  //                 this.printclaim_entry.UPDATE_TS = new Date().toISOString();
  //                 this.printclaim_entry.UPDATE_USER_GUID = "";    
    
  //                 // this.printingservice.save_main_claim_request(this.masterclaim_entry)
  //                 //   .subscribe((response) => {
  //                 //     if (response.status == 200) {
  //                 //       //alert('PrintClaim Registered successfully');
  //                 //       //location.reload();
  //                 //       this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //                 //     }
  //                 //   });
    
  //                 this.printingservice.save_claim_request_detail(this.printclaim_entry)
    
  //                   .subscribe((response) => {
  //                     if (response.status == 200) {
  //                       alert('PrintClaim Registered successfully');
  //                       //location.reload();
  //                       this.navCtrl.setRoot(this.navCtrl.getActive().component);
  //                     }
  //                   });
    
  //               }
  //             }
  //             else {
  //               console.log("Records Found");
  //               alert("The Travelclaim is already Exist.")
    
  //             }    
  //           },
  //           err => {
  //             this.Exist_Record = false;
  //             console.log("ERROR!: ", err);
  //           });
  //       }    
  //     }

}
