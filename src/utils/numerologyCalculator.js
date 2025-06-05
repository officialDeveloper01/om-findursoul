
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
  
  // Helper function to reduce sum to single digit
  const reduceToSingle = (sum) => {
    while (sum > 9) {
      sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
    }
    return sum;
  };
  
  // Calculate base values
  const dayMonthDigits = (day + month).split('').map(Number);
  const dayMonthSum = dayMonthDigits.reduce((acc, digit) => acc + digit, 0);
  const dayMonthReduced = reduceToSingle(dayMonthSum); // Index 0-3: 2
  
  const dayDigits = day.split('').map(Number);
  const daySum = dayDigits.reduce((acc, digit) => acc + digit, 0);
  const dayReduced = reduceToSingle(daySum); // Index 4: 8
  
  const monthYearDigits = (month + year).split('').map(Number);
  const monthYearSum = monthYearDigits.reduce((acc, digit) => acc + digit, 0);
  const monthYearReduced = reduceToSingle(monthYearSum); // Index 6-10: 3
  
  console.log('Base calculations:', {
    dayMonthReduced, // 2
    dayReduced, // 8
    monthYearReduced // 3
  });
  
  const bottomValues = [];
  
  conductorSeries.forEach((number, index) => {
    let bottomValue;
    
    if (index <= 3) {
      // Index 0-3: Day + Month digits
      bottomValue = dayMonthReduced;
    } else if (index === 4) {
      // Index 4: Day only
      bottomValue = dayReduced;
    } else if (index === 5) {
      // Index 5: Sum of index 3 and 4
      const sum = dayMonthReduced + dayReduced;
      bottomValue = reduceToSingle(sum);
    } else {
      // Index 6-10: Month + Year digits
      bottomValue = monthYearReduced;
    }
    
    bottomValues.push(bottomValue);
  });
  
  console.log('Calculated bottom values:', bottomValues);
  return bottomValues;
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
