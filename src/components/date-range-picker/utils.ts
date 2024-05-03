import { isAfter, isBefore } from "date-fns";

export function isDateBetween(date: Date, from: Date, to: Date) {
  return !isBefore(date, from) && !isAfter(date, to);
}
