import * as CourseRepository from "../Repositorie/CourseRepository";
import { Course } from "../Model/Course";

export async function createCourse(
  code: string,
  name: string,
  description: string | null
): Promise<Course> {
  if (!code || !name) {
    throw { status: 400, message: "Le code et le nom sont obligatoires" };
  }
  try {
    return await CourseRepository.createCourse(code, name, description);
  } catch (err: any) {
    if (err.code === "23505") {
      // violation de contrainte unique (code déjà utilisé)
      throw { status: 409, message: "Ce code de cours existe déjà" };
    }
    throw err;
  }
}

export async function getAllCourses(): Promise<Course[]> {
  return CourseRepository.getAllCourses();
}

export async function updateCourse(
  id: number,
  code: string,
  name: string,
  description: string | null
): Promise<Course> {
  if (!code || !name) {
    throw { status: 400, message: "Le code et le nom sont obligatoires" };
  }
  try {
    const updated = await CourseRepository.updateCourse(id, code, name, description);
    if (!updated) {
      throw { status: 404, message: "Cours introuvable" };
    }
    return updated;
  } catch (err: any) {
    if (err.code === "23505") {
      throw { status: 409, message: "Ce code de cours existe déjà" };
    }
    throw err;
  }
}

export async function deleteCourse(id: number): Promise<void> {
  try {
    await CourseRepository.deleteCourse(id);
  } catch (err: any) {
    if (err.code === "23503") {
      // violation de clé étrangère (des examens existent pour ce cours)
      throw { status: 409, message: "Impossible de supprimer un cours qui possède des examens" };
    }
    throw err;
  }
}