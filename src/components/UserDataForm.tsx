import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Phone, Plus } from 'lucide-react';
import { RelativeForm } from './RelativeForm';
import { TimeInput } from './TimeInput';

export const UserDataForm = ({ onSubmit }) => {
  const [mainFormData, setMainFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    mobileNumber: ''
  });
  
  const [relatives, setRelatives] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainInputChange = (field, value) => {
    setMainFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRelative = () => {
    setRelatives(prev => [...prev, {
      fullName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      relation: ''
    }]);
  };

  const removeRelative = (index) => {
    setRelatives(prev => prev.filter((_, i) => i !== index));
  };

  const updateRelative = (relativeData, index) => {
    setRelatives(prev => prev.map((rel, i) => i === index ? relativeData : rel));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form already submitting, ignoring...');
      return;
    }

    // Filter out incomplete relatives
    const completeRelatives = relatives.filter(rel => 
      rel.fullName && 
      rel.dateOfBirth && 
      rel.timeOfBirth && 
      rel.placeOfBirth && 
      rel.relation
    );

    // Prepare entries array with main user first
    const entries = [
      {
        ...mainFormData,
        relation: 'SELF'
      },
      ...completeRelatives
    ];

    console.log('Submitting entries:', entries);
    console.log('Complete relatives found:', completeRelatives.length);
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        phoneNumber: mainFormData.mobileNumber,
        entries
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMainFormValid = mainFormData.fullName && mainFormData.dateOfBirth && mainFormData.timeOfBirth && mainFormData.placeOfBirth && mainFormData.mobileNumber;
  const validRelativesCount = relatives.filter(rel => rel.fullName && rel.dateOfBirth && rel.timeOfBirth && rel.placeOfBirth && rel.relation).length;

  return (
    <div className="space-y-6">
      {/* Main User Form */}
      <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-light text-gray-700">
            Primary User Details
          </CardTitle>
          <p className="text-gray-500 mt-2 font-large">
            Please provide your accurate birth information for precise calculations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-700">
                  <User size={16} />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={mainFormData.fullName}
                  onChange={(e) => handleMainInputChange('fullName', e.target.value)}
                  placeholder="Enter your complete name"
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} />
                  Date of Birth (DD-MM-YYYY)
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={mainFormData.dateOfBirth}
                  onChange={(e) => handleMainInputChange('dateOfBirth', e.target.value)}
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOfBirth" className="flex items-center gap-2 text-gray-700">
                  Time of Birth
                </Label>
                <TimeInput
                  value={mainFormData.timeOfBirth}
                  onChange={(value) => handleMainInputChange('timeOfBirth', value)}
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
                  value={mainFormData.placeOfBirth}
                  onChange={(e) => handleMainInputChange('placeOfBirth', e.target.value)}
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
                  value={mainFormData.mobileNumber}
                  onChange={(e) => handleMainInputChange('mobileNumber', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Family Member Button - Only show if main form is valid */}
      

      {/* Relatives Forms */}
      {relatives.map((relative, index) => (
        <div key={index} className="max-w-2xl mx-auto">
          <RelativeForm
            onUpdate={updateRelative}
            onRemove={removeRelative}
            index={index}
            initialData={relative}
          />
        </div>
      ))}

      {isMainFormValid && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={addRelative}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
            disabled={isSubmitting}
          >
            <Plus size={16} className="mr-2" />
            Add Family Member
          </Button>
        </div>
      )}
      
      {/* Submit Button */}
      {isMainFormValid && (
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-light tracking-wide disabled:opacity-50"
                disabled={!isMainFormValid || isSubmitting}
              >
                {isSubmitting ? 'Calculating...' : `Calculate Sacred Grid${validRelativesCount > 0 ? ` (${validRelativesCount + 1} people)` : ''}`}
              </Button>
              {validRelativesCount > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Including {validRelativesCount} family member{validRelativesCount > 1 ? 's' : ''}
                </p>
              )}
              
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
