import {Injectable} from '@angular/core';
import {Http} from '@angular/http';


@Injectable()
export class BaseHttpService {

	static token:string = '';

	http: Http;

	constructor(http: Http) {
		this.http = http;
	}
}

