
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, User, Phone } from 'lucide-react';

export const UserDataForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    mobileNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form already submitting, ignoring...');
      return;
    }

    console.log('Submitting form data:', formData);
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName && formData.dateOfBirth && formData.timeOfBirth && formData.placeOfBirth && formData.mobileNumber;

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-light text-gray-700">
          Birth Details
        </CardTitle>
        <p className="text-gray-500 mt-2 font-large">
          Please provide your accurate birth information for precise calculations
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700 fontsize-25">
                <User size={16} />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your complete name"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-gray-700 fontsize-25">
                <Calendar size={16} />
                Date of Birth (DD-MM-YYYY)
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
              <Label htmlFor="timeOfBirth" className="flex items-center gap-2 text-gray-700 fontsize-25">
                <Clock size={16} />
                Time of Birth
              </Label>
              <Input
                id="timeOfBirth"
                type="time"
                value={formData.timeOfBirth}
                onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfBirth" className="flex items-center gap-2 text-gray-700 fontsize-25">
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

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-light tracking-wide disabled:opacity-50"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Calculating...' : 'Calculate Sacred Grid'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
