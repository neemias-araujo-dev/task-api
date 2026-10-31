import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return {
      status: "ok",
      message: "Task API is running!",
    };
  }),
});

export type AppRouter = typeof appRouter;