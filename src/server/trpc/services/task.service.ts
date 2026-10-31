import { Task } from "../types/task";


const tasks: Task[] = [];


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


export function updateTask(
  id: string,
  titulo: string,
  descricao?: string
): Task {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    throw new Error("Tarefa não encontrada");
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
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    throw new Error("Tarefa não encontrada");
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);

  return deletedTask;
}