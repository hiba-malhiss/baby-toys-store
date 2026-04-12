export function rnd(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function shuffle<T>(arr: T[]): T[] {
  const b = [...arr];
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(0, i);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function genSnakeValue(): number {
  return rnd(2, 15);
}

export function makeAutoExpr(val: number, correct: boolean): string {
  const ops = ['+', '-', '×', '÷'] as const;
  for (let i = 0; i < 40; i++) {
    const op = ops[rnd(0, 3)];
    let a: number, b: number, result: number, expr: string;
    if (op === '+') {
      a = rnd(0, val);
      b = val - a;
      result = a + b;
      expr = `${a}+${b}`;
    } else if (op === '-') {
      a = rnd(val, val + 12);
      b = a - val;
      result = a - b;
      expr = `${a}-${b}`;
    } else if (op === '×') {
      const factors: number[] = [];
      for (let k = 1; k <= Math.min(val, 12); k++) if (val % k === 0) factors.push(k);
      if (factors.length < 2) continue;
      a = factors[rnd(0, factors.length - 1)];
      b = val / a;
      result = a * b;
      expr = `${a}×${b}`;
    } else {
      b = rnd(1, 6);
      a = val * b;
      result = a / b;
      expr = `${a}÷${b}`;
    }
    if (correct && result === val) return expr;
    if (!correct && result !== val) return expr;
  }
  return correct ? `${val - 1}+1` : `${val}+1`;
}

export function lerpColor(a: string, b: string, t: number): string {
  const ah = a.slice(1),
    bh = b.slice(1);
  const ar = parseInt(ah.slice(0, 2), 16),
    ag = parseInt(ah.slice(2, 4), 16),
    ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16),
    bg = parseInt(bh.slice(2, 4), 16),
    bb = parseInt(bh.slice(4, 6), 16);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}
