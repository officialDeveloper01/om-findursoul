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

  const frequencies = { ...gridData.frequencies }; // no driver/conductor added

  const getHiddenNumbers = () => {
    const fullFreq = { ...frequencies };
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

  const hiddenNumbers = getHiddenNumbers();

  const renderGridCell = (digit) => {
    const count = frequencies[digit] || 0;
    const hiddenCount = hiddenNumbers[digit] || 0;

    return (
      <div className="relative aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-2">
        {count > 0 && (
          <div className="text-2xl md:text-3xl font-semibold text-gray-800 flex flex-wrap justify-center">
            {String(digit).repeat(count)}
          </div>
        )}
        {hiddenCount > 0 && (
          <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full border-2 border-green-600 text-green-600 flex items-center justify-center text-l font-bold">
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

        <div className="px-6 pb-6 text-center text-sm text-gray-600 space-y-2">
          {/* Optional legend or insights can go here */}
        </div>
      </Card>
    </div>
  );
};
