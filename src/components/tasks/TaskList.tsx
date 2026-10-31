"use client";

import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  initialTasks: Task[];
  onEdit: (task: Task) => void;
};

export function TaskList({
  initialTasks,
  onEdit,
}: TaskListProps) {
  const { data: tasks, isLoading, error } =
    api.task.getAll.useQuery(undefined, {
      initialData: initialTasks,
    });

  if (isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (error) {
    return (
      <p className="text-red-600">
        Erro ao carregar tarefas: {error.message}
      </p>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-gray-500">
          Nenhuma tarefa cadastrada.
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Clique em Nova tarefa para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}