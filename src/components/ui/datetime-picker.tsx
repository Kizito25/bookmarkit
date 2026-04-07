import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({ value, onChange, placeholder = "Select date and time", className }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [selectedHour, setSelectedHour] = useState(value ? new Date(value).getHours() : 9);
  const [selectedMinute, setSelectedMinute] = useState(value ? new Date(value).getMinutes() : 0);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    updateDateTime(newDate, selectedHour, selectedMinute);
  };

  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    updateDateTime(selectedDate, hour, minute);
  };

  const updateDateTime = (date: Date, hour: number, minute: number) => {
    const newDateTime = new Date(date);
    newDateTime.setHours(hour, minute, 0, 0);
    onChange(newDateTime.toISOString());
  };

  const quickOptions = [
    { label: "In 1 hour", value: addDays(new Date(), 0).setHours(new Date().getHours() + 1, 0, 0, 0) },
    { label: "Tomorrow 9 AM", value: addDays(new Date(), 1).setHours(9, 0, 0, 0) },
    { label: "Next week", value: addDays(new Date(), 7).setHours(9, 0, 0, 0) },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPp") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={handleDateChange}
              min={format(new Date(), "yyyy-MM-dd")}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Hour</label>
              <Select value={selectedHour.toString()} onValueChange={(value) => handleTimeChange(parseInt(value), selectedMinute)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Minute</label>
              <Select value={selectedMinute.toString()} onValueChange={(value) => handleTimeChange(selectedHour, parseInt(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quick options</label>
            <div className="space-y-1">
              {quickOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => {
                    const date = new Date(option.value);
                    setSelectedDate(date);
                    setSelectedHour(date.getHours());
                    setSelectedMinute(date.getMinutes());
                    onChange(date.toISOString());
                    setOpen(false);
                  }}
                >
                  <Clock className="mr-2 h-3 w-3" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={() => setOpen(false)} className="w-full">
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
