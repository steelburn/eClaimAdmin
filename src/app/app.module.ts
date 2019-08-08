import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

// import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { eClaimApp } from './app.component';

// import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { SetupPage } from '../pages/setup/setup';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
// import { MedicalclaimPage } from '../pages/medicalclaim/medicalclaim';
/*
import { PrintclaimPage } from '../pages/printclaim/printclaim';
import { GiftclaimPage } from '../pages/giftclaim/giftclaim';
import { OvertimeclaimPage } from '../pages/overtimeclaim/overtimeclaim';
import { ApproverTaskListPage } from '../pages/approver-task-list/approver-task-list';
import { AllClaimListPage } from '../pages/all-claim-list/all-claim-list';
import { AllClaimhistoryPage } from '../pages/allclaimhistory/claimhistory';

import { EntertainmentclaimPage } from '../pages/entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../pages/travel-claim/travel-claim.component';
import { MiscellaneousClaimPage } from '../pages/miscellaneous-claim/miscellaneous-claim';
*/

import { UserPage } from '../pages/user/user';
import { SocRegistrationPage } from '../pages/soc-registration/soc-registration';
import { AdminsetupPage } from '../pages/adminsetup/adminsetup';


import { UploadPage } from '../pages/upload/upload';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// import { Chart } from 'chart.js';
import { ChartsModule } from 'ng2-charts/ng2-charts';
// import {AddTollPage} from '../pages/add-toll/add-toll';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { ProfileSetupPage } from '../pages/profile-setup/profile-setup.component';

import { Services } from '../pages/Services';
//import { TravelClaim_Service } from '../services/travelclaim_service';
import { ClaimhistoryPage } from '../pages/claimhistory/claimhistory';

/*
import { AddTollPage } from '../pages/add-toll/add-toll.component';
import { ClaimhistorydetailPage } from '../pages/claimhistorydetail/claimhistorydetail';
import { ClaimapprovertasklistPage } from '../pages/claimapprovertasklist/claimapprovertasklist'
import { ClaimtasklistPage } from '../pages/claimtasklist/claimtasklist'
import { UserclaimslistPage } from '../pages/userclaimslist/userclaimslist'
import { ClaimReportPage } from '../pages/claim-report/claim-report';
import { MonthlyClaimReportPage } from '../pages/monthly-claim-report/monthly-claim-report';
import { ClaimReportUserPage } from '../pages/claim-report-user/claim-report-user';
import { ClaimReportPrintPage } from '../pages/claim-report-print/claim-report-print';
import { LeaveReportPage } from '../pages/leave-report/leave-report';
import { FinancePaymentTasklistPage } from '../pages/finance-payment-tasklist/finance-payment-tasklist';
import { CommonTasklistPage } from '../pages/common-tasklist/common-tasklist';
import { PaymentHistoryPage } from '../pages/payment-history/payment-history';
import { CommonHistorylistPage } from '../pages/common-historylist/common-historylist';
import { ClaimSummaryPage } from '../pages/claim-summary/claim-summary';
*/
import { AttendanceReportPage } from '../pages/attendance-report/attendance-report';

/*
import { TravelClaimViewPage } from '../pages/travel-claim-view/travel-claim-view.component';
import { EntertainmentClaimViewPage } from '../pages/entertainment-claim-view/entertainment-claim-view';
import { OvertimeClaimViewPage } from '../pages/overtime-claim-view/overtime-claim-view';
// import { MedicalClaimViewPage } from '../pages/medical-claim-view/medical-claim-view';
import { PrintClaimViewPage } from '../pages/print-claim-view/print-claim-view';
import { GiftClaimViewPage } from '../pages/gift-claim-view/gift-claim-view';
import { MiscellaneousClaimViewPage } from '../pages/miscellaneous-claim-view/miscellaneous-claim-view';
*/

import { ApiManagerProvider } from '../providers/api-manager.provider';
import { ProfileManagerProvider } from '../providers/profile-manager.provider';
import { CustomerSetupPage } from '../pages/customer-setup/customer-setup';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { DatePipe, DecimalPipe } from '@angular/common'
import { ImportExcelDataPage } from '../pages/import-excel-data/import-excel-data';
// import { Ng2PaginationModule } from 'ng2-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { Transfer } from '@ionic-native/transfer';
import { SanitizerProvider } from '../providers/sanitizer/sanitizer';
import { ToastProvider } from '../providers/toast/toast';
import { CurrencyProvider } from '../providers/currency/currency';
import { UploaderProvider } from '../providers/uploader/uploader';
import { PermissionPage } from '../pages/permission/permission';
import { RolemodulesetupPage } from '../pages/rolemodulesetup/rolemodulesetup';
import { PagesetupPage } from '../pages/pagesetup/pagesetup';
import { CountrysetupPage } from '../pages/countrysetup/countrysetup';
import { StatesetupPage } from '../pages/statesetup/statesetup';
import { SetupguidePage } from '../pages/setupguide/setupguide';
import { SubmodulesetupPage } from '../pages/submodulesetup/submodulesetup';
import { BanksetupPage } from '../pages/banksetup/banksetup';
import { BranchsetupPage } from '../pages/branchsetup/branchsetup';
import { CompanysetupPage } from '../pages/companysetup/companysetup';
import { DepartmentsetupPage } from '../pages/departmentsetup/departmentsetup';
import { ClaimtypePage } from '../pages/claimtype/claimtype';
import { CashcardsetupPage } from '../pages/cashcardsetup/cashcardsetup';
import { DesignationsetupPage } from '../pages/designationsetup/designationsetup';
import { TranslatePage } from '../pages/translate/translate';
import { MileagesetupPage } from '../pages/mileagesetup/mileagesetup';
import { RolesetupPage } from '../pages/rolesetup/rolesetup';
import { ModulesetupPage } from '../pages/modulesetup/modulesetup';
import { DeviceSetupPage } from '../pages/device-setup/device-setup';
import { PaymenttypesetupPage } from '../pages/paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../pages/qualificationsetup/qualificationsetup';
import { SubsciptionsetupPage } from '../pages/subsciptionsetup/subsciptionsetup';
import { TenantsetupPage } from '../pages/tenantsetup/tenantsetup';
import { SettingsPage } from '../pages/settings/settings';
import { CompanysettingsPage } from '../pages/companysettings/companysettings';
import { DbmaintenancePage } from '../pages/dbmaintenance/dbmaintenance';
import { OtRateSetupPage } from '../pages/ot-rate-setup/ot-rate-setup';
import { ApprovalProfilePage } from '../pages/approval-profile/approval-profile';
// import { Transfer } from "../providers/file-transfer";

@NgModule({
  declarations: [
/* 1st level loading */
    eClaimApp,
    LoginPage,
    SignupPage,
/* 2nd level loading, only dashboard */
DashboardPage, 

/* 3nd level loading, after dashboard */
/*
    TravelclaimPage,
    // MedicalclaimPage,
    AllClaimhistoryPage,
    PrintclaimPage,
    GiftclaimPage,
    OvertimeclaimPage,
    EntertainmentclaimPage,
    MiscellaneousClaimPage,
    AllClaimListPage,
*/
    /* Should be loaded only when using setup */
       
    PermissionPage,
    RolemodulesetupPage,
    PagesetupPage,
    CountrysetupPage,
  //  TravelclaimPage,
    StatesetupPage,
    SetupguidePage,

    SubmodulesetupPage,
    SetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    DepartmentsetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    DesignationsetupPage,
    TranslatePage,
    MileagesetupPage,
    RolesetupPage,
    ModulesetupPage, 
    DeviceSetupPage,
    PaymenttypesetupPage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    AdminsetupPage,
    ProfileSetupPage,
    CustomerSetupPage,
    SocRegistrationPage,

    SettingsPage,
    CompanysettingsPage,
    DbmaintenancePage,
    OtRateSetupPage,
    ApprovalProfilePage,
    ImportExcelDataPage,
 /* */

     /* Should be loaded only when doing travel claims */
//    AddTollPage,
//    TravelClaimViewPage,

    AccountPage,
    TabsPage,
    UserPage,
  //  ApproverTaskListPage,
  //  EntertainmentClaimViewPage,
    // MedicalClaimViewPage,
  //  OvertimeClaimViewPage,
  //  PrintClaimViewPage,
  //  GiftClaimViewPage,
  //  MiscellaneousClaimViewPage,
    UploadPage,
    ChangePasswordPage,
    AttendanceReportPage,
    /*
    ClaimhistoryPage,
    ClaimhistorydetailPage,
    ClaimapprovertasklistPage,
    ClaimtasklistPage,
    UserclaimslistPage,
    ClaimReportPage,
    MonthlyClaimReportPage,
    ClaimReportUserPage,
    ClaimReportPrintPage,
    LeaveReportPage,


    FinancePaymentTasklistPage,
    CommonTasklistPage,
    PaymentHistoryPage,
    CommonHistorylistPage,

    ClaimSummaryPage */
  ],

  imports: [
    BrowserModule,
    HttpModule, HttpClientModule, ChartsModule, NgxPaginationModule,
    TranslateModule.forRoot
      ({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      }),
    IonicModule.forRoot(eClaimApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        // { component: DashboardPage, name: 'Home', segment: 'Home' },
        { component: ImportExcelDataPage, name: 'ImportExcelDataPage', segment: 'ImportExcelDataPage' },
        { component: DashboardPage, name: 'DashboardPage', segment: 'DashboardPage' },
        { component: SetupPage, name: 'SetupPage', segment: 'Setup' },
        { component: AdminsetupPage, name: 'AdminsetupPage', segment: 'AdminsetupPage' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: ChangePasswordPage, name: 'ChangePasswordPage', segment: 'changepassword' },
        // { component: AllClaimListPage, name: 'AllClaimListPage', segment: 'AllClaimList' },

        // { component: TravelclaimPage, name: 'TravelclaimPage', segment: 'TravelclaimPage' },
        // { component: EntertainmentclaimPage, name: 'EntertainmentclaimPage', segment: 'EntertainmentclaimPage' },
        // { component: GiftclaimPage, name: 'GiftclaimPage', segment: 'GiftclaimPage' },
        // { component: OvertimeclaimPage, name: 'OvertimeclaimPage', segment: 'OvertimeclaimPage' },
        // { component: PrintclaimPage, name: 'PrintclaimPage', segment: 'PrintclaimPage' },
        // { component: MiscellaneousClaimPage, name: 'MiscellaneousClaimPage', segment: 'MiscellaneousClaimPage' },
        { component: CustomerSetupPage, name: 'CustomerSetupPage', segment: 'CustomerSetupPage' },
        // { component: AllClaimhistoryPage, name: 'AllClaimhistoryPage', segment: 'AllClaimhistoryPage' },

        // { component: ClaimtasklistPage, name: 'ClaimtasklistPage', segment: 'ClaimtasklistPage' },
        // { component: ClaimapprovertasklistPage, name: 'ClaimapprovertasklistPage', segment: 'ClaimapprovertasklistPage' },
        // { component: UserclaimslistPage, name: 'UserclaimslistPage', segment: 'UserclaimslistPage' },
        // { component: ClaimhistoryPage, name: 'ClaimhistoryPage', segment: 'ClaimhistoryPage' },
        // { component: ClaimhistorydetailPage, name: 'ClaimhistorydetailPage', segment: 'ClaimhistorydetailPage' },
        // { component: ClaimReportPage, name: 'ClaimReportPage', segment: 'ClaimReportPage' },
        // { component: MonthlyClaimReportPage, name: 'MonthlyClaimReportPage', segment: 'MonthlyClaimReportPage' },
        // { component: ClaimReportUserPage, name: 'ClaimReportUserPage', segment: 'ClaimReportUserPage' },
        // { component: LeaveReportPage, name: 'LeaveReportPage', segment: 'LeaveReportPage' },
        { component: AttendanceReportPage, name: 'AttendanceReportPage', segment: 'AttendanceReportPage' },
        // { component: ClaimReportPrintPage, name: 'ClaimReportPrintPage', segment: 'ClaimReportPrintPage' },
        // { component: FinancePaymentTasklistPage, name: 'FinancePaymentTasklistPage', segment: 'FinancePaymentTasklistPage' },
        // { component: CommonTasklistPage, name: 'CommonTasklistPage', segment: 'CommonTasklistPage' },
        // { component: PaymentHistoryPage, name: 'PaymentHistoryPage', segment: 'PaymentHistoryPage' },
        // { component: CommonHistorylistPage, name: 'CommonHistorylistPage', segment: 'CommonHistorylistPage' },
        // { component: ClaimSummaryPage, name: 'ClaimSummaryPage', segment: 'ClaimSummaryPage' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    /* 1st level loading */
    eClaimApp,
    LoginPage,
    SignupPage,
    /* 2nd level loading, only dashboard */
    DashboardPage,

    /* 3rd level loading, after dashboard */



    // MedicalclaimPage,
    // TravelclaimPage, 
    // AllClaimhistoryPage,
    // PrintclaimPage,
    // GiftclaimPage,
    // OvertimeclaimPage,
    // EntertainmentclaimPage,
    // MiscellaneousClaimPage,
    // AllClaimListPage, 
    /* Should be loaded only when using setup */
  

    SetupguidePage,
    StatesetupPage,
    SetupPage,
    ModulesetupPage, 
    DeviceSetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    PermissionPage,
    DesignationsetupPage,
    DepartmentsetupPage,
    MileagesetupPage,
    RolesetupPage,
    AdminsetupPage,
    PaymenttypesetupPage,
    PagesetupPage,
    CountrysetupPage,
    SubmodulesetupPage,
    TranslatePage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    RolemodulesetupPage,
    CustomerSetupPage,
    OtRateSetupPage,

    SettingsPage,
    CompanysettingsPage,
    DbmaintenancePage,
    ApprovalProfilePage,
    ImportExcelDataPage,

    /* */

    /* Should be loaded only when doing travel claims */
    // TravelClaimViewPage,
    // AddTollPage,

    TabsPage,
    // ApproverTaskListPage,
    
    // EntertainmentClaimViewPage,
    // MedicalClaimViewPage,
    // OvertimeClaimViewPage,
    // PrintClaimViewPage,
    // GiftClaimViewPage,
    // MiscellaneousClaimViewPage,
    UserPage,
    SocRegistrationPage,
    // TravelclaimPage,
    ProfileSetupPage,
 
    // ClaimhistoryPage,
    // ClaimhistorydetailPage,
    // ClaimapprovertasklistPage,
    // ClaimtasklistPage,
    // UserclaimslistPage,
    // ClaimReportPage,
    // MonthlyClaimReportPage,
    UploadPage,

    ChangePasswordPage,
    // ClaimReportUserPage,
    // ClaimReportPrintPage,
    // LeaveReportPage,
    AttendanceReportPage,
    // FinancePaymentTasklistPage,
    // CommonTasklistPage,
    // PaymentHistoryPage,
    // CommonHistorylistPage,
    // ClaimSummaryPage,

    AccountPage

  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData, HttpClientModule, ApiManagerProvider,
    UserData, DatePipe, DecimalPipe,
    Services,

    Camera,
    ProfileManagerProvider,
    File,
    FilePath,
    FileTransfer,
    FileTransferObject,
    ApiManagerProvider, Transfer,
    SanitizerProvider,
    ToastProvider,
    CurrencyProvider,
    UploaderProvider,
  ]
})
export class AppModule { }
