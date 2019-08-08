import { Base_Activation_Model } from './base_model';
export class UserRole_Model extends Base_Activation_Model {
    constructor() {
        super();
    }

    public USER_ROLE_GUID: string = null;
    public USER_GUID: string = null;
    public ROLE_GUID: string = null;
    public ROLE_FLAG: string = null;

    static fromJson(json: UserRole_Model) {
        if (!json) return;
        return (
            json.USER_ROLE_GUID,
            json.USER_GUID,
            json.ROLE_GUID,
            json.ACTIVATION_FLAG,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.ROLE_FLAG
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_ROLE_GUID: this.USER_ROLE_GUID,
            USER_GUID: this.USER_GUID,
            ROLE_GUID: this.ROLE_GUID,
            ACTIVATION_FLAG: this.ACTIVATION_FLAG,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            ROLE_FLAG: this.ROLE_FLAG
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}

