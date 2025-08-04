import { ErrorBase } from "./base.errors";

export class UnauthorizedError extends ErrorBase{
    constructor(message = "Não autorizado") {
     super(401, message);   
    }
}