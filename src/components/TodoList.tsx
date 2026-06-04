import TodoItem from "./TodoItem";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
  loading: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TodoList = ({ tasks, loading, onToggle, onEdit, onDelete }: Props) => {
  if (loading) {
    return <p className="tasks-status">Cargando tareas...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="tasks-empty">
        <p>No hay tareas para mostrar.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;