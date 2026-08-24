import * as QuestionRepository from "../Repositorie/QuestionRepository";
import { Question, Choice } from "../Model/Question";

function validateQuestion(
  statement: string,
  points: number,
  choices: Choice[],
) {
  if (!statement || statement.trim() === "") {
    throw { status: 400, message: "L'enonce de la question est obligatoire" };
  }
  if (!points || points <= 0) {
    throw { status: 400, message: "Les points doivent etre superieurs a 0" };
  }
  if (!choices || !Array.isArray(choices)) {
    throw { status: 400, message: "Les choix sont obligatoires" };
  }

  if (choices.length < 2 || choices.length > 6) {
    throw {
      status: 400,
      message: "Une question doit comporter entre 2 et 6 choix",
    };
  }
  const correctAnswers = choices.filter((c) => c.is_correct);
  if (correctAnswers.length !== 1) {
    throw {
      status: 400,
      message: "Une question doit comporter exactement une bonne reponse",
    };
  }
}

export async function createQuestion(
  examId: number,
  statement: string,
  points: number,
  choices: Choice[],
): Promise<Question> {
  validateQuestion(statement, points, choices);
  try {
    return await QuestionRepository.createQuestionWithChoices(
      examId,
      statement,
      points,
      choices,
    );
  } catch (err: any) {
    if (err.code === "23503") {
      throw { status: 400, message: "L'examen indique n'existe pas" };
    }
    throw err;
  }
}

export async function getQuestionsByExamId(
  examId: number,
): Promise<Question[]> {
  return QuestionRepository.getQuestionsByExamId(examId);
}

export async function deleteQuestion(id: number): Promise<void> {
  await QuestionRepository.deleteQuestion(id);
}
