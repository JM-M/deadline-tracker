import { SEND_REMINDER } from "@/constants/inngest";
import { db } from "@/db";
import { preferences, reminder, user } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { NotificationEmail } from "@/modules/reminders/emails/notification";
import { eq, sql } from "drizzle-orm";
import { inngest } from "./client";

export const sendRemindersCron = inngest.createFunction(
  { id: "send-reminder-cron" },
  { cron: "0 * * * *" },
  async ({ event, step }) => {
    // Get the current UTC hour from the event timestamp
    const currentHour = new Date(event.ts || Date.now()).getUTCHours();

    // Get all users who have reminders that are due in this hour
    const users = await db
      .select({
        userId: user.id,
        email: user.email,
        name: user.name,
      })
      .from(preferences)
      .innerJoin(user, eq(preferences.userId, user.id))
      .where(
        sql`EXTRACT(HOUR FROM ${preferences.utcReminderTime}) = ${currentHour}`,
      );

    // Map over users to create a new event for each user
    const events = users.map((user) => ({
      name: SEND_REMINDER,
      data: user,
    }));

    if (events.length > 0) {
      // Send all events at once
      await step.sendEvent(SEND_REMINDER, events);
    }
  },
);

export const sendReminder = inngest.createFunction(
  { id: "send-reminder" },
  { event: SEND_REMINDER },
  async ({ event }) => {
    // 3️⃣ We can now grab the email and user id from the event payload
    const { email, name, userId } = event.data;

    const reminders = await db
      .select()
      .from(reminder)
      .where(eq(reminder.userId, userId));

    // const activeReminders = reminders.filter((reminder) => {
    //   if (reminder.deadline) {
    //     return isBefore(new Date(), reminder.deadline);
    //   }
    //   return true;
    // });

    if (reminders.length > 0) {
      // Construct email content
      const content = <NotificationEmail name={name} reminders={reminders} />;

      console.log("Sending email to", email);
      // Send email
      await sendEmail({
        recipients: email,
        subject: "Reminder",
        content,
      });
    }
  },
);
