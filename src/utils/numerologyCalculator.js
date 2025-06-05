
export const calculateLifePath = (dateOfBirth) => {
  console.log('Calculating Life Path for date:', dateOfBirth);
  
  // Extract digits from date (DD-MM-YYYY or DD/MM/YYYY format)
  const dateString = dateOfBirth.replace(/[-/]/g, '');
  const digits = dateString.split('').map(Number);
  
  console.log('Extracted digits for Life Path:', digits);
  
  // Sum all digits
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  console.log('Initial sum:', sum);
  
  // Reduce to single digit (unless 11, 22, 33 - master numbers)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
    console.log('Reduced sum:', sum);
  }
  
  return sum;
};

export const calculateConductor = (lifePath) => {
  // Conductor Number is same as Life Path Number
  return lifePath;
};

export const calculateConductorBase = (conductor) => {
  return 36 - conductor;
};

export const calculateConductorSeries = (conductorBase) => {
  console.log('Calculating Conductor Series for base:', conductorBase);
  
  const series = [];
  
  // First, go down by subtracting 9 until we hit negative or 0
  const downwardNumbers = [];
  let temp = conductorBase - 9;
  while (temp > 0) {  // Exclude 0 completely
    downwardNumbers.unshift(temp);
    temp -= 9;
  }
  
  // Add downward numbers to series
  series.push(...downwardNumbers);
  
  // Add the base number
  series.push(conductorBase);
  
  // Then go up by adding 9 until we have 11 total numbers
  temp = conductorBase + 9;
  while (series.length < 11) {
    series.push(temp);
    temp += 9;
  }
  
  console.log('Generated Conductor Series:', series);
  return series.slice(0, 11); // Ensure exactly 11 numbers
};

export const calculateBottomValues = (dateOfBirth, conductorSeries) => {
  console.log('Calculating bottom values for:', dateOfBirth, conductorSeries);
  
  // Parse DOB to extract day, month, year
  const parts = dateOfBirth.split(/[-/]/);
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  // Calculate base values
  const dayMonthSum = (day + month).split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  const dayMonthReduced = dayMonthSum > 9 ? dayMonthSum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0) : dayMonthSum;
  
  const daySum = day.split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  const dayReduced = daySum > 9 ? daySum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0) : daySum;
  
  const monthYearDigits = (month + year).split('').map(Number);
  const monthYearSum = monthYearDigits.reduce((acc, digit) => acc + digit, 0);
  const monthYearReduced = monthYearSum > 9 ? monthYearSum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0) : monthYearSum;
  
  console.log('Base calculations:', {
    dayMonthReduced,
    dayReduced,
    monthYearReduced
  });
  
  const bottomValues = [];
  
  conductorSeries.forEach((number, index) => {
    let bottomValue;
    
    if (index < conductorSeries.length - 6) {
      // Before & Base positions: Sum of day + month digits
      bottomValue = dayMonthReduced;
    } else if (index === conductorSeries.length - 6) {
      // Just After position: Sum of day digits only
      bottomValue = dayReduced;
    } else if (index === conductorSeries.length - 5) {
      // Next Number: Sum of previous two bottom values
      const prevValue = bottomValues[index - 1] || dayMonthReduced;
      const sum = prevValue + dayReduced;
      bottomValue = sum > 9 ? sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0) : sum;
    } else {
      // Remaining positions: Sum of month + year digits
      bottomValue = monthYearReduced;
    }
    
    bottomValues.push(bottomValue);
  });
  
  console.log('Calculated bottom values:', bottomValues);
  return bottomValues;
};

export const calculateNumerologyProfile = (dateOfBirth) => {
  console.log('Calculating 13-element Numerology Profile for:', dateOfBirth);
  
  // Extract digits from date (DD-MM-YYYY or DD/MM/YYYY format)
  const dateString = dateOfBirth.replace(/[-/]/g, '');
  const digits = dateString.split('').map(Number);
  
  console.log('DOB digits:', digits);
  
  // Initialize the 13-element profile array
  const profile = new Array(13).fill(0);
  
  // Index [0] → Day number (Driver)
  const dayPart = dateOfBirth.split(/[-/]/)[0];
  const daySum = dayPart.split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  profile[0] = daySum > 9 ? daySum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0) : daySum;
  
  // Index [1] → Destiny number (Conductor) - sum of all digits reduced
  let totalSum = digits.reduce((acc, digit) => acc + digit, 0);
  let conductor = totalSum;
  while (conductor > 9 && conductor !== 11 && conductor !== 22 && conductor !== 33) {
    conductor = conductor.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  }
  profile[1] = conductor;
  
  // Index [2] to [10] → Frequency of digits 1–9
  for (let digit = 1; digit <= 9; digit++) {
    profile[digit + 1] = digits.filter(d => d === digit).length;
  }
  
  // Index [11] → Count of non-zero digits
  profile[11] = digits.filter(digit => digit !== 0).length;
  
  // Index [12] → Sum of all digits (no reduction)
  profile[12] = totalSum;
  
  console.log('Generated Numerology Profile:', profile);
  return profile;
};

export const calculateLoshuGrid = (dateOfBirth) => {
  console.log('Calculating Loshu Grid for date:', dateOfBirth);
  
  // Extract all non-zero digits from DOB
  const dateString = dateOfBirth.replace(/[-/]/g, '');
  const digits = dateString.split('').map(Number).filter(digit => digit !== 0);
  
  console.log('Non-zero digits for Loshu Grid:', digits);
  
  // Count frequency of each digit 1-9
  const frequencies = {};
  for (let i = 1; i <= 9; i++) {
    frequencies[i] = digits.filter(digit => digit === i).length;
  }
  
  console.log('Digit frequencies:', frequencies);
  return frequencies;
};

export const calculateAllNumerology = (dateOfBirth) => {
  const lifePath = calculateLifePath(dateOfBirth);
  const conductor = calculateConductor(lifePath);
  const conductorBase = calculateConductorBase(conductor);
  const conductorSeries = calculateConductorSeries(conductorBase);
  const bottomValues = calculateBottomValues(dateOfBirth, conductorSeries);
  const loshuGrid = calculateLoshuGrid(dateOfBirth);
  const numerologyProfile = calculateNumerologyProfile(dateOfBirth);
  
  return {
    dob: dateOfBirth,
    lifePath,
    conductor,
    conductorBase,
    conductorSeries,
    bottomValues,
    loshuGrid,
    numerologyProfile
  };
};
