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
        // Pre-birth Antar Dasha for index 0 - pass conductor value for end date calculation
        antarDashaData = calculatePreBirthAntarDasha(
          userData.dateOfBirth,
          conductorNumber,
          conductorNumber // Pass conductor value as the end year offset
        );
        tableTitle = `0 – ${conductorNumber}`;
      } else {
        // Regular post-birth Antar Dasha for other indexes
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
          <div className="text-2xl md:text-3xl font-semibold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(count)}
          </div>
        )}
        {hiddenCount > 0 && (
          <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full border-2 border-green-600 text-green-600 text-xl flex items-center justify-center text-sm font-bold">
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl md:text-4xl font-light text-blue-800">
            Complete Numerology Analysis
          </CardTitle>
          <div className="space-y-1 text-gray-600 mt-2">
            <p className="font-medium text-lg md:text-xl">{userData.fullName}</p>
            <p className="text-sm md:text-base">
              Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}
            </p>
            <p className="text-sm md:text-base">{userData.placeOfBirth}</p>
          </div>
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
                <h3 className="text-lg font-semibold text-gray-700">Conductor Series (Maha Dasha)</h3>
                <p className="text-sm text-gray-500">Click on any number below to view Antar Dasha table</p>
              </div>
              
              {/* Ages Row */}
              <div className="grid grid-cols-11 gap-1 mb-2">
                {conductorSeries.map((age, index) => (
                  <div key={`age-${age}-${index}`} className="text-center text-xs font-medium text-gray-600 py-1">
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
                    className="bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg py-2 text-center text-sm md:text-lg font-bold text-amber-800 transition-colors cursor-pointer"
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
        />
      )}
    </div>
  );
};
