import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiManagerProvider } from '../../providers/api-manager.provider';
import { ProfileManagerProvider } from '../../providers/profile-manager.provider';
import { MiscellaneousClaimPage } from '../../pages/miscellaneous-claim/miscellaneous-claim';


@IonicPage()
@Component({
  selector: 'page-miscellaneous-claim-view',
  templateUrl: 'miscellaneous-claim-view.html',
})
export class MiscellaneousClaimViewPage {
  claimRequestData: any[];
  totalClaimAmount: number = 0;
  Approver_GUID: any; level: any;
  claimRequestGUID: any;
  ToggleNgModel: any;
  Remarks_NgModel: any;
  isRemarksAccepted: any;

  constructor(public profileMngProvider: ProfileManagerProvider, public api: ApiManagerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.claimRequestGUID = this.navParams.get("cr_GUID");
    this.Approver_GUID = this.navParams.get("approver_GUID");
    //  this.userGUID = localStorage.getItem('g_USER_GUID');
    this.level = localStorage.getItem('level_no');
    this.LoadMainClaim();

    // this.api.LoadMainClaim(this.claimRequestGUID).then((totalAmount: number) => {
    //   this.totalClaimAmount = totalAmount;
    // })
  }

  isAccepted(event: any) {
    this.ToggleNgModel = event.checked;
    this.isRemarksAccepted = event.checked;
  }

  LoadMainClaim() {
    this.api.getApiModel('view_claim_request', 'filter=CLAIM_REQUEST_GUID=' + this.claimRequestGUID).subscribe(res => {
      this.claimRequestData = res['resource'];
      this.claimRequestData.forEach(element => {
        this.totalClaimAmount = element.MILEAGE_AMOUNT;
      });
    })
}

  SubmitAction() {
    if (!this.ToggleNgModel) {
      if (this.Remarks_NgModel === undefined) {
        alert('Please input valid Remarks');
        return;
      }
    }
    this.profileMngProvider.ProcessProfileMng(this.Remarks_NgModel, this.Approver_GUID, this.level, this.claimRequestGUID, this.isRemarksAccepted);
  }

  EditClaim() {
    this.navCtrl.push(MiscellaneousClaimPage, {
      isFormEdit: 'true',
      cr_GUID: this.claimRequestGUID
    });
  }
 
}
