"use client";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/lib";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/Tabs";
import { toTitleCase } from "@/lib/utils";
import {
  addMonths,
  addYears,
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  formatDate,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { TabsContent } from "@/lib";
import { rangeTypes } from "./constants";
import { type DateRange, type RangeType } from "./types";
import { Calendar } from "./components/Calendar";

export interface DateRangePickerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selectedRange: DateRange;
  setSelectedRange: Dispatch<
    SetStateAction<{
      from: Date;
      to: Date;
    }>
  >;
}
export const DateRangePicker = forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(({ selectedRange, setSelectedRange, ...buttonProps }, ref) => {
  const prevRange = useMemo(
    () => ({
      from: startOfDay(selectedRange.from),
      to: endOfDay(selectedRange.to),
    }),
    [selectedRange.from, selectedRange.to],
  );
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  // useEffect(() => {
  //   setIsOpen(true);
  // }, []);
  const [rangeType, setRangeType] = useState<RangeType>("custom");
  const [range, setRange] = useState<DateRange>(prevRange);
  const [viewDate, setViewDate] = useState(startOfDay(prevRange.from));
  const resetValues = () => {
    setRange(prevRange);
  };
  const getDateRange = useCallback(
    (date: Date): DateRange => {
      if (rangeType === "months") {
        return {
          from: startOfMonth(date),
          to: endOfMonth(date),
        };
      } else if (rangeType === "quarters") {
        return {
          from: startOfQuarter(date),
          to: endOfQuarter(date),
        };
      } else if (rangeType === "weeks") {
        return {
          from: startOfWeek(date),
          to: endOfWeek(date),
        };
      } else if (rangeType === "years") {
        return {
          from: startOfYear(date),
          to: endOfYear(date),
        };
      } else {
        return {
          from: startOfDay(date),
          to: endOfDay(date),
        };
      }
    },
    [rangeType],
  );
  const [hoverDate, setHoverDate] = useState<null | Date>(null);
  const hoverRange = useMemo<DateRange | null>(() => {
    if (hoverDate === null) return null;
    if (rangeType === "weeks") {
      return {
        from: startOfWeek(hoverDate),
        to: endOfWeek(hoverDate),
      };
    } else if (rangeType === "months") {
      return {
        from: startOfMonth(hoverDate),
        to: endOfMonth(hoverDate),
      };
    } else if (rangeType === "quarters") {
      return {
        from: startOfQuarter(hoverDate),
        to: endOfQuarter(hoverDate),
      };
    }
    return {
      from: startOfDay(hoverDate),
      to: endOfDay(hoverDate),
    };
  }, [hoverDate, rangeType]);

  const commonProps = {
    range,
    setRange,
    hoverDate,
    hoverRange,
    setHoverDate,
    isSelectingStart,
    setIsSelectingStart,
    getDateRange,
  };
  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button ref={ref} {...buttonProps}>
          {formatDate(selectedRange.from, "dd/MM/yyyy") +
            " - " +
            formatDate(selectedRange.to, "dd/MM/yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto" data-testid="popover">
        <div className="flex flex-row gap-2 divide-x">
          <div className="flex flex-col divide-y">
            <Button className="justify-start" variant={"link"} disabled>
              All dates
            </Button>
            <div className="flex flex-col">
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("custom");
                  const from = startOfDay(new Date());
                  setViewDate(from);
                  setRange({
                    from,
                    to: endOfDay(from),
                  });
                }}
              >
                Today
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("weeks");
                  const from = startOfWeek(new Date());
                  setViewDate(from);
                  setRange({
                    from,
                    to: endOfWeek(from),
                  });
                }}
              >
                This week
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("months");
                  const from = startOfMonth(new Date());
                  setViewDate(from);
                  setRange({
                    from,
                    to: endOfMonth(from),
                  });
                }}
              >
                This month
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("quarters");
                  const from = startOfQuarter(new Date());
                  setViewDate(from);
                  setRange({
                    from,
                    to: endOfQuarter(from),
                  });
                }}
              >
                This quarter
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("years");
                  const from = startOfYear(new Date());
                  setViewDate(from);
                  setRange({
                    from,
                    to: endOfYear(from),
                  });
                }}
              >
                This year
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("weeks");
                  const from = startOfWeek(subWeeks(new Date(), 1));
                  setViewDate(from);
                  setRange({
                    from: from,
                    to: endOfWeek(from),
                  });
                }}
              >
                Last week
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("months");
                  const from = startOfMonth(subMonths(new Date(), 1));
                  setViewDate(from);
                  setRange({
                    from: from,
                    to: endOfMonth(from),
                  });
                }}
              >
                Last month
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("quarters");
                  const from = startOfQuarter(subQuarters(new Date(), 1));
                  setViewDate(from);
                  setRange({
                    from: from,
                    to: endOfQuarter(from),
                  });
                }}
              >
                Last quarter
              </Button>
              <Button
                className="justify-start"
                variant={"link"}
                onClick={() => {
                  setRangeType("years");
                  const from = startOfYear(subYears(new Date(), 1));
                  setViewDate(from);
                  setRange({
                    from: from,
                    to: endOfYear(from),
                  });
                }}
              >
                Last year
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between px-3">
            <Tabs value={rangeType} className="w-auto">
              <TabsList>
                {rangeTypes.map((rangeType) => (
                  <TabsTrigger
                    key={rangeType}
                    value={rangeType}
                    onClick={() => {
                      setRangeType(rangeType);
                    }}
                  >
                    {toTitleCase(rangeType)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="p-2">
                <TabsContent value={rangeTypes[0]}>
                  <div className="flex flex-row gap-2">
                    <Calendar
                      titleLeft={
                        <Button
                          onClick={() => {
                            setViewDate(subMonths(viewDate, 1));
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                      }
                      viewDate={viewDate}
                      rangeType="custom"
                      range={range}
                      setRange={setRange}
                      hoverDate={hoverDate}
                      hoverRange={hoverRange}
                      setHoverDate={setHoverDate}
                      options={{
                        showOutOfCalendarDates: true,
                      }}
                      isSelectingStart={isSelectingStart}
                      setIsSelectingStart={setIsSelectingStart}
                      getDateRange={getDateRange}
                    />
                    <Calendar
                      titleRight={
                        <Button
                          onClick={() => {
                            setViewDate(addMonths(viewDate, 1));
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      }
                      viewDate={addMonths(viewDate, 1)}
                      rangeType="custom"
                      options={{
                        showOutOfCalendarDates: false,
                      }}
                      {...commonProps}
                    />
                  </div>
                </TabsContent>
                <TabsContent value={rangeTypes[1]}>
                  <div className="flex flex-row gap-2">
                    <Calendar
                      titleLeft={
                        <Button
                          onClick={() => {
                            setViewDate(subMonths(viewDate, 1));
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                      }
                      viewDate={viewDate}
                      rangeType="weeks"
                      options={{
                        showOutOfCalendarDates: true,
                      }}
                      {...commonProps}
                    />
                    <Calendar
                      titleRight={
                        <Button
                          onClick={() => {
                            setViewDate(addMonths(viewDate, 1));
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      }
                      viewDate={addMonths(viewDate, 1)}
                      rangeType="weeks"
                      options={{
                        showOutOfCalendarDates: false,
                      }}
                      {...commonProps}
                    />
                  </div>
                </TabsContent>
                <TabsContent value={rangeTypes[2]}>
                  <div className="flex flex-row gap-2">
                    <Calendar
                      titleLeft={
                        <Button
                          onClick={() => {
                            setViewDate(subYears(viewDate, 1));
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                      }
                      viewDate={viewDate}
                      rangeType="months"
                      options={{
                        showOutOfCalendarDates: true,
                      }}
                      {...commonProps}
                    />
                    <Calendar
                      titleRight={
                        <Button
                          onClick={() => {
                            setViewDate(addYears(viewDate, 1));
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      }
                      viewDate={addYears(viewDate, 1)}
                      rangeType="months"
                      options={{
                        showOutOfCalendarDates: false,
                      }}
                      {...commonProps}
                    />
                  </div>
                </TabsContent>
                <TabsContent value={rangeTypes[3]}>
                  <div className="flex flex-row gap-2">
                    <Calendar
                      titleLeft={
                        <Button
                          onClick={() => {
                            setViewDate(subYears(viewDate, 1));
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                      }
                      viewDate={viewDate}
                      rangeType="quarters"
                      options={{
                        showOutOfCalendarDates: true,
                      }}
                      {...commonProps}
                    />
                    <Calendar
                      titleRight={
                        <Button
                          onClick={() => {
                            setViewDate(addYears(viewDate, 1));
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      }
                      viewDate={addYears(viewDate, 1)}
                      rangeType="quarters"
                      options={{
                        showOutOfCalendarDates: false,
                      }}
                      {...commonProps}
                    />
                  </div>
                </TabsContent>
                <TabsContent value={rangeTypes[4]}>
                  <div className="flex flex-row gap-2">
                    <Calendar
                      titleLeft={
                        <Button
                          onClick={() => {
                            setViewDate(subYears(viewDate, 12));
                          }}
                        >
                          <ChevronLeft />
                        </Button>
                      }
                      viewDate={viewDate}
                      rangeType="years"
                      options={{
                        showOutOfCalendarDates: true,
                      }}
                      {...commonProps}
                    />
                    <Calendar
                      titleRight={
                        <Button
                          onClick={() => {
                            setViewDate(addYears(viewDate, 12));
                          }}
                        >
                          <ChevronRight />
                        </Button>
                      }
                      viewDate={addYears(viewDate, 12)}
                      rangeType="years"
                      options={{
                        showOutOfCalendarDates: false,
                      }}
                      {...commonProps}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
            <div className="flex flex-row justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  resetValues();
                  setIsOpen(false);
                  setHoverDate(null);
                  setIsSelectingStart(true);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setSelectedRange(range);
                  setViewDate(range.from);
                  setIsOpen(false);
                  setHoverDate(null);
                  setIsSelectingStart(true);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});
DateRangePicker.displayName = "DateRangePicker";
