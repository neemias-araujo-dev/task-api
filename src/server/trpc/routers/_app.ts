import { router, publicProcedure } from "../trpc";
import { taskRouter } from "./task.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return {
      status: "ok",
      message: "Task API is running!",
    };
  }),

  task: taskRouter,
});

export type AppRouter = typeof appRouter;