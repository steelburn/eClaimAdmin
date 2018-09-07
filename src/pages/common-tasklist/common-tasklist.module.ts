import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonTasklistPage } from './common-tasklist';

@NgModule({
  declarations: [
    CommonTasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonTasklistPage),
  ],
})
export class CommonTasklistPageModule {}
