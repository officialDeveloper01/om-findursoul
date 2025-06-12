
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

  const calculateFrequencies = () => {
    const frequencies = { ...gridData.frequencies };
    const driver = userData?.numerologyData?.driver;
    const conductor = userData?.numerologyData?.conductor;

    if (driver) frequencies[driver] = (frequencies[driver] || 0) + 1;
    if (conductor) frequencies[conductor] = (frequencies[conductor] || 0) + 1;

    return frequencies;
  };

  const frequencies = calculateFrequencies();

  const getHiddenNumbers = () => {
  const fullFreq = { ...frequencies };        // Clone of original frequencies
  const hiddenCountMap = {};                  // Final hidden numbers (green)
  const visited = new Set();                  // To prevent repeat processing
  let hasNew = true;

  while (hasNew) {
    hasNew = false;

    for (let i = 1; i <= 9; i++) {
      const count = fullFreq[i] || 0;
      const repeatCount = Math.floor(count / 2);
      const repeated = Number(String(i).repeat(2)); // e.g., 22, 33

      if (repeatCount >= 1 && hiddenMap[repeated]) {
        const hidden = hiddenMap[repeated];

        // Avoid infinite loop — only process new repeats
        const key = `${i}->${hidden}`;
        if (!visited.has(key)) {
          visited.add(key);
          hiddenCountMap[hidden] = (hiddenCountMap[hidden] || 0) + repeatCount;
          fullFreq[hidden] = (fullFreq[hidden] || 0) + repeatCount;
          hasNew = true; // New hidden added, loop again
        }
      }
    }
  }

  return hiddenCountMap;
};

  const hiddenNumbers = getHiddenNumbers();

  const renderGridCell = (digit) => {
    const count = frequencies[digit] || 0;
    const hiddenCount = hiddenNumbers[digit] || 0;

    return (
      <div className="relative aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-1 sm:p-2">
        {/* Main numbers */}
        {count > 0 && (
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(count)}
          </div>
        )}

        {/* Hidden numbers shown in green circle */}
        {hiddenCount > 0 && (
          <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 px-1 sm:px-2 py-0.5 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center text-xs sm:text-sm lg:text-base font-bold">
            {String(digit).repeat(hiddenCount)}
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
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-3 sm:pb-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-blue-800">
            Heal Your Soul
          </CardTitle>
          <div className="space-y-1 text-gray-600 mt-2">
            <p className="font-medium text-sm sm:text-base md:text-lg lg:text-xl">{userData.fullName}</p>
            <p className="text-xs sm:text-sm md:text-base">
              Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}
            </p>
            <p className="text-xs sm:text-sm md:text-base">{userData.placeOfBirth}</p>
          </div>
        </CardHeader>

        <CardContent className="py-4 sm:py-8">
          {/* Two Grids Side-by-Side with Flexbox */}
          <div className="flex justify-center items-start gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {/* First Grid */}
            <div className="flex-1 max-w-[45%] sm:max-w-none">
              <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full">
                {gridNumbers.flat().map((digit, index) => (
                  <div key={`grid1-${index}`}>{renderGridCell(digit)}</div>
                ))}
              </div>
            </div>

            {/* Second Grid */}
            <div className="flex-1 max-w-[45%] sm:max-w-none">
              <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full">
                {gridNumbers.flat().map((digit, index) => (
                  <div key={`grid2-${index}`}>{renderGridCell(digit)}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <div className="px-3 sm:px-6 pb-3 sm:pb-6 text-center text-xs sm:text-sm text-gray-600 space-y-2">
          {/* Optional legend or insights can go here */}
        </div>
      </Card>
    </div>
  );
};
