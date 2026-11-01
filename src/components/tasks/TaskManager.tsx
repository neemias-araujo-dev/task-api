"use client";

import { useState } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

import { TaskModal } from "./TaskModal";
import { TaskList } from "./TaskList";
import { DeleteTaskDialog } from "./DeleteTaskDialog";

type InitialTaskPage = {
  items: Task[];
  nextCursor?: number;
};

type TaskManagerProps = {
  initialPage: InitialTaskPage;
};

export function TaskManager({
  initialPage,
}: TaskManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState("");

  const utils = api.useUtils();

  const { data: taskCount, isLoading: isCountLoading } =
    api.task.getCount.useQuery(undefined, {
      staleTime: 30_000,
    });

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
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-6 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Organize seu dia
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Minhas tarefas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isCountLoading
              ? "Carregando tarefas..."
              : `${taskCount ?? 0} ${taskCount === 1 ? "tarefa cadastrada" : "tarefas cadastradas"}`}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
        >
          Nova tarefa
        </button>
      </header>

      {feedback && (
        <div
          role="status"
          className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900"
        >
          {feedback}

          <button
            onClick={() => setFeedback("")}
            className="shrink-0 rounded px-2 py-1 font-medium text-green-800 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
          >
            Fechar mensagem
          </button>
        </div>
      )}

      <TaskList
        initialPage={initialPage}
        onCreate={handleCreate}
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
