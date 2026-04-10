import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  useBoardsQuery,
  useBoardDetailQuery,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from '@/api/boardApi';
import {
  createDefaultBoard,
  resizeSolution,
  sanitizeBoard,
  evaluateEquation,
  boardToPayload,
  dtoToBoard,
} from '@/shared/boardUtils';
import type {
  BoardCellSplitMode,
  BoardColorDefinition,
  BoardConfig,
  BoardTriangleKey,
} from '@/shared/types';

// ─── Validation ───────────────────────────────────────────────────────

function findDupeEquations(colors: BoardColorDefinition[]): Set<string> {
  const map: Record<string, string[]> = {};
  colors.forEach((c) => {
    if (!c.equation.trim()) return;
    const r = evaluateEquation(c.equation);
    if (!map[r]) map[r] = [];
    map[r].push(c.id);
  });
  const dupes = new Set<string>();
  Object.values(map).forEach((ids) => {
    if (ids.length > 1) ids.forEach((id) => dupes.add(id));
  });
  return dupes;
}

export function validateStep1(board: BoardConfig): string[] {
  const e: string[] = [];
  if (!board.name.trim()) e.push('Board name is required.');
  if (board.width < 1 || board.width > 20) e.push('Width must be 1–20.');
  if (board.height < 1 || board.height > 20) e.push('Height must be 1–20.');
  if (board.colors.some((c) => !c.equation.trim())) e.push('Every color needs an equation.');
  if (findDupeEquations(board.colors).size) e.push('Each equation must produce a unique answer.');
  return e;
}

export function validateStep2(board: BoardConfig): string[] {
  const empty = board.solution.filter((cell) =>
    cell.splitMode !== 'none' ? !cell.top || !cell.bottom : !cell.top
  ).length;
  return empty > 0
    ? [`${empty} cell${empty > 1 ? 's' : ''} still need${empty === 1 ? 's' : ''} a color.`]
    : [];
}

// ─── List hook ────────────────────────────────────────────────────────

export function useBoardList() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const SIZE = 10;

  const query = useBoardsQuery({ page, size: SIZE, sortBy, sortDir });
  const deleteMutation = useDeleteBoard();

  return {
    query,
    page,
    setPage,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    SIZE,
    deleteMutation,
  };
}

// ─── Wizard hook ──────────────────────────────────────────────────────

export function useBoardWizard(editId?: number) {
  const [board, setBoard] = useState<BoardConfig>(createDefaultBoard);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    () => board.colors[0]?.id ?? null
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [triedNext, setTriedNext] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(editId ?? null);

  const detailQuery = useBoardDetailQuery(editId ?? null);
  const createMutation = useCreateBoard();
  const updateMutation = useUpdateBoard();

  // Load board when editing
  useEffect(() => {
    if (detailQuery.data) {
      const local = sanitizeBoard(dtoToBoard(detailQuery.data));
      setBoard(local);
      setSelectedColorId(local.colors[0]?.id ?? null);
    }
  }, [detailQuery.data]);

  // Keep selectedColor valid when palette changes
  useEffect(() => {
    if (!selectedColorId || !board.colors.some((c) => c.id === selectedColorId))
      setSelectedColorId(board.colors[0]?.id ?? null);
  }, [board.colors, selectedColorId]);

  const step1Errors = validateStep1(board);
  const step2Errors = validateStep2(board);
  const errorsFor = (i: number) => (i === 0 ? step1Errors : i === 1 ? step2Errors : []);

  const goTo = (i: number) => {
    setStepIndex(i);
    setTriedNext(false);
  };
  const tryAdvance = () => {
    if (errorsFor(stepIndex).length) {
      setTriedNext(true);
      return;
    }
    goTo(stepIndex + 1);
  };

  const save = useCallback(async () => {
    const trimmed = { ...board, name: board.name.trim() || 'Untitled Board' };
    const payload = boardToPayload(trimmed);
    if (savedId !== null) {
      await updateMutation.mutateAsync({ id: savedId, payload });
    } else {
      const res = await createMutation.mutateAsync(payload);
      setSavedId(res.id);
    }
    goTo(2);
  }, [board, savedId, createMutation, updateMutation]);

  // ── Field handlers ────────────────────────────────────────────────

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setBoard((b) => ({ ...b, name: e.target.value }));
  }, []);

  const handleDimChange = useCallback((field: 'width' | 'height', raw: string) => {
    const val = Math.max(1, Math.min(20, Number(raw) || 1));
    setBoard((b) => {
      const w = field === 'width' ? val : b.width;
      const h = field === 'height' ? val : b.height;
      return {
        ...b,
        width: w,
        height: h,
        solution: resizeSolution({
          previousSolution: b.solution,
          previousWidth: b.width,
          previousHeight: b.height,
          nextWidth: w,
          nextHeight: h,
        }),
      };
    });
  }, []);

  const paintCell = useCallback(
    (index: number, key?: BoardTriangleKey) => {
      if (!selectedColorId) return;
      setBoard((b) => {
        const next = [...b.solution];
        const cell = next[index];
        if (!cell) return b;
        const isSplit = cell.splitMode !== 'none';
        next[index] = {
          ...cell,
          top: isSplit && key === 'bottom' ? cell.top : selectedColorId,
          bottom: isSplit && key === 'top' ? cell.bottom : selectedColorId,
        };
        return { ...b, solution: next };
      });
    },
    [selectedColorId]
  );

  const setSplitMode = useCallback((index: number, mode: BoardCellSplitMode) => {
    setBoard((b) => {
      const next = [...b.solution];
      const cell = next[index];
      if (!cell) return b;
      next[index] = { ...cell, bottom: mode === 'none' ? cell.top : cell.bottom, splitMode: mode };
      return { ...b, solution: next };
    });
  }, []);

  const updateColor = useCallback((id: string, field: 'hex' | 'equation', value: string) => {
    setBoard((b) => ({
      ...b,
      colors: b.colors.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  }, []);

  const addColor = useCallback(() => {
    const nc: BoardColorDefinition = { id: `color-${Date.now()}`, hex: '#a855f7', equation: '' };
    setBoard((b) => ({ ...b, colors: [...b.colors, nc] }));
    setSelectedColorId(nc.id);
  }, []);

  const removeColor = useCallback(
    (id: string) => {
      setBoard((b) => {
        if (b.colors.length === 1) return b;
        return {
          ...b,
          colors: b.colors.filter((c) => c.id !== id),
          solution: b.solution.map((cell) => ({
            ...cell,
            top: cell.top === id ? null : cell.top,
            bottom: cell.bottom === id ? null : cell.bottom,
          })),
        };
      });
      if (selectedColorId === id)
        setSelectedColorId(board.colors.find((c) => c.id !== id)?.id ?? null);
    },
    [board.colors, selectedColorId]
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const hasSaved = savedId !== null;

  return {
    board,
    selectedColorId,
    setSelectedColorId,
    stepIndex,
    triedNext,
    step1Errors,
    step2Errors,
    goTo,
    tryAdvance,
    save,
    isSaving,
    hasSaved,
    savedId,
    handleNameChange,
    handleDimChange,
    paintCell,
    setSplitMode,
    updateColor,
    addColor,
    removeColor,
    isLoadingEdit: detailQuery.isLoading,
  };
}
