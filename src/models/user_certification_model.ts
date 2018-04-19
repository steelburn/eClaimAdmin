export class UserCertification_Model {
    constructor(
        public certificate_guid: string = null,
        public name: string = null,
        public grade: string = null,
        public passing_year: string = null,
        public user_guid: string = null,
        public creation_ts: string = null,
        public creation_user_guid: string = null,
        public update_ts: string = null,
        public update_user_guid: string = null,
        public attachment: string = null
    ) { }


    static fromJson(json: any) {
        if (!json) return;
        return new UserCertification_Model(
            json.certificate_guid,
            json.name,
            json.grade,
            json.passing_year,
            json.user_guid,
            json.creation_ts,
            json.creation_user_guid,
            json.update_ts,
            json.update_user_guid,
            json.attachment
        );
    }

    toJson(stringify?: boolean): any {
        var doc = {
            certificate_guid: this.certificate_guid,
            name: this.name,
            grade: this.grade,
            passing_year: this.passing_year,
            user_guid: this.user_guid,
            creation_ts: this.creation_ts,
            creation_user_guid: this.creation_user_guid,
            update_ts: this.update_ts,
            update_user_guid: this.update_user_guid,
            attachment: this.attachment
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}