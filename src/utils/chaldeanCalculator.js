// Chaldean alphabet-to-number mapping
const chaldeanMap = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// Define vowels
const vowels = ['A', 'E', 'I', 'O', 'U'];

// Normalize name input
export const normalizeName = (name) => {
  if (!name) return '';
  return name.toUpperCase().replace(/[^A-Z]/g, '');
};

// Always reduce number to a single digit
export const reduceToSingleDigit = (num) => {
  while (num > 9) {
    num = num.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return num;
};

// Calculate Chaldean value for a string
export const calculateChaldeanValue = (text) => {
  const normalized = normalizeName(text);
  let total = 0;
  
  for (let char of normalized) {
    if (chaldeanMap[char]) {
      total += chaldeanMap[char];
    }
  }
  
  return total;
};

// Split name into vowels and consonants
export const splitVowelsConsonants = (name) => {
  const normalized = normalizeName(name);
  let vowelString = '';
  let consonantString = '';
  
  for (let char of normalized) {
    if (vowels.includes(char)) {
      vowelString += char;
    } else {
      consonantString += char;
    }
  }
  
  return { vowelString, consonantString };
};

// Calculate all Chaldean numbers
export const calculateChaldeanNumbers = (fullName) => {
  if (!fullName) {
    return {
      nameNumber: 0,
      soulUrgeNumber: 0,
      personalityNumber: 0
    };
  }

  const { vowelString, consonantString } = splitVowelsConsonants(fullName);
  
  // Calculate raw values
  const nameTotal = calculateChaldeanValue(fullName);
  const soulUrgeTotal = calculateChaldeanValue(vowelString);
  const personalityTotal = calculateChaldeanValue(consonantString);
  
  // Always reduce to single digit (no master number handling)
  const nameNumber = reduceToSingleDigit(nameTotal);
  const soulUrgeNumber = reduceToSingleDigit(soulUrgeTotal);
  const personalityNumber = reduceToSingleDigit(personalityTotal);
  
  return {
    nameNumber,
    soulUrgeNumber,
    personalityNumber
  };
};
