// @ts-ignore
import fs from "fs";
// @ts-ignore
import path from "path";
// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import { pool } from "./pool";

async function init() {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
    await pool.query(schema);

    const passwordHash = await bcrypt.hash("admin123", 10);
    await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')`,
        ["Admin", "falitianajyjy@gmail.com", passwordHash]
    );

    console.log("Base initialisée, admin créé.");
    await pool.end();
}

init().catch((err) => {
    console.error(err);
    process.exit(1);
});