import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
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
import { TranslateService } from '@ngx-translate/core';
import { CustomerSetupPage } from '../pages/customer-setup/customer-setup';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as constants from '../app/config/constants';



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
export class eClaimApp {
  blnLogin: boolean = false;
  baseResource_Url: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/';
  public Menu_Array: any[] = [];

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
    { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
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
    public storage: Storage,
    statusbar: StatusBar,
    splashScreen: SplashScreen, public translate: TranslateService, public http: Http
  ) {
    this.blnLogin = false; //localStorage.removeItem("g_ROLE_NAME");
    this.translateToEnglish();
    this.translate.setDefaultLang('en'); //Fallback language

    platform.ready().then(() => {
    });

    translate.setDefaultLang('en');
    platform.ready().then(() => { statusbar.styleDefault(); splashScreen.hide(); });

    // decide which menu items should be hidden by current login status stored in local storage    
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    //this.enableMenu(true);
    this.listenToLoginEvents();

    this.userData.logout();
    this.enableMenu(false);

    this.menu.enable(false, 'loggedInMenu');
  }

  openPage(page: PageInterface) {
    // debugger;    
    let params = {};

    if (page.index) {
      params = { tabIndex: page.index };
    }

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

  listenToLoginEvents() {
    //debugger;    
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
    if (localStorage.length > 0) {
      this.blnLogin = true; this.USER_NAME_LABEL = localStorage.getItem("g_FULLNAME"); this.IMAGE_URL = localStorage.getItem("g_IMAGE_URL"); 
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

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else{
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
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' }
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
          else{
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
            { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
            { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' }            
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
          else{
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
            { title: 'Finance Task History', name: 'ClaimhistoryPage', component: ClaimhistoryPage, icon: 'ios-list-box-outline' },
            { title: 'Monthly Claim Report', name: 'MonthlyClaimReportPage', component: MonthlyClaimReportPage, icon: 'ios-paper-outline' }
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else{
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
            { title: 'My Claim History', name: 'UserclaimslistPage', component: UserclaimslistPage, icon: 'ios-clipboard-outline' }
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
          else{
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
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' }
           
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else{
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
            { title: 'Approver Task History', name: 'ClaimhistorydetailPage', component: ClaimhistorydetailPage, icon: 'ios-list-box-outline' }
           
          ];

          if (localStorage.getItem("Ad_Authenticaton") == "true") {
            this.loggedInPages = [
              { title: 'My Profile', name: 'AccountPage', component: AccountPage, icon: 'person' },
              { title: 'Sign Out', name: 'LoginPage', component: LoginPage, icon: 'log-out', logsOut: true }
            ];
          }
          else{
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