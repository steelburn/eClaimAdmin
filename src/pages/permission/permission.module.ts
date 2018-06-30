import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PermissionPage } from './Permission';

@NgModule({
  declarations: [
    PermissionPage,
  ],
  imports: [
    IonicPageModule.forChild(PermissionPage),
  ],
  exports: [
    PermissionPage
  ]
})
export class PermissionPageModule {}
