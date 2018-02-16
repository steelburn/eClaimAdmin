import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimhistoryPage } from './claimhistory';

@NgModule({
  declarations: [
    ClaimhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimhistoryPage),
  ],
  exports: [
    ClaimhistoryPage
  ]
})
export class ClaimhistoryPageModule {}
