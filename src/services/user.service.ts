import { User } from "../models/user.model";
import { NotFoundError } from "../errors/not-found.error";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "./auth.service";

export class UserService {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor() {
    this.userRepository = new UserRepository();
    this.authService = new AuthService();
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (user) {
      return user;
    }
    throw new NotFoundError("Usuário não encontrado!");
  }

  async save(user: User): Promise<void> {
    //cria um usuario e passa o uid como id
    const userAuth = await this.authService.create(user);
    user.id = userAuth.uid;
    await this.userRepository.save(user);
  }

  async saveFromGoogle(user: User): Promise<void> {
    if (!user.id) {
      throw new Error("ID do usuário não pode ser nulo.");
    }
    await this.userRepository.save(user);
  }

  async update(id: string, user: User): Promise<void> {
    const _user = await this.userRepository.getById(id);
    if (_user) {
      _user.nome = user.nome;
      _user.email = user.email;
      await this.userRepository.update(_user);
      await this.authService.update(id, user);
    } else {
      throw new NotFoundError("Usuário não encontrado!");
    }
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
    await this.authService.delete(id);
  }
}
