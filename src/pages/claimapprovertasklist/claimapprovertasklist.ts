import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';

/**
 * Generated class for the ClaimapprovertasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimapprovertasklist',
  templateUrl: 'claimapprovertasklist.html', providers: [BaseHttpService]
})
export class ClaimapprovertasklistPage {

  baseResourceUrl: string;
  claimrequestdetails:any[];
 selectAll:boolean;
 claimrefguid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService) {
    
    this.claimrefguid=navParams.get("claimRefGuid");
   // alert(this.claimrefguid);
    if(this.claimrefguid!='null'){
    this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else{
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimrequestlist?filter=(ASSIGNED_TO='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData();
  }
BindData()
{
  this.http
  .get(this.baseResourceUrl)
  .map(res => res.json())
  .subscribe(data => {
    this.claimrequestdetails= data["resource"];
  });
  //console.table(this.claimrequestdetails);
}

onSearchInput(ev: any) {  
  // alert('hi')
        let val = ev.target.value;
        if (val && val.trim() != '') {
         this.claimrequestdetails = this.claimrequestdetails.filter((item) => {
          let fullname:number;
          let claimtype:number;
      let status:number;
      let stage:number;
      let amount:number;
           //console.log(item);
           if(item.FULLNAME!=null)
           {fullname=item.FULLNAME.toLowerCase().indexOf(val.toLowerCase())}
           if(item.CLAIMTYPE!=null)
           {claimtype=item.CLAIMTYPE.toLowerCase().indexOf(val.toLowerCase())}
           if(item.STATUS!=null)
           {status=item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase())}
           if(item.STAGE!=null)
           {stage=item.STAGE.toString().toLowerCase().indexOf(val.toLowerCase())}
           if(item.CLAIM_AMOUNT!=null)
           {amount=item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
           return (
            (fullname > -1) 
           ||(claimtype > -1) 
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


checkAllCheckBoxes(event:Checkbox){
if(event.checked)
{this.selectAll=true;}
else{
  this.selectAll=false;
}
}

  getCheckboxValue(event:Checkbox,claimRequestGuid:any){
    // console.log(event);
    // alert(event.id);
    // alert(event.checked);
    // alert(claimRequestGuid);
  }

  approveClaims(){
//console.table(this.claimrequestdetails);

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimapprovertasklistPage');
  }

}
