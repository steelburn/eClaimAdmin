export class View_SOC_Model {
	constructor(
		public SOC_GUID: string = null,
		public TENANT_GUID: string = null,
		public soc: string = null,
		public project_name: string = null,
		public customer_name: string = null,
		public ACTIVATION_FLAG: string = null,
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new View_SOC_Model(
			json.SOC_GUID,
			json.TENANT_GUID,
			json.soc,
			json.project_name,
			json.customer_name,
			json.ACTIVATION_FLAG,
		);
	}

	toJson(stringify?: boolean): any {
		var doc = {
			SOC_GUID: this.SOC_GUID,
			TENANT_GUID: this.TENANT_GUID,
			soc: this.soc,
			project_name: this.project_name,
			customer_name: this.customer_name,
			ACTIVATION_FLAG: this.ACTIVATION_FLAG,
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}
