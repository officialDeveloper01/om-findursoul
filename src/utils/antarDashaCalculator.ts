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

const fixedSequence = [1, 2, 9, 4, 3, 8, 5, 7, 6];

// Fixed days for Pratyantar Dasha combinations - aligned with Lo Shu sequence [1,2,9,4,3,8,5,7,6]
export const pratyantarFixedDays: Record<string, number[]> = {
  SURYA: [16, 27, 19, 24, 27, 21, 23, 19, 18],
  CHANDRA: [27, 45, 32, 41, 45, 36, 38, 32, 31],
  MANGAL: [19, 32, 23, 29, 32, 25, 27, 23, 22],
  RAHU: [24, 41, 29, 37, 41, 32, 34, 29, 28],
  GURU: [58, 69, 62, 26, 73, 22, 37, 26, 65],
  SHANI: [26, 44, 31, 40, 44, 35, 37, 31, 30],
  BUDH: [23, 39, 28, 35, 39, 31, 33, 28, 27],
  KETU: [19, 32, 23, 29, 32, 25, 27, 23, 22],
  SHUKRA: [27, 46, 33, 42, 46, 37, 39, 33, 32]
};

// Fixed days for Dainik Dasha combinations
export const dainikFixedDays: Record<string, Record<string, number[]>> = {
  GURU: {
    GURU: [4, 6, 4, 5, 6, 5, 5, 4, 4],
    CHANDRA: [6, 10, 7, 9, 10, 8, 8, 7, 7],
    MANGAL: [4, 7, 5, 6, 7, 5, 6, 5, 5],
    RAHU: [5, 9, 6, 8, 9, 7, 7, 6, 6],
    BUDH: [5, 8, 6, 7, 8, 6, 7, 6, 6],
    SHUKRA: [6, 10, 7, 9, 10, 8, 8, 7, 7],
    KETU: [4, 7, 5, 6, 7, 5, 6, 5, 5],
    SHANI: [6, 10, 7, 9, 10, 8, 8, 7, 7],
    SURYA: [4, 6, 4, 5, 6, 5, 5, 4, 4]
  },
  // ... keep existing code for other planets (would need to be added based on your data)
};

const getPlanetSequence = (startPlanetNumber: number): PlanetData[] => {
  const startIndex = fixedSequence.indexOf(startPlanetNumber);
  const rotatedSequence = [
    ...fixedSequence.slice(startIndex),
    ...fixedSequence.slice(0, startIndex)
  ];
  return rotatedSequence.map(num => planetMap[num]);
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (dateStr: string): Date => {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  return new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
};

const parseDateDDMMYYYY = (dateStr: string): Date => {
  const [dayStr, monthStr, yearStr] = dateStr.split('/');
  return new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
};

const getPlanetNumberFromName = (planetName: string): number => {
  for (const [key, value] of Object.entries(planetMap)) {
    if (value.name === planetName) return parseInt(key);
  }
  return 1;
};

const formatISTDate = (date: Date): string => {
  const [day, month, year] = date
    .toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
    .split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

export const calculateAntarDasha = (
  dateOfBirth: string,
  startAge: number,
  planetNumber: number
) => {
  const dobDate = parseDate(dateOfBirth);

  // ✅ FIX: Start from (DOB + (startAge - 9))
  const startDate = new Date(dobDate);
  startDate.setFullYear(startDate.getFullYear() + (startAge - 9));

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 9);

  const planetSequence = getPlanetSequence(planetNumber);
  const totalPlanetDays = planetSequence.reduce((sum, p) => sum + p.days, 0);
  const totalPeriodDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let currentDate = new Date(startDate);
  let accumulatedDays = 0;

  const antarDashaData = planetSequence.map((antar, i) => {
    const fromDate = new Date(currentDate);

    let days: number;
    if (i === planetSequence.length - 1) {
      // Ensure exact end date
      days = totalPeriodDays - accumulatedDays;
    } else {
      days = Math.floor((antar.days / totalPlanetDays) * totalPeriodDays);
      accumulatedDays += days;
    }

    const toDate = addDays(fromDate, days);
    currentDate = new Date(toDate);

    return {
      antar: antar.name,
      days: days,
      from: formatDate(fromDate),
      to: formatDate(toDate),
      planetNumber: getPlanetNumberFromName(antar.name),
    };
  });

  return antarDashaData;
};

export const calculatePreBirthAntarDasha = (
  dateOfBirth: string,
  planetNumber: number,
  conductorValue: number
) => {
  const dobDate = parseDate(dateOfBirth);
  const targetAgeDate = new Date(dobDate);
  targetAgeDate.setFullYear(targetAgeDate.getFullYear() + conductorValue);

  const reversedSequence = getPlanetSequence(planetNumber).reverse();
  let currentDate = new Date(targetAgeDate);
  const antarDashaData: any[] = [];

  let crossedDOB = false;

  for (let i = 0; i < reversedSequence.length; i++) {
    const planet = reversedSequence[i];
    const originalDays = planet.days;

    if (!crossedDOB) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - originalDays);

      if (newDate <= dobDate) {
        const daysTillDOB = Math.ceil(
          (currentDate.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        antarDashaData.push({
          antar: planet.name,
          days: daysTillDOB,
          from: formatISTDate(dobDate),
          to: formatISTDate(currentDate),
          planetNumber: getPlanetNumberFromName(planet.name),
        });

        crossedDOB = true;
      } else {
        antarDashaData.push({
          antar: planet.name,
          days: originalDays,
          from: formatISTDate(newDate),
          to: formatISTDate(currentDate),
          planetNumber: getPlanetNumberFromName(planet.name),
        });
        currentDate = newDate;
      }
    } else {
      antarDashaData.push({
        antar: planet.name,
        days: 0,
        from: '–',
        to: '–',
        planetNumber: getPlanetNumberFromName(planet.name),
      });
    }
  }

  return antarDashaData.reverse();
};

export const calculatePratyantarDasha = (
  fromDateStr: string,
  toDateStr: string,
  startPlanetNumber: number,
  mainPlanetName: string
) => {
  const startDate = parseDateDDMMYYYY(fromDateStr);
  const endDate = parseDateDDMMYYYY(toDateStr);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const sequence = getPlanetSequence(startPlanetNumber);
  const totalPlanetDays = sequence.reduce((sum, p) => sum + p.days, 0);

  const pratyantarData = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < sequence.length; i++) {
    const pratyantar = sequence[i];
    const fromDate = new Date(currentDate);
    let toDate: Date;

    if (i === sequence.length - 1) {
      toDate = new Date(endDate);
    } else {
      const proportionalDays = Math.round((pratyantar.days / totalPlanetDays) * totalDays);
      toDate = addDays(currentDate, proportionalDays);
    }

    const actualDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));

    pratyantarData.push({
      title: `${mainPlanetName} – ${pratyantar.name}`,
      pratyantar: pratyantar.name,
      days: actualDays,
      from: formatDate(fromDate),
      to: formatDate(toDate),
      planetNumber: getPlanetNumberFromName(pratyantar.name)
    });

    currentDate = new Date(toDate);
  }

  return pratyantarData;
};

export const calculateDainikDasha = (
  fromDateStr: string,
  toDateStr: string,
  startPlanetNumber: number,
  mainPlanetName: string,
  antarPlanetName: string,
  pratyantarPlanetName: string
) => {
  const startDate = parseDateDDMMYYYY(fromDateStr);
  const endDate = parseDateDDMMYYYY(toDateStr);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const sequence = getPlanetSequence(startPlanetNumber);
  const totalPlanetDays = sequence.reduce((sum, p) => sum + p.days, 0);

  const dainikData = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < sequence.length; i++) {
    const dainik = sequence[i];
    const fromDate = new Date(currentDate);
    let toDate: Date;

    if (i === sequence.length - 1) {
      toDate = new Date(endDate);
    } else {
      const proportionalDays = (dainik.days / totalPlanetDays) * totalDays;
      toDate = addDays(currentDate, Math.round(proportionalDays));
    }

    const actualDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);

    dainikData.push({
      title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
      dainik: dainik.name,
      days: Math.round(actualDays * 100) / 100,
      from: formatDate(fromDate),
      to: formatDate(toDate)
    });

    currentDate = new Date(toDate);
  }

  return dainikData;
};

export const calculatePreBirthPratyantarDasha = (
  fromDateStr: string,
  toDateStr: string,
  startPlanetNumber: number,
  mainPlanetName: string
) => {
  // Handle dash periods - return all dashes if invalid dates
  if (fromDateStr === '–' || toDateStr === '–') {
    const sequence = getPlanetSequence(startPlanetNumber);
    return sequence.map((pratyantar) => ({
      title: `${mainPlanetName} – ${pratyantar.name}`,
      pratyantar: pratyantar.name,
      days: 0,
      from: '–',
      to: '–',
      planetNumber: getPlanetNumberFromName(pratyantar.name)
    }));
  }

  const startDate = parseDateDDMMYYYY(fromDateStr);
  const endDate = parseDateDDMMYYYY(toDateStr);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (totalDays <= 0) {
    const sequence = getPlanetSequence(startPlanetNumber);
    return sequence.map((pratyantar) => ({
      title: `${mainPlanetName} – ${pratyantar.name}`,
      pratyantar: pratyantar.name,
      days: 0,
      from: '–',
      to: '–',
      planetNumber: getPlanetNumberFromName(pratyantar.name)
    }));
  }

  const sequence = getPlanetSequence(startPlanetNumber);
  const fixedDaysForMainPlanet = pratyantarFixedDays[mainPlanetName];

  if (!Array.isArray(fixedDaysForMainPlanet) || fixedDaysForMainPlanet.length !== 9) {
    console.error('Missing or invalid fixed days array for:', mainPlanetName);
    return sequence.map((pratyantar) => ({
      title: `${mainPlanetName} – ${pratyantar.name}`,
      pratyantar: pratyantar.name,
      days: 0,
      from: '–',
      to: '–',
      planetNumber: getPlanetNumberFromName(pratyantar.name)
    }));
  }

  // Calculate scaling factor
  const totalFixedDays = fixedDaysForMainPlanet.reduce((sum, days) => sum + days, 0);
  const scaleFactor = totalDays / totalFixedDays;

  const pratyantarData = [];
  let currentEndDate = new Date(endDate);
  let remainingDays = totalDays;

  // Process sequence in reverse order
  for (let i = sequence.length - 1; i >= 0; i--) {
    const pratyantar = sequence[i];
    const fixedDays = fixedDaysForMainPlanet[i] || 0;
    const scaledDays = Math.round(fixedDays * scaleFactor);

    if (remainingDays >= scaledDays && remainingDays > 0) {
      // This period fits within our available timeframe
      const fromDate = subtractDays(currentEndDate, scaledDays);
      
      pratyantarData.unshift({
        title: `${mainPlanetName} – ${pratyantar.name}`,
        pratyantar: pratyantar.name,
        days: scaledDays,
        from: formatDate(fromDate),
        to: formatDate(currentEndDate),
        planetNumber: getPlanetNumberFromName(pratyantar.name)
      });
      
      currentEndDate = new Date(fromDate);
      remainingDays -= scaledDays;
    } else {
      // This period doesn't fit - show dashes
      pratyantarData.unshift({
        title: `${mainPlanetName} – ${pratyantar.name}`,
        pratyantar: pratyantar.name,
        days: 0,
        from: '–',
        to: '–',
        planetNumber: getPlanetNumberFromName(pratyantar.name)
      });
    }
  }

  return pratyantarData;
};

export const calculatePreBirthDainikDasha = (
  fromDateStr: string,
  toDateStr: string,
  startPlanetNumber: number,
  mainPlanetName: string,
  antarPlanetName: string,
  pratyantarPlanetName: string
) => {
  const sequence = getPlanetSequence(startPlanetNumber);
  
  // Handle dash periods or invalid dates
  if (fromDateStr === '–' || toDateStr === '–') {
    return sequence.map((dainik) => ({
      title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
      dainik: dainik.name,
      days: 0,
      from: '–',
      to: '–'
    }));
  }

  const startDate = parseDateDDMMYYYY(fromDateStr);
  const endDate = parseDateDDMMYYYY(toDateStr);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) {
    return sequence.map((dainik) => ({
      title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
      dainik: dainik.name,
      days: 0,
      from: '–',
      to: '–'
    }));
  }

  // Get fixed days for this combination
  const fixedDaysForCombo = dainikFixedDays[mainPlanetName]?.[antarPlanetName];
  
  if (!Array.isArray(fixedDaysForCombo) || fixedDaysForCombo.length !== 9) {
    // Fallback to proportional calculation if fixed days not available
    const totalPlanetDays = sequence.reduce((sum, p) => sum + p.days, 0);
    const dainikData = [];
    let currentEndDate = new Date(endDate);
    let remainingDays = totalDays;

    for (let i = sequence.length - 1; i >= 0; i--) {
      const dainik = sequence[i];
      const proportionalDays = Math.round((dainik.days / totalPlanetDays) * totalDays);
      
      if (remainingDays >= proportionalDays && remainingDays > 0) {
        const fromDate = subtractDays(currentEndDate, proportionalDays);
        
        dainikData.unshift({
          title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
          dainik: dainik.name,
          days: Math.round(proportionalDays * 100) / 100,
          from: formatDate(fromDate),
          to: formatDate(currentEndDate)
        });
        
        currentEndDate = new Date(fromDate);
        remainingDays -= proportionalDays;
      } else {
        dainikData.unshift({
          title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
          dainik: dainik.name,
          days: 0,
          from: '–',
          to: '–'
        });
      }
    }

    return dainikData;
  }

  // Use fixed days calculation
  const totalFixedDays = fixedDaysForCombo.reduce((sum, days) => sum + days, 0);
  const scaleFactor = totalDays / totalFixedDays;

  const dainikData = [];
  let currentEndDate = new Date(endDate);
  let remainingDays = totalDays;

  for (let i = sequence.length - 1; i >= 0; i--) {
    const dainik = sequence[i];
    const fixedDays = fixedDaysForCombo[i] || 0;
    const scaledDays = Math.round(fixedDays * scaleFactor * 100) / 100;
    
    if (remainingDays >= scaledDays && remainingDays > 0) {
      const fromDate = subtractDays(currentEndDate, Math.round(scaledDays));
      
      dainikData.unshift({
        title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
        dainik: dainik.name,
        days: scaledDays,
        from: formatDate(fromDate),
        to: formatDate(currentEndDate)
      });
      
      currentEndDate = new Date(fromDate);
      remainingDays -= scaledDays;
    } else {
      dainikData.unshift({
        title: `${mainPlanetName} – ${antarPlanetName} – ${pratyantarPlanetName} – ${dainik.name}`,
        dainik: dainik.name,
        days: 0,
        from: '–',
        to: '–'
      });
    }
  }

  return dainikData;
};

export { planetMap };
