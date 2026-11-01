import { Task } from "../types/task";

const globalForTasks = globalThis as typeof globalThis & {
  taskManagerTasks?: Task[];
};

const tasks =
  globalForTasks.taskManagerTasks ??
  (globalForTasks.taskManagerTasks = []);

export function createTask(
  titulo: string,
  descricao?: string
): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    titulo,
    descricao,
    dataCriacao: Date.now(),
  };

  tasks.push(newTask);

  return newTask;
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function getPaginatedTasks(
  cursor: number,
  limit: number
) {
  const items = tasks.slice(cursor, cursor + limit);

  const nextCursor =
    cursor + items.length < tasks.length
      ? cursor + items.length
      : undefined;

  return {
    items,
    nextCursor,
  };
}

export function getTaskCount(): number {
  return tasks.length;
}

export function updateTask(
  id: string,
  titulo: string,
  descricao?: string
): Task {
  const taskIndex = tasks.findIndex(
    (task) => task.id === id
  );

  if (taskIndex === -1) {
    throw new Error("Task not found");
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    titulo,
    descricao,
  };

  tasks[taskIndex] = updatedTask;

  return updatedTask;
}

export function deleteTask(id: string): Task {
  const taskIndex = tasks.findIndex(
    (task) => task.id === id
  );

  if (taskIndex === -1) {
    throw new Error("Task not found");
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);

  return deletedTask;
}
