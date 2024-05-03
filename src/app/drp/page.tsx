"use client";
import { DateRangePicker } from "@/components/date-range-picker";
import { useState } from "react";

export default function DrpPage() {
  const [range, setRange] = useState({
    from: new Date("2024-04-07"),
    to: new Date("2024-04-13"),
  });
  return (
    <div className="p-3">
      <DateRangePicker selectedRange={range} setSelectedRange={setRange} />
    </div>
  );
}
