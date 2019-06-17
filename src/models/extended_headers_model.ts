import { DREAMFACTORY_API_KEY } from "../app/config/constants";

export class extendedHeaders extends Headers {
    constructor() {
        super(this.append, delete, this.get, this.has, this.set, this.forEach );
        this.append('Content-Type', 'application/json');
        this.append('X-Dreamfactory-API-Key', DREAMFACTORY_API_KEY);
    }
  }

/*   this.append('Content-Type', 'application/json');
  this.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
 */