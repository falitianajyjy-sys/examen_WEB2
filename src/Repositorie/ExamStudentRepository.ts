import { pool } from "../db/pool";

export async function getAvailableExamsForStudent() {
    const res = await pool.query(
        `SELECT id, course_id, title, description, starts_at, ends_at
     FROM exams
     WHERE starts_at <= NOW() AND ends_at >= NOW()
     ORDER BY starts_at`
    );
    return res.rows;
}

export async function getExamForStudent(examId: number) {
    const res = await pool.query("SELECT * FROM exams WHERE id = $1", [examId]);
    return res.rows[0] ?? null;
}

// Questions SANS is_correct, pour l'affichage a l'etudiant avant soumission (RG-07)
export async function getExamQuestionsForStudent(examId: number) {
    const questionsRes = await pool.query(
        "SELECT id, statement, points FROM questions WHERE exam_id = $1 ORDER BY id",
        [examId]
    );
    const questions = [];
    for (const q of questionsRes.rows) {
        const choicesRes = await pool.query(
            "SELECT id, label FROM choices WHERE question_id = $1 ORDER BY id",
            [q.id]
        );
        questions.push({ ...q, choices: choicesRes.rows });
    }
    return questions;
}

export async function hasAttempt(studentId: number, examId: number): Promise<boolean> {
    const res = await pool.query(
        "SELECT 1 FROM attempts WHERE student_id = $1 AND exam_id = $2",
        [studentId, examId]
    );
    return (res.rowCount ?? 0) > 0;
}

// Toutes les bonnes reponses de l'examen, pour calculer la note cote serveur (RG-06)
export async function getCorrectAnswersForExam(examId: number) {
    const res = await pool.query(
        `SELECT q.id AS question_id, q.points, c.id AS choice_id
     FROM questions q
     JOIN choices c ON c.question_id = q.id AND c.is_correct = true
     WHERE q.exam_id = $1`,
        [examId]
    );
    return res.rows;
}

export async function submitAttempt(
    studentId: number,
    examId: number,
    score: number,
    answers: { question_id: number; choice_id: number | null }[]
) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const attemptRes = await client.query(
            `INSERT INTO attempts (student_id, exam_id, score)
       VALUES ($1, $2, $3) RETURNING *`,
            [studentId, examId, score]
        );
        const attempt = attemptRes.rows[0];

        for (const a of answers) {
            if (a.choice_id !== null) {
                await client.query(
                    `INSERT INTO answers (attempt_id, question_id, choice_id)
           VALUES ($1, $2, $3)`,
                    [attempt.id, a.question_id, a.choice_id]
                );
            }
        }

        await client.query("COMMIT");
        return attempt;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

// Correction complete apres soumission (RG-12)
export async function getAttemptCorrection(attemptId: number) {
    const res = await pool.query(
        `SELECT q.id AS question_id, q.statement, q.points,
            a.choice_id AS student_choice_id,
            c_correct.id AS correct_choice_id
     FROM questions q
     LEFT JOIN answers a ON a.question_id = q.id AND a.attempt_id = $1
     LEFT JOIN choices c_correct ON c_correct.question_id = q.id AND c_correct.is_correct = true
     WHERE q.exam_id = (SELECT exam_id FROM attempts WHERE id = $1)
     ORDER BY q.id`,
        [attemptId]
    );
    return res.rows;
}

export async function getStudentResults(studentId: number) {
    const res = await pool.query(
        `SELECT a.id AS attempt_id, a.exam_id, e.title, a.score, a.submitted_at
     FROM attempts a
     JOIN exams e ON e.id = a.exam_id
     WHERE a.student_id = $1
     ORDER BY a.submitted_at DESC`,
        [studentId]
    );
    return res.rows;
}