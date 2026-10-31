
import { TaskManager } from "@/components/tasks/TaskManager";
import { serverCaller } from "@/server/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await serverCaller.task.getAll();

  return (
    <TaskManager initialTasks={tasks} />
  );
}
