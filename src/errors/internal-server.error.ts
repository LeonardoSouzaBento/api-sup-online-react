import { ErrorBase } from "./base.errors"

export class InternalServerError extends ErrorBase{
    constructor(message = "Erro interno do servidor"){
        super(500, message);
    }
}