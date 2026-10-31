import { TaskManager } from "@/components/tasks/TaskManager";
import { serverCaller } from "@/server/trpc/server";


export default async function Home() {
  return <TaskManager />;
}