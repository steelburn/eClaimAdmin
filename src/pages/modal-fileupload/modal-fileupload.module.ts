import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalFileuploadPage } from './modal-fileupload';

@NgModule({
  declarations: [
    ModalFileuploadPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalFileuploadPage),
  ],
})
export class ModalFileuploadPageModule {}
