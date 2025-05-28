import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface InlineDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export function InlineDateRangePicker({
  startDate,
  endDate,
  onChange,
}: InlineDateRangePickerProps) {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    startDate,
    endDate,
  ]);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    setRange([startDate, endDate]);
  }, [startDate, endDate]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setRange(dates);
    onChange({ startDate: start, endDate: end });
  };

  const label = hasMounted
    ? range[0]
      ? `Dal ${format(range[0], "dd MMM", { locale: it })}` +
        (range[1]
          ? ` al ${format(range[1], "dd MMM yyyy", { locale: it })}`
          : "")
      : "Seleziona intervallo"
    : "Seleziona intervallo";

  return (
    <Popover>
      <PopoverTrigger asChild className="mx-auto">
        <Button
          variant="outline"
          className="justify-between font-normal w-full sm:w-auto"
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DatePicker
          selected={range[0]}
          onChange={handleChange}
          startDate={range[0]}
          endDate={range[1]}
          selectsRange
          inline
          locale={it}
          monthsShown={1}
        />
      </PopoverContent>
    </Popover>
  );
}
