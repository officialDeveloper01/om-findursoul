
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { TimeInput } from './TimeInput';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
  onDelete?: () => void;
  userData?: any;
  mode: 'add' | 'edit';
  isMainUser?: boolean;
}

const RELATION_OPTIONS = [
  { value: 'FATHER', label: 'Father' },
  { value: 'MOTHER', label: 'Mother' },
  { value: 'BROTHER', label: 'Brother' },
  { value: 'SISTER', label: 'Sister' },
  { value: 'UNCLE', label: 'Uncle' },
  { value: 'AUNT', label: 'Aunt' },
  { value: 'GRANDFATHER', label: 'Grandfather' },
  { value: 'GRANDMOTHER', label: 'Grandmother' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'SON', label: 'Son' },
  { value: 'DAUGHTER', label: 'Daughter' },
  { value: 'OTHER', label: 'Other' }
];

export const UserManagementModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  userData = {},
  mode,
  isMainUser = false
}: UserManagementModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    relation: '',
    ...userData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',
        relation: '',
        ...userData
      });
    }
  }, [isOpen, userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete && window.confirm('Are you sure you want to delete this family member?')) {
      try {
        await onDelete();
        onClose();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const isFormValid = formData.fullName && formData.dateOfBirth && formData.timeOfBirth && formData.placeOfBirth && (isMainUser || formData.relation);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? 'Add Family Member' : `Edit ${isMainUser ? 'Main User' : 'Family Member'}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter full name"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeOfBirth" className="flex items-center gap-2 text-gray-700">
                <Clock size={16} />
                Time of Birth
              </Label>
              <TimeInput
                value={formData.timeOfBirth}
                onChange={(value) => handleInputChange('timeOfBirth', value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfBirth" className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} />
                Place of Birth
              </Label>
              <Input
                id="placeOfBirth"
                type="text"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                placeholder="City, State, Country"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>

            {!isMainUser && (
              <div className="space-y-2">
                <Label htmlFor="relation" className="flex items-center gap-2 text-gray-700">
                  Relation
                </Label>
                <Select
                  value={formData.relation}
                  onValueChange={(value) => handleInputChange('relation', value)}
                  disabled={isSubmitting}
                >
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
            )}
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {mode === 'edit' && !isMainUser && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
