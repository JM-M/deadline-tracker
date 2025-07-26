import { SEND_REMINDER } from "@/constants/inngest";
import { db } from "@/db";
import { preferences, user } from "@/db/schema";
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

    // Send all events at once
    await step.sendEvent(SEND_REMINDER, events);
  },
);

export const sendReminder = inngest.createFunction(
  { id: "send-reminder" },
  { event: SEND_REMINDER },
  async ({ event }) => {
    // 3️⃣ We can now grab the email and user id from the event payload
    const { email, name } = event.data;

    // Construct email content
    const content = <NotificationEmail name={name} />;

    // Send email
    await sendEmail({
      recipients: email,
      subject: "Reminder",
      content,
    });
  },
);
