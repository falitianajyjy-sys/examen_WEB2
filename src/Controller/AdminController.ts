import type { Request, Response } from "express";
// @ts-ignore
import bcrypt from "bcrypt";
// @ts-ignore
import * as StudentRepo from "../Repositorie/StudentRepository";

//  un étudiant (Admin)
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
