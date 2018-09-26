import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
/**
 * Generated class for the LeaveReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leave-report',
  templateUrl: 'leave-report.html',
})
export class LeaveReportPage {
  leaveData: any[];
  currentYear:number=new Date().getFullYear();
  employeeList:any[];
  yearsList:any[]=[];
 page: number = 1;
 btnSearch:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http) {
    this.BindYears();
    this.BindEmployees();
    this.BindData("All","All","All");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveReportPage');
  }

  BindData(ddlUserName:string ,ddlLeaveType:string,ddlmonth:string) {
   
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_leave_data?filter=(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.leaveData = data["resource"];      
       
        if (this.leaveData.length != 0) {
          if (ddlmonth.toString() !== "All") { this.leaveData = this.leaveData.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
          if (ddlLeaveType.toString() !== "All") { 
            this.leaveData = this.leaveData.filter(s => s.LEAVE_TYPE.toString()===ddlLeaveType.toString())
           }
          if (ddlUserName.toString() !== "All") { this.leaveData = this.leaveData.filter(s => s.STAFF_ID.toString() === ddlUserName.toString()) }
    
        }   
        this.btnSearch=true;     
      });
     
  }

  BindEmployees() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList = data["resource"];
      });
  }
  BindYears() {
    for (let i = 2013; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }
}
