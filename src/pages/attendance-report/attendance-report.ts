import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
/**
 * Generated class for the AttendanceReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance-report',
  templateUrl: 'attendance-report.html',
})
export class AttendanceReportPage {
  attendanceData: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();
  employeeList: any[];
  page: number = 1;
  loginUserGuid: string;
  btnSearch: boolean = false;
  blnUserDisplay_All: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    this.BindYears();
    this.BindEmployees();

    if (localStorage.getItem("g_ROLE_NAME") == "Finance Executive" || localStorage.getItem("g_ROLE_NAME") == "Finance Admin" || localStorage.getItem("g_ROLE_NAME") == "Finance Manager") {
      this.blnUserDisplay_All = true;
    }
    else {
      this.blnUserDisplay_All = false;
    }
    this.BindData("All", "All");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendanceReportPage');
  }

  BindData(ddlUserName: string, ddlmonth: string) {
    this.btnSearch = false;
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_attendance_data?filter=(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.attendanceData = data["resource"];

        if (this.attendanceData.length != 0) {
          if (!this.blnUserDisplay_All)
            ddlUserName = this.loginUserGuid;
          if (ddlmonth.toString() !== "All") { this.attendanceData = this.attendanceData.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
          if (ddlUserName.toString() !== "All" || !this.blnUserDisplay_All) { this.attendanceData = this.attendanceData.filter(s => s.USER_GUID.toString() === ddlUserName.toString()) }
        }
        this.btnSearch = true;
      });
  }

  BindEmployees() {
    // this.http
    //   .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     this.employeeList = data["resource"];
    //   });
    let url: string = "";
    if (localStorage.getItem("g_ROLE_NAME") == "Finance Executive" || localStorage.getItem("g_ROLE_NAME") == "Finance Admin" || localStorage.getItem("g_ROLE_NAME") == "Finance Manager") {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    else {
      url = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?filter=USER_GUID=' + localStorage.getItem("g_USER_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
      });
  }

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }

}
