import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, RotateCcw, Timer } from 'lucide-react';
import s from './BoardTimer.module.css';

export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  const ref = useRef<number | null>(null);

  const clear = () => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
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
    if (state === 'running') ref.current = window.setInterval(() => setElapsed((n) => n + 1), 1000);
    else clear();
    return clear;
  }, [state]);

  return { elapsed, state, start, pause, resume, finish, reset };
}

export function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

type Props = {
  elapsed: number;
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
};

export default function BoardTimer({
  elapsed,
  state,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
}: Props) {
  return (
    <div className={s.timer}>
      <span className={s.label}>
        <Timer size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
        Timer
      </span>
      <span
        className={`${s.display} ${state === 'running' ? s.running : ''} ${state === 'finished' ? s.finished : ''}`}
      >
        {formatTime(elapsed)}
      </span>
      <div className={s.controls}>
        {state === 'idle' && (
          <button className="btn btn-success" onClick={onStart}>
            <Play size={13} /> Start
          </button>
        )}
        {state === 'running' && (
          <>
            <button className="btn btn-warn" onClick={onPause}>
              <Pause size={13} /> Pause
            </button>
            <button className="btn btn-secondary btn-icon" onClick={onFinish}>
              <Square size={13} />
            </button>
          </>
        )}
        {state === 'paused' && (
          <>
            <button className="btn btn-success" onClick={onResume}>
              <Play size={13} /> Resume
            </button>
            <button className="btn btn-secondary btn-icon" onClick={onFinish}>
              <Square size={13} />
            </button>
          </>
        )}
        {state === 'finished' && (
          <button className="btn btn-secondary" onClick={onReset}>
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
