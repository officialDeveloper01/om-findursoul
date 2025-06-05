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

// Life Path Number (from DD only)
export const calculateLifePath = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const day = normalized.slice(0, 2); // Get DD
  const digits = day.split('').map(Number);
  let sum = digits.reduce((acc, val) => acc + val, 0);

  // Reduce to single digit (unless master numbers)
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }

  return sum;
};

// Conductor Number (sum of all digits)
export const calculateConductor = (dateOfBirth) => {
  const normalized = normalizeDate(dateOfBirth);
  const digits = normalized.split('').map(Number);
  return digits.reduce((sum, d) => sum + d, 0);
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
  return {
    losho: calculateLoshoGrid(dateOfBirth),
    lifePath: calculateLifePath(dateOfBirth),
    conductor: calculateConductor(dateOfBirth),
    formattedDate: formatDateToIndian(dateOfBirth)
  };
};
