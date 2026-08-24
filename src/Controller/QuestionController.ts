import { Request, Response } from "express";
import * as QuestionService from "../Service/QuestionService";

export async function create(requete: Request, reponse: Response) {
  try {
    const exam_id = Number(requete.params.examId);
    const { statement, points, choices } = requete.body;
    const question = await QuestionService.createQuestion(
      exam_id,
      statement,
      points ?? 1,
      choices,
    );
    reponse.status(201).json(question);
  } catch (err: any) {
    reponse
      .status(err.status ?? 500)
      .json({ message: err.message ?? "Erreur serveur" });
  }
}

export async function listByExam(requete: Request, reponse: Response) {
  try {
    const exam_id = Number(requete.params.examId);
    const questions = await QuestionService.getQuestionsByExamId(exam_id);
    reponse.json(questions);
  } catch (err: any) {
    reponse
      .status(err.status ?? 500)
      .json({ message: err.message ?? "Erreur serveur" });
  }
}

export async function remove(requete: Request, reponse: Response) {
  try {
    const id = Number(requete.params.id);
    await QuestionService.deleteQuestion(id);
    reponse.status(204).send();
  } catch (err: any) {
    reponse
      .status(err.status ?? 500)
      .json({ message: err.message ?? "Erreur serveur" });
  }
}
export async function update(requete: Request, reponse: Response) {
  try {
    const id = Number(requete.params.id);
    const { statement, points, choices } = requete.body;
    const question = await QuestionService.updateQuestion(id, statement, points ?? 1, choices);
    reponse.json(question);
  } catch (err: any) {
    reponse
        .status(err.status ?? 500)
        .json({ message: err.message ?? "Erreur serveur" });
  }
}