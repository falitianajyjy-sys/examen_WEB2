// @ts-ignore
import { pool } from "../db/pool";
import {type User } from "../Model/User";

// @ts-ignore
export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0] ?? null;
}