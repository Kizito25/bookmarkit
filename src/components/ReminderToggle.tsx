import { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { DateTimePicker } from './ui/datetime-picker';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ReminderToggleProps {
  enabled: boolean;
  date: string | null;
  onUpdate: (enabled: boolean, date: string | null) => void;
}

export function ReminderToggle({ enabled, date, onUpdate }: ReminderToggleProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    if (!checked) {
      onUpdate(false, null);
    }
  };

  const handleDateChange = (value: string) => {
    if (isEnabled) {
      onUpdate(true, value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="reminder-toggle"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="reminder-toggle" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Set Reminder
        </Label>
      </div>
      
      {isEnabled && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Remind me on:
          </Label>
          <DateTimePicker
            value={date || ''}
            onChange={handleDateChange}
            placeholder="Select reminder date and time"
          />
          {date && (
            <p className="text-xs text-muted-foreground">
              Reminder set for {format(new Date(date), 'PPp')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
