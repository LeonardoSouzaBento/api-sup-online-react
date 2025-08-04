import { ErrorBase } from "./base.errors";

export class emailAlreadyExistsError extends ErrorBase{
    constructor(message = "O e-mail fornecido já está sendo usado") {
        super(409, message);
    }
}