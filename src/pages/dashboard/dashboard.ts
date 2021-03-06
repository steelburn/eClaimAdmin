import { DashboardCards } from './../../interfaces/dashboard-card';
import { sanitizeURL, getURL } from './../../providers/sanitizer/sanitizer';
import { IonicPage, NavController, NavParams, Loading, Config, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import 'chart.piecelabel.js';
import 'rxjs/add/operator/map';
import * as constants from '../../app/config/constants';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DecimalPipe } from "@angular/common";
import * as Settings from '../../dbSettings/companySettings';
import { toCurrency } from '../../providers/currency/currency';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html', providers: [DecimalPipe]
})
export class DashboardPage {

  dashboardCards: DashboardCards[];
  
  baseResourceUrl: string;
  baseResourceUrl_New: string;
  claimrequestdetails: any; paid_details: any;
  Month_Change_ngModel: any;
  Year_Change_ngModel: any;
  month_value: any;
  year_value: any;
  CurrentMonthNumber: any;
  DashboardForm: FormGroup;
  years: any; years_data: any;
  Rejected_Claim_Count = 0; Rejected_Claim_Amount = '0.00';
  Pending_Claim_Count = 0; Pending_Claim_Amount = '0.00';

  Pending_Claim_Count_Superior = 0; Pending_Claim_Amount_Superior = '0.00';
  Pending_Claim_Count_Finance = 0; Pending_Claim_Amount_Finance = '0.00';


  PendingClaimCount_year_Superior: any; PendingClaimAmount_year_Superior: any;
  PendingClaimCount_year_Finance: any; PendingClaimAmount_year_Finance: any;
  currency = localStorage.getItem("cs_default_currency")

  Approved_Claim_Count = 0; Approved_Claim_Amount = '0.00';
  baseResourceUrl_Card: any; Year_Card: any;
  RejectedClaimCount_year: any; PendingClaimCount_year: any; ApprovedClaimCount_year: any;
  PaidClaimCount_year: any;
  PaidReqCount = 0;
  PendingClaimAmount_year: any; RejectedClaimAmount_year: any; ApprovedClaimAmount_year: any;
  PaidClaimAmount = '0.00';
  PaidClaimAmount_year: any;
  loading: Loading;

  // Role Based Dashboard Details
  // i:any;
  loginUserRole = localStorage.getItem("g_ROLE_NAME");

  role_name: any;
  yeardata: any[] = [];
  MONTH: any; YEAR: any;
  chart1: boolean = false;
  chart2: boolean = false;
  IsApprover: boolean = false;
  IsFinanceExecutive: boolean = false;
  IsFinanceManager: boolean = false;
  baseResource_RoleUrl: string;
  roleBasedData: any;

  ApproverLevel_PendAmount: any; ApproverLevel_PendAmount_Year: any;
  ApproverLevel_PendCount: any; ApproverLevel_PendCount_Year: any;

  FinanceExecLevel_PendAmt: any; FinanceExecLevel_PendAmt_Year: any;
  FinanceExecLevel_PendCount: any; FinanceExecLevel_PendCount_Year: any;

  FinanceMgrLevel_PendAmt: any; FinanceMgrLevel_PendAmt_Year: any;
  FinanceMgrLevel_PendCount: any; FinanceMgrLevel_PendCount_Year: any;

  paid_month_model: any;

  Domain: any;

  constructor(
    public fb: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public config: Config) {
    this.DashboardForm = fb.group({
      'Month': [null, Validators.compose([Validators.required])],
      'Year': [null, Validators.compose([Validators.required])]
    })
    this.baseResourceUrl_New = getURL("table", "vw_dashboardchart", [`USER_GUID=${localStorage.getItem("g_USER_GUID")}`]);
    var current_date = new Date();
    this.month_value = current_date.getMonth();
    this.year_value = current_date.getFullYear();
    this.Month_Change_ngModel = this.month_value + 1;

    this.Month_Change_ngModel = this.monthNames(this.Month_Change_ngModel);

    // let Year_ngModel = this.monthNames(this.Month_Change_ngModel) + " " + this.year_value;   
    let Year_ngModel = this.Month_Change_ngModel + " " + this.year_value;
    this.Year_Change_ngModel = Year_ngModel;

    this.paid_month_model = this.monthNameToNum(this.Month_Change_ngModel);
    this.MONTH = this.Month_Change_ngModel;
    this.YEAR = this.year_value;

    this.Domain = localStorage.getItem("g_EMAIL").toString();
    if (this.Domain != null && this.Domain != undefined) {
      this.Domain = this.Domain.split('@')[1]
      // alert(this.Domain)
    }
    // this.GetRoleName();
    this.GetData_filter();
    this.GetDashboardInfo();
    this.GetInfoForCards();
    this.GetData_Years();
    // this.GetData_filter();
    this.GetRoleDashboard();
    this.GetRoleDashboard_Year();
    this.GetData_FeRole();
    this.GetData_FaRole();
    // this.GetData_FeRole_Year();
    let val = this.GetRoleName();
    val.then((res: any) => {
      res.forEach((e: any) => {
        this.setRole(e);
      });

    })

  }

   approvers: string[] = [
    Settings.UserRoleConstants.TEAM_LEAD,
    Settings.UserRoleConstants.DIVISION_HEAD,
    Settings.UserRoleConstants.HOD,
    Settings.UserRoleConstants.HR,
    Settings.UserRoleConstants.DESK_ADMIN,
    Settings.UserRoleConstants.FINANCE_MANAGER,
    Settings.UserRoleConstants.FINANCE_ADMIN
  ];
  financeExecs: string[] = [
    Settings.UserRoleConstants.FINANCE_EXECUTIVE
  ];
  financeManagers: string[] = [
    Settings.UserRoleConstants.FINANCE_MANAGER,
    Settings.UserRoleConstants.FINANCE_ADMIN
  ];

  setRole(roleName: any) {
    this.IsApprover = this.isRole(roleName["ROLE_NAME"], this.approvers);
    this.IsFinanceExecutive = this.isRole(roleName["ROLE_NAME"], this.financeExecs);
    this.IsFinanceManager = this.isRole(roleName["ROLE_NAME"], this.financeManagers);
  }

  isRole(roleName: string, roleArray: string[]) {
    return (roleArray.find( key => key == roleName )) ? true: false;
  }

  // Unique and Sort years
  sortUnique(arr: any) {
    arr.sort();
    var last_i;
    for (var i = 0; i < arr.length; i++)
      if ((last_i = arr.lastIndexOf(arr[i])) !== i)
        arr.splice(i + 1, last_i - i);
    return arr;
  }
  // Unique years
  deduplicate(data: any) {
    if (data.length > 0) {
      var result: any[] = [];
      data.forEach(function (elem: any) {
        if (result.indexOf(elem.YEAR) === -1) {
          result.push(elem.YEAR);
        }
      });
      return result;
    }
  }
  deduplicate_month(data: any) {
    if (data.length > 0) {
      var result: any[] = [];
      data.forEach(function (elem: any) {

        if (result.indexOf(elem.MONTH) === -1) {
          result.push(elem.MONTH);
          // if (result.indexOf(elem.YEAR) === -1) {
          //   result.push(elem.YEAR);            
          // }
        }
      });
      return result;
    }
  }

  GetRoleName() {
    //Get the role of that particular user----------------------------------------------
    let role_url: string = "";
    role_url = constants.DREAMFACTORY_TABLE_URL + "view_role_display?filter=(USER_GUID=" + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    return new Promise((resolve) => {
      this.http.get(sanitizeURL(role_url))
        .map(res => res.json())
        .subscribe((response: any) => {
          let role_result = response["resource"];
          // console.log(role_result);
          // this.role_name = role_result[0]["ROLE_NAME"];
          if (role_result != null) {
          }
          else {
            role_result = null;
          }
          resolve(role_result);
        })
    });
  }

  ngOnInit() {
    // register plugin    
    Chart.plugins.register({
      beforeDraw: function (chart: any) {
        if (chart.config.options.plugin_one_attribute === 'chart1') {
          // Plugin code here...    
          var data = chart.data.datasets[0].data;
          var sum = data.reduce(function (a: any, b: any) {
            var x = a + b;
            var y = parseFloat(x.toFixed(2));
            return y;
          }, 0);
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 18).toFixed(2);
          ctx.font = fontSize + "px Verdana";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "blue";
          ctx.fontStyle = "bold";
          if (sum != 0) {
            // var text = sum,
            var text = sum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
            // this.chart1 = true;
          }
          else {
            // this.chart1 = false;
            text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
          }
          ctx.fillText(text, textX, textY);
          ctx.save();
        }

        if (chart.config.options.plugin_one_attribute === 'chart2') {
          var data = chart.data.datasets[0].data;
          var sum = data.reduce(function (a: any, b: any) {
            var x = a + b;
            var y = parseFloat(x.toFixed(2));
            return y;
          }, 0);
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;
          ctx.restore();
          var fontSize = (height / 18).toFixed(2);
          ctx.font = fontSize + "px Verdana";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "blue";
          ctx.fontStyle = "bold";


          if (sum != 0) {
            // var text = sum,
            var text = sum.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
            // this.chart2 = true;
          }
          else {
            // this.chart2 = false;
            text = 'Data Not Available', textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;
          }
          ctx.fillText(text, textX, textY);
          ctx.save();
        }
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }
  //  ClaimsInfoChart
  // public doughnutChartLabels: Array<string> = ['Validated', 'Approved', 'Pending', 'Rejected', 'Paid'];
  public doughnutChartLabels: Array<string> = ['Pending Payment', 'Pending Finance Validation', 'Pending Superior', 'Rejected', 'Paid'];
  public doughnutChartData: Array<number> = [];

  public doughnutChartType: string = 'doughnut';
  public doughnutChartColors: any[] = [{ backgroundColor: ["#008000", "orange", "yellow", "red", "rgb(90, 165, 90)"] }];

  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  doughnutChartOptions = {
    // showInLegend : true,
    plugin_one_attribute: 'chart2',
    cutoutPercentage: 70,
    responsive: true,
    // centerText: true,
    // rotation: 0.75 * Math.PI, 
    // circumference: 1.5 * Math.PI, 
    // cutoutPercentage: 80,
    legend: {
      display: true,
      position: 'bottom'
    },
    title: {
      display: true,
      //  text: 'My Claim Count',
      fontSize: 20,
      fontColor: 'green'
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label + ' : ' + datasetLabel.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ';
        }
      }
    },
  }

  // ClaimAmountChart
  // public claimAmountLabels: Array<string> = ['Validated', 'Approved', 'Pending', 'Rejected', 'Paid'];
  public claimAmountLabels: Array<string> = ['Pending Payment', 'Pending Finance Validation', 'Pending Superior', 'Rejected', 'Paid'];
  public claimAmountData: Array<number> = [];
  public claimAmountChartType: string = 'doughnut';
  public claimAmountChartColors: any[] = [{ backgroundColor: ["#008000", "orange", "yellow", "red", "rgb(90, 165, 90)"] }];
  public claimAmountClicked(e: any): void {
    console.log(e);
  }
  public claimAmountHovered(e: any): void {
    console.log(e);
  }
  claimAmountOptions = {
    // showInLegend : true,
    plugin_one_attribute: 'chart1',
    cutoutPercentage: 70,
    responsive: true,
    // centerText: true,
    legend: {
      display: true,
      position: 'bottom'
    },
    title: {
      display: true,
      // text: 'My Claim Amount',
      fontSize: 20,
      fontColor: 'green'
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem: any, data: any) {
          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return label + ' : ' + datasetLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ';
        }
      }
    },
  }
  // Role Based Dashboard
  monthNames(monthNumber: any) {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthNumber - 1];

  }
  monthNameToNum(monthname: any) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var month = months.indexOf(monthname);
    // Returns Current Month 
    // return month ? month + 1 : 0;
    // Returns Previous Month 
    return month ? month : 0;
  }
  monthNameToNum_true(monthname: any) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var month = months.indexOf(monthname);
    // Returns Current Month 
    return month ? month + 1 : 0;
    // Returns Previous Month 
    // return month ? month : 0;
  }


  GetData_filter() {
    this.baseResource_RoleUrl = getURL("table","vw_dashboard_dw");
    this.http
      .get(sanitizeURL(this.baseResource_RoleUrl))
      .map(res => res.json())
      .subscribe(data => {
        this.years_data = data["resource"];

        if (this.years_data.length == 0) {
          this.yeardata = [{ MONTH: this.MONTH, YEAR: this.year_value }];
          this.Rejected_Claim_Count; this.Rejected_Claim_Amount;
          this.Pending_Claim_Count; this.Pending_Claim_Amount;
          this.Approved_Claim_Count; this.Approved_Claim_Amount;
        }
        else {
          let tempdata: any; tempdata = {
            MONTH_NUM: this.monthNameToNum_true(this.MONTH), MONTH: this.MONTH, YEAR: this.year_value, ApprovedClaimAmount: null, ApprovedReqCount: '0',
            CLAIM_REF_GUID: null, PendingClaimAmount: null, PendingReqCount: '0', RejectedClaimAmount: null, RejectedReqCount: null, USER_GUID: null
          };
          let item;
          this.years_data.some((i: any) => {
            if (i.MONTH === this.MONTH) {
              item = i;
              return true;
            }
            return false;
          });

          if (item) {
            this.yeardata = this.years_data;
            // console.log(this.yeardata)
          }
          else {
            this.years_data.unshift(tempdata);
            // console.log(this.yeardata)
          }
          this.years_data = this.years_data.filter((thing: any, index: any, self: any) =>
            index === self.findIndex((t: any) => (
              t.MONTH === thing.MONTH && t.YEAR === thing.YEAR
            ))
          )
          this.yeardata = this.years_data;
        }
      });
  }

  GetRoleDashboard() {
    this.baseResource_RoleUrl = constants.DREAMFACTORY_TABLE_URL + 'new_view_role_dashboard?filter=(ASSIGNED_TO =' + localStorage.getItem("g_USER_GUID") + ')and(MONTH=' + this.Month_Change_ngModel.substring(0, 3) + ')and(YEAR=' + this.year_value + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(sanitizeURL(this.baseResource_RoleUrl))
      .map(res => res.json())
      .subscribe(data => {
        this.roleBasedData = data["resource"][0];

        // console.log( this.roleBasedData.length);
        if (data["resource"][0] != null && data["resource"][0] != undefined) {
          this.ApproverLevel_PendAmount = toCurrency(this.roleBasedData.PendingAmount_Appr_Fe_Fm_FirstLevel, this.currency);
          if (this.ApproverLevel_PendAmount == null) {
            this.ApproverLevel_PendAmount = "0.00";
          }
          this.ApproverLevel_PendCount = this.roleBasedData.PendingCount_Appr_Fe_Fm_FirstLevel;
          if (this.ApproverLevel_PendCount == null) {
            this.ApproverLevel_PendCount = 0;
          }
        }
        else {
          this.ApproverLevel_PendAmount = "0.00";
          this.ApproverLevel_PendCount = 0;
        }
      });

  }
  GetRoleDashboard_Year() {
    this.baseResource_RoleUrl = constants.DREAMFACTORY_TABLE_URL + 'view_role_dashboard_year?filter=(ASSIGNED_TO =' + localStorage.getItem("g_USER_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    // console.log("Role_year " + this.baseResource_RoleUrl);
    this.http
      .get(sanitizeURL(this.baseResource_RoleUrl))
      .map(res => res.json())
      .subscribe(data => {
        this.roleBasedData = data["resource"][0];
        if (data["resource"][0] != null && data["resource"][0] != undefined) {
          this.ApproverLevel_PendAmount_Year = toCurrency(this.roleBasedData.PendingAmount_Appr_Fe_Fm_FirstLevel_Year, this.currency);
          this.ApproverLevel_PendCount_Year = this.roleBasedData.PendingCount_Appr_Fe_Fm_FirstLevel_Year;
          this.FinanceMgrLevel_PendAmt_Year = toCurrency(this.roleBasedData.PendingAmount_Fm_MgrLevel_Year, this.currency);
          this.FinanceMgrLevel_PendCount_Year = this.roleBasedData.PendingCount_Fm_MgrLevel_Year;
        }
        else {
          this.ApproverLevel_PendAmount_Year = "0.00";
          this.ApproverLevel_PendCount_Year = 0;
          this.FinanceMgrLevel_PendAmt_Year = "0.00";
          this.FinanceMgrLevel_PendCount_Year = 0;
        }
      });

  }

  GetData_FeRole() {
    let baseResource_Fe_RoleUrl = constants.DREAMFACTORY_TABLE_URL + 'new_view_dashboard_fe?filter=(MONTH=' + this.Month_Change_ngModel.substring(0, 3) + ')and(YEAR=' + this.year_value + ')and(EMAIL=' + this.Domain + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(sanitizeURL(baseResource_Fe_RoleUrl))
      .map(res => res.json())
      .subscribe(data => {
        let FeRoleData = data["resource"][0];
        if (data["resource"][0] != null && data["resource"][0] != undefined) {
          this.FinanceExecLevel_PendAmt = toCurrency(FeRoleData.PendingAmount_Fe_FinalLevel, this.currency);
          if (this.FinanceExecLevel_PendAmt == null) {
            this.FinanceExecLevel_PendAmt = "0.00";
          }
          this.FinanceExecLevel_PendCount = FeRoleData.PendingCount_Fe_FinalLevel;
          if (this.FinanceExecLevel_PendCount == null) {
            this.FinanceExecLevel_PendCount = 0;
          }


        }
        else {
          this.FinanceExecLevel_PendAmt = "0.00";
          this.FinanceExecLevel_PendCount = 0;
        }
      });
  }

  GetData_FaRole() {
    let baseResource_FA_RoleUrl = constants.DREAMFACTORY_TABLE_URL + 'new_view_dashboard_fa?filter=(MONTH=' + this.Month_Change_ngModel.substring(0, 3) + ')and(YEAR=' + this.year_value + ')and(EMAIL=' + this.Domain + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
    this.http
      .get(sanitizeURL(baseResource_FA_RoleUrl))
      .map(res => res.json())
      .subscribe(data => {
        let FaRoleData = data["resource"][0];
        if (data["resource"][0] != null && data["resource"][0] != undefined) {
          this.FinanceMgrLevel_PendAmt = toCurrency(FaRoleData.PendingAmount_Fm_MgrLevel, this.currency);
          if (this.FinanceMgrLevel_PendAmt == null) {
            this.FinanceMgrLevel_PendAmt = "0.00";
          }
          this.FinanceMgrLevel_PendCount = FaRoleData.PendingCount_Fm_MgrLevel;
          if (this.FinanceMgrLevel_PendCount == null) {
            this.FinanceMgrLevel_PendCount = 0;
          }

        }
        else {
          this.FinanceMgrLevel_PendAmt = "0.00";
          this.FinanceMgrLevel_PendCount = 0;
        }
      });
  }


  Year_Changed(value: any) {
    let stringToSplit = value;
    this.Month_Change_ngModel = stringToSplit.split(" ")[0]
    this.year_value = stringToSplit.split(" ")[1];
    this.paid_month_model = this.monthNameToNum(this.Month_Change_ngModel);
    // alert(this.paid_month_model)
    this.GetRoleDashboard();
    this.GetRoleDashboard_Year();
    this.GetDashboardInfo();
    this.GetInfoForCards();
    this.GetData_FeRole();
    // this.GetData_FeRole_Year();
    this.GetData_FaRole();
    // this.GetPaidData();
  }
  GetDashboardInfo() {
    if (this.month_value != undefined) {
      this.baseResourceUrl = constants.DREAMFACTORY_TABLE_URL + 'new_vw_dashboardchart?filter=(USER_GUID =' + localStorage.getItem("g_USER_GUID") + ')and(MONTH=' + this.Month_Change_ngModel + ')and(YEAR=' + this.year_value + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
      console.log('hi ' + this.baseResourceUrl)
    }

    this.http
      .get(sanitizeURL(this.baseResourceUrl))
      .map(res => res.json())
      .subscribe(data => {

        this.claimrequestdetails = data["resource"][0];
        // console.log(this.claimrequestdetails);
        let val = this.GetPaidData();
        val.then((paid_data: any) => {
          // console.log(paid_data);
          var paid = paid_data["PaidReqCount"];
          paid = parseInt(paid);
          this.PaidReqCount = paid;
          this.PaidClaimAmount = paid_data["PaidClaimAmount"];
          /*           if (this.PaidClaimAmount !== null && this.PaidClaimAmount !== undefined) {
                      this.PaidClaimAmount = parseFloat(this.PaidClaimAmount).toFixed(2);
                    }
                    else { this.PaidClaimAmount = '0.00' } */
          this.PaidClaimAmount = paid_data["PaidClaimAmount"];
          //          if (this.PaidClaimAmount != null) {
          this.PaidClaimAmount = toCurrency(this.PaidClaimAmount, this.currency);
          /*           }
                    else this.PaidClaimAmount = '0.00';
           */
          if (data["resource"][0] != null) {
            var approve = parseInt(this.claimrequestdetails.ApprovedReqCount);
            // alert(approve)
            // var pending = parseInt(this.claimrequestdetails.PendingReqCount);
            var pending_Finance = parseInt(this.claimrequestdetails.PendingReqCount_Finance);
            var pending_Superior = parseInt(this.claimrequestdetails.PendingReqCount_Superior);
            var rejected = parseInt(this.claimrequestdetails.RejectedReqCount);
            // var paid = parseInt(this.claimrequestdetails.PaidReqCount);
            var paid = paid_data["PaidReqCount"];
            paid = parseInt(paid);
            //  console.log(paid);

            this.doughnutChartData = [approve, pending_Finance, pending_Superior, rejected, paid];

            if (this.claimrequestdetails.ApprovedClaimAmount !== null && this.claimrequestdetails.ApprovedClaimAmount !== undefined) {
              var approveAmount = parseFloat(this.claimrequestdetails.ApprovedClaimAmount).toFixed(2);
            }
            else { approveAmount = '0.00' }

            // Superior
            if (this.claimrequestdetails.PendingClaimAmount_Superior !== null && this.claimrequestdetails.PendingClaimAmount_Superior !== undefined) {
              var pendingAmount_Superior = parseFloat(this.claimrequestdetails.PendingClaimAmount_Superior).toFixed(2);

            }
            else { pendingAmount_Superior = '0.00' }
            // Finance
            if (this.claimrequestdetails.PendingClaimAmount_Finance !== null && this.claimrequestdetails.PendingClaimAmount_Finance !== undefined) {
              var pendingAmount_Finance = parseFloat(this.claimrequestdetails.PendingClaimAmount_Finance).toFixed(2);

            }
            else { pendingAmount_Finance = '0.00' }

            if (this.claimrequestdetails.RejectedClaimAmount !== null && this.claimrequestdetails.RejectedClaimAmount !== undefined) {
              var rejectedAmount = parseFloat(this.claimrequestdetails.RejectedClaimAmount).toFixed(2);
            }
            else { rejectedAmount = '0.00' }
            this.PaidClaimAmount = paid_data["PaidClaimAmount"];
            if (this.PaidClaimAmount !== null && this.PaidClaimAmount !== undefined) {
              this.PaidClaimAmount = parseFloat(this.PaidClaimAmount).toFixed(2);
            }
            else { this.PaidClaimAmount = '0.00' }
            this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount_Finance), parseFloat(pendingAmount_Superior), parseFloat(rejectedAmount), parseFloat(this.PaidClaimAmount)];

            // For Display Data In Ion-cards
            this.Rejected_Claim_Count = this.claimrequestdetails.RejectedReqCount;
            this.Pending_Claim_Count = this.claimrequestdetails.PendingReqCount;
            this.Approved_Claim_Count = this.claimrequestdetails.ApprovedReqCount;
            // this.PaidReqCount = this.claimrequestdetails.PaidReqCount;
            this.PaidReqCount = paid_data["PaidReqCount"];
            this.Pending_Claim_Count_Superior = this.claimrequestdetails.PendingReqCount_Superior;
            this.Pending_Claim_Count_Finance = this.claimrequestdetails.PendingReqCount_Finance;

            if (this.claimrequestdetails.RejectedClaimAmount != null) {
              this.Rejected_Claim_Amount = this.claimrequestdetails.RejectedClaimAmount.toFixed(2).toString();
              this.Rejected_Claim_Amount = toCurrency(this.Rejected_Claim_Amount, this.currency);
            }
            else this.Rejected_Claim_Amount = '0.00';

            if (this.claimrequestdetails.PendingClaimAmount != null) {
              this.Pending_Claim_Amount = this.claimrequestdetails.PendingClaimAmount.toFixed(2).toString();
              this.Pending_Claim_Amount = toCurrency(this.Pending_Claim_Amount, this.currency);
            }
            else this.Pending_Claim_Amount = '0.00';
            // Superior
            if (this.claimrequestdetails.PendingClaimAmount_Superior != null) {
              this.Pending_Claim_Amount_Superior = this.claimrequestdetails.PendingClaimAmount_Superior.toFixed(2).toString();
              this.Pending_Claim_Amount_Superior = toCurrency(this.Pending_Claim_Amount_Superior, this.currency);
            }
            else this.Pending_Claim_Amount_Superior = '0.00';
            // Finance
            if (this.claimrequestdetails.PendingClaimAmount_Finance != null) {
              this.Pending_Claim_Amount_Finance = this.claimrequestdetails.PendingClaimAmount_Finance.toFixed(2).toString();
              this.Pending_Claim_Amount_Finance = toCurrency(this.Pending_Claim_Amount_Finance, this.currency);
            }
            else this.Pending_Claim_Amount_Finance = '0.00';

            if (this.claimrequestdetails.ApprovedClaimAmount != null) {
              this.Approved_Claim_Amount = this.claimrequestdetails.ApprovedClaimAmount.toFixed(2).toString();
              this.Approved_Claim_Amount = toCurrency(this.Approved_Claim_Amount, this.currency);
            }
            else this.Approved_Claim_Amount = '0.00';
            this.PaidClaimAmount = paid_data["PaidClaimAmount"];
            if (this.PaidClaimAmount != null) {
              // this.PaidClaimAmount = this.PaidClaimAmount.toFixed(2).toString();
              this.PaidClaimAmount = toCurrency(this.PaidClaimAmount, this.currency);
            }
            else this.PaidClaimAmount = '0.00';

            if (approve == 0 && pending_Finance == 0 && pending_Superior == 0 && rejected == 0 && paid == 0) {

              this.chart1 = false;
              this.chart2 = false;
            } else {
              this.chart1 = true;
              this.chart2 = true;
            }
          }

          else {
            this.chart1 = false;
            this.chart2 = false;
            approve = 0;
            // pending = 0;
            pending_Finance == 0; pending_Superior == 0
            rejected = 0;
            paid = 0;
            this.doughnutChartData = [approve, pending_Finance, pending_Superior, rejected, paid];
            // pendingAmount = '0.00';
            pendingAmount_Finance = '0.00';
            pendingAmount_Superior = '0.00';
            rejectedAmount = '0.00';
            approveAmount = '0.00';
            // this.PaidClaimAmount = '0.00';


            this.claimAmountData = [parseFloat(approveAmount), parseFloat(pendingAmount_Finance), parseFloat(pendingAmount_Superior), parseFloat(rejectedAmount), parseFloat(this.PaidClaimAmount)];

            // For Display Data In Ion-cards
            this.Rejected_Claim_Count = 0;
            this.Pending_Claim_Count = 0;
            this.Approved_Claim_Count = 0;
            // this.PaidReqCount = 0;
            this.Pending_Claim_Count_Finance = 0;
            this.Pending_Claim_Count_Superior = 0;

            this.Rejected_Claim_Amount = '0.00';
            this.Pending_Claim_Amount = '0.00';
            this.Approved_Claim_Amount = '0.00';
            // this.PaidClaimAmount = '0.00';
            this.Pending_Claim_Amount_Finance = '0.00';
            this.Pending_Claim_Amount_Superior = '0.00';
            //
          }
        });
      });

  }

  GetInfoForCards() {
    this.http
      .get(getURL("table", "vw_dashboard_card", [`USER_GUID=${localStorage.getItem("g_USER_GUID")}`]))
      .map(res => res.json())
      .subscribe(data => {
        this.Year_Card = data["resource"];
        // console.log('user '+this.baseResourceUrl_Card);      

        if (this.Year_Card.length != 0) {
          this.RejectedClaimCount_year = this.Year_Card[0]["RejectedClaimCount_year"];
          if (this.RejectedClaimCount_year != null && this.RejectedClaimCount_year != undefined)
            this.RejectedClaimCount_year;
          else
            this.RejectedClaimCount_year = '0';

          this.PendingClaimCount_year = this.Year_Card[0]["PendingClaimCount_year"];
          if (this.PendingClaimCount_year != null && this.PendingClaimCount_year != undefined)
            this.PendingClaimCount_year;
          else
            this.PendingClaimCount_year = '0';
          // Superior
          this.PendingClaimCount_year_Superior = this.Year_Card[0]["PendingClaimCount_year_superior"];
          if (this.PendingClaimCount_year_Superior != null && this.PendingClaimCount_year_Superior != undefined)
            this.PendingClaimCount_year_Superior;
          else
            this.PendingClaimCount_year_Superior = '0';
          // Finance
          this.PendingClaimCount_year_Finance = this.Year_Card[0]["PendingClaimCount_year_finance"];
          if (this.PendingClaimCount_year_Finance != null && this.PendingClaimCount_year_Finance != undefined)
            this.PendingClaimCount_year_Finance;
          else
            this.PendingClaimCount_year_Finance = '0';

          this.ApprovedClaimCount_year = this.Year_Card[0]["ApprovedClaimCount_year"];
          if (this.ApprovedClaimCount_year != null && this.ApprovedClaimCount_year != undefined)
            this.ApprovedClaimCount_year;
          else
            this.ApprovedClaimCount_year = '0';

          this.PaidClaimCount_year = this.Year_Card[0]["PaidClaimCount_year"];
          if (this.PaidClaimCount_year != null && this.PaidClaimCount_year != undefined)
            this.PaidClaimCount_year;
          else
            this.PaidClaimCount_year = '0';

          this.RejectedClaimAmount_year = this.Year_Card[0]["RejectedClaimAmount_year"];
          if (this.RejectedClaimAmount_year != null && this.RejectedClaimAmount_year != undefined)
            this.RejectedClaimAmount_year = toCurrency(this.RejectedClaimAmount_year, this.currency);
          else
            this.RejectedClaimAmount_year = '0.00';

          this.PendingClaimAmount_year = this.Year_Card[0]["PendingClaimAmount_year"];
          if (this.PendingClaimAmount_year != null && this.PendingClaimAmount_year != undefined)
            this.PendingClaimAmount_year = toCurrency(this.PendingClaimAmount_year, this.currency);
          else
            this.PendingClaimAmount_year = '0.00';
          // Superior
          this.PendingClaimAmount_year_Superior = this.Year_Card[0]["PendingClaimAmount_year_superior"];
          if (this.PendingClaimAmount_year_Superior != null && this.PendingClaimAmount_year_Superior != undefined)
            this.PendingClaimAmount_year_Superior = toCurrency(this.PendingClaimAmount_year_Superior, this.currency);
          else
            this.PendingClaimAmount_year_Superior = '0.00';
          // Finance
          this.PendingClaimAmount_year_Finance = this.Year_Card[0]["PendingClaimAmount_year_finance"];
          if (this.PendingClaimAmount_year_Finance != null && this.PendingClaimAmount_year_Finance != undefined)
            this.PendingClaimAmount_year_Finance = toCurrency(this.PendingClaimAmount_year_Finance, this.currency);
          else
            this.PendingClaimAmount_year_Finance = '0.00';

          this.ApprovedClaimAmount_year = this.Year_Card[0]["ApprovedClaimAmount_year"];
          if (this.ApprovedClaimAmount_year != null && this.ApprovedClaimAmount_year != undefined)
            this.ApprovedClaimAmount_year = toCurrency(this.ApprovedClaimAmount_year, this.currency);
          else
            this.ApprovedClaimAmount_year = '0.00';

          this.PaidClaimAmount_year = this.Year_Card[0]["PaidClaimAmount_year"];
          if (this.PaidClaimAmount_year != null && this.PaidClaimAmount_year != undefined)
            this.PaidClaimAmount_year = toCurrency(this.PaidClaimAmount_year, this.currency);
          else
            this.PaidClaimAmount_year = '0.00';
        }
        else {
          this.RejectedClaimCount_year = '0';
          this.PendingClaimCount_year = '0';
          this.ApprovedClaimCount_year = '0';
          this.PaidClaimCount_year = '0';
          this.PendingClaimCount_year_Finance = '0';
          this.PendingClaimCount_year_Superior = '0';

          this.RejectedClaimAmount_year = '0.00';
          this.PendingClaimAmount_year = '0.00';
          this.ApprovedClaimAmount_year = '0.00';
          this.PaidClaimAmount_year = '0.00';
          this.PendingClaimAmount_year_Finance = '0.00';
          this.PendingClaimAmount_year_Superior = '0.00';
        }


      });
  }
  GetData_Years() {
    this.http
      .get(sanitizeURL(this.baseResourceUrl_New))
      .map(res => res.json())
      .subscribe(data => {
        this.years_data = data["resource"];
        // console.log(this.years_data.length)

        if (this.years_data.length == 0) {
          this.years = [this.year_value - 1, this.year_value];
          return;
        }
        else { }
        this.years = this.years_data;
        var uniqueYears = this.deduplicate(this.years);
        //console.log(uniqueYears)
        this.years = uniqueYears;
        var SortuniqueYears = this.sortUnique(this.years);
        //console.log(SortuniqueYears)
        this.years = SortuniqueYears;
      });

  }
  GetPaidData() {
    let Paid_Url = getURL("table", "new_vw_dashboardchart", [`USER_GUID=${localStorage.getItem("g_USER_GUID")}`]);
    return new Promise((resolve) => {
      this.http
        .get(sanitizeURL(Paid_Url))
        .map(res => res.json())
        .subscribe(data => {
          this.paid_details = data["resource"][0];
          // console.log(this.paid_details);
          if (data["resource"][0] == null) {
            this.paid_details = { paid: 0, PaidReqCount: 0 };
          }
          resolve(this.paid_details);
        });

    });
  }
  Rejected_Click() {
    this.navCtrl.push('UserclaimslistPage', { Rejected_data: [{ Rejected: Settings.StatusConstants.REJECTED, month: this.Month_Change_ngModel }] });
  }
  Pending_Click() {
    this.navCtrl.push('UserclaimslistPage', { Pending_data: [{ PENDINGSUPERIOR: Settings.StatusConstants.PENDINGSUPERIOR, month: this.Month_Change_ngModel }] });
  }
  Validated_Click() {
    this.navCtrl.push('UserclaimslistPage', { Approved_data: [{ PENDINGPAYMENT: Settings.StatusConstants.PENDINGPAYMENT, month: this.Month_Change_ngModel }] });
  }
  Approved_Click() {
    this.navCtrl.push('UserclaimslistPage', { Validation_data: [{ PENDINGFINANCEVALIDATION: Settings.StatusConstants.PENDINGFINANCEVALIDATION, month: this.Month_Change_ngModel }] });
  }
  Paid_Click() {
    this.navCtrl.push('UserclaimslistPage', { Paid_data: [{ Paid: Settings.StatusConstants.PAID, month: this.Month_Change_ngModel }] });
  }
  Approver_Click() {
    this.navCtrl.push('ClaimapprovertasklistPage', { month: this.Month_Change_ngModel });
  }
  Finance_Executive_Click() {
    this.navCtrl.push('ClaimtasklistPage', { month: this.Month_Change_ngModel });
  }
  Finance_Manager_Click() {
    this.navCtrl.push('FinancePaymentTasklistPage', { month: this.Month_Change_ngModel });

  }

}
