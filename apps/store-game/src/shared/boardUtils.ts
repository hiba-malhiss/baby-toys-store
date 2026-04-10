import type {
  BoardCellSolution,
  BoardCellSplitMode,
  BoardColorDefinition,
  BoardConfig,
  BoardPlayerCell,
} from './types';

const DEFAULT_COLORS: BoardColorDefinition[] = [
  { id: 'red', hex: '#ef4444', equation: '2 + 2' },
  { id: 'blue', hex: '#3b82f6', equation: '3 * 3' },
  { id: 'green', hex: '#22c55e', equation: '10 - 3' },
  { id: 'yellow', hex: '#f59e0b', equation: '8 / 2' },
];

export function createEmptySolution(w: number, h: number): BoardCellSolution[] {
  return Array.from({ length: w * h }, () => ({
    top: null,
    bottom: null,
    splitMode: 'none' as const,
  }));
}

export function createDefaultBoard(): BoardConfig {
  const now = Date.now();
  return {
    id: `board-${now}-${Math.random().toString(36).slice(2, 7)}`,
    name: 'Untitled Board',
    width: 8,
    height: 8,
    colors: DEFAULT_COLORS,
    solution: createEmptySolution(8, 8),
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyPlayerState(board: BoardConfig): BoardPlayerCell[] {
  return Array.from({ length: board.width * board.height }, () => ({
    top: { filledColorId: null, feedback: 'idle' as const, isSolved: false },
    bottom: { filledColorId: null, feedback: 'idle' as const, isSolved: false },
  }));
}

export function resizeSolution(args: {
  previousSolution: BoardCellSolution[];
  previousWidth: number;
  previousHeight: number;
  nextWidth: number;
  nextHeight: number;
}): BoardCellSolution[] {
  const { previousSolution, previousWidth, previousHeight, nextWidth, nextHeight } = args;
  const next = createEmptySolution(nextWidth, nextHeight);
  for (let row = 0; row < Math.min(previousHeight, nextHeight); row++) {
    for (let col = 0; col < Math.min(previousWidth, nextWidth); col++) {
      next[row * nextWidth + col] = previousSolution[row * previousWidth + col] ?? {
        top: null,
        bottom: null,
        splitMode: 'none',
      };
    }
  }
  return next;
}

function normalizeSplitMode(
  raw: unknown,
  top: string | null,
  bottom: string | null
): BoardCellSplitMode {
  if (raw === 'left' || raw === 'right' || raw === 'none') return raw;
  return top !== bottom ? 'right' : 'none';
}

export function sanitizeBoard(board: BoardConfig): BoardConfig {
  const expected = board.width * board.height;
  const solution =
    board.solution.length === expected
      ? board.solution.map((cell) => ({
          top: board.colors.some((c) => c.id === cell.top) ? cell.top : null,
          bottom: board.colors.some((c) => c.id === cell.bottom) ? cell.bottom : null,
          splitMode: normalizeSplitMode(cell.splitMode, cell.top, cell.bottom),
        }))
      : resizeSolution({
          previousSolution: board.solution,
          previousWidth: board.width,
          previousHeight: Math.ceil(board.solution.length / Math.max(board.width, 1)),
          nextWidth: board.width,
          nextHeight: board.height,
        });
  return { ...board, colors: board.colors.length ? board.colors : DEFAULT_COLORS, solution };
}

export function evaluateEquation(equation: string): string {
  try {
    if (!equation.trim()) return '';
    if (!/^[0-9+\-*/().\s×÷]+$/.test(equation.replace(/×/g, '*').replace(/÷/g, '/')))
      return equation;
    const expr = equation.replace(/×/g, '*').replace(/÷/g, '/');
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || Number.isNaN(result)) return equation;
    return String(Math.round(result * 10000) / 10000);
  } catch {
    return equation;
  }
}

export function boardToPayload(board: BoardConfig) {
  return {
    isActive: true,
    width: board.width,
    height: board.height,
    translations: [{ locale: 'en', name: board.name.trim() || 'Untitled', description: '' }],
    colors: board.colors.map((c, i) => ({
      id: c.id,
      hex: c.hex,
      equation: c.equation,
      sortOrder: i,
    })),
    solution: board.solution.map((cell, idx) => ({
      cellIndex: idx,
      splitMode: cell.splitMode ?? 'none',
      top: cell.top ?? null,
      bottom: cell.bottom ?? null,
    })),
  };
}

export function dtoToBoard(dto: any): BoardConfig {
  const width = dto.width ?? 8;
  const height = dto.height ?? 8;
  const colors: BoardColorDefinition[] = (dto.colors ?? []).map((c: any) => ({
    id: c.id,
    hex: c.hex,
    equation: c.equation ?? '',
  }));
  const cells = (dto.solution ?? [])
    .sort((a: any, b: any) => a.cellIndex - b.cellIndex)
    .map((cell: any) => ({
      top: cell.top ?? null,
      bottom: cell.bottom ?? null,
      splitMode: (cell.splitMode ?? 'none') as BoardCellSplitMode,
    }));
  const expectedSize = width * height;
  const solution =
    cells.length === expectedSize
      ? cells
      : Array.from(
          { length: expectedSize },
          (_: unknown, i: number) =>
            cells[i] ?? { top: null, bottom: null, splitMode: 'none' as const }
        );
  return {
    id: String(dto.id),
    name: dto.name ?? 'Board',
    width,
    height,
    colors,
    solution,
    createdAt: dto.createdAt ?? 0,
    updatedAt: dto.updatedAt ?? 0,
  };
}
