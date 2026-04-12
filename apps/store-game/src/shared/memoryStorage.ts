/**
 * DEPRECATED — memory decks are now persisted via the REST API (see src/api/memoryApi.ts).
 * This file is kept as a stub so any stale imports don't cause build errors during migration.
 * Safe to delete once all references are confirmed removed.
 */

export type { MemoryDeck, MemoryPair } from './types';

/** @deprecated Use useMemoryDecksQuery from api/memoryApi instead */
export function getMemoryDecks() {
  return [];
}
/** @deprecated Use useMemoryDeckDetailQuery from api/memoryApi instead */
export function getMemoryDeck(_id: string) {
  return undefined;
}
/** @deprecated Use useCreateMemoryDeck from api/memoryApi instead */
export function createMemoryDeck() {
  throw new Error('Use API instead');
}
/** @deprecated Use useUpdateMemoryDeck from api/memoryApi instead */
export function updateMemoryDeck() {
  throw new Error('Use API instead');
}
/** @deprecated Use useDeleteMemoryDeck from api/memoryApi instead */
export function deleteMemoryDeck() {
  throw new Error('Use API instead');
}

/** Built-in default pairs (still used as fallback for the default deck) */
export function getDefaultPairs() {
  return [
    { id: 'p1', equation: '2 + 2', answer: '4' },
    { id: 'p2', equation: '3 × 3', answer: '9' },
    { id: 'p3', equation: '10 − 3', answer: '7' },
    { id: 'p4', equation: '8 ÷ 2', answer: '4' },
    { id: 'p5', equation: '5 + 6', answer: '11' },
    { id: 'p6', equation: '4 × 4', answer: '16' },
    { id: 'p7', equation: '20 − 8', answer: '12' },
    { id: 'p8', equation: '15 ÷ 3', answer: '5' },
    { id: 'p9', equation: '7 + 8', answer: '15' },
    { id: 'p10', equation: '6 × 5', answer: '30' },
    { id: 'p11', equation: '100 − 45', answer: '55' },
    { id: 'p12', equation: '81 ÷ 9', answer: '9' },
  ];
}
