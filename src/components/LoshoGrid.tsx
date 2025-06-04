import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-black text-3xl md:text-4xl font-bold select-none">
      卐
    </div>
  );

  const gridLayout = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const renderGridCell = (digit: number, position: number) => {
    const isCenter = position === 4;
    const frequency = gridData.frequencies[digit] || 0;
    const displayValue = frequency > 0 ? String(digit).repeat(frequency) : '';

    return (
      <div
        key={position}
        className={`
          w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
          flex items-center justify-center border-2 border-black bg-white 
          text-lg md:text-xl font-bold text-center
          ${isCenter ? 'bg-gray-100' : ''}
        `}
      >
        {frequency === 0 ? '' : displayValue.split('').join(' ')}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Card className="shadow-xl border border-gray-200 bg-white rounded-xl relative overflow-visible">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl md:text-4xl font-light text-gray-800">
            Sacred Losho Grid
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
          <div className="absolute top-0 left-0 p-10">
            {renderCornerSymbol()}
          </div>
          <div className="absolute top-0 right-0 p-10">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-0 left-0 p-10">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-0 right-0 p-10">
            {renderCornerSymbol()}
          </div>

          {/* Losho Grid */}
          <div className="transform rotate-45 border-4 border-black bg-white p-4 md:p-6">
            <div className="transform -rotate-45">
              <div className="grid grid-cols-3 gap-0">
                {gridLayout.map((digit, index) => renderGridCell(digit, index))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
