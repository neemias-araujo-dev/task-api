import type { Task } from "@/server/trpc/types/task";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
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
    </div>
  );
}