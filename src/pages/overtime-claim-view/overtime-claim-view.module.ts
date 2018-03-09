import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OvertimeClaimViewPage } from './overtime-claim-view';

@NgModule({
  declarations: [
    OvertimeClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(OvertimeClaimViewPage),
  ],
})
export class OvertimeClaimViewPageModule {}
