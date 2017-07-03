import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { BanksetupPage } from '../pages/banksetup/banksetup';
import { BranchsetupPage } from '../pages/branchsetup/branchsetup';
import { CashcardsetupPage } from '../pages/cashcardsetup/cashcardsetup';
import { ClaimtypePage } from '../pages/claimtype/claimtype';
import { CompanysetupPage } from '../pages/companysetup/companysetup';
import { DesignationsetupPage } from '../pages/designationsetup/designationsetup';
import { DepartmentsetupPage } from '../pages/departmentsetup/departmentsetup';
import { MapPage } from '../pages/map/map';
import { MileagesetupPage } from '../pages/mileagesetup/mileagesetup';
import { RolesetupPage } from '../pages/rolesetup/rolesetup';
import { PaymenttypesetupPage } from '../pages/paymenttypesetup/paymenttypesetup';
import { QualificationsetupPage } from '../pages/qualificationsetup/qualificationsetup';
import { SubsciptionsetupPage } from '../pages/subsciptionsetup/subsciptionsetup';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerListPage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TenantsetupPage } from '../pages/tenantsetup/tenantsetup';
import { SetupPage } from '../pages/setup/setup';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';


@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerListPage,
    SetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    DepartmentsetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    DesignationsetupPage,
    MileagesetupPage,
    RolesetupPage,
    PaymenttypesetupPage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:name' },
        { component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter' },
        { component: SpeakerListPage, name: 'Home', segment: 'Home' },
        { component: SetupPage, name: 'Setup', segment: 'Setup' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SetupPage,
    BanksetupPage,
    BranchsetupPage,
    CompanysetupPage,
    ClaimtypePage,
    CashcardsetupPage,
    DesignationsetupPage,
    DepartmentsetupPage,
    MileagesetupPage,
    RolesetupPage,
    PaymenttypesetupPage,
    QualificationsetupPage,
    SubsciptionsetupPage,
    TenantsetupPage,
    SpeakerListPage,
    TabsPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
