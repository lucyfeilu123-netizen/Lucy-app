'use client';

import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  className?: string;
}

export function StarrySkyScene({ active, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d')!;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * 3000,
      y: Math.random() * 2000,
      r: 0.3 + Math.random() * 1.8,
      twinkleSpeed: 1 + Math.random() * 3,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // Nebula patches
    const nebulae = Array.from({ length: 5 }, () => ({
      x: Math.random() * 2500,
      y: Math.random() * 1500,
      r: 150 + Math.random() * 200,
      dx: 0.02 + Math.random() * 0.04,
      dy: 0.01 + Math.random() * 0.02,
      color: ['#3d1a5c', '#1a3d5c', '#5c1a4a', '#1a4a5c', '#2a1a5c'][Math.floor(Math.random() * 5)],
    }));

    // Shooting star state
    let shootingStar: { x: number; y: number; dx: number; dy: number; life: number; maxLife: number } | null = null;
    let shootingTimer = 5 + Math.random() * 5;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.005;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0a0a1a');
      bg.addColorStop(0.7, '#1a0a2e');
      bg.addColorStop(1, '#0f0f2a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebulae
      for (const n of nebulae) {
        const nx = n.x + Math.sin(t * n.dx * 10) * 20;
        const ny = n.y + Math.cos(t * n.dy * 10) * 15;
        const cx = nx % w;
        const cy = ny % h;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = grad;
        ctx.fillRect(cx - n.r, cy - n.r, n.r * 2, n.r * 2);
      }
      ctx.globalAlpha = 1;

      // Stars
      ctx.fillStyle = '#ffffff';
      for (const s of stars) {
        const sx = s.x % w;
        const sy = s.y % h;
        const alpha = 0.4 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.35;
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting star
      shootingTimer -= 0.016;
      if (shootingTimer <= 0 && !shootingStar) {
        const startX = Math.random() * w * 0.6;
        const startY = Math.random() * h * 0.4;
        shootingStar = {
          x: startX, y: startY,
          dx: 6 + Math.random() * 4, dy: 2 + Math.random() * 3,
          life: 0, maxLife: 40 + Math.random() * 30,
        };
        shootingTimer = 5 + Math.random() * 5;
      }
      if (shootingStar) {
        const ss = shootingStar;
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life++;
        const progress = ss.life / ss.maxLife;
        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        // Trail
        const tailLen = 60;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.dx * tailLen * 0.15, ss.y - ss.dy * tailLen * 0.15);
        ctx.stroke();
        // Head glow
        const glow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
        glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(ss.x - 6, ss.y - 6, 12, 12);
        ctx.globalAlpha = 1;
        if (ss.life >= ss.maxLife) shootingStar = null;
      }

      // Aurora borealis at horizon
      const auroraY = h * 0.8;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, auroraY + i * 15);
        for (let x = 0; x <= w; x += 6) {
          const y = auroraY + i * 15 +
            Math.sin(x * 0.003 + t * (0.3 + i * 0.1)) * (20 + i * 8) +
            Math.sin(x * 0.007 + t * 0.2) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const auroraGrad = ctx.createLinearGradient(0, auroraY - 30, 0, h);
        const hue = (120 + Math.sin(t * 0.3 + i) * 40) | 0;
        auroraGrad.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.03)`);
        auroraGrad.addColorStop(0.5, `hsla(${hue + 20}, 60%, 40%, 0.015)`);
        auroraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auroraGrad;
        ctx.fill();
      }

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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
