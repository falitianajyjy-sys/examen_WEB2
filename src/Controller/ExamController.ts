import { Request, Response } from "express";
import * as ExamService from "../Service/ExamService";

export async function create(requete: Request, reponse: Response) {
    try {
        const { course_id, title, description, starts_at, ends_at } = requete.body;
        const exam = await ExamService.createExam(course_id, title, description ?? null, starts_at, ends_at);
        reponse.status(201).json(exam);
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }
}

export async function list(requete: Request, reponse: Response) {
    try {
        const exams = await ExamService.getAllExams();
        reponse.json(exams);
    } catch (err: any) {
        reponse.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getOne(requete: Request, reponse: Response) {
    try {
        const id = Number(requete.params.id);
        const exam = await ExamService.getExamById(id);
        reponse.json(exam);
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }
}

export async function update(requete: Request, reponse: Response) {
    try {
        const id = Number(requete.params.id);
        const { course_id, title, description, starts_at, ends_at } = requete.body;
        const exam = await ExamService.updateExam(id, course_id, title, description ?? null, starts_at, ends_at);
        reponse.json(exam);
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }
}

export async function remove(requete: Request, reponse: Response) {
    try {
        const id = Number(requete.params.id);
        await ExamService.deleteExam(id);
        reponse.status(204).send();
    } catch (err: any) {
        reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
    }



}
