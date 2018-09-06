import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonHistorylistPage } from './common-historylist';

@NgModule({
  declarations: [
    CommonHistorylistPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonHistorylistPage),
  ],
})
export class CommonHistorylistPageModule {}
