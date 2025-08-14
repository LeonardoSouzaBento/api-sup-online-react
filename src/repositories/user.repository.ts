import { User } from "../models/user.model";
import { CollectionReference, getFirestore } from "firebase-admin/firestore";

export class UserRepository {
  private collection: CollectionReference;
  constructor() {
    this.collection = getFirestore().collection("users");
  }

  async getAll(): Promise<User[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as User[];
  }

  async getById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    } else {
      return null;
    }
  }

  async save(user: User): Promise<void> {
    if (!user.id) {
      throw new Error("ID do usuário não pode ser nulo.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...userWithoutPassword } = user;
    await this.collection
      .doc(user.id)
      .set(userWithoutPassword, { merge: true });
  }

  async update(user: User): Promise<void> {
    const docRef = this.collection.doc(user.id);
    if ((await docRef.get()).exists) {
      await docRef.set(
        {
          nome: user.nome,
          email: user.email,
        },
        { merge: true } // evita sobrescrever outros campos
      );
    } else {
      throw new Error("Usuário não encontrado.");
    }
  }

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new Error("Usuário não encontrado.");
    }
    await docRef.delete();
  }

  async updateAddress(user: User): Promise<void> {
    const docRef = this.collection.doc(user.id);
    if ((await docRef.get()).exists) {
      await docRef.set(
        {
          endereco: user.endereco,
        },
        { merge: true }
      );
    } else {
      throw new Error("Usuário não encontrado.");
    }
  }
}
