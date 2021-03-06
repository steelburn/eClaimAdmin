import { Base_Model } from './base_model';
export class UserSpouse_Model extends Base_Model {
    constructor() {
        super();
    }

    public SPOUSE_GUID: string = null;
    public NAME: string = null;
    public ICNO: string = null;
    public USER_GUID: string = null;


    static fromJson(json: UserSpouse_Model) {
        if (!json) return;
        return (
            json.SPOUSE_GUID,
            json.NAME,
            json.ICNO,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,
            json.USER_GUID
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            SPOUSE_GUID: this.SPOUSE_GUID,
            NAME: this.NAME,
            ICNO: this.ICNO,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,
            USER_GUID: this.USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}