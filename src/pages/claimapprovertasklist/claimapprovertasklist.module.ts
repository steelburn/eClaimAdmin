import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimapprovertasklistPage } from './claimapprovertasklist';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ClaimapprovertasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimapprovertasklistPage), TranslateModule.forChild()
  ],
})
export class ClaimapprovertasklistPageModule {}
