
"use client";

import { useState } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  initialTasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskList({
  initialTasks,
  onEdit,
  onDelete,
}: TaskListProps) {
  const [view, setView] = useState<"list" | "grid">("list");

  const {
    data: tasks,
    isLoading,
    error,
  } = api.task.getAll.useQuery(undefined, {
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

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Minhas tarefas ({tasks?.length ?? 0})
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`rounded-md border px-3 py-2 text-sm ${
              view === "list"
                ? "border-blue-600 bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Lista
          </button>

          <button
            onClick={() => setView("grid")}
            className={`rounded-md border px-3 py-2 text-sm ${
              view === "grid"
                ? "border-blue-600 bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            Cards
          </button>
        </div>
      </div>

      {!tasks || tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">
            Nenhuma tarefa cadastrada.
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Clique em Nova tarefa para começar.
          </p>
        </div>
      ) : (
        <div
          className={
            view === "list"
              ? "flex flex-col gap-4"
              : "grid grid-cols-1 gap-4 md:grid-cols-2"
          }
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              view={view}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
