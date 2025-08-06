import { Response, Request } from "express";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    const useRecord = await new AuthService().login(email, senha);
    const token = await useRecord.user.getIdToken(true);
    res.send({ token: token });
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
