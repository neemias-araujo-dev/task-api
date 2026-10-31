import { Task } from "../types/task";


const tasks: Task[] = [];


export function getAllTasks(): Task[] {
  return tasks;
}