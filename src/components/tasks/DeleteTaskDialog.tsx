
"use client";

import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

type DeleteTaskDialogProps = {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
};

const PAGE_SIZE = 5;

export function DeleteTaskDialog({
  task,
  onClose,
  onSuccess,
}: DeleteTaskDialogProps) {
  const utils = api.useUtils();

  const deleteMutation = api.task.delete.useMutation({
    onSuccess: async () => {
      // Refaz as páginas carregadas para preencher lacunas e atualizar cursores.
      await utils.task.getPaginated.invalidate({
        limit: PAGE_SIZE,
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-950/15 sm:p-7"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Confirmar ação
        </p>
        <h2
          id="delete-dialog-title"
          className="mt-1 text-xl font-semibold tracking-tight text-gray-950"
        >
          Excluir tarefa?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Tem certeza de que deseja excluir a tarefa{" "}
          <strong>{task.titulo}</strong>?
          Essa ação não poderá ser desfeita.
        </p>

        {deleteMutation.error && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            Erro ao excluir tarefa: {deleteMutation.error.message}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="min-h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="min-h-10 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
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
