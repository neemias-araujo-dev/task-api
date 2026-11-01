
import type { Task } from "@/server/trpc/types/task";

type TaskItemProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({
  task,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <article className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="min-w-0">
        <h3 className="break-words text-sm font-semibold leading-6 text-gray-900">
          {task.titulo}
        </h3>

        {task.descricao && (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
            {task.descricao}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Criada em {new Date(task.dataCriacao).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(task)}
          className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
