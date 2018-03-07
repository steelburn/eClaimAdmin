import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserclaimslistPage } from './userclaimslist';

@NgModule({
  declarations: [
    UserclaimslistPage,
  ],
  imports: [
    IonicPageModule.forChild(UserclaimslistPage),
  ],
})
export class UserclaimslistPageModule {}
