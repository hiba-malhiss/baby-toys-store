import { type CSSProperties, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoardDetailQuery } from '@/api/boardApi';
import { sanitizeBoard, evaluateEquation, dtoToBoard } from '@/shared/boardUtils';
import { usePaintInteraction } from '@/shared/usePaintInteraction';
import { useGameAudio } from '@/shared/useGameAudio';
import { useConfetti } from '@/shared/useConfetti';
import { useBoardPlayer } from './useBoardPlayer';
import BoardTimer, { useTimer } from '../components/BoardTimer';
import ColorPalette from '../components/ColorPalette';
import type { BoardConfig, BoardPlayerCell, BoardTriangleKey } from '@/shared/types';
import { ArrowLeft, Star, Timer } from 'lucide-react';
import s from './BoardPlayerPage.module.css';

// ─── PaintGrid (inline — tightly coupled to player page) ─────────────

function PaintGrid({
  board,
  cellsState,
  onPaintCell,
}: {
  board: BoardConfig;
  cellsState: BoardPlayerCell[];
  onPaintCell: (i: number, k?: BoardTriangleKey) => void;
}) {
  const paint = usePaintInteraction(onPaintCell);

  return (
    <div
      className={`board-grid ${paint.isShiftHeld ? 'board-grid--ranging' : 'board-grid--painting'}`}
      style={{ gridTemplateColumns: `repeat(${board.width},minmax(0,1fr))` } as CSSProperties}
      onMouseDown={paint.onMouseDown}
      onMouseUp={paint.onMouseUp}
    >
      {Array.from({ length: board.width * board.height }, (_, i) => {
        const sol = board.solution[i];
        const cs = cellsState[i];
        const topColor = board.colors.find((c) => c.id === sol?.top);
        const botColor = board.colors.find((c) => c.id === sol?.bottom);
        const isSplit = sol?.splitMode !== 'none';
        const topHex =
          cs?.top.isSolved || cs?.top.feedback === 'correct' ? topColor?.hex : '#ffffff';
        const botHex =
          cs?.bottom.isSolved || cs?.bottom.feedback === 'correct' ? botColor?.hex : '#ffffff';
        const topLabel = topColor ? evaluateEquation(topColor.equation) : '?';
        const botLabel = botColor ? evaluateEquation(botColor.equation) : '?';
        const cellCls = [
          'board-split-cell board-split-cell--player',
          paint.isCellInRange(i) ? 'is-range-highlight' : '',
          paint.anchorIndex === i ? 'is-anchor' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={`${board.id}-${i}`}
            className={cellCls}
            onMouseEnter={() => paint.setHoveredIndex(i)}
          >
            {isSplit && sol ? (
              <>
                <button
                  type="button"
                  className={[
                    'board-triangle',
                    `board-triangle--top`,
                    `board-triangle--split-${sol.splitMode}`,
                    'board-triangle--player',
                    cs?.top.feedback === 'correct' ? 'is-correct' : '',
                    cs?.top.feedback === 'incorrect' ? 'is-incorrect' : '',
                    cs?.top.isSolved ? 'is-solved' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ backgroundColor: topHex ?? '#fff' }}
                  onClick={() => paint.handleCellClick(i, 'top')}
                  onMouseEnter={() => paint.handleCellEnter(i, 'top')}
                >
                  {!cs?.top.isSolved && (
                    <span
                      className={`board-triangle__label board-triangle__label--top board-triangle__label--split-${sol.splitMode}`}
                    >
                      {topLabel}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className={[
                    'board-triangle',
                    `board-triangle--bottom`,
                    `board-triangle--split-${sol.splitMode}`,
                    'board-triangle--player',
                    cs?.bottom.feedback === 'correct' ? 'is-correct' : '',
                    cs?.bottom.feedback === 'incorrect' ? 'is-incorrect' : '',
                    cs?.bottom.isSolved ? 'is-solved' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ backgroundColor: botHex ?? '#fff' }}
                  onClick={() => paint.handleCellClick(i, 'bottom')}
                  onMouseEnter={() => paint.handleCellEnter(i, 'bottom')}
                >
                  {!cs?.bottom.isSolved && (
                    <span
                      className={`board-triangle__label board-triangle__label--bottom board-triangle__label--split-${sol.splitMode}`}
                    >
                      {botLabel}
                    </span>
                  )}
                </button>
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                >
                  <line
                    x1={sol.splitMode === 'left' ? 0 : 100}
                    y1="0"
                    x2={sol.splitMode === 'left' ? 100 : 0}
                    y2="100"
                    stroke="rgba(15,23,42,.22)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </>
            ) : (
              <button
                type="button"
                className={[
                  'board-cell-full board-cell-full--player',
                  cs?.top.feedback === 'correct' && cs?.bottom.feedback === 'correct'
                    ? 'is-correct'
                    : '',
                  cs?.top.feedback === 'incorrect' || cs?.bottom.feedback === 'incorrect'
                    ? 'is-incorrect'
                    : '',
                  cs?.top.isSolved && cs?.bottom.isSolved ? 'is-solved' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ backgroundColor: topHex ?? botHex ?? '#fff' }}
                onClick={() => paint.handleCellClick(i)}
                onMouseEnter={() => paint.handleCellEnter(i)}
              >
                {!cs?.top.isSolved && <span>{topLabel}</span>}
              </button>
            )}
            {paint.anchorIndex === i && <span className="board-cell-anchor-dot" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

const TIPS = [
  { key: 'Click', label: 'paint one cell' },
  { key: 'Drag', label: 'paint many cells' },
  { key: 'Shift + 2 clicks', label: 'fill a range' },
];

type Phase = 'intro' | 'playing' | 'complete';

export default function BoardPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { data: boardDto, isLoading } = useBoardDetailQuery(id ? Number(id) : null);
  const board = boardDto ? sanitizeBoard(dtoToBoard(boardDto)) : null;

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [musicOn, setMusicOn] = useState(true);

  useEffect(() => {
    if (board) setSelectedColorId(board.colors[0]?.id ?? null);
  }, [board?.id]);

  const { cellsState, paintCell, solvedCount, totalCount, isComplete } = useBoardPlayer(
    board,
    selectedColorId
  );
  const timer = useTimer();
  const audio = useGameAudio(musicOn);
  const confetti = useConfetti();

  useEffect(() => {
    if (isComplete && phase === 'playing') {
      setPhase('complete');
      timer.finish();
      audio.stopBgMusic();
      audio.playComplete();
      setTimeout(confetti.launch, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, phase]);

  const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
  const stars = pct >= 100 ? '🌟🌟🌟' : pct >= 66 ? '🌟🌟' : pct >= 33 ? '🌟' : '☆☆☆';

  if (isLoading)
    return (
      <div className={s.page}>
        <p className="helper-text">Loading board…</p>
      </div>
    );
  if (!board)
    return (
      <div className={s.page}>
        <p className="helper-text">
          Board not found.{' '}
          <button className="btn btn-secondary" onClick={() => nav('/play')}>
            <ArrowLeft size={15} /> Back
          </button>
        </p>
      </div>
    );

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <p className={s.eyebrow}>Paint by Equation</p>
            <h1 className={s.title}>{board.name}</h1>
          </div>
          <div className={s.headerRight}>
            <button className="btn btn-secondary" onClick={() => nav('/play')}>
              ← Games
            </button>
            <div className={s.statusCard}>
              <span>Solved</span>
              <strong>
                {solvedCount} / {totalCount}
              </strong>
            </div>
          </div>
        </div>

        <div className={s.shell}>
          <div>
            <ColorPalette
              colors={board.colors}
              selectedColorId={selectedColorId}
              onSelect={setSelectedColorId}
            />
          </div>

          <div className={s.workspace}>
            <BoardTimer
              elapsed={timer.elapsed}
              state={timer.state}
              onStart={() => {
                setPhase('playing');
                timer.start();
                audio.startBgMusic();
              }}
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
                setPhase('intro');
                audio.stopBgMusic();
                confetti.cancel();
              }}
            />

            {/* Progress */}
            <div className={s.progressRow}>
              <span className={s.progressLabel}>Progress</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className={s.progressCount}>{pct}%</span>
              <span className={s.progressStars}>{stars}</span>
            </div>

            {/* Game frame */}
            <div className={s.gameFrame}>
              <canvas ref={confetti.canvasRef} className="confetti-canvas" />

              {phase === 'intro' && (
                <div className="game-overlay">
                  <div className="overlay-card">
                    <div className="overlay-icon">🎨</div>
                    <h2 className="overlay-title">{board.name}</h2>
                    <p className="overlay-sub">
                      {board.width}×{board.height} · {board.colors.length} colors · {totalCount}{' '}
                      targets
                    </p>
                    <div className="overlay-tips">
                      {TIPS.map((t) => (
                        <div key={t.key} className="overlay-tip">
                          <span className="overlay-tip-key">{t.key}</span>
                          <span>{t.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="overlay-actions">
                      <button
                        className="btn btn-success btn-lg"
                        onClick={() => {
                          setPhase('playing');
                          timer.start();
                          audio.startBgMusic();
                        }}
                      >
                        ▶ Start!
                      </button>
                      <button
                        className={`btn btn-secondary ${!musicOn ? '' : ''}`}
                        onClick={() => setMusicOn((v) => !v)}
                      >
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
                    <h2 className={`overlay-title overlay-title-complete`}>Complete!</h2>
                    <p className="overlay-sub overlay-sub-complete">
                      You solved all {totalCount} targets!
                    </p>
                    <div className="overlay-time">
                      {String(Math.floor(timer.elapsed / 60)).padStart(2, '0')}:
                      {String(timer.elapsed % 60).padStart(2, '0')}
                    </div>
                    <div className="overlay-actions">
                      <button
                        className="btn btn-success btn-lg"
                        onClick={() => {
                          timer.reset();
                          setPhase('intro');
                          audio.stopBgMusic();
                          confetti.cancel();
                        }}
                      >
                        ↺ Play Again
                      </button>
                      <button className="btn btn-secondary" onClick={() => setPhase('playing')}>
                        View Board
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="card" style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
                <div className="card-header">
                  <h3>🎮 Play Grid</h3>
                  <p>Click or drag · Shift + 2 clicks to range-fill</p>
                </div>
                <PaintGrid board={board} cellsState={cellsState} onPaintCell={paintCell} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
