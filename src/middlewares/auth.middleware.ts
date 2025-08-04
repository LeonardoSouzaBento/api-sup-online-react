import express, { NextFunction, Response, Request } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { UserService } from "../services/user.service";
import { ForbiddenError } from "../errors/forbidden.error";

export const auth = (app: express.Express) => {
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (
      req.method === "POST" &&
      (req.url.startsWith("/auth/login") ||
        req.url.startsWith("/auth/recovery") ||
        req.url.startsWith("/auth/login-google"))
    ) {
      return next();
    } else if (token) {
      try {
        const decodeIdToken: DecodedIdToken = await getAuth().verifyIdToken(
          token,
          false
        );
        const user = await new UserService().getById(decodeIdToken.uid);
        if (!user) {
          return next(new ForbiddenError());
        }
        req.user = user;
        return next();
      } catch (error) {
        next(new UnauthorizedError());
      }
    }
    next(new UnauthorizedError());
  });
};
