import { serverCaller } from "@/server/trpc/server";


export default async function Home() {
  const tasks = await serverCaller.task.getAll();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">
        Gerenciador de Tarefas
      </h1>

      <h2 className="mt-6 text-lg font-semibold">
        Tasks
      </h2>

      {tasks.length === 0 ? (
        <p className="mt-2 text-gray-500">
          Nenhuma tarefa encontrada.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded border p-4"
            >
              <h3 className="font-semibold">
                {task.titulo}
              </h3>

              <p>{task.descricao}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}