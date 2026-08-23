import { pool } from "../db/pool";
import { Course } from "../Model/Course";

export async function createCourse(
    code: string,
    name: string,
    description: string | null
): Promise<Course> {
    const res = await pool.query(
        "INSERT INTO courses (code, name, description) VALUES ($1, $2, $3) RETURNING id, code, name, description",
        [code, name, description]
    );
    return res.rows[0];
}

export async function getAllCourses(): Promise<Course[]> {
    const res = await pool.query(
        "SELECT id, code, name, description FROM courses ORDER BY id"
    );
    return res.rows;
}

export async function getCourseById(id: number): Promise<Course | null> {
    const res = await pool.query(
        "SELECT id, code, name, description FROM courses WHERE id = $1",
        [id]
    );
    return res.rows[0] ?? null;
}

export async function updateCourse(
    id: number,
    code: string,
    name: string,
    description: string | null
): Promise<Course | null> {
    const res = await pool.query(
        "UPDATE courses SET code = $1, name = $2, description = $3 WHERE id = $4 RETURNING id, code, name, description",
        [code, name, description, id]
    );
    return res.rows[0] ?? null;
}

export async function deleteCourse(id: number): Promise<void> {
    await pool.query(
        "DELETE FROM courses WHERE id = $1",
        [id]
    );
}