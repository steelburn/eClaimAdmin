import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { CountrySetup_Model } from '../../models/countrysetup_model';
import { MileageSetup_Service } from '../../services/mileagesetup_service';
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
  templateUrl: 'countrysetup.html',
})
export class CountrysetupPage {
  Countryform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

  public AddCountryClicked: boolean = false;
  public EditCountryClicked: boolean = false;
  //public Exist_Record: boolean = false;
  //public mileage_details: any;
  //public exist_record_details: any;

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

  public CloseCountryClick() {

    if (this.AddCountryClicked == true) {
      this.AddCountryClicked = false;
    }
    if (this.EditCountryClicked == true) {
      this.EditCountryClicked = false;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CountrysetupPage');
  }

}
