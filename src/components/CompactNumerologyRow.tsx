
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CompactNumerologyRowProps {
  numerologyData: any;
  userData: any;
}

export const CompactNumerologyRow = ({ numerologyData, userData }: CompactNumerologyRowProps) => {
  const driver = numerologyData.driver || 0;
  const conductor = numerologyData.conductor || 0;
  const chaldeanNumbers = numerologyData.chaldeanNumbers || {};
  
  // Calculate Soul Number from DOB
  const calculateSoulNumber = (dob: string) => {
    if (!dob) return 0;
    const day = parseInt(dob.split('-')[2]);
    let sum = day;
    while (sum > 9) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  };
  
  const soulNumber = calculateSoulNumber(userData.dateOfBirth);
  
  const items = [
    { label: 'MULAANK', value: driver, color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { label: 'BHAGYAANK', value: conductor, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { label: 'Soul Number', value: soulNumber, color: 'bg-green-100 text-green-700 border-green-300' },
    { label: 'Name', value: chaldeanNumbers.nameNumber || 0, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-3" style={{ fontFamily: 'Calibri, sans-serif' }}>
      {items.map((item, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${item.color} px-3 py-1 font-bold rounded-full flex items-center gap-1`}
        >
          <span className="font-bold">{item.label}:</span>
          <span className="font-bold">{item.value}</span>
        </Badge>
      ))}
    </div>
  );
};
