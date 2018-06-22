import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage { 
  username: string;
  Userform: FormGroup;

  constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData, fb: FormBuilder) {
    this.Userform = fb.group({
      // -------------------PERSONAL DETAILS--------------------
      avatar1: null,
      avatar2: null,
      avatar3: null,

      NAME: [null, Validators.required],
      EMAIL: [null, Validators.compose([Validators.pattern('^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'), Validators.required])],
      LOGIN_ID: [null],
      PASSWORD: [null],
      CONTACT_NO: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      COMPANY_CONTACT_NO: [null],
      MARITAL_STATUS: ['', Validators.required],
      PERSONAL_ID_TYPE: [null],
      PERSONAL_ID: [null],
      DOB: [null],
      GENDER: [null, Validators.required],

      // -------------------EMPLOYMENT DETAILS--------------------
      DESIGNATION_GUID: [null, Validators.required],
      TENANT_COMPANY_GUID: [null, Validators.required],
      DEPT_GUID: [null, Validators.required],
      JOIN_DATE: [null, Validators.required],
      CONFIRMATION_DATE: [null],
      RESIGNATION_DATE: [],
      BRANCH: [null, Validators.required],
      EMPLOYEE_TYPE: [null, Validators.required],
      APPROVER1: [null, Validators.required],
      // APPROVER2: ['', Validators.required],
      EMPLOYEE_STATUS: [null, Validators.required],

      // -------------------EDUCATIONAL QUALIFICATION--------------------
      HIGHEST_QUALIFICATION: [null, Validators.required],
      UNIVERSITY: [null],
      MAJOR: [null],
      EDU_YEAR: [null],

      // -------------------PROFESSIONAL CERTIFICATIONS--------------------
      CERTIFICATION: [null],
      CERTIFICATION_YEAR: [null],
      CERTIFICATION_GRADE: [null],
      ATTACHMENT_PROFESSIONAL: [null],

      // -------------------RESIDENTIAL ADDRESS----------------------------
      USER_ADDRESS1: [null, Validators.required],
      USER_ADDRESS2: [null],
      USER_ADDRESS3: [null],
      USER_POSTCODE: ['', Validators.required],
      USER_COUNTRY: ['', Validators.required],
      USER_STATE: ['', Validators.required],

      // -------------------FAMILY DETAILS----------------------------------
      //--------For Spouse----------
      SPOUSENAME: [null],
      SPOUSE_ICNUMBER: [null],
      //--------For Child----------
      CHILDNAME: [null],
      CHILD_ICNUMBER: [null],
      CHILD_GENDER: [null],
      SPOUSE_CHILD: [null],

      // -------------------EMERGENCY CONTACT DETAILS------------------------
      EMG_CONTACT_NAME1: [null, Validators.required],
      EMG_RELATIONSHIP: [null, Validators.required],
      EMG_CONTACT_NO1: [null, Validators.compose([Validators.pattern('^[0-9!@#%$&()-`.+,/\"\\s]+$'), Validators.required])],
      EMG_CONTACT_NAME2: [null],
      EMG_RELATIONSHIP2: [null],
      EMG_CONTACT_NO2: [null],

      // -------------------PAYROLL DETAILS------------------------
      EPF_NUMBER: [null],
      INCOMETAX_NO: [null],
      BANK_NAME: ['', Validators.required],
      ACCOUNT_NUMBER: [null, Validators.required],

      //-------------------ROLE DETAILS---------------------------
      ROLE_NAME: [null],
    });
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

}
