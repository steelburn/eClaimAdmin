import { Base_Activation_Model } from './base_model';
export class TenantMainSetup_Model extends Base_Activation_Model {
  constructor() {
    super();
  }
  
  public TENANT_GUID: string = null;
  public PARENT_TENANT_GUID: string = null;
  public TENANT_ACCOUNT_NAME: string = null;

    static fromJson(json: any) {
		if (!json) return;
		return (
			json.TENANT_GUID,
		    json.PARENT_TENANT_GUID,
			json.TENANT_ACCOUNT_NAME,
            json.ACTIVATION_FLAG,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
		);
    }
    toJson(stringify?: boolean): any {
		var doc = {
            TENANT_GUID:this.TENANT_GUID,
            PARENT_TENANT_GUID:this.PARENT_TENANT_GUID,
            TENANT_ACCOUNT_NAME:this.TENANT_ACCOUNT_NAME,
            ACTIVATION_FLAG:this.ACTIVATION_FLAG,
            CREATION_TS:this.CREATION_TS,
            CREATION_USER_GUID:this.CREATION_USER_GUID,
            UPDATE_TS:this.UPDATE_TS,
            UPDATE_USER_GUID:this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

