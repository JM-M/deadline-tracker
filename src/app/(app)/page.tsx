"use client";

import { ReminderSheet } from "@/components/reminder-sheet";
import { Reminders } from "@/components/reminders";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

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
        onReminderClick={(reminder) => {
          setSelectedReminder(reminder);
          setIsSheetOpen(true);
        }}
      />

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

      <ReminderSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialData={selectedReminder}
      />
    </>
  );
}
