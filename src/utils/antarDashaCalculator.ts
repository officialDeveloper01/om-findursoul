
interface PlanetData {
  name: string;
  days: number;
}

const planetMap: Record<number, PlanetData> = {
  1: { name: 'SURYA', days: 164 },
  2: { name: 'CHANDRA', days: 274 },
  3: { name: 'GURU', days: 438 },
  4: { name: 'RAHU', days: 493 },
  5: { name: 'BUDH', days: 465 },
  6: { name: 'SHUKRA', days: 547 },
  7: { name: 'KETU', days: 192 },
  8: { name: 'SHANI', days: 520 },
  9: { name: 'MANGAL', days: 192 }
};

// Get planet sequence starting from a specific planet number
const getPlanetSequence = (startPlanetNumber: number): PlanetData[] => {
  const sequence: PlanetData[] = [];
  let currentNumber = startPlanetNumber;
  
  for (let i = 0; i < 9; i++) {
    sequence.push(planetMap[currentNumber]);
    currentNumber = currentNumber === 9 ? 1 : currentNumber + 1;
  }
  
  return sequence;
};

// Add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Format date to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Parse DD/MM/YYYY date string
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const calculateAntarDasha = (
  dateOfBirth: string,
  startAge: number,
  planetNumber: number
) => {
  console.log('Calculating Antar Dasha for:', { dateOfBirth, startAge, planetNumber });
  
  // Parse DOB and calculate start date
  const dobDate = parseDate(dateOfBirth);
  const startDate = new Date(dobDate);
  startDate.setFullYear(startDate.getFullYear() + startAge);
  
  // Calculate end date (9 years later)
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 9);
  
  console.log('Start date:', startDate, 'End date:', endDate);
  
  // Get planet sequence starting from the clicked planet
  const planetSequence = getPlanetSequence(planetNumber);
  
  const antarDashaData = [];
  let currentDate = new Date(startDate);
  
  // Calculate total days for proper distribution
  const totalDaysInPeriod = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPlanetDays = planetSequence.reduce((sum, planet) => sum + planet.days, 0);
  
  for (let i = 0; i < planetSequence.length; i++) {
    const planet = planetSequence[i];
    const fromDate = new Date(currentDate);
    
    let toDate: Date;
    if (i === planetSequence.length - 1) {
      // Last entry - ensure it ends exactly on the 9-year mark
      toDate = new Date(endDate);
    } else {
      // Scale the days proportionally to fit exactly in 9 years
      const scaledDays = Math.round((planet.days / totalPlanetDays) * totalDaysInPeriod);
      toDate = addDays(currentDate, scaledDays);
    }
    
    antarDashaData.push({
      antar: planet.name,
      days: planet.days,
      from: formatDate(fromDate),
      to: formatDate(toDate)
    });
    
    currentDate = new Date(toDate);
  }
  
  console.log('Generated Antar Dasha data:', antarDashaData);
  return antarDashaData;
};

export { planetMap };
