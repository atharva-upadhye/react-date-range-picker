import { cn } from "@/lib/utils";
import {
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
  useCallback,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { type DateRange, type RangeType } from "../types";
import { isDateBetween } from "../utils";

export function CalendarDateTableCell(props: {
  cellDate: Date;
  viewDate: Date;
  rangeType: RangeType;
  range: DateRange;
  setRange: Dispatch<SetStateAction<DateRange>>;
  hoverDate: Date | null;
  setHoverDate: Dispatch<SetStateAction<Date | null>>;
  titleLeft?: ReactNode;
  hoverRange: DateRange | null;
  isSelectingEnd: boolean;
  setIsSelectingEnd: Dispatch<SetStateAction<boolean>>;
}) {
  const isOutsideCalendarDates = useMemo(() => {
    return props.rangeType === "years"
      ? false
      : !isDateBetween(
          props.cellDate,
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
  }, [props.cellDate, props.rangeType, props.viewDate]);
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

      // let toReturn = "";
      // const cornerDate = {
      //   left: cn("rounded-l-full", cornerDateBase),
      //   right: cn("rounded-r-full", cornerDateBase),
      // };
      // const styleRangeEnd = cn("rounded-r-full", cornerDateBase);
      // const isPartOfSelectedRange = isDateBetween(
      //   cellDate,
      //   props.range.from,
      //   props.range.to,
      // );
      // if (isEqual(props.range.from, cellDate)) {
      //   toReturn = cn(
      //     base,
      //     isPartOfSelectedRange ? "bg-gray-400" : "",
      //     cornerDate.left,
      //   );
      // } else if (
      //   isEqual(
      //     props.rangeType === "months"
      //       ? endOfMonth(props.range.to)
      //       : endOfDay(props.range.to),
      //     props.rangeType === "months"
      //       ? endOfMonth(cellDate)
      //       : endOfDay(cellDate),
      //   )
      // ) {
      //   toReturn = cn(
      //     "flex h-12 w-12 cursor-pointer items-center justify-center",
      //     isPartOfSelectedRange ? "bg-gray-400" : "",
      //     styleRangeEnd,
      //   );
      // } else {
      //   toReturn = cn(base, isPartOfSelectedRange ? "bg-gray-400" : "");
      // }
      // if (props.hoverRange) {
      //   if (
      //     props.hoverDate &&
      //     isDateBetween(cellDate, props.range.from, props.hoverDate)
      //   ) {
      //     toReturn = cn(base, "bg-gray-400");
      //   }
      //   if (
      //     isDateBetween(cellDate, props.hoverRange.from, props.hoverRange.to)
      //   ) {
      //     toReturn = cn(base, "bg-gray-300");
      //     if (isEqual(cellDate, props.hoverRange.from)) {
      //       toReturn = cn(base, cornerDate.left);
      //     } else if (
      //       isEqual(
      //         props.rangeType === "months"
      //           ? endOfMonth(cellDate)
      //           : endOfDay(cellDate),
      //         props.rangeType === "months"
      //           ? endOfMonth(props.hoverRange.to)
      //           : endOfDay(props.hoverRange.to),
      //       )
      //     ) {
      //       toReturn = cn(
      //         "flex h-12 w-12 cursor-pointer items-center justify-center",
      //         styleRangeEnd,
      //       );
      //     }
      //   }
      // }
      const isPartOfSelected = isDateBetween(
        cellDate,
        props.range.from,
        props.range.to,
      );
      const isHovered =
        props.hoverRange &&
        isDateBetween(cellDate, props.hoverRange.from, props.hoverRange.to);
      const isPartOfBingSelected =
        props.hoverRange &&
        ((isBefore(cellDate, props.range.from) &&
          isDateBetween(cellDate, props.range.from, props.hoverRange.from)) ||
          (isAfter(cellDate, props.range.to) &&
            isDateBetween(cellDate, props.range.to, props.hoverRange.to)));
      return cn(
        base,
        isOutsideCalendarDates ? "opacity-20" : "",
        isHovered ? "bg-gray-200" : "",
        isPartOfSelected ? "bg-gray-300" : "",
      );
    },
    [
      isOutsideCalendarDates,
      props.hoverRange,
      props.range.from,
      props.range.to,
      props.rangeType,
    ],
  );
  const handleClick = () => {
    if (props.rangeType === "months") {
      props.setRange((prev) => {
        if (
          (props.isSelectingEnd &&
            isAfter(startOfMonth(props.cellDate), prev.from)) ||
          isBefore(endOfMonth(props.cellDate), prev.to)
        ) {
          props.setIsSelectingEnd(false);
          return {
            from: startOfMonth(props.cellDate),
            to: endOfMonth(props.cellDate),
          };
        } else {
          props.setIsSelectingEnd(true);
          if (props.isSelectingEnd) {
            return {
              from: startOfMonth(props.cellDate),
              to: prev.to,
            };
          } else {
            return {
              from: prev.from,
              to: endOfMonth(props.cellDate),
            };
          }
        }
      });
    } else if (props.rangeType === "weeks") {
      props.setRange((prev) => {
        if (
          (props.isSelectingEnd &&
            isAfter(startOfWeek(props.cellDate), prev.from)) ||
          isBefore(endOfWeek(props.cellDate), prev.to)
        ) {
          props.setIsSelectingEnd(false);
          return {
            from: startOfWeek(props.cellDate),
            to: endOfWeek(props.cellDate),
          };
        } else {
          props.setIsSelectingEnd(true);
          if (props.isSelectingEnd) {
            return {
              from: startOfWeek(props.cellDate),
              to: prev.to,
            };
          } else {
            return {
              from: prev.from,
              to: endOfWeek(props.cellDate),
            };
          }
        }
      });
    } else if (props.rangeType === "quarters") {
      props.setRange((prev) => {
        if (
          (props.isSelectingEnd &&
            isAfter(startOfQuarter(props.cellDate), prev.from)) ||
          isBefore(endOfQuarter(props.cellDate), prev.to)
        ) {
          props.setIsSelectingEnd(false);
          return {
            from: startOfQuarter(props.cellDate),
            to: endOfQuarter(props.cellDate),
          };
        } else {
          props.setIsSelectingEnd(true);
          if (props.isSelectingEnd) {
            return {
              from: startOfQuarter(props.cellDate),
              to: prev.to,
            };
          } else {
            return {
              from: prev.from,
              to: endOfQuarter(props.cellDate),
            };
          }
        }
      });
    } else if (props.rangeType === "years") {
      props.setRange((prev) => {
        if (
          (props.isSelectingEnd &&
            isAfter(startOfYear(props.cellDate), prev.from)) ||
          isBefore(endOfYear(props.cellDate), prev.to)
        ) {
          props.setIsSelectingEnd(false);
          return {
            from: startOfYear(props.cellDate),
            to: endOfYear(props.cellDate),
          };
        } else {
          props.setIsSelectingEnd(true);
          if (props.isSelectingEnd) {
            return {
              from: startOfYear(props.cellDate),
              to: prev.to,
            };
          } else {
            return {
              from: prev.from,
              to: endOfYear(props.cellDate),
            };
          }
        }
      });
    } else {
      props.setRange((prev) => {
        if (
          (props.isSelectingEnd &&
            isAfter(startOfDay(props.cellDate), prev.from)) ||
          isBefore(endOfDay(props.cellDate), prev.to)
        ) {
          props.setIsSelectingEnd(false);
          return {
            from: startOfDay(props.cellDate),
            to: endOfDay(props.cellDate),
          };
        } else {
          props.setIsSelectingEnd(true);
          if (props.isSelectingEnd) {
            return {
              from: startOfDay(props.cellDate),
              to: prev.to,
            };
          } else {
            return {
              from: prev.from,
              to: endOfDay(props.cellDate),
            };
          }
        }
      });
    }
  };
  const content = useMemo(() => {
    switch (props.rangeType) {
      case "months":
        return formatDate(props.cellDate, "MMM");
      case "quarters":
        return `Q${getQuarter(props.cellDate)}`;
      case "years":
        return formatDate(props.cellDate, "yyyy");
      default:
        return props.cellDate.getDate();
    }
  }, [props.cellDate, props.rangeType]);
  return (
    <td key={props.cellDate.valueOf()} className="relative p-0">
      <div
        onMouseEnter={() => {
          props.setHoverDate(props.cellDate);
        }}
        onMouseLeave={() => {
          props.setHoverDate(null);
        }}
        className={getClassNames(props.cellDate)}
        onClick={handleClick}
      >
        <div className="z-[1]">{content}</div>
      </div>
    </td>
  );
}
