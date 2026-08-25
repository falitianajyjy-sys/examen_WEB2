import { Response } from "express";
import { AuthRequest } from "../Security/authMiddleware";
import * as ExamStudentService from "../Service/ExamStudentService";

export async function listMyExams(requete: AuthRequest, reponse: Response) {
    try {
        const exams = await ExamStudentService.listAvailableExams();
        reponse.json(exams);
    } catch (err: any) {
        reponse.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getMyExam(requete: AuthRequest, reponse: Response) {
    try {
        const examId = Number(requete.params.id);
        const exam = await ExamStudentService.getExamToTake(examId);
        reponse.json(exam);
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }
}

export async function submitMyExam(requete: AuthRequest, reponse: Response) {
    try {
        const examId = Number(requete.params.id);
        const studentId = requete.user!.userId;
        const { answers } = requete.body;
        const result = await ExamStudentService.submitExam(studentId, examId, answers ?? []);
        reponse.json(result);
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }
}

export async function getMyResults(requete: AuthRequest, reponse: Response) {
    try {
        const studentId = requete.user!.userId;
        const results = await ExamStudentService.getMyResults(studentId);
        reponse.json(results);
    } catch (err: any) {
        reponse.status(500).json({ message: "Erreur serveur" });
    }
}