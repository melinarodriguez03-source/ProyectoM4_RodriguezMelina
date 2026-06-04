import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Task, NewTask, UpdateTask } from "../../types";

const COLLECTION = "tasks";

// ─── Subscribe (real-time) ───────────────────────────────────────────────────

export const subscribeToTasks = (
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Task, "id">),
        id: d.id,
      }));
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      onData(tasks);
    },
    onError
  );
};

// ─── Create ──────────────────────────────────────────────────────────────────

export const createTask = async (
  userId: string,
  task: NewTask
): Promise<void> => {
  const now = Date.now();
  await addDoc(collection(db, COLLECTION), {
    ...task,
    userId,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });
};

// ─── Update ──────────────────────────────────────────────────────────────────

export const updateTask = async (
  taskId: string,
  changes: UpdateTask
): Promise<void> => {
  const ref = doc(db, COLLECTION, taskId);
  await updateDoc(ref, { ...changes, updatedAt: Date.now() });
};

// ─── Delete ──────────────────────────────────────────────────────────────────

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, taskId));
};

// ─── Toggle completed ────────────────────────────────────────────────────────

export const toggleTaskStatus = async (task: Task): Promise<void> => {
  await updateTask(task.id, {
    status: task.status === "completed" ? "pending" : "completed",
  });
};