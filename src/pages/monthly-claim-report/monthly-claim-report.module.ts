import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthlyClaimReportPage } from './monthly-claim-report';

@NgModule({
  declarations: [
    MonthlyClaimReportPage,
  ],
  imports: [
    IonicPageModule.forChild(MonthlyClaimReportPage),
  ],
})
export class MonthlyClaimReportPageModule {}
