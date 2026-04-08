import type {
  BoardCellSolution,
  BoardColorDefinition,
  BoardConfig,
  BoardPlayerCell,
} from './board.types';

const DEFAULT_COLORS: BoardColorDefinition[] = [
  { id: 'red', hex: '#ef4444', equation: '2 + 2' },
  { id: 'blue', hex: '#3b82f6', equation: '3 * 3' },
  { id: 'green', hex: '#22c55e', equation: '10 - 3' },
  { id: 'yellow', hex: '#f59e0b', equation: '8 / 2' },
];

const DEFAULT_GRID_WIDTH = 8;
const DEFAULT_GRID_HEIGHT = 8;

const buildBoardId = () => `board-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createEmptySolution = (width: number, height: number) =>
  Array.from({ length: width * height }, () => ({
    top: null,
    bottom: null,
    splitMode: 'none' as const,
  }));

export const createDefaultBoard = (): BoardConfig => {
  const now = Date.now();

  return {
    id: buildBoardId(),
    name: 'Untitled Board',
    width: DEFAULT_GRID_WIDTH,
    height: DEFAULT_GRID_HEIGHT,
    colors: DEFAULT_COLORS,
    solution: createEmptySolution(DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT),
    createdAt: now,
    updatedAt: now,
  };
};

export const resizeSolution = ({
  previousSolution,
  previousWidth,
  previousHeight,
  nextWidth,
  nextHeight,
}: {
  previousSolution: BoardCellSolution[];
  previousWidth: number;
  previousHeight: number;
  nextWidth: number;
  nextHeight: number;
}) => {
  const nextSolution = createEmptySolution(nextWidth, nextHeight);

  for (let rowIndex = 0; rowIndex < Math.min(previousHeight, nextHeight); rowIndex++) {
    for (let columnIndex = 0; columnIndex < Math.min(previousWidth, nextWidth); columnIndex++) {
      const previousIndex = rowIndex * previousWidth + columnIndex;
      const nextIndex = rowIndex * nextWidth + columnIndex;
      nextSolution[nextIndex] = previousSolution[previousIndex] || {
        top: null,
        bottom: null,
        splitMode: 'none',
      };
    }
  }

  return nextSolution;
};

export const createEmptyPlayerState = (board: BoardConfig): BoardPlayerCell[] =>
  Array.from({ length: board.width * board.height }, () => ({
    top: {
      filledColorId: null,
      feedback: 'idle',
      isSolved: false,
    },
    bottom: {
      filledColorId: null,
      feedback: 'idle',
      isSolved: false,
    },
  }));

const normalizeSplitMode = (splitMode: unknown, top: string, bottom: string) => {
  if (splitMode === 'left' || splitMode === 'right' || splitMode === 'none') {
    return splitMode;
  }

  return top !== bottom ? 'right' : 'none';
};

export const sanitizeBoard = (board: BoardConfig): BoardConfig => {
  const expectedSize = board.width * board.height;
  const solution =
    board.solution.length === expectedSize
      ? board.solution.map((cell) => ({
          top: board.colors.some((color) => color.id === cell.top) ? cell.top : null,
          bottom: board.colors.some((color) => color.id === cell.bottom) ? cell.bottom : null,
          splitMode: normalizeSplitMode(cell.splitMode, cell.top, cell.bottom),
        }))
      : resizeSolution({
          previousSolution: board.solution,
          previousWidth: board.width,
          previousHeight: Math.ceil(board.solution.length / Math.max(board.width, 1)),
          nextWidth: board.width,
          nextHeight: board.height,
        });

  return {
    ...board,
    colors: board.colors.length ? board.colors : DEFAULT_COLORS,
    solution,
  };
};

export const evaluateEquation = (equation: string): string => {
  try {
    if (!equation.trim()) return '';

    // basic safety: allow only numbers + operators
    if (!/^[0-9+\-*/().\s]+$/.test(equation)) {
      return equation;
    }

    const result = Function(`"use strict"; return (${equation})`)();

    if (typeof result !== 'number' || Number.isNaN(result)) {
      return equation;
    }

    return String(result);
  } catch {
    return equation;
  }
};
