import { ErrorBase } from "./base.errors"

export class ValidationError extends ErrorBase{
    constructor(message: string){
        super(400, message);
    }
}