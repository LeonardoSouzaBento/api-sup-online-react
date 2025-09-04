import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { getAuth } from "firebase-admin/auth";

export class AuthController {
  static async anonymousLogin(req: Request, res: Response) {
    try {
      // cria usuário anônimo no Firebase
      const fbUser = await getAuth().createUser({
        email: `anon_${Date.now()}@example.com`,
        password: Math.random().toString(36).slice(-8),
        displayName: "Usuário Anônimo",
      });

      const user: User = {
        id: fbUser.uid,
        email: "",
        nome: "",
      };

      const userService = new UserService();
      await userService.saveAnonymousUser(user);

      const token = await getAuth().createCustomToken(fbUser.uid);
      res.send({ token });
    } catch (error) {
      console.error("Erro ao criar usuário anônimo:", error);
      res.status(500).send({ message: "Erro ao criar usuário anônimo" });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const useRecord = await new AuthService().login(email, senha);
    const token = await useRecord.user.getIdToken(true);
    res.send({ token });
  }

  static async recovery(req: Request, res: Response) {
    const { email } = req.body;
    await new AuthService().recovery(email);
    res.end();
  }

  static async loginWithGoogle(req: Request, res: Response) {
    const user = req.user; // já preenchido por auth.middleware
    try {
      await new UserService().getById(user.id);
    } catch {
      const novoUsuario: User = {
        id: user.id,
        email: user.email,
        nome: user.nome,
        senha: "",
      };
      await new UserService().saveFromGoogle(novoUsuario);
    }

    res.send({ message: "Login com Google realizado com sucesso" });
  }
}
