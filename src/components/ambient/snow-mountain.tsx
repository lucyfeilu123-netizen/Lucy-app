'use client';

import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  className?: string;
}

export function SnowMountainScene({ active, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0;
    let gustTimer = 0;
    let gustStrength = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Snowflakes
    const flakes = Array.from({ length: 200 }, () => ({
      x: Math.random() * 3000,
      y: Math.random() * 2000,
      r: 1 + Math.random() * 2.5,
      speed: 0.5 + Math.random() * 1.5,
      drift: Math.random() * Math.PI * 2,
    }));

    const drawMountain = (
      peaks: { x: number; y: number }[],
      baseY: number,
      color: string,
      w: number,
      h: number,
    ) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let i = 0; i < peaks.length; i++) {
        const p = peaks[i];
        ctx.lineTo(p.x * w, p.y * h);
      }
      ctx.lineTo(w, baseY);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.006;

      // Wind gust cycle
      gustTimer -= 0.016;
      if (gustTimer <= 0) {
        gustStrength = 1 + Math.random() * 2;
        gustTimer = 6 + Math.random() * 10;
      }
      if (gustStrength > 0) gustStrength *= 0.995;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#1a2a4a');
      sky.addColorStop(0.4, '#2a3a5a');
      sky.addColorStop(0.7, '#3a4a6a');
      sky.addColorStop(1, '#4a5a7a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Distant mountains (back layer)
      drawMountain(
        [
          { x: 0, y: 0.65 }, { x: 0.12, y: 0.42 }, { x: 0.22, y: 0.5 },
          { x: 0.35, y: 0.35 }, { x: 0.48, y: 0.48 }, { x: 0.55, y: 0.38 },
          { x: 0.7, y: 0.45 }, { x: 0.82, y: 0.32 }, { x: 0.92, y: 0.44 },
          { x: 1, y: 0.55 },
        ],
        h, '#1a1a2a', w, h,
      );

      // Fog layer between mountains
      const fogY = h * 0.5;
      ctx.globalAlpha = 0.12 + Math.sin(t * 0.4) * 0.04;
      const fog = ctx.createLinearGradient(0, fogY - 40, 0, fogY + 60);
      fog.addColorStop(0, 'transparent');
      fog.addColorStop(0.5, '#4a5a7a');
      fog.addColorStop(1, 'transparent');
      ctx.fillStyle = fog;
      ctx.fillRect(0, fogY - 40, w, 100);
      ctx.globalAlpha = 1;

      // Mid mountains
      drawMountain(
        [
          { x: 0, y: 0.7 }, { x: 0.08, y: 0.55 }, { x: 0.2, y: 0.62 },
          { x: 0.3, y: 0.48 }, { x: 0.42, y: 0.58 }, { x: 0.5, y: 0.45 },
          { x: 0.6, y: 0.52 }, { x: 0.75, y: 0.42 }, { x: 0.85, y: 0.52 },
          { x: 0.95, y: 0.46 }, { x: 1, y: 0.6 },
        ],
        h, '#2a2a3a', w, h,
      );

      // Snow caps on mid mountains (subtle white triangles at peaks)
      ctx.fillStyle = '#e8e8f0';
      ctx.globalAlpha = 0.3;
      const capPeaks = [
        { x: 0.3, y: 0.48 }, { x: 0.5, y: 0.45 }, { x: 0.75, y: 0.42 },
      ];
      for (const p of capPeaks) {
        ctx.beginPath();
        ctx.moveTo(p.x * w, p.y * h);
        ctx.lineTo(p.x * w - 25, p.y * h + 25);
        ctx.lineTo(p.x * w + 25, p.y * h + 25);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Foreground mountains
      drawMountain(
        [
          { x: -0.05, y: 0.85 }, { x: 0.1, y: 0.68 }, { x: 0.25, y: 0.78 },
          { x: 0.4, y: 0.65 }, { x: 0.55, y: 0.75 }, { x: 0.65, y: 0.62 },
          { x: 0.8, y: 0.72 }, { x: 0.9, y: 0.66 }, { x: 1.05, y: 0.8 },
        ],
        h, '#2a2a3a', w, h,
      );

      // Ground
      ctx.fillStyle = '#1a1a2a';
      ctx.fillRect(0, h * 0.88, w, h * 0.12);

      // Ground snow cover
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#e8e8f0';
      ctx.fillRect(0, h * 0.9, w, h * 0.1);
      ctx.globalAlpha = 1;

      // Snowflakes
      const windX = Math.sin(t) * 0.5 + gustStrength * 1.5;
      ctx.fillStyle = '#e8e8f0';
      for (const f of flakes) {
        f.y += f.speed;
        f.x += Math.sin(f.drift + t * 1.5) * 0.4 + windX * f.speed * 0.3;
        if (f.y > h + 5) {
          f.y = -5;
          f.x = Math.random() * w;
        }
        const fx = ((f.x % w) + w) % w;
        const alpha = 0.3 + Math.sin(t * 2 + f.drift) * 0.15;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(fx, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Vignette overlay
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.9);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(10, 10, 20, 0.3)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

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
