import express from 'express';
import { NextFunction, Response, Request } from "express";
import { NotFoundError } from '../errors/not-found.error';

export const PageNotFoundHandler = (app: express.Express) => {
    app.use((req: Request, res: Response, next: NextFunction)=>{
        next(new NotFoundError("Página não encontrada"));
    })
}