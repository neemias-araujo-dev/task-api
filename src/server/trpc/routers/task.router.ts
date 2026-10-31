import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../services/task.service";

export const taskRouter = router({

 
  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().trim().min(1, "Título é obrigatório"),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return createTask(input.titulo, input.descricao);
    }),

  
  getAll: publicProcedure.query(() => {
    return getAllTasks();
  }),

  
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        titulo: z.string().trim().min(1, "Título é obrigatório"),
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

});