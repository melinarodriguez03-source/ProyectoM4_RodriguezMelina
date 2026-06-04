export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password: string): boolean =>
  password.length >= 6;

export const formatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
};

export const formatDateShort = (timestamp: number): string => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(timestamp));
};

import type { Task } from "../types";

export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, percentage };
};

export const buildEmailSummary = (tasks: Task[]): string => {
  const { total, completed, pending } = getTaskStats(tasks);
  const lines = [
    `Resumen de tareas`,
    `──────────────────`,
    `Total: ${total} | Completadas: ${completed} | Pendientes: ${pending}`,
    ``,
    ...tasks.map(
      (t) =>
        `[${t.status === "completed" ? "✓" : " "}] ${t.title}${
          t.description ? ` — ${t.description}` : ""
        }`
    ),
  ];
  return lines.join("\n");
};
