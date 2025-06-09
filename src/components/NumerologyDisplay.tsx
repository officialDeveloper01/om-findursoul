
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
          {/* Driver Number */}
          <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Driver Number</h3>
            <div className="text-4xl font-bold text-amber-600">{numerologyData.driver || 0}</div>
          </div>

          {/* Conductor Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">Conductor Number</h4>
              <div className="text-2xl font-bold text-gray-800">{numerologyData.conductor || 0}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-2">Conductor Base</h4>
              <div className="text-2xl font-bold text-gray-800">{numerologyData.conductorBase || 0}</div>
            </div>
          </div>

          {/* Chaldean Numbers */}
          {numerologyData.chaldeanNumbers && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700 text-center">Chaldean Name Numerology</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Name Number</h5>
                  <div className="text-2xl font-bold text-blue-600">{numerologyData.chaldeanNumbers.nameNumber || 0}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Soul Urge</h5>
                  <div className="text-2xl font-bold text-purple-600">{numerologyData.chaldeanNumbers.soulUrgeNumber || 0}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Personality</h5>
                  <div className="text-2xl font-bold text-green-600">{numerologyData.chaldeanNumbers.personalityNumber || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Conductor Series with Bottom Values */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-700 text-center">Conductor Series</h4>
            
            {/* Top row - Conductor numbers */}
            <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
              {(numerologyData.conductorSeries || []).map((number, index) => (
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
                  <div className="text-lg">{number || 0}</div>
                </div>
              ))}
            </div>
            
            {/* Bottom row - Bottom values */}
            {numerologyData.bottomValues && (
              <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
                {numerologyData.bottomValues.map((bottomValue, index) => (
                  <div 
                    key={index}
                    className="p-2 text-center rounded-md border bg-gray-50 border-gray-300 text-gray-600 shadow-sm"
                  >
                    <div className="text-sm font-medium">{bottomValue || 0}</div>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-sm text-gray-500 text-center">
              Base number ({numerologyData.conductorBase || 0}) is highlighted. Bottom values shown below each conductor number.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
