// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import { findUserByEmail } from "../Repositorie/UserRepository";
// @ts-ignore
import { generateToken } from "../Security/jwt";

// @ts-ignore
export class AuthError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

// @ts-ignore
export async function login(email: string, password: string) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new AuthError("Email ou mot de passe incorrect", 401);
    }

    if (!user.is_active) {
        throw new AuthError("Ce compte a été désactivé", 403);
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
        throw new AuthError("Email ou mot de passe incorrect", 401);
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return { token, role: user.role, name: user.name };
}
