import type { BoardConfig } from './board.types';

const BOARDS_STORAGE_KEY = 'board-game-configurations';

const isBrowser = typeof window !== 'undefined';

export const loadBoards = (): BoardConfig[] => {
  if (!isBrowser) {
    return [];
  }

  try {
    const storedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);
    if (!storedBoards) {
      return [];
    }

    const parsedBoards = JSON.parse(storedBoards);
    return Array.isArray(parsedBoards) ? (parsedBoards as BoardConfig[]) : [];
  } catch {
    return [];
  }
};

export const saveBoards = (boards: BoardConfig[]) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
};
