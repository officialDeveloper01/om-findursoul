export const calculateLoshoGrid = (dateOfBirth) => {
  console.log('Calculating Losho Grid for date:', dateOfBirth);
  
  // Extract digits from date (DD-MM-YYYY format)
  const dateString = dateOfBirth.replace(/-/g, '');
  const digits = dateString.split('').map(Number);
  
  console.log('Extracted digits:', digits);
  
  // Count frequency of each digit (1-9)
  const frequencies = {};
  for (let i = 1; i <= 9; i++) {
    frequencies[i] = 0;
  }
  
  digits.forEach(digit => {
    if (digit >= 1 && digit <= 9) {
      frequencies[digit]++;
    }
  });
  
  console.log('Digit frequencies:', frequencies);
  
  // Create 3x3 grid based on traditional Losho arrangement
  // Traditional arrangement: 1-2-3 / 4-5-6 / 7-8-9
  const grid = [
    frequencies[1] || 0, frequencies[2] || 0, frequencies[3] || 0,
    frequencies[4] || 0, frequencies[5] || 0, frequencies[6] || 0,
    frequencies[7] || 0, frequencies[8] || 0, frequencies[9] || 0
  ];
  
  console.log('Generated grid:', grid);
  
  return {
    grid,
    frequencies,
    originalDate: dateOfBirth,
    digits
  };
};

// Additional utility functions for future use
export const formatDateToIndian = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const calculateLifePath = (dateOfBirth) => {
  const digits = dateOfBirth.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  
  // Reduce to single digit (unless 11, 22, 33 - master numbers)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
};
