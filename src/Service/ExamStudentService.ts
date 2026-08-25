import * as Repo from "../Repositorie/ExamStudentRepository";
import {AnswerInput} from "../Model/Attempts";

export async function listAvailableExams() {
    return Repo.getAvailableExamsForStudent();
}

export async function getExamToTake(examId: number) {
    const exam = await Repo.getExamForStudent(examId);
    if (!exam) {
        throw { status: 404, message: "Examen introuvable" };
    }

    const now = new Date();
    if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
        throw { status: 403, message: "Cet examen n'est pas disponible actuellement" };
    }

    const questions = await Repo.getExamQuestionsForStudent(examId);
    return { ...exam, questions };
}

export async function submitExam(
    studentId: number,
    examId: number,
    answers: AnswerInput[]
) {
    const exam = await Repo.getExamForStudent(examId);
    if (!exam) {
        throw { status: 404, message: "Examen introuvable" };
    }

    const now = new Date();
    if (now < new Date(exam.starts_at) || now > new Date(exam.ends_at)) {
        throw { status: 403, message: "Cet examen n'est pas disponible actuellement" };
    }

    const alreadyAttempted = await Repo.hasAttempt(studentId, examId);
    if (alreadyAttempted) {
        throw { status: 409, message: "Vous avez deja passe cet examen" };
    }

    const correctAnswers = await Repo.getCorrectAnswersForExam(examId);
    const correctMap = new Map(
        correctAnswers.map((c: any) => [c.question_id, { choice_id: c.choice_id, points: c.points }])
    );

    let score = 0;
    for (const a of answers) {
        const correct = correctMap.get(a.question_id);
        if (correct && a.choice_id === correct.choice_id) {
            score += correct.points;
        }
    }

    const attempt = await Repo.submitAttempt(studentId, examId, score, answers);
    const correction = await Repo.getAttemptCorrection(attempt.id);

    return { attempt_id: attempt.id, score, correction };
}

export async function getMyResults(studentId: number) {
    return Repo.getStudentResults(studentId);
}