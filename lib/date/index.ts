import { DateService } from "./date.service";
import type { DateInput } from "./date.types";

export const date = DateService.getInstance();

const SHORT_PARTS = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

export function shortDate(iso: string): string {
  const parts = SHORT_PARTS.formatToParts(new Date(`${iso}T00:00:00Z`));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("day")} ${value("month")}, ${value("year")}`;
}

const LONG_PARTS = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function longDate(iso: string): string {
  return LONG_PARTS.format(new Date(`${iso}T00:00:00Z`));
}

export function shortTimestamp(value: DateInput): string {
  if (typeof value === "string" && !value.includes("T"))
    return shortDate(value);

  const parts = SHORT_PARTS.formatToParts(date.parse(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  return `${part("day")} ${part("month")}, ${part("year")}`;
}

const DAY_MONTH_FULL_YEAR_PARTS = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function dayMonthYear(value: DateInput): string {
  const parsed =
    typeof value === "string" && !value.includes("T")
      ? new Date(`${value}T00:00:00Z`)
      : date.parse(value);

  const parts = DAY_MONTH_FULL_YEAR_PARTS.formatToParts(parsed);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";

  return `${part("day")} ${part("month")} ${part("year")}`;
}

const TIME_PARTS = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export function timeOfDay(value: DateInput): string {
  return TIME_PARTS.format(date.parse(value));
}

export function isoDay(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}
