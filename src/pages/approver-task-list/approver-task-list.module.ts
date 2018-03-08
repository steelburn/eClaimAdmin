import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApproverTaskListPage } from './approver-task-list';

@NgModule({
  declarations: [
    ApproverTaskListPage,
  ],
  imports: [
    IonicPageModule.forChild(ApproverTaskListPage),
  ],
})
export class ApproverTaskListPageModule {}
