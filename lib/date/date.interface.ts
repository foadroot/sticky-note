import type { Locale } from "date-fns";
import type { DateInput } from "./date.types";

export interface IDateAdapter {
  now(): Date;
  parse(value: DateInput): Date;
  isValid(value: DateInput): boolean;
  format(value: DateInput, format: string, locale?: Locale): string;
  addDays(value: DateInput, days: number): Date;
  subDays(value: DateInput, days: number): Date;
  addMonths(value: DateInput, months: number): Date;
  subMonths(value: DateInput, months: number): Date;
  addYears(value: DateInput, years: number): Date;
  subYears(value: DateInput, years: number): Date;
  startOfDay(value: DateInput): Date;
  endOfDay(value: DateInput): Date;
  startOfWeek(value: DateInput): Date;
  endOfWeek(value: DateInput): Date;
  startOfMonth(value: DateInput): Date;
  endOfMonth(value: DateInput): Date;
  startOfYear(value: DateInput): Date;
  endOfYear(value: DateInput): Date;
  differenceInDays(left: DateInput, right: DateInput): number;
  differenceInMonths(left: DateInput, right: DateInput): number;
  differenceInYears(left: DateInput, right: DateInput): number;
  isBefore(left: DateInput, right: DateInput): boolean;
  isAfter(left: DateInput, right: DateInput): boolean;
  isEqual(left: DateInput, right: DateInput): boolean;
  isToday(value: DateInput): boolean;
  isYesterday(value: DateInput): boolean;
  isTomorrow(value: DateInput): boolean;
  fromNow(value: DateInput): string;
  toISOString(value: DateInput): string;
}
