
import { TaskManager } from "@/components/tasks/TaskManager";
import { serverCaller } from "@/server/trpc/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 5;

export default async function Home() {
  const initialPage = await serverCaller.task.getPaginated({
    cursor: 0,
    limit: PAGE_SIZE,
  });

  return <TaskManager initialPage={initialPage} />;
}
