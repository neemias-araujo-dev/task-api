"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

type TaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function TaskModal({
  isOpen,
  task,
  onClose,
  onSuccess,
}: TaskModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const utils = api.useUtils();

  const createMutation = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate();
      onSuccess();
    },
  });

  const updateMutation = api.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.getAll.invalidate();
      onSuccess();
    },
  });

  const isEditing = task !== null;

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  const error =
    createMutation.error || updateMutation.error;

  useEffect(() => {
    if (isOpen) {
      setTitulo(task?.titulo ?? "");
      setDescricao(task?.descricao ?? "");
    }
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isEditing && task) {
      updateMutation.mutate({
        id: task.id,
        titulo,
        descricao: descricao || undefined,
      });

      return;
    }

    createMutation.mutate({
      titulo,
      descricao: descricao || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isEditing ? "Editar tarefa" : "Nova tarefa"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="titulo"
              className="mb-1 block text-sm font-medium"
            >
              Título
            </label>

            <input
              id="titulo"
              type="text"
              required
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="mb-1 block text-sm font-medium"
            >
              Descrição
            </label>

            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              className="w-full resize-none rounded-md border p-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva sua tarefa"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              Erro: {error.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Salvar tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}