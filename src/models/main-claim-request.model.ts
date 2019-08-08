import { Base_Model } from './base_model';
export class MainClaimRequestModel extends Base_Model {
  constructor() {
    super();
  }

  public CLAIM_REQUEST_GUID: string = null;
  public SOC_GUID: string = null;
  public CUSTOMER_GUID: number = null;
  public TENANT_GUID: string = null;
  public CLAIM_REF_GUID: string = null;
  public CLAIM_TYPE_GUID: string = null;
  public MILEAGE_GUID: string = null;
  public ALLOWANCE_GUID: string = null;
  public START_TS: string = null;
  public END_TS: string = null;
  public FROM: string = null;
  public DESTINATION: string = null;
  public DISTANCE_KM: number = null;
  public DESCRIPTION: string = null;
  public MILEAGE_AMOUNT: number = null;
  public CLAIM_AMOUNT: number = null;
  public ROUND_TRIP: number = null;
  public CALENDAR_REF: string = null;
  public TRAVEL_DATE: string = null;
  public STATUS: string = null;
  public STATUS_REMARKS: string = null;
  public STAGE: string = null;
  public STAGE_REMARKS: string = null;
  public ASSIGNED_TO: string = null;
  public PROFILE_JSON: string = null;
  public PROFILE_LEVEL: number = null;
  public PREVIOUS_LEVEL: number = null;
  public ATTACHMENT_ID: string = null;
  public TRAVEL_TYPE: string = null;
  public claim_method_guid: string = null;
  public from_place_id: string = null;
  public to_place_id: string = null;
  public AUDIT_TRAIL: string = null;

  static fromJson(json: any) {
    if (!json) return;
    return (
      json.CLAIM_REQUEST_GUID,
      json.SOC_GUID,
      json.CUSTOMER_GUID, json.TENANT_GUID,
      json.CLAIM_REF_GUID,
      json.CLAIM_TYPE_GUID,
      json.MILEAGE_GUID,
      json.ALLOWANCE_GUID,
      json.START_TS,
      json.END_TS,
      json.FROM,
      json.DESTINATION,
      json.DISTANCE_KM,
      json.DESCRIPTION,
      json.MILEAGE_AMOUNT,
      json.CLAIM_AMOUNT,
      json.ROUND_TRIP,
      json.CALENDAR_REF,
      json.TRAVEL_DATE,
      json.STATUS,
      json.STATUS_REMARKS,
      json.STAGE,
      json.STAGE_REMARKS, json.ASSIGNED_TO,
      json.PROFILE_JSON,
      json.PROFILE_LEVEL,
      json.PREVIOUS_LEVEL,
      json.CREATION_TS,
      json.CREATION_USER_GUID,
      json.UPDATE_TS,
      json.UPDATE_USER_GUID,
      json.ATTACHMENT_ID,
      json.TRAVEL_TYPE,
      json.claim_method_guid,
      json.from_place_id,
      json.to_place_id,
      json.AUDIT_TRAIL
    );
  }

  toJson(stringify?: boolean): any {
    var doc = {
      CLAIM_REQUEST_GUID: this.CLAIM_REQUEST_GUID,
      SOC_GUID: this.SOC_GUID,
      CUSTOMER_GUID: this.CUSTOMER_GUID, TENANT_GUID: this.TENANT_GUID,
      CLAIM_REF_GUID: this.CLAIM_REF_GUID,
      CLAIM_TYPE_GUID: this.CLAIM_TYPE_GUID,
      MILEAGE_GUID: this.MILEAGE_GUID,
      ALLOWANCE_GUID: this.ALLOWANCE_GUID,
      START_TS: this.START_TS,
      END_TS: this.END_TS,
      FROM: this.FROM,
      DESTINATION: this.DESTINATION,
      DISTANCE_KM: this.DISTANCE_KM,
      DESCRIPTION: this.DESCRIPTION,
      MILEAGE_AMOUNT: this.MILEAGE_AMOUNT,
      CLAIM_AMOUNT: this.CLAIM_AMOUNT,
      ROUND_TRIP: this.ROUND_TRIP,
      CALENDAR_REF: this.CALENDAR_REF,
      TRAVEL_DATE: this.TRAVEL_DATE,
      STATUS: this.STATUS,
      STATUS_REMARKS: this.STATUS_REMARKS,
      STAGE: this.STAGE,
      STAGE_REMARKS: this.STAGE_REMARKS, ASSIGNED_TO: this.ASSIGNED_TO,
      CREATION_TS: this.CREATION_TS,
      PROFILE_JSON: this.PROFILE_JSON,
      PROFILE_LEVEL: this.PROFILE_LEVEL,
      PREVIOUS_LEVEL: this.PREVIOUS_LEVEL,
      ATTACHMENT_ID: this.ATTACHMENT_ID,
      CREATION_USER_GUID: this.CREATION_USER_GUID,
      UPDATE_TS: this.UPDATE_TS,
      UPDATE_USER_GUID: this.UPDATE_USER_GUID,
      TRAVEL_TYPE: this.TRAVEL_TYPE,
      claim_method_guid: this.claim_method_guid,
      from_place_id: this.from_place_id,
      to_place_id: this.to_place_id,
      AUDIT_TRAIL: this.AUDIT_TRAIL
    };
    return stringify ? JSON.stringify({ resource: [doc] }) : doc;
  }
}
