import { type ChangeEvent, useEffect, useMemo, useState } from 'react';

import { loadBoards, saveBoards } from './board.storage';
import type { BoardCellSplitMode, BoardColorDefinition, BoardConfig, BoardTriangleKey } from './board.types';
import { createDefaultBoard, resizeSolution, sanitizeBoard } from './board.utils';

const getInitialBoard = () => {
  const storedBoards = loadBoards().map(sanitizeBoard);
  if (storedBoards.length) {
    return { boards: storedBoards, activeBoard: storedBoards[0] };
  }
  const newBoard = createDefaultBoard();
  return { boards: [], activeBoard: newBoard };
};

const useBoardAdminPage = () => {
  const [{ boards: initialBoards, activeBoard: initialBoard }] = useState(getInitialBoard);
  const [savedBoards, setSavedBoards] = useState<BoardConfig[]>(initialBoards);
  const [activeBoard, setActiveBoard] = useState<BoardConfig>(initialBoard);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(initialBoard.colors[0]?.id || null);
  const [statusMessage, setStatusMessage] = useState('Left click paints a cell or half. Right click sets split mode.');

  useEffect(() => {
    if (!selectedColorId || !activeBoard.colors.some((c) => c.id === selectedColorId)) {
      setSelectedColorId(activeBoard.colors[0]?.id || null);
    }
  }, [activeBoard.colors, selectedColorId]);

  const hasSavedBoard = useMemo(
    () => savedBoards.some((b) => b.id === activeBoard.id),
    [activeBoard.id, savedBoards],
  );

  const handleSelectBoard = (boardId: string) => {
    const board = savedBoards.find((item) => item.id === boardId);
    if (!board) return;
    const sanitized = sanitizeBoard(board);
    setActiveBoard(sanitized);
    setSelectedColorId(sanitized.colors[0]?.id || null);
    setStatusMessage(`Loaded "${sanitized.name}".`);
  };

  const handleCreateBoard = () => {
    const newBoard = createDefaultBoard();
    setActiveBoard(newBoard);
    setSelectedColorId(newBoard.colors[0]?.id || null);
    setStatusMessage('Created a new board draft.');
  };

  const handleBoardNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveBoard((cur) => ({ ...cur, name: event.target.value }));
  };

  const handleDimensionChange = (field: 'width' | 'height', rawValue: string) => {
    const nextValue = Math.max(1, Math.min(20, Number(rawValue) || 1));
    setActiveBoard((cur) => {
      const fallbackColorId = cur.colors[0]?.id || 'color-1';
      const nextWidth = field === 'width' ? nextValue : cur.width;
      const nextHeight = field === 'height' ? nextValue : cur.height;
      return {
        ...cur,
        width: nextWidth,
        height: nextHeight,
        solution: resizeSolution({
          previousSolution: cur.solution,
          previousWidth: cur.width,
          previousHeight: cur.height,
          nextWidth,
          nextHeight,
          fallbackColorId,
        }),
      };
    });
  };

  const handlePaintCell = (cellIndex: number, triangleKey?: BoardTriangleKey) => {
    if (!selectedColorId) return;
    setActiveBoard((cur) => {
      const nextSolution = [...cur.solution];
      const cell = nextSolution[cellIndex];
      if (!cell) return cur;
      const isSplit = cell.splitMode !== 'none';
      nextSolution[cellIndex] = {
        ...cell,
        top: isSplit && triangleKey === 'bottom' ? cell.top : selectedColorId,
        bottom: isSplit && triangleKey === 'top' ? cell.bottom : selectedColorId,
      };
      return { ...cur, solution: nextSolution };
    });
  };

  const handleSetCellSplitMode = (cellIndex: number, splitMode: BoardCellSplitMode) => {
    setActiveBoard((cur) => {
      const nextSolution = [...cur.solution];
      const cell = nextSolution[cellIndex];
      if (!cell) return cur;
      nextSolution[cellIndex] = {
        ...cell,
        bottom: splitMode === 'none' ? cell.top : cell.bottom,
        splitMode,
      };
      return { ...cur, solution: nextSolution };
    });
  };

  const handleUpdateColor = (colorId: string, field: 'hex' | 'equation', value: string) => {
    setActiveBoard((cur) => ({
      ...cur,
      colors: cur.colors.map((c) => (c.id === colorId ? { ...c, [field]: value } : c)),
    }));
  };

  const handleAddColor = () => {
    const nextColor: BoardColorDefinition = {
      id: `color-${Date.now()}`,
      hex: '#a855f7',
      equation: '',
    };
    setActiveBoard((cur) => ({ ...cur, colors: [...cur.colors, nextColor] }));
    setSelectedColorId(nextColor.id);
  };

  const handleRemoveColor = (colorId: string) => {
    setActiveBoard((cur) => {
      if (cur.colors.length === 1) return cur;
      const nextColors = cur.colors.filter((c) => c.id !== colorId);
      return {
        ...cur,
        colors: nextColors,
        solution: cur.solution.map((cell) => ({
          top: cell.top === colorId ? null : cell.top,
          bottom: cell.bottom === colorId ? null : cell.bottom,
          splitMode: cell.splitMode,
        })),
      };
    });

    if (selectedColorId === colorId) {
      setSelectedColorId(activeBoard.colors.find((c) => c.id !== colorId)?.id || null);
    }
  };

  const handleSaveBoard = () => {
    const sanitized = sanitizeBoard({
      ...activeBoard,
      name: activeBoard.name.trim() || 'Untitled Board',
      updatedAt: Date.now(),
    });
    const nextBoards = hasSavedBoard
      ? savedBoards.map((b) => (b.id === sanitized.id ? sanitized : b))
      : [...savedBoards, sanitized];

    setSavedBoards(nextBoards);
    setActiveBoard(sanitized);
    saveBoards(nextBoards);
    setStatusMessage(`Saved "${sanitized.name}".`);
  };

  const handleDeleteBoard = (boardId: string) => {
    const nextBoards = savedBoards.filter((b) => b.id !== boardId);
    setSavedBoards(nextBoards);
    saveBoards(nextBoards);

    if (activeBoard.id === boardId) {
      if (nextBoards.length) {
        const next = sanitizeBoard(nextBoards[0]);
        setActiveBoard(next);
        setSelectedColorId(next.colors[0]?.id || null);
        setStatusMessage(`Deleted. Loaded "${next.name}".`);
      } else {
        const newBoard = createDefaultBoard();
        setActiveBoard(newBoard);
        setSelectedColorId(newBoard.colors[0]?.id || null);
        setStatusMessage('All boards deleted. Started a new draft.');
      }
    } else {
      setStatusMessage('Board deleted.');
    }
  };

  return {
    savedBoards,
    activeBoard,
    selectedColorId,
    statusMessage,
    hasSavedBoard,
    handleSelectBoard,
    handleCreateBoard,
    handleBoardNameChange,
    handleDimensionChange,
    handlePaintCell,
    handleSetCellSplitMode,
    handleUpdateColor,
    handleAddColor,
    handleRemoveColor,
    handleSaveBoard,
    handleDeleteBoard,
    setSelectedColorId,
  };
};

export default useBoardAdminPage;
