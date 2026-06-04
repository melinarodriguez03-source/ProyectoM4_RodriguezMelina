import type { NewTask } from '../types';
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import TaskFilters from "../components/TaskFilters";
import EmailButton from "../components/EmailButton";
import type { Task } from "../types";

const TasksPage = () => {
  const { user, logout } = useAuth();
  const {
    tasks,
    allTasks,
    loading,
    error,
    filter,
    setFilter,
    create,
    update,
    remove,
    toggle,
  } = useTasks(user?.uid);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => setEditingTask(task);
  const handleCancelEdit = () => setEditingTask(null);

  const handleUpdate = async (data: { title: string; description: string }) => {
    if (!editingTask) return;
    await update(editingTask.id, data);
    setEditingTask(null);
  };

  const handleCreate = async (data: Pick<NewTask, "title" | "description">) => {
    await create({ ...data, status: "pending", priority: "medium" });
  };

  return (
    <div className="tasks-layout">
      <header className="tasks-header">
        <h1 className="app-title">Mis Tareas</h1>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <EmailButton tasks={allTasks} userEmail={user?.email ?? ""} />
          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="tasks-main">
        <TodoForm
          onSubmit={editingTask ? handleUpdate : handleCreate}
          editingTask={editingTask}
          onCancel={handleCancelEdit}
        />

        <TaskFilters current={filter} onChange={setFilter} />

        {error && <p className="error-text">{error}</p>}

        <TodoList
          tasks={tasks}
          loading={loading}
          onToggle={toggle}
          onEdit={handleEdit}
          onDelete={remove}
        />
      </main>
    </div>
  );
};

export default TasksPage;