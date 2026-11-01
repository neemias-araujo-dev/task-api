import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    const validationMessage =
      error.cause instanceof ZodError
        ? error.cause.issues[0]?.message
        : undefined;

    return {
      ...shape,
      message: validationMessage ?? shape.message,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
