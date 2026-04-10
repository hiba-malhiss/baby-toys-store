import { useCallback, useRef } from 'react';

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const launch = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height * 0.5,
      w: Math.random() * 11 + 4,
      h: Math.random() * 7 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 1.5,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.18,
      opacity: 1,
    }));
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;
        if (frame > 100) p.opacity -= 0.01;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 200) animRef.current = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const cancel = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  return { canvasRef, launch, cancel };
}
