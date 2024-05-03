"use client";
import { DateRangePicker } from "@/components/date-range-picker";
import { formatDate } from "date-fns";
import { useState } from "react";

export default function DrpPage() {
  const [range, setRange] = useState({
    from: new Date("2024-04-08"),
    to: new Date("2024-04-10"),
  });
  return (
    <div className="p-3">
      from:{formatDate(range.from, "dd MMM yyyy")}
      <br />
      to: {formatDate(range.to, "dd MMM yyyy")}
      <br />
      <br />
      <DateRangePicker selectedRange={range} setSelectedRange={setRange} />
    </div>
  );
}
