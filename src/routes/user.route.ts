import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { updateUserSchema, newUserSchema } from "../models/user.model";

export const userRoutes = Router();

userRoutes.get("/users", asyncHandler(UsersController.getAll));
//pegar um usuario especifico: ":id"
userRoutes.get("/users/:id", asyncHandler(UsersController.getById));
//cadastro
userRoutes.post(
  "/users",
  celebrate({
    [Segments.BODY]: newUserSchema,
  }),
  asyncHandler(UsersController.saveUser)
);
//
userRoutes.delete("/users/:id", asyncHandler(UsersController.deleteUser));
userRoutes.put(
  "/users/:id",
  celebrate({
    [Segments.BODY]: updateUserSchema,
  }),
  asyncHandler(UsersController.editUser)
);
