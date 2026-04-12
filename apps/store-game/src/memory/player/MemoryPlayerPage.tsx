import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemoryDeckDetailQuery, DEFAULT_PAIRS } from '@/api/memoryApi';
import { useGameAudio } from '@/shared/useGameAudio';
import { useConfetti } from '@/shared/useConfetti';
import { useMemoryPlayer } from './useMemoryPlayer';
import MemoryCardTile from '../components/MemoryCard';
import BoardTimer, { useTimer } from '@/board/components/BoardTimer';
import type { MemoryCard } from '@/shared/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import s from './MemoryPlayerPage.module.css';

// ─── Build shuffled card deck from pairs ──────────────────────────────

function buildCards(pairs: { id: string; equation: string; answer: string }[]): MemoryCard[] {
  const cards: MemoryCard[] = [];
  pairs.forEach((p, i) => {
    const pairId = `pair-${i}`;
    cards.push({ id: `${pairId}-eq`, pairId, type: 'equation', content: p.equation });
    cards.push({ id: `${pairId}-ans`, pairId, type: 'answer', content: p.answer });
  });
  return cards.sort(() => Math.random() - 0.5);
}

// ─── Page ─────────────────────────────────────────────────────────────

type Phase = 'intro' | 'playing' | 'complete';

const TIPS = [
  { key: 'Click a card', label: 'flip it face-up' },
  { key: 'Match 2 cards', label: 'equation + answer stays flipped' },
  { key: 'No match', label: 'both cards flip back after a moment' },
];

export default function MemoryPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  // 'default' → skip API, use built-in pairs
  const isDefault = !id || id === 'default';
  const deckQuery = useMemoryDeckDetailQuery(isDefault ? null : (id ?? null));

  const rawPairs = useMemo(() => {
    if (isDefault) return DEFAULT_PAIRS;
    return deckQuery.data?.pairs ?? DEFAULT_PAIRS;
  }, [isDefault, deckQuery.data]);

  const deckName = useMemo(() => {
    if (isDefault) return 'Default Deck';
    return deckQuery.data?.name ?? 'Memory Match';
  }, [isDefault, deckQuery.data]);

  const [deck, setDeck] = useState<MemoryCard[]>([]);
  const [phase, setPhase] = useState<Phase>('intro');
  const [musicOn, setMusicOn] = useState(true);

  // Build initial deck once pairs are available
  useEffect(() => {
    if (rawPairs.length > 0) {
      setDeck(buildCards(rawPairs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPairs]);

  const { states, matchedCount, totalPairs, moves, isComplete, flipCard, resetGame } =
    useMemoryPlayer(deck);
  const timer = useTimer();
  const audio = useGameAudio(musicOn);
  const confetti = useConfetti();

  const prevMatched = useRef(0);
  useEffect(() => {
    if (matchedCount > prevMatched.current) audio.playMatch();
    prevMatched.current = matchedCount;
  }, [matchedCount, audio]);

  useEffect(() => {
    if (isComplete && phase === 'playing') {
      setPhase('complete');
      timer.finish();
      audio.stopBgMusic();
      audio.playComplete();
      setTimeout(confetti.launch, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, phase]);

  const handleStart = () => {
    resetGame();
    setPhase('playing');
    timer.start();
    audio.startBgMusic();
  };

  const handlePlayAgain = () => {
    resetGame();
    setPhase('intro');
    timer.reset();
    audio.stopBgMusic();
    confetti.cancel();
  };

  const gridCols = 4;
  const pct = totalPairs > 0 ? Math.round((matchedCount / totalPairs) * 100) : 0;

  // Loading state while fetching deck from API
  if (!isDefault && deckQuery.isLoading) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div className={s.loading}>
            <Loader2 size={20} className={s.loadingSpinner} />
            Loading deck…
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!isDefault && deckQuery.isError) {
    return (
      <div className={s.page}>
        <div className={s.inner}>
          <div className={s.error}>
            <p className={s.errorText}>Failed to load deck: {deckQuery.error?.message}</p>
            <button className="btn btn-secondary" onClick={() => nav('/play')}>
              <ArrowLeft size={15} /> Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <p className={s.eyebrow}>Memory Match</p>
            <h1 className={s.title}>🃏 {deckName}</h1>
          </div>
          <button className="btn btn-secondary" onClick={() => nav('/play')}>
            <ArrowLeft size={15} /> Games
          </button>
        </div>

        {/* Timer */}
        <BoardTimer
          elapsed={timer.elapsed}
          state={timer.state}
          onStart={handleStart}
          onPause={() => {
            timer.pause();
            audio.stopBgMusic();
          }}
          onResume={() => {
            timer.resume();
            audio.startBgMusic();
          }}
          onFinish={() => {
            timer.finish();
            audio.stopBgMusic();
          }}
          onReset={() => {
            timer.reset();
            handlePlayAgain();
          }}
        />

        {/* Stats */}
        {phase === 'playing' && (
          <div className={s.stats}>
            <div className={s.statItem}>
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className={s.statItem}>
              <span>Matched</span>
              <strong>
                {matchedCount}/{totalPairs}
              </strong>
            </div>
            <div className={`${s.statItem} ${s.statBar}`}>
              <div className={s.progressBar}>
                <div
                  className={s.progressBarFill}
                  style={{ '--progress-width': `${pct}%` } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        )}

        {/* Game frame */}
        <div className={s.gameFrame}>
          <canvas ref={confetti.canvasRef} className="confetti-canvas" />

          {phase === 'intro' && (
            <div className="game-overlay">
              <div className="overlay-card">
                <div className="overlay-icon">🃏</div>
                <h2 className="overlay-title">Equation Match</h2>
                <p className="overlay-sub">{totalPairs} pairs</p>
                <div className="overlay-tips">
                  {TIPS.map((t) => (
                    <div key={t.key} className="overlay-tip">
                      <span className="overlay-tip-key">{t.key}</span>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
                <div className="overlay-actions">
                  <button className="btn btn-success btn-lg" onClick={handleStart}>
                    ▶ Start!
                  </button>
                  <button className="btn btn-secondary" onClick={() => setMusicOn((v) => !v)}>
                    {musicOn ? '🔊' : '🔇'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === 'complete' && (
            <div className="game-overlay game-overlay-complete">
              <div className="overlay-card overlay-card-complete">
                <div className="overlay-trophy">🏆</div>
                <h2 className="overlay-title overlay-title-complete">Complete!</h2>
                <p className="overlay-sub overlay-sub-complete">
                  {totalPairs} pairs matched in {moves} moves!
                </p>
                <div className="overlay-time">
                  {String(Math.floor(timer.elapsed / 60)).padStart(2, '0')}:
                  {String(timer.elapsed % 60).padStart(2, '0')}
                </div>
                <div className="overlay-actions">
                  <button className="btn btn-success btn-lg" onClick={handlePlayAgain}>
                    ↺ Play Again
                  </button>
                  <button className="btn btn-secondary" onClick={() => setPhase('playing')}>
                    View Board
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card grid */}
          <div className={`${s.grid} ${gridCols === 6 ? s.gridCols6 : s.gridCols4}`}>
            {deck.map((card) => {
              const state = states.find((st) => st.id === card.id);
              if (!state) return null;
              return <MemoryCardTile key={card.id} card={card} state={state} onFlip={flipCard} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
