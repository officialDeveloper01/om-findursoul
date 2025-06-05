
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-blue-800 text-3xl md:text-4xl font-bold select-none">
      卐
    </div>
  );

  const renderGridCell = (digit: number, hasFrequency: boolean) => {
    const frequency = gridData.frequencies[digit] || 0;
    const displayValue = frequency > 0 ? String(digit).repeat(frequency) : '';

    return (
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        <div className={`
          w-full h-full flex items-center justify-center
          text-red-600 text-2xl md:text-3xl font-bold
          ${hasFrequency ? '' : 'opacity-30'}
        `}>
          {frequency === 0 ? digit : displayValue.split('').join(' ')}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl relative overflow-visible">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-light text-gray-800">
            Sacred Lo Shu Grid
          </CardTitle>
          <div className="space-y-1 text-gray-600 mt-2">
            <p className="font-medium text-lg md:text-xl">{userData.fullName}</p>
            <p className="text-sm md:text-base">
              Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}
            </p>
            <p className="text-sm md:text-base">{userData.placeOfBirth}</p>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center relative py-16">
          {/* Swastik Corner Symbols */}
          <div className="absolute top-4 left-4">
            {renderCornerSymbol()}
          </div>
          <div className="absolute top-4 right-4">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-4 left-4">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-4 right-4">
            {renderCornerSymbol()}
          </div>

          {/* Lo Shu Grid in Diamond Layout */}
          <div className="relative">
            {/* Outer diamond border */}
            <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-gray-400 transform rotate-45 bg-gray-50"></div>
            
            {/* Inner diamond border */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 md:w-40 md:h-40 border-2 border-gray-800 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white"></div>

            {/* Grid Numbers positioned as per image */}
            {/* Top: 9 */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              {renderGridCell(9, gridData.frequencies[9] > 0)}
            </div>

            {/* Top row: 4, 2 */}
            <div className="absolute top-16 left-8">
              {renderGridCell(4, gridData.frequencies[4] > 0)}
            </div>
            <div className="absolute top-16 right-8">
              {renderGridCell(2, gridData.frequencies[2] > 0)}
            </div>

            {/* Middle row: 3, 5, 7 */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              {renderGridCell(3, gridData.frequencies[3] > 0)}
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {renderGridCell(5, gridData.frequencies[5] > 0)}
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              {renderGridCell(7, gridData.frequencies[7] > 0)}
            </div>

            {/* Bottom row: 8, 6 */}
            <div className="absolute bottom-16 left-8">
              {renderGridCell(8, gridData.frequencies[8] > 0)}
            </div>
            <div className="absolute bottom-16 right-8">
              {renderGridCell(6, gridData.frequencies[6] > 0)}
            </div>

            {/* Bottom: 1 */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              {renderGridCell(1, gridData.frequencies[1] > 0)}
            </div>
          </div>
        </CardContent>

        {/* Grid Legend */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-gray-600">
            <p>Numbers appear based on your birth date digits</p>
            <p>Repeated digits are shown multiple times</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
