import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntertainmentclaimPage } from './entertainmentclaim';

@NgModule({
  declarations: [
    EntertainmentclaimPage,
  ],
  imports: [
    IonicPageModule.forChild(EntertainmentclaimPage),
  ],
  exports: [
    EntertainmentclaimPage
  ]
})
export class EntertainmentclaimPageModule {}
