import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { PageSetup_Model } from '../../models/pagesetup_model';
import { PageSetup_Service } from '../../services/pagesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the PagesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pagesetup',
  templateUrl: 'pagesetup.html', providers: [PageSetup_Service, BaseHttpService]
})
export class PagesetupPage {
  page_entry: PageSetup_Model = new PageSetup_Model();
  Pageform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_rolepage' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public pages: PageSetup_Model[] = [];

  public AddPageClicked: boolean = false;
  public EditPageClicked: boolean = false;
  public Exist_Record: boolean = false;

  public page_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  public DESCRIPTION_ngModel_Add: any;
  public URL_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  public DESCRIPTION_ngModel_Edit: any;
  public URL_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddPageClick() {
    this.ClearControls();
    this.AddPageClicked = true;
  }

  public ClosePageClick() {

    if (this.AddPageClicked == true) {
      this.AddPageClicked = false;
    }
    if (this.EditPageClicked == true) {
      this.EditPageClicked = false;
    }
  }

  public EditClick(PAGE_GUID: any) {

    //this.ClearControls();
    this.EditPageClicked = true;
    var self = this;
    this.pagesetupservice

      .get(PAGE_GUID)
      .subscribe((data) => {
        self.page_details = data;
        this.NAME_ngModel_Edit = self.page_details.NAME; localStorage.setItem('Prev_set_NAME', self.page_details.NAME);

        this.DESCRIPTION_ngModel_Edit = self.page_details.DESCRIPTION;
        this.URL_ngModel_Edit = self.page_details.URL;
      });
  }

  public DeleteClick(PAGE_GUID: any) {
    let alert = this.alertCtrl.create({
      title: 'Remove Confirmation',
      message: 'Do you want to remove ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
            var self = this;
            this.pagesetupservice.remove(PAGE_GUID)
              .subscribe(() => {
                self.pages = self.pages.filter((item) => {
                  return item.PAGE_GUID != PAGE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private pagesetupservice: PageSetup_Service, private alertCtrl: AlertController) {
    if (localStorage.getItem("g_USER_GUID") == "sva") {
      this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.pages = data.resource;
        });

      this.Pageform = fb.group({
        NAME: ["", Validators.required],
        DESCRIPTION: ["", Validators.required],
        //URL: [null, Validators.compose([Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'), Validators.required])]
        URL: ["", Validators.required]
      });
    }
    else {
      alert("Sorry !! This is for only Super Admin.");
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesetupPage');
  }

  Save() {
    if (this.Pageform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_rolepage?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.page_entry.NAME = this.NAME_ngModel_Add.trim();
              this.page_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Add.trim();
              this.page_entry.URL = this.URL_ngModel_Add.trim();

              this.page_entry.PAGE_GUID = UUID.UUID();
              this.page_entry.CREATION_TS = new Date().toISOString();
              this.page_entry.CREATION_USER_GUID = "1";
              this.page_entry.UPDATE_TS = new Date().toISOString();
              this.page_entry.UPDATE_USER_GUID = "";

              this.pagesetupservice.save(this.page_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('PageSetup Registered successfully');
                    //location.reload();
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Cashcard is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  Update(PAGE_GUID: any) {
    if (this.Pageform.valid) {
      if (this.page_entry.NAME == null) { this.page_entry.NAME = this.NAME_ngModel_Edit; }
      if (this.page_entry.DESCRIPTION == null) { this.page_entry.DESCRIPTION = this.DESCRIPTION_ngModel_Edit; }
      if (this.page_entry.URL == null) { this.page_entry.URL = this.URL_ngModel_Edit; }

      this.page_entry.CREATION_TS = this.page_details.CREATION_TS;
      this.page_entry.CREATION_USER_GUID = this.page_details.CREATION_USER_GUID;
      this.page_entry.PAGE_GUID = PAGE_GUID;
      this.page_entry.UPDATE_TS = new Date().toISOString();
      this.page_entry.UPDATE_USER_GUID = '1';

      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_set_NAME')) {
        let url: string;
        url = this.baseResource_Url + "main_rolepage?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Name : ' + this.NAME_ngModel_Edit + ', Previous Name : ' + localStorage.getItem('Prev_set_NAME'));
            if (res.length == 0) {
              console.log("No records Found");
              this.page_entry.NAME = this.NAME_ngModel_Edit.trim();

              //**************Update service if it is new details*************************
              this.pagesetupservice.update(this.page_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Page updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The bank is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.page_entry.NAME == null) { this.page_entry.NAME = localStorage.getItem('Prev_set_NAME'); }
        this.page_entry.NAME = this.NAME_ngModel_Edit.trim();

        //**************Update service if it is old details*************************

        this.pagesetupservice.update(this.page_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Page updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //  }
      }
    }
  }

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.DESCRIPTION_ngModel_Add = "";
    this.URL_ngModel_Add = "";
  }
}
