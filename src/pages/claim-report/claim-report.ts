import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';


/**
 * Generated class for the ClaimReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claim-report',
  templateUrl: 'claim-report.html',
})
export class ClaimReportPage {

  baseResourceUrl: string;
  claimsList: any[]; 

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http) {
  
   // this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
   this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claim_report?api_key=' + constants.DREAMFACTORY_API_KEY;
  this.BindData();
  }

  BindData()
  {
    this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.claimsList= data["resource"];
    });
    //console.table(this.claimsList);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimReportPage');
  }

  

}
