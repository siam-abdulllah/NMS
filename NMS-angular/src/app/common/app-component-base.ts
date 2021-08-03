import { PrimengTableHelper } from '../helpers/PrimengTableHelper';

export abstract class AppComponentBase{
    primengTableHelper: PrimengTableHelper;
    
    constructor() {
        this.primengTableHelper = new PrimengTableHelper();
    }
}