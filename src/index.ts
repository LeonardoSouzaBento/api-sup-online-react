import express from "express";
import { routes } from "./routes/routes";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PageNotFoundHandler } from "./middlewares/page-not-found.middleware";
import { errors as celebrateErrors } from "celebrate";
import { authMiddleware } from "./middlewares/auth.middleware";
import cors from "cors";
import * as functions from "firebase-functions";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://supermercadodobom.netlify.app",
      "http://127.0.0.1:5001/api-supermercado-do-bom/us-central1/api/auth-login-email",
    ],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT"],
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
