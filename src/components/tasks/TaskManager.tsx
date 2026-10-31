"use client";

import { useState } from "react";
import { TaskModal } from "./TaskModal";

export function TaskManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Task Manager
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </button>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </main>
  );
}