import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CountrySetup_Model } from '../../models/countrysetup_model';
import { CountrySetup_Service } from '../../services/countrysetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the CountrysetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-countrysetup',
  templateUrl: 'countrysetup.html', providers: [CountrySetup_Service, BaseHttpService]
})
export class CountrysetupPage {
  country_entry: CountrySetup_Model = new CountrySetup_Model();
  Countryform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public countries: CountrySetup_Model[] = [];

  public AddCountryClicked: boolean = false;
  public EditCountryClicked: boolean = false;
  public Exist_Record: boolean = false;

  public country_details: any;
  public exist_record_details: any;
 
  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any; 
  //---------------------------------------------------------------------
  public AddCountryClick() {
    //this.ClearControls();
    this.AddCountryClicked = true;    
  }

  public EditClick(COUNTRY_GUID: any) {
   // this.ClearControls();
    this.EditCountryClicked = true;
    var self = this;
    this.countrysetupservice
      .get(COUNTRY_GUID)
      .subscribe((data) => {
        self.country_details = data;
        console.log(self.country_details);
        this.NAME_ngModel_Edit = self.country_details.NAME; localStorage.setItem('Prev_country', self.country_details.NAME); //console.log(self.mileage_details.CATEGORY);
       
      });   
  }

  public DeleteClick(COUNTRY_GUID: any) {
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
            this.countrysetupservice.remove(COUNTRY_GUID)
              .subscribe(() => {
                self.countries = self.countries.filter((item) => {
                  return item.COUNTRY_GUID != COUNTRY_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  public CloseCountryClick() {

    if (this.AddCountryClicked == true) {
      this.AddCountryClicked = false;
    }
    if (this.EditCountryClicked == true) {
      this.EditCountryClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private countrysetupservice: CountrySetup_Service, private alertCtrl: AlertController) {
    this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.countries = data.resource;
    });
  this.Countryform = fb.group({   
    NAME: ["", Validators.required],  
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountrysetupPage');
  }

  Save() {
    if (this.Countryform.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let url: string;
      url = this.baseResource_Url + "main_country?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
        data => {
          let res = data["resource"];
          if (res.length == 0) {
            console.log("No records Found");
            if (this.Exist_Record == false) {
              this.country_entry.NAME = this.NAME_ngModel_Add.trim(); 
              this.country_entry.COUNTRY_GUID = UUID.UUID();
              this.country_entry.CREATION_TS = new Date().toISOString();
              this.country_entry.CREATION_USER_GUID = "1";
              this.country_entry.UPDATE_TS = new Date().toISOString();             
              this.country_entry.UPDATE_USER_GUID = "";

              this.countrysetupservice.save(this.country_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Country Registered successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
            }
          }
          else {
            console.log("Records Found");
            alert("The Country is already Exist.")
          }
        },
        err => {
          this.Exist_Record = false;
          console.log("ERROR!: ", err);
        });
    }
  }

  Update(COUNTRY_GUID: any) {  
    if (this.Countryform.valid) {
      if (this.country_entry.NAME == null) { this.country_entry.NAME = this.NAME_ngModel_Edit.trim(); }    

      this.country_entry.CREATION_TS = this.country_details.CREATION_TS;
      this.country_entry.CREATION_USER_GUID = this.country_details.CREATION_USER_GUID;
      this.country_entry.UPDATE_TS = this.country_details.UPDATE_TS;
      this.country_entry.COUNTRY_GUID = COUNTRY_GUID;      
      this.country_entry.UPDATE_USER_GUID = '1';
      //debugger;
      if (this.NAME_ngModel_Edit.trim() != localStorage.getItem('Prev_country')) {       
        let url: string;
        url = this.baseResource_Url + "main_country?filter=(NAME=" + this.NAME_ngModel_Edit.trim() + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
        this.http.get(url)
          .map(res => res.json())
          .subscribe(
          data => {
            let res = data["resource"];
            console.log('Current Category : ' + this.NAME_ngModel_Edit + ', Previous Category : ' + localStorage.getItem('Prev_country'));

            if (res.length == 0) {
              console.log("No records Found");
              this.country_entry.NAME = this.NAME_ngModel_Edit.trim();
              
              //**************Update service if it is new details*************************
              this.countrysetupservice.update(this.country_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Country updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              console.log("Records Found");
              alert("The Country is already Exist. ");
            }
          },
          err => {
            this.Exist_Record = false;
            console.log("ERROR!: ", err);
          });
      }
      else {
        if (this.country_entry.NAME == null) { this.country_entry.NAME = localStorage.getItem('Prev_country'); }
        //this.mileage_entry.CATEGORY = this.CATEGORY_ngModel_Edit;
        //**************Update service if it is old details*************************
        this.countrysetupservice.update(this.country_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Country updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
        //**************************************************************************
      }
    }
  }

}
