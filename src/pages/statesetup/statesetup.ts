import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { StateSetup_Model } from '../../models/statesetup_model';
import { CountrySetup_Model } from '../../models/countrysetup_model';
import { StateSetup_Service } from '../../services/statesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the StatesetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statesetup',
  templateUrl: 'statesetup.html',  providers: [StateSetup_Service, BaseHttpService]
})
export class StatesetupPage {
  state_entry: StateSetup_Model = new StateSetup_Model();
  country_entry: CountrySetup_Model = new CountrySetup_Model();
  Stateform: FormGroup;
  public countries:any;
  

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_state' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  baseResourceUrl_country: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?api_key=' + constants.DREAMFACTORY_API_KEY;

  baseResourceUrl_view: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_state' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  // main_country' + '?order=NAME&api_key=' + cons        order=NAME&
  //public states: StateSetup_Model[] = [];
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

 // public NAME_ngModel_Edit: any; 
  //---------------------------------------------------------------------
  public AddStateClick() {
    //this.ClearControls();
    this.AddStateClicked = true;    
  }

  public EditClick(STATE_GUID: any) {
   // this.ClearControls();
    this.EditStateClicked = true;
    var self = this;
    this.statesetupservice
      .get(STATE_GUID)
      .subscribe((data) => {
        self.state_details = data;
        //console.log(self.state_details);
        this.STATE_NAME_ngModel_Edit = self.state_details.NAME; localStorage.setItem('Previ_state', self.state_details.NAME); //console.log(self.mileage_details.CATEGORY);
        this.COUNTRY_NAME_ngModel_Edit = self.state_details.COUNTRY_GUID;
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
    }
    if (this.EditStateClicked == true) {
      this.EditStateClicked = false;
    }
  }



  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private statesetupservice: StateSetup_Service, private alertCtrl: AlertController) {
    //Bind Country-------------
    this.BindCountry();

    //Bind Grid-----------------
    this.http
    .get(this.baseResourceUrl_view)
    .map(res => res.json())
    .subscribe(data => {
      this.states = data.resource; 
     // console.log(data.resource);     
    });
  //-------------------------------- 
  this.Stateform = fb.group({  
    NAME: ["", Validators.required],  
    COUNTRY_GUID: ["", Validators.required],  
  });
  }

  BindCountry() {
    this.http
      .get(this.baseResourceUrl_country)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data["resource"];
      });
  }

  Save() {
    if (this.Stateform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_state?filter=(NAME=" + this.STATE_NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.state_entry.NAME = this.STATE_NAME_ngModel_Add.trim(); 
              this.state_entry.COUNTRY_GUID = this.COUNTRY_NAME_ngModel_Add.trim();
             // this.state_entry.COUNTRY_GUID =   this.country_entry.NAME; 
              this.state_entry.STATE_GUID = UUID.UUID();
              this.state_entry.CREATION_TS = new Date().toISOString();
              this.state_entry.CREATION_USER_GUID = "1";
              this.state_entry.UPDATE_TS = new Date().toISOString();             
              this.state_entry.UPDATE_USER_GUID = "";

              this.statesetupservice.Save(this.state_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('State Registered successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The State is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  Update(STATE_GUID: any) { 
    alert(STATE_GUID);
    if (this.Stateform.valid) {
      if (this.state_entry.NAME == null) { this.state_entry.NAME = this.STATE_NAME_ngModel_Edit.trim(); }  
      if (this.state_entry.COUNTRY_GUID == null) { this.state_entry.COUNTRY_GUID = this.COUNTRY_NAME_ngModel_Edit.trim(); }   

      this.state_entry.CREATION_TS = this.state_details.CREATION_TS;
      this.state_entry.CREATION_USER_GUID = this.state_details.CREATION_USER_GUID;
      this.state_entry.UPDATE_TS = this.state_details.UPDATE_TS;
      this.state_entry.STATE_GUID = STATE_GUID;      
      this.state_entry.UPDATE_USER_GUID = '1';
      //debugger;
      if (this.STATE_NAME_ngModel_Edit.trim() != localStorage.getItem('Previ_state')) {       
        let url: string;
        url = this.baseResource_Url + "main_country?filter=(NAME=" + this.STATE_NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current state : ' + this.STATE_NAME_ngModel_Edit + ', Previous state : ' + localStorage.getItem('Previ_state'));

            if (res.length == 0) {
              console.log("No records Found");
              this.country_entry.NAME = this.STATE_NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.statesetupservice.Update(this.state_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('state updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The State is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.state_entry.NAME == null) { this.state_entry.NAME = localStorage.getItem('Previ_state'); }
        //this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit;
        //**************Update service if it is old details*************************
        this.statesetupservice.Update(this.state_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('State updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //**************************************************************************
      }
    }
  }

}
