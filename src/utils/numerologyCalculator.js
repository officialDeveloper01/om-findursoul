// Normalize a date string to DDMMYYYY (removes separators)
export const normalizeDate = (dateStr) => {
  if (!dateStr) return '';

  const str = String(dateStr);

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(str)) {
    const [year, month, day] = str.split('-');
    return day.padStart(2, '0') + month.padStart(2, '0') + year;
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    const [day, month, year] = str.split('/');
    return day.padStart(2, '0') + month.padStart(2, '0') + year;
  } else if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(str)) {
    const [day, month, year] = str.split('-');
    return day.padStart(2, '0') + month.padStart(2, '0') + year;
  } else {
    return str.replace(/\D/g, '');
  }
};

// Losho Grid Calculator
export const calculateLoshoGrid = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const digits = normalized.split('').map(Number);

  const frequencies = {};
  for (let i = 1; i <= 9; i++) frequencies[i] = 0;
  digits.forEach(d => {
    if (d >= 1 && d <= 9) frequencies[d]++;
  });

  const grid = [
    frequencies[1], frequencies[2], frequencies[3],
    frequencies[4], frequencies[5], frequencies[6],
    frequencies[7], frequencies[8], frequencies[9]
  ];

  return {
    grid,
    frequencies,
    digits,
    originalDate: dateOfBirth
  };
};

// Driver Number (from DD only)
export const calculateDriver = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const day = normalized.slice(0, 2);
  const digits = day.split('').map(Number);
  let sum = digits.reduce((acc, val) => acc + val, 0);

  while (sum > 9) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return sum || 0;
};

// Conductor Number (sum of all digits in full DOB)
export const calculateConductor = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const digits = normalized.split('').map(Number);
  let sum = digits.reduce((sum, d) => sum + d, 0);

  while (sum > 9) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return sum || 0;
};

// Calculate Conductor Base
export const calculateConductorBase = (conductor) => {
  return Math.max(1, 36 - conductor);
};

// Calculate Conductor Series (11 numbers)
export const calculateConductorSeries = (conductorBase) => {
  const series = [];

  // Backward series (conductorBase - 9, -18, ...) until value > 0
  let backStep = conductorBase;
  while ((backStep -= 9) > 0) {
    series.unshift(backStep); // Add to beginning
  }

  // Add the base value
  series.push(conductorBase);

  // Forward series (conductorBase + 9, +18, ...) up to 11 values total
  let next = conductorBase;
  while (series.length < 11) {
    next += 9;
    series.push(next);
  }

  return series;
};

// Calculate Bottom Values
export const calculateBottomValues = (dateOfBirth, conductorSeries) => {
  console.log('Calculating bottom values for (raw input):', dateOfBirth);

  // Normalize to DD/MM/YYYY if needed
  const normalized = (() => {
    if (dateOfBirth.includes('-')) {
      const [yyyy, mm, dd] = dateOfBirth.split('-');
      return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
    }
    if (dateOfBirth.includes('/')) {
      const parts = dateOfBirth.split('/');
      if (parts[0].length === 2 && parts[2].length === 4) {
        // Assume MM/DD/YYYY
        const [mm, dd, yyyy] = parts;
        return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
      }
    }
    return dateOfBirth;
  })();

  const parts = normalized.split('/');
  if (parts.length !== 3) {
    console.error('Invalid date format. Expected DD/MM/YYYY.');
    return [];
  }

  let [day, month, year] = parts;
  day = day.padStart(2, '0');
  month = month.padStart(2, '0');

  const reduceToSingle = (num) => {
    while (num > 9) {
      num = num.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return num;
  };

  const sumDigits = (str) => str.split('').map(Number).reduce((a, b) => a + b, 0);

  const dayMonthReduced = reduceToSingle(sumDigits(day + month));
  const dayReduced = reduceToSingle(sumDigits(day));
  const monthYearReduced = reduceToSingle(sumDigits(month + year));
  const dayYearReduced = reduceToSingle(sumDigits(day + year));
  const fifthValue = reduceToSingle(dayMonthReduced + dayYearReduced);

  const bhagyaank = reduceToSingle(
    (dateOfBirth.match(/\d/g) || []).map(Number).reduce((a, b) => a + b, 0)
  );

  const bottomValues = [];

  // Apply shifting logic if bhagyaank is 9
  if (bhagyaank === 9) {
    bottomValues.push(
      dayMonthReduced,
      dayMonthReduced,
      dayMonthReduced,
      dayYearReduced, // Shifted to 4th
      fifthValue,     // Shifted to 5th
      monthYearReduced,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced
    );
  } else {
    bottomValues.push(
      dayMonthReduced,
      dayMonthReduced,
      dayMonthReduced,
      dayMonthReduced,
      dayYearReduced,
      fifthValue,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced,
      monthYearReduced
    );
  }

  console.log('Bottom values calculated:', bottomValues);
  return bottomValues;
};



// Format date to DD/MM/YYYY
export const formatDateToIndian = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Import Chaldean calculator
import { calculateChaldeanNumbers } from './chaldeanCalculator';

// Combined calculator with Chaldean numbers
export const calculateAllNumerology = (dateOfBirth, fullName = '') => {
  const loshuGrid = calculateLoshoGrid(dateOfBirth);
  const driver = calculateDriver(dateOfBirth);
  const conductor = calculateConductor(dateOfBirth);
  const conductorBase = calculateConductorBase(conductor);
  const conductorSeries = calculateConductorSeries(conductorBase);
  const bottomValues = calculateBottomValues(dateOfBirth, conductorSeries);
  const chaldeanNumbers = calculateChaldeanNumbers(fullName);

  // Create updated frequencies that include driver and conductor
  const updatedFrequencies = { ...loshuGrid.frequencies };
  
  // Add driver number to frequencies (+1)
  if (driver >= 1 && driver <= 9) {
    updatedFrequencies[driver] = (updatedFrequencies[driver] || 0) + 1;
  }
  
  // Add conductor number to frequencies (+1)
  if (conductor >= 1 && conductor <= 9) {
    updatedFrequencies[conductor] = (updatedFrequencies[conductor] || 0) + 1;
  }

  return {
    loshuGrid: updatedFrequencies, // Use updated frequencies instead of original
    driver,
    conductor,
    conductorBase,
    conductorSeries,
    bottomValues,
    chaldeanNumbers,
    formattedDate: formatDateToIndian(dateOfBirth),
    dob: dateOfBirth
  };
};
