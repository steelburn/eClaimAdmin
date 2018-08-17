import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendanceReportPage } from './attendance-report';

@NgModule({
  declarations: [
    AttendanceReportPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceReportPage),
  ],
})
export class AttendanceReportPageModule {}
