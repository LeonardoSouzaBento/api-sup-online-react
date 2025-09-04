import express, { NextFunction, Response, Request } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";

export const authMiddleware = (app: express.Express) => {
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    // Permitir algumas rotas
    if (
      req.method === "POST" &&
      (req.url.startsWith("/auth-login-emil") ||
        req.url.startsWith("/auth-recovery") ||
        req.url.startsWith("/auth-login-anonymous"))
    ) {
      return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).send({ message: "Token não fornecido" });
    }

    try {
      const decodedIdToken: DecodedIdToken = await getAuth().verifyIdToken(
        token
      );
      const userService = new UserService();
      const user = await userService.getById(decodedIdToken.uid);

      if (!user && req.url.startsWith("/auth-login-google")) {
        const newUser = await createUserFromLoginGoogle(
          decodedIdToken.uid,
          res
        );
        if (!newUser) return; // a resposta já foi enviada em caso de erro
        req.user = newUser;
        return next();
      }
      
      req.user = user;
      return next();
    } catch {
      return next(new UnauthorizedError());
    }
  });
};

// função auxiliar para criar usuário do Google
async function createUserFromLoginGoogle(
  uid: string,
  res: Response
): Promise<User | null> {
  try {
    const googleUser = await getAuth().getUser(uid);

    const userService = new UserService();
    const user = await userService.saveFromGoogle({
      id: googleUser.uid,
      email: googleUser.email || "",
      nome: googleUser.displayName || "Sem Nome",
    });

    return user;
  } catch (error) {
    console.error("Erro ao criar usuário do Google:", error);
    res.status(500).send({ message: "Erro ao criar usuário do Google" });
    return null;
  }
}