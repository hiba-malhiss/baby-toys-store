import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loadBoards } from './board.storage';
import type { BoardConfig, BoardPlayerCell, BoardTriangleKey } from './board.types';
import { createEmptyPlayerState, sanitizeBoard } from './board.utils';

const useBoardPlayerPage = () => {
  const [boards, setBoards] = useState<BoardConfig[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [cellsState, setCellsState] = useState<BoardPlayerCell[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const storedBoards = loadBoards().map(sanitizeBoard);
    setBoards(storedBoards);
    setSelectedBoardId(storedBoards[0]?.id || null);
  }, []);

  const activeBoard = useMemo(
    () => boards.find((board) => board.id === selectedBoardId) || null,
    [boards, selectedBoardId]
  );

  useEffect(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];

    if (!activeBoard) {
      setCellsState([]);
      setSelectedColorId(null);
      return;
    }

    setCellsState(createEmptyPlayerState(activeBoard));
    setSelectedColorId(activeBoard.colors[0]?.id || null);
  }, [activeBoard]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    },
    []
  );

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
  };

  const handleCellClick = useCallback(
    (cellIndex: number, triangleKey?: BoardTriangleKey) => {
      if (!activeBoard || !selectedColorId) return;

      setCellsState((state) => {
        const cell = state[cellIndex];
        const solution = activeBoard.solution[cellIndex];

        if (!cell || !solution) return state;

        const isSplit = solution.splitMode !== 'none';
        const keys = (isSplit ? [triangleKey] : ['top', 'bottom']).filter(
          Boolean
        ) as BoardTriangleKey[];

        if (!keys.length || keys.every((k) => cell[k].isSolved)) {
          return state;
        }

        const isCorrect = keys.every((k) => solution[k] === selectedColorId);

        const updatedCell = {
          ...cell,
          ...Object.fromEntries(
            keys.map((k) => [
              k,
              {
                filledColorId: selectedColorId,
                feedback: isCorrect ? 'correct' : 'incorrect',
                isSolved: false,
              },
            ])
          ),
        };

        const nextState = [...state];
        nextState[cellIndex] = updatedCell;

        // feedback: 'correct' → 'idle' after 450ms for animation
        if (isCorrect) {
          const timeoutId = window.setTimeout(() => {
            setCellsState((latest) => {
              const latestCell = latest[cellIndex];
              if (!latestCell) return latest;

              const solvedCell = {
                ...latestCell,
                ...Object.fromEntries(
                  keys.map((k) => [
                    k,
                    {
                      filledColorId: selectedColorId,
                      feedback: 'idle',
                      isSolved: true,
                    },
                  ])
                ),
              };

              const updated = [...latest];
              updated[cellIndex] = solvedCell;
              return updated;
            });
          }, 450);

          timeoutsRef.current.push(timeoutId);
        }

        return nextState;
      });
    },
    [activeBoard, selectedColorId]
  );

  const solvedCellsCount = useMemo(() => {
    if (!activeBoard) {
      return 0;
    }

    return cellsState.reduce((total, cell, index) => {
      const splitMode = activeBoard.solution[index]?.splitMode || 'none';

      if (splitMode === 'none') {
        return total + Number(cell.top.isSolved && cell.bottom.isSolved);
      }

      return total + Number(cell.top.isSolved) + Number(cell.bottom.isSolved);
    }, 0);
  }, [activeBoard, cellsState]);

  const totalTargetCount = useMemo(
    () =>
      activeBoard
        ? activeBoard.solution.reduce(
            (total, cell) => total + (cell.splitMode === 'none' ? 1 : 2),
            0
          )
        : 0,
    [activeBoard]
  );

  return {
    boards,
    activeBoard,
    selectedBoardId,
    selectedColorId,
    cellsState,
    solvedCellsCount,
    totalTargetCount,
    handleSelectBoard,
    handleCellClick,
    setSelectedColorId,
  };
};

export default useBoardPlayerPage;
