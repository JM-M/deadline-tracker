import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { auth } from "@/lib/auth";
import { RemindersView } from "@/modules/reminders/ui/view/reminders-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.reminders.getMany.queryOptions({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <RemindersView />
      </Suspense>
    </HydrationBoundary>
  );
}
