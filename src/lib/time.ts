import { format } from "date-fns";

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

  // Create a date object for today with the source timezone's specified time
  const today = new Date();

  // Create a date in the source timezone
  const sourceDate = new Date();
  sourceDate.setFullYear(today.getFullYear());
  sourceDate.setMonth(today.getMonth());
  sourceDate.setDate(today.getDate());
  sourceDate.setHours(hours);
  sourceDate.setMinutes(minutes);
  sourceDate.setSeconds(seconds);

  // Format the date in the source timezone to get the ISO string
  const sourceFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: fromTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const sourceFormatted = sourceFormatter.format(sourceDate);
  const sourceDateISO = new Date(sourceFormatted + "Z");

  // Convert to the target timezone
  const targetFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: toTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const targetFormatted = targetFormatter.format(sourceDateISO);
  const targetDate = new Date(targetFormatted);

  // Format as HH:mm:ss
  return format(targetDate, "HH:mm:ss");
}
