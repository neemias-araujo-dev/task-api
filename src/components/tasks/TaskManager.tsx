"use client";

import { useState } from "react";
import type { Task } from "@/server/trpc/types/task";

import { TaskModal } from "./TaskModal";
import { TaskList } from "./TaskList";

type TaskManagerProps = {
  initialTasks: Task[];
};

export function TaskManager({
  initialTasks,
}: TaskManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Task Manager
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize suas tarefas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </button>
      </div>

      <TaskList initialTasks={initialTasks} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </main>
  );
}