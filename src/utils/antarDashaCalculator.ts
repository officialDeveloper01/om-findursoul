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

export const calculateAntarDasha = (
  dateOfBirth: string,
  startAge: number,
  planetNumber: number
) => {
  const dobDate = parseDate(dateOfBirth);
  const startDate = new Date(dobDate);
  startDate.setFullYear(startDate.getFullYear() + startAge);

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 9);

  const planetSequence = getPlanetSequence(planetNumber);
  const totalDays = 365 * 9;
  const totalPlanetDays = planetSequence.reduce((sum, p) => sum + p.days, 0);

  const antarDashaData: any[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < planetSequence.length; i++) {
    const antar = planetSequence[i];
    const fromDate = new Date(currentDate);
    let toDate: Date;

    if (i === planetSequence.length - 1) {
      toDate = new Date(endDate);
    } else {
      const proportionalDays = Math.round((antar.days / totalPlanetDays) * totalDays);
      toDate = addDays(currentDate, proportionalDays);
    }

    antarDashaData.push({
      antar: `${antar.name}`,
      days: Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)),
      from: formatDate(fromDate),
      to: formatDate(toDate),
      planetNumber: getPlanetNumberFromName(antar.name)
    });

    currentDate = new Date(toDate);
  }

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
      const newDate = subtractDays(currentDate, originalDays);

      if (newDate <= dobDate) {
        const daysTillDOB = Math.ceil((currentDate.getTime() - dobDate.getTime()) / (1000 * 60 * 60 * 24));

        antarDashaData.push({
          antar: planet.name,
          days: daysTillDOB,
          from: formatDate(dobDate),
          to: formatDate(currentDate),
          planetNumber: getPlanetNumberFromName(planet.name)
        });

        crossedDOB = true;
      } else {
        antarDashaData.push({
          antar: planet.name,
          days: originalDays,
          from: formatDate(subtractDays(currentDate, originalDays)),
          to: formatDate(currentDate),
          planetNumber: getPlanetNumberFromName(planet.name)
        });
        currentDate = subtractDays(currentDate, originalDays);
      }
    } else {
      antarDashaData.push({
        antar: planet.name,
        days: 0,
        from: '–',
        to: '–',
        planetNumber: getPlanetNumberFromName(planet.name)
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

export { planetMap };
