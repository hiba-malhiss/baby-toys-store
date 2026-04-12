import { useEffect, useRef } from 'react';
import type { GameState } from '../hooks/useSnakeGame';
import { COLS, ROWS, CELL } from '../hooks/useSnakeGame';
import { lerpColor } from '../utils/math';

interface Props {
  state: GameState;
}

function isDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function rRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function GameCanvas({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw on every render (parent passes key=renderTick to force re-render each tick)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dark = isDark();
    const W = COLS * CELL,
      H = ROWS * CELL;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = dark ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, H);
      ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * CELL);
      ctx.lineTo(W, j * CELL);
      ctx.stroke();
    }

    // Equation blocks
    for (const eq of state.eqs) {
      const px = eq.x * CELL,
        py = eq.y * CELL,
        pad = 2;
      if (eq.correct) {
        ctx.fillStyle = dark ? 'rgba(37,99,235,0.22)' : 'rgba(37,99,235,0.10)';
        ctx.strokeStyle = dark ? 'rgba(96,165,250,0.60)' : 'rgba(37,99,235,0.45)';
        ctx.lineWidth = 1;
      } else {
        ctx.fillStyle = dark ? 'rgba(220,38,38,0.18)' : 'rgba(220,38,38,0.07)';
        ctx.strokeStyle = dark ? 'rgba(248,113,113,0.50)' : 'rgba(220,38,38,0.35)';
        ctx.lineWidth = 0.5;
      }
      rRect(ctx, px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, 5);
      ctx.fill();
      ctx.stroke();

      const fs = eq.expr.length > 5 ? 8 : eq.expr.length > 4 ? 9 : 10;
      ctx.font = `${fs}px system-ui, sans-serif`;
      ctx.fillStyle = eq.correct ? (dark ? '#93c5fd' : '#1d4ed8') : dark ? '#fca5a5' : '#b91c1c';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(eq.expr, px + CELL / 2, py + CELL / 2);
    }

    // Snake body (back → front, skip head at index 0)
    for (let i = state.snake.length - 1; i >= 1; i--) {
      const seg = state.snake[i];
      const t = i / state.snake.length;
      ctx.fillStyle = lerpColor('#34d399', '#059669', t);
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 0.5;
      rRect(ctx, seg.x * CELL + 3, seg.y * CELL + 3, CELL - 6, CELL - 6, 5);
      ctx.fill();
      ctx.stroke();

      // Faint value on each body segment
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(state.snakeVal), seg.x * CELL + CELL / 2, seg.y * CELL + CELL / 2);
    }

    // Snake head
    const h = state.snake[0];
    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#022c22';
    ctx.lineWidth = 1;
    rRect(ctx, h.x * CELL + 1, h.y * CELL + 1, CELL - 2, CELL - 2, 7);
    ctx.fill();
    ctx.stroke();

    // Value on head — large and clear
    ctx.font = `bold ${state.snakeVal > 9 ? '12' : '14'}px system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(state.snakeVal), h.x * CELL + CELL / 2, h.y * CELL + CELL / 2);
  }, [state]); // re-render when state changes

  return (
    <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} style={{ display: 'block' }} />
  );
}
