"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { ReminderGetMany } from "@/modules/reminders/types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Calendar } from "../../../../components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Textarea } from "../../../../components/ui/textarea";
import { DeleteReminderDialog } from "./delete-reminder-dialog";

const reminderFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  deadline: z.date().optional(),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

interface ReminderFormProps {
  onSubmit: () => void;
  initialData?: ReminderGetMany[number];
}

export const ReminderForm = ({ onSubmit, initialData }: ReminderFormProps) => {
  const isEditing = !!initialData;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      deadline: initialData?.deadline
        ? new Date(initialData.deadline)
        : undefined,
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const create = useMutation(trpc.reminders.create.mutationOptions());
  const update = useMutation(trpc.reminders.update.mutationOptions());
  const deleteReminder = useMutation(trpc.reminders.delete.mutationOptions());

  const deleteHandler = () => {
    if (!initialData?.id) return;

    deleteReminder.mutate(
      { id: initialData.id },
      {
        onSuccess: () => {
          toast.success("Reminder deleted successfully");
          queryClient.invalidateQueries({
            queryKey: trpc.reminders.getMany.queryKey(),
          });
          onSubmit();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const submitHandler = (data: ReminderFormValues) => {
    const deadline = data.deadline?.toISOString();

    if (isEditing) {
      update.mutate(
        {
          ...data,
          id: initialData?.id,
          deadline,
        },
        {
          onSuccess: () => {
            toast.success("Reminder updated successfully");
            queryClient.invalidateQueries({
              queryKey: trpc.reminders.getMany.queryKey(),
            });
            onSubmit();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } else {
      create.mutate(
        { ...data, deadline },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Reminder created successfully");
            queryClient.invalidateQueries({
              queryKey: trpc.reminders.getMany.queryKey(),
            });
            onSubmit();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    }
  };

  const isPending = isEditing ? update.isPending : create.isPending;

  return (
    <>
      <DeleteReminderDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
          // setDisableSheetInteractOutside(isOpen);
          setIsDeleteDialogOpen(isOpen);
        }}
        onConfirmDelete={deleteHandler}
        isPending={deleteReminder.isPending}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="flex h-full flex-col gap-4 pb-10"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gap-1">
                  Title<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter reminder title"
                    className="text-lg font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter reminder description"
                    className="text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Deadline
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  We will stop sending reminders after this date.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mx-0 mt-auto flex w-full"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isEditing ? "Update" : "Create"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteReminder.isPending}
            >
              {deleteReminder.isPending ? <Spinner /> : <Trash2Icon />}
              Delete
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};
