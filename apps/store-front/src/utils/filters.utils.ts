export type Filters = Record<string, any>;

export interface ParsedAttributes {
  attrsParam: Record<string, string>; // for API
  attrsSignature: string; // for cache keys
  selectedAttrs: Record<string, number[]>; // for UI selection
}

/**
 * Parses attribute filters from any filter object.
 * - Keys starting with 'attr_' only
 * - Ignores null/empty values
 * - Comma-separated values parsed into numbers
 */
export const parseAttributeFilters = (filters?: Filters): ParsedAttributes => {
  const entries = getAttributeEntries(filters);

  return {
    attrsParam: buildAttrsParam(entries),
    attrsSignature: buildAttrsSignature(entries),
    selectedAttrs: buildSelectedAttrs(entries),
  };
};

const getAttributeEntries = (filters?: Filters): [string, any][] =>
  Object.entries(filters ?? {}).filter(
    ([key, value]) => key.startsWith('attr_') && value != null && String(value).trim() !== ''
  );

const buildAttrsParam = (entries: [string, any][]): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    const typeId = key.replace('attr_', '');
    const firstValue = extractFirstValue(value);
    if (typeId && firstValue) result[`attrs[${typeId}]`] = firstValue;
  }
  return result;
};

const buildAttrsSignature = (entries: [string, any][]): string =>
  entries
    .map(([key, value]) => `${key}=${String(value)}`)
    .sort()
    .join('|');

const buildSelectedAttrs = (entries: [string, any][]): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  for (const [key, value] of entries) {
    const typeId = key.replace('attr_', '');
    if (!typeId) continue;

    const numbers = String(value)
      .split(',')
      .map(Number)
      .filter((v) => !isNaN(v));

    if (numbers.length > 0) result[typeId] = numbers;
  }
  return result;
};

const extractFirstValue = (value: any): string | undefined =>
  String(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)[0];
