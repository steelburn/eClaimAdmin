import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimtasklistPage } from './claimtasklist';

@NgModule({
  declarations: [
    ClaimtasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimtasklistPage),
  ],
})
export class ClaimtasklistPageModule {}
