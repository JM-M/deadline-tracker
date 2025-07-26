"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { convertTimeBetweenTimezones, getTimezoneOptions } from "@/lib/time";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const settingsFormSchema = z.object({
  reminderTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      "Please enter a valid time",
    ),
  timezone: z.string().min(1, "Timezone is required"),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  onSubmit?: (data: SettingsFormData) => void;
}

export const SettingsForm = ({ onSubmit }: SettingsFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const preferences = useSuspenseQuery(trpc.preferences.get.queryOptions());

  const updatePreferences = useMutation(
    trpc.preferences.update.mutationOptions(),
  );

  const defaultReminderTime = useMemo(
    () =>
      preferences.data
        ? convertTimeBetweenTimezones({
            timeString: preferences.data.utcReminderTime,
            fromTimezone: "UTC",
            toTimezone: preferences.data.timezone,
          })
        : "08:00:00",
    [preferences.data],
  );

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      reminderTime: defaultReminderTime,
      timezone:
        preferences.data?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const handleSubmit = (data: SettingsFormData) => {
    const { reminderTime, timezone } = data;
    const utcReminderTime = convertTimeBetweenTimezones({
      timeString: reminderTime,
      fromTimezone: timezone,
      toTimezone: "UTC",
    });
    updatePreferences.mutate(
      {
        utcReminderTime,
        timezone: data.timezone,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.preferences.get.queryOptions());
          toast.success("Preferences updated");
          onSubmit?.(data);
        },
        onError: (error) => {
          console.error(error);
          toast.error(error.message);
        },
      },
    );
  };

  const isPending = updatePreferences.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reminderTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="px-1">Reminder Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  step="1"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Combobox
                    options={getTimezoneOptions()}
                    value={field.value}
                    onChange={field.onChange}
                    searchPlaceholder="Search timezones..."
                    emptySelectContent="No timezone found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
