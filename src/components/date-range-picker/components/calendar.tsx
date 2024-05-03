import {
  addDays,
  addMonths,
  addQuarters,
  addYears,
  differenceInCalendarWeeks,
  endOfMonth,
  formatDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, {
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type ThHTMLAttributes,
} from "react";
import { weekDays } from "../constants";
import { type DateRange, type RangeType } from "../types";
import { CalendarDateTableCell } from "./calendar-date-table-cell";

type CalendarProps = {
  viewDate: Date;
  weekDayProps?: ThHTMLAttributes<HTMLTableCellElement>;
  rangeType: RangeType;
  range: DateRange;
  setRange: Dispatch<SetStateAction<DateRange>>;
  hoverDate: Date | null;
  setHoverDate: Dispatch<SetStateAction<Date | null>>;
  titleLeft?: ReactNode;
  titleRight?: ReactNode;
  hoverRange: DateRange | null;
  options?: {
    showOutOfCalendarDates?: boolean;
  };
  isSelectingEnd: boolean;
  setIsSelectingEnd: Dispatch<SetStateAction<boolean>>;
  getDateRange: (date: Date) => DateRange;
};
function Calendar(props: CalendarProps) {
  const firstCell =
    props.rangeType === "months"
      ? startOfYear(props.viewDate)
      : props.rangeType === "quarters"
        ? startOfYear(props.viewDate)
        : startOfWeek(startOfMonth(props.viewDate));
  const monthsPerRow = 3;
  const rowsCount = useMemo(() => {
    if (props.rangeType === "months") return 12 / monthsPerRow - 1;
    else if (props.rangeType === "quarters") return 1;
    else if (props.rangeType === "years") return 4;
    return (
      differenceInCalendarWeeks(
        endOfMonth(props.viewDate),
        startOfMonth(props.viewDate),
      ) + 1
    );
  }, [props.rangeType, props.viewDate]);
  const cells = Array.from(Array(rowsCount).keys()).map((rowIndex) => {
    if (props.rangeType === "months") {
      return Array.from(Array(12 / monthsPerRow).keys()).map((v) => {
        return addMonths(firstCell, rowIndex * (12 / monthsPerRow) + v);
      });
    } else if (props.rangeType === "quarters") {
      return Array.from(Array(4).keys()).map((v) => {
        return addQuarters(firstCell, rowIndex + v);
      });
    } else if (props.rangeType === "years") {
      return Array.from(Array(3).keys()).map((v) => {
        return addYears(firstCell, rowIndex * 3 + v);
      });
    }
    return Array.from(Array(7).keys()).map((v) => {
      return addDays(firstCell, rowIndex * 7 + v);
    });
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div>{props.titleLeft}</div>
        {formatDate(
          props.viewDate,
          props.rangeType === "months"
            ? "yyyy"
            : props.rangeType === "quarters"
              ? "yyyy"
              : props.rangeType === "years"
                ? "yyyy"
                : "MMMM yyyy",
        )}
        {props.rangeType === "years"
          ? ` - ${formatDate(addYears(props.viewDate, 12 - 1), "yyyy")}`
          : ""}
        <div>{props.titleRight}</div>
      </div>
      <table>
        {props.rangeType === "weeks" || props.rangeType === "custom" ? (
          <thead>
            <tr>
              {weekDays.map((weekDay) => (
                <th key={weekDay} className="h-12 w-12" {...props.weekDayProps}>
                  {weekDay}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {cells.map((calWeek, i) => {
            return (
              <tr key={i}>
                {calWeek.map((cellDate) => (
                  <CalendarDateTableCell
                    key={cellDate.valueOf()}
                    rangeType={props.rangeType}
                    cellDate={cellDate}
                    viewDate={props.viewDate}
                    range={props.range}
                    setRange={props.setRange}
                    hoverDate={props.hoverDate}
                    setHoverDate={props.setHoverDate}
                    hoverRange={props.hoverRange}
                    isSelectingEnd={props.isSelectingEnd}
                    setIsSelectingEnd={props.setIsSelectingEnd}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export { Calendar };
