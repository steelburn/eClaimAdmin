export class ClaimWorkFlowHistory_Model {
    constructor(
      public CLAIM_REQUEST_GUID: string = null,
      public CLAIM_WFH_GUID: string = null,
      public REMARKS: string = null,
      public STATUS: string = null,
      public USER_GUID: string = null
  
    ) { }
  
  
    static fromJson(json: any) {
      if (!json) return;
      return new ClaimWorkFlowHistory_Model(
        json.CLAIM_REQUEST_GUID,
        json.CLAIM_WFH_GUID,
        json.REMARKS,
        json.STATUS,
        json.USER_GUID
      );
    }
  
    toJson(stringify?: boolean): any {
      var doc = {
        CLAIM_REQUEST_GUID: this.CLAIM_REQUEST_GUID,
        CLAIM_WFH_GUID: this.CLAIM_WFH_GUID,
        REMARKS: this.REMARKS,
        STATUS: this.STATUS,
        USER_GUID: this.USER_GUID
      };
      return stringify ? JSON.stringify({ resource: [doc] }) : doc;
    }
  }
  