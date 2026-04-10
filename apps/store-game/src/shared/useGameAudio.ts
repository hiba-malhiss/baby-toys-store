import { useCallback, useRef } from 'react';

export function useGameAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const bgMusicRef = useRef<{ stop: () => void } | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  }, [enabled]);

  const playTone = useCallback(
    (freq: number, type: OscillatorType = 'sine', duration = 0.12, volume = 0.16) => {
      const ctx = getCtx();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* ignore */
      }
    },
    [getCtx]
  );

  const playCorrect = useCallback(() => playTone(660, 'triangle', 0.15, 0.2), [playTone]);
  const playWrong = useCallback(() => playTone(220, 'sawtooth', 0.12, 0.15), [playTone]);
  const playComplete = useCallback(() => {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
      setTimeout(() => playTone(f, 'triangle', 0.25, 0.28), i * 110)
    );
  }, [playTone]);
  const playMatch = useCallback(() => {
    playTone(523, 'triangle', 0.1);
    setTimeout(() => playTone(659, 'triangle', 0.15), 100);
  }, [playTone]);

  const startBgMusic = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const pattern = [130, 0, 110, 0, 130, 0, 98, 0];
    let beat = 0;
    const id = setInterval(() => {
      const f = pattern[beat % pattern.length];
      if (f)
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.value = f;
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        } catch {
          /* ignore */
        }
      beat++;
    }, 250);
    bgMusicRef.current = { stop: () => clearInterval(id) };
  }, [getCtx]);

  const stopBgMusic = useCallback(() => {
    bgMusicRef.current?.stop();
    bgMusicRef.current = null;
  }, []);

  return { playCorrect, playWrong, playComplete, playMatch, startBgMusic, stopBgMusic };
}
