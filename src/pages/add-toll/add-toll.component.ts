import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import * as constants from '../../config/constants';

import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ClaimReqDetail_Model } from '../../models/ClaimReqDetail_Model';
import { UUID } from 'angular2-uuid';
import { Console } from '@angular/core/src/console';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Services } from '../Services';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ImageUpload_model } from '../../models/image-upload.model';


@IonicPage()
@Component({
  selector: 'page-add-toll',
  templateUrl: 'add-toll.html', providers: [Services]
})
export class AddTollPage {
  paymentTypes: any; ClaimMainGUID: any; ClaimMethodGUID: any;
  DetailsForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef;
  loading = false;
  uploadFileName: string;
  DetailsType: string;
  CloudFilePath: string;
  constructor(
    private fb: FormBuilder,
    public api: Services,
    public travelservice: Services,
    public http: Http, public navCtrl: NavController,
    public navParams: NavParams, public viewCtrl: ViewController
  ) {

    this.createForm();
    this.LoadPayments();
  }
  createForm() {
    this.DetailsForm = this.fb.group({
      avatar: null
    });
  }

  CloseAddTollPage() {
    this.viewCtrl.dismiss();
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.DetailsForm.get('avatar').setValue(file);
      this.uploadFileName = file.name;
      reader.onload = () => {
        this.DetailsForm.get('avatar').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        });
      };
    }
  }

  // onSubmit() {
  //   this.loading = true;
  //   const queryHeaders = new Headers();
  //   queryHeaders.append('filename', this.uploadFileName);
  //   queryHeaders.append('Content-Type', 'multipart/form-data');
  //   queryHeaders.append('fileKey', 'file');
  //   queryHeaders.append('chunkedMode', 'false');
  //   queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
  //   const options = new RequestOptions({ headers: queryHeaders });
  //   this.http.post('http://api.zen.com.my/api/v2/files/' + this.uploadFileName, this.DetailsForm.get('avatar').value, options)
  //     .map((response) => {
  //       return response;
  //     }).subscribe((response) => {
  //       alert(response.status);
  //     });
  //   setTimeout(() => {
  //     alert('done');
  //     this.loading = false;
  //   }, 1000);
  // }

  LoadPayments() {
    this.http
      .get(Services.getUrl('main_payment_type'))
      .map(res => res.json())
      .subscribe(data => {
        this.paymentTypes = data["resource"];
      }
      );
  }

  save() {
    let uploadImage = this.UploadImage();
    uploadImage.then((resJson) => {
      console.table(resJson)
      let imageResult = this.SaveImageinDB();
      imageResult.then((objImage: ImageUpload_model) => {
        // console.table(objImage)
        let result = this.SaveClaimDetails(objImage.Image_Guid);
        result.then((res) => {
          // console.log(res);
        })
      })
    })   
  }

  ngOnInit(): void {
    this.DetailsType = this.navParams.get('DetailsType');
    this.ClaimMainGUID = this.navParams.get('MainClaim');
    this.ClaimMethodGUID = this.navParams.get('ClaimMethod')
  }
  clearFile() {
    this.DetailsForm.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  SaveClaimDetails(imageGUID: string) {
    let claimReqRef: ClaimReqDetail_Model = new ClaimReqDetail_Model();
    claimReqRef.CLAIM_REQUEST_DETAIL_GUID = UUID.UUID();
    claimReqRef.CLAIM_REQUEST_GUID = this.ClaimMainGUID;
    claimReqRef.CLAIM_METHOD_GUID = this.ClaimMethodGUID;
    claimReqRef.PAYMENT_TYPE_GUID = this.PayType;
    claimReqRef.AMOUNT = this.Amount;
    claimReqRef.DESCRIPTION = this.Description;
    claimReqRef.CREATION_TS = new Date().toISOString();
    claimReqRef.UPDATE_TS = new Date().toISOString();
    claimReqRef.ATTACHMENT_ID = imageGUID;
    return new Promise((resolve, reject) => {
      this.api.postData('claim_request_detail', claimReqRef.toJson(true)).subscribe((data) => {
        let res = data.json();
        let claimDetailsGuid = res["resource"][0].CLAIM_REQUEST_DETAIL_GUID;
        resolve(claimDetailsGuid);
      })
    });
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
    if (this.DetailsType === 'Toll') {
      this.CloudFilePath = 'eclaim/toll/'
    }
    else if (this.DetailsType === 'Parking') {
      this.CloudFilePath = 'eclaim/parking/'
    }
    this.loading = true;
    const queryHeaders = new Headers();
    queryHeaders.append('filename', this.uploadFileName);
    queryHeaders.append('Content-Type', 'multipart/form-data');
    queryHeaders.append('fileKey', 'file');
    queryHeaders.append('chunkedMode', 'false');
    queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    const options = new RequestOptions({ headers: queryHeaders });
    return new Promise((resolve, reject) => {
      this.http.post('http://api.zen.com.my/api/v2/files/' + this.CloudFilePath + this.uploadFileName, this.DetailsForm.get('avatar').value, options)
        .map((response) => {
          return response;
        }).subscribe((response) => {
          resolve(response.json());
        })
    })
  }
  Amount: any; PayType: any; Description: any;
}
