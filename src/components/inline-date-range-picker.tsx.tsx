import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
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
  const [range, setRange] = useState<DateRange>({
    from: startDate ?? undefined,
    to: endDate ?? undefined,
  });

  // Fix per hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    setRange({
      from: startDate ?? undefined,
      to: endDate ?? undefined,
    });
  }, [startDate, endDate]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange || !selectedRange.from) {
      setRange({ from: undefined, to: undefined });
      onChange({ startDate: null, endDate: null });
      return;
    }

    setRange(selectedRange);
    onChange({
      startDate: selectedRange.from,
      endDate: selectedRange.to ?? null,
    });
  };

  const label = hasMounted
    ? range.from
      ? `Dal ${format(range.from, "dd MMM", { locale: it })}` +
        (range.to
          ? ` al ${format(range.to, "dd MMM yyyy", { locale: it })}`
          : "")
      : "Seleziona intervallo"
    : "Seleziona intervallo";

  return (
    <Popover>
      <PopoverTrigger asChild className="mx-auto">
        <Button
          variant="outline"
          className="w-[230px] justify-between font-normal"
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={1}
          locale={it}
        />
      </PopoverContent>
    </Popover>
  );
}
