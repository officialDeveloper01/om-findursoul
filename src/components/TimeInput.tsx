
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const TimeInput = ({ value, onChange, disabled = false, className = "" }: TimeInputProps) => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Convert 24-hour format to 12-hour format when value changes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour24 = parseInt(hours);
      
      if (hour24 === 0) {
        setHour('12');
        setMinute(minutes);
        setPeriod('AM');
      } else if (hour24 < 12) {
        setHour(hour24.toString());
        setMinute(minutes);
        setPeriod('AM');
      } else if (hour24 === 12) {
        setHour('12');
        setMinute(minutes);
        setPeriod('PM');
      } else {
        setHour((hour24 - 12).toString());
        setMinute(minutes);
        setPeriod('PM');
      }
    }
  }, [value]);

  // Convert 12-hour format to 24-hour format and call onChange
  const updateTime = (newHour: string, newMinute: string, newPeriod: 'AM' | 'PM') => {
    let hour24 = parseInt(newHour);
    
    if (newPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (newPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    
    const time24 = `${hour24.toString().padStart(2, '0')}:${newMinute}`;
    onChange(time24);
  };

  const handleHourChange = (newHour: string) => {
    setHour(newHour);
    updateTime(newHour, minute, period);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute);
    updateTime(hour, newMinute, period);
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod);
    updateTime(hour, minute, newPeriod);
  };

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="text-gray-400 w-4 h-4 flex-shrink-0" />
      
      <div className="flex gap-1 flex-1">
        <Select value={hour} onValueChange={handleHourChange} disabled={disabled}>
          <SelectTrigger className="w-16 border-gray-200 focus:border-amber-400 focus:ring-amber-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-48 z-50">
            {hourOptions.map((h) => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="flex items-center text-gray-500">:</span>

        <Select value={minute} onValueChange={handleMinuteChange} disabled={disabled}>
          <SelectTrigger className="w-16 border-gray-200 focus:border-amber-400 focus:ring-amber-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg max-h-48 z-50">
            {minuteOptions.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={handlePeriodChange} disabled={disabled}>
          <SelectTrigger className="w-16 border-gray-200 focus:border-amber-400 focus:ring-amber-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
