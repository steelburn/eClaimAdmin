import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimSummaryPage } from './claim-summary';

@NgModule({
  declarations: [
    ClaimSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimSummaryPage),
  ],
})
export class ClaimSummaryPageModule {}
