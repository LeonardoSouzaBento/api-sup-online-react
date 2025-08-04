import { ErrorBase } from "./base.errors";

export class ForbiddenError extends ErrorBase{
    constructor(message = "Não autorizado") {
        super(403, message);
    }
}