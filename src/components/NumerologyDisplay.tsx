
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

          {/* Chaldean Numbers - Removed Personality Number */}
          {numerologyData.chaldeanNumbers && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700 text-center">Chaldean Name Numerology</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Name Number</h5>
                  <div className="text-2xl font-bold text-blue-600">{numerologyData.chaldeanNumbers.nameNumber || 0}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Soul Urge</h5>
                  <div className="text-2xl font-bold text-purple-600">{numerologyData.chaldeanNumbers.soulUrgeNumber || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* Conductor Series with Responsive Layout */}
        </CardContent>
      </Card>
    </div>
  );
};
