import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';

/**
 * Generated class for the ClaimhistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimhistory',
  templateUrl: 'claimhistory.html', providers: [BaseHttpService]
})
export class ClaimhistoryPage {
  claimhistorys: any;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory' + '?api_key=' + constants.DREAMFACTORY_API_KEY;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorys = data.resource;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistoryPage');
  }

}
