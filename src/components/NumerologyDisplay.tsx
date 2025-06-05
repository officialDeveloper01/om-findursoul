
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NumerologyDisplay = ({ numerologyData, userData }) => {
  if (!numerologyData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-light text-gray-700">
            Numerology Analysis
          </CardTitle>
          <div className="space-y-1 text-gray-600 mt-2">
            <p className="font-medium text-lg">{userData?.fullName}</p>
            <p className="text-sm">
              Date of Birth: {new Date(numerologyData.dob).toLocaleDateString('en-IN')}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Life Path Number */}
          <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Life Path Number</h3>
            <div className="text-4xl font-bold text-amber-600">{numerologyData.lifePath}</div>
          </div>

          {/* Conductor Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">Conductor Number</h4>
              <div className="text-2xl font-bold text-gray-800">{numerologyData.conductor}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">Conductor Base</h4>
              <div className="text-2xl font-bold text-gray-800">{numerologyData.conductorBase}</div>
            </div>
          </div>

          {/* Conductor Series with Bottom Values */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-700 text-center">Conductor Series</h4>
            <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
              {numerologyData.conductorSeries.map((number, index) => (
                <div 
                  key={index}
                  className={`
                    p-3 text-center rounded-lg border-2 font-semibold
                    ${number === numerologyData.conductorBase 
                      ? 'bg-amber-100 border-amber-400 text-amber-800' 
                      : 'bg-white border-gray-200 text-gray-700'
                    }
                  `}
                >
                  <div className="text-lg">{number}</div>
                  {numerologyData.bottomValues && (
                    <div className="text-xs text-gray-500 mt-1">
                      /{numerologyData.bottomValues[index]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              Base number ({numerologyData.conductorBase}) is highlighted. Format: Series/Bottom
            </p>
          </div>

          {/* 13-Element Numerology Profile */}
          {numerologyData.numerologyProfile && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700 text-center">13-Element Numerology Profile</h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-13 gap-1 text-center text-sm">
                  {numerologyData.numerologyProfile.map((value, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-500">[{index}]</div>
                      <div className="font-bold text-blue-800">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <p><strong>[0]</strong> Day Number (Driver) | <strong>[1]</strong> Destiny Number (Conductor)</p>
                  <p><strong>[2-10]</strong> Frequency of digits 1-9 | <strong>[11]</strong> Non-zero digit count | <strong>[12]</strong> Total sum</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
