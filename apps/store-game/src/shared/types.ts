// ─── Board types ──────────────────────────────────────────────────────

export type BoardColorDefinition = {
  id: string;
  hex: string;
  equation: string;
};

export type BoardCellSplitMode = 'none' | 'left' | 'right';
export type BoardTriangleKey = 'top' | 'bottom';
export type BoardCellFeedback = 'idle' | 'correct' | 'incorrect';

export type BoardCellSolution = {
  top: string | null;
  bottom: string | null;
  splitMode: BoardCellSplitMode;
};

export type BoardConfig = {
  id: string;
  name: string;
  width: number;
  height: number;
  colors: BoardColorDefinition[];
  solution: BoardCellSolution[];
  createdAt: number;
  updatedAt: number;
};

export type BoardPlayerTriangle = {
  filledColorId: string | null;
  feedback: BoardCellFeedback;
  isSolved: boolean;
};

export type BoardPlayerCell = {
  top: BoardPlayerTriangle;
  bottom: BoardPlayerTriangle;
};

// ─── Memory types ─────────────────────────────────────────────────────

export type MemoryPair = {
  id: string;
  equation: string;
  answer: string;
};

export type MemoryDeck = {
  id: string;
  name: string;
  pairs: MemoryPair[];
  createdAt: number;
  updatedAt: number;
};

export type MemoryCard = {
  id: string;
  pairId: string;
  type: 'equation' | 'answer';
  content: string;
};

export type MemoryCardState = {
  id: string;
  isFlipped: boolean;
  isMatched: boolean;
};

// ─── App-level types ──────────────────────────────────────────────────

export type AppRole = 'admin' | 'player';
export type GameType = 'board' | 'memory';
