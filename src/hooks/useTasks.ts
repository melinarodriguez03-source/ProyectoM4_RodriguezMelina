import { useEffect, useState } from "react";
import {
  subscribeToTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../features/tasks/tasksService";
import type { Task, NewTask, UpdateTask, TaskFilter } from "../types";
 
export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");
 
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }
 
    setLoading(true);
    const unsub = subscribeToTasks(
      userId,
      (data) => {
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
 
    return unsub;
  }, [userId]);
 
  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });
 
  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    filter,
    setFilter,
    create: (task: NewTask) => userId ? createTask(userId, task) : Promise.resolve(),
    update: (id: string, changes: UpdateTask) => updateTask(id, changes),
    remove: (id: string) => deleteTask(id),
    toggle: (task: Task) => toggleTaskStatus(task),
  };
};
 