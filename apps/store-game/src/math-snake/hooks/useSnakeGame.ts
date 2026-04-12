import { useRef, useState, useCallback, useEffect } from 'react';
import type { Point, EquationItem, Deck } from '../types';
import { rnd, shuffle, genSnakeValue, makeAutoExpr } from '../utils/math';
import { useAudio } from '../audio/useAudio';

export const COLS = 16;
export const ROWS = 16;
export const CELL = 30;

const SPEED_MS: Record<'slow' | 'fast', number> = { slow: 220, fast: 100 };

export interface FloatingMsg {
  id: number;
  text: string;
  x: number;
  y: number;
  type: 'heart' | 'check';
}

export interface GameState {
  snake: Point[];
  snakeVal: number;
  eqs: EquationItem[];
  hearts: number;
  score: number;
}

function occupiedSet(snake: Point[], eqs: EquationItem[]): Set<string> {
  const s = new Set(snake.map((p) => `${p.x},${p.y}`));
  eqs.forEach((e) => s.add(`${e.x},${e.y}`));
  return s;
}

function freeCell(snake: Point[], eqs: EquationItem[]): Point {
  const occ = occupiedSet(snake, eqs);
  let x = 0,
    y = 0,
    tries = 0;
  do {
    x = rnd(0, COLS - 1);
    y = rnd(0, ROWS - 1);
    tries++;
  } while (occ.has(`${x},${y}`) && tries < 300);
  return { x, y };
}

function buildEqs(snakeVal: number, snake: Point[], deck: Deck | null): EquationItem[] {
  const eqs: EquationItem[] = [];
  if (deck) {
    const correct = shuffle(deck.equations.filter((e) => e.correct && e.answer === snakeVal));
    const wrong = shuffle(deck.equations.filter((e) => !e.correct));
    const nc = Math.min(correct.length, rnd(2, 3));
    const nw = Math.min(wrong.length, rnd(4, 6));
    for (let i = 0; i < nc; i++)
      eqs.push({ ...freeCell(snake, eqs), expr: correct[i].expr, correct: true });
    for (let i = 0; i < nw; i++)
      eqs.push({ ...freeCell(snake, eqs), expr: wrong[i].expr, correct: false });
    if (nc === 0)
      for (let i = 0; i < 2; i++)
        eqs.push({ ...freeCell(snake, eqs), expr: makeAutoExpr(snakeVal, true), correct: true });
    if (nw === 0)
      for (let i = 0; i < 4; i++)
        eqs.push({ ...freeCell(snake, eqs), expr: makeAutoExpr(snakeVal, false), correct: false });
  } else {
    const nc = rnd(2, 3),
      nw = rnd(4, 6);
    for (let i = 0; i < nc + nw; i++) {
      const c = i < nc;
      eqs.push({ ...freeCell(snake, eqs), expr: makeAutoExpr(snakeVal, c), correct: c });
    }
  }
  return eqs;
}

function makeInitialState(): GameState {
  const snake: Point[] = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 },
  ];
  const snakeVal = genSnakeValue();
  return { snake, snakeVal, eqs: [], hearts: 3, score: 0 };
}

export function useSnakeGame(deck: Deck | null, speed: 'slow' | 'fast', musicEnabled: boolean) {
  // All mutable game state in refs — tick() always reads fresh values, no stale closures
  const stateRef = useRef<GameState>(makeInitialState());
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deckRef = useRef<Deck | null>(deck);
  const speedRef = useRef<'slow' | 'fast'>(speed);
  const musicRef = useRef<boolean>(musicEnabled);
  const aliveRef = useRef<boolean>(false);

  // Keep refs in sync with props
  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    musicRef.current = musicEnabled;
  }, [musicEnabled]);

  // React state only to trigger re-renders
  const [renderTick, setRenderTick] = useState(0);
  const [floatingMsgs, setFloatingMsgs] = useState<FloatingMsg[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const triggerRender = useCallback(() => setRenderTick((n) => n + 1), []);

  const { soundCorrect, soundWrong, soundWall, soundOver, soundLevel, startMusic, stopMusic } =
    useAudio();

  const addFloat = useCallback((text: string, x: number, y: number, type: FloatingMsg['type']) => {
    const id = Date.now() + Math.random();
    setFloatingMsgs((prev) => [...prev, { id, text, x, y, type }]);
    setTimeout(() => setFloatingMsgs((prev) => prev.filter((m) => m.id !== id)), 950);
  }, []);

  // DOM refs for shake/flash — manipulated directly to avoid render latency
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const flashElRef = useRef<HTMLDivElement | null>(null);

  const doShake = useCallback(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    el.classList.remove('shaking');
    void el.offsetWidth;
    el.classList.add('shaking');
    el.addEventListener('animationend', () => el.classList.remove('shaking'), { once: true });
  }, []);

  const doFlash = useCallback((color: string) => {
    const el = flashElRef.current;
    if (!el) return;
    el.style.background = color;
    el.style.opacity = '0.45';
    setTimeout(() => {
      if (el) el.style.opacity = '0';
    }, 200);
  }, []);

  const loseHeart = useCallback(
    (px: number, py: number) => {
      const s = stateRef.current;
      s.hearts = Math.max(0, s.hearts - 1);
      doShake();
      doFlash('rgba(220,38,38,0.45)');
      addFloat('💔', px, py, 'heart');
      // triggerRender(); // Removed to fix flickering
      if (s.hearts <= 0) {
        aliveRef.current = false;
        loopRef.current && clearInterval(loopRef.current);
        loopRef.current = null;
        stopMusic();
        setTimeout(soundOver, 200);
        setGameOver(true);
      }
    },
    [addFloat, triggerRender, doShake, doFlash, soundOver, stopMusic]
  );

  // tick reads only refs — zero stale closure risk
  const tick = useCallback(() => {
    if (!aliveRef.current) return;

    // Apply queued direction (guard against 180° reversal)
    const queued = nextDirRef.current;
    const cur = dirRef.current;
    if (!(queued.x === -cur.x && queued.y === -cur.y)) {
      dirRef.current = { ...queued };
    }

    const s = stateRef.current;
    const head = { x: s.snake[0].x + dirRef.current.x, y: s.snake[0].y + dirRef.current.y };

    const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
    const hitSelf = s.snake.some((p) => p.x === head.x && p.y === head.y);
    if (hitWall || hitSelf) {
      soundWall();
      loseHeart(s.snake[0].x * CELL + CELL / 2 - 12, s.snake[0].y * CELL);
      return;
    }

    const eqIdx = s.eqs.findIndex((e) => e.x === head.x && e.y === head.y);
    let grow = false;

    if (eqIdx >= 0) {
      const eq = s.eqs[eqIdx];
      s.eqs.splice(eqIdx, 1);
      if (eq.correct) {
        s.score += 10;
        grow = true;
        soundCorrect();
        doFlash('rgba(37,99,235,0.30)');
        addFloat('✓', eq.x * CELL + CELL / 2 - 9, eq.y * CELL, 'check');
        s.snakeVal = genSnakeValue();
        s.eqs = buildEqs(s.snakeVal, s.snake, deckRef.current);
        soundLevel();
      } else {
        soundWrong();
        loseHeart(eq.x * CELL + CELL / 2 - 12, eq.y * CELL);
        if (aliveRef.current) {
          const pos = freeCell(s.snake, s.eqs);
          s.eqs.push({ ...pos, expr: makeAutoExpr(s.snakeVal, false), correct: false });
        }
        return;
      }
    }

    s.snake.unshift(head);
    if (!grow) s.snake.pop();
    // triggerRender(); // Removed to fix flickering
  }, [
    addFloat,
    triggerRender,
    doFlash,
    soundCorrect,
    soundWrong,
    soundWall,
    soundLevel,
    loseHeart,
  ]);

  // Keyboard — empty deps array: refs never go stale, no re-subscription needed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!aliveRef.current) return;
      const cur = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (cur.y !== 1) {
            nextDirRef.current = { x: 0, y: -1 };
            e.preventDefault();
          }
          break;
        case 'ArrowDown':
          if (cur.y !== -1) {
            nextDirRef.current = { x: 0, y: 1 };
            e.preventDefault();
          }
          break;
        case 'ArrowLeft':
          if (cur.x !== 1) {
            nextDirRef.current = { x: -1, y: 0 };
            e.preventDefault();
          }
          break;
        case 'ArrowRight':
          if (cur.x !== -1) {
            nextDirRef.current = { x: 1, y: 0 };
            e.preventDefault();
          }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // intentionally empty — refs are always current

  const setDir = useCallback((d: Point) => {
    if (!aliveRef.current) return;
    const cur = dirRef.current;
    if (d.x !== 0 && d.x === -cur.x) return;
    if (d.y !== 0 && d.y === -cur.y) return;
    nextDirRef.current = d;
  }, []);

  const startGame = useCallback(() => {
    loopRef.current && clearInterval(loopRef.current);
    const s = makeInitialState();
    s.eqs = buildEqs(s.snakeVal, s.snake, deckRef.current);
    stateRef.current = s;
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    aliveRef.current = true;
    setGameOver(false);
    setStarted(true);
    // triggerRender(); // Removed to fix flickering
      stopMusic();
    },
    [stopMusic]
  );

  return {
    state: stateRef.current,
    floatingMsgs,
    gameOver,
    started,
    startGame,
    setDir,
    stopMusic,
    startMusic,
    renderTick,
    canvasWrapRef,
    flashElRef,
  };
}
