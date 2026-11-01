"use client";

import { useEffect, useRef } from "react";
import type { Task } from "@/server/trpc/types/task";
import { api } from "@/trpc/react";
import { TaskItem } from "./TaskItem";

type InitialTaskPage = {
  items: Task[];
  nextCursor?: number;
};

type TaskListProps = {
  initialPage: InitialTaskPage;
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

const PAGE_SIZE = 5;

export function TaskList({
  initialPage,
  onCreate,
  onEdit,
  onDelete,
}: TaskListProps) {
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
    return (
      <p role="status" className="py-10 text-center text-sm text-gray-500">
        Carregando tarefas...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Erro ao carregar tarefas: {error.message}
      </p>
    );
  }

  return (
    <section className="mt-8" aria-labelledby="task-list-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="task-list-heading" className="text-base font-semibold text-gray-900">
          Tarefas
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
          <p className="text-base font-medium text-gray-900">
            Sua lista está vazia
          </p>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
            Crie uma tarefa para registrar o que você precisa fazer.
          </p>
          <button
            onClick={onCreate}
            className="mt-5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          >
            Criar primeira tarefa
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}

      <div
        ref={loadMoreRef}
        className="mt-2 min-h-12 py-4 text-center"
        role="status"
        aria-live="polite"
      >
        {isFetchingNextPage && (
          <p className="text-sm text-gray-500">
            Carregando mais tarefas...
          </p>
        )}

        {!hasNextPage && tasks.length > 0 && (
          <p className="text-xs text-gray-500">
            Você chegou ao final das tarefas.
          </p>
        )}
      </div>
    </section>
  );
}
