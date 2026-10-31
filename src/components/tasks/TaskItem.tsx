
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">
        {task.titulo}
      </h3>

      {task.descricao && (
        <p className="mt-2 text-sm text-gray-600">
          {task.descricao}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-400">
        Criada em:{" "}
        {new Date(task.dataCriacao).toLocaleString("pt-BR")}
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onEdit(task)}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(task)}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
