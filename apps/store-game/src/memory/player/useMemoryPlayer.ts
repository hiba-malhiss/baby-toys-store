import { useCallback, useEffect, useRef, useState } from 'react';
import type { MemoryCard, MemoryCardState } from '@/shared/types';

const MISMATCH_DELAY = 900;

function buildInitialState(cards: MemoryCard[]): MemoryCardState[] {
  return cards.map((c) => ({ id: c.id, isFlipped: false, isMatched: false }));
}

export function useMemoryPlayer(cards: MemoryCard[]) {
  const [states, setStates] = useState<MemoryCardState[]>(() => buildInitialState(cards));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset whenever deck changes
  useEffect(() => {
    setStates(buildInitialState(cards));
    setFlippedIds([]);
    setMoves(0);
    setIsLocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.map((c) => c.id).join(',')]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const flipCard = useCallback(
    (cardId: string) => {
      if (isLocked) return;

      setStates((prev) => {
        const card = prev.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return prev;
        if (flippedIds.length >= 2) return prev;

        const updated = prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
        const newFlipped = [...flippedIds, cardId];

        if (newFlipped.length === 2) {
          setMoves((m) => m + 1);
          const pairA = cards.find((c) => c.id === newFlipped[0])?.pairId;
          const pairB = cards.find((c) => c.id === newFlipped[1])?.pairId;
          const matched = pairA !== undefined && pairA === pairB;

          if (matched) {
            setFlippedIds([]);
            return updated.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
            );
          } else {
            setIsLocked(true);
            setFlippedIds(newFlipped);
            timerRef.current = window.setTimeout(() => {
              setStates((s) =>
                s.map((c) => (newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c))
              );
              setFlippedIds([]);
              setIsLocked(false);
            }, MISMATCH_DELAY);
            return updated;
          }
        }

        setFlippedIds(newFlipped);
        return updated;
      });
    },
    [isLocked, flippedIds, cards]
  );

  const resetGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setStates(buildInitialState(shuffled));
    setFlippedIds([]);
    setMoves(0);
    setIsLocked(false);
  }, [cards]);

  const matchedCount = states.filter((c) => c.isMatched).length / 2;
  const totalPairs = cards.length / 2;
  const isComplete = matchedCount === totalPairs && totalPairs > 0;

  return { states, matchedCount, totalPairs, moves, isComplete, flipCard, resetGame };
}
