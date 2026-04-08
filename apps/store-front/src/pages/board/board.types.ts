export type BoardColorDefinition = {
  id: string;
  hex: string;
  equation: string;
};

export type BoardTriangleKey = 'top' | 'bottom';

export type BoardCellSplitMode = 'none' | 'left' | 'right';

export type BoardCellSolution = {
  top: string;
  bottom: string;
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

export type BoardCellFeedback = 'idle' | 'correct' | 'incorrect';

export type BoardPlayerTriangle = {
  filledColorId: string | null;
  feedback: BoardCellFeedback;
  isSolved: boolean;
};

export type BoardPlayerCell = {
  top: BoardPlayerTriangle;
  bottom: BoardPlayerTriangle;
};
