import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TodoList from "../src/components/TodoList";
import type { Task } from "../src/types";

const mockTasks: Task[] = [
  {
    id: "1",
    userId: "u1",
    title: "Tarea pendiente",
    description: "Desc 1",
    status: "pending",
    priority: "medium",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    userId: "u1",
    title: "Tarea completada",
    description: "",
    status: "completed",
    priority: "low",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

describe("TodoList", () => {
  it("muestra spinner de carga cuando loading=true", () => {
    render(
      <TodoList tasks={[]} loading={true} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("muestra mensaje vacío si no hay tareas", () => {
    render(
      <TodoList tasks={[]} loading={false} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it("renderiza la lista de tareas", () => {
    render(
      <TodoList tasks={mockTasks} loading={false} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText("Tarea pendiente")).toBeInTheDocument();
    expect(screen.getByText("Tarea completada")).toBeInTheDocument();
  });

  it("llama a onDelete cuando se hace click en eliminar", () => {
    const mockDelete = vi.fn();
    render(
      <TodoList tasks={mockTasks} loading={false} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={mockDelete} />
    );

    const deleteButtons = screen.getAllByLabelText(/eliminar tarea/i);
    fireEvent.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("llama a onToggle cuando se hace click en el checkbox", () => {
    const mockToggle = vi.fn();
    render(
      <TodoList tasks={mockTasks} loading={false} onToggle={mockToggle} onEdit={vi.fn()} onDelete={vi.fn()} />
    );

    const checkboxes = screen.getAllByRole("button", { name: /marcar como/i });
    fireEvent.click(checkboxes[0]);
    expect(mockToggle).toHaveBeenCalledWith(mockTasks[0]);
  });
});