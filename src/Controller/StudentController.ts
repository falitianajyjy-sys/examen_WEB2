import type { Request, Response } from "express";
// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import * as StudentRepo from "../Repositorie/StudentRepository";

// Créer un étudiant (Admin)
export async function createStudentController(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Nom, email et mot de passe requis" });
        }
        const hash = await bcrypt.hash(password, 10);
        const student = await StudentRepo.createStudent(name, email, hash);
        return res.status(201).json(student);
    } catch (err: any) {
        return res
            .status(err.status || 500)
            .json({ message: err.message || "Erreur serveur" });
    }
}

export async function listStudentsController(req: Request, res: Response) {
    try {
        const students = await StudentRepo.getAllStudents();
        return res.json(students);
    } catch (err: any) {
        return res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function updateStudentController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { name, email, password } = req.body;

        if (password) {
            const hash = await bcrypt.hash(password, 10);
            await StudentRepo.resetStudentPassword(id, hash);
        }

        if (name && email) {
            const updated = await StudentRepo.updateStudent(id, name, email);
            if (!updated) {
                return res.status(404).json({ message: "Étudiant introuvable" });
            }
            return res.json(updated);
        }

        return res.status(200).json({ message: "Mot de passe réinitialisé" });
    } catch (err: any) {
        return res
            .status(err.status || 500)
            .json({ message: err.message || "Erreur serveur" });
    }
}

export async function deactivateStudentController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await StudentRepo.toggleStudentStatus(id, false);
        return res.status(200).json({ message: "Étudiant désactivé" });
    } catch (err: any) {
        return res.status(500).json({ message: "Erreur serveur" });
    }
}