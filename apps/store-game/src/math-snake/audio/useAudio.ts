import { useRef, useCallback } from 'react';

export function useAudio() {
  const actxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<{ master: GainNode; tid: ReturnType<typeof setInterval> } | null>(null);

  function getCtx(): AudioContext {
    if (!actxRef.current) {
      actxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (actxRef.current.state === 'suspended') {
      actxRef.current.resume();
    }
    return actxRef.current;
  }

  function playTone(freq: number, type: OscillatorType, dur: number, vol: number, delay = 0) {
    try {
      const a = getCtx();
      const osc = a.createOscillator();
      const gain = a.createGain();
      osc.connect(gain);
      gain.connect(a.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, a.currentTime + delay);
      gain.gain.setValueAtTime(0, a.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, a.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + delay + dur);
      osc.start(a.currentTime + delay);
      osc.stop(a.currentTime + delay + dur + 0.05);
    } catch (_) {
      /* audio not available */
    }
  }

  const soundCorrect = useCallback(() => {
    playTone(440, 'sine', 0.12, 0.18);
    playTone(550, 'sine', 0.12, 0.15, 0.08);
    playTone(660, 'sine', 0.18, 0.12, 0.16);
  }, []);

  const soundWrong = useCallback(() => {
    playTone(220, 'sawtooth', 0.08, 0.22);
    playTone(180, 'sawtooth', 0.08, 0.22, 0.06);
    playTone(130, 'sawtooth', 0.18, 0.2, 0.12);
  }, []);

  const soundWall = useCallback(() => {
    playTone(100, 'square', 0.15, 0.25);
    playTone(80, 'square', 0.2, 0.2, 0.05);
  }, []);

  const soundOver = useCallback(() => {
    [392, 349, 330, 294, 262].forEach((f, i) => playTone(f, 'triangle', 0.25, 0.18, i * 0.14));
  }, []);

  const soundLevel = useCallback(() => {
    [262, 330, 392, 523].forEach((f, i) => playTone(f, 'sine', 0.18, 0.2, i * 0.1));
  }, []);

  const startMusic = useCallback(() => {
    stopMusic();
    try {
      const a = getCtx();
      const master = a.createGain();
      master.gain.value = 0.07;
      master.connect(a.destination);

      const melody = [262, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 262];
      const bass = [131, 131, 165, 196, 131, 131, 165, 196, 131, 131, 165, 131];
      const beat = 60 / 120; // 120 bpm
      let t = a.currentTime + 0.1;

      function scheduleBar() {
        melody.forEach((f, i) => {
          const o = a.createOscillator(),
            g = a.createGain();
          o.type = 'square';
          o.frequency.value = f;
          g.gain.setValueAtTime(0, t + i * beat);
          g.gain.linearRampToValueAtTime(0.5, t + i * beat + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * beat + beat * 0.8);
          o.connect(g);
          g.connect(master);
          o.start(t + i * beat);
          o.stop(t + i * beat + beat);
        });
        bass.forEach((f, i) => {
          const o = a.createOscillator(),
            g = a.createGain();
          o.type = 'triangle';
          o.frequency.value = f;
          g.gain.setValueAtTime(0, t + i * beat);
          g.gain.linearRampToValueAtTime(0.3, t + i * beat + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, t + i * beat + beat * 0.5);
          o.connect(g);
          g.connect(master);
          o.start(t + i * beat);
          o.stop(t + i * beat + beat);
        });
        t += melody.length * beat;
      }

      scheduleBar();
      scheduleBar();
      const totalMs = melody.length * beat * 2 * 1000;
      const tid = setInterval(() => {
        scheduleBar();
        scheduleBar();
      }, totalMs);
      musicRef.current = { master, tid };
    } catch (_) {
      /* audio not available */
    }
  }, []);

  const stopMusic = useCallback(() => {
    if (!musicRef.current) return;
    try {
      clearInterval(musicRef.current.tid);
      musicRef.current.master.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.3);
    } catch (_) {
      /* ignore */
    }
    musicRef.current = null;
  }, []);

  return { soundCorrect, soundWrong, soundWall, soundOver, soundLevel, startMusic, stopMusic };
}
