// Simple entropy calculation: log2(possible chars ^ length)
export function calculateEntropy(length, charsetSize) {
  return length * Math.log2(charsetSize);
}
