import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  // Compute frequencies including driver and conductor additions
  const calculateFrequencies = () => {
    const frequencies = { ...gridData.frequencies };

    const driver = userData?.numerologyData?.driver;
    const conductor = userData?.numerologyData?.conductor;

    if (driver) frequencies[driver] = (frequencies[driver] || 0) + 1;
    if (conductor) frequencies[conductor] = (frequencies[conductor] || 0) + 1;

    return frequencies;
  };

  const frequencies = calculateFrequencies();

  const renderGridCell = (digit) => {
    const count = frequencies[digit] || 0;

    return (
      <div className="aspect-square bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center p-2">
        {count > 0 && (
          <div className="text-lg md:text-xl font-semibold text-gray-800 space-x-1">
            {[...Array(count)].map((_, idx) => (
              <span key={idx}>{digit}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Lo Shu grid layout: 4 9 2 / 3 5 7 / 8 1 6
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
          {/* <p>Grid includes birth date numbers + Driver ({userData?.numerologyData?.driver || 'N/A'}) + Conductor ({userData?.numerologyData?.conductor || 'N/A'})</p> */}
        </div>
      </Card>
    </div>
  );
};
