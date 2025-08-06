import { Response, Request } from "express";
import { Company } from "../models/company.model";
import { CompaniesService } from "../services/companies.service";

export class CompaniesController {
  static async getAll(req: Request, res: Response) {
    res.send(await new CompaniesService().getAll());
  }

  static async getById(req: Request, res: Response) {
    const companyId = req.params.id;
    res.send(await new CompaniesService().getById(companyId));
  }

  //salvar usúario
  static async save(req: Request, res: Response) {
    const company = req.body as Company;
    await new CompaniesService().save(company);
    res.send({ mensage: "Empresa cadastrada com sucesso" });
  }

  //editar usuário
  static async edit(req: Request, res: Response) {
    const companyId = req.params.id;
    const company = req.body as Company;
    await new CompaniesService().update(companyId, company);
    res.send({ message: "Empresa atualizada com sucesso" });
  }
}
