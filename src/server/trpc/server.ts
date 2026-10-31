import "server-only";

import { appRouter } from "@/server/trpc/routers/_app";

export const serverCaller = appRouter.createCaller({});