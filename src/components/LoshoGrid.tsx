
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-amber-600 text-2xl font-bold select-none">
      卍
    </div>
  );

  const renderGridCell = (value, position) => {
    const isCenter = position === 4; // Center position (0-indexed)
    const isEmpty = !value || value === 0;
    
    return (
      <div 
        key={position}
        className={`
          w-16 h-16 flex items-center justify-center border-2 transition-all duration-200
          ${isCenter 
            ? 'bg-amber-50 border-amber-400 shadow-md' 
            : 'bg-white border-gray-300 hover:bg-gray-50'
          }
          ${isEmpty ? 'text-gray-400' : 'text-gray-800 font-semibold'}
        `}
      >
        {isEmpty ? '-' : value}
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

            {/* Main Grid */}
            <div className="grid grid-cols-3 gap-1 p-8">
              {gridData.grid.map((value, index) => renderGridCell(value, index))}
            </div>

            {/* Grid Legend */}
            <div className="mt-8 text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 max-w-md mx-auto">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Number Frequencies</h4>
                  <div className="space-y-1">
                    {Object.entries(gridData.frequencies).map(([num, count]) => (
                      <div key={num} className="flex justify-between">
                        <span>Number {num}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Grid Positions</h4>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <div key={num} className="w-8 h-8 border border-gray-300 flex items-center justify-center">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
