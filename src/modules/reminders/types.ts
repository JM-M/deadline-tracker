import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type ReminderGetMany =
  inferRouterOutputs<AppRouter>["reminders"]["getMany"];
