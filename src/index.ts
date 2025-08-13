import express from "express";
import { routes } from "./routes/routes";
import { initializeApp } from "firebase-admin/app";
import { initializeApp as initializeAppFirebase } from "firebase/app";
import "dotenv/config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PageNotFoundHandler } from "./middlewares/page-not-found.middleware";
import { errors as celebrateErrors } from "celebrate";
import { authMiddleware } from "./middlewares/auth.middleware";
import cors from "cors";
import * as functions from "firebase-functions";

initializeAppFirebase({
  apiKey: process.env.API_KEY,
});

initializeApp(); // Firebase

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://supermercadodobom.netlify.app",
      "http://127.0.0.1:5001/api-supermercado-do-bom/us-central1/api/auth/login",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

authMiddleware(app);
routes(app);
PageNotFoundHandler(app);
app.use(celebrateErrors());
errorHandler(app);

export default app;
export const api = functions.https.onRequest(app);
