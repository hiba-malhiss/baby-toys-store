export type Filters = Record<string, any>;

export interface ParsedAttributes {
  attrsSignature: string; // for cache keys
  selectedAttrs: Record<string, number[]>; // for UI selection
  attrsBody: Record<string, number[]>; // for POST body (typeId -> valueIds)
}

/**
 * Parses attribute filters from any filter object.
 * - Keys starting with 'attr_' only
 * - Ignores null/empty values
 * - Comma-separated values parsed into numbers
 */
export const parseAttributeFilters = (filters?: Filters): ParsedAttributes => {
  const entries = getAttributeEntries(filters);
  const selected = buildSelectedAttrs(entries);

  return {
    attrsSignature: buildAttrsSignature(entries),
    selectedAttrs: selected,
    attrsBody: selected,
  };
};

const getAttributeEntries = (filters?: Filters): [string, any][] =>
  Object.entries(filters ?? {}).filter(
    ([key, value]) => key.startsWith('attr_') && value != null && String(value).trim() !== ''
  );

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
