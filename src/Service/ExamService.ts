import * as ExamRepository from "../Repositorie/ExamRepository";
import { Exam } from "../Model/Exam";

function validateExam(courseId: number, title: string, startsAt: string, endsAt: string) {
    if (!courseId || !title) {
        throw { status: 400, message: "Le cours et le titre sont obligatoires" };
    }
    if (!startsAt || !endsAt) {
        throw { status: 400, message: "Les dates de debut et de fin sont obligatoires" };
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
        throw { status: 400, message: "La date de fin doit etre apres la date de debut" };
    }
}

export async function createExam(
    courseId: number,
    title: string,
    description: string | null,
    startsAt: string,
    endsAt: string
): Promise<Exam> {
    validateExam(courseId, title, startsAt, endsAt);
    try {
        return await ExamRepository.createExam(courseId, title, description, startsAt, endsAt);
    } catch (err: any) {
        if (err.code === "23503") {
            // course_id inexistant
            throw { status: 400, message: "Le cours indique n'existe pas" };
        }
        throw err;
    }
}

export async function getAllExams(): Promise<Exam[]> {
    return ExamRepository.getAllExams();
}

export async function getExamById(id: number): Promise<Exam> {
    const exam = await ExamRepository.getExamById(id);
    if (!exam) {
        throw { status: 404, message: "Examen introuvable" };
    }
    return exam;
}

export async function updateExam(
    id: number,
    courseId: number,
    title: string,
    description: string | null,
    startsAt: string,
    endsAt: string
): Promise<Exam> {
    validateExam(courseId, title, startsAt, endsAt);
    const updated = await ExamRepository.updateExam(id, courseId, title, description, startsAt, endsAt);
    if (!updated) {
        throw { status: 404, message: "Examen introuvable" };
    }
    return updated;
}

export async function deleteExam(id: number): Promise<void> {
    try {
        await ExamRepository.deleteExam(id);
    } catch (err: any) {
        if (err.code === "23503") {
            // des tentatives existent pour cet examen
            throw { status: 409, message: "Impossible de supprimer un examen qui possede des tentatives" };
        }
        throw err;
    }
}