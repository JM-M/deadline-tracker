import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReminderGetMany } from "@/modules/reminders/types";
import { ReminderForm } from "./reminder-form";

interface ReminderSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ReminderGetMany[number];
}
export const ReminderSheet = ({
  isOpen,
  onOpenChange,
  initialData,
}: ReminderSheetProps) => {
  const isEditing = !!initialData;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-7/8"
        onOpenAutoFocus={(e) => {
          if (isEditing) e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-muted-foreground">
            {initialData ? "Edit Reminder" : "Add Reminder"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 px-4">
          <ReminderForm
            onSubmit={() => onOpenChange(false)}
            initialData={initialData}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
