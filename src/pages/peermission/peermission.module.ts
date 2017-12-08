import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeermissionPage } from './peermission';

@NgModule({
  declarations: [
    PeermissionPage,
  ],
  imports: [
    IonicPageModule.forChild(PeermissionPage),
  ],
  exports: [
    PeermissionPage
  ]
})
export class PeermissionPageModule {}
