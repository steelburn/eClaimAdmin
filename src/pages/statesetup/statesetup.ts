import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { StateSetup_Model } from '../../models/statesetup_model';
import { CountrySetup_Model } from '../../models/countrysetup_model';
import { StateSetup_Service } from '../../services/statesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';

/**
 * Generated class for the StatesetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statesetup',
  templateUrl: 'statesetup.html', providers: [StateSetup_Service, BaseHttpService, TitleCasePipe]
})
export class StatesetupPage {
  state_entry: StateSetup_Model = new StateSetup_Model();
  country_entry: CountrySetup_Model = new CountrySetup_Model();
  Stateform: FormGroup;
  public countries: any;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_state' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl_country: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl_view: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_state' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  public states: any[];

  public AddStateClicked: boolean = false;
  public EditStateClicked: boolean = false;
  public Exist_Record: boolean = false;

  public state_details: any;
  public exist_record_details: any;

  //Set the Model Name for Add------------------------------------------
  public COUNTRY_NAME_ngModel_Add: any;
  public STATE_NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public COUNTRY_NAME_ngModel_Edit: any;
  public STATE_NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  Add_Form: boolean = false; Edit_Form: boolean = false; HeaderText: string = "";

  public AddStateClick() {
    if (this.Edit_Form == false) {
      this.AddStateClicked = true; this.Add_Form = true; this.Edit_Form = false; this.HeaderText = "REGISTER NEW STATE";
      this.ClearControls();
    }
    else {
      alert('Sorry !! You are in Edit Mode.');
    }
  }

  public EditClick(STATE_GUID: any) {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.ClearControls();
    this.AddStateClicked = true; this.Add_Form = false; this.Edit_Form = true; this.HeaderText = "UPDATE COUNTRY";

    var self = this;
    this.statesetupservice
      .get(STATE_GUID)
      .subscribe((data) => {
        self.state_details = data;

        this.STATE_NAME_ngModel_Add = self.state_details.NAME; localStorage.setItem('Previ_state', self.state_details.NAME);
        this.COUNTRY_NAME_ngModel_Add = self.state_details.COUNTRY_GUID;

        this.loading.dismissAll();
      });
  }

  public DeleteClick(STATE_GUID: any) {
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
            this.statesetupservice.remove(STATE_GUID)
              .subscribe(() => {
                self.states = self.states.filter((item) => {
                  return item.STATE_GUID != STATE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseStateClick() {
    if (this.AddStateClicked == true) {
      this.AddStateClicked = false; 
      this.Add_Form = true; this.Edit_Form = false;
    }
  }

  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private statesetupservice: StateSetup_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry !! Please Login.');
      this.navCtrl.push(LoginPage);
    }
    else {
      //Clear localStorage value--------------------------------      
      this.ClearLocalStorage();

      //Bind Country-------------
      this.BindCountry();

      //Display Grid---------------------------- 
      this.DisplayGrid();

      //----------------------------------------
      this.Stateform = fb.group({
        NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        COUNTRY_GUID: ["", Validators.required],
      });
    }
  }

  BindCountry() {
    this.http
      .get(this.baseResourceUrl_country)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data["resource"];
      });
  }

  ClearLocalStorage() {
    if (localStorage.getItem('Previ_state') == null) {
      localStorage.setItem('Previ_state', null);
    }
    else {
      localStorage.removeItem("Previ_state");
    }
  }

  DisplayGrid() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loading.present();

    this.http
      .get(this.baseResourceUrl_view)
      .map(res => res.json())
      .subscribe(data => {
        this.states = data.resource;

        this.loading.dismissAll();
      });
  }

  Save() {
    if (this.Stateform.valid) {
      //for Save Set Entities------------------------------------------------------------------------
      if (this.Add_Form == true) {
        this.SetEntityForAdd();
      }
      //for Update Set Entities----------------------------------------------------------------------
      else {
        this.SetEntityForUpdate();
      }
      //Common Entitity For Insert/Update-----------------    
      this.SetCommonEntityForAddUpdate();

      //Load the Controller--------------------------------
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      //--------------------------------------------------

      if (this.STATE_NAME_ngModel_Add.trim().toUpperCase() != localStorage.getItem('Previ_state').toUpperCase()) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-----------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************              
              this.Insert();
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************              
              this.Update();
              //**************************************************************************
            }
          }
          else {
            alert("The Country is already Exist.");
            this.loading.dismissAll();
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update---------- 
        this.Update();
      }
    }
  }

  SetEntityForAdd() {
    this.state_entry.STATE_GUID = UUID.UUID();
    this.state_entry.CREATION_TS = new Date().toISOString();
    this.state_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
    this.state_entry.UPDATE_TS = new Date().toISOString();
    this.state_entry.UPDATE_USER_GUID = "";
  }

  SetEntityForUpdate() {
    this.state_entry.STATE_GUID = this.state_details.STATE_GUID;
    this.state_entry.CREATION_TS = this.state_details.CREATION_TS;
    this.state_entry.CREATION_USER_GUID = this.state_details.CREATION_USER_GUID;
    this.state_entry.UPDATE_TS = new Date().toISOString();
    this.state_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
  }

  SetCommonEntityForAddUpdate() {
    this.state_entry.NAME = this.titlecasePipe.transform(this.STATE_NAME_ngModel_Add.trim());
    this.state_entry.COUNTRY_GUID = this.COUNTRY_NAME_ngModel_Add.trim();
  }

  RemoveStorageValues() {
    localStorage.removeItem("Previ_state");
  }

  CheckDuplicate() {
    let url: string = "";
    url = this.baseResource_Url + "main_state?filter=(NAME=" + this.STATE_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

    let result: any;
    return new Promise((resolve) => {
      this.http
        .get(url)
        .map(res => res.json())
        .subscribe(data => {
          result = data["resource"];
          resolve(result.length);
        });
    });
  }

  Insert() {
    this.statesetupservice.Save(this.state_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('State Registered Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  Update() {
    this.statesetupservice.Update(this.state_entry)
      .subscribe((response) => {
        if (response.status == 200) {
          alert('State Updated Successfully');

          //Remove all storage values-----------------------------------------          
          this.RemoveStorageValues();
          //------------------------------------------------------------------

          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
      });
  }

  ClearControls() {
    this.STATE_NAME_ngModel_Add = "";
    this.COUNTRY_NAME_ngModel_Add = "";
  }
}
