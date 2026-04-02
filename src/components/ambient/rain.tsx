'use client';

import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  className?: string;
}

export function RainScene({ active, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0;
    let lightningTimer = 8 + Math.random() * 7;
    let lightningFlash = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Raindrops
    const drops = Array.from({ length: 250 }, () => ({
      x: Math.random() * 3000,
      y: Math.random() * 2000,
      len: 10 + Math.random() * 20,
      speed: 8 + Math.random() * 12,
      alpha: 0.1 + Math.random() * 0.3,
    }));

    // Splashes (ring buffer)
    const splashes: { x: number; y: number; r: number; maxR: number; alpha: number }[] = [];

    // Clouds
    const clouds = Array.from({ length: 6 }, () => ({
      x: Math.random() * 2500,
      y: Math.random() * 100,
      r: 80 + Math.random() * 120,
      dx: 0.05 + Math.random() * 0.1,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.016;

      // Lightning timer
      lightningTimer -= 0.016;
      if (lightningTimer <= 0) {
        lightningFlash = 1;
        lightningTimer = 8 + Math.random() * 7;
      }
      if (lightningFlash > 0) lightningFlash -= 0.03;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#1a1a2e');
      bg.addColorStop(1, '#2d2d44');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Lightning flash overlay
      if (lightningFlash > 0) {
        ctx.globalAlpha = lightningFlash * 0.15;
        ctx.fillStyle = '#e8e8ff';
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      // Clouds
      for (const c of clouds) {
        c.x += c.dx;
        if (c.x > w + c.r) c.x = -c.r;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        grad.addColorStop(0, 'rgba(45, 45, 68, 0.6)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(c.x - c.r, c.y - c.r, c.r * 2, c.r * 2);
      }

      // Rain
      const angle = 0.05;
      ctx.strokeStyle = '#4a6fa5';
      ctx.lineWidth = 1;
      for (const d of drops) {
        d.y += d.speed;
        d.x += angle * d.speed;
        if (d.y > h) {
          // Spawn splash
          if (splashes.length < 30) {
            splashes.push({ x: d.x % w, y: h - 2, r: 0, maxR: 4 + Math.random() * 6, alpha: 0.4 });
          }
          d.y = -d.len;
          d.x = Math.random() * w;
        }
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        const dx = d.x % w;
        ctx.moveTo(dx, d.y);
        ctx.lineTo(dx + angle * d.len, d.y + d.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Splashes
      ctx.strokeStyle = '#6b8db5';
      ctx.lineWidth = 0.8;
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.r += 0.4;
        s.alpha -= 0.015;
        if (s.alpha <= 0) {
          splashes.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Ground reflection
      const groundGrad = ctx.createLinearGradient(0, h - 30, 0, h);
      groundGrad.addColorStop(0, 'transparent');
      groundGrad.addColorStop(1, 'rgba(74, 111, 165, 0.08)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, h - 30, w, 30);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
