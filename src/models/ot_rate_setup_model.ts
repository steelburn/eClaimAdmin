export class OTRateSetup_Model {
	constructor(
		public ot_rate_guid: string = null,		
		public hours: string = null,
		public week_day_rate: string = null,		
	 	public week_end_rate: string = null,
		public tenant_guid: string = null
	) { }

	static fromJson(json: any) {
		if (!json) return;
		return new OTRateSetup_Model(
			json.ot_rate_guid,
			json.hours,
		    json.week_day_rate,
			json.week_end_rate,
			json.tenant_guid
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			ot_rate_guid:this.ot_rate_guid,
			hours:this.hours,
			week_day_rate:this.week_day_rate,
			week_end_rate:this.week_end_rate,
			tenant_guid:this.tenant_guid
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



