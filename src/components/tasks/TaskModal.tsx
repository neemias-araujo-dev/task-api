"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";

type TaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
};

const PAGE_SIZE = 5;

export function TaskModal({
  isOpen,
  task,
  onClose,
  onSuccess,
}: TaskModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [validationError, setValidationError] = useState("");

  const utils = api.useUtils();

  async function refreshTasks() {
    await utils.task.getPaginated.invalidate({
      limit: PAGE_SIZE,
    });

    onSuccess();
  }

  const createMutation = api.task.create.useMutation({
    onSuccess: refreshTasks,
  });

  const updateMutation = api.task.update.useMutation({
    onSuccess: refreshTasks,
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
      setValidationError("");
      createMutation.reset();
      updateMutation.reset();
    }
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = titulo.trim();

    if (!normalizedTitle) {
      setValidationError("Digite um título para a tarefa.");
      return;
    }

    setValidationError("");

    const normalizedDescription = descricao.trim();

    if (isEditing && task) {
      updateMutation.mutate({
        id: task.id,
        titulo: normalizedTitle,
        descricao: normalizedDescription || undefined,
      });

      return;
    }

    createMutation.mutate({
      titulo: normalizedTitle,
      descricao: normalizedDescription || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-950/15 sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Tarefas
            </p>
            <h2 id="task-modal-title" className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
            {isEditing ? "Editar tarefa" : "Nova tarefa"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="titulo"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Título
            </label>

            <input
              id="titulo"
              type="text"
              autoFocus
              aria-invalid={Boolean(validationError)}
              aria-describedby={validationError ? "titulo-validation-error" : undefined}
              value={titulo}
              onChange={(event) => {
                setTitulo(event.target.value);
                setValidationError("");
              }}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 outline-none transition-shadow placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              placeholder="Digite o título da tarefa"
            />
            {validationError && (
              <p
                id="titulo-validation-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {validationError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="mb-1.5 block text-sm font-medium text-gray-800"
            >
              Descrição
            </label>

            <textarea
              id="descricao"
              rows={4}
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-6 text-gray-950 outline-none transition-shadow placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              placeholder="Descreva sua tarefa"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error.message}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
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
