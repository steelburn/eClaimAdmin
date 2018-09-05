import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { Settings_Model } from '../../models/settings_model';
import { Settings_Service } from '../../services/Settings_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { LoginPage } from '../login/login';
import { Item } from 'ionic-angular/components/item/item';
import { Flags } from '@ionic-native/file';

/**
 * Generated class for the CompanysettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-companysettings',
  templateUrl: 'companysettings.html', providers: [Settings_Service, BaseHttpService, TitleCasePipe]
})
export class CompanysettingsPage {
  CompanySettingsform: FormGroup;
  loading: Loading; button_Add_Disable: boolean = false; button_Edit_Disable: boolean = false; button_Delete_Disable: boolean = false; button_View_Disable: boolean = false;
  setting_details_new: any;

  SettingsModel: Settings_Model[] = [];
  Settings_Entry: Settings_Model = new Settings_Model();

  constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private settingservice: Settings_Service, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private titlecasePipe: TitleCasePipe) {
    if (localStorage.getItem("g_USER_GUID") == null) {
      alert('Sorry !! Please Login.');
      this.navCtrl.setRoot(LoginPage);
    }
    else {
      this.button_Add_Disable = false; this.button_Edit_Disable = false; this.button_Delete_Disable = false; this.button_View_Disable = false;
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        //Get the role for this page------------------------------        
        if (localStorage.getItem("g_KEY_ADD") == "0") { this.button_Add_Disable = true; }
        if (localStorage.getItem("g_KEY_EDIT") == "0") { this.button_Edit_Disable = true; }
        if (localStorage.getItem("g_KEY_DELETE") == "0") { this.button_Delete_Disable = true; }
        if (localStorage.getItem("g_KEY_VIEW") == "0") { this.button_View_Disable = true; }
      }

      this.Bind_Country(); this.Bind_PaymentType(); this.BindControls();

      this.CompanySettingsform = fb.group({
        DateFormat: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Currency: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        EmailLogo: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Country: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        MaxClaimAmt: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        MinClaimAmt: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ClaimCutOffDate: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        YearStartMonth: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        YearEndMonth: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        ApprovalCutoffDate: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        PaymentType: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
        Language: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      });
    }
  }

  Countrys: any;
  Bind_Country() {
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_country' + '?order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.Countrys = data.resource;
      });
  }

  PaymentTypes: any;
  Bind_PaymentType() {
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_payment_type' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&order=NAME&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.PaymentTypes = data.resource;
      });
  }

  Add_Form: boolean = true;
  FormControls: any;
  DateFormat_ngModel: any; Currency_ngModel: any; EmailLogo_ngModel: any; Country_ngModel: any;
  MaxClaimAmt_ngModel: any; MinClaimAmt_ngModel: any; ClaimCuttoffDate_ngModel: any; YearStartMonth_ngModel: any;
  YearEndMonth_ngModel: any; ApprovalCutoffDate_ngModel: any; PaymentType_ngModel: any; Language_ngModel: any;

  BindControls() {
    this.KeyNameValue = [];
    let url: string = "";
    url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/permission_keys' + '?filter=(TENANT_GUID=' + localStorage.getItem('g_TENANT_GUID') + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.FormControls = data.resource;
        for (var item in this.FormControls) {
          this.KeyNameValue.push({ PERMISSION_KEY_GUID: this.FormControls[item]["PERMISSION_KEY_GUID"], KEY_NAME: this.FormControls[item]["KEY_NAME"], KEY_VALUE: this.FormControls[item]["KEY_VALUE"] });
          if (this.FormControls[item]["KEY_NAME"] == "date_format") { this.DateFormat_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_currency") { this.Currency_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "email_logo") { this.EmailLogo_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_country") { this.Country_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "max_claim_amt") { this.MaxClaimAmt_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "min_claim_amt") { this.MinClaimAmt_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "claim_cutOff_date") { this.ClaimCuttoffDate_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "year_start_month") { this.YearStartMonth_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "year_end_month") { this.YearEndMonth_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "approval_cutoff_date") { this.ApprovalCutoffDate_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_payment_type") { this.PaymentType_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          if (this.FormControls[item]["KEY_NAME"] == "default_language") { this.Language_ngModel = this.FormControls[item]["KEY_VALUE"]; }
          this.Add_Form = false;
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanysettingsPage');
  }

  KeyNameValue: any[] = []; blnDataInsert: boolean = false; blnDataUpdate: boolean = false;
  Save(formValues: any) {
    if (this.Add_Form == true) {
      this.KeyNameValue = [];
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "date_format", KEY_VALUE: formValues.DateFormat.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_currency", KEY_VALUE: formValues.Currency.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "email_logo", KEY_VALUE: formValues.EmailLogo.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_country", KEY_VALUE: formValues.Country.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "max_claim_amt", KEY_VALUE: formValues.MaxClaimAmt.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "min_claim_amt", KEY_VALUE: formValues.MinClaimAmt.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "claim_cutOff_date", KEY_VALUE: formValues.ClaimCutOffDate.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "year_start_month", KEY_VALUE: formValues.YearStartMonth.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "year_end_month", KEY_VALUE: formValues.YearEndMonth.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "approval_cutoff_date", KEY_VALUE: formValues.ApprovalCutoffDate.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_payment_type", KEY_VALUE: formValues.PaymentType.trim() });
      this.KeyNameValue.push({ PERMISSION_KEY_GUID: UUID.UUID(), KEY_NAME: "default_language", KEY_VALUE: formValues.Language.trim() });

      this.Settings_Entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
      this.Settings_Entry.CREATION_TS = new Date().toISOString();
      this.Settings_Entry.UPDATE_TS = new Date().toISOString();
      this.Settings_Entry.UPDATE_USER_GUID = null;
    }
    else {
      this.KeyNameValue.forEach(element => {
        if (element.KEY_NAME == "date_format") { element.KEY_VALUE = formValues.DateFormat.trim(); }
        if (element.KEY_NAME == "default_currency") { element.KEY_VALUE = formValues.Currency.trim(); }
        if (element.KEY_NAME == "email_logo") { element.KEY_VALUE = formValues.EmailLogo.trim(); }
        if (element.KEY_NAME == "default_country") { element.KEY_VALUE = formValues.Country.trim(); }
        if (element.KEY_NAME == "max_claim_amt") { element.KEY_VALUE = formValues.MaxClaimAmt.trim(); }
        if (element.KEY_NAME == "min_claim_amt") { element.KEY_VALUE = formValues.MinClaimAmt.trim(); }
        if (element.KEY_NAME == "claim_cutOff_date") { element.KEY_VALUE = formValues.ClaimCutOffDate.trim(); }
        if (element.KEY_NAME == "year_start_month") { element.KEY_VALUE = formValues.YearStartMonth.trim(); }
        if (element.KEY_NAME == "year_end_month") { element.KEY_VALUE = formValues.YearEndMonth.trim(); }
        if (element.KEY_NAME == "approval_cutoff_date") { element.KEY_VALUE = formValues.ApprovalCutoffDate.trim(); }
        if (element.KEY_NAME == "default_payment_type") { element.KEY_VALUE = formValues.PaymentType.trim(); }
        if (element.KEY_NAME == "default_language") { element.KEY_VALUE = formValues.Language.trim(); }

        this.Settings_Entry.CREATION_USER_GUID = this.FormControls[0]["CREATION_USER_GUID"];
        this.Settings_Entry.CREATION_TS = this.FormControls[0]["CREATION_TS"];
        this.Settings_Entry.UPDATE_TS = new Date().toISOString();
        this.Settings_Entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
      });
    }

    this.KeyNameValue.forEach(element => {
      this.Settings_Entry.PERMISSION_KEY_GUID = element.PERMISSION_KEY_GUID;
      this.Settings_Entry.KEY_NAME = element.KEY_NAME;
      this.Settings_Entry.KEY_VALUE = element.KEY_VALUE;
      this.Settings_Entry.SHIFT_GUID = null;
      this.Settings_Entry.DEVICE_GUID = null;
      this.Settings_Entry.ROLE_GUID = null;
      this.Settings_Entry.COMPANY_GUID = null;
      this.Settings_Entry.DEPT_GUID = null;
      this.Settings_Entry.USER_GUID = null;
      this.Settings_Entry.TENANT_COMPANY_GUID = localStorage.getItem("g_TENANT_COMPANY_GUID");
      this.Settings_Entry.TENANT_COMPANY_SITE_GUID = localStorage.getItem("g_TENANT_COMPANY_SITE_GUID");
      this.Settings_Entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");

      if (this.Add_Form == true) {
        this.settingservice.save(this.Settings_Entry, "permission_keys")
          .subscribe((response) => {
            if (response.status == 200) {
              this.blnDataInsert = true; this.blnDataUpdate = false;
            }
          });
      }
      else {
        this.settingservice.update(this.Settings_Entry, "permission_keys")
          .subscribe((response) => {
            if (response.status == 200) {
              this.blnDataUpdate = true; this.blnDataInsert = false;
            }
          });
      }
    });
    if (this.blnDataInsert == true) {
      alert('Submitted successfully');
    }
    if (this.blnDataUpdate == true) {
      alert('Updated successfully');
    }
    this.BindControls();
  }
}
