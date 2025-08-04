import { Company } from "../models/company.model";
import { CollectionReference, getFirestore } from "firebase-admin/firestore";

export class CompanyRepository {
  private collection: CollectionReference;
  constructor() {
    this.collection = getFirestore().collection("users");
  }

  async getAll(): Promise<Company[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as Company[];
  }

  async getById(id: string): Promise<Company | null> {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data(),
      } as Company;
    } else {
      return null;
    }
  }

  async save(company: Company): Promise<void> {
    if (!company.id) {
      throw new Error("ID do usuário não pode ser nulo.");
    }
    const {...company_ } = company;
    await this.collection
      .doc(company.id)
      .set(company_, { merge: true });
  }

  async update(company: Company): Promise<void> {
    const docRef = this.collection.doc(company.id);
    if ((await docRef.get()).exists) {
      await docRef.set(
        {
          nome: company.nomeFantasia,
          email: company.emailContato,
        },
        { merge: true } // evita sobrescrever outros campos
      );
    } else {
      throw new Error("Usuário não encontrado.");
    }
  }

}
