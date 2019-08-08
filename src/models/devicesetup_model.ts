import { Base_Activation_Model } from './base_model';
export class DeviceSetup_Model extends Base_Activation_Model {
	constructor() {
		super();
	}


	public DEVICE_GUID: string = null;
	public DEVICE_NAME: string = null;
	public ROLE: string = null;
	public TENANT_GUID: string = null;


	static fromJson(json: any) {
		if (!json) return;
		return (
			json.DEVICE_GUID,
			json.DEVICE_NAME,
            json.ROLE,
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
			DEVICE_GUID: this.DEVICE_GUID,
			DEVICE_NAME: this.DEVICE_NAME,
            ROLE: this.ROLE,
            TENANT_GUID: this.TENANT_GUID,
            ACTIVATION_FLAG: this.ACTIVATION_FLAG,
            DESCRIPTION: this.ROLE,
			CREATION_TS: this.CREATION_TS,
			CREATION_USER_GUID: this.CREATION_USER_GUID,
			UPDATE_TS: this.UPDATE_TS,
			UPDATE_USER_GUID: this.UPDATE_USER_GUID
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}