import { emailAlreadyExistsError } from "../errors/email-already-exists.error";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { User } from "../models/user.model";
import { getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import {
  getAuth as getFirebaseAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

export class AuthService {
  async create(user: User): Promise<UserRecord> {
    return getAuth()
      .createUser({
        email: user.email,
        password: user.senha,
        displayName: user.nome,
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-exists") {
          throw new emailAlreadyExistsError();
        }
        throw error;
      });
  }

  async update(id: string, user: User) {
    const props: UpdateRequest = {
      displayName: user.nome,
      email: user.email,
    };

    if (user.senha) {
      props.password = user.senha;
    }

    await getAuth().updateUser(id, props);
  }

  async delete(id: string) {
    try {
      await getAuth().getUser(id);
      await getAuth().deleteUser(id);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("Usuário não encontrado no Firebase Auth.");
      }
      throw error;
    }
  }

  async login(email: string, senha: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      senha
    ).catch((err) => {
      const authErrors = [
        "auth/invalid-credential",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-email",
      ];
      if (authErrors.includes(err.code)) {
        throw new UnauthorizedError();
      }
      throw err;
    });
  }

  async recovery(email: string) {
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }
}
