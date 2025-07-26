import { db } from "@/db";
import { preferences } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const preferencesRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [preference = null] = await db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, ctx.auth.session.userId));
    return preference;
  }),
  update: protectedProcedure
    .input(
      z.object({
        utcReminderTime: z.string(),
        timezone: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Step 1: Try to find existing preference
      const [existingPreference] = await db
        .select()
        .from(preferences)
        .where(eq(preferences.userId, ctx.auth.session.userId))
        .limit(1);

      // Step 2: If preference exists, update it
      if (existingPreference) {
        const [updatedPreference] = await db
          .update(preferences)
          .set({
            timezone: input.timezone,
            utcReminderTime: input.utcReminderTime,
            updatedAt: new Date(),
          })
          .where(eq(preferences.userId, ctx.auth.session.userId))
          .returning();

        return updatedPreference;
      }

      // Step 3: If no preference exists, create a new one
      const newPreference = {
        userId: ctx.auth.session.userId,
        timezone: input.timezone,
        utcReminderTime: input.utcReminderTime,
      };

      const [createdPreference] = await db
        .insert(preferences)
        .values(newPreference)
        .returning();

      return createdPreference;
    }),
});
