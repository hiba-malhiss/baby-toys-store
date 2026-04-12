import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import { useMemoryDeckDetailQuery, DEFAULT_PAIRS } from '@/api/memoryApi';
import { useGameAudio } from '@/shared/useGameAudio';
import { useConfetti } from '@/shared/useConfetti';
import BoardTimer, { useTimer } from '@/board/components/BoardTimer';
import { loadMazeConfig } from '../shared/mazeTypes';
import { buildMaze, getNeighbours, isValidStep } from '../shared/mazeGenerator';
import type { MazeCell, MazePlayerState } from '../shared/mazeTypes';
import s from './MazePlayerPage.module.css';

type Phase = 'loading' | 'intro' | 'playing' | 'complete';

// ─── Direction key map ────────────────────────────────────────────────
const KEY_DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
};

export default function MazePlayerPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const nav = useNavigate();
  const isDefault = !deckId || deckId === 'default';

  // ── Data loading ──────────────────────────────────────────────────
  const deckQuery = useMemoryDeckDetailQuery(isDefault ? null : (deckId ?? null));
  const pairs = useMemo(() => {
    if (isDefault) return DEFAULT_PAIRS;
    return deckQuery.data?.pairs ?? [];
  }, [isDefault, deckQuery.data]);

  const config = useMemo(() => loadMazeConfig(deckId ?? 'default'), [deckId]);

  // ── Build maze cells ──────────────────────────────────────────────
  const cells = useMemo<MazeCell[]>(() => {
    if (!config || pairs.length === 0) return [];
    return buildMaze(config, pairs);
  }, [config, pairs]);

  const startIdx = cells.findIndex((c) => c.isStart);
  const endIdx = cells.findIndex((c) => c.isEnd);

  // ── Game state ────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('loading');
  const [playerState, setPlayerState] = useState<MazePlayerState>({
    playerPos: startIdx >= 0 ? startIdx : 0,
    visitedPath: startIdx >= 0 ? [startIdx] : [],
    solvedPairIds: [],
    wrongSteps: 0,
  });
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);

  const [musicOn, setMusicOn] = useState(true);
  const audio = useGameAudio(true);
  const confetti = useConfetti();
  const timer = useTimer();

  // ── Init when data arrives ────────────────────────────────────────
  useEffect(() => {
    if (cells.length > 0 && startIdx >= 0) {
      setPhase('intro');
      setPlayerState({
        playerPos: startIdx,
        visitedPath: [startIdx],
        solvedPairIds: [],
        wrongSteps: 0,
      });
    }
  }, [cells.length, startIdx]);

  const startGame = useCallback(() => {
    setPhase('playing');
    timer.start();
    if (musicOn) audio.startBgMusic();
  }, [timer, audio, musicOn]);

  // ── Movement ──────────────────────────────────────────────────────
  const tryMove = useCallback(
    (targetIdx: number) => {
      if (phase !== 'playing') return;
      const target = cells[targetIdx];
      if (!target || target.isWall) return;

      // Must be adjacent
      const neighbours = getNeighbours(playerState.playerPos, config!.width, config!.height, cells);
      if (!neighbours.includes(targetIdx)) return;

      const valid = isValidStep(target, pairs, config!.targetAnswer);

      if (!valid) {
        audio.playWrong();
        setWrongFlash(targetIdx);
        setTimeout(() => setWrongFlash(null), 500);
        setPlayerState((ps) => ({ ...ps, wrongSteps: ps.wrongSteps + 1 }));
        return;
      }

      // Valid step
      audio.playCorrect();
      const newPath = playerState.visitedPath.includes(targetIdx)
        ? playerState.visitedPath.slice(0, playerState.visitedPath.indexOf(targetIdx) + 1) // backtrack
        : [...playerState.visitedPath, targetIdx];

      const newSolved =
        target.pairId && !playerState.solvedPairIds.includes(target.pairId)
          ? [...playerState.solvedPairIds, target.pairId]
          : playerState.solvedPairIds;

      setPlayerState((ps) => ({
        ...ps,
        playerPos: targetIdx,
        visitedPath: newPath,
        solvedPairIds: newSolved,
      }));

      // Check win
      if (target.isEnd) {
        timer.finish();
        audio.stopBgMusic();
        audio.playComplete();
        confetti.launch();
        setPhase('complete');
      }
    },
    [phase, cells, playerState, config, pairs, audio, timer, confetti]
  );

  // ── Keyboard controls ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.key];
      if (!dir) return;
      e.preventDefault();
      const [dc, dr] = dir;
      if (!config) return;
      const cur = playerState.playerPos;
      const col = (cur % config.width) + dc;
      const row = Math.floor(cur / config.width) + dr;
      if (col < 0 || col >= config.width || row < 0 || row >= config.height) return;
      tryMove(row * config.width + col);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, playerState.playerPos, config, tryMove]);

  const reset = useCallback(() => {
    audio.stopBgMusic();
    timer.reset();
    setPhase('intro');
    setPlayerState({
      playerPos: startIdx,
      visitedPath: [startIdx],
      solvedPairIds: [],
      wrongSteps: 0,
    });
  }, [audio, timer, startIdx]);

  // ── Loading / error states ────────────────────────────────────────
  if (phase === 'loading' || (deckQuery.isLoading && !isDefault)) {
    return (
      <div className={s.loadingPage}>
        <Loader2 size={32} className={s.spin} />
        <p>Loading maze…</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={s.loadingPage}>
        <p style={{ color: 'var(--danger)' }}>
          No maze config found for this deck. Ask an admin to set it up.
        </p>
        <button className="btn btn-secondary" onClick={() => nav('/play')}>
          Back to games
        </button>
      </div>
    );
  }

  const { width, height, targetAnswer } = config;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={s.page}>
      <canvas ref={confetti.canvasRef} className="confetti-canvas" />

      {/* Header */}
      <div className={s.topBar}>
        <button
          className={s.backBtn}
          onClick={() => {
            audio.stopBgMusic();
            nav('/play');
          }}
        >
          <ArrowLeft size={15} /> Games
        </button>
        <div className={s.topCenter}>
          <span className={s.deckName}>{config.deckName} Maze</span>
          <span className={s.targetBadge}>Walk on = {targetAnswer}</span>
        </div>
        <div className={s.topRight}>
          <BoardTimer elapsed={timer.elapsed} state={timer.state} />
          <button
            className={s.iconBtn}
            onClick={() => {
              setMusicOn((m) => !m);
            }}
            title="Toggle music"
          >
            {musicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button className={s.iconBtn} onClick={reset} title="Restart">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Intro overlay */}
      {phase === 'intro' && (
        <div className="game-overlay" style={{ position: 'fixed', borderRadius: 0 }}>
          <div className="overlay-card">
            <div className="overlay-icon">🗺️</div>
            <h2 className="overlay-title">{config.deckName} Maze</h2>
            <p className="overlay-sub">
              Navigate from 🟢 Start to 🔴 End.
              <br />
              You can only step on cells where the equation equals <strong>{targetAnswer}</strong>.
            </p>
            <div className="overlay-tips">
              <div className="overlay-tip">
                <span className="overlay-tip-key">Arrow keys / WASD</span>
                <span>Move your character</span>
              </div>
              <div className="overlay-tip">
                <span className="overlay-tip-key">Click a cell</span>
                <span>Move with mouse</span>
              </div>
              <div className="overlay-tip">
                <span className="overlay-tip-key">Wrong step</span>
                <span>Cell flashes red, try another path</span>
              </div>
            </div>
            <div className="overlay-actions">
              <button className="btn btn-primary btn-lg" onClick={startGame}>
                Start Maze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete overlay */}
      {phase === 'complete' && (
        <div
          className="game-overlay game-overlay-complete"
          style={{ position: 'fixed', borderRadius: 0 }}
        >
          <div className="overlay-card overlay-card-complete">
            <div className="overlay-trophy">🏆</div>
            <h2 className={`overlay-title overlay-title-complete`}>Maze Complete!</h2>
            <p className="overlay-sub overlay-sub-complete">
              You solved {playerState.solvedPairIds.length} equations with {playerState.wrongSteps}{' '}
              wrong step{playerState.wrongSteps !== 1 ? 's' : ''}.
            </p>
            <div className="overlay-time">
              {String(Math.floor(timer.elapsed / 60)).padStart(2, '0')}:
              {String(timer.elapsed % 60).padStart(2, '0')}
            </div>
            <div className="overlay-actions">
              <button className="btn btn-secondary" onClick={reset}>
                Play Again
              </button>
              <button className="btn btn-primary" onClick={() => nav('/play')}>
                More Games
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maze grid */}
      <div className={s.mazeWrap}>
        <div
          className={s.mazeGrid}
          style={{
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            const isPlayer = cell.index === playerState.playerPos;
            const isVisited = playerState.visitedPath.includes(cell.index);
            const isSolved = cell.pairId ? playerState.solvedPairIds.includes(cell.pairId) : false;
            const isWrongFlash = wrongFlash === cell.index;
            const pair = cell.pairId ? pairs.find((p) => p.id === cell.pairId) : null;
            const neighbours =
              phase === 'playing' ? getNeighbours(playerState.playerPos, width, height, cells) : [];
            const isReachable = neighbours.includes(cell.index) && !cell.isWall;

            const cls = [
              s.cell,
              cell.isWall ? s.cellWall : s.cellPath,
              isPlayer ? s.cellPlayer : '',
              cell.isStart ? s.cellStart : '',
              cell.isEnd ? s.cellEnd : '',
              isVisited && !isPlayer ? s.cellVisited : '',
              isSolved ? s.cellSolved : '',
              isWrongFlash ? s.cellWrong : '',
              isReachable && phase === 'playing' ? s.cellReachable : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={cell.index}
                className={cls}
                onClick={() => tryMove(cell.index)}
                title={pair ? `${pair.equation} = ?` : undefined}
              >
                {isPlayer && <span className={s.playerIcon}>😀</span>}
                {cell.isEnd && !isPlayer && <span className={s.endIcon}>🏁</span>}
                {!cell.isWall && !isPlayer && !cell.isEnd && pair && (
                  <span className={s.equation}>{pair.equation}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats bar */}
      {phase === 'playing' && (
        <div className={s.statsBar}>
          <span>✅ Solved: {playerState.solvedPairIds.length}</span>
          <span>❌ Wrong steps: {playerState.wrongSteps}</span>
          <span>🎯 Target: = {targetAnswer}</span>
        </div>
      )}
    </div>
  );
}
