
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LoshoGrid = ({ gridData, userData }) => {
  const renderCornerSymbol = () => (
    <div className="text-amber-600 text-2xl md:text-3xl font-bold select-none opacity-80">
      卐
    </div>
  );

  const renderGridCell = (digit: number, showDriverConductor = false) => {
    const frequency = gridData.frequencies[digit] || 0;
    
    // Get Driver and Conductor numbers from userData if available
    const driverNumber = userData?.numerologyData?.driver || 0;
    const conductorNumber = userData?.numerologyData?.conductor || 0;
    
    // Check if this cell should show Driver/Conductor
    const shouldShowDriver = showDriverConductor && digit === driverNumber;
    const shouldShowConductor = showDriverConductor && digit === conductorNumber;
    
    // If frequency is 0, render empty cell
    if (frequency === 0) {
      return (
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border border-gray-100">
            {(shouldShowDriver || shouldShowConductor) && (
              <div className="text-xs text-gray-400 space-y-1">
                {shouldShowDriver && <div>D</div>}
                {shouldShowConductor && <div>C</div>}
              </div>
            )}
          </div>
        </div>
      );
    }

    // If frequency > 0, show the digit repeated with Driver/Conductor indicators
    const displayValue = String(digit).repeat(frequency);
    return (
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-md border border-amber-200 relative overflow-hidden">
          {/* Background subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
          
          {/* Main number display */}
          <div className="text-amber-800 text-lg md:text-xl font-bold relative z-10">
            {displayValue.split('').join(' ')}
          </div>
          
          {/* Driver/Conductor indicators */}
          {(shouldShowDriver || shouldShowConductor) && (
            <div className="absolute top-1 right-1 text-xs font-medium space-y-0.5">
              {shouldShowDriver && (
                <div className="bg-blue-500 text-white px-1 py-0.5 rounded text-xs leading-none">
                  D
                </div>
              )}
              {shouldShowConductor && (
                <div className="bg-purple-500 text-white px-1 py-0.5 rounded text-xs leading-none">
                  C
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-cream-50 to-amber-50/30 rounded-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-radial from-amber-200/30 via-transparent to-purple-200/20"></div>
        </div>
        
        <CardHeader className="text-center pb-8 relative z-10">
          <CardTitle className="text-4xl md:text-5xl font-light text-gray-800 mb-4 font-serif">
            Sacred Lo Shu Grid
          </CardTitle>
          
          {/* HEAL YOUR SOUL Slogan */}
          <div className="mb-6">
            <p className="text-lg md:text-xl font-medium text-amber-700 tracking-widest uppercase">
              ✨ Heal Your Soul ✨
            </p>
          </div>
          
          <div className="space-y-2 text-gray-700 mt-4">
            <p className="font-semibold text-xl md:text-2xl text-gray-800">{userData.fullName}</p>
            <p className="text-base md:text-lg">
              Born: {new Date(userData.dateOfBirth).toLocaleDateString('en-IN')} at {userData.timeOfBirth}
            </p>
            <p className="text-sm md:text-base text-gray-600">{userData.placeOfBirth}</p>
          </div>
          
          {/* Driver and Conductor Legend */}
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">D</div>
              <span className="text-gray-600">Driver ({userData?.numerologyData?.driver || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">C</div>
              <span className="text-gray-600">Conductor ({userData?.numerologyData?.conductor || 0})</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center items-center relative py-20">
          {/* Corner Swastik Symbols */}
          <div className="absolute top-6 left-6">
            {renderCornerSymbol()}
          </div>
          <div className="absolute top-6 right-6">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-6 left-6">
            {renderCornerSymbol()}
          </div>
          <div className="absolute bottom-6 right-6">
            {renderCornerSymbol()}
          </div>

          {/* Main Grid Container */}
          <div className="relative w-96 h-96 md:w-[480px] md:h-[480px]">
            {/* SVG Background for geometric layout */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer diamond border with gradient */}
              <defs>
                <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#d97706', stopOpacity:0.6}} />
                  <stop offset="50%" style={{stopColor:'#92400e', stopOpacity:0.8}} />
                  <stop offset="100%" style={{stopColor:'#451a03', stopOpacity:0.6}} />
                </linearGradient>
                
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer diamond border */}
              <polygon 
                points="200,20 380,200 200,380 20,200" 
                fill="none" 
                stroke="url(#borderGradient)" 
                strokeWidth="3"
                filter="url(#glow)"
              />
              
              {/* Inner diamond border */}
              <polygon 
                points="200,80 320,200 200,320 80,200" 
                fill="none" 
                stroke="#92400e" 
                strokeWidth="2"
                opacity="0.7"
              />
              
              {/* Connecting lines with gradient */}
              <line x1="200" y1="20" x2="200" y2="80" stroke="url(#borderGradient)" strokeWidth="2" opacity="0.8"/>
              <line x1="200" y1="320" x2="200" y2="380" stroke="url(#borderGradient)" strokeWidth="2" opacity="0.8"/>
              <line x1="20" y1="200" x2="80" y2="200" stroke="url(#borderGradient)" strokeWidth="2" opacity="0.8"/>
              <line x1="320" y1="200" x2="380" y2="200" stroke="url(#borderGradient)" strokeWidth="2" opacity="0.8"/>
              
              {/* Diagonal connecting lines */}
              <line x1="110" y1="110" x2="80" y2="200" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="290" y1="110" x2="320" y2="200" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="290" y1="290" x2="320" y2="200" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="110" y1="290" x2="80" y2="200" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              
              {/* Additional connecting lines */}
              <line x1="110" y1="110" x2="200" y2="80" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="290" y1="110" x2="200" y2="80" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="290" y1="290" x2="200" y2="320" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>
              <line x1="110" y1="290" x2="200" y2="320" stroke="#92400e" strokeWidth="1.5" opacity="0.6"/>

              {/* Spiritual Line (1-5-9) */}
              <line 
                x1="200" y1="350" 
                x2="200" y2="50" 
                stroke="#7c3aed" 
                strokeWidth="3" 
                strokeDasharray="8,4"
                opacity="0.4"
              />
              
              {/* Creative Line (3-5-7) */}
              <line 
                x1="50" y1="200" 
                x2="350" y2="200" 
                stroke="#0891b2" 
                strokeWidth="3" 
                strokeDasharray="8,4"
                opacity="0.4"
              />
            </svg>

            {/* Number positions with Driver/Conductor indicators */}
            {/* Position 4 - Top Left */}
            <div className="absolute" style={{ top: '12%', left: '12%' }}>
              {renderGridCell(4, true)}
            </div>

            {/* Position 9 - Top Center */}
            <div className="absolute" style={{ top: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              {renderGridCell(9, true)}
            </div>

            {/* Position 2 - Top Right */}
            <div className="absolute" style={{ top: '12%', right: '12%' }}>
              {renderGridCell(2, true)}
            </div>

            {/* Position 3 - Middle Left */}
            <div className="absolute" style={{ top: '50%', left: '2%', transform: 'translateY(-50%)' }}>
              {renderGridCell(3, true)}
            </div>

            {/* Position 5 - Center */}
            <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {renderGridCell(5, true)}
            </div>

            {/* Position 7 - Middle Right */}
            <div className="absolute" style={{ top: '50%', right: '2%', transform: 'translateY(-50%)' }}>
              {renderGridCell(7, true)}
            </div>

            {/* Position 8 - Bottom Left */}
            <div className="absolute" style={{ bottom: '12%', left: '12%' }}>
              {renderGridCell(8, true)}
            </div>

            {/* Position 1 - Bottom Center */}
            <div className="absolute" style={{ bottom: '2%', left: '50%', transform: 'translateX(-50%)' }}>
              {renderGridCell(1, true)}
            </div>

            {/* Position 6 - Bottom Right */}
            <div className="absolute" style={{ bottom: '12%', right: '12%' }}>
              {renderGridCell(6, true)}
            </div>
          </div>
        </CardContent>

        {/* Enhanced Grid Legend */}
        <div className="px-6 pb-8 relative z-10">
          <div className="text-center text-sm text-gray-600 space-y-3">
            <p className="font-medium">Numbers appear based on your birth date digits</p>
            <p className="text-xs">Empty cells indicate numbers not present in your birth date</p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-purple-500 opacity-60 rounded" style={{background: 'repeating-linear-gradient(90deg, #7c3aed 0, #7c3aed 8px, transparent 8px, transparent 12px)'}}></div>
                <span>Spiritual Line (1-5-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-1 bg-cyan-600 opacity-60 rounded" style={{background: 'repeating-linear-gradient(90deg, #0891b2 0, #0891b2 8px, transparent 8px, transparent 12px)'}}></div>
                <span>Creative Line (3-5-7)</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-amber-700 font-medium italic">
                "The sacred geometry of your birth reveals the path to healing and wisdom."
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
