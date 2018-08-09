import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SetupPage } from '../pages/setup/setup';
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../pages/travel-claim/travel-claim.component';
import { MiscellaneousClaimPage } from '../pages/miscellaneous-claim/miscellaneous-claim';
import { UserData } from '../providers/user-data';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';


import { ClaimhistoryPage } from '../pages/claimhistory/claimhistory';
import { ClaimhistorydetailPage } from '../pages/claimhistorydetail/claimhistorydetail';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist';
import { ClaimtasklistPage } from '../pages/claimtasklist/claimtasklist'
import { UserclaimslistPage } from '../pages/userclaimslist/userclaimslist';
import { MonthlyClaimReportPage } from '../pages/monthly-claim-report/monthly-claim-report';
import { ClaimReportUserPage } from '../pages/claim-report-user/claim-report-user';
import { ClaimReportPage } from '../pages/claim-report/claim-report';
import { ClaimReportPrintPage } from '../pages/claim-report-print/claim-report-print';

import { TranslateService } from '@ngx-translate/core';

import { CustomerSetupPage } from '../pages/customer-setup/customer-setup';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../app/config/constants';
import { AllClaimListPage } from '../pages/all-claim-list/all-claim-list';

// import { MenuService } from '../providers/menu.service'



export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  blnLogin: boolean = false;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public Menu_Array: any[] = [];

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Dashboard', name: 'DashboardPage', component: DashboardPage, icon: 'apps' }
  ];

  claimPages: PageInterface[] = [
    { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
    { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
    { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
    { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
    { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
    { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
    { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
  ];

  loggedInPages: PageInterface[] = [
    { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
    { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Sign Up', name: 'SignupPage', component: SignupPage, icon: 'person-add' },
    { title: 'Forgot Password', name: 'LoginPage', component: LoginPage, icon: 'key' }
  ];

  reportPages: PageInterface[] = [
    { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' },
    { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'md-list-box' },
    { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
    { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' }
  ];

  setupsPages: PageInterface[] = [
    { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
    { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
    { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
  ];

  rootPage = 'LoginPage';
  appPages_User: PageInterface[];
  USER_NAME_LABEL: any;
  IMAGE_URL: any;

  //To control Menu-------------------------------
  blnDashboard_loggedInMenu_User: boolean = true;
  blnTasks_loggedInMenu_User: boolean = true;
  blnClaims_loggedInMenu_User: boolean = true;
  blnReport_loggedInMenu_User: boolean = true;
  blnSetup_loggedInMenu_User: boolean = true;
  blnAccount_loggedInMenu_User: boolean = true;
  //----------------------------------------------

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
//    public confData: ConferenceData,
    public storage: Storage,
    // statusbar: StatusBar,
    // splashScreen: SplashScreen, 
    public translate: TranslateService, public http: Http
  ) {
    // debugger;
    this.blnLogin = false; 
    this.translateToEnglish();
    this.translate.setDefaultLang('en'); //Fallback language

    platform.ready().then(() => {
    });

    translate.setDefaultLang('en');
//    platform.ready().then(() => { statusbar.styleDefault(); splashScreen.hide(); });

    // Check if the user has already seen the tutorial
    // load the conference data
//    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage    
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    //this.enableMenu(true);
    this.listenToLoginEvents();

    this.userData.logout();
    this.enableMenu(false);

    // this.menu.enable(false, 'loggedInMenu');
    this.menu.enable(false, 'loggedInMenu_User');    
  }

  openPage(page: PageInterface) {
    // debugger;    
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout(); this.blnLogin = false;
    }
  }

  // MenuService: MenuService = new MenuService();

  listenToLoginEvents() {
    // this.MenuService.EventListener();
    // debugger;    

    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
        this.enableMenu(false);            
    });
  }

  enableMenu(loggedIn: boolean) {    
    if(localStorage.getItem("g_USER_GUID") != null){
      loggedIn = true;
    }
    // alert(loggedIn);
    // debugger;
    //Get all the roles and menus for that particular user.-------------------------------------------------------   
    // let url: string; this.Menu_Array = []; let Role_Name: string = "";
    // url = this.baseResource_Url + "view_user_role_menu?filter=USER_GUID=" + localStorage.getItem("g_USER_GUID") + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    // this.http
    //   .get(url)
    //   .map(res => res.json())
    //   .subscribe(data => {
    //     let res = data["resource"];
    //     if (res.length > 0) {
    //       for (var item in data["resource"]) {
    //         if (data["resource"][item]["NAME"].toUpperCase() == "HOME") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' });
    //         }
    //         else if (data["resource"][item]["NAME"].toUpperCase() == "APPROVER TASK") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' });
    //         }
    //         else if (data["resource"][item]["NAME"].toUpperCase() == "CHANGE PASSWORD") {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' });
    //         }
    //         else {
    //           this.Menu_Array.push({ title: data["resource"][item]["NAME"], name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' });
    //         }            
    //       }
    //     }
    //   });
    // ---------------------------------------------------------------------------------------------------------------------------------   

    // this.menu.enable(loggedIn, 'loggedInMenu');
    // this.menu.enable(!loggedIn, 'loggedOutMenu');
    
    if (localStorage.length > 0) {
      this.blnLogin = true; this.USER_NAME_LABEL = localStorage.getItem("g_FULLNAME");
      this.IMAGE_URL = localStorage.getItem("g_IMAGE_URL");
      let val = this.GetUser_Role(localStorage.getItem("g_USER_GUID"));
      val.then((res) => {
        this.blnDashboard_loggedInMenu_User = true;
        this.blnTasks_loggedInMenu_User = true;
        this.blnClaims_loggedInMenu_User = true;
        this.blnReport_loggedInMenu_User = true;
        this.blnAccount_loggedInMenu_User = true;

        this.blnSetup_loggedInMenu_User = true;
        if (localStorage.getItem("g_USER_GUID") == "sva") {
          this.loggedInPages = [
            { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
          ];

          this.setupsPages = [
            // { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
            { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
            { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
          ];

          this.menu.enable(loggedIn, 'loggedInMenu');
          // this.menu.enable(loggedIn, 'loggedInMenu_User');          
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Tenant Admin, Remove Admin Setup
        else if (localStorage.getItem("g_IS_TENANT_ADMIN") == "1") {          
          this.blnDashboard_loggedInMenu_User = true;
          this.blnTasks_loggedInMenu_User = true;
          this.blnClaims_loggedInMenu_User = true;
          this.blnReport_loggedInMenu_User = true;
          this.blnAccount_loggedInMenu_User = true;

          this.blnSetup_loggedInMenu_User = true;
          this.appPages_User = [
            { title: 'Approver Task ', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'Finance Task ', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' },
          ];
          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];
          this.reportPages = [
            { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' },
            { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'md-list-box' },
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'All Claim List', name: 'AllClaimListPage', component: AllClaimListPage, icon: 'ios-paper-outline' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.setupsPages = [
            // { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
            { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
            // { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
          ];

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Team Member, Home, Change Password, Sign Out
        else if (res.toString() == "Team Member") {
          this.blnDashboard_loggedInMenu_User = true;
          this.blnClaims_loggedInMenu_User = true;
          this.blnReport_loggedInMenu_User = true;
          this.blnAccount_loggedInMenu_User = true;

          this.blnTasks_loggedInMenu_User = false;
          this.blnSetup_loggedInMenu_User = false;

          this.appPages_User = [
            { title: 'Approver Tasks', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
          ];

          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.reportPages = [
            // { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' }
          ];

          this.setupsPages = [
            { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
            { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
            { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        else if (res.toString() == "Finance Executive") {
          this.blnDashboard_loggedInMenu_User = true;
          this.blnTasks_loggedInMenu_User = true;
          this.blnClaims_loggedInMenu_User = true;
          this.blnReport_loggedInMenu_User = true;
          this.blnAccount_loggedInMenu_User = true;

          this.blnSetup_loggedInMenu_User = true;

          this.appPages_User = [
            { title: 'Finance Tasks', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' }
          ];

          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' }
          ];

          this.reportPages = [
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },

            { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'md-list-box' },
            { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' },

            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' },
            { title: 'User Claim Reports', name: 'ClaimReportPage', component: ClaimReportPage, icon: 'md-paper' }
         

          ];

          this.setupsPages = [
            // { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
            { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
            // { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Team Member, Home, Change Password, Sign Out
        else if (res.toString() == "Finance Admin" || res.toString() == "Finance Manager") {
          this.blnDashboard_loggedInMenu_User = true;
          this.blnTasks_loggedInMenu_User = true;
          this.blnClaims_loggedInMenu_User = true;
          this.blnReport_loggedInMenu_User = true;
          this.blnAccount_loggedInMenu_User = true;

          this.blnSetup_loggedInMenu_User = true;

          this.appPages_User = [
            { title: 'Approver Tasks', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            { title: 'Finance Tasks', name: 'ClaimtasklistPage', component: ClaimtasklistPage, icon: 'md-clipboard' }
          ];
          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          if (res.toString() == "Finance Admin") {
            this.setupsPages = [
              // { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' },
              { title: 'Setup', name: 'SetupPage', component: SetupPage, icon: 'settings' },
              // { title: 'Admin Setup', name: 'AdminsetupPage', component: AdminsetupPage, icon: 'cog' }
            ];
          }

          this.reportPages = [
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },

            { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'md-list-box' },
            { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' },

            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' },
            { title: 'User Claim Reports', name: 'ClaimReportPage', component: ClaimReportPage, icon: 'md-paper' }

          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Manage Customer
        else if (res.toString() == "Manage Customer") {
          this.appPages_User = [

            { title: 'Approver Tasks', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' }
          ];
          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.reportPages = [
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' }
         
          ];

          this.setupsPages = [
            { title: 'Manage Customer', name: 'CustomerSetupPage', component: CustomerSetupPage, icon: 'man' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For Team Lead
        else if (res.toString() == "Team Lead") {
          this.blnDashboard_loggedInMenu_User = true;
          this.blnTasks_loggedInMenu_User = true;
          this.blnClaims_loggedInMenu_User = true;
          this.blnReport_loggedInMenu_User = true;
          this.blnAccount_loggedInMenu_User = true;

          this.blnSetup_loggedInMenu_User = false;

          this.appPages_User = [
            { title: 'Approver Tasks', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
          ];

          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.reportPages = [
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }

        //For others
        else {
          this.appPages_User = [
            { title: 'Approver Tasks', name: 'ClaimapprovertasklistPage', component: ClaimapprovertasklistPage, icon: 'checkbox-outline' },
            // { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' }
          ];

          this.claimPages = [
            { title: 'Travel Claim', name: 'TravelclaimPage', component: TravelclaimPage, icon: 'car' },
            { title: 'Entertainment Claim', name: 'EntertainmentclaimPage', component: EntertainmentclaimPage, icon: 'cafe' },
            { title: 'Gift Claim', name: 'GiftclaimPage', component: GiftclaimPage, icon: 'basket' },
            { title: 'Overtime Claim', name: 'OvertimeclaimPage', component: OvertimeclaimPage, icon: 'stopwatch' },
            { title: 'Printing Claim', name: 'PrintclaimPage', component: PrintclaimPage, icon: 'print' },
            { title: 'Miscellaneous Claim', name: 'MiscellaneousClaimPage', component: MiscellaneousClaimPage, icon: 'albums' },
          ];

          this.reportPages = [
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' },
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' },
            { title: 'My Claim Reports', name: 'ClaimReportUserPage', component: ClaimReportUserPage, icon: 'ios-paper-outline' }

          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Change Password', name: 'ChangePasswordPage', component: ChangePasswordPage, icon: 'unlock' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }

          this.menu.enable(loggedIn, 'loggedInMenu_User');
          this.menu.enable(!loggedIn, 'loggedOutMenu');
        }
      });
      val.catch((err) => {
        // This is never called
        console.log(err);
      });
    }
    else {
      this.blnLogin = false;
    }





    //For Super admin, All menu should display
    // if (localStorage.length > 0) {
    //   if (localStorage.getItem("g_USER_GUID") == "sva") {
    //     this.menu.enable(loggedIn, 'loggedInMenu');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    //   //For user, distinct menu should display
    //   else if (localStorage.getItem("g_IS_TENANT_ADMIN") != "1") {
    //     // this.appPages_User = [
    //     //   { title: 'HOME', name: 'TabsPage', component: TabsPage, tabComponent: SpeakerListPage, index: 0, icon: 'apps' },
    //     //   { title: 'APPROVER TASK', name: 'ApproverTaskListPage', component: TabsPage, tabComponent: ApproverTaskListPage, index: 3, icon: 'checkbox-outline' },
    //     // ];
    //     this.appPages_User = this.Menu_Array;

    //     this.menu.enable(loggedIn, 'loggedInMenu_User');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    //   else {
    //     this.menu.enable(loggedIn, 'loggedInMenu');
    //     this.menu.enable(!loggedIn, 'loggedOutMenu');
    //   }
    // }
    // else {
    //   this.menu.enable(loggedIn, 'loggedInMenu');
    //   this.menu.enable(!loggedIn, 'loggedOutMenu');
    // }
  }

  isActive(page: PageInterface) {
    // debugger;    
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  public translateToMalayClicked: boolean = false;

  public translateToEnglishClicked: boolean = true;

  public translateToEnglish() {
    this.translate.use('en');
    this.translateToMalayClicked = !this.translateToMalayClicked;
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
  }

  public translateToMalay() {
    this.translate.use('ms');
    this.translateToEnglishClicked = !this.translateToEnglishClicked;
    this.translateToMalayClicked = !this.translateToMalayClicked;
  }

  GetUser_Role(user_guid: string) {
    // debugger;
    let TableURL = this.baseResource_Url + "view_user_role_menu?filter=USER_GUID=" + user_guid + '&api_key=' + constants.DREAMFACTORY_API_KEY;
    return new Promise((resolve) => {
      this.http
        .get(TableURL)
        .map(res => res.json())
        .subscribe(data => {
          let roles = data["resource"];
          if (data["resource"].length > 0) {
            resolve(roles[0]["ROLE_NAME"]); //localStorage.setItem("g_ROLE_NAME",roles[0]["ROLE_NAME"]);
          }
          else {
            resolve("NA");
          }
        });
    });
  }
}