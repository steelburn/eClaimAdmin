import { Base_Model } from './base_model';
export class Leave_Raw_Data_Model extends Base_Model {
    constructor() {
        super();
    }

    public STAFF_ID: string = null;
    public TITLE: string = null;
    public START_DATE: string = null;
    public END_DATE: string = null;
    public LEAVE_ID: string = null;
    public HALF_DAY_DATE: string = null;
    public SESSION: string = null; 

    static fromJson(json: Leave_Raw_Data_Model) {
        if (!json) return;
        return (
            json.STAFF_ID,
            json.TITLE,
            json.START_DATE,
            json.END_DATE,
            json.LEAVE_ID,
            json.HALF_DAY_DATE,
            json.SESSION,

            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID
        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            STAFF_ID: this.STAFF_ID,
            TITLE: this.TITLE,
            START_DATE: this.START_DATE,
            END_DATE: this.END_DATE,
            LEAVE_ID: this.LEAVE_ID,
            HALF_DAY_DATE: this.HALF_DAY_DATE,
            SESSION: this.SESSION,
            
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}