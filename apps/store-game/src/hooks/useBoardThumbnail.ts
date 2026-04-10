import { useEffect, useRef, useState } from 'react';
import { useBoardDetailQuery } from '../api/boardApi';

/**
 * Renders a board's solution as a pixel-art thumbnail onto a <canvas> element.
 *
 * Usage:
 *   const canvasRef = useBoardThumbnail(boardId);
 *   return <canvas ref={canvasRef} width={120} height={120} className={s.thumbnail} />;
 *
 * - The detail fetch is deferred until the canvas scrolls into view (IntersectionObserver).
 * - Painting happens entirely on a single <canvas> — zero extra DOM nodes regardless of grid size.
 * - Handles both 'none' (full cell) and 'left'/'right' (diagonal split) cell modes.
 */
export function useBoardThumbnail(boardId: number, size = 120) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  // Step 1 — only trigger the API call once the card is visible in the viewport
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '100px' } // start fetching slightly before it enters view
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Step 2 — fetch board detail only when visible
  const { data } = useBoardDetailQuery(visible ? boardId : null);

  // Step 3 — paint once data is ready
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, colors, solution } = data;

    // Build a fast color lookup: colorId → hex string
    const colorMap: Record<string, string> = {};
    for (const c of colors) colorMap[c.id] = c.hex;

    const fallback = '#e2e8f0'; // empty cell colour
    const cellW = size / width;
    const cellH = size / height;

    ctx.clearRect(0, 0, size, size);

    solution.forEach((cell, i) => {
      const col = i % width;
      const row = Math.floor(i / width);
      const x = col * cellW;
      const y = row * cellH;

      if (cell.splitMode === 'none') {
        // Full cell — single filled rectangle
        ctx.fillStyle = (cell.top ? colorMap[cell.top] : null) ?? fallback;
        ctx.fillRect(x, y, cellW, cellH);
      } else {
        // Split cell — two triangles
        // Top-left triangle (top color)
        ctx.beginPath();
        if (cell.splitMode === 'right') {
          // Default diagonal: top-left → top-right → bottom-left
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellW, y);
          ctx.lineTo(x, y + cellH);
        } else {
          // 'left' diagonal: top-right → bottom-right → top-left
          ctx.moveTo(x + cellW, y);
          ctx.lineTo(x + cellW, y + cellH);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = (cell.top ? colorMap[cell.top] : null) ?? fallback;
        ctx.fill();

        // Bottom-right triangle (bottom color)
        ctx.beginPath();
        if (cell.splitMode === 'right') {
          ctx.moveTo(x + cellW, y);
          ctx.lineTo(x + cellW, y + cellH);
          ctx.lineTo(x, y + cellH);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellH);
          ctx.lineTo(x + cellW, y + cellH);
        }
        ctx.closePath();
        ctx.fillStyle = (cell.bottom ? colorMap[cell.bottom] : null) ?? fallback;
        ctx.fill();
      }
    });

    // Subtle grid lines for larger boards (helps readability at thumbnail size)
    if (width <= 16 && height <= 16) {
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 0.5;
      for (let c = 1; c < width; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, size);
        ctx.stroke();
      }
      for (let r = 1; r < height; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(size, r * cellH);
        ctx.stroke();
      }
    }
  }, [data, size]);

  return canvasRef;
}
