
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import {
  createTask,
  getAllTasks,
  getTaskCount,
  getPaginatedTasks,
  updateTask,
  deleteTask,
} from "../services/task.service";

const taskTitleSchema = z
  .string({ error: "O título precisa ser um texto." })
  .trim()
  .min(1, { error: "Digite um título para a tarefa." });

export const taskRouter = router({
  create: publicProcedure
    .input(
      z.object({
        titulo: taskTitleSchema,
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return createTask(input.titulo, input.descricao);
    }),

  getAll: publicProcedure.query(() => {
    return getAllTasks();
  }),

  getCount: publicProcedure.query(() => {
    return getTaskCount();
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        titulo: taskTitleSchema,
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      try {
        return updateTask(
          input.id,
          input.titulo,
          input.descricao
        );
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ input }) => {
      try {
        return deleteTask(input.id);
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }
    }),

  getPaginated: publicProcedure
    .input(
      z.object({
        cursor: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(50).default(5),
      })
    )
    .query(({ input }) => {
      return getPaginatedTasks(
        input.cursor,
        input.limit
      );
    }),
});
