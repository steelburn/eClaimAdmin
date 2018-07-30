import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimReportPrintPage } from './claim-report-print';

@NgModule({
  declarations: [
    ClaimReportPrintPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimReportPrintPage),
  ],
})
export class ClaimReportPrintPageModule {}
