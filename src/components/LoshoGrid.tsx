import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

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

  const calculateFrequencies = () => {
    const frequencies = { ...gridData.frequencies };
    const driver = userData?.numerologyData?.driver;
    const conductor = userData?.numerologyData?.conductor;

    if (driver) frequencies[driver] = (frequencies[driver] || 0) + 1;
    if (conductor) frequencies[conductor] = (frequencies[conductor] || 0) + 1;

    return frequencies;
  };

  const baseFrequencies = calculateFrequencies();

  const getHiddenNumbers = (inputFreq) => {
    const freq = { ...inputFreq };
    const hiddenCountMap = {};
    const visited = new Set();
    let hasNew = true;

    while (hasNew) {
      hasNew = false;
      for (let i = 1; i <= 9; i++) {
        const count = freq[i] || 0;
        const repeatCount = Math.floor(count / 2);
        const repeated = Number(String(i).repeat(2));

        if (repeatCount >= 1 && hiddenMap[repeated]) {
          const hidden = hiddenMap[repeated];
          const key = `${i}->${hidden}`;
          if (!visited.has(key)) {
            visited.add(key);
            hiddenCountMap[hidden] = (hiddenCountMap[hidden] || 0) + repeatCount;
            freq[hidden] = (freq[hidden] || 0) + repeatCount;
            hasNew = true;
          }
        }
      }
    }

    return { hiddenCountMap, fullFrequencies: freq };
  };

  const { hiddenCountMap, fullFrequencies } = getHiddenNumbers(baseFrequencies);

  // Stage 1 (without hidden)
  const stage1Minus = [];
  for (let i = 1; i <= 9; i++) {
    if (!(baseFrequencies[i] > 0)) {
      // Missing from actual digits
      const foundFromSum = Object.entries(baseFrequencies).some(([d1, c1]) => {
        return Object.entries(baseFrequencies).some(([d2, c2]) => {
          if (d1 === d2 && baseFrequencies[d1] < 2) return false;
          const sum = Number(d1) + Number(d2);
          const reduced = String(sum).split('').reduce((a, b) => a + Number(b), 0);
          return reduced === i;
        });
      });
      if (foundFromSum) stage1Minus.push(i);
    }
  }

  // Stage 2 (with hidden)
  const stage2Minus = [];
  for (let i = 1; i <= 9; i++) {
    if (!(fullFrequencies[i] > 0)) {
      const foundFromSum = Object.entries(fullFrequencies).some(([d1, c1]) => {
        return Object.entries(fullFrequencies).some(([d2, c2]) => {
          if (d1 === d2 && fullFrequencies[d1] < 2) return false;
          const sum = Number(d1) + Number(d2);
          const reduced = String(sum).split('').reduce((a, b) => a + Number(b), 0);
          return reduced === i;
        });
      });
      if (foundFromSum) stage2Minus.push(i);
    }
  }

  useEffect(() => {
    console.log('Base:', baseFrequencies);
    console.log('Hidden:', hiddenCountMap);
    console.log('Full:', fullFrequencies);
    console.log('Stage1 Minus:', stage1Minus);
    console.log('Stage2 Minus:', stage2Minus);
  }, []);

  const renderGridCell = (digit) => {
    const baseCount = baseFrequencies[digit] || 0;
    const hiddenCount = hiddenCountMap[digit] || 0;
    const isStage1Minus = stage1Minus.includes(digit);
    const isStage2Minus = stage2Minus.includes(digit);

    return (
      <div className="relative aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-2">
        {(baseCount > 0 || hiddenCount > 0) && (
          <div className="text-2xl md:text-3xl font-semibold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(baseCount)}
            {hiddenCount > 0 && (
              <span className="ml-1 text-green-600 border border-green-600 rounded-full px-2 py-0.5 text-sm font-bold">
                {String(digit).repeat(hiddenCount)}
              </span>
            )}
          </div>
        )}

        {/* Minus markers */}
        {(isStage1Minus || isStage2Minus) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 pointer-events-none">
            {isStage1Minus && <span className="text-red-600 text-xl font-bold leading-none">-</span>}
            {isStage2Minus && <span className="text-red-400 text-xl font-bold leading-none">-</span>}
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
            Heal Your Soul
          </CardTitle>
          <div className="space-y-1 text-gray-600 mt-2">
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
      </Card>
    </div>
  );
};
