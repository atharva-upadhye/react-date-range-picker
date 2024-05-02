"use client";
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button, buttonVariants } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { endOfWeek, formatDate, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { XCalendar } from "./ui/XCalendar";

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

    const [range, setRange] = useState<DateRange>(selectedRange);
    const resetValues = () => {
      setRange(selectedRange);
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
          <Button
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
                  <XCalendar
                    defaultMonth={new Date()}
                    dateCellPropsGen={(date) => {
                      return {
                        className: "w-9 h-9 flex justify-center items-center",
                      };
                    }}
                  />
                </TabsContent>
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

export { DateRangePicker };
