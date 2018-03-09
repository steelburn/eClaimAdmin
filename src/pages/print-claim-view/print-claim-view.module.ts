import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintingClaimViewPage } from './printing-claim-view';

@NgModule({
  declarations: [
    PrintingClaimViewPage,
  ],
  imports: [
    IonicPageModule.forChild(PrintingClaimViewPage),
  ],
})
export class PrintClaimViewPageModule {}
