"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { ReminderSheet } from "@/modules/reminders/ui/component/reminder-sheet";
import { Reminders } from "@/modules/reminders/ui/component/reminders";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const RemindersView = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reminders.getMany.queryOptions({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  );

  return (
    <>
      <div className="space-y-2 py-10 text-center">
        <p className="text-muted-foreground text-sm">
          Next reminder by 8:00 AM, tomorrow
        </p>
        <p className="text-xl font-bold">43D 12H 34M</p>
        <Button variant="ghost" className="mt-2 h-fit">
          Edit
        </Button>
      </div>

      <Reminders
        reminders={data}
        onReminderClick={(reminder) => {
          setSelectedReminder(reminder);
          setIsSheetOpen(true);
        }}
        onAddReminderClick={() => {
          setSelectedReminder(null);
          setIsSheetOpen(true);
        }}
      />

      {data.length > 0 && (
        <Button
          size="icon"
          className="fixed right-4 bottom-10 size-12"
          onClick={() => {
            setSelectedReminder(null);
            setIsSheetOpen(true);
          }}
        >
          <PlusIcon className="size-8" />
        </Button>
      )}

      <ReminderSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialData={selectedReminder}
      />
    </>
  );
};
