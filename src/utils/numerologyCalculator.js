// Utility: Normalize any input date string to DD/MM/YYYY
const normalizeDateDDMMYYYY = (dateStr) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    // ISO format YYYY-MM-DD -> DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  // Assume already DD/MM/YYYY or similar with slashes or dashes
  // Replace dashes with slashes for uniformity
  if (dateStr.includes('-')) {
    return dateStr.replace(/-/g, '/');
  }
  return dateStr;
};

// Reduce any number to a single digit unless it's master number 11, 22, or 33
const reduceToSingle = (num) => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return num;
};

// Calculate Life Path Number
export const calculateLifePath = (dateOfBirth) => {
  console.log('Calculating Life Path for date:', dateOfBirth);
  
  const normalizedDOB = normalizeDateDDMMYYYY(dateOfBirth);
  const digits = normalizedDOB.replace(/\D/g, '').split('').map(Number);
  
  console.log('Extracted digits for Life Path:', digits);
  
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  console.log('Initial sum:', sum);
  
  sum = reduceToSingle(sum);
  console.log('Final Life Path Number:', sum);
  
  return sum;
};

// Conductor number is same as Life Path
export const calculateConductor = (lifePath) => lifePath;

// Calculate conductor base number = 36 - conductor
export const calculateConductorBase = (conductor) => 36 - conductor;

// Generate conductor series: 11 numbers around conductor base stepping by 9
export const calculateConductorSeries = (conductorBase) => {
  console.log('Calculating Conductor Series for base:', conductorBase);
  
  const series = [];
  
  // Downward numbers by subtracting 9 until > 0
  let temp = conductorBase - 9;
  const downwardNumbers = [];
  while (temp > 0) {
    downwardNumbers.unshift(temp);
    temp -= 9;
  }
  
  series.push(...downwardNumbers);
  series.push(conductorBase);
  
  // Upward numbers by adding 9 until length 11
  temp = conductorBase + 9;
  while (series.length < 11) {
    series.push(temp);
    temp += 9;
  }
  
  console.log('Generated Conductor Series:', series);
  return series.slice(0, 11);
};

// Calculate Bottom Values Array (length 11)
export const calculateBottomValues = (dateOfBirth, conductorSeries) => {
  console.log('Original date input:', dateOfBirth);
  
  const normalizedDOB = normalizeDateDDMMYYYY(dateOfBirth);
  console.log('Normalized date:', normalizedDOB);
  
  const [day, month, year] = normalizedDOB.split('/');
  
  // Helper to reduce a number to a single digit
  const reduceSimple = (num) => {
    while (num > 9) {
      num = num
        .toString()
        .split('')
        .map(Number)
        .reduce((a, b) => a + b, 0);
    }
    return num;
  };
  
  // day+month reduced value (used for indexes 0-3)
  const dayMonthSum = (day + month)
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
  const dayMonthReduced = reduceSimple(dayMonthSum);
  
  // day reduced value (index 4)
  const daySum = day
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
  const dayReduced = reduceSimple(daySum);
  
  // month+year reduced value (indexes 6-10)
  const monthYearSum = (month + year)
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
  const monthYearReduced = reduceSimple(monthYearSum);
  
  // index 5 is sum of dayMonthReduced + dayReduced reduced
  const fifthValue = reduceSimple(dayMonthReduced + dayReduced);
  
  // Build bottom values array with 11 values
  // conductorSeries parameter can be used if needed, currently not used here
  const bottomValues = [
    dayMonthReduced, dayMonthReduced, dayMonthReduced, dayMonthReduced, // 0-3
    dayReduced,                                                      // 4
    fifthValue,                                                     // 5
    monthYearReduced, monthYearReduced, monthYearReduced, monthYearReduced, monthYearReduced // 6-10
  ];
  
  console.log('Calculated bottom values:', bottomValues);
  return bottomValues;
};

// Calculate Loshu Grid frequencies for digits 1-9
export const calculateLoshuGrid = (dateOfBirth) => {
  console.log('Calculating Loshu Grid for date:', dateOfBirth);
  
  const normalizedDOB = normalizeDateDDMMYYYY(dateOfBirth);
  // Remove non-digits, then split digits, filter out zeros
  const digits = normalizedDOB.replace(/\D/g, '').split('').map(Number).filter(d => d !== 0);
  
  console.log('Non-zero digits for Loshu Grid:', digits);
  
  const frequencies = {};
  for (let i = 1; i <= 9; i++) {
    frequencies[i] = digits.filter(d => d === i).length;
  }
  
  console.log('Digit frequencies:', frequencies);
  return frequencies;
};

// Main function to calculate all numerology values at once
export const calculateAllNumerology = (dateOfBirth) => {
  const lifePath = calculateLifePath(dateOfBirth);
  const conductor = calculateConductor(lifePath);
  const conductorBase = calculateConductorBase(conductor);
  const conductorSeries = calculateConductorSeries(conductorBase);
  const bottomValues = calculateBottomValues(dateOfBirth, conductorSeries);
  const loshuGrid = calculateLoshuGrid(dateOfBirth);
  
  return {
    dob: dateOfBirth,
    lifePath,
    conductor,
    conductorBase,
    conductorSeries,
    bottomValues,
    loshuGrid
  };
};
