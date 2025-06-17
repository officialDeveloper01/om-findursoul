import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, User, MapPin, Clock } from 'lucide-react';
import { NumerologyDisplay } from './NumerologyDisplay';
import { AntarDashaTable } from './AntarDashaTable';
import { PreBirthAntarDashaTable } from './PreBirthAntarDashaTable';
import { calculateAntarDasha } from '@/utils/antarDashaCalculator';

interface LoshoGridProps {
  gridData: {
    frequencies: Record<number, number>;
    grid: number[];
    originalDate: string;
    digits: number[];
  };
  userData: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    numerologyData: any;
  };
}

export const LoshoGrid = ({ gridData, userData }: LoshoGridProps) => {
  const [selectedDasha, setSelectedDasha] = useState(null);
  const [preBirthDasha, setPreBirthDasha] = useState(null);

  const formatDate = (date: string) => {
    try {
      const jsDate = new Date(date);
      const day = jsDate.getDate().toString().padStart(2, '0');
      const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
      const year = jsDate.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const gridNumberMap = {
    1: { row: 0, col: 0 },
    2: { row: 0, col: 1 },
    3: { row: 0, col: 2 },
    4: { row: 1, col: 0 },
    5: { row: 1, col: 1 },
    6: { row: 1, col: 2 },
    7: { row: 2, col: 0 },
    8: { row: 2, col: 1 },
    9: { row: 2, col: 2 },
  };

  const missingNumbers = Object.keys(gridData.frequencies)
    .map(Number)
    .filter(num => gridData.frequencies[num] === 0);

  const handleConductorClick = (conductorValue, index, conductorSeries) => {
    console.log('Conductor clicked:', conductorValue, 'at index:', index);
    
    // Only handle clicks on the first conductor (index 0) for now
    if (index === 0) {
      const title = `0 – ${conductorValue}`;
      console.log('Pre-birth Dasha title:', title);
      
      setPreBirthDasha({
        conductorValue,
        title,
        dateOfBirth: userData.dateOfBirth,
        index
      });
      
      // Close regular dasha if open
      setSelectedDasha(null);
    }
  };

  const handleDashaClick = (planetNumber, planetName, startAge) => {
    const antarDashaData = calculateAntarDasha(userData.dateOfBirth, startAge, planetNumber);
    setSelectedDasha({
      data: antarDashaData,
      planet: planetName,
      startAge: startAge
    });
    setPreBirthDasha(null);
  };

  const handleCloseDasha = () => {
    setSelectedDasha(null);
  };

  const handleClosePreBirthDasha = () => {
    setPreBirthDasha(null);
  };

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
            <User size={20} />
            {userData.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} className="text-blue-500" />
            Date of Birth: {formatDate(userData.dateOfBirth)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} className="text-blue-500" />
            Time of Birth: {userData.timeOfBirth || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-blue-500" />
            Place of Birth: {userData.placeOfBirth || 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* Losho Grid Card */}
      <Card className="shadow-lg border border-amber-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-amber-700">Losho Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <div key={number} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold text-lg">
                  {number}
                </div>
                <span className="text-sm text-gray-500 mt-1">
                  {gridData.frequencies[number]}
                </span>
              </div>
            ))}
          </div>
          {missingNumbers.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-red-500">
                Missing Numbers: {missingNumbers.join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Conductor Series Card */}
      <Card className="shadow-lg border border-purple-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
            <Sparkles size={20} />
            Conductor Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-11 gap-2">
            {userData.numerologyData.conductorSeries.map((conductor, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer hover:bg-purple-50 p-2 rounded transition-colors"
                onClick={() => handleConductorClick(conductor, index, userData.numerologyData.conductorSeries)}
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold text-sm mb-1">
                  {conductor}
                </div>
                <span className="text-xs text-purple-600">{userData.numerologyData.bottomValues[index]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Numerology Display */}
      <NumerologyDisplay numerologyData={userData.numerologyData} />

      {/* Planet Buttons Grid */}
      <Card className="shadow-lg border border-green-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-green-700">Antar Dasha</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(1, 'SURYA', 0)}>
            Surya (Sun)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(2, 'CHANDRA', 1)}>
            Chandra (Moon)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(9, 'MANGAL', 2)}>
            Mangal (Mars)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(4, 'RAHU', 3)}>
            Rahu
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(3, 'GURU', 4)}>
            Guru (Jupiter)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(8, 'SHANI', 5)}>
            Shani (Saturn)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(5, 'BUDH', 6)}>
            Budh (Mercury)
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(7, 'KETU', 7)}>
            Ketu
          </Button>
          <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleDashaClick(6, 'SHUKRA', 8)}>
            Shukra (Venus)
          </Button>
        </CardContent>
      </Card>

      {/* Pre-birth Antar Dasha Table */}
      {preBirthDasha && (
        <PreBirthAntarDashaTable
          conductorValue={preBirthDasha.conductorValue}
          title={preBirthDasha.title}
          dateOfBirth={preBirthDasha.dateOfBirth}
          onClose={handleClosePreBirthDasha}
        />
      )}

      {/* Regular Antar Dasha Table */}
      {selectedDasha && (
        <AntarDashaTable
          data={selectedDasha.data}
          planet={selectedDasha.planet}
          startAge={selectedDasha.startAge}
          onClose={handleCloseDasha}
        />
      )}
    </div>
  );
};
