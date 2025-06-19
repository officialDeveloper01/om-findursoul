
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AntarDashaTable } from './AntarDashaTable';
import { CompactNumerologyRow } from './CompactNumerologyRow';
import { calculateAntarDasha, calculatePreBirthAntarDasha, planetMap } from '@/utils/antarDashaCalculator';

export const LoshoGrid = ({ gridData, userData }) => {
  const [selectedAntarDasha, setSelectedAntarDasha] = useState(null);
  const [tableEndDates, setTableEndDates] = useState<Record<number, string>>({});

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
      
      if (antarDashaData.length > 0) {
        const lastRow = antarDashaData[antarDashaData.length - 1];
        setTableEndDates(prev => ({
          ...prev,
          [ageIndex]: lastRow.to
        }));
      }
      
      setSelectedAntarDasha({
        data: antarDashaData,
        planet: ageIndex === 0 ? tableTitle : planetName,
        startAge: ageIndex === 0 ? 0 : startAge,
        isPreBirth: ageIndex === 0,
        userData: userData
      });
    } catch (error) {
      console.error('Error calculating Antar Dasha:', error);
    }
  }, [conductorSeries, userData.dateOfBirth, tableEndDates, userData]);

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

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateSoulNumber = (dob: string) => {
    if (!dob) return 0;
    const day = parseInt(dob.split('-')[2]);
    let sum = day;
    while (sum > 9) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" style={{ fontFamily: 'Calibri, sans-serif' }}>
      {/* Updated User Profile Header */}
      <Card className="shadow-lg border border-amber-200 mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{userData.fullName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">DOB:</span>
                <span className="font-bold text-gray-800">{formatDate(userData.dateOfBirth)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">Time:</span>
                <span className="font-bold text-gray-800">{formatTime(userData.timeOfBirth)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">Age:</span>
                <span className="font-bold text-gray-800">{calculateAge(userData.dateOfBirth)} years</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">MULAANK:</span>
                <span className="font-bold text-amber-700">{numerologyData.driver || 0}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">BHAGYAANK:</span>
                <span className="font-bold text-blue-700">{numerologyData.conductor || 0}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-gray-600 font-bold">Soul Number:</span>
                <span className="font-bold text-green-700">{calculateSoulNumber(userData.dateOfBirth)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardContent className="space-y-6">
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
              {gridNumbers.flat().map((digit, index) => (
                <div key={`grid-cell-${digit}-${index}`}>{renderGridCell(digit)}</div>
              ))}
            </div>
          </div>

          {conductorSeries.length > 0 && bottomValues.length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-700">BHAGYAANK Series (Maha Dasha)</h3>
                <p className="text-gray-500 font-bold">Click on any number below to view Antar Dasha table</p>
              </div>
              
              <div className="grid grid-cols-11 gap-1 mb-2">
                {conductorSeries.map((age, index) => (
                  <div key={`age-${age}-${index}`} className="text-center font-bold text-gray-600 py-1">
                    {age}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-11 gap-1">
                {bottomValues.map((number, index) => (
                  <button
                    key={`conductor-${number}-${index}`}
                    onClick={() => handleConductorClick(number, index)}
                    className="bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg py-2 text-center md:text-lg font-bold text-amber-800 transition-colors cursor-pointer"
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

      {selectedAntarDasha && (
        <AntarDashaTable
          data={selectedAntarDasha.data}
          planet={selectedAntarDasha.planet}
          startAge={selectedAntarDasha.startAge}
          onClose={() => setSelectedAntarDasha(null)}
          isPreBirth={selectedAntarDasha.isPreBirth}
          userData={selectedAntarDasha.userData}
        />
      )}
    </div>
  );
};
