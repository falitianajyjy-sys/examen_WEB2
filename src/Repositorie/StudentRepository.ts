// @ts-ignore
import { pool } from "../db/pool";
import { User } from "../Model/User";

export async function createStudent(
    name: string,
    email: string,
    passwordHash: string,
): Promise<User> {
  const res = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'etudiant') RETURNING id, name, email, role, is_active",
      [name, email, passwordHash],
  );
  return res.rows[0];
}

export async function getAllStudents(): Promise<User[]> {
  const res = await pool.query(
      "SELECT id, name, email, role, is_active FROM users WHERE role = 'etudiant'",
  );
  return res.rows;
}

export async function toggleStudentStatus(
    id: number,
    isActive: boolean,
): Promise<void> {
  await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 AND role = 'etudiant'",
      [isActive, id],
  );
}

export async function updateStudent(
    id: number,
    name: string,
    email: string
): Promise<User | null> {
  const res = await pool.query(
      `UPDATE users SET name = $1, email = $2
       WHERE id = $3 AND role = 'etudiant'
         RETURNING id, name, email, role, is_active`,
      [name, email, id]
  );
  return res.rows[0] ?? null;
}

export async function resetStudentPassword(
    id: number,
    passwordHash: string
): Promise<void> {
  await pool.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2 AND role = 'etudiant'",
      [passwordHash, id]
  );
}