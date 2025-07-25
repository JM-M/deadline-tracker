import { Button } from "@/components/ui/button";
import { ReminderGetMany } from "@/modules/reminders/types";
import { ReminderCard } from "@/modules/reminders/ui/component/reminder-card";
import { PlusIcon } from "lucide-react";

interface RemindersProps {
  reminders: ReminderGetMany;
  onReminderClick: (reminder: any) => void;
  onAddReminderClick: () => void;
}

export const Reminders = ({
  onReminderClick,
  reminders,
  onAddReminderClick,
}: RemindersProps) => {
  if (!reminders.length) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p>Create your first reminder</p>
        <Button onClick={onAddReminderClick}>
          <PlusIcon />
          Add Reminder
        </Button>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reminders.map((reminder) => {
        const { id } = reminder;
        return (
          <li key={id}>
            <ReminderCard
              reminder={reminder}
              onClick={() => onReminderClick(reminder)}
            />
          </li>
        );
      })}
    </ul>
  );
};
