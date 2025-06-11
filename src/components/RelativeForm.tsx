
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';

const RELATION_OPTIONS = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'BROTHER', label: 'Brother' },
  { value: 'SISTER', label: 'Sister' },
  { value: 'UNCLE', label: 'Uncle' },
  { value: 'AUNT', label: 'Aunt' },
  { value: 'GRANDFATHER', label: 'Grandfather' },
  { value: 'GRANDMOTHER', label: 'Grandmother' }
];

export const RelativeForm = ({ onUpdate, onRemove, index, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    timeOfBirth: initialData.timeOfBirth || '',
    placeOfBirth: initialData.placeOfBirth || '',
    relation: initialData.relation || ''
  });

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    
    // Immediately update parent component
    if (onUpdate) {
      onUpdate(updatedData, index);
    }
  };

  // Update parent whenever formData changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate(formData, index);
    }
  }, [formData, onUpdate, index]);

  const isFormValid = formData.fullName && formData.dateOfBirth && formData.timeOfBirth && formData.placeOfBirth && formData.relation;

  return (
    <Card className="relative shadow-md border border-amber-200">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        onClick={() => onRemove(index)}
      >
        <X size={16} />
      </Button>
      
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-light text-amber-700">
          Family Member #{index + 1}
          {isFormValid && (
            <span className="ml-2 text-sm text-green-600">✓ Complete</span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`fullName-${index}`} className="flex items-center gap-2 text-gray-700">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id={`fullName-${index}`}
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter full name"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`relation-${index}`} className="flex items-center gap-2 text-gray-700">
                Relation
              </Label>
              <Select value={formData.relation} onValueChange={(value) => handleInputChange('relation', value)}>
                <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`dateOfBirth-${index}`} className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                Date of Birth
              </Label>
              <Input
                id={`dateOfBirth-${index}`}
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`timeOfBirth-${index}`} className="flex items-center gap-2 text-gray-700">
                <Clock size={16} />
                Time of Birth
              </Label>
              <Input
                id={`timeOfBirth-${index}`}
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`placeOfBirth-${index}`} className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                Place of Birth
              </Label>
              <Input
                id={`placeOfBirth-${index}`}
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                placeholder="City, State, Country"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
