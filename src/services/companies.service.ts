import { Company } from "../models/company.model";
import { NotFoundError } from "../errors/not-found.error";
import { CompanyRepository } from "../repositories/companies.repository";

export class CompaniesService {
  private companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async getAll(): Promise<Company[]> {
    return this.companyRepository.getAll();
  }

  async getById(id: string): Promise<Company> {
    const company = await this.companyRepository.getById(id);
    if (company) {
      return company as Company;
    }
    throw new NotFoundError("Empresa não encontrada!");
  }

  async save(company: Company): Promise<void> {
    await this.companyRepository.save(company);
  }

  async update(id: string, company: Company): Promise<void> {
    const _company = await this.companyRepository.getById(id);
    if (_company) {
      _company.nomeFantasia = company.nomeFantasia;
      _company.emailContato = company.emailContato;
      await this.companyRepository.update(_company);
    } else {
      throw new NotFoundError("Empresa não encontrada!");
    }
  }
}
