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

  async saveFromGoogle(user: {
    id: string;
    email: string;
    nome: string;
  }): Promise<User> {
    if (!user.id) {
      throw new Error("ID do usuário não pode ser nulo.");
    }
    if (!user.email) {
      throw new Error("Email do usuário não pode ser nulo");
    }
    if (!user.nome) {
      throw new Error("Nome do usuário não pode ser nulo");
    }
    const newUser: User = {
      id: user.id,
      email: user.email,
      nome: user.nome,
      senha: "", // Senha para usuários do Google não é necessária
    };
    await this.userRepository.save(newUser);
    return newUser;
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

  async updateAddress(id: string, endereco: User["endereco"]): Promise<void> {
    const _user = await this.userRepository.getById(id);

    if (!_user) {
      throw new NotFoundError("Usuário não encontrado!");
    }

    _user.endereco = endereco;
    await this.userRepository.updateAddress(_user);
  }
}
