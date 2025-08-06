import { Response, Request } from "express";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

export class UsersController {
  static async getAll(req: Request, res: Response) {
    res.send(await new UserService().getAll());
  }

  static async getById(req: Request, res: Response) {
    const userId = req.params.id;
    res.send(await new UserService().getById(userId));
  }

  //salvar usúario
  static async saveUser(req: Request, res: Response) {
    const user = req.body as User;
    await new UserService().save(user);
    res.send({ mensage: "Usuario cadastrado com sucesso" });
  }

  //deletar
  static async deleteUser(req: Request, res: Response) {
    const userID = req.params.id;
    await new UserService().delete(userID);
    res.sendStatus(204);
  }

  //editar usuário
  static async editUser(req: Request, res: Response) {
    const userId = req.params.id;
    const user = req.body as User;
    await new UserService().update(userId, user);
    res.send({ message: "Usuário atualizado com sucesso" });
  }
}
