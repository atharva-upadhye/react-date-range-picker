import {
  addDays,
  differenceInCalendarWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  formatDate,
  isAfter,
  isBefore,
  isEqual,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  type ThHTMLAttributes,
  useCallback,
} from "react";

type DateRange = {
  from: Date;
  to: Date;
};
type XCalendarProps = {
  viewDate: Date;
  weekDayProps?: ThHTMLAttributes<HTMLTableCellElement>;
  rangeType: "date" | "week" | "month" | "year";
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
};
function XCalendar(props: XCalendarProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const firstCell = startOfWeek(startOfMonth(props.viewDate));
  const rowsCount =
    differenceInCalendarWeeks(
      endOfMonth(props.viewDate),
      startOfMonth(props.viewDate),
    ) + 1;
  const cells = Array.from(Array(rowsCount).keys()).map((weekIndex) => {
    return Array.from(Array(7).keys()).map((v) => {
      return addDays(firstCell, weekIndex * 7 + v);
    });
  });
  function isDateBetween(date: Date, from: Date, to: Date) {
    return !isBefore(date, from) && !isAfter(date, to);
  }
  const getClassNames = useCallback(
    (cellDate: Date) => {
      let toReturn =
        " flex h-12 w-12 cursor-pointer items-center justify-center";
      const styleRangeStart =
        " rounded-l-full before:absolute before:h-12 before:w-12 before:rounded-full before:bg-gray-500";
      const styleRangeEnd =
        " rounded-r-full before:absolute before:h-12 before:w-12 before:rounded-full before:bg-gray-500";
      const isPartOfSelectedRange = isDateBetween(
        cellDate,
        props.range.from,
        props.range.to,
      );
      if (isPartOfSelectedRange) {
        toReturn = toReturn.concat(" bg-gray-400");
      }
      if (isEqual(props.range.from, cellDate)) {
        toReturn = toReturn.concat(styleRangeStart);
      }
      if (isEqual(endOfDay(props.range.to), endOfDay(cellDate))) {
        toReturn = toReturn.concat(styleRangeEnd);
      }
      if (props.hoverRange) {
        if (
          !isPartOfSelectedRange &&
          isDateBetween(cellDate, props.hoverRange.from, props.hoverRange.to)
        ) {
          toReturn = toReturn.concat(" bg-gray-300");
        }
        if (isEqual(cellDate, props.hoverRange.from)) {
          toReturn = toReturn.concat(styleRangeStart);
        }
        if (isEqual(endOfDay(cellDate), props.hoverRange.to)) {
          toReturn = toReturn.concat(styleRangeEnd);
        }
      }

      return toReturn;
    },
    [props.hoverRange, props.range.from, props.range.to],
  );
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <div>{props.titleLeft}</div>
        {formatDate(props.viewDate, "MMMM yyyy")}
        <div>{props.titleRight}</div>
      </div>
      <table>
        <thead>
          <tr>
            {weekDays.map((weekDay) => (
              <th key={weekDay} className="h-12 w-12" {...props.weekDayProps}>
                {weekDay}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((calWeek, i) => {
            return (
              <tr key={i}>
                {calWeek.map((cellDate) => (
                  <td key={cellDate.valueOf()} className="relative p-0">
                    {isBefore(cellDate, startOfMonth(props.viewDate)) ||
                    isAfter(cellDate, endOfMonth(props.viewDate)) ? (
                      props.options?.showOutOfCalendarDates ? (
                        <div
                          onMouseEnter={() => {
                            props.setHoverDate(cellDate);
                          }}
                          onMouseLeave={() => {
                            props.setHoverDate(null);
                          }}
                          className={` opacity-20 ${getClassNames(cellDate)}`}
                          onClick={() => {
                            if (props.rangeType === "week") {
                              props.setRange({
                                from: startOfWeek(cellDate),
                                to: endOfWeek(cellDate),
                              });
                            }
                          }}
                        >
                          <div className="z-[1]">{cellDate.getDate()}</div>
                        </div>
                      ) : null
                    ) : (
                      <div
                        onMouseEnter={() => {
                          props.setHoverDate(cellDate);
                        }}
                        onMouseLeave={() => {
                          props.setHoverDate(null);
                        }}
                        className={getClassNames(cellDate)}
                        onClick={() => {
                          if (props.rangeType === "week") {
                            props.setRange({
                              from: startOfWeek(cellDate),
                              to: endOfWeek(cellDate),
                            });
                          }
                        }}
                      >
                        <div className="z-[1]">{cellDate.getDate()}</div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { XCalendar };
