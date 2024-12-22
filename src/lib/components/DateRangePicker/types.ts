import { type rangeTypes } from "./constants";

export interface DateRange {
  from: Date;
  to: Date;
}
export type RangeType = (typeof rangeTypes)[number];
