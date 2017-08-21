import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
//import { FormBuilder, FormGroup } from '@angular/forms';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { RoleSetup_Model } from '../../models/rolesetup_model';
import { RoleSetup_Service } from '../../services/rolesetup_service';
import { BaseHttpService } from '../../services/base-http';

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the RolesetupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rolesetup',
  templateUrl: 'rolesetup.html',providers: [RoleSetup_Service, BaseHttpService]
})
export class RolesetupPage {
  role_entry: RoleSetup_Model = new RoleSetup_Model();
  role: RoleSetup_Model = new RoleSetup_Model();
  Roleform: FormGroup;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_role' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';

public roles: RoleSetup_Model[] = [];

public AddRoleClicked: boolean = false; 
   public EditRoleClicked: boolean = false; 

    public AddRoleClick() { 

        this.AddRoleClicked = true; 
    }
      public EditClick(ROLE_GUID: any) {
    alert(ROLE_GUID);
    this.EditRoleClicked = true;
    var self = this;
    this.rolesetupservice
      .get(ROLE_GUID)
      .subscribe((role) => self.role = role);
    return self.role;
  }

  public DeleteClick(ROLE_GUID: any) {
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
            this.rolesetupservice.remove(ROLE_GUID)
              .subscribe(() => {
                self.roles = self.roles.filter((item) => {
                  return item.ROLE_GUID != ROLE_GUID
                });
              });
            //this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    }); alert.present();
  }

        public CloseRoleClick() {

        if (this.AddRoleClicked == true) {
      this.AddRoleClicked = false;
    }
    if (this.EditRoleClicked == true) {
      this.EditRoleClicked = false;
    }
    }

      constructor(public navCtrl: NavController, public navParams: NavParams, fb: FormBuilder, public http: Http, private httpService: BaseHttpService, private rolesetupservice: RoleSetup_Service, private alertCtrl: AlertController) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.roles = data.resource;
      });

          this.Roleform = fb.group({
      NAME: ["", Validators.required],
      DESCRIPTION: ["", Validators.required],
      ACTIVATION_FLAG: ["", Validators.required],

      
    });
  }

    ionViewDidLoad() {
    console.log('ionViewDidLoad RolesetupPage');
  }

 Save(value: any) {
    if (this.Roleform.valid) {
      this.role_entry.ROLE_GUID = UUID.UUID();
      this.role_entry.TENANT_GUID = UUID.UUID();
      this.role_entry.CREATION_TS = new Date().toISOString();
      this.role_entry.CREATION_USER_GUID = "1";
      this.role_entry.UPDATE_TS = new Date().toISOString();
      this.role_entry.UPDATE_USER_GUID = "";
     // this.role_entry.ACTIVATION_FLAG = 1;
      //this.role_entry.NAME=value.NAME;
      
      this.rolesetupservice.save(this.role_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Role Registered successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }

  Update(ROLE_GUID: any) {  
    if(this.role_entry.NAME==null){this.role_entry.NAME = this.role_entry.NAME;}
    if(this.role_entry.DESCRIPTION==null){this.role_entry.DESCRIPTION = this.role_entry.DESCRIPTION;}

    if (this.Roleform.valid) {
      this.role_entry.CREATION_TS = this.role.CREATION_TS
      this.role_entry.CREATION_USER_GUID = this.role.CREATION_USER_GUID;
      this.role_entry.UPDATE_TS = this.role.UPDATE_TS;

      this.role_entry.ROLE_GUID = ROLE_GUID;
      this.role_entry.UPDATE_TS = new Date().toISOString();
      this.role_entry.UPDATE_USER_GUID = '1';
      //this.role_entry.ACTIVATION_FLAG = 1;
      
      this.rolesetupservice.update(this.role_entry)
        .subscribe((response) => {
          if (response.status == 200) {
            alert('Mileage updated successfully');
            //location.reload();
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        })
    }
  }
}


   

// Roleform: FormGroup;
//    public AddRoleClicked: boolean = false; 
   
//     public AddRoleClick() {

//         this.AddRoleClicked = true; 
//     }

//       public CloseRoleClick() {

//         this.AddRoleClicked = false; 
//     }
//   constructor(public navCtrl: NavController, public navParams: NavParams,fb:FormBuilder) {

//     this.Roleform = fb.group({
      
//       rolename:'',
     
//     });
//   }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad RolesetupPage');
  // }


