"use client";

import { useState, useEffect, useRef } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";
import { TaskItem } from "./TaskItem";

type InitialTaskPage = {
  items: Task[];
  nextCursor?: number;
};

type TaskListProps = {
  initialPage: InitialTaskPage;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const PAGE_SIZE = 5;

export function TaskList({
  initialPage,
  onEdit,
  onDelete,
}: TaskListProps) {
  const [view, setView] = useState<"list" | "grid">("list");

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.task.getPaginated.useInfiniteQuery(
    {
      limit: PAGE_SIZE,
    },
    {
      initialCursor: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,

      initialData: {
        pages: [initialPage],
        pageParams: [0],
      },
      // Os dados vieram do SSR; mutations invalidam a consulta quando há mudanças.
      staleTime: 30_000,
    }
  );

  const tasks = data.pages.flatMap((page) => page.items);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          Tarefas em tela ({tasks.length})
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

      {tasks.length === 0 ? (
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

      <div
        ref={loadMoreRef}
        className="mt-6 py-4 text-center"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-gray-500">
            Carregando mais tarefas...
          </p>
        )}

        {!hasNextPage && tasks.length > 0 && (
          <p className="text-sm text-gray-400">
            Você chegou ao final das tarefas.
          </p>
        )}
      </div>
    </div>
  );
}
