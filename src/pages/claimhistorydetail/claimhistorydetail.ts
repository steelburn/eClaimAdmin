import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

/**
 * Generated class for the ClaimhistorydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimhistorydetail',
  templateUrl: 'claimhistorydetail.html', providers: [BaseHttpService]
})
export class ClaimhistorydetailPage {
  claimhistorydetails: any[]; 
  userdetails: any; 
  claimrefguid:any;
  userguid:any;
  month:any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService) {
   this.claimrefguid=navParams.get("claimRefGuid");
   this.userguid=navParams.get("userGuid");
   this.month=navParams.get("Month");
   //alert(this.userguid);
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID='+this.userguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //console.log(this.baseResourceUrl);
    this.BindData();
    this.getuserDetails();
  }

  getuserDetails(){
    this.http
    .get(this.baseResourceUrl1)
    .map(res => res.json())
    .subscribe(data => {
      //alert(JSON.stringify(data));
      this.userdetails= data["resource"];
      //alert(this.userdetails);
    });
  };
  BindData()
  {
    this.http
    .get(this.baseResourceUrl)
    .map(res => res.json())
    .subscribe(data => {
      this.claimhistorydetails= data["resource"];
    });
  }
  onSearchInput(ev: any) {  
    // alert('hi')
          let val = ev.target.value;
          if (val && val.trim() != '') {
           this.claimhistorydetails = this.claimhistorydetails.filter((item) => {
        let claimtype:number;
        let status:number;
        let stage:number;
        let amount:number;
             console.log(item);
             if(item.CLAIM_TYPE!=null)
             {claimtype=item.CLAIM_TYPE.toLowerCase().indexOf(val.toLowerCase())}
             if(item.STATUS!=null)
             {status=item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase())}
             if(item.STAGE!=null)
             {stage=item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase())}
             if(item.CLAIM_AMOUNT!=null)
             {amount=item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
             return (
               (claimtype > -1) 
             || (status > -1) 
             || ( stage> -1)
             || (amount> -1) 
           );
           })
         }
         else
         {
           this.BindData();
         }
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistorydetailPage');
  }

}
