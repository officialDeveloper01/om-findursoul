
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AntarDashaTable } from './AntarDashaTable';
import { CompactNumerologyRow } from './CompactNumerologyRow';
import { calculateAntarDasha, calculatePreBirthAntarDasha, planetMap } from '@/utils/antarDashaCalculator';

export const LoshoGrid = ({ gridData, userData }) => {
  const [selectedAntarDasha, setSelectedAntarDasha] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-calibri">
      {/* User Info Table - Moved to top */}
      <Card className="shadow-xl border border-amber-200 bg-white rounded-xl mb-8">
  <CardContent className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 max-w-4xl mx-auto">

      {/* Row 1 */}
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">Name:</span>
        <span className="font-bold text-gray-800">{userData.fullName}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">Age:</span>
        <span className="font-bold text-gray-800">{calculateAge(userData.dateOfBirth)} years</span>
      </div>

      {/* Row 2 */}
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">Name Number:</span>
        <span className="font-bold text-gray-800">{numerologyData.chaldeanNumbers?.nameNumber || 0}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">MULAANK:</span>
        <span className="font-bold text-amber-700 text-lg">{numerologyData.driver || 0}</span>
      </div>

      {/* Row 3 */}
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">DOB:</span>
        <span className="font-bold text-gray-800">
          {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')}
        </span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">BHAGYAANK:</span>
        <span className="font-bold text-blue-700 text-lg">{numerologyData.conductor || 0}</span>
      </div>

      {/* Row 4 */}
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">Time:</span>
        <span className="font-bold text-gray-800">{formatTime(userData.timeOfBirth)}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-600 font-bold w-32">SOUL NUMBER:</span>
        <span className="font-bold text-green-700 text-lg">{numerologyData.chaldeanNumbers?.soulUrgeNumber || 0}</span>
      </div>

    </div>
  </CardContent>
</Card>




      {/* Main Grid Card */}
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl md:text-4xl font-bold text-blue-800">
            Complete Numerology Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Compact Numerology Row */}
          <CompactNumerologyRow numerologyData={numerologyData} userData={userData} />

          {/* Lo Shu Grid */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
              {gridNumbers.flat().map((digit, index) => (
                <div key={`grid-cell-${digit}-${index}`}>{renderGridCell(digit)}</div>
              ))}
            </div>
          </div>

          {/* Conductor Series - Clickable for Antar Dasha */}
          {conductorSeries.length > 0 && bottomValues.length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="font-bold text-gray-700">Conductor Series (Maha Dasha)</h3>
                <p className="font-bold text-gray-500">Click on any number below to view Antar Dasha table</p>
              </div>
              
              {/* Ages Row */}
              <div className="grid grid-cols-11 gap-1 mb-2">
                {conductorSeries.map((age, index) => (
                  <div key={`age-${age}-${index}`} className="text-center font-bold text-gray-600 py-1">
                    {age}
                  </div>
                ))}
              </div>
              
              {/* Conductor Numbers Row - Clickable */}
              <div className="grid grid-cols-11 gap-1">
                {bottomValues.map((number, index) => (
                  <button
                    key={`conductor-${number}-${index}`}
                    onClick={() => handleConductorClick(number, index)}
                    className="bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg py-2 text-center font-bold text-amber-800 transition-colors cursor-pointer"
                    title={`Click to view ${planetMap[number]?.name || 'Unknown'} Maha Dasha`}
                  >
                    {number}
                  </button>
                ))}
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
