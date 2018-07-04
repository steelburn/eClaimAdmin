export class SocProject_Model {
    constructor(
        public PROJECT_GUID: string = null,
        public NAME: string = null,
        public CUSTOMER_GUID: string = null,
        public CUSTOMER_LOCATION_GUID: string = null,
        public TENANT_GUID: string = null,
        public ACTIVATION_FLAG: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }


    static fromJson(json: any) {
        if (!json) return;
        return new SocProject_Model(
            json.PROJECT_GUID,
            json.NAME,
            json.CUSTOMER_GUID,
            json.CUSTOMER_LOCATION_GUID,
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
            PROJECT_GUID: this.PROJECT_GUID,
            NAME: this.NAME,
            CUSTOMER_GUID: this.CUSTOMER_GUID,
            CUSTOMER_LOCATION_GUID: this.CUSTOMER_LOCATION_GUID,
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



