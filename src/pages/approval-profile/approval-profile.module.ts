import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApprovalProfilePage } from './approval-profile';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ApprovalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ApprovalProfilePage),TranslateModule.forChild(),
  ],
})
export class ApprovalProfilePageModule {}
