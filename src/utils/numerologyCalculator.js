
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

  // Frequency of digits 1–9
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
  const day = normalized.slice(0, 2); // Get DD
  const digits = day.split('').map(Number);
  let sum = digits.reduce((acc, val) => acc + val, 0);

  // Reduce to single digit (unless master numbers)
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return sum || 0; // Fallback to 0 if undefined
};

// Conductor Number (sum of all digits in full DOB)
export const calculateConductor = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const digits = normalized.split('').map(Number);
  let sum = digits.reduce((sum, d) => sum + d, 0);

  // Reduce to single digit (unless master numbers 11, 22, 33)
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return sum || 0; // Fallback to 0 if undefined
};

// Calculate Conductor Base
export const calculateConductorBase = (conductor) => {
  return Math.max(1, 36 - conductor); // Ensure it's never 0 or negative
};

// Calculate Conductor Series (11 numbers)
export const calculateConductorSeries = (conductorBase) => {
  const series = [];
  
  // Generate 11 numbers centered around base with ±9 increments
  for (let i = -5; i <= 5; i++) {
    let value = conductorBase + (i * 9);
    
    // Ensure no zeros in the series
    while (value <= 0) {
      value += 9;
    }
    
    series.push(value);
  }
  
  return series;
};

// Calculate Bottom Values for Conductor Series
export const calculateBottomValues = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  
  // Extract day, month, year digits
  const dayDigits = normalized.slice(0, 2).split('').map(Number);
  const monthDigits = normalized.slice(2, 4).split('').map(Number);
  const yearDigits = normalized.slice(4, 8).split('').map(Number);
  
  // Calculate component sums
  const daySum = dayDigits.reduce((sum, d) => sum + d, 0);
  const monthSum = monthDigits.reduce((sum, d) => sum + d, 0);
  const yearSum = yearDigits.reduce((sum, d) => sum + d, 0);
  
  // Reduce to single digits
  const reduceSingleDigit = (num) => {
    while (num > 9) {
      num = num.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return num || 0;
  };
  
  // Calculate bottom values according to the logic
  const dayMonthSum = reduceSingleDigit(daySum + monthSum);  // For indices 0-3
  const dayOnly = reduceSingleDigit(daySum);                // For index 4
  const combined = reduceSingleDigit(dayMonthSum + dayOnly); // For index 5
  const monthYearSum = reduceSingleDigit(monthSum + yearSum); // For indices 6-10
  
  return [
    dayMonthSum, dayMonthSum, dayMonthSum, dayMonthSum, // indices 0-3
    dayOnly,                                             // index 4
    combined,                                            // index 5
    monthYearSum, monthYearSum, monthYearSum, monthYearSum, monthYearSum // indices 6-10
  ];
};

// Format date to DD/MM/YYYY
export const formatDateToIndian = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Combined calculator
export const calculateAllNumerology = (dateOfBirth) => {
  const loshuGrid = calculateLoshoGrid(dateOfBirth);
  const driver = calculateDriver(dateOfBirth);
  const conductor = calculateConductor(dateOfBirth);
  const conductorBase = calculateConductorBase(conductor);
  const conductorSeries = calculateConductorSeries(conductorBase);
  const bottomValues = calculateBottomValues(dateOfBirth);
  
  return {
    loshuGrid: loshuGrid.frequencies,
    driver: driver,
    conductor: conductor,
    conductorBase: conductorBase,
    conductorSeries: conductorSeries,
    bottomValues: bottomValues,
    formattedDate: formatDateToIndian(dateOfBirth),
    dob: dateOfBirth
  };
};
