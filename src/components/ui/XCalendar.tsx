import {
  addDays,
  differenceInCalendarWeeks,
  endOfMonth,
  isAfter,
  isBefore,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
type XCalendarProps = {
  defaultMonth: Date;
  weekDayProps?: ThHTMLAttributes<HTMLTableCellElement>;
  dateCellPropsGen?: (dateCell: Date) => HTMLAttributes<HTMLDivElement>;
};
function XCalendar({
  defaultMonth,
  weekDayProps,
  dateCellPropsGen = () => ({}),
}: XCalendarProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const firstCell = startOfWeek(startOfMonth(defaultMonth));
  const totalWeeksToDisplay =
    differenceInCalendarWeeks(
      endOfMonth(defaultMonth),
      startOfMonth(defaultMonth),
    ) + 1;
  const cells = Array.from(Array(totalWeeksToDisplay).keys()).map(
    (weekIndex) => {
      return Array.from(Array(7).keys()).map((v) => {
        return addDays(firstCell, weekIndex * 7 + v);
      });
    },
  );

  return (
    <table>
      <thead>
        <tr>
          {weekDays.map((weekDay) => (
            <th key={weekDay} {...weekDayProps}>
              {weekDay}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cells.map((calWeek, i) => {
          return (
            <tr key={i}>
              {calWeek.map((dateCell) => (
                <td key={dateCell.valueOf()}>
                  <div {...dateCellPropsGen(dateCell)}>
                    {isBefore(dateCell, startOfMonth(defaultMonth)) ||
                    isAfter(dateCell, endOfMonth(defaultMonth))
                      ? null
                      : dateCell.getDate()}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export { XCalendar };
