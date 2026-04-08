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
    [boards, selectedBoardId],
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
    [],
  );

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
  };

  const handleCellClick = useCallback(
    (cellIndex: number, triangleKey?: BoardTriangleKey) => {
      if (!activeBoard || !selectedColorId) {
        return;
      }

      setCellsState((currentState) => {
        const currentCell = currentState[cellIndex];
        const solutionCell = activeBoard.solution[cellIndex];
        const isSplitCell = solutionCell?.splitMode !== 'none';
        const targetTriangleKeys = (isSplitCell ? [triangleKey] : ['top', 'bottom']).filter(Boolean) as BoardTriangleKey[];

        if (!currentCell || !targetTriangleKeys.length || targetTriangleKeys.every((key) => currentCell[key].isSolved)) {
          return currentState;
        }

        const nextState = [...currentState];
        const nextCell = { ...currentCell };
        const isCorrect = targetTriangleKeys.every((key) => solutionCell?.[key] === selectedColorId);

        targetTriangleKeys.forEach((key) => {
          nextCell[key] = {
            filledColorId: selectedColorId,
            feedback: isCorrect ? 'correct' : 'incorrect',
            isSolved: false,
          };
        });
        nextState[cellIndex] = nextCell;

        if (isCorrect) {
          const timeoutId = window.setTimeout(() => {
            setCellsState((latestState) => {
              const latestCell = latestState[cellIndex];
              if (!latestCell) {
                return latestState;
              }

              const updatedState = [...latestState];
              const updatedCell = { ...latestCell };

              targetTriangleKeys.forEach((key) => {
                updatedCell[key] = {
                  filledColorId: selectedColorId,
                  feedback: 'idle',
                  isSolved: true,
                };
              });

              updatedState[cellIndex] = {
                ...updatedCell,
              };
              return updatedState;
            });
          }, 450);

          timeoutsRef.current.push(timeoutId);
        }

        return nextState;
      });
    },
    [activeBoard, selectedColorId],
  );

  const solvedCellsCount = useMemo(
    () => {
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
    },
    [activeBoard, cellsState],
  );

  const totalTargetCount = useMemo(
    () =>
      activeBoard
        ? activeBoard.solution.reduce((total, cell) => total + (cell.splitMode === 'none' ? 1 : 2), 0)
        : 0,
    [activeBoard],
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
