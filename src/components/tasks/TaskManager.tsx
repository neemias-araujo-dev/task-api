
"use client";

import { useState } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

import { TaskModal } from "./TaskModal";
import { TaskList } from "./TaskList";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

type TaskManagerProps = {
  initialTasks: Task[];
};

export function TaskManager({
  initialTasks,
}: TaskManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState("");

  const utils = api.useUtils();

  const { data: taskCount, isLoading: isCountLoading } =
    api.task.getCount.useQuery();

  function handleCreate() {
    setSelectedTask(null);
    setIsModalOpen(true);
    setFeedback("");
  }

  function handleEdit(task: Task) {
    setSelectedTask(task);
    setIsModalOpen(true);
    setFeedback("");
  }

  function handleClose() {
    setIsModalOpen(false);
    setSelectedTask(null);
  }

  function handleModalSuccess() {
    void utils.task.getCount.invalidate();
    handleClose();
  }

  function handleDelete(task: Task) {
    setTaskToDelete(task);
    setFeedback("");
  }

  function handleDeleteSuccess() {
    void utils.task.getCount.invalidate();

    setTaskToDelete(null);
    setFeedback("Tarefa excluída com sucesso.");
  }

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

          <p className="mt-2 text-sm font-medium text-gray-700">
            Minhas tarefas:{" "}
            {isCountLoading ? "..." : taskCount ?? 0}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className="mt-4 rounded-md bg-green-100 p-3 text-sm text-green-800"
        >
          {feedback}

          <button
            onClick={() => setFeedback("")}
            className="ml-3 font-semibold"
          >
            Fechar
          </button>
        </div>
      )}

      <TaskList
        initialTasks={initialTasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={handleClose}
        onSuccess={handleModalSuccess}
      />

      <DeleteTaskDialog
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onSuccess={handleDeleteSuccess}
      />
    </main>
  );
}
