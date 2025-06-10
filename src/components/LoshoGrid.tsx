
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  // Calculate frequencies including driver and conductor
  const calculateFrequencies = () => {
    const frequencies = { ...gridData.frequencies };
    
    // Add driver and conductor numbers one extra time
    if (userData?.numerologyData?.driver) {
      const driver = userData.numerologyData.driver;
      frequencies[driver] = (frequencies[driver] || 0) + 1;
    }
    
    if (userData?.numerologyData?.conductor) {
      const conductor = userData.numerologyData.conductor;
      frequencies[conductor] = (frequencies[conductor] || 0) + 1;
    }
    
    return frequencies;
  };

  const frequencies = calculateFrequencies();

  const renderGridCell = (digit: number) => {
    const frequency = frequencies[digit] || 0;
    
    return (
      <div className="aspect-square bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center p-4">
        <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {digit}
        </div>
        <div className="text-lg md:text-xl text-gray-600">
          {frequency > 0 ? `${frequency}×` : '0×'}
        </div>
      </div>
    );
  };

  // 3x3 grid layout (positions 4,9,2 / 3,5,7 / 8,1,6)
  const gridNumbers = [
    [4, 9, 2],
    [3, 5, 7], 
    [8, 1, 6]
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-light text-gray-800">
            Lo Shu Grid
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
          {/* 3x3 Grid Layout */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
            {gridNumbers.flat().map((number, index) => (
              <div key={index}>
                {renderGridCell(number)}
              </div>
            ))}
          </div>
        </CardContent>

        {/* Grid Legend */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>Numbers appear based on your birth date digits plus Driver & Conductor</p>
            <p>Frequencies include: Original birth date + Driver ({userData?.numerologyData?.driver || 'N/A'}) + Conductor ({userData?.numerologyData?.conductor || 'N/A'})</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
