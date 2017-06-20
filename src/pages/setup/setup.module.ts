import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetupPage } from './setup';

@NgModule({
  declarations: [
    SetupPage,
  ],
  imports: [
    IonicPageModule.forChild(SetupPage),
  ],
  exports: [
    SetupPage
  ]
})
export class SetupPageModule {}
