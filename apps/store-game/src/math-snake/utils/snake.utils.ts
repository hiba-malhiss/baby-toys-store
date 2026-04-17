import type { Point, EquationItem, Deck } from '../types';
import { rnd, shuffle, genSnakeValue, makeAutoExpr } from './math';
import type { GameState } from '../hooks/useSnakeGame';

export function occupiedSet(snake: Point[], eqs: EquationItem[]): Set<string> {
  const s = new Set(snake.map((p) => `${p.x},${p.y}`));
  eqs.forEach((e) => s.add(`${e.x},${e.y}`));
  return s;
}

export function freeCell(snake: Point[], eqs: EquationItem[], cols: number, rows: number): Point {
  const occ = occupiedSet(snake, eqs);
  let x = 0,
    y = 0,
    tries = 0;
  do {
    x = rnd(0, cols - 1);
    y = rnd(0, rows - 1);
    tries++;
  } while (occ.has(`${x},${y}`) && tries < 300);
  return { x, y };
}

export function buildEqs(
  snakeVal: number,
  snake: Point[],
  deck: Deck | null,
  cols: number,
  rows: number
): EquationItem[] {
  const eqs: EquationItem[] = [];
  if (deck) {
    const correct = shuffle(deck.equations.filter((e) => e.correct && e.answer === snakeVal));
    const wrong = shuffle(deck.equations.filter((e) => !e.correct));
    const nc = Math.min(correct.length, rnd(2, 3));
    const nw = Math.min(wrong.length, rnd(4, 6));
    for (let i = 0; i < nc; i++)
      eqs.push({ ...freeCell(snake, eqs, cols, rows), expr: correct[i].expr, correct: true });
    for (let i = 0; i < nw; i++)
      eqs.push({ ...freeCell(snake, eqs, cols, rows), expr: wrong[i].expr, correct: false });
    if (nc === 0)
      for (let i = 0; i < 2; i++)
        eqs.push({
          ...freeCell(snake, eqs, cols, rows),
          expr: makeAutoExpr(snakeVal, true),
          correct: true,
        });
    if (nw === 0)
      for (let i = 0; i < 4; i++)
        eqs.push({
          ...freeCell(snake, eqs, cols, rows),
          expr: makeAutoExpr(snakeVal, false),
          correct: false,
        });
  } else {
    const nc = rnd(2, 3),
      nw = rnd(4, 6);
    for (let i = 0; i < nc + nw; i++) {
      const c = i < nc;
      eqs.push({
        ...freeCell(snake, eqs, cols, rows),
        expr: makeAutoExpr(snakeVal, c),
        correct: c,
      });
    }
  }
  return eqs;
}

export function makeInitialState(cols: number, rows: number): GameState {
  const midX = Math.floor(cols / 2);
  const midY = Math.floor(rows / 2);
  const snake: Point[] = [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
    { x: midX - 3, y: midY },
  ];
  const snakeVal = genSnakeValue();
  return { snake, snakeVal, eqs: [], hearts: 3, score: 0 };
}
