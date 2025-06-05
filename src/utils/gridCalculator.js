export const calculateLoshoGrid = (dateOfBirth) => {
  console.log('Calculating Losho Grid for date:', dateOfBirth);
  
  // Normalize input date string:
  // Converts YYYY-MM-DD to DDMMYYYY,
  // Removes separators from DD/MM/YYYY or DD-MM-YYYY,
  // Else strips non-digit characters
  const normalizeDate = (dateStr) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return day + month + year;  // DDMMYYYY as string without separator
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr.split('/').join('');
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr.split('-').join('');
    } else {
      return dateStr.replace(/\D/g, '');
    }
  };

  const normalizedDateString = normalizeDate(dateOfBirth);
  console.log('Normalized date string:', normalizedDateString);

  const digits = normalizedDateString.split('').map(Number);
  console.log('Extracted digits:', digits);

  // Count frequency of digits 1-9
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

  // Build grid in traditional Losho order (1 to 9)
  const grid = [
    frequencies[1], frequencies[2], frequencies[3],
    frequencies[4], frequencies[5], frequencies[6],
    frequencies[7], frequencies[8], frequencies[9]
  ];

  console.log('Generated grid:', grid);

  return {
    grid,
    frequencies,
    originalDate: dateOfBirth,
    digits
  };
};

// Utility function: format date to Indian DD/MM/YYYY
export const formatDateToIndian = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Life Path calculation with master number check (11,22,33)
export const calculateLifePath = (dateOfBirth) => {
  // Normalize date input similar to Losho grid for consistency
  const normalizeDate = (dateStr) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return day + month + year;
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr.split('/').join('');
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr.split('-').join('');
    } else {
      return dateStr.replace(/\D/g, '');
    }
  };

  const normalizedDateString = normalizeDate(dateOfBirth);
  const digits = normalizedDateString.split('').map(Number);
  
  let sum = digits.reduce((acc, digit) => acc + digit, 0);
  
  // Reduce to single digit unless master numbers (11, 22, 33)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  }
  
  return sum;
};
