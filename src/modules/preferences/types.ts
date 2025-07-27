import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type PreferencesGet =
  inferRouterOutputs<AppRouter>["preferences"]["get"];
