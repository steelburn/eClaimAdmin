import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveReportPage } from './leave-report';

@NgModule({
  declarations: [
    LeaveReportPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveReportPage),
  ],
})
export class LeaveReportPageModule {}
