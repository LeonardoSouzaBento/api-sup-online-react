import express from 'express'
import { routes } from "./routes/index";
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
    origin:'*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  })
);

authMiddleware(app);
routes(app);
PageNotFoundHandler(app);
app.use(celebrateErrors());
errorHandler(app);

export default app;
export const api = functions.https.onRequest(app);