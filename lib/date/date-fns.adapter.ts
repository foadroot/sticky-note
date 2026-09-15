import {
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  isValid,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  isAfter,
  isEqual,
  isToday,
  isYesterday,
  isTomorrow,
  formatDistanceToNow,
} from "date-fns";

import type { Locale } from "date-fns";
import type { DateInput } from "./date.types";
import type { IDateAdapter } from "./date.interface";

export class DateFnsAdapter implements IDateAdapter {
  now() {
    return new Date();
  }

  parse(value: DateInput): Date {
    if (value instanceof Date) return value;
    if (typeof value === "string") return parseISO(value);
    return new Date(value);
  }

  isValid(value: DateInput) {
    return isValid(this.parse(value));
  }

  format(value: DateInput, pattern: string, locale?: Locale) {
    return format(this.parse(value), pattern, { locale });
  }

  addDays(value: DateInput, days: number) {
    return addDays(this.parse(value), days);
  }

  subDays(value: DateInput, days: number) {
    return subDays(this.parse(value), days);
  }

  addMonths(value: DateInput, months: number) {
    return addMonths(this.parse(value), months);
  }

  subMonths(value: DateInput, months: number) {
    return subMonths(this.parse(value), months);
  }

  addYears(value: DateInput, years: number) {
    return addYears(this.parse(value), years);
  }

  subYears(value: DateInput, years: number) {
    return subYears(this.parse(value), years);
  }

  startOfDay(value: DateInput) {
    return startOfDay(this.parse(value));
  }

  endOfDay(value: DateInput) {
    return endOfDay(this.parse(value));
  }

  startOfWeek(value: DateInput) {
    return startOfWeek(this.parse(value));
  }

  endOfWeek(value: DateInput) {
    return endOfWeek(this.parse(value));
  }

  startOfMonth(value: DateInput) {
    return startOfMonth(this.parse(value));
  }

  endOfMonth(value: DateInput) {
    return endOfMonth(this.parse(value));
  }

  startOfYear(value: DateInput) {
    return startOfYear(this.parse(value));
  }

  endOfYear(value: DateInput) {
    return endOfYear(this.parse(value));
  }

  differenceInDays(left: DateInput, right: DateInput) {
    return differenceInDays(this.parse(left), this.parse(right));
  }

  differenceInMonths(left: DateInput, right: DateInput) {
    return differenceInMonths(this.parse(left), this.parse(right));
  }

  differenceInYears(left: DateInput, right: DateInput) {
    return differenceInYears(this.parse(left), this.parse(right));
  }

  isBefore(left: DateInput, right: DateInput) {
    return isBefore(this.parse(left), this.parse(right));
  }

  isAfter(left: DateInput, right: DateInput) {
    return isAfter(this.parse(left), this.parse(right));
  }

  isEqual(left: DateInput, right: DateInput) {
    return isEqual(this.parse(left), this.parse(right));
  }

  isToday(value: DateInput) {
    return isToday(this.parse(value));
  }

  isYesterday(value: DateInput) {
    return isYesterday(this.parse(value));
  }

  isTomorrow(value: DateInput) {
    return isTomorrow(this.parse(value));
  }

  fromNow(value: DateInput) {
    return formatDistanceToNow(this.parse(value), { addSuffix: true });
  }

  toISOString(value: DateInput) {
    return this.parse(value).toISOString();
  }
}
