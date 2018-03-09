import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedicalClaimViewPage } from './medical-claim-view';

@NgModule({
  declarations: [
    MedicalClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(MedicalClaimViewPage),
  ],
})
export class MedicalClaimViewPageModule {}
