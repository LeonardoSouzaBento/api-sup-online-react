import { Router } from "express";
import asyncHandler from "express-async-handler";
import { AuthController } from "../controllers/auth.controller";
import { celebrate, Segments } from "celebrate";
import { authLoginSchema } from "../models/user.model";
import { authRecoverySchema } from "../models/user.model";

export const authRoutes = Router();
authRoutes.post(
  "/auth/login",
  celebrate({
    [Segments.BODY]: authLoginSchema,
  }),
  asyncHandler(AuthController.login)
);

authRoutes.post(
  "/auth/login-google",
  asyncHandler(AuthController.loginWithGoogle)
);

export const authRecovery = Router();
authRoutes.post(
  "/auth/recovery",
  celebrate({
    [Segments.BODY]: authRecoverySchema,
  }),
  asyncHandler(AuthController.recovery)
);
