import { formatDate } from '../utils';
import type { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ task, onToggle, onEdit, onDelete }: Props) => {
  const isCompleted = task.status === "completed";

  return (
    <li className={`todo-item ${isCompleted ? "todo-item--completed" : ""}`}>
      <button
        className="todo-checkbox"
        onClick={() => onToggle(task)}
        aria-label={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        aria-pressed={isCompleted}
      >
        {isCompleted && "✓"}
      </button>

      <div className="todo-content">
        <p className="todo-title">{task.title}</p>
        {task.description && (
          <p className="todo-description">{task.description}</p>
        )}
        <span className="todo-date">{formatDate(task.createdAt)}</span>
      </div>

      <div className="todo-actions">
        <button
          className="btn-icon"
          onClick={() => onEdit(task)}
          aria-label="Editar tarea"
          disabled={isCompleted}
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-icon--danger"
          onClick={() => onDelete(task.id)}
          aria-label="Eliminar tarea"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default TodoItem;