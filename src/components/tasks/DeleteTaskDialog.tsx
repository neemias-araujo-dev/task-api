
"use client";

import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

type DeleteTaskDialogProps = {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function DeleteTaskDialog({
  task,
  onClose,
  onSuccess,
}: DeleteTaskDialogProps) {
  const utils = api.useUtils();

  const deleteMutation = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate();
      onSuccess();
    },
  });

  if (!task) {
    return null;
  }

  function handleDelete() {
  if (!task) return;

  deleteMutation.mutate({
    id: task.id,
  });
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h2
          id="delete-dialog-title"
          className="text-xl font-bold text-gray-900"
        >
          Excluir tarefa?
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Tem certeza de que deseja excluir a tarefa{" "}
          <strong>{task.titulo}</strong>?
          Essa ação não poderá ser desfeita.
        </p>

        {deleteMutation.error && (
          <p className="mt-3 text-sm text-red-600">
            Erro ao excluir tarefa: {deleteMutation.error.message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending
              ? "Excluindo..."
              : "Confirmar exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
}
