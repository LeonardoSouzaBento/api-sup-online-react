import { Router } from "express";
import { LocationController } from "../controllers/location.controller";

export const locationRoute = Router();
locationRoute.post("/get-address", LocationController.getAddress);

