"use client";
import React, {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  addMonths,
  endOfDay,
  endOfWeek,
  formatDate,
  startOfDay,
  startOfWeek,
  subMonths,
} from "date-fns";
import { XCalendar } from "./ui/XCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const rangeTypes = ["custom", "weeks", "months", "quarters", "years"] as const;

export interface DateRangePickerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selectedRange: DateRange;
  setSelectedRange: Dispatch<
    SetStateAction<{
      from: Date;
      to: Date;
    }>
  >;
  rangeType?: (typeof rangeTypes)[number];
}
type DateRange = {
  from: Date;
  to: Date;
};
const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    { selectedRange, setSelectedRange, rangeType = "custom", ...buttonProps },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      setIsOpen(true);
    }, []);
    const [viewDate, setViewDate] = useState(startOfDay(selectedRange.from));
    const [range, setRange] = useState<DateRange>({
      from: startOfDay(selectedRange.from),
      to: endOfDay(selectedRange.to),
    });
    const resetValues = () => {
      setRange(selectedRange);
    };
    const [hoverDate, setHoverDate] = useState<null | Date>(null);
    const hoverRange = useMemo<DateRange | null>(() => {
      if (hoverDate === null) return null;
      if (rangeType === "weeks") {
        return {
          from: startOfWeek(hoverDate),
          to: endOfWeek(hoverDate),
        };
      }
      return {
        from: startOfDay(hoverDate),
        to: endOfDay(hoverDate),
      };
    }, [hoverDate, rangeType]);

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
              {/* <Button className="justify-start" variant={"link"}>
                All dates
              </Button> */}
              <div className="flex flex-col">
                {["Today", "This week"].map((switchTo) => (
                  <Button
                    className="justify-start"
                    key={switchTo}
                    variant={"link"}
                  >
                    {switchTo}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col px-3">
              <Tabs defaultValue={rangeType} className="w-auto">
                <TabsList>
                  <TabsTrigger value={rangeTypes[0]}>
                    {rangeTypes[0]}
                  </TabsTrigger>
                  <TabsTrigger value={rangeTypes[1]}>
                    {rangeTypes[1]}
                  </TabsTrigger>
                </TabsList>
                <div className="p-2">
                  <TabsContent value={rangeTypes[0]}>
                    <Calendar
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
                    />
                  </TabsContent>
                  <TabsContent value={rangeTypes[1]}>
                    {/* <Calendar
                    classNames={{
                      nav_button: cn(
                        buttonVariants({ variant: "outline" }),
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      ),
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent  focus-within:relative focus-within:z-20",
                      day_range_end: "day-range-end rounded-none rounded-r-md",
                      day_range_start:
                        "day-range-end rounded-none rounded-l-md",
                      day_selected:
                        "bg-primary text-primary-foreground text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_range_middle:
                        "aria-selected:bg-primary aria-selected:text-primary-foreground rounded-none ",

                      weeknumber:
                        "flex h-9 w-9 justify-center items-center text-gray-400",
                    }}
                    mode="range"
                    numberOfMonths={2}
                    selected={range}
                    onDayFocus={(day) => {
                      setRange({
                        from: startOfWeek(day),
                        to: endOfWeek(day),
                      });
                    }}
                    defaultMonth={selectedRange.from}
                  /> */}
                    <div className="flex flex-row gap-2">
                      <XCalendar
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
                        rangeType="week"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: true,
                        }}
                      />
                      <XCalendar
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
                        rangeType="week"
                        range={range}
                        setRange={setRange}
                        hoverDate={hoverDate}
                        hoverRange={hoverRange}
                        setHoverDate={setHoverDate}
                        options={{
                          showOutOfCalendarDates: false,
                        }}
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
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRange(range);
                    setViewDate(range.from);
                    setIsOpen(false);
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
