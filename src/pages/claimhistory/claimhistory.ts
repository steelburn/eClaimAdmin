import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


// import { Observable } from 'rxjs/Observable';
// import { Subject }    from 'rxjs/Subject';
// import { of }         from 'rxjs/observable/of';

// import {
//    debounceTime, distinctUntilChanged, switchMap
//  } from 'rxjs/operators';
// import { Response } from '@angular/http/src/static_response';


/**
 * Generated class for the ClaimhistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimhistory',
  templateUrl: 'claimhistory.html'
})
export class ClaimhistoryPage {

  role: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.role = "Validation";
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistoryPage');
  }
}
