import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RemindersProps {
  onReminderClick?: (reminder: any) => void;
}

export const Reminders = ({ onReminderClick }: RemindersProps) => {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <li key={index}>
          <Card
            className="hover:bg-muted/50 cursor-pointer gap-1 border py-2 shadow-none transition-colors"
            onClick={() => onReminderClick?.(index)}
          >
            <CardHeader className="px-3">
              <CardTitle className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3">
              <div className="flex items-center justify-end">
                <p className="text-muted-foreground text-sm font-medium">
                  43D 12H 34M
                </p>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};
