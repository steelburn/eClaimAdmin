import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BankSetup_Model } from '../../models/banksetup_model';
import { BankSetup_Service } from '../../services/banksetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';
import { GlobalFunction } from '../../shared/GlobalFunction';

/**
 * Generated class for the BanksetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-banksetup',
  templateUrl: 'banksetup.html', providers: [BankSetup_Service, BaseHttpService, GlobalFunction]
})
export class BanksetupPage {
  NAME: any;
  bank_entry: BankSetup_Model = new BankSetup_Model();
  Bankform: FormGroup;
  bank: BankSetup_Model = new BankSetup_Model();
  current_bankGUID: string = '';

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_bank' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  Key_Param: string = 'api_key=' + constants.DREAMFACTORY_API_KEY;
  TableName: string = "";
  SortField: string = "";

  public banks: BankSetup_Model[] = [];

  public AddBanksClicked: boolean = false;
  public bank_details: any;

  //Set the Model Name for Add------------------------------------------
  public NAME_ngModel_Add: any;
  //---------------------------------------------------------------------

  //Set the Model Name for edit------------------------------------------
  public NAME_ngModel_Edit: any;
  //---------------------------------------------------------------------

  public AddBanksClick() {
    this.AddBanksClicked = true; this.Add_Form = true; this.Edit_Form = false;
    this.ClearControls();
  }

  public CloseBanksClick() {
    if (this.AddBanksClicked == true) {
      this.AddBanksClicked = false;
    }
  }

  public EditClick(BANK_GUID: any) {
    this.ClearControls();
    //this.EditBanksClicked = true;
    this.AddBanksClicked = true; this.Add_Form = false; this.Edit_Form = true;

    this.current_bankGUID = BANK_GUID;
    var self = this;
    this.banksetupservice
      .get(BANK_GUID)
      .subscribe((data) => {
        self.bank_details = data;
        this.Tenant_Add_ngModel = self.bank_details.TENANT_GUID;
        this.NAME_ngModel_Add = self.bank_details.NAME;
        localStorage.setItem('Prev_Name', self.bank_details.NAME); localStorage.setItem('Prev_TenantGuid', self.bank_details.TENANT_GUID);
      });
  }

  public DeleteClick(BANK_GUID: any) {
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
            this.banksetupservice.remove(BANK_GUID)
              .subscribe(() => {
                self.banks = self.banks.filter((item) => {
                  return item.BANK_GUID != BANK_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

  Tenant_Add_ngModel: any;
  AdminLogin: boolean = false; Add_Form: boolean = false; Edit_Form: boolean = false;
  tenants: any;

  constructor(private fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public http: Http, private httpService: BaseHttpService, private banksetupservice: BankSetup_Service, private alertCtrl: AlertController, public GlobalFunction: GlobalFunction) {
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      this.TableName = "main_bank";
      this.SortField = "NAME";
      let TableURL = this.baseResource_Url + this.TableName + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&' + 'order=' + this.SortField + '&' + this.Key_Param;
      this.baseResourceUrl = TableURL;

      this.AdminLogin = false;
    }
    else {
      //fill all the tenant details--------------
      let tenantUrl: string = this.baseResource_Url + 'tenant_main?order=TENANT_ACCOUNT_NAME&' + this.Key_Param;
      this.http
        .get(tenantUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.tenants = data.resource;
        });

      this.AdminLogin = true;
    }

    //Display Grid---------------------------------------------
    let view_url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      view_url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?filter=(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      view_url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_bank_details' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(view_url)
      .map(res => res.json())
      .subscribe(data => {
        this.banks = data.resource;
      });
    //----------------------------------------------------------
    this.Bankform = fb.group({
      NAME: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      TENANT_NAME: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanksetupPage');
  }

  Save_Bank() {
    if (this.Bankform.valid) {
      if (this.Add_Form == true) {
        this.bank_entry.BANK_GUID = UUID.UUID();
      }
      else {
        this.bank_entry.BANK_GUID = this.bank_details.BANK_GUID;
      }
      this.bank_entry.NAME = this.NAME_ngModel_Add.trim();
      if (localStorage.getItem("g_USER_GUID") != "sva") {
        this.bank_entry.TENANT_GUID = localStorage.getItem("g_TENANT_GUID");
      }
      else {
        this.bank_entry.TENANT_GUID = this.Tenant_Add_ngModel;
      }
      this.bank_entry.DESCRIPTION = 'Savings';

      if (this.Add_Form == true) {
        this.bank_entry.CREATION_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.bank_entry.CREATION_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.bank_entry.CREATION_USER_GUID = 'sva';
        }
        this.bank_entry.UPDATE_TS = new Date().toISOString();
        this.bank_entry.UPDATE_USER_GUID = "";
      }
      else {
        this.bank_entry.CREATION_TS = this.bank_details.CREATION_TS;
        this.bank_entry.CREATION_USER_GUID = this.bank_details.CREATION_USER_GUID;
        this.bank_entry.UPDATE_TS = new Date().toISOString();
        if (localStorage.getItem("g_USER_GUID") != "sva") {
          this.bank_entry.UPDATE_USER_GUID = localStorage.getItem("g_USER_GUID");
        }
        else {
          this.bank_entry.UPDATE_USER_GUID = 'sva';
        }
      }

      if (this.NAME_ngModel_Add.trim() != localStorage.getItem('Prev_Name') || this.Tenant_Add_ngModel != localStorage.getItem('Prev_TenantGuid')) {
        let val = this.CheckDuplicate();
        val.then((res) => {
          if (res.toString() == "0") {
            //---Insert or Update-----------
            if (this.Add_Form == true) {
              //**************Save service if it is new details*************************
              this.banksetupservice.save_bank(this.bank_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Bank Registered successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
            else {
              //**************Update service if it is new details*************************
              this.banksetupservice.update_bank(this.bank_entry)
                .subscribe((response) => {
                  if (response.status == 200) {
                    alert('Bank updated successfully');
                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                  }
                });
              //**************************************************************************
            }
          }
          else {
            alert("The Bank is already Exist.");
          }
        });
        val.catch((err) => {
          console.log(err);
        });
      }
      else {
        //Simple update----------
        this.banksetupservice.update_bank(this.bank_entry)
          .subscribe((response) => {
            if (response.status == 200) {
              alert('Bank updated successfully');
              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
          });
      }
    }
  }

  CheckDuplicate() {
    let url: string = "";
    if (localStorage.getItem("g_USER_GUID") != "sva") {
      url = this.baseResource_Url + "main_bank?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')AND(TENANT_GUID=' + localStorage.getItem("g_TENANT_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = this.baseResource_Url + "main_bank?filter=(NAME=" + this.NAME_ngModel_Add.trim() + ')AND(TENANT_GUID=' + this.Tenant_Add_ngModel + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
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

  ClearControls() {
    this.NAME_ngModel_Add = "";
    this.Tenant_Add_ngModel = "";
  }
}



