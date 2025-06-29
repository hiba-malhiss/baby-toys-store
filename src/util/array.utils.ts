/**
 * Check if array is empty or null/undefined
 */
export const isEmpty = <T>(array: T[] | null | undefined): boolean => {
  return !array || array.length === 0;
};

/**
 * Get unique items from array by key
 */
export const uniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Group array items by key
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 */
export const sortBy = <T, K extends keyof T>(
  array: T[], 
  key: K, 
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Find item by property value
 */
export const findBy = <T, K extends keyof T>(array: T[], key: K, value: T[K]): T | undefined => {
  return array.find(item => item[key] === value);
};

/**
 * Check if array contains item with property value
 */
export const containsBy = <T, K extends keyof T>(array: T[], key: K, value: T[K]): boolean => {
  return array.some(item => item[key] === value);
};