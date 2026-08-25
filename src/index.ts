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
import {
    create as createCourse,
    list as listCourses,
    update as updateCourse,
    remove as removeCourse,
} from "./Controller/CourseController";
import {
    create as createExam,
    list as listExams,
    getOne as getExam,
    update as updateExam,
    remove as removeExam,
    results as getExamResults,
} from "./Controller/ExamController";
import {
    create as createQuestion,
    listByExam as listQuestions,
    update as updateQuestion,
    remove as removeQuestion,
} from "./Controller/QuestionController";

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

app.get("/api/exams", requireAuth, requireRole("admin"), listExams);
app.post("/api/exams", requireAuth, requireRole("admin"), createExam);
app.get("/api/exams/:id", requireAuth, requireRole("admin"), getExam);
app.put("/api/exams/:id", requireAuth, requireRole("admin"), updateExam);
app.delete("/api/exams/:id", requireAuth, requireRole("admin"), removeExam);

app.get("/api/exams/:examId/questions", requireAuth, requireRole("admin"), listQuestions);
app.post("/api/exams/:examId/questions", requireAuth, requireRole("admin"), createQuestion);
app.put("/api/questions/:id", requireAuth, requireRole("admin"), updateQuestion);
app.delete("/api/questions/:id", requireAuth, requireRole("admin"), removeQuestion);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
import {
    listMyExams,
    getMyExam,
    submitMyExam,
    getMyResults,
} from "./Controller/ExamStudentController";

app.get("/api/my/exams", requireAuth, requireRole("etudiant"), listMyExams);
app.get("/api/my/exams/:id", requireAuth, requireRole("etudiant"), getMyExam);
app.post("/api/my/exams/:id/submit", requireAuth, requireRole("etudiant"), submitMyExam);
app.get("/api/my/results", requireAuth, requireRole("etudiant"), getMyResults);

app.get("/api/exams/:id/results", requireAuth, requireRole("admin"), getExamResults);