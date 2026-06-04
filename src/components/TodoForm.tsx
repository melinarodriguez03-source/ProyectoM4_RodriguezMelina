import { useEffect, useState } from "react";
import type { Task, NewTask } from "../types";

interface Props {
  onSubmit: (data: Pick<NewTask, "title" | "description">) => Promise<void>;
  editingTask?: Task | null;
  onCancel?: () => void;
}

const TodoForm = ({ onSubmit, editingTask, onCancel }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      if (!editingTask) {
        setTitle("");
        setDescription("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!editingTask;

  return (
    <form onSubmit={handleSubmit} className="todo-form" noValidate>
      <h2 className="form-heading">
        {isEditing ? "Editar tarea" : "Nueva tarea"}
      </h2>

      <div className="field">
        <label htmlFor="task-title">Título *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué hay que hacer?"
          required
          maxLength={100}
        />
      </div>

      <div className="field">
        <label htmlFor="task-desc">Descripción</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles opcionales..."
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting || !title.trim()}>
          {submitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar tarea"}
        </button>
        {isEditing && onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;