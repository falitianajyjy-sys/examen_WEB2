import type {Request, Response} from "express";
// @ts-ignore
import { login, AuthError } from "../Service/AuthService";

// @ts-ignore
export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    try {
        const result = await login(email, password);
        res.json(result);
    } catch (err) {
        if (err instanceof AuthError) {
            return res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
}