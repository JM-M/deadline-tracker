import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { reminder } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const remindersRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.session.userId;
      const reminders = await db
        .select()
        .from(reminder)
        .where(eq(reminder.userId, userId))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      return reminders;
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        deadline: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.session.userId;
      const [createdReminder] = await db
        .insert(reminder)
        .values({
          ...input,
          userId,
        })
        .returning();

      if (!createdReminder) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create reminder",
        });
      }

      return createdReminder;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        deadline: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.session.userId;
      const [updatedReminder] = await db
        .update(reminder)
        .set(input)
        .where(and(eq(reminder.id, input.id), eq(reminder.userId, userId)))
        .returning();

      if (!updatedReminder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reminder not found",
        });
      }

      return updatedReminder;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.session.userId;
      const [deletedReminder] = await db
        .delete(reminder)
        .where(and(eq(reminder.id, input.id), eq(reminder.userId, userId)))
        .returning();

      if (!deletedReminder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reminder not found",
        });
      }

      return deletedReminder;
    }),
});
