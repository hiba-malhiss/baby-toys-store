/**
 * Format currency with symbol
 */
export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${symbol}0.00`;
  }
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Parse integer safely
 */
export const safeParseInt = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number') return isNaN(value) ? defaultValue : Math.floor(value);
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Format quantity for display
 */
export const formatQuantity = (quantity: number | string): number => {
  const parsed = safeParseInt(quantity, 1);
  return Math.max(parsed, 1); // Minimum quantity is 1
};
