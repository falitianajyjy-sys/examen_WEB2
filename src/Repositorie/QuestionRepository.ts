import { pool } from "../db/pool";
import { Question, Choice } from "../Model/Question";

export async function createQuestionWithChoices(
  examId: number,
  statement: string,
  points: number,
  choices: Choice[],
): Promise<Question> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const checkAttempts = await client.query(
      "SELECT COUNT(*) FROM attempts WHERE exam_id = $1",
      [examId],
    );
    if (parseInt(checkAttempts.rows[0].count, 10) > 0) {
      throw {
        status: 403,
        message:
          "Impossible d'ajouter une question : des etudiants ont deja passe cet examen",
      };
    }

    const qRes = await client.query(
      "INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING id, exam_id, statement, points",
      [examId, statement, points],
    );
    const question = qRes.rows[0];

    const insertedChoices: Choice[] = [];
    for (const choice of choices) {
      const cRes = await client.query(
        "INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3) RETURNING id, question_id, label, is_correct",
        [question.id, choice.label, choice.is_correct],
      );
      insertedChoices.push(cRes.rows[0]);
    }

    await client.query("COMMIT");
    return { ...question, choices: insertedChoices };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getQuestionsByExamId(
  examId: number,
): Promise<Question[]> {
  const questionsRes = await pool.query(
    "SELECT id, exam_id, statement, points FROM questions WHERE exam_id = $1 ORDER BY id",
    [examId],
  );

  const questions: Question[] = [];
  for (const q of questionsRes.rows) {
    const choicesRes = await pool.query(
      "SELECT id, question_id, label, is_correct FROM choices WHERE question_id = $1 ORDER BY id",
      [q.id],
    );
    questions.push({ ...q, choices: choicesRes.rows });
  }

  return questions;
}

export async function deleteQuestion(id: number): Promise<void> {
  await pool.query("DELETE FROM questions WHERE id = $1", [id]);
}
