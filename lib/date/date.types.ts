import type { Locale } from "date-fns";

export type DateInput = Date | string | number;

export interface DateFormatOptions {
  locale?: Locale;
}
