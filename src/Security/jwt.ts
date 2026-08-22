// @ts-ignore
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
    userId: number;
    role: "admin" | "etudiant";
}

// @ts-ignore
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: "8h" });
}

// @ts-ignore
export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
}