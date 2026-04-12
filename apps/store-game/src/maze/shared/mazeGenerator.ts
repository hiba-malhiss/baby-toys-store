import type { MazeCell, MazeConfig } from './mazeTypes';
import type { MemoryPairDto } from '../../api/memoryApi';
import { evaluateEquation } from '../../shared/boardUtils';

// ─── Seeded PRNG (mulberry32) — deterministic from seed ───────────────
function mkRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Recursive backtracker maze (classic algorithm) ───────────────────
// Works on odd-dimension grids: walls at even col/row, paths at odd.
function generateMazeWalls(width: number, height: number, rng: () => number): boolean[] {
  // All cells start as walls
  const walls = new Array(width * height).fill(true);

  const idx = (c: number, r: number) => r * width + c;
  const inBounds = (c: number, r: number) => c >= 0 && c < width && r >= 0 && r < height;

  // Carve starting from top-left passage cell (1,1)
  const stack: [number, number][] = [[1, 1]];
  walls[idx(1, 1)] = false;

  const DIRS = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0],
  ];

  while (stack.length) {
    const [cc, cr] = stack[stack.length - 1];
    // Shuffle directions
    const dirs = [...DIRS].sort(() => rng() - 0.5);
    let carved = false;
    for (const [dc, dr] of dirs) {
      const nc = cc + dc,
        nr = cr + dr;
      const wc = cc + dc / 2,
        wr = cr + dr / 2; // wall between
      if (inBounds(nc, nr) && walls[idx(nc, nr)]) {
        walls[idx(wc, wr)] = false; // knock down wall
        walls[idx(nc, nr)] = false; // carve passage
        stack.push([nc, nr]);
        carved = true;
        break;
      }
    }
    if (!carved) stack.pop();
  }

  return walls;
}

// ─── BFS to find the shortest path from start to end ─────────────────
function bfsPath(
  walls: boolean[],
  width: number,
  height: number,
  startIdx: number,
  endIdx: number
): number[] {
  const visited = new Set<number>();
  const prev = new Map<number, number>();
  const queue = [startIdx];
  visited.add(startIdx);

  const DIRS = [-1, 1, -width, width];

  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === endIdx) break;
    for (const d of DIRS) {
      const nb = cur + d;
      if (nb < 0 || nb >= width * height) continue;
      // Prevent wrapping across rows
      if (d === -1 && cur % width === 0) continue;
      if (d === 1 && cur % width === width - 1) continue;
      if (!walls[nb] && !visited.has(nb)) {
        visited.add(nb);
        prev.set(nb, cur);
        queue.push(nb);
      }
    }
  }

  // Reconstruct path
  const path: number[] = [];
  let cur: number | undefined = endIdx;
  while (cur !== undefined) {
    path.unshift(cur);
    cur = prev.get(cur);
  }
  return path[0] === startIdx ? path : [];
}

// ─── Main export: build MazeCell[] from config + pairs ───────────────
export function buildMaze(config: MazeConfig, pairs: MemoryPairDto[]): MazeCell[] {
  const { width, height, seed, targetAnswer } = config;
  const rng = mkRng(seed);

  const walls = generateMazeWalls(width, height, rng);

  // Start = top-left passage, End = bottom-right passage
  const startIdx = 1 * width + 1; // cell (1,1)
  const endIdx = (height - 2) * width + (width - 2); // cell (w-2, h-2)

  // Find the canonical solution path
  const solutionPath = bfsPath(walls, width, height, startIdx, endIdx);

  // Filter pairs whose evaluated answer matches targetAnswer
  const matchingPairs = pairs.filter(
    (p) => evaluateEquation(p.equation).trim() === targetAnswer.trim()
  );

  // Place matching pairs on solution-path cells (skip start & end)
  const placementCells = solutionPath.slice(1, -1); // interior path cells
  const shuffledPairs = [...matchingPairs].sort(() => rng() - 0.5);

  // Map cell index → pair (cycle through pairs if path is longer)
  const cellPairMap = new Map<number, MemoryPairDto>();
  placementCells.forEach((cellIdx, i) => {
    if (shuffledPairs.length > 0) {
      cellPairMap.set(cellIdx, shuffledPairs[i % shuffledPairs.length]);
    }
  });

  // Build full cell array
  return Array.from({ length: width * height }, (_, i) => {
    const col = i % width;
    const row = Math.floor(i / width);
    const isWall = walls[i];
    const pair = cellPairMap.get(i) ?? null;

    return {
      index: i,
      col,
      row,
      isWall,
      pairId: pair?.id ?? null,
      isStart: i === startIdx,
      isEnd: i === endIdx,
    };
  });
}

// ─── Check if a step is valid ─────────────────────────────────────────
export function isValidStep(cell: MazeCell, pairs: MemoryPairDto[], targetAnswer: string): boolean {
  // Start and end cells are always valid
  if (cell.isStart || cell.isEnd) return true;
  // Empty path cells (no equation) are valid to walk through
  if (!cell.pairId) return true;
  // Equation cells: must match targetAnswer
  const pair = pairs.find((p) => p.id === cell.pairId);
  if (!pair) return true;
  return evaluateEquation(pair.equation).trim() === targetAnswer.trim();
}

// ─── Get valid neighbours for movement ───────────────────────────────
export function getNeighbours(
  index: number,
  width: number,
  height: number,
  cells: MazeCell[]
): number[] {
  const col = index % width;
  const row = Math.floor(index / width);
  const result: number[] = [];

  const dirs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  for (const [dc, dr] of dirs) {
    const nc = col + dc,
      nr = row + dr;
    if (nc < 0 || nc >= width || nr < 0 || nr >= height) continue;
    const ni = nr * width + nc;
    if (!cells[ni].isWall) result.push(ni);
  }

  return result;
}
