import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TodoForm from '../src/components/TodoForm';

describe("TodoForm", () => {
  it("renderiza el formulario para nueva tarea", () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agregar tarea/i })).toBeInTheDocument();
  });

  it("el botón de submit está deshabilitado cuando el título está vacío", () => {
    render(<TodoForm onSubmit={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /agregar tarea/i });
    expect(submitBtn).toBeDisabled();
  });

  it("llama a onSubmit con title y description al enviar", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: "Nueva tarea" },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: "Detalles" },
    });

    fireEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: "Nueva tarea",
        description: "Detalles",
      });
    });
  });

  it("en modo edición muestra los datos de la tarea y el botón cancelar", () => {
    const task = {
      id: "1",
      userId: "u1",
      title: "Editar esto",
      description: "Descripción existente",
      status: "pending" as const,
      priority: "medium" as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    render(<TodoForm onSubmit={vi.fn()} editingTask={task} onCancel={vi.fn()} />);

    expect(screen.getByDisplayValue("Editar esto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descripción existente")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("limpia el formulario después de enviar nueva tarea", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/título/i);
    fireEvent.change(titleInput, { target: { value: "Mi tarea" } });
    fireEvent.click(screen.getByRole("button", { name: /agregar tarea/i }));

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
    });
  });
});