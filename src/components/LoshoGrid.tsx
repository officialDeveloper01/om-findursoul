import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const hiddenMap = {
    11: 2, 22: 3, 33: 4, 44: 5,
    55: 6, 66: 7, 77: 6, 88: 7, 99: 8,
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

  // Calculate reduced sums from base frequency for stage 1
  const getMissingReducedSums = (sourceFreq, derivedFromFreq) => {
    const missing = {};
    for (let i = 1; i <= 9; i++) {
      const count = derivedFromFreq[i] || 0;
      if (count >= 2) {
        const repeated = Number(String(i).repeat(2));
        const reduced = String(repeated).split("").map(Number).reduce((a, b) => a + b, 0);
        if (!sourceFreq[reduced]) {
          missing[reduced] = (missing[reduced] || 0) + Math.floor(count / 2);
        }
      }
    }
    return missing;
  };

  const stage1Missing = getMissingReducedSums(baseFrequencies, baseFrequencies);
  const stage2Missing = getMissingReducedSums(fullFrequencies, fullFrequencies);

  const renderGridCell = (digit) => {
    const baseCount = baseFrequencies[digit] || 0;
    const hiddenCount = hiddenCountMap[digit] || 0;
    const stage1MinusCount = stage1Missing[digit] || 0;
    const stage2MinusCount = stage2Missing[digit] || 0;

    return (
      <div className="relative aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-2">
        {/* Main numbers */}
        {baseCount > 0 && (
          <div className="text-2xl md:text-3xl font-semibold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(baseCount)}
          </div>
        )}

        {/* Hidden numbers */}
        {hiddenCount > 0 && (
          <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full border-2 border-green-600 text-green-600 text-l font-bold">
            {String(digit).repeat(hiddenCount)}
          </div>
        )}

        {/* Red minus signs */}
        {(stage1MinusCount > 0 || stage2MinusCount > 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 pointer-events-none">
            {[...Array(stage1MinusCount)].map((_, i) => (
              <span key={`s1-${i}`} className="text-red-600 text-xl font-bold leading-none">-</span>
            ))}
            {[...Array(stage2MinusCount)].map((_, i) => (
              <span key={`s2-${i}`} className="text-red-400 text-xl font-bold leading-none">-</span>
            ))}
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
