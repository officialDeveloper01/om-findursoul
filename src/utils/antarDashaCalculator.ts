
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

// --- FIXED PLANET SEQUENCE ---
const fixedSequence = [1, 2, 9, 4, 3, 8, 5, 7, 6];

const getPlanetSequence = (startPlanetNumber: number): PlanetData[] => {
  const startIndex = fixedSequence.indexOf(startPlanetNumber);
  const rotatedSequence = [
    ...fixedSequence.slice(startIndex),
    ...fixedSequence.slice(0, startIndex)
  ];
  return rotatedSequence.map(num => planetMap[num]);
};

// Add days to a date (no leap year logic)
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

// Parse date in format YYYY-MM-DD (from native input type)
const parseDate = (dateStr: string): Date => {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  return new Date(year, month, day);
};

// Parse date in format DD/MM/YYYY
const parseDateDDMMYYYY = (dateStr: string): Date => {
  const [dayStr, monthStr, yearStr] = dateStr.split('/');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);
  return new Date(year, month, day);
};

// Get planet number from name
const getPlanetNumberFromName = (planetName: string): number => {
  for (const [key, value] of Object.entries(planetMap)) {
    if (value.name === planetName) {
      return parseInt(key);
    }
  }
  return 1; // Default to SURYA
};

// Main Antar Dasha calculator
export const calculateAntarDasha = (
  dateOfBirth: string,     // Format: 'YYYY-MM-DD'
  startAge: number,
  planetNumber: number     // Clicked planet number (1–9)
) => {
  // Parse DOB and calculate start date
  const dobDate = parseDate(dateOfBirth);
  const startDate = new Date(dobDate);
  startDate.setFullYear(startDate.getFullYear() + startAge);

  // Ensure table ends exactly after 9 years (same day & month)
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 9);

  // Planet sequence (fixed and rotated)
  const planetSequence = getPlanetSequence(planetNumber);

  const antarDashaData: any[] = [];
  let currentDate = new Date(startDate);

  const totalDays = 365 * 9;
  const totalPlanetDays = planetSequence.reduce((sum, p) => sum + p.days, 0);

  for (let i = 0; i < planetSequence.length; i++) {
    const antar = planetSequence[i];
    const fromDate = new Date(currentDate);

    let toDate: Date;
    if (i === planetSequence.length - 1) {
      toDate = new Date(endDate); // End on same DD/MM after 9 years
    } else {
      const proportionalDays = Math.round((antar.days / totalPlanetDays) * totalDays);
      toDate = addDays(currentDate, proportionalDays);
    }

    antarDashaData.push({
      antar: `${antar.name}`,
      days: antar.days,
      from: formatDate(fromDate),
      to: formatDate(toDate),
      planetNumber: getPlanetNumberFromName(antar.name)
    });

    currentDate = new Date(toDate);
  }

  return antarDashaData;
};

// Calculate Pratyantar Dasha for a specific Antar Dasha period
export const calculatePratyantarDasha = (
  fromDateStr: string,     // Format: 'DD/MM/YYYY'
  toDateStr: string,       // Format: 'DD/MM/YYYY'
  startPlanetNumber: number // Planet number for this Antar Dasha
) => {
  const startDate = parseDateDDMMYYYY(fromDateStr);
  const endDate = parseDateDDMMYYYY(toDateStr);
  
  // Calculate total days for this Antar Dasha period
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get planet sequence starting from the Antar Dasha planet
  const planetSequence = getPlanetSequence(startPlanetNumber);
  
  const pratyantarData: any[] = [];
  let currentDate = new Date(startDate);
  
  const totalPlanetDays = planetSequence.reduce((sum, p) => sum + p.days, 0);

  for (let i = 0; i < planetSequence.length; i++) {
    const pratyantar = planetSequence[i];
    const fromDate = new Date(currentDate);

    let toDate: Date;
    if (i === planetSequence.length - 1) {
      toDate = new Date(endDate); // End exactly at the Antar Dasha end date
    } else {
      const proportionalDays = Math.round((pratyantar.days / totalPlanetDays) * totalDays);
      toDate = addDays(currentDate, proportionalDays);
    }

    pratyantarData.push({
      pratyantar: pratyantar.name,
      days: pratyantar.days,
      from: formatDate(fromDate),
      to: formatDate(toDate)
    });

    currentDate = new Date(toDate);
  }

  return pratyantarData;
};

export { planetMap };
