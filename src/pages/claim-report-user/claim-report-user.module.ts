import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimReportUserPage } from './claim-report-user';

@NgModule({
  declarations: [
    ClaimReportUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimReportUserPage),
  ],
})
export class ClaimReportUserPageModule {}
