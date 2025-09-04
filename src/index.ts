import express from "express";
import { routes } from "./routes/routes";
import { initializeApp } from "firebase-admin/app";
// import { initializeApp as initializeAppFirebase } from "firebase/app";
// import admin from "firebase-admin";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PageNotFoundHandler } from "./middlewares/page-not-found.middleware";
import { errors as celebrateErrors } from "celebrate";
import { authMiddleware } from "./middlewares/auth.middleware";
import cors from "cors";
import * as functions from "firebase-functions";

// const serviceAccount = JSON.parse(functions.config().service.account);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// initializeAppFirebase({
//   apiKey: process.env.API_KEY,
// });

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.ADMIN_PROJECT_ID,
      privateKey: process.env.ADMIN_PRIVATE_KEY
        ? process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
        : (() => { throw new Error("ADMIN_PRIVATE_KEY is not defined in environment variables."); })(),
      clientEmail: process.env.ADMIN_CLIENT_EMAIL,
    }),
  });
}

initializeApp()
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
export const auth = admin.auth();
