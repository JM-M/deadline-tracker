import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReminderGetMany } from "@/modules/reminders/types";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

interface ReminderCardProps {
  reminder: ReminderGetMany[number];
  onClick: () => void;
}

export const ReminderCard = ({ reminder, onClick }: ReminderCardProps) => {
  const { title, description, deadline } = reminder;

  let deadlineText = "No deadline";
  if (deadline) {
    const diffDays = differenceInDays(deadline, new Date());
    const diffHours = differenceInHours(deadline, new Date());
    const diffMinutes = differenceInMinutes(deadline, new Date());
    deadlineText = `${diffDays}D ${diffHours}H ${diffMinutes}M`;
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
          <p className="text-muted-foreground text-sm font-medium">
            {deadlineText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
