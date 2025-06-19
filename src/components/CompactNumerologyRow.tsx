
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
  
  const items = [
    { label: 'Driver', value: driver, color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { label: 'Conductor', value: conductor, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { label: 'Name', value: chaldeanNumbers.nameNumber || 0, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    { label: 'Soul', value: chaldeanNumbers.soulUrgeNumber || 0, color: 'bg-green-100 text-green-700 border-green-300' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-3">
      {items.map((item, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${item.color} px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1`}
        >
          <span className="text-xs">{item.label}:</span>
          <span className="font-bold text-base">{item.value}</span>
        </Badge>
      ))}
    </div>
  );
};
