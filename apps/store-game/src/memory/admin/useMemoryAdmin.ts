import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMemoryDecksQuery,
  useDeleteMemoryDeck,
  useMemoryDeckDetailQuery,
  useCreateMemoryDeck,
  useUpdateMemoryDeck,
  DEFAULT_PAIRS,
  type MemoryPairDto,
} from '@/api/memoryApi';

// ─── List hook ────────────────────────────────────────────────────────

export function useMemoryList() {
  const query = useMemoryDecksQuery({ page: 0, size: 50 });
  const deleteMutation = useDeleteMemoryDeck();

  const decks = query.data?.content ?? [];

  const remove = useCallback(
    async (id: string, name: string) => {
      if (!window.confirm(`Delete deck "${name}"?`)) return;
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  return { decks, remove, query, isDeleting: deleteMutation.isPending };
}

// ─── Editor hook ──────────────────────────────────────────────────────

export function useMemoryEditor(editId?: string) {
  const nav = useNavigate();

  // Fetch existing deck when editing
  const detailQuery = useMemoryDeckDetailQuery(editId ?? null);
  const existing = detailQuery.data;

  const isLoading = !!editId && detailQuery.isLoading;

  const [name, setName] = useState('');
  const [pairs, setPairs] = useState<MemoryPairDto[]>([]);
  const [initialised, setInitialised] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Initialise form once detail data arrives (or immediately for new decks)
  if (!initialised && (!editId || existing)) {
    setName(existing?.name ?? '');
    setPairs(
      existing?.pairs.length ? existing.pairs : DEFAULT_PAIRS.slice(0, 4).map((p) => ({ ...p }))
    );
    setInitialised(true);
  }

  const createMutation = useCreateMemoryDeck();
  const updateMutation = useUpdateMemoryDeck();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const addPair = useCallback(() => {
    setPairs((p) => [...p, { id: `new-${Date.now()}`, equation: '', answer: '' }]);
  }, []);

  const updatePair = useCallback((id: string, field: 'equation' | 'answer', value: string) => {
    setPairs((p) => p.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)));
  }, []);

  const removePair = useCallback((id: string) => {
    setPairs((p) => p.filter((pair) => pair.id !== id));
  }, []);

  const save = useCallback(async () => {
    if (!name.trim()) {
      setError('Deck name is required.');
      return;
    }
    if (pairs.length < 2) {
      setError('At least 2 pairs required.');
      return;
    }
    if (pairs.some((p) => !p.equation.trim() || !p.answer.trim())) {
      setError('All pairs need an equation and answer.');
      return;
    }
    setError('');

    // Strip client-side temporary ids — server assigns real ids
    const pairsPayload = pairs.map(({ equation, answer }) => ({ equation, answer }));

    try {
      if (editId) {
        await updateMutation.mutateAsync({
          id: editId,
          payload: { name: name.trim(), pairs: pairsPayload },
        });
      } else {
        await createMutation.mutateAsync({ name: name.trim(), pairs: pairsPayload });
      }
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save deck. Please try again.');
    }
  }, [name, pairs, editId, createMutation, updateMutation]);

  return {
    name,
    setName,
    pairs,
    addPair,
    updatePair,
    removePair,
    save,
    saved,
    error,
    isLoading,
    isSaving,
    detailQuery,
  };
}
