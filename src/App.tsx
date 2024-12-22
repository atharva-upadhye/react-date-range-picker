import { useState } from "react";
import { DateRangePicker } from "./lib";
import "./lib/global.css";
export type Aoiuhllsusduf = string | number;
function App() {
  const [range, setRange] = useState({
    from: new Date("2022-02-02"),
    to: new Date("2022-02-08"),
  });
  return (
    <div className="p-4">
      <DateRangePicker selectedRange={range} setSelectedRange={setRange} />
    </div>
  );
}

export default App;
