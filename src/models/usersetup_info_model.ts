import { Base_Model } from './base_model';
export class UserInfo_Model extends Base_Model {
    constructor() {
        super();
    }

    public USER_INFO_GUID: string = null;
    public USER_GUID: string = null;
    public FULLNAME: string = null;
    public NICKNAME: string = null;
    public SALUTATION: string = null;
    public MANAGER_USER_GUID: string = null;
    public PERSONAL_ID_TYPE: string = null;
    public PERSONAL_ID: string = null;
    public DOB: string = null;
    public GENDER: string = null;
    public JOIN_DATE: string = null;
    public MARITAL_STATUS: string = null;
    public BRANCH: string = null;
    public EMPLOYEE_TYPE: string = null;
    public APPROVER1: string = null;
    public APPROVER2: string = null;
    public EMPLOYEE_STATUS: string = null;
    public DEPT_GUID: string = null;
    public DESIGNATION_GUID: string = null;
    public RESIGNATION_DATE: string = null;
    public TENANT_COMPANY_GUID: string = null;
    public CONFIRMATION_DATE: string = null;
    public TENANT_COMPANY_SITE_GUID: string = null;
    public EMG_CONTACT_NAME_1: string = null;
    public EMG_RELATIONSHIP_1: string = null;
    public EMG_CONTACT_NUMBER_1: string = null;
    public EMG_CONTACT_NAME_2: string = null;
    public EMG_RELATIONSHIP_2: string = null;
    public EMG_CONTACT_NUMBER_2: string = null;
    public PR_EPF_NUMBER: string = null;
    public PR_INCOMETAX_NUMBER: string = null;
    public BANK_GUID: string = null;
    public PR_ACCOUNT_NUMBER: string = null;
    public ATTACHMENT_ID: string = null;

    static fromJson(json: UserInfo_Model) {
        if (!json) return;
        return (
            json.USER_INFO_GUID,
            json.USER_GUID,
            json.FULLNAME,
            json.NICKNAME,
            json.SALUTATION,
            json.MANAGER_USER_GUID,
            json.PERSONAL_ID_TYPE,
            json.PERSONAL_ID,
            json.DOB,
            json.GENDER,
            json.JOIN_DATE,
            json.MARITAL_STATUS,
            json.BRANCH,
            json.EMPLOYEE_TYPE,
            json.APPROVER1,
            json.APPROVER2,
            json.EMPLOYEE_STATUS,
            json.DEPT_GUID,
            json.DESIGNATION_GUID,
            json.RESIGNATION_DATE,
            json.TENANT_COMPANY_GUID,
            json.CONFIRMATION_DATE,
            json.TENANT_COMPANY_SITE_GUID,
            json.CREATION_TS,
            json.CREATION_USER_GUID,
            json.UPDATE_TS,
            json.UPDATE_USER_GUID,

            // json.POST_CODE,
            // json.COUNTRY_GUID,
            // json.STATE_GUID,
            json.EMG_CONTACT_NAME_1,
            json.EMG_RELATIONSHIP_1,
            json.EMG_CONTACT_NUMBER_1,
            json.EMG_CONTACT_NAME_2,
            json.EMG_RELATIONSHIP_2,
            json.EMG_CONTACT_NUMBER_2,
            json.PR_EPF_NUMBER,
            json.PR_INCOMETAX_NUMBER,
            json.BANK_GUID,
            json.PR_ACCOUNT_NUMBER,
            json.ATTACHMENT_ID

        );
    }
    toJson(stringify?: boolean): any {
        var doc = {
            USER_INFO_GUID: this.USER_INFO_GUID,
            USER_GUID: this.USER_GUID,
            FULLNAME: this.FULLNAME,
            NICKNAME: this.NICKNAME,
            SALUTATION: this.SALUTATION,
            MANAGER_USER_GUID: this.MANAGER_USER_GUID,
            PERSONAL_ID_TYPE: this.PERSONAL_ID_TYPE,
            PERSONAL_ID: this.PERSONAL_ID,
            DOB: this.DOB,
            GENDER: this.GENDER,
            JOIN_DATE: this.JOIN_DATE,
            MARITAL_STATUS: this.MARITAL_STATUS,
            BRANCH: this.BRANCH,
            EMPLOYEE_TYPE: this.EMPLOYEE_TYPE,
            APPROVER1: this.APPROVER1,
            APPROVER2: this.APPROVER2,
            EMPLOYEE_STATUS: this.EMPLOYEE_STATUS,
            DEPT_GUID: this.DEPT_GUID,
            DESIGNATION_GUID: this.DESIGNATION_GUID,
            RESIGNATION_DATE: this.RESIGNATION_DATE,
            TENANT_COMPANY_GUID: this.TENANT_COMPANY_GUID,
            CONFIRMATION_DATE: this.CONFIRMATION_DATE,
            TENANT_COMPANY_SITE_GUID: this.TENANT_COMPANY_SITE_GUID,
            CREATION_TS: this.CREATION_TS,
            CREATION_USER_GUID: this.CREATION_USER_GUID,
            UPDATE_TS: this.UPDATE_TS,
            UPDATE_USER_GUID: this.UPDATE_USER_GUID,

            // POST_CODE: this.POST_CODE,
            // COUNTRY_GUID: this.COUNTRY_GUID,
            // STATE_GUID: this.STATE_GUID,
            EMG_CONTACT_NAME_1: this.EMG_CONTACT_NAME_1,
            EMG_RELATIONSHIP_1: this.EMG_RELATIONSHIP_1,
            EMG_CONTACT_NUMBER_1: this.EMG_CONTACT_NUMBER_1,
            EMG_CONTACT_NAME_2: this.EMG_CONTACT_NAME_2,
            EMG_RELATIONSHIP_2: this.EMG_RELATIONSHIP_2,
            EMG_CONTACT_NUMBER_2: this.EMG_CONTACT_NUMBER_2,
            PR_EPF_NUMBER: this.PR_EPF_NUMBER,
            PR_INCOMETAX_NUMBER: this.PR_INCOMETAX_NUMBER,
            BANK_GUID: this.BANK_GUID,
            PR_ACCOUNT_NUMBER: this.PR_ACCOUNT_NUMBER,
            ATTACHMENT_ID: this.ATTACHMENT_ID
        };
        return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
}

