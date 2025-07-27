"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import { useAppContext } from "@/hooks/use-app-context";
import { getReminderTime } from "@/lib/time";
import { ReminderSheet } from "@/modules/reminders/ui/component/reminder-sheet";
import { Reminders } from "@/modules/reminders/ui/component/reminders";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

// const reminderTime = new Date(new Date().setHours(8, 0, 0, 0));

export const RemindersView = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const { setIsSettingsDialogOpen } = useAppContext();

  const trpc = useTRPC();
  const reminders = useSuspenseQuery(
    trpc.reminders.getMany.queryOptions({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  );

  const preferences = useSuspenseQuery(trpc.preferences.get.queryOptions());

  const reminderTime = preferences.data
    ? getReminderTime({
        utcReminderTime: preferences.data.utcReminderTime,
        timezone: preferences.data.timezone,
      })
    : null;

  return (
    <>
      <div className="space-y-2 py-10 text-center">
        {reminderTime ? (
          <p className="text-muted-foreground text-sm">
            Next reminder by{" "}
            <span className="text-primary font-semibold">
              {reminderTime.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
            , tomorrow
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">No reminder time set</p>
        )}
        <Button
          variant="ghost"
          className="h-fit underline"
          onClick={() => setIsSettingsDialogOpen(true)}
        >
          Settings
        </Button>
      </div>

      <Reminders
        reminders={reminders.data}
        onReminderClick={(reminder) => {
          setSelectedReminder(reminder);
          setIsSheetOpen(true);
        }}
        onAddReminderClick={() => {
          setSelectedReminder(null);
          setIsSheetOpen(true);
        }}
      />

      {reminders.data.length > 0 && (
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
