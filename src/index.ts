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
import { create as createCourse, list as listCourses, update as updateCourse, remove as removeCourse } from "./Controller/CourseController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/login", loginController);

app.get("/api/students", requireAuth, requireRole("admin"), listStudentsController);
app.post("/api/students", requireAuth, requireRole("admin"), createStudentController);
app.put("/api/students/:id", requireAuth, requireRole("admin"), updateStudentController);
app.delete("/api/students/:id", requireAuth, requireRole("admin"), deactivateStudentController);

app.get("/api/courses", requireAuth, requireRole("admin"), listCourses);
app.post("/api/courses", requireAuth, requireRole("admin"), createCourse);
app.put("/api/courses/:id", requireAuth, requireRole("admin"), updateCourse);
app.delete("/api/courses/:id", requireAuth, requireRole("admin"), removeCourse);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));