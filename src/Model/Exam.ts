export interface Exam {
    id: number;
    course_id: number;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string;
}