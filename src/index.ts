import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loginController } from "./Controller/AuthController";
import {
    createStudentController,
    listStudentsController,
    updateStudentController,
    deactivateStudentController,
} from "./Controller/StudentController";
import { requireAuth, requireRole } from "./Security/authMiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/login", loginController);

app.get("/api/students", requireAuth, requireRole("admin"), listStudentsController);
app.post("/api/students", requireAuth, requireRole("admin"), createStudentController);
app.put("/api/students/:id", requireAuth, requireRole("admin"), updateStudentController);
app.delete("/api/students/:id", requireAuth, requireRole("admin"), deactivateStudentController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));