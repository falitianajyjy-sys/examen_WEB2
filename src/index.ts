// @ts-ignore
import express from "express";
// @ts-ignore
import cors from "cors";
// @ts-ignore
import dotenv from "dotenv";
// @ts-ignore
import { loginController } from "./Controller/AuthController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/login", loginController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));