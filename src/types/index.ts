// ─── Auth ────────────────────────────────────────────────────────────────────
 
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
 
// ─── Tasks ───────────────────────────────────────────────────────────────────
 
export type TaskStatus = "pending" | "completed";
 
export type TaskPriority = "low" | "medium" | "high";
 
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number; // timestamp ms
  updatedAt: number;
  dueDate?: number | null;
}
 
export type NewTask = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;
 
export type UpdateTask = Partial<Omit<Task, "id" | "userId" | "createdAt">>;
 
// ─── Filters ─────────────────────────────────────────────────────────────────
 
export type TaskFilter = "all" | "pending" | "completed";
 
// ─── Email ───────────────────────────────────────────────────────────────────
 
export interface EmailSummaryPayload {
  toEmail: string;
  tasks: Task[];
}
 
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}