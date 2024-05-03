import { type rangeTypes } from "./constants";

export type DateRange = {
  from: Date;
  to: Date;
};
export type RangeType = (typeof rangeTypes)[number];
