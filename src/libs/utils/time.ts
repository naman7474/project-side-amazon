import { format, getTime, formatDistanceToNow, subYears } from "date-fns";

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}

export const getOneMonthBeforeDate = (date: Date = new Date()) => {
  const originalDate = new Date(date);
  originalDate.setMonth(originalDate.getMonth() - 1);
  return originalDate;
};

export const getYearBackDateFromToday = (years?: number) =>
  subYears(new Date(), years || 1);

export function fTimeDifference(
  startTimeStr: string,
  endTimeStr: string
): string {
  if (!startTimeStr.trim() || !endTimeStr.trim()) {
    return "";
  }

  const [startHours, startMinutes, startSeconds] = startTimeStr
    .split(":")
    .map(Number);
  const [endHours, endMinutes, endSeconds] = endTimeStr.split(":").map(Number);

  if (
    Number.isNaN(startHours) ||
    Number.isNaN(startMinutes) ||
    Number.isNaN(startSeconds) ||
    Number.isNaN(endHours) ||
    Number.isNaN(endMinutes) ||
    Number.isNaN(endSeconds)
  ) {
    return "";
  }

  let hoursDifference = endHours - startHours;
  let minutesDifference = endMinutes - startMinutes;
  let secondsDifference = endSeconds - startSeconds;

  if (secondsDifference < 0) {
    secondsDifference += 60;
    minutesDifference -= 1;
  }
  if (minutesDifference < 0) {
    minutesDifference += 60;
    hoursDifference -= 1;
  }

  return `${hoursDifference.toString().padStart(2, "0")} hr ${minutesDifference
    .toString()
    .padStart(2, "0")} min`;
}

export function fTime(timeStr: string): string {
  if (!timeStr.trim()) {
    return "";
  }
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return "";
  }

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

export function fAddTime(baseTime: string, timeToAdd: string): string {
  const baseTimeRegex = /^(\d{1,3}):([0-5][0-9])$/;
  if (!baseTime.match(baseTimeRegex)) {
    throw new Error('Invalid base time format. Use "HH:MM" format.');
  }

  const timeToAddRegex = /^(\d+) hr (\d+) min$/;
  const timeToAddMatch = timeToAdd.match(timeToAddRegex);
  if (!timeToAddMatch) {
    throw new Error('Invalid time to add format. Use "HH hr MM min" format.');
  }

  const [baseHours, baseMinutes] = baseTime.split(":").map(Number);
  const addHours = parseInt(timeToAddMatch[1], 10); // Extract hours from timeToAdd
  const addMinutes = parseInt(timeToAddMatch[2], 10); // Extract minutes from timeToAdd

  const totalMinutes =
    baseHours * 60 + baseMinutes + addHours * 60 + addMinutes;

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  const formattedHours = String(newHours).padStart(
    newHours < 10 ? 2 : String(newHours).length,
    "0"
  ); // Allow up to 3 digits for hours
  const formattedMinutes = String(newMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
