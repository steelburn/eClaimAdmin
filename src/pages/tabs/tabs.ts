import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { SpeakerListPage } from '../home/home';
import { SetupPage } from '../setup/setup';
import { AdminsetupPage } from '../adminsetup/adminsetup';
import { ApproverTaskListPage } from '../approver-task-list/approver-task-list';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SpeakerListPage;
  tab2Root: any = SetupPage;
  tab3Root: any = AdminsetupPage;
  tab4Root: any = ApproverTaskListPage;

  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
