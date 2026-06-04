import { describe, it, expect } from "vitest";
import { isValidEmail, isStrongPassword, getTaskStats, buildEmailSummary } from "../src/utils";
import type { Task } from "../src/types";

const baseTasks: Task[] = [
  { id: "1", userId: "u", title: "A", description: "", status: "pending", priority: "medium", createdAt: 0, updatedAt: 0 },
  { id: "2", userId: "u", title: "B", description: "", status: "completed", priority: "low", createdAt: 0, updatedAt: 0 },
  { id: "3", userId: "u", title: "C", description: "", status: "completed", priority: "high", createdAt: 0, updatedAt: 0 },
];

describe("isValidEmail", () => {
  it("acepta emails válidos", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("a+b@domain.co")).toBe(true);
  });
  it("rechaza emails inválidos", () => {
    expect(isValidEmail("noatsign")).toBe(false);
    expect(isValidEmail("@nodomain")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isStrongPassword", () => {
  it("acepta contraseñas de 6 o más caracteres", () => {
    expect(isStrongPassword("abcdef")).toBe(true);
    expect(isStrongPassword("12345678")).toBe(true);
  });
  it("rechaza contraseñas cortas", () => {
    expect(isStrongPassword("abc")).toBe(false);
    expect(isStrongPassword("")).toBe(false);
  });
});

describe("getTaskStats", () => {
  it("calcula estadísticas correctamente", () => {
    const stats = getTaskStats(baseTasks);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.percentage).toBe(67);
  });
  it("retorna 0% cuando no hay tareas", () => {
    const stats = getTaskStats([]);
    expect(stats.percentage).toBe(0);
  });
});

describe("buildEmailSummary", () => {
  it("incluye el total de tareas en el resumen", () => {
    const summary = buildEmailSummary(baseTasks);
    expect(summary).toContain("Total: 3");
    expect(summary).toContain("Completadas: 2");
    expect(summary).toContain("Pendientes: 1");
  });
  it("incluye los títulos de las tareas", () => {
    const summary = buildEmailSummary(baseTasks);
    expect(summary).toContain("A");
    expect(summary).toContain("B");
  });
});