// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import { pool } from "./pool";

async function updateAdmin() {
    const newEmail = "falitianajyjy@gmail.com.com";
    const newPassword = "jyan35112";

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
        `UPDATE users SET email = $1, password_hash = $2 WHERE role = 'admin'`,
        [newEmail, passwordHash]
    );

    console.log("Admin mis à jour.");
    await pool.end();
}

updateAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});