import { reminder } from "@/db/schema";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { InferSelectModel } from "drizzle-orm";

export type ReminderGetMany =
  inferRouterOutputs<AppRouter>["reminders"]["getMany"];

export type Reminder = InferSelectModel<typeof reminder>;
