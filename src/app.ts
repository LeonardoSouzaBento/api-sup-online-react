import express, {Request, Response} from 'express'
import { routes } from "./routes/index";
import { initializeApp } from "firebase-admin/app";
import { initializeApp as initializeAppFirebase } from "firebase/app";
import "dotenv/config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { PageNotFoundHandler } from "./middlewares/page-not-found.middleware";
import { errors as celebrateErrors } from "celebrate";
import { authMiddleware } from "./middlewares/auth.middleware";
import cors from "cors";

initializeAppFirebase({
  apiKey: process.env.API_KEY,
});

initializeApp(); // Firebase

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.get("/teste-cors", (req: Request, res: Response) => {
  res.send("CORS está funcionando!");
});

authMiddleware(app);
routes(app);
PageNotFoundHandler(app);
app.use(celebrateErrors());
errorHandler(app);

console.log("XXXXX APP SENDO USADO XXXXX");
export default app;
