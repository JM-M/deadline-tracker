import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";
import { format, formatDistanceToNow } from "date-fns";
import { Reminder } from "../types";

interface NotificationEmailProps {
  name: string;
  reminders: Reminder[];
  dashboardUrl?: string;
}

export const NotificationEmail = ({
  name,
  reminders,
  dashboardUrl = "https://your-app.com/dashboard",
}: NotificationEmailProps) => {
  const urgentReminders = reminders.filter(
    (reminder) =>
      reminder.deadline &&
      new Date(reminder.deadline) <= new Date(Date.now() + 24 * 60 * 60 * 1000), // Due within 24 hours
  );

  const upcomingReminders = reminders.filter(
    (reminder) =>
      reminder.deadline &&
      new Date(reminder.deadline) > new Date(Date.now() + 24 * 60 * 60 * 1000), // Due after 24 hours
  );

  const overdueReminders = reminders.filter(
    (reminder) => reminder.deadline && new Date(reminder.deadline) < new Date(),
  );

  return (
    <Html lang="en">
      <Head>
        <title>Your Reminders - Deadline Tracker</title>
      </Head>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f6f9fc",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px 20px",
          }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Heading
              as="h1"
              style={{
                color: "#1f2937",
                fontSize: "28px",
                fontWeight: "bold",
                margin: "0 0 10px 0",
              }}
            >
              ⏰ Deadline Tracker
            </Heading>
            <Text
              style={{
                color: "#6b7280",
                fontSize: "16px",
                margin: 0,
              }}
            >
              Hello, {name}! Here are your reminders and deadlines.
            </Text>
          </Section>

          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              margin: "30px 0",
            }}
          />

          {/* Overdue Reminders */}
          {overdueReminders.length > 0 && (
            <Section style={{ marginBottom: "30px" }}>
              <Heading
                as="h2"
                style={{
                  color: "#dc2626",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                }}
              >
                🚨 Overdue ({overdueReminders.length})
              </Heading>
              {overdueReminders.map((reminder) => (
                <Section
                  key={reminder.id}
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <Text
                    style={{
                      color: "#dc2626",
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 5px 0",
                    }}
                  >
                    {reminder.title}
                  </Text>
                  {reminder.description && (
                    <Text
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {reminder.description}
                    </Text>
                  )}
                  <Text
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    ⏰ Overdue by{" "}
                    {formatDistanceToNow(new Date(reminder.deadline!), {
                      addSuffix: true,
                    })}
                  </Text>
                </Section>
              ))}
            </Section>
          )}

          {/* Urgent Reminders */}
          {urgentReminders.length > 0 && (
            <Section style={{ marginBottom: "30px" }}>
              <Heading
                as="h2"
                style={{
                  color: "#ea580c",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                }}
              >
                ⚡ Urgent - Due Soon ({urgentReminders.length})
              </Heading>
              {urgentReminders.map((reminder) => (
                <Section
                  key={reminder.id}
                  style={{
                    backgroundColor: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <Text
                    style={{
                      color: "#ea580c",
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 5px 0",
                    }}
                  >
                    {reminder.title}
                  </Text>
                  {reminder.description && (
                    <Text
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {reminder.description}
                    </Text>
                  )}
                  <Text
                    style={{
                      color: "#ea580c",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    ⏰ Due {format(new Date(reminder.deadline!), "PPP")} (
                    {formatDistanceToNow(new Date(reminder.deadline!), {
                      addSuffix: true,
                    })}
                    )
                  </Text>
                </Section>
              ))}
            </Section>
          )}

          {/* Upcoming Reminders */}
          {upcomingReminders.length > 0 && (
            <Section style={{ marginBottom: "30px" }}>
              <Heading
                as="h2"
                style={{
                  color: "#059669",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                }}
              >
                📅 Upcoming ({upcomingReminders.length})
              </Heading>
              {upcomingReminders.map((reminder) => (
                <Section
                  key={reminder.id}
                  style={{
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    padding: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <Text
                    style={{
                      color: "#059669",
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 5px 0",
                    }}
                  >
                    {reminder.title}
                  </Text>
                  {reminder.description && (
                    <Text
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        margin: "0 0 8px 0",
                      }}
                    >
                      {reminder.description}
                    </Text>
                  )}
                  <Text
                    style={{
                      color: "#059669",
                      fontSize: "12px",
                      margin: 0,
                    }}
                  >
                    ⏰ Due {format(new Date(reminder.deadline!), "PPP")} (
                    {formatDistanceToNow(new Date(reminder.deadline!), {
                      addSuffix: true,
                    })}
                    )
                  </Text>
                </Section>
              ))}
            </Section>
          )}

          {/* Reminders without deadlines */}
          {reminders.filter((r) => !r.deadline).length > 0 && (
            <Section style={{ marginBottom: "30px" }}>
              <Heading
                as="h2"
                style={{
                  color: "#6b7280",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                }}
              >
                📝 No Deadline Set (
                {reminders.filter((r) => !r.deadline).length})
              </Heading>
              {reminders
                .filter((r) => !r.deadline)
                .map((reminder) => (
                  <Section
                    key={reminder.id}
                    style={{
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <Text
                      style={{
                        color: "#374151",
                        fontSize: "16px",
                        fontWeight: "bold",
                        margin: "0 0 5px 0",
                      }}
                    >
                      {reminder.title}
                    </Text>
                    {reminder.description && (
                      <Text
                        style={{
                          color: "#6b7280",
                          fontSize: "14px",
                          margin: 0,
                        }}
                      >
                        {reminder.description}
                      </Text>
                    )}
                  </Section>
                ))}
            </Section>
          )}

          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              margin: "30px 0",
            }}
          />

          {/* Summary */}
          <Section
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <Text
              style={{
                color: "#374151",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "0 0 10px 0",
              }}
            >
              📊 Summary
            </Text>
            <Text
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: "0 0 5px 0",
              }}
            >
              • Total reminders: {reminders.length}
            </Text>
            {overdueReminders.length > 0 && (
              <Text
                style={{
                  color: "#dc2626",
                  fontSize: "14px",
                  margin: "0 0 5px 0",
                }}
              >
                • Overdue: {overdueReminders.length}
              </Text>
            )}
            {urgentReminders.length > 0 && (
              <Text
                style={{
                  color: "#ea580c",
                  fontSize: "14px",
                  margin: "0 0 5px 0",
                }}
              >
                • Due soon: {urgentReminders.length}
              </Text>
            )}
            {upcomingReminders.length > 0 && (
              <Text
                style={{
                  color: "#059669",
                  fontSize: "14px",
                  margin: "0 0 5px 0",
                }}
              >
                • Upcoming: {upcomingReminders.length}
              </Text>
            )}
          </Section>

          {/* Call to Action */}
          <Section style={{ textAlign: "center" }}>
            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "bold",
                display: "inline-block",
              }}
            >
              View All Reminders
            </Button>
          </Section>

          {/* Footer */}
          <Section
            style={{
              textAlign: "center",
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "0 0 5px 0",
              }}
            >
              This email was sent from your Deadline Tracker account.
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: 0,
              }}
            >
              You can manage your email preferences in your account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
