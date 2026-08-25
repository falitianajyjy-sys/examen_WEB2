import { pool } from "../db/pool";
import { Exam } from "../Model/Exam";

export async function createExam(
    courseId: number,
    title: string,
    description: string | null,
    startsAt: string,
    endsAt: string
): Promise<Exam> {
    const res = await pool.query(
        "INSERT INTO exams (course_id, title, description, starts_at, ends_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, course_id, title, description, starts_at, ends_at",
        [courseId, title, description, startsAt, endsAt]
    );
    return res.rows[0];
}

export async function getAllExams(): Promise<Exam[]> {
    const res = await pool.query(
        "SELECT id, course_id, title, description, starts_at, ends_at FROM exams ORDER BY id"
    );
    return res.rows;
}

export async function getExamById(id: number): Promise<Exam | null> {
    const res = await pool.query(
        "SELECT id, course_id, title, description, starts_at, ends_at FROM exams WHERE id = $1",
        [id]
    );
    return res.rows[0] ?? null;
}

export async function updateExam(
    id: number,
    courseId: number,
    title: string,
    description: string | null,
    startsAt: string,
    endsAt: string
): Promise<Exam | null> {
    const res = await pool.query(
        "UPDATE exams SET course_id = $1, title = $2, description = $3, starts_at = $4, ends_at = $5 WHERE id = $6 RETURNING id, course_id, title, description, starts_at, ends_at",
        [courseId, title, description, startsAt, endsAt, id]
    );
    return res.rows[0] ?? null;
}

export async function deleteExam(id: number): Promise<void> {
    await pool.query("DELETE FROM exams WHERE id = $1", [id]);
}
export async function getExamResults(examId: number) {
    const res = await pool.query(
        `SELECT u.id AS student_id, u.name, u.email, a.score, a.submitted_at
         FROM attempts a
         JOIN users u ON u.id = a.student_id
         WHERE a.exam_id = $1
         ORDER BY a.submitted_at`,
        [examId]
    );
    return res.rows;
}

export async function getExamAverageAndCount(examId: number) {
    const res = await pool.query(
        `SELECT COUNT(*)::int AS attempts_count, COALESCE(AVG(score), 0)::float AS average
         FROM attempts
         WHERE exam_id = $1`,
        [examId]
    );
    return res.rows[0];
}