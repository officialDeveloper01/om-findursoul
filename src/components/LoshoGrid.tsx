
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-blue-800 text-2xl md:text-3xl font-bold select-none">
      卐
    </div>
  );

  const renderGridCell = (digit: number) => {
    const frequency = gridData.frequencies[digit] || 0;
    
    // If frequency is 0, render empty cell
    if (frequency === 0) {
      return (
        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center"></div>
        </div>
      );
    }

    // If frequency > 0, show the digit repeated
    const displayValue = String(digit).repeat(frequency);
    return (
      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center text-red-600 text-xl md:text-2xl font-bold">
          {displayValue.split('').join(' ')}
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
          {/* Corner Swastik Symbols */}
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

          {/* Main Grid Container */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* SVG Background for geometric layout */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer diamond border */}
              <polygon 
                points="200,20 380,200 200,380 20,200" 
                fill="none" 
                stroke="#6B7280" 
                strokeWidth="2"
              />
              
              {/* Inner diamond border */}
              <polygon 
                points="200,80 320,200 200,320 80,200" 
                fill="none" 
                stroke="#374151" 
                strokeWidth="2"
              />
              
              {/* Cross lines connecting outer positions */}
              <line x1="200" y1="20" x2="200" y2="80" stroke="#6B7280" strokeWidth="1"/>
              <line x1="200" y1="320" x2="200" y2="380" stroke="#6B7280" strokeWidth="1"/>
              <line x1="20" y1="200" x2="80" y2="200" stroke="#6B7280" strokeWidth="1"/>
              <line x1="320" y1="200" x2="380" y2="200" stroke="#6B7280" strokeWidth="1"/>
              
              {/* Diagonal lines for X pattern */}
              <line x1="110" y1="110" x2="80" y2="200" stroke="#6B7280" strokeWidth="1"/>
              <line x1="290" y1="110" x2="320" y2="200" stroke="#6B7280" strokeWidth="1"/>
              <line x1="290" y1="290" x2="320" y2="200" stroke="#6B7280" strokeWidth="1"/>
              <line x1="110" y1="290" x2="80" y2="200" stroke="#6B7280" strokeWidth="1"/>
              
              {/* Additional connecting lines */}
              <line x1="110" y1="110" x2="200" y2="80" stroke="#6B7280" strokeWidth="1"/>
              <line x1="290" y1="110" x2="200" y2="80" stroke="#6B7280" strokeWidth="1"/>
              <line x1="290" y1="290" x2="200" y2="320" stroke="#6B7280" strokeWidth="1"/>
              <line x1="110" y1="290" x2="200" y2="320" stroke="#6B7280" strokeWidth="1"/>

              {/* Spiritual Line (1-5-9) */}
              <line 
                x1="200" y1="350" 
                x2="200" y2="50" 
                stroke="#8B5CF6" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                opacity="0.6"
              />
              
              {/* Creative Line (3-5-7) */}
              <line 
                x1="50" y1="200" 
                x2="350" y2="200" 
                stroke="#06B6D4" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                opacity="0.6"
              />
            </svg>

            {/* Number positions matching the geometric layout */}
            {/* Position 4 - Top Left */}
            <div className="absolute" style={{ top: '15%', left: '15%' }}>
              {renderGridCell(4)}
            </div>

            {/* Position 9 - Top Center */}
            <div className="absolute" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)' }}>
              {renderGridCell(9)}
            </div>

            {/* Position 2 - Top Right */}
            <div className="absolute" style={{ top: '15%', right: '15%' }}>
              {renderGridCell(2)}
            </div>

            {/* Position 3 - Middle Left */}
            <div className="absolute" style={{ top: '50%', left: '5%', transform: 'translateY(-50%)' }}>
              {renderGridCell(3)}
            </div>

            {/* Position 5 - Center */}
            <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {renderGridCell(5)}
            </div>

            {/* Position 7 - Middle Right */}
            <div className="absolute" style={{ top: '50%', right: '5%', transform: 'translateY(-50%)' }}>
              {renderGridCell(7)}
            </div>

            {/* Position 8 - Bottom Left */}
            <div className="absolute" style={{ bottom: '15%', left: '15%' }}>
              {renderGridCell(8)}
            </div>

            {/* Position 1 - Bottom Center */}
            <div className="absolute" style={{ bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}>
              {renderGridCell(1)}
            </div>

            {/* Position 6 - Bottom Right */}
            <div className="absolute" style={{ bottom: '15%', right: '15%' }}>
              {renderGridCell(6)}
            </div>
          </div>
        </CardContent>

        {/* Grid Legend */}
        <div className="px-6 pb-6">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>Numbers appear based on your birth date digits</p>
            <p>Empty cells indicate numbers not present in your birth date</p>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500 opacity-60" style={{borderTop: '2px dashed'}}></div>
                <span className="text-xs">Spiritual Line (1-5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-cyan-500 opacity-60" style={{borderTop: '2px dashed'}}></div>
                <span className="text-xs">Creative Line (3-5-7)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
