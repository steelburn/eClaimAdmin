export class Settings_Model {
    constructor(
        public PERMISSION_KEY_GUID: string = null,
        public KEY_NAME: string = null,
        public KEY_VALUE: string = null,
        public SHIFT_GUID: string = null,
        public DEVICE_GUID: string = null,
        public ROLE_GUID: string = null,
        public COMPANY_GUID: string = null,
        public TENANT_COMPANY_GUID: string = null,
        public TENANT_COMPANY_SITE_GUID: string = null,
        public DEPT_GUID: string = null,
        public USER_GUID: string = null,
        public TENANT_GUID: string = null,
        public CREATION_USER_GUID: string = null,
        public CREATION_TS: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null
    ) { }


    static fromJson(json: any) {
        if (!json) return;
        return new Settings_Model(
            json.PERMISSION_KEY_GUID,
            json.KEY_NAME,
            json.KEY_VALUE,
            json.SHIFT_GUID,
            json.DEVICE_GUID,
            json.ROLE_GUID,
            json.COMPANY_GUID,
            json.TENANT_COMPANY_GUID,
            json.TENANT_COMPANY_SITE_GUID,
            json.DEPT_GUID,
            json.USER_GUID,
            json.TENANT_GUID,
            json.CREATION_USER_GUID,
            json.CREATION_TS,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            PERMISSION_KEY_GUID: this.PERMISSION_KEY_GUID,
            KEY_NAME: this.KEY_NAME,
            KEY_VALUE: this.KEY_VALUE,
            SHIFT_GUID: this.SHIFT_GUID,
            DEVICE_GUID: this.DEVICE_GUID,
            ROLE_GUID: this.ROLE_GUID,
            COMPANY_GUID: this.COMPANY_GUID,
            TENANT_COMPANY_GUID: this.TENANT_COMPANY_GUID,
            TENANT_COMPANY_SITE_GUID: this.TENANT_COMPANY_SITE_GUID,
            DEPT_GUID: this.DEPT_GUID,
            USER_GUID: this.USER_GUID,
            TENANT_GUID: this.TENANT_GUID,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            CREATION_TS: this.CREATION_TS,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}



