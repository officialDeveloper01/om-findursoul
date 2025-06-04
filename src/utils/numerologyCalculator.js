
export const calculateLifePath = (dateOfBirth) => {
  console.log('Calculating Life Path for date:', dateOfBirth);
  
  // Extract digits from date (DD-MM-YYYY format)
  const dateString = dateOfBirth.replace(/-/g, '');
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
  // For now, Conductor Number is same as Life Path Number
  return lifePath;
};

export const calculateConductorBase = (conductor) => {
  return 36 - conductor;
};

export const calculateConductorSeries = (conductorBase) => {
  console.log('Calculating Conductor Series for base:', conductorBase);
  
  const series = [];
  let current = conductorBase;
  
  // First, go down by subtracting 9 until we hit negative
  const downwardNumbers = [];
  let temp = current - 9;
  while (temp >= 0) {
    downwardNumbers.unshift(temp);
    temp -= 9;
  }
  
  // Add downward numbers to series
  series.push(...downwardNumbers);
  
  // Add the base number
  series.push(current);
  
  // Then go up by adding 9 until we have 11 total numbers
  temp = current + 9;
  while (series.length < 11) {
    series.push(temp);
    temp += 9;
  }
  
  console.log('Generated Conductor Series:', series);
  return series.slice(0, 11); // Ensure exactly 11 numbers
};

export const calculateAllNumerology = (dateOfBirth) => {
  const lifePath = calculateLifePath(dateOfBirth);
  const conductor = calculateConductor(lifePath);
  const conductorBase = calculateConductorBase(conductor);
  const conductorSeries = calculateConductorSeries(conductorBase);
  
  return {
    dob: dateOfBirth,
    lifePath,
    conductor,
    conductorBase,
    conductorSeries
  };
};
