import type { MemoryCard, MemoryCardState } from '@/shared/types';
import s from './MemoryCard.module.css';

type Props = { card: MemoryCard; state: MemoryCardState; onFlip: (id: string) => void };

export default function MemoryCardTile({ card, state, onFlip }: Props) {
  const { isFlipped, isMatched } = state;
  const faceUp = isFlipped || isMatched;

  const cls = [
    s.card,
    faceUp ? s.flipped : '',
    isMatched ? s.matched : '',
    card.type === 'answer' ? s.answer : s.equation,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={cls}
      onClick={() => !faceUp && onFlip(card.id)}
      aria-label={faceUp ? card.content : 'Hidden card'}
      disabled={faceUp}
    >
      <span className={s.back}>?</span>
      <span className={s.front}>
        {card.type === 'equation' && <span className={s.typeLabel}>Equation</span>}
        <span className={s.content}>{card.content}</span>
        {isMatched && <span className={s.matchIcon}>✓</span>}
      </span>
    </button>
  );
}
