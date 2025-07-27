import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

// Generate timezone options from IANA timezone database
export const getTimezoneOptions = () => {
  try {
    // Use Intl.supportedValuesOf to get all supported timezones
    const timezoneNames = Intl.supportedValuesOf("timeZone");

    return timezoneNames
      .map((timezone) => {
        // Create a more user-friendly label
        const date = new Date();
        const formatter = new Intl.DateTimeFormat("en", {
          timeZone: timezone,
          timeZoneName: "shortGeneric",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const parts = formatter.formatToParts(date);
        const timeZoneName =
          parts.find((part) => part.type === "timeZoneName")?.value || timezone;

        return {
          value: timezone,
          label: `${timezone} (${timeZoneName})`,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch (error) {
    // Fallback to a curated list if Intl.supportedValuesOf is not supported
    // TODO: Add more timezones and make it match the format of the above
    return [
      { value: "UTC", label: "UTC" },
      { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/Anchorage", label: "Alaska Time (AKT)" },
      { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
      { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
      { value: "Europe/Paris", label: "Central European Time (CET)" },
      { value: "Europe/Berlin", label: "Central European Time (CET)" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
      { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
      { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
      { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
      { value: "Pacific/Auckland", label: "New Zealand Standard Time (NZST)" },
    ];
  }
};

// For backward compatibility, export the old timezones array
export const timezones = getTimezoneOptions();

export type TimezoneOption = (typeof timezones)[number];

export function convertTimeBetweenTimezones({
  timeString,
  fromTimezone,
  toTimezone,
}: {
  timeString: string;
  fromTimezone: string;
  toTimezone: string;
}): string {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create a date object for today
  const today = new Date();

  // Create a date representing the time in the source timezone
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hours,
    minutes,
    seconds,
  );

  const sourceDate = fromZonedTime(date, fromTimezone);
  const targetDate = toZonedTime(sourceDate, toTimezone);

  // Format as HH:mm:ss
  return format(targetDate, "HH:mm:ss");
}

export function getReminderTime({
  utcReminderTime,
  timezone,
}: {
  utcReminderTime: string;
  timezone: string;
}): Date | null {
  try {
    const convertedReminderTime = convertTimeBetweenTimezones({
      timeString: utcReminderTime,
      fromTimezone: "UTC",
      toTimezone: timezone,
    });

    const hours = Number(convertedReminderTime.split(":")[0]);
    if (!isNaN(hours) && hours >= 0 && hours <= 23) {
      // TODO: Handle minutes
      return new Date(new Date().setHours(hours, 0, 0, 0));
    }
  } catch (error) {
    console.error("Error converting reminder time:", error);
  }

  return null;
}
