import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AntarDashaTable } from './AntarDashaTable';
import { PlaneAnalysis } from './PlaneAnalysis';
import { CompactNumerologyRow } from './CompactNumerologyRow';
import { calculateAntarDasha, calculatePreBirthAntarDasha, planetMap } from '@/utils/antarDashaCalculator';

export const LoshoGrid = ({ gridData, userData }) => {
  const [selectedAntarDasha, setSelectedAntarDasha] = useState(null);
  const [showPlaneAnalysis, setShowPlaneAnalysis] = useState(false);

  const hiddenMap = {
    11: 2,
    22: 3,
    33: 4,
    44: 5,
    55: 6,
    66: 7,
    77: 6,
    88: 7,
    99: 8,
  };

  const frequencies: Record<number, number> = { ...gridData.frequencies };

  const getHiddenNumbers = useCallback(() => {
    const fullFreq = { ...frequencies };
    const hiddenCountMap: Record<number, number> = {};
    const visited = new Set<string>();
    let hasNew = true;

    while (hasNew) {
      hasNew = false;
      for (let i = 1; i <= 9; i++) {
        const count = fullFreq[i] || 0;
        const repeatCount = Math.floor(count / 2);
        const repeated = Number(String(i).repeat(2));

        if (repeatCount >= 1 && hiddenMap[repeated]) {
          const hidden = hiddenMap[repeated];
          const key = `${i}->${hidden}`;
          if (!visited.has(key)) {
            visited.add(key);
            hiddenCountMap[hidden] = (hiddenCountMap[hidden] || 0) + repeatCount;
            fullFreq[hidden] = (fullFreq[hidden] || 0) + repeatCount;
            hasNew = true;
          }
        }
      }
    }

    return hiddenCountMap;
  }, [frequencies]);

  const hiddenNumbers = getHiddenNumbers();

  const singleDigitSum = (num: number): number => {
    while (num >= 10) {
      num = num
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const gridNumbers = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  const calculateDashes = useCallback(() => {
    const dashes: Record<number, number> = {};
    const gridCells = gridNumbers.flat();
    
    for (let i = 0; i < gridCells.length; i++) {
      const digit = gridCells[i];
      const actualCount = frequencies[digit] || 0;
      const hiddenCount = hiddenNumbers[digit] || 0;

      if (actualCount > 1) {
        const total = digit * actualCount;
        const reduced = singleDigitSum(total);
        if (!frequencies[reduced]) {
          dashes[reduced] = (dashes[reduced] || 0) + 1;
        }
      }

      if (
        (actualCount > 0 || hiddenCount > 1) &&
        !(actualCount === 0 && hiddenCount === 1)
      ) {
        const total = digit * (actualCount + hiddenCount);
        const reduced = singleDigitSum(total);
        if (!frequencies[reduced] && !dashes[reduced]) {
          dashes[reduced] = 1;
        }
      }
    }

    return dashes;
  }, [frequencies, hiddenNumbers]);

  const dashes = calculateDashes();

  // Get numerology data
  const numerologyData = userData.numerologyData || {};
  const conductorSeries = numerologyData.conductorSeries || [];
  const bottomValues = numerologyData.bottomValues || [];

  const handleConductorClick = useCallback((conductorNumber: number, ageIndex: number) => {
    if (!conductorSeries[ageIndex] || !userData.dateOfBirth) return;
    
    const startAge = conductorSeries[ageIndex];
    const planetName = planetMap[conductorNumber]?.name || 'Unknown';
    
    console.log('Clicked conductor:', { conductorNumber, startAge, planetName, ageIndex });
    
    try {
      let antarDashaData;
      let tableTitle;

      if (ageIndex === 0) {
        antarDashaData = calculatePreBirthAntarDasha(
          userData.dateOfBirth,
          conductorNumber,
          startAge
        );
        tableTitle = `0 – ${startAge}`;
      } else {
        antarDashaData = calculateAntarDasha(
          userData.dateOfBirth,
          startAge,
          conductorNumber
        );
        tableTitle = planetName;
      }
      
      setSelectedAntarDasha({
        data: antarDashaData,
        planet: ageIndex === 0 ? tableTitle : planetName,
        startAge: ageIndex === 0 ? 0 : startAge,
        isPreBirth: ageIndex === 0
      });
    } catch (error) {
      console.error('Error calculating Antar Dasha:', error);
    }
  }, [conductorSeries, userData.dateOfBirth]);

  const renderGridCell = (digit: number) => {
    const count = frequencies[digit] || 0;
    const hiddenCount = hiddenNumbers[digit] || 0;
    const dashCount = dashes[digit] || 0;

    return (
      <div className="relative aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-2">
        {count > 0 && (
          <div className="text-2xl md:text-3xl font-bold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(count)}
          </div>
        )}
        {hiddenCount > 0 && (
          <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full border-2 border-green-600 text-green-600 text-xl flex items-center justify-center font-bold">
            {String(digit).repeat(hiddenCount)}
          </div>
        )}
        {dashCount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-red-600 font-extrabold text-3xl pointer-events-none">
            {"_".repeat(dashCount)}
          </div>
        )}
      </div>
    );
  };

  // Helper function to calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to format time with AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  // Helper function to format date as DD/MM/YYYY
  const formatDateDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // If showing Plane Analysis, render it instead
  if (showPlaneAnalysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 font-calibri">
        <PlaneAnalysis 
          frequencies={frequencies}
          onBack={() => setShowPlaneAnalysis(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-calibri">
      {/* User Info Table - Clean 2-column layout */}
      <Card className="shadow-xl border border-amber-200 bg-white rounded-xl mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-y-3 gap-x-8">
            {/* Row 1 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">Name:</span>
              <span className="font-bold text-gray-800">{userData.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">Age:</span>
              <span className="font-bold text-gray-800">{calculateAge(userData.dateOfBirth)} years</span>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">Name Number:</span>
              <span className="font-bold text-gray-800">{numerologyData.chaldeanNumbers?.nameNumber || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">MULAANK:</span>
              <span className="font-bold text-amber-700">{numerologyData.driver || 0}</span>
            </div>

            {/* Row 3 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">DOB:</span>
              <span className="font-bold text-gray-800">{formatDateDDMMYYYY(userData.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">BHAGYAANK:</span>
              <span className="font-bold text-blue-700">{numerologyData.conductor || 0}</span>
            </div>

            {/* Row 4 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">Time:</span>
              <span className="font-bold text-gray-800 whitespace-nowrap">{formatTime(userData.timeOfBirth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">PERSONALITY NO:</span>
              <span className="font-bold text-green-700">{numerologyData.chaldeanNumbers?.soulUrgeNumber || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Card */}
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl md:text-4xl font-bold text-blue-800">
            Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Lo Shu Grid */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
              {gridNumbers.flat().map((digit, index) => (
                <div key={`grid-cell-${digit}-${index}`}>{renderGridCell(digit)}</div>
              ))}
            </div>
          </div>

          {/* Plane Analysis Button */}
          <div className="text-center">
            <Button 
              onClick={() => setShowPlaneAnalysis(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2"
            >
              Plane Analysis
            </Button>
          </div>

          {/* Conductor Series - Clickable for Antar Dasha */}
          {conductorSeries.length > 0 && bottomValues.length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-bold text-gray-700">Conductor Series (Maha Dasha)</h3>
                <p className="font-bold text-gray-500">Click on any number below to view Antar Dasha table</p>
              </div>
              
              {/* Ages Row - Clean bordered table design */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="grid grid-cols-11 bg-gray-100 border-b border-gray-300">
                  {conductorSeries.map((age, index) => (
                    <div key={`age-${age}-${index}`} className="text-center font-bold text-gray-700 py-2 px-2 border-r border-gray-300 last:border-r-0">
                      {age}
                    </div>
                  ))}
                </div>
                
                {/* Conductor Numbers Row - Clickable with borders */}
                <div className="grid grid-cols-11">
                  {bottomValues.map((number, index) => (
                    <button
                      key={`conductor-${number}-${index}`}
                      onClick={() => handleConductorClick(number, index)}
                      className="bg-amber-50 hover:bg-amber-100 py-2 px-2 text-center font-bold text-amber-800 transition-colors cursor-pointer border-r border-gray-300 last:border-r-0"
                      title={`Click to view ${planetMap[number]?.name || 'Unknown'} Maha Dasha`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Antar Dasha Table */}
      {selectedAntarDasha && (
        <AntarDashaTable
          data={selectedAntarDasha.data}
          planet={selectedAntarDasha.planet}
          startAge={selectedAntarDasha.startAge}
          onClose={() => setSelectedAntarDasha(null)}
          isPreBirth={selectedAntarDasha.isPreBirth}
        />
      )}
    </div>
  );
};
