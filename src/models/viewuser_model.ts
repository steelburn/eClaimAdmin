export class ViewUser_Model {
	constructor(
        public USER_GUID: string = null,
        public NAME: string = null,
        public MARITAL_STATUS: string = null,
        public PERSONAL_ID_TYPE: string = null,
        public PERSONAL_ID: string = null,
        public DOB: string = null,
        public GENDER: string = null,
        public EMAIL: string = null,
        public CONTACT_NO: string = null,
        public COMPANY_CONTACT_NO: string = null,
    ) { }
    static fromJson(json: any) {
		if (!json) return;
		return new ViewUser_Model(
			json.USER_GUID,
		    json.NAME,
			json.MARITAL_STATUS,
            json.PERSONAL_ID_TYPE,
            json.PERSONAL_ID,
            json.DOB,
            json.GENDER,
            json.EMAIL,
            json.CONTACT_NO,
            json.COMPANY_CONTACT_NO,
		);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			USER_GUID:this.USER_GUID,
			NAME:this.NAME,
            MARITAL_STATUS:this.MARITAL_STATUS,
            PERSONAL_ID_TYPE:this.PERSONAL_ID_TYPE,
            PERSONAL_ID:this.PERSONAL_ID,
            DOB:this.DOB,
            GENDER:this.GENDER,
            EMAIL:this.EMAIL,
            CONTACT_NO:this.CONTACT_NO,
            COMPANY_CONTACT_NO:this.COMPANY_CONTACT_NO,
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

