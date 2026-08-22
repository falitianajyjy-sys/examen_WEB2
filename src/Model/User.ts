export type Role = "admin" | "etudiant";

export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: Role;
    is_active: boolean;
}