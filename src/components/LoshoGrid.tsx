
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
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

  const calculateBaseFrequencies = () => {
    const frequencies = { ...gridData.frequencies };
    const driver = userData?.numerologyData?.driver;
    const conductor = userData?.numerologyData?.conductor;

    if (driver) frequencies[driver] = (frequencies[driver] || 0) + 1;
    if (conductor) frequencies[conductor] = (frequencies[conductor] || 0) + 1;

    return frequencies;
  };

  const getHiddenNumbers = (baseFreq) => {
    const fullFreq = { ...baseFreq };
    const hiddenCountMap = {};
    const visited = new Set();
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
  };

  const calculateRedSigns = (baseFreq) => {
    const redSigns = {};
    
    // Loop through all pairs (i, j) where both have base frequency
    for (let i = 1; i <= 9; i++) {
      for (let j = 1; j <= 9; j++) {
        const countI = baseFreq[i] || 0;
        const countJ = baseFreq[j] || 0;
        
        if (countI > 0 && countJ > 0) {
          const sum = i + j;
          const reducedSum = sum > 9 ? (sum % 9 || 9) : sum;
          
          // If this reduced sum is missing in base frequency, add red sign
          if (!baseFreq[reducedSum] || baseFreq[reducedSum] === 0) {
            redSigns[reducedSum] = (redSigns[reducedSum] || 0) + 1;
          }
        }
      }
    }
    
    return redSigns;
  };

  const baseFrequencies = calculateBaseFrequencies();
  const hiddenNumbers = getHiddenNumbers(baseFrequencies);
  const redSigns = calculateRedSigns(baseFrequencies);

  const renderGridCell = (digit) => {
    const baseCount = baseFrequencies[digit] || 0;
    const hiddenCount = hiddenNumbers[digit] || 0;
    const redCount = redSigns[digit] || 0;

    return (
      <div className="relative aspect-square bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center text-center p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Grid number label */}
        <div className="absolute top-1 left-1 text-xs text-gray-400 font-medium">
          {digit}
        </div>

        {/* Main content area */}
        <div className="flex flex-col items-center justify-center space-y-1">
          {/* Base frequency display */}
          {baseCount > 0 && (
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              {baseCount}×
            </div>
          )}

          {/* Red minus signs */}
          {redCount > 0 && (
            <div className="text-red-500 font-bold text-xl">
              {Array(redCount).fill('–').join(' ')}
            </div>
          )}
        </div>

        {/* Hidden numbers in top-right */}
        {hiddenCount > 0 && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
            <span className="text-green-700 font-bold text-sm">
              {hiddenCount}
            </span>
          </div>
        )}
      </div>
    );
  };

  const gridNumbers = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-light text-blue-800">
            Lo Shu Grid
          </CardTitle>
          <div className="text-sm text-amber-600 font-medium tracking-wide mt-2">
            HEAL YOUR SOUL
          </div>
          <div className="space-y-1 text-gray-600 mt-4">
            <p className="font-medium text-lg md:text-xl">{userData.fullName}</p>
            <p className="text-sm md:text-base">
              Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}
            </p>
            <p className="text-sm md:text-base">{userData.placeOfBirth}</p>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center py-8">
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
            {gridNumbers.flat().map((digit, index) => (
              <div key={index}>{renderGridCell(digit)}</div>
            ))}
          </div>
        </CardContent>

        <div className="px-6 pb-6 text-center text-xs text-gray-500 space-y-2">
          <div className="flex justify-center items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-800 rounded"></div>
              <span>Base Frequency</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-500 rounded-full"></div>
              <span>Hidden Numbers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-500 font-bold">–</span>
              <span>Missing Pairs</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
