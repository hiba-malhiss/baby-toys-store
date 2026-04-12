export interface Point {
  x: number;
  y: number;
}

export interface EquationItem {
  x: number;
  y: number;
  expr: string;
  correct: boolean;
}

export interface DeckEquation {
  expr: string;
  answer: number;
  correct: boolean;
}

export interface Deck {
  id: number;
  name: string;
  equations: DeckEquation[];
}

export type Direction = Point;

export type Speed = 'slow' | 'fast';

export type GameStatus = 'idle' | 'playing' | 'over';
