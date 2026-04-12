import type { Deck } from '../types';

const KEY = 'math_snake_decks';

export function loadDecks(): Deck[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Deck[];
  } catch {
    return [];
  }
}

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(KEY, JSON.stringify(decks));
}

export function addDeck(deck: Omit<Deck, 'id'>): Deck {
  const decks = loadDecks();
  const newDeck: Deck = { ...deck, id: Date.now() };
  saveDecks([...decks, newDeck]);
  return newDeck;
}

export function deleteDeck(id: number): void {
  saveDecks(loadDecks().filter((d) => d.id !== id));
}

export function updateDeck(updated: Deck): void {
  saveDecks(loadDecks().map((d) => (d.id === updated.id ? updated : d)));
}
