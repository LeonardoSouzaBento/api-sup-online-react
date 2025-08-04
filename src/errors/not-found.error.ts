import { ErrorBase } from "./base.errors";

export class NotFoundError extends ErrorBase{
    constructor(message: string){
        super(404, message);
    }
}