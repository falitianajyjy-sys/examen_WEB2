import type {Request, Response, NextFunction} from "express";
// @ts-ignore
import { verifyToken, JwtPayload } from "./jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

// @ts-ignore
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    try {
        const token = header.replace("Bearer ", "");
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
}

// @ts-ignore
export function requireRole(role: "admin" | "etudiant") {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
}