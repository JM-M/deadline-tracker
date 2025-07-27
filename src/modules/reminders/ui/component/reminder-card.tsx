import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReminderTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import { ReminderGetMany } from "@/modules/reminders/types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { differenceInDays, differenceInMinutes, isBefore } from "date-fns";

interface ReminderCardProps {
  reminder: ReminderGetMany[number];
  onClick: () => void;
}

export const ReminderCard = ({ reminder, onClick }: ReminderCardProps) => {
  const { title } = reminder;
  let deadline = reminder.deadline;

  const trpc = useTRPC();
  const preferences = useSuspenseQuery(trpc.preferences.get.queryOptions());

  const reminderTime = preferences.data
    ? getReminderTime({
        utcReminderTime: preferences.data.utcReminderTime,
        timezone: preferences.data.timezone,
      })
    : null;

  // If we have a deadline and preferences exist, combine the date with the reminder time
  if (deadline && reminderTime) {
    const selectedDate = deadline;

    // Create a new date by combining the selected date with the reminder time
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(
      reminderTime.getHours(),
      reminderTime.getMinutes(),
      reminderTime.getSeconds(),
      0,
    );

    deadline = combinedDateTime.toISOString();
  }

  const now = new Date();
  const isPast = deadline && isBefore(deadline, now);

  let deadlineText = "No deadline";
  if (deadline) {
    const diffDays = differenceInDays(deadline, now);
    const diffMinutes = differenceInMinutes(deadline, now);

    if (Math.abs(diffDays) > 0) {
      if (isPast) {
        deadlineText = `${Math.abs(diffDays)} day${
          Math.abs(diffDays) === 1 ? "" : "s"
        } ago`;
      } else {
        deadlineText = `${diffDays} day${diffDays === 1 ? "" : "s"} left`;
      }
    } else {
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const minutes = Math.abs(diffMinutes) % 60;

      if (diffMinutes === 0) {
        deadlineText = "Due now";
      } else if (isPast) {
        deadlineText = `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${
          minutes === 1 ? "" : "s"
        } ago`;
      } else {
        deadlineText = `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${
          minutes === 1 ? "" : "s"
        } left`;
      }
    }
  }

  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer gap-1 border py-2 shadow-none transition-colors"
      onClick={() => onClick()}
    >
      <CardHeader className="px-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3">
        <div className="flex items-center justify-end">
          <p
            className={cn("text-muted-foreground text-sm font-medium", {
              "text-red-400": isPast,
            })}
          >
            {deadlineText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
