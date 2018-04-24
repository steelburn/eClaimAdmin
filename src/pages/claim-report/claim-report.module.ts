import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimReportPage } from './claim-report';

@NgModule({
  declarations: [
    ClaimReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimReportPage),
  ],
})
export class ClaimReportPageModule {}
