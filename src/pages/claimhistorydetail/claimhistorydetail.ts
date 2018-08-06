import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
import { ExcelService } from '../../providers/excel.service';

/**
 * Generated class for the ClaimhistorydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claimhistorydetail',
  templateUrl: 'claimhistorydetail.html', providers: [BaseHttpService, ExcelService]
})
export class ClaimhistorydetailPage {
  claimhistorydetails: any[];
  claimhistorydetails1: any[];
  userdetails: any;
  claimrefguid: any;
  userguid: any;
  month: any;
  baseResourceUrl: string;
  baseResourceUrl1: string;
  searchboxValue: string;
  FinanceLogin: boolean = false;
  loginUserRole: string;
  public page: number = 1;

  deptList: any[];
  employeeList: any[] = [];
  employeeList1: any[] = [];
  claimTypeList: any[];
  yearsList: any[] = [];
  currentYear: number = new Date().getFullYear();

  constructor(private excelService: ExcelService, public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.claimrefguid = navParams.get("claimRefGuid");
    this.userguid = navParams.get("userGuid");
    this.month = navParams.get("Month");
    this.loginUserRole = localStorage.getItem("g_ROLE_NAME");
    // let ddlDept:any;
    //     alert(ddlDept.value)
    //alert(this.userguid);
    //this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID='+this.claimrefguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    //console.log(this.baseResourceUrl);

    //this.loginUserGuid = localStorage.getItem("g_USER_GUID");
    // this.claimrefguid = navParams.get("claimRefGuid");
    // alert(this.claimrefguid);

    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      this.FinanceLogin = true;
      if (this.loginUserRole === "Finance Admin") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }

    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)AND(YEAR=' + this.currentYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindDepartment();
    this.BindEmployeesbyDepartment("All");
    this.BindClaimTypes();
    this.BindYears();
    this.BindData("All", "All", "All", "All", "All");
    if (this.FinanceLogin) {
      this.baseResourceUrl1 = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_getuserdetails?filter=(USER_GUID=' + this.userguid + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      this.getuserDetails();
    }

    this.excelService = excelService;
  }

  getuserDetails() {
    this.http
      .get(this.baseResourceUrl1)
      .map(res => res.json())
      .subscribe(data => {
        this.userdetails = data["resource"];
      });
  };

  ExcelData: any[] = [];
  BindData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlClaimTypes: string, ddlStatus: string) {
    this.http
      .get(this.baseResourceUrl)
      .map(res => res.json())
      .subscribe(data => {
        this.claimhistorydetails = data["resource"];
        if (this.claimhistorydetails.length != 0 && this.loginUserRole === "Finance Admin") {
          this.claimhistorydetails.forEach(element => {
            element.TRAVEL_DATE = new Date(element.TRAVEL_DATE.replace(/-/g, "/"))
            if (element.STATUS.toString() === "Approved" && element.PROFILE_LEVEL.toString() === "3") { element.STATUS = "Paid"; }
          });
        }
        this.claimhistorydetails1 = this.claimhistorydetails;
        if (this.claimhistorydetails.length != 0) {
          if (ddlDept.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.DEPARTMENT_GUID.toString() === ddlDept.toString()) }
          if (ddlEmployee.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.USER_GUID.toString() === ddlEmployee.toString()) }
          if (ddlmonth.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.MONTH.toString() === ddlmonth.toString()) }
          if (ddlClaimTypes.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.CLAIM_TYPE_GUID.toString() === ddlClaimTypes.toString()) }
          if (ddlStatus.toString() !== "All") { this.claimhistorydetails = this.claimhistorydetails.filter(s => s.STATUS.toString() === ddlStatus.toString()) }

        }
        // for (var item in data["resource"]) {
        //   this.ExcelData.push({ Name: data["resource"][item]["FULLNAME"], Department: data["resource"][item]["DEPARTMENT"], Month: data["resource"][item]["MONTH"], ClaimType: data["resource"][item]["CLAIM_TYPE"], Date: data["resource"][item]["TRAVEL_DATE"], Status: data["resource"][item]["STATUS"], Amount: data["resource"][item]["CLAIM_AMOUNT"] });
        // }
      });
  }
  onSearchInput() {
    // alert('hi')
    let val = this.searchboxValue;
    if (val && val.trim() != '') {
      this.claimhistorydetails = this.claimhistorydetails1.filter((item) => {
        let claimtype: number;
        let status: number;
        let amount: number;
        let date: number;

        if (item.CLAIM_TYPE != null) { claimtype = item.CLAIM_TYPE.toLowerCase().indexOf(val.toLowerCase()) }
        if (item.TRAVEL_DATE != null) { date = item.TRAVEL_DATE.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.STATUS != null) { status = item.STATUS.toString().toLowerCase().indexOf(val.toLowerCase()) }
        if (item.CLAIM_AMOUNT != null) { amount = item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) }
        return (
          (claimtype > -1)
          || (date > -1)
          || (status > -1)
          || (amount > -1)
        );
      })
    }
    else {
      this.claimhistorydetails = this.claimhistorydetails1;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistorydetailPage');
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
    this.http
      .get(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/view_user_display_new?api_key=' + constants.DREAMFACTORY_API_KEY)
      .map(res => res.json())
      .subscribe(data => {
        this.employeeList1 = data["resource"];
        this.employeeList = this.employeeList1;
        if (dept !== "All") {
          this.employeeList = this.employeeList1.filter(s => s.DEPT_GUID.toString() === dept.toString());
        }
      });

  }

  SearchClaimsData(ddlDept: string, ddlEmployee: string, ddlmonth: string, ddlClaimTypes: string, ddlStatus: string, ddlYear: number) {
    if (this.claimrefguid !== null && this.claimrefguid !== undefined) {
      if (this.loginUserRole === "Finance Admin") {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=3)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }
      else {
        this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(CLAIM_REF_GUID=' + this.claimrefguid + ')AND(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=2)&api_key=' + constants.DREAMFACTORY_API_KEY;
      }

    }
    else {
      this.baseResourceUrl = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistorydetail?filter=(APPROVER=' + localStorage.getItem("g_USER_GUID") + ')AND(PROFILE_LEVEL=1)AND(YEAR=' + ddlYear + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    }
    this.BindData(ddlDept, ddlEmployee, ddlmonth, ddlClaimTypes, ddlStatus);

  }

  ExportExcelClicked: boolean = false; ExcelColumns: any[] = [];
  ExportToExcel() {
    // this.excelService.exportAsExcelFile(this.claimhistorydetails,'Data');
    // this.excelService.exportAsExcelFile(this.ExcelData, 'Data');

    this.ExportExcelClicked = true;
    this.ExcelColumns = [];
    this.ExcelColumns.push({ Columns: 'Name' });
    this.ExcelColumns.push({ Columns: 'Department' });
    this.ExcelColumns.push({ Columns: 'Month' });
    this.ExcelColumns.push({ Columns: 'ClaimType' });
    this.ExcelColumns.push({ Columns: 'Date' });
    this.ExcelColumns.push({ Columns: 'Status' });
    this.ExcelColumns.push({ Columns: 'Amount' });
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
      for (var item in this.claimhistorydetails) {
        if (this.checked.length > 0) {
          let ctr: number = 0;
          let jsonStr = '';
          for (var chkItem in this.checked) {
            ctr = ctr + 1;
            switch (this.checked[chkItem]["Columns"]) {
              case "Name":
                if (this.checked.length == 1) {
                  jsonStr += '{"Name":"' + this.claimhistorydetails[item]["FULLNAME"] + '"';
                }
                else {
                  jsonStr += '{"Name":"' + this.claimhistorydetails[item]["FULLNAME"] + '",';
                }
                break;
              case "Department":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '"';
                  }
                  else {
                    jsonStr += '"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '"';
                  }
                  else {
                    jsonStr += '{"Department":"' + this.claimhistorydetails[item]["DEPARTMENT"] + '",';
                  }
                }
                break;
              case "Month":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Month":"' + this.claimhistorydetails[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '"Month":"' + this.claimhistorydetails[item]["MONTH"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Month":"' + this.claimhistorydetails[item]["MONTH"] + '"';
                  }
                  else {
                    jsonStr += '{"Month":"' + this.claimhistorydetails[item]["MONTH"] + '",';
                  }
                }
                break;
              case "ClaimType":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '"';
                  }
                  else {
                    jsonStr += '{"ClaimType":"' + this.claimhistorydetails[item]["CLAIM_TYPE"] + '",';
                  }
                }
                break;
              case "Date":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '"';
                  }
                  else {
                    jsonStr += '{"Date":"' + this.claimhistorydetails[item]["TRAVEL_DATE"] + '",';
                  }
                }
                break;
              case "Status":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Status":"' + this.claimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '"Status":"' + this.claimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Status":"' + this.claimhistorydetails[item]["STATUS"] + '"';
                  }
                  else {
                    jsonStr += '{"Status":"' + this.claimhistorydetails[item]["STATUS"] + '",';
                  }
                }
                break;
              case "Amount":
                if (jsonStr.length > 0) {
                  if (ctr == this.checked.length) {
                    jsonStr += '"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
                  }
                }
                else {
                  if (this.checked.length == 1) {
                    jsonStr += '{"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '"';
                  }
                  else {
                    jsonStr += '{"Amount":"' + this.claimhistorydetails[item]["CLAIM_AMOUNT"] + '",';
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
