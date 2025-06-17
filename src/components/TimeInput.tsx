
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const TimeInput = ({ value, onChange, disabled = false, className = "" }: TimeInputProps) => {
  const [time12, setTime12] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Convert 24-hour format to 12-hour format when value changes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour24 = parseInt(hours);
      
      if (hour24 === 0) {
        setTime12(`12:${minutes}`);
        setPeriod('AM');
      } else if (hour24 < 12) {
        setTime12(`${hour24.toString().padStart(2, '0')}:${minutes}`);
        setPeriod('AM');
      } else if (hour24 === 12) {
        setTime12(`12:${minutes}`);
        setPeriod('PM');
      } else {
        setTime12(`${(hour24 - 12).toString().padStart(2, '0')}:${minutes}`);
        setPeriod('PM');
      }
    }
  }, [value]);

  // Convert 12-hour format to 24-hour format and call onChange
  const handleTimeChange = (newTime: string, newPeriod: 'AM' | 'PM') => {
    if (!newTime) return;
    
    const [hours, minutes] = newTime.split(':');
    let hour24 = parseInt(hours);
    
    if (newPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (newPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    
    const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
    onChange(time24);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime12(newTime);
    handleTimeChange(newTime, period);
  };

  const handlePeriodToggle = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    if (time12) {
      handleTimeChange(time12, newPeriod);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="time"
          value={time12}
          onChange={handleInputChange}
          disabled={disabled}
          className="pl-10 border-gray-200 focus:border-amber-400 focus:ring-amber-400"
          step="60"
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handlePeriodToggle}
        disabled={disabled}
        className="px-3 py-1 text-sm font-medium border-gray-200 hover:bg-amber-50 hover:border-amber-300"
      >
        {period}
      </Button>
    </div>
  );
};