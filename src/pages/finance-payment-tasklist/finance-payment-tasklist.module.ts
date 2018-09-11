import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancePaymentTasklistPage } from './finance-payment-tasklist';

@NgModule({
  declarations: [
    FinancePaymentTasklistPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancePaymentTasklistPage),
  ],
})
export class FinancePaymentTasklistPageModule {}
