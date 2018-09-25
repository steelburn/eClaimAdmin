export class SocCustomer_Model {
    constructor(
        public CUSTOMER_GUID: string = null,
        public TENANT_GUID: string = null,
        public NAME: string = null,
        public DESCRIPTION: string = null,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
        public ACTIVE_FLAG: string = null,
    ) { }

    static fromJson(json: any) {
        if (!json) return;
        return new SocCustomer_Model(
            json.CUSTOMER_GUID,
            json.TENANT_GUID,
            json.NAME,
            json.DESCRIPTION,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.ACTIVE_FLAG,
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            CUSTOMER_GUID: this.CUSTOMER_GUID,
            TENANT_GUID: this.TENANT_GUID,
            NAME: this.NAME,
            DESCRIPTION: this.DESCRIPTION,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            ACTIVE_FLAG: this.ACTIVE_FLAG,
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}