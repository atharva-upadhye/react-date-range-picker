import {
  addDays,
  addMonths,
  addQuarters,
  addYears,
  differenceInCalendarWeeks,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  formatDate,
  getQuarter,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";
import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type ThHTMLAttributes,
  useCallback,
  useMemo,
} from "react";
import { type RangeType, type DateRange } from "./types";
import { cn } from "@/lib/utils";

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
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
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
  function isDateBetween(date: Date, from: Date, to: Date) {
    return !isBefore(date, from) && !isAfter(date, to);
  }
  const getClassNames = useCallback(
    (cellDate: Date) => {
      const base = cn(
        "flex h-12 w-12 cursor-pointer items-center justify-center",
        props.rangeType === "years" ? "w-20" : "",
      );
      const cornerDateBase = cn(
        "before:absolute before:h-12 before:w-12 before:rounded-full before:bg-gray-500",
        props.rangeType === "years" ? "before:w-20" : "",
      );

      let toReturn = "";
      const cornerDate = {
        left: cn("rounded-l-full", cornerDateBase),
        right: cn("rounded-r-full", cornerDateBase),
      };
      const styleRangeEnd = cn("rounded-r-full", cornerDateBase);
      const isPartOfSelectedRange = isDateBetween(
        cellDate,
        props.range.from,
        props.range.to,
      );
      if (isEqual(props.range.from, cellDate)) {
        toReturn = cn(
          base,
          isPartOfSelectedRange ? "bg-gray-400" : "",
          cornerDate.left,
        );
      } else if (
        isEqual(
          props.rangeType === "months"
            ? endOfMonth(props.range.to)
            : endOfDay(props.range.to),
          props.rangeType === "months"
            ? endOfMonth(cellDate)
            : endOfDay(cellDate),
        )
      ) {
        toReturn = cn(
          "flex h-12 w-12 cursor-pointer items-center justify-center",
          isPartOfSelectedRange ? "bg-gray-400" : "",
          styleRangeEnd,
        );
      } else {
        toReturn = cn(base, isPartOfSelectedRange ? "bg-gray-400" : "");
      }
      if (props.hoverRange) {
        if (
          props.hoverDate &&
          isDateBetween(cellDate, props.range.from, props.hoverDate)
        ) {
          toReturn = cn(base, "bg-gray-400");
        }
        if (
          isDateBetween(cellDate, props.hoverRange.from, props.hoverRange.to)
        ) {
          toReturn = cn(base, "bg-gray-300");
          if (isEqual(cellDate, props.hoverRange.from)) {
            toReturn = cn(base, cornerDate.left);
          } else if (
            isEqual(
              props.rangeType === "months"
                ? endOfMonth(cellDate)
                : endOfDay(cellDate),
              props.rangeType === "months"
                ? endOfMonth(props.hoverRange.to)
                : endOfDay(props.hoverRange.to),
            )
          ) {
            toReturn = cn(
              "flex h-12 w-12 cursor-pointer items-center justify-center",
              styleRangeEnd,
            );
          }
        }
      }

      return toReturn;
    },
    [
      props.hoverDate,
      props.hoverRange,
      props.range.from,
      props.range.to,
      props.rangeType,
    ],
  );
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
                {calWeek.map((cellDate) => {
                  const isOutsideCalendarDates =
                    props.rangeType === "years"
                      ? false
                      : !isDateBetween(
                          cellDate,
                          props.rangeType === "months"
                            ? startOfYear(props.viewDate)
                            : props.rangeType === "quarters"
                              ? startOfYear(props.viewDate)
                              : startOfMonth(props.viewDate),
                          props.rangeType === "months"
                            ? endOfYear(props.viewDate)
                            : props.rangeType === "quarters"
                              ? endOfYear(props.viewDate)
                              : endOfMonth(props.viewDate),
                        );
                  return (
                    <td key={cellDate.valueOf()} className="relative p-0">
                      <div
                        onMouseEnter={() => {
                          props.setHoverDate(cellDate);
                        }}
                        onMouseLeave={() => {
                          props.setHoverDate(null);
                        }}
                        className={cn(
                          getClassNames(cellDate),
                          isOutsideCalendarDates ? "opacity-20" : "",
                        )}
                        onClick={() => {
                          if (props.rangeType === "months") {
                            if (
                              isEqual(
                                endOfMonth(props.range.from),
                                props.range.to,
                              )
                            )
                              props.setRange((prev) => ({
                                ...prev,
                                to: endOfMonth(cellDate),
                              }));
                            else
                              props.setRange({
                                from: cellDate,
                                to: endOfMonth(cellDate),
                              });
                          } else if (props.rangeType === "weeks") {
                            if (
                              isEqual(
                                endOfWeek(props.range.from),
                                props.range.to,
                              )
                            )
                              props.setRange((prev) => ({
                                ...prev,
                                to: endOfWeek(cellDate),
                              }));
                            else
                              props.setRange({
                                from: startOfWeek(cellDate),
                                to: endOfWeek(cellDate),
                              });
                          } else if (props.rangeType === "quarters") {
                            if (
                              isEqual(
                                endOfQuarter(props.range.from),
                                props.range.to,
                              )
                            )
                              props.setRange((prev) => ({
                                ...prev,
                                to: endOfQuarter(cellDate),
                              }));
                            else
                              props.setRange({
                                from: startOfQuarter(cellDate),
                                to: endOfQuarter(cellDate),
                              });
                          } else if (props.rangeType === "years") {
                            if (
                              isEqual(
                                endOfYear(props.range.from),
                                props.range.to,
                              )
                            )
                              props.setRange((prev) => ({
                                ...prev,
                                to: endOfYear(cellDate),
                              }));
                            else
                              props.setRange({
                                from: startOfYear(cellDate),
                                to: endOfYear(cellDate),
                              });
                          } else {
                            if (
                              isEqual(
                                endOfDay(props.range.from),
                                props.range.to,
                              )
                            )
                              props.setRange((prev) => ({
                                ...prev,
                                to: endOfDay(cellDate),
                              }));
                            else
                              props.setRange({
                                from: startOfDay(cellDate),
                                to: endOfDay(cellDate),
                              });
                          }
                        }}
                      >
                        <div className="z-[1]">
                          {props.rangeType === "months"
                            ? formatDate(cellDate, "MMM")
                            : props.rangeType === "quarters"
                              ? `Q${getQuarter(cellDate)}`
                              : props.rangeType === "years"
                                ? formatDate(cellDate, "yyyy")
                                : cellDate.getDate()}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { Calendar };
