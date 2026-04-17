import { useState } from 'react';
import type { Deck } from '../types';
import { useSnakeGame } from '../hooks/useSnakeGame';
import { GameCanvas } from './GameCanvas';
import styles from './GameView.module.css';

interface Props {
  decks: Deck[];
}

export function GameView({ decks }: Props) {
  const [speed, setSpeed] = useState<'slow' | 'fast'>('slow');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('__auto');

  const selectedDeck = decks.find((d) => String(d.id) === selectedDeckId) ?? null;

  const {
    state,
    floatingMsgs,
    gameOver,
    started,
    startGame,
    setDir,
    startMusic,
    stopMusic,
    renderTick,
    canvasWrapRef,
    flashElRef,
  } = useSnakeGame(selectedDeck, speed, musicEnabled);

  function handleMusic() {
    const next = !musicEnabled;
    setMusicEnabled(next);
    if (next && started && !gameOver) startMusic();
    else stopMusic();
  }

  return (
    <div className={styles.wrap}>
      {/* HUD */}
      <div className={styles.hud}>
        <div className={styles.hudLeft}>
          <span className={styles.scoreLbl}>Score</span>
          <span className={styles.scoreVal}>{state.score}</span>
        </div>
        <div className={styles.hearts}>
          {'❤️'.repeat(state.hearts)}
          {'🖤'.repeat(Math.max(0, 3 - state.hearts))}
        </div>
        <div className={styles.hudRight}>
          <div className={styles.row}>
            <span className={styles.label}>Deck:</span>
            <select
              className={styles.select}
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
            >
              <option value="__auto">Auto (random math)</option>
              {decks.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Speed:</span>
            <div className={styles.toggle}>
              <button
                className={speed === 'slow' ? styles.toggleActive : styles.toggleBtn}
                onClick={() => setSpeed('slow')}
              >
                Slow
              </button>
              <button
                className={speed === 'fast' ? styles.toggleActive : styles.toggleBtn}
                onClick={() => setSpeed('fast')}
              >
                Fast
              </button>
            </div>
            <button className={styles.musicBtn} onClick={handleMusic}>
              {musicEnabled ? '♪ On' : '♪ Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas wrapper — ref passed to hook for direct DOM shake/flash */}
      <div className={styles.canvasWrap} ref={canvasWrapRef}>
        {/* renderTick prop triggers GameCanvas to redraw via useEffect without remounting */}
        <GameCanvas state={state} renderTick={renderTick} />

        {/* Flash overlay — manipulated directly via flashElRef */}
        <div className={styles.flash} ref={flashElRef} />

        {/* Floating messages (hearts / check marks) */}
        {floatingMsgs.map((m) => (
          <div
            key={m.id}
            className={`${styles.floatMsg} ${m.type === 'check' ? styles.floatCheck : styles.floatHeart}`}
            style={{ left: m.x, top: m.y }}
          >
            {m.text}
          </div>
        ))}

        {/* Start / game-over overlay */}
        {(!started || gameOver) && (
          <div className={styles.overlay}>
            <h2 className={styles.overlayTitle}>
              {gameOver ? (state.score >= 50 ? 'Nice work! 🎉' : 'Game over 💀') : 'Math Snake 🐍'}
            </h2>
            {gameOver ? (
              <p className={styles.overlayText}>
                Final score: <strong>{state.score}</strong>
              </p>
            ) : (
              <>
                <p className={styles.overlayText}>
                  Your snake carries a number. Eat equations that equal it!
                </p>
                <div className={styles.legend}>
                  <span className={styles.legendItem}>
                    <span className={styles.dotOk} />
                    Correct
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.dotBad} />
                    Wrong
                  </span>
                </div>
              </>
            )}
            <button className={styles.startBtn} onClick={startGame}>
              {gameOver ? 'Play again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad */}
      <div className={styles.dpad}>
        <span />
        <button onClick={() => setDir({ x: 0, y: -1 })}>▲</button>
        <span />
        <button onClick={() => setDir({ x: -1, y: 0 })}>◀</button>
        <span />
        <button onClick={() => setDir({ x: 1, y: 0 })}>▶</button>
        <span />
        <button onClick={() => setDir({ x: 0, y: 1 })}>▼</button>
        <span />
      </div>
    </div>
  );
}
