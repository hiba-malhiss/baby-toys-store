import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEmptyPlayerState } from '@/shared/boardUtils';
import type { BoardConfig, BoardPlayerCell, BoardTriangleKey } from '@/shared/types';

export function useBoardPlayer(board: BoardConfig | null, selectedColorId: string | null) {
  const [cellsState, setCellsState] = useState<BoardPlayerCell[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setCellsState(board ? createEmptyPlayerState(board) : []);
  }, [board?.id]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach(clearTimeout);
    },
    []
  );

  const paintCell = useCallback(
    (cellIndex: number, triangleKey?: BoardTriangleKey) => {
      if (!board || !selectedColorId) return;
      setCellsState((prev) => {
        const cell = prev[cellIndex];
        const solution = board.solution[cellIndex];
        if (!cell || !solution) return prev;

        const isSplit = solution.splitMode !== 'none';
        const keys = (isSplit ? [triangleKey] : ['top', 'bottom']).filter(
          Boolean
        ) as BoardTriangleKey[];
        if (!keys.length || keys.every((k) => cell[k].isSolved)) return prev;

        const isCorrect = keys.every((k) => solution[k] === selectedColorId);
        const updated = {
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
        const next = [...prev];
        next[cellIndex] = updated;

        if (isCorrect) {
          const tid = window.setTimeout(() => {
            setCellsState((latest) => {
              const c = latest[cellIndex];
              if (!c) return latest;
              const solved = {
                ...c,
                ...Object.fromEntries(
                  keys.map((k) => [
                    k,
                    { filledColorId: selectedColorId, feedback: 'idle', isSolved: true },
                  ])
                ),
              };
              const copy = [...latest];
              copy[cellIndex] = solved;
              return copy;
            });
          }, 450);
          timeoutsRef.current.push(tid);
        }
        return next;
      });
    },
    [board, selectedColorId]
  );

  const solvedCount = useMemo(() => {
    if (!board) return 0;
    return cellsState.reduce((sum, cell, i) => {
      const sm = board.solution[i]?.splitMode ?? 'none';
      return (
        sum +
        (sm === 'none'
          ? Number(cell.top.isSolved && cell.bottom.isSolved)
          : Number(cell.top.isSolved) + Number(cell.bottom.isSolved))
      );
    }, 0);
  }, [board, cellsState]);

  const totalCount = useMemo(() => {
    if (!board) return 0;
    return board.solution.reduce((sum, cell) => sum + (cell.splitMode === 'none' ? 1 : 2), 0);
  }, [board]);

  return {
    cellsState,
    paintCell,
    solvedCount,
    totalCount,
    isComplete: board !== null && solvedCount === totalCount && totalCount > 0,
  };
}
