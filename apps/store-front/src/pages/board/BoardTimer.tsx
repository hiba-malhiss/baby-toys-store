import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Timer hook ──────────────────────────────────────────── */
export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export interface UseTimerResult {
  elapsed: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  finish: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerResult {
  const [elapsed, setElapsed] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const intervalRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    setElapsed(0);
    setState('running');
  }, []);
  const pause = useCallback(() => setState('paused'), []);
  const resume = useCallback(() => setState('running'), []);
  const finish = useCallback(() => setState('finished'), []);
  const reset = useCallback(() => {
    clear();
    setElapsed(0);
    setState('idle');
  }, []);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = window.setInterval(() => setElapsed((p) => p + 1), 1000);
    } else {
      clear();
    }
    return clear;
  }, [state]);

  return { elapsed, state, start, pause, resume, finish, reset };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ─── UI ─────────────────────────────────────────────────── */
interface BoardTimerProps {
  elapsed: number;
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
}

const BoardTimer = ({
  elapsed,
  state,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
}: BoardTimerProps) => {
  const cls = [
    'board-timer__display',
    state === 'running' ? 'is-running' : '',
    state === 'finished' ? 'is-finished' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="board-timer">
      <span className="board-timer__label">Timer</span>
      <span className={cls}>{formatTime(elapsed)}</span>
      <div className="board-timer__controls">
        {state === 'idle' && (
          <button type="button" className="board-button board-button--success" onClick={onStart}>
            ▶ Start
          </button>
        )}
        {state === 'running' && (
          <>
            <button type="button" className="board-button board-button--warn" onClick={onPause}>
              ⏸ Pause
            </button>
            <button type="button" className="board-button" onClick={onFinish}>
              ⏹ Finish
            </button>
          </>
        )}
        {state === 'paused' && (
          <>
            <button type="button" className="board-button board-button--success" onClick={onResume}>
              ▶ Resume
            </button>
            <button type="button" className="board-button" onClick={onFinish}>
              ⏹ Finish
            </button>
          </>
        )}
        {state === 'finished' && (
          <button type="button" className="board-button board-button--secondary" onClick={onReset}>
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardTimer;
