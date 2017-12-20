export class ViewUser_Model {
	constructor(
        public USER_GUID: string = null,
        public name: string = null,
        public maritalstatus: string = null,
        public personidtype: string = null,
        public personid: string = null,
        public dob: string = null,
        public gender: string = null,
        public email: string = null,
        public contactno: string = null,
        public companyno: string = null,
    ) { }
    static fromJson(json: any) {
		if (!json) return;
		return new ViewUser_Model(
			json.USER_GUID,
		    json.name,
			json.maritalstatus,
            json.personidtype,
            json.personid,
            json.dob,
            json.gender,
            json.email,
            json.contactno,
            json.companyno,
		);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			USER_GUID:this.USER_GUID,
			name:this.name,
            maritalstatus:this.maritalstatus,
            personidtype:this.personidtype,
            personid:this.personid,
            dob:this.dob,
            gender:this.gender,
            email:this.email,
            contactno:this.contactno,
            companyno:this.companyno,
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

