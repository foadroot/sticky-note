import { DateFnsAdapter } from "./date-fns.adapter";
import type { IDateAdapter } from "./date.interface";

export class DateService {
  private static instance: IDateAdapter;

  static getInstance(): IDateAdapter {
    if (!this.instance) {
      this.instance = new DateFnsAdapter();
    }

    return this.instance;
  }
}
