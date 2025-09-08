import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.ADMIN_PROJECT_ID,
      privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.ADMIN_CLIENT_EMAIL,
    }),
  });
}

export const auth = admin.auth();
