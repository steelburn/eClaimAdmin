import { Base_Activation_Model } from './base_model';
export class SocMain_Model extends Base_Activation_Model {
	constructor(

	) {
		super();
	}
	public SOC_GUID: string = null;
	public SOC_NO: string = null;
	public PROJECT_GUID: string = null;
	public TENANT_GUID: string = null;

	static fromJson(json: SocMain_Model) {
		if (!json) return;
		return (
			json.SOC_GUID,
			json.SOC_NO,
			json.PROJECT_GUID,
			json.TENANT_GUID,
			json.ACTIVATION_FLAG,
			json.CREATION_TS,
			json.CREATION_USER_GUID,
			json.UPDATE_TS,
			json.UPDATE_USER_GUID
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			SOC_GUID: this.SOC_GUID,
			SOC_NO: this.SOC_NO,
			PROJECT_GUID: this.PROJECT_GUID,
			TENANT_GUID: this.TENANT_GUID,
			ACTIVATION_FLAG: this.ACTIVATION_FLAG,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



