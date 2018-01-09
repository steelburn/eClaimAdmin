export class View_Dropdown_Model {
	constructor(
        public USER_GUID: string = null,
        public DESIGNATION_GUID: string = null,
        public DEPT_GUID: string = null,
        public TENANT_COMPANY_GUID: string = null,
        public JOIN_DATE: string =null,
        public CONFIRMATION_DATE: string =null,
        public RESIGNATION_DATE: string =null,
        public BRANCH: string = null,
        public EMPLOYEE_TYPE: string =null,
        public APPROVER1: string =null,
        public APPROVER2: string =null,
        public EMPLOYEE_STATUS: string =null,
       
    ) { }
    static fromJson(json: any) {
		if (!json) return;
		return new View_Dropdown_Model(
		    json.USER_GUID,
            json.DESIGNATION_GUID,
            json.DEPT_GUID,
            json.TENANT_COMPANY_GUID,
            json.JOIN_DATE,
            json.CONFIRMATION_DATE,
            json.RESIGNATION_DATE,
            json.BRANCH,
            json.EMPLOYEE_TYPE,
            json.APPROVER1,
            json.APPROVER2,
            json.EMPLOYEE_STATUS
         
    	);
    }
    toJson(stringify?: boolean): any {
		var doc = {
			USER_GUID:this.USER_GUID,
			DESIGNATION_GUID:this.DESIGNATION_GUID,
            DEPT_GUID:this.DEPT_GUID,
            TENANT_COMPANY_GUID:this.TENANT_COMPANY_GUID,
            JOIN_DATE:this.JOIN_DATE,
            CONFIRMATION_DATE:this.CONFIRMATION_DATE,
            RESIGNATION_DATE:this.RESIGNATION_DATE,
            BRANCH:this.BRANCH,
            EMPLOYEE_TYPE:this.EMPLOYEE_TYPE,
            APPROVER1:this.APPROVER1,
            APPROVER2:this.APPROVER2,
            EMPLOYEE_STATUS:this.EMPLOYEE_STATUS
          
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}

