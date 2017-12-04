export class SOC_Model {
	constructor(
		public soc: string = null,
		public project_name: string = null,
		public customer_name: string = null,
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new SOC_Model(
			json.soc,
			json.project_name,
			json.customer_name,
		     
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			soc:this.soc,
			project_name:this.project_name,
			customer_name:this.customer_name,
           
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}
