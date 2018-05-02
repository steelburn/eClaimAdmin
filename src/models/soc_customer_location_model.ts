export class SocCustomerLocation_Model {
    constructor(
        public CUSTOMER_GUID: string = null,
        public CUSTOMER_LOCATION_GUID: string = null,
        public NAME: string = null,
        public DESCRIPTION: string = null,
        public REGISTRATION_NO: string = null,
        public ADDRESS1: string = null,
        public ADDRESS2: string = null,
        public ADDRESS3: string = null,
        public CONTACT_PERSON: string = null,
        public CONTACT_PERSON_MOBILE_NO: string = null,
        public CONTACT_NO1: string = null,
        public CONTACT_NO2: string = null,
        public EMAIL: string = null,
        public DIVISION: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
    ) { }

    static fromJson(json: any) {
        if (!json) return;
        return new SocCustomerLocation_Model(
            json.CUSTOMER_GUID,
            json.CUSTOMER_LOCATION_GUID,
            json.NAME,
            json.DESCRIPTION,
            json.REGISTRATION_NO,
            json.ADDRESS1,
            json.ADDRESS2,
            json.ADDRESS3,
            json.CONTACT_PERSON,
            json.CONTACT_PERSON_MOBILE_NO,
            json.CONTACT_NO1,
            json.CONTACT_NO2,
            json.EMAIL,
            json.DIVISION,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            CUSTOMER_GUID: this.CUSTOMER_GUID,
            CUSTOMER_LOCATION_GUID: this.CUSTOMER_LOCATION_GUID,
            NAME: this.NAME,
            DESCRIPTION: this.DESCRIPTION,
            RIGISTRATION_NO: this.REGISTRATION_NO,
            ADDRESS1: this.ADDRESS1,
            ADDRESS2: this.ADDRESS2,
            ADDRESS3: this.ADDRESS3,
            CONTACT_PERSON: this.CONTACT_PERSON,
            CONTACT_PERSON_MOBILE_NO: this.CONTACT_PERSON_MOBILE_NO,
            CONTACT_NO1: this.CONTACT_NO1,
            CONTACT_NO2: this.CONTACT_NO2,
            EMAIL: this.EMAIL,
            DIVISION: this.DIVISION,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}



