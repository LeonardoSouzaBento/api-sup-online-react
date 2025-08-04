import { Router } from "express";
import { CompaniesController } from "../controllers/companies.controller";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { updateUserSchema, newUserSchema } from "../models/user.model";

export const companiesRoutes = Router();

companiesRoutes.get("/companies", asyncHandler(CompaniesController.getAll));
//pegar um usuario especifico: ":id"
companiesRoutes.get("/companies/:id", asyncHandler(CompaniesController.getById));
//cadastro
companiesRoutes.post(
  "/companies",
  celebrate({
    [Segments.BODY]: newUserSchema,
  }),
  asyncHandler(CompaniesController.save)
);
companiesRoutes.put(
  "/companies/:id",
  celebrate({
    [Segments.BODY]: updateUserSchema,
  }),
  asyncHandler(CompaniesController.edit)
);
