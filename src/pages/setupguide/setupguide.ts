import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the SetupguidePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setupguide',
  templateUrl: 'setupguide.html',
})
export class SetupguidePage {
  Branchform: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,fb: FormBuilder) {

    this.Branchform = fb.group({

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupguidePage');
  }

}
