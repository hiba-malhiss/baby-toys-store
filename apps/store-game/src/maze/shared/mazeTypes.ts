// ─── Maze config stored in localStorage ───────────────────────────────
// No new DB table — stored per deckId in localStorage.
// The maze layout is generated deterministically from deckId + seed,
// so we only need to persist the seed + admin settings.

export type MazeCell = {
  index: number; // flat index in width×height grid
  col: number;
  row: number;
  isWall: boolean;
  pairId: string | null; // which MemoryPair equation lives here (null = empty/path)
  isStart: boolean;
  isEnd: boolean;
};

export type MazeConfig = {
  deckId: string; // memory deck this maze is built from
  deckName: string;
  width: number; // grid columns (odd number for clean maze gen)
  height: number; // grid rows (odd number)
  seed: number; // deterministic generation seed
  targetAnswer: string; // player must only step on cells whose equation = this answer
  createdAt: number;
  updatedAt: number;
};

export type MazePlayerState = {
  playerPos: number; // current flat cell index
  visitedPath: number[]; // ordered path the player has walked
  solvedPairIds: string[]; // pairs the player stepped on correctly
  wrongSteps: number;
};

// localStorage key pattern: maze:{deckId}
export function mazeStorageKey(deckId: string) {
  return `maze:${deckId}`;
}

export function saveMazeConfig(config: MazeConfig) {
  localStorage.setItem(mazeStorageKey(config.deckId), JSON.stringify(config));
}

export function loadMazeConfig(deckId: string): MazeConfig | null {
  try {
    const raw = localStorage.getItem(mazeStorageKey(deckId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function deleteMazeConfig(deckId: string) {
  localStorage.removeItem(mazeStorageKey(deckId));
}

export function listMazeConfigs(): MazeConfig[] {
  const configs: MazeConfig[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('maze:')) {
      try {
        const cfg = JSON.parse(localStorage.getItem(key)!);
        configs.push(cfg);
      } catch {
        /* skip corrupt */
      }
    }
  }
  return configs.sort((a, b) => b.updatedAt - a.updatedAt);
}
