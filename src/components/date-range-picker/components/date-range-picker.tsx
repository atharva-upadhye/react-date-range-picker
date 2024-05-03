"use client";
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
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { rangeTypes } from "../constants";
import { type RangeType, type DateRange } from "../types";
import { Calendar } from "./calendar";

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
const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({ selectedRange, setSelectedRange, ...buttonProps }, ref) => {
    const [isSelectingStart, setIsSelectingStart] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      setIsOpen(true);
    }, []);
    const [rangeType, setRangeType] = useState<RangeType>(rangeTypes[0]);
    const [viewDate, setViewDate] = useState(startOfDay(selectedRange.from));
    const [range, setRange] = useState<DateRange>(
      rangeType === "months"
        ? {
            from: startOfYear(selectedRange.from),
            to: endOfYear(selectedRange.to),
          }
        : {
            from: startOfDay(selectedRange.from),
            to: endOfDay(selectedRange.to),
          },
    );
    const resetValues = () => {
      setRange(selectedRange);
    };
    useEffect(() => {
      console.log(
        "range",
        formatDate(range.from, "dd MM yyyy"),
        formatDate(range.to, "dd MM yyyy"),
      );
    }, [range]);
    const getDateRange = useCallback(
      (date: Date): DateRange => {
        if (rangeType === "custom") {
          return {
            from: startOfDay(date),
            to: endOfDay(date),
          };
        } else if (rangeType === "months") {
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
            from: date,
            to: date,
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

    useEffect(() => {
      console.log("isSelectingStart", isSelectingStart);
    }, [isSelectingStart]);

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
          <Button
            ref={ref}
            onClick={() => {
              console.log("clicked");
            }}
            {...buttonProps}
          >
            {formatDate(selectedRange.from, "dd/MM/yyyy") +
              " - " +
              formatDate(selectedRange.to, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">
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
            <div className="flex flex-col px-3">
              <Tabs value={rangeType} className="w-auto">
                <TabsList>
                  <TabsTrigger
                    value={rangeTypes[0]}
                    onClick={() => {
                      setRangeType(rangeTypes[0]);
                    }}
                  >
                    {rangeTypes[0]}
                  </TabsTrigger>
                  <TabsTrigger
                    value={rangeTypes[1]}
                    onClick={() => {
                      setRangeType(rangeTypes[1]);
                    }}
                  >
                    {rangeTypes[1]}
                  </TabsTrigger>
                  <TabsTrigger
                    value={rangeTypes[2]}
                    onClick={() => {
                      setRangeType(rangeTypes[2]);
                    }}
                  >
                    {rangeTypes[2]}
                  </TabsTrigger>
                  <TabsTrigger
                    value={rangeTypes[3]}
                    onClick={() => {
                      setRangeType(rangeTypes[3]);
                    }}
                  >
                    {rangeTypes[3]}
                  </TabsTrigger>
                  <TabsTrigger
                    value={rangeTypes[4]}
                    onClick={() => {
                      setRangeType(rangeTypes[4]);
                    }}
                  >
                    {rangeTypes[4]}
                  </TabsTrigger>
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
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
                        isSelectingStart={isSelectingStart}
                        setIsSelectingStart={setIsSelectingStart}
                        getDateRange={getDateRange}
                      />
                    </div>
                    {/* <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={range}
                      onDayFocus={(day) => {
                        setRange({
                          from: day,
                          to: day,
                        });
                      }}
                      defaultMonth={selectedRange.from}
                    /> */}
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
                        rangeType="weeks"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
                        isSelectingStart={isSelectingStart}
                        setIsSelectingStart={setIsSelectingStart}
                        getDateRange={getDateRange}
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
                              setViewDate(addYears(viewDate, 1));
                            }}
                          >
                            <ChevronRight />
                          </Button>
                        }
                        viewDate={addYears(viewDate, 1)}
                        rangeType="months"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
                        isSelectingStart={isSelectingStart}
                        setIsSelectingStart={setIsSelectingStart}
                        getDateRange={getDateRange}
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
                              setViewDate(addYears(viewDate, 1));
                            }}
                          >
                            <ChevronRight />
                          </Button>
                        }
                        viewDate={addYears(viewDate, 1)}
                        rangeType="quarters"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
                        isSelectingStart={isSelectingStart}
                        setIsSelectingStart={setIsSelectingStart}
                        getDateRange={getDateRange}
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
                              setViewDate(addYears(viewDate, 12));
                            }}
                          >
                            <ChevronRight />
                          </Button>
                        }
                        viewDate={addYears(viewDate, 12)}
                        rangeType="years"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
                        isSelectingStart={isSelectingStart}
                        setIsSelectingStart={setIsSelectingStart}
                        getDateRange={getDateRange}
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
  },
);
DateRangePicker.displayName = "DateRangePicker";
export { DateRangePicker };
