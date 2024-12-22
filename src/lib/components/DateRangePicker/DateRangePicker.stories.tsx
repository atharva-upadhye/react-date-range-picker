import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import { DateRangePicker, DateRangePickerProps } from "./DateRangePicker";
import { useState } from "react";

const DateRangePickerInstance = ({
  selectedRange,
  setSelectedRange,
}: DateRangePickerProps) => {
  const [range, setRange] = useState(selectedRange);
  return (
    <div className="p-4">
      <DateRangePicker
        selectedRange={range}
        setSelectedRange={(...args) => {
          setSelectedRange(...args);
          setRange(...args);
        }}
      />
    </div>
  );
};
// Meta configuration
const meta = {
  title: "DateRangePicker",
  component: DateRangePicker,
  args: {
    selectedRange: {
      from: new Date("2022-02-02"),
      to: new Date("2022-02-08"),
    },
    setSelectedRange: (newState) => {
      console.log("new state = ", newState);
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// Decorator to wrap story and provide state management
const withDateRangeState: Decorator = (Story) => {
  const [selectedRange, setSelectedRange] = useState({
    from: new Date("2022-02-02"),
    to: new Date("2022-02-08"),
  });

  return (
    <div className="p-4">
      <Story
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />
    </div>
  );
};

// Default story
export const Default: Story = {
  render: (args) => <DateRangePickerInstance {...args} />,
  decorators: [withDateRangeState], // Apply the decorator
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ensure the date range picker is in the document
    const dateRangePicker = canvas.getByRole("button", {
      name: / - /i,
    });
    await expect(dateRangePicker).toBeInTheDocument();

    // Open the date range picker
    await userEvent.click(dateRangePicker);
  },
};
