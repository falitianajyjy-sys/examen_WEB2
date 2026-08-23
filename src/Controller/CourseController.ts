import { Request, Response } from "express";
import * as CourseService from "../Service/CourseService";

export async function create(requete: Request, reponse: Response) {
  try {
    const { code, name, description } = requete.body;
    const cours = await CourseService.createCourse(code, name, description ?? null);
    reponse.status(201).json(cours);
  } catch (err: any) {
    reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
  }
}

export async function list(requete: Request, reponse: Response) {
  try {
    const cours = await CourseService.getAllCourses();
    reponse.json(cours);
  } catch (err: any) {
    reponse.status(500).json({ message: "Erreur serveur" });
  }
}

export async function update(requete: Request, reponse: Response) {
  try {
    const id = Number(requete.params.id);
    const { code, name, description } = requete.body;
    const cours = await CourseService.updateCourse(id, code, name, description ?? null);
    reponse.json(cours);
  } catch (err: any) {
    reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
  }
}

export async function remove(requete: Request, reponse: Response) {
  try {
    const id = Number(requete.params.id);
    await CourseService.deleteCourse(id);
    reponse.status(204).send();
  } catch (err: any) {
    reponse.status(err.status ?? 500).json({ message: err.message ?? "Erreur serveur" });
  }
}