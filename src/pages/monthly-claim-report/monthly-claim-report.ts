import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';

import { ExcelService } from '../../providers/excel.service';
import * as Settings from '../../dbSettings/companySettings'


/**
 * Generated class for the MonthlyClaimReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-monthly-claim-report',
  templateUrl: 'monthly-claim-report.html', providers: [ExcelService]
})
export class MonthlyClaimReportPage {
  //ClaimHistory_Model = new ClaimHistory_Model();
  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  claimTypeList: any[];
  yearsList: any[] = [];

  claimList: any[] = [];
  claimList1: any[] = [];
  claimListTotal: any[];
  currency = localStorage.getItem("cs_default_currency")

  deptAll: boolean = true;
  empAll: boolean = true;
  claimAll: boolean = true;
  monthAll: boolean = true;
  grandTotal: number = 0;
  currentYear: number = new Date().getFullYear();
  prevYear: number = new Date().getFullYear();
  public page: number = 1;
  btnSearch:boolean = false;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?filter=(ASSIGNED_TO='+localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimreftasklist?api_key=' + constants.DREAMFACTORY_API_KEY;
  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_monthly_claim_report?filter=(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;

  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindClaimTypes();
    this.BindYears();
    this.BindData();

    this.excelService = excelService;
  }

  BindDepartment() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_department?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.deptList = data["resource"];
      });
    //console.log(this.deptList);
  }


  BindEmployeesbyDepartment(dept: string) {
    //alert(dept);
    if (dept !== null) {
      let deptAr = dept.toString().split(",");

      this.http
        .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
        .map(res => res.json())
        .subscribe(data => {
          this.employeeList1 = data["resource"];
          this.employeeList = this.employeeList1;
        });
      if (deptAr[0] !== "All" || deptAr.length > 1) {
        for (let i = 0; i < dept.length; i++) {
          if (i === 0)
            this.employeeList = this.employeeList1.filter(s => s.DEPT_GUID.toString() === dept[i].toString());
          else
            this.employeeList = this.employeeList.concat(this.employeeList1.filter(s => s.DEPT_GUID.toString() === dept[i].toString()));
        }
        this.empAll = false;
      }

    }
    else
      this.employeeList = [];
  }

  EmpChange(emp: any) {
    let empAr = emp.toString().split(",");
    if (empAr[0] !== "All" || emp.length > 0)
      this.empAll = false;
  }

  MonthChange(month: any) {
    // debugger;
    let monthAr = month.toString().split(",");
    if (monthAr[0] !== "All" || month.length > 0)
      this.monthAll = false;
  }

  ClaimChange(claim: any) {
    let claimAr = claim.toString().split(",");
    if (claimAr[0] === "All" || claim.length === 0)
      this.claimAll = true;
  }

  BindClaimTypes() {
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/main_claim_type?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.claimTypeList = data["resource"];
      });
  }

  BindYears() {
    for (let i = 2016; i <= new Date().getFullYear(); i++) {
      this.yearsList.push(i);
    }
  }

  ExcelData: any[] = [];
  BindData() {
    this.grandTotal = 0;
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimListTotal = data["resource"];
        this.claimList = this.claimListTotal;

        // for (var item in data["resource"]) {
        //   this.ExcelData.push({ Employee: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPT"], Month: data["resource"][item]["MONTH"], ClaimType : data["resource"][item]["CLAIM_TYPE"], Status: data["resource"][item]["STATUS"], TotalAmount: data["resource"][item]["AMOUNT"] });
        // }

        // if(status!==null && this.claimList.length !== 0)
        // {this.claimList = this.claimList.filter(s => s.STATUS.toString() === status.toString());}
        if (this.claimList.length !== 0) {
          this.claimList.forEach(element => {
            this.grandTotal = this.grandTotal + element.AMOUNT;

          //   if (element.PROFILE_LEVEL == Settings.ProfileLevels.TWO && element.STATUS == Settings.StatusConstants.PENDING)
          //   element.STATUS = Settings.StatusConstants.APPROVED
          // else if (element.PROFILE_LEVEL == Settings.ProfileLevels.THREE && element.STATUS == Settings.StatusConstants.APPROVED)
          //   element.STATUS = Settings.StatusConstants.VALIDATED
          });
        }
        else    { 
          this.grandTotal = 0;    
        }            
          this.btnSearch=true;
      });
      
  }

  SearchClaimsData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlClaimTypes: string, ddlStatus: string, ddlYear: number) {
    this.btnSearch=false;
    this.grandTotal = 0;
    if (this.prevYear !== ddlYear) {
      this.BindData();
      this.prevYear = ddlYear;
      
    }
    else { this.claimList = this.claimListTotal; }
    // debugger

    //alert(ddlDept);

    //console.log(this.claimList);
    let deptArry = ddlDept.toString().split(",");
    let empArry: any[] = ddlEmployee.toString().split(",");
    let monthArry: any[] = ddlmonth.toString().split(",");
    let claimsArry: any[] = ddlClaimTypes.toString().split(",");
    let statusArry: any[] = ddlStatus.toString().split(",");
    //this.BindData();
    //this.claimList = [];
    if (deptArry[0] !== "All") {
      for (let i = 0; i < deptArry.length; i++) {
        if (i === 0)
          this.claimList = this.claimListTotal.filter(s => s.DEPT_GUID.toString() === deptArry[i].toString());
        else
          this.claimList = this.claimList.concat(this.claimListTotal.filter(s => s.DEPT_GUID.toString() === deptArry[i].toString()));

      }
    }
    if (empArry[0] !== "All") {
      for (let i = 0; i < empArry.length; i++) {
        if (i === 0)
          this.claimList = this.claimListTotal.filter(s => s.USER_GUID.toString() === empArry[i].toString());
        else
          this.claimList = this.claimList.concat(this.claimListTotal.filter(s => s.USER_GUID.toString() === empArry[i].toString()));

      }
    }
    if (monthArry[0] !== "All") {
      for (let i = 0; i < monthArry.length; i++) {
        if (i === 0)
          this.claimList1 = this.claimList.filter(s => s.MONTH.toString() === monthArry[i].toString());
        else
          this.claimList1 = this.claimList1.concat(this.claimList.filter(s => s.MONTH.toString() === monthArry[i].toString()));

      }
      this.claimList = this.claimList1;
    }

    if (claimsArry[0] !== "All") {
      for (let i = 0; i < claimsArry.length; i++) {
        if (i === 0)
          this.claimList1 = this.claimList.filter(s => s.CLAIM_TYPE_GUID.toString() === claimsArry[i].toString());
        else
          this.claimList1 = this.claimList1.concat(this.claimList.filter(s => s.CLAIM_TYPE_GUID.toString() === claimsArry[i].toString()));

      }
      this.claimList = this.claimList1;
    }
    //this.claimList=this.claimList.filter(s => s.STATUS.toString() === ddlStatus.toString());
    if (statusArry[0] !== "All") {
      for (let i = 0; i < statusArry.length; i++) {
        if (i === 0)
          this.claimList1 = this.claimList.filter(s => s.STATUS.toString() === statusArry[i].toString());
        else
          this.claimList1 = this.claimList1.concat(this.claimList.filter(s => s.STATUS.toString() === statusArry[i].toString()));

      }
      this.claimList = this.claimList1;
    }

    if (this.claimList.length !== 0) {
      // this.claimList = this.claimList.filter(s => s.STATUS.toString() === ddlStatus.toString());
      this.claimList.forEach(element => {
        this.grandTotal = this.grandTotal + element.AMOUNT;
      });
    }
    else
      this.grandTotal = 0;
    // this.claimList = this.claimList.concat(this.claimListTotal.filter(s => s.DEPT_GUID === deptArry[0]));
    // this.claimList = this.claimList.concat(this.claimListTotal.filter(s => s.DEPT_GUID === deptArry[1]));
    //this.claimList.push(this.claimListTotal.filter(s=>s.DEPT_GUID===ddlEmployee[0]));
    
    this.btnSearch=true;
  }

  printToCart(printSectionId: any) {
    //document.getElementById(printSectionId).hidden = false;
    var innerContents = document.getElementById(printSectionId).innerHTML;
    var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
    popupWinindow.document.close();
    //document.getElementById(printSectionId).hidden = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MonthlyClaimReportPage');
  }

  // ExportToExcel() {
  //   // this.excelService.exportAsExcelFile(this.claimListTotal,'Data');
  //   this.excelService.exportAsExcelFile(this.ExcelData,'Data');
  // }

  ExportExcelClicked: boolean = false; ExcelColumns: any[] = [];
  ExportToExcel() {
    this.ExportExcelClicked = true;
    this.ExcelColumns = [];
    this.ExcelColumns.push({ Columns: 'Employee' });
    this.ExcelColumns.push({ Columns: 'Department' });
    this.ExcelColumns.push({ Columns: 'Month' });
    this.ExcelColumns.push({ Columns: 'ClaimType' });
    this.ExcelColumns.push({ Columns: 'Status' });
    this.ExcelColumns.push({ Columns: 'TotalAmount' });
  }

  CloseExportExcel() {
    this.ExportExcelClicked = false;
    this.checked.length = 0;
  }

  checked: any[] = [];
  SelectColumn(e: any, SelectedColumn: any) {
    if (e.checked == true) {
      this.checked.push(SelectedColumn);
    } else {
      let index = this.RemoveCheckedFromArray(SelectedColumn);
      this.checked.splice(index, 1);
    }
  }

  RemoveCheckedFromArray(checkbox: String) {
    return this.checked.findIndex((category) => {
      return category === checkbox;
    })
  }

  SubmitExportExcel() {
    this.ExcelData = [];
    if (this.checked.length > 0) {
      for (var item in this.claimList) {
        if (this.checked.length > 0) {
          let ctr: number = 0;
          let jsonStr = '';
          for (var chkItem in this.checked) {
            ctr = ctr + 1;
            switch (this.checked[chkItem]["Columns"]) {
              case "Employee":
                if (this.checked.length == 1) {
                  jsonStr += '{"Employee":"' + this.claimList[item]["FULLNAME"] + '"';
                }
                else {
                  jsonStr += '{"Employee":"' + this.claimList[item]["FULLNAME"] + '",';
                }
                break;
              case "Department":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Department":"' + this.claimList[item]["DEPT"] + '"';
                  }
                  else {
                    jsonStr += '"Department":"' + this.claimList[item]["DEPT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Department":"' + this.claimList[item]["DEPT"] + '"';
                  }
                  else {
                    jsonStr += '{"Department":"' + this.claimList[item]["DEPT"] + '",';
                  }
                }
                break;
              case "Month":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Month":"' + this.claimList[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '"Month":"' + this.claimList[item]["MONTH"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Month":"' + this.claimList[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '{"Month":"' + this.claimList[item]["MONTH"] + '",';
                  }
                }
                break;
              case "ClaimType":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"ClaimType":"' + this.claimList[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '"ClaimType":"' + this.claimList[item]["CLAIM_TYPE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"ClaimType":"' + this.claimList[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '{"ClaimType":"' + this.claimList[item]["CLAIM_TYPE"] + '",';
                  }
                }
                break;
              case "Status":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Status":"' + this.claimList[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '"Status":"' + this.claimList[item]["STATUS"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Status":"' + this.claimList[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '{"Status":"' + this.claimList[item]["STATUS"] + '",';
                  }
                }
                break;
              case "TotalAmount":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"TotalAmount":"' + this.claimList[item]["AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"TotalAmount":"' + this.claimList[item]["AMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"TotalAmount":"' + this.claimList[item]["AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"TotalAmount":"' + this.claimList[item]["AMOUNT"] + '",';
                  }
                }
                break;
            }
            if (ctr == this.checked.length) {
              jsonStr += '}';
            }
          }
          this.ExcelData.push(JSON.parse(jsonStr));
        }
      }
      this.excelService.exportAsExcelFile(this.ExcelData, 'Data');
    }
    else {
      alert('Please select one item.');
    }
  }

}
