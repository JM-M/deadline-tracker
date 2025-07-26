import { preferencesRouter } from "@/modules/preferences/server/procedures";
import { remindersRouter } from "@/modules/reminders/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  reminders: remindersRouter,
  preferences: preferencesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
