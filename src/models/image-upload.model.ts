export class ImageUpload_model {
	constructor(
		public Image_Guid: string = null,
		public IMAGE_URL: string = null,
		public CREATION_TS: string = null,
		public Update_Ts: string = null,
	) { }


	static fromJson(json: any) {
		if (!json) return;
		return new ImageUpload_model(
			json.Image_Guid,
		    json.IMAGE_URL,
			json.CREATION_TS,
			json.Update_Ts
		);
    }
    
	toJson(stringify?: boolean): any {
		var doc = {
			Image_Guid:this.Image_Guid,
			IMAGE_URL:this.IMAGE_URL,
            CREATION_TS:this.CREATION_TS,
			Update_Ts:this.Update_Ts
		};
		return stringify ? JSON.stringify({ resource: [doc] }) : doc;
	}
}



