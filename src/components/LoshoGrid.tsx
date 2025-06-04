
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-amber-600 text-2xl font-bold select-none">
      卍
    </div>
  );

  // Losho Grid layout: 4|9|2 / 3|5|7 / 8|1|6
  const gridLayout = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const renderGridCell = (digit, position) => {
    const isCenter = position === 4; // Center position (5 in the grid)
    const frequency = gridData.frequencies[digit] || 0;
    const displayValue = frequency > 0 ? String(digit).repeat(frequency) : '';
    
    return (
      <div 
        key={position}
        className={`
          w-20 h-20 flex items-center justify-center border-2 transition-all duration-200 text-lg font-semibold
          ${isCenter 
            ? 'bg-amber-50 border-amber-400 shadow-md' 
            : 'bg-white border-gray-300 hover:bg-gray-50'
          }
          ${frequency === 0 ? 'text-gray-300' : 'text-gray-800'}
        `}
      >
        {frequency === 0 ? '-' : displayValue.split('').join(' ')}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-light text-gray-700">
            Sacred Losho Grid
          </CardTitle>
          <div className="space-y-1 text-gray-600">
            <p className="font-medium">{userData.fullName}</p>
            <p className="text-sm">Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}</p>
            <p className="text-sm">{userData.placeOfBirth}</p>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative">
            {/* Corner Symbols */}
            <div className="absolute -top-8 -left-8">
              {renderCornerSymbol()}
            </div>
            <div className="absolute -top-8 -right-8">
              {renderCornerSymbol()}
            </div>
            <div className="absolute -bottom-8 -left-8">
              {renderCornerSymbol()}
            </div>
            <div className="absolute -bottom-8 -right-8">
              {renderCornerSymbol()}
            </div>

            {/* Main 3x3 Losho Grid */}
            <div className="grid grid-cols-3 gap-1 p-8">
              {gridLayout.map((digit, index) => renderGridCell(digit, index))}
            </div>

            {/* Grid Information */}
            {/* <div className="mt-8 text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 max-w-md mx-auto">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Digit Frequencies</h4>
                  <div className="space-y-2">
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <div key={num} className="flex justify-between">
                        <span>Number {num}:</span>
                        <span className="font-medium">{String(gridData.frequencies[num] || 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Grid Layout</h4>
                  <div className="grid grid-cols-3 gap-1 text-xs max-w-24 mx-auto">
                    {gridLayout.map(num => (
                      <div key={num} className="w-6 h-6 border border-gray-300 flex items-center justify-center bg-gray-50">
                        {num}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">Traditional Losho Layout</p>
                </div>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
