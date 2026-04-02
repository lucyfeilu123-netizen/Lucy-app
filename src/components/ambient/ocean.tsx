'use client';

import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  className?: string;
}

export function OceanScene({ active, className }: Props) {
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

    // Pre-generate bubbles
    const bubbles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: 1 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      drift: Math.random() * 0.3 - 0.15,
    }));

    // Pre-generate caustic circles
    const caustics = Array.from({ length: 12 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: 60 + Math.random() * 120,
      dx: 0.2 + Math.random() * 0.3,
      dy: 0.1 + Math.random() * 0.2,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.008;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0a1628');
      bg.addColorStop(0.5, '#0d2137');
      bg.addColorStop(1, '#1a3a5c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Caustics layer
      ctx.globalAlpha = 0.04;
      for (const c of caustics) {
        const cx = ((c.x + Math.sin(t * c.dx) * 100) % (w + 200)) - 100;
        const cy = ((c.y + Math.cos(t * c.dy) * 80) % (h + 200)) - 100;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r);
        grad.addColorStop(0, '#3d7ea6');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - c.r, cy - c.r, c.r * 2, c.r * 2);
      }
      ctx.globalAlpha = 1;

      // Wave layers (back to front)
      const waveLayers = [
        { y: h * 0.55, amp: 18, freq: 0.008, speed: 0.4, color: '#0d2137' },
        { y: h * 0.6, amp: 22, freq: 0.006, speed: 0.6, color: '#1a3a5c' },
        { y: h * 0.65, amp: 14, freq: 0.01, speed: 0.8, color: '#1a3a5c' },
        { y: h * 0.72, amp: 10, freq: 0.012, speed: 1.0, color: '#3d7ea6' },
        { y: h * 0.8, amp: 8, freq: 0.015, speed: 1.3, color: '#3d7ea6' },
      ];

      for (const layer of waveLayers) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 4) {
          const y =
            layer.y +
            Math.sin(x * layer.freq + t * layer.speed) * layer.amp +
            Math.sin(x * layer.freq * 1.8 + t * layer.speed * 0.7) * layer.amp * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Foam line on top wave
      ctx.beginPath();
      ctx.strokeStyle = '#a8d8ea';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;
      for (let x = 0; x <= w; x += 4) {
        const y =
          h * 0.55 +
          Math.sin(x * 0.008 + t * 0.4) * 18 +
          Math.sin(x * 0.014 + t * 0.28) * 9;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Bubbles
      ctx.fillStyle = '#a8d8ea';
      for (const b of bubbles) {
        b.y -= b.speed;
        b.x += b.drift + Math.sin(t * 2 + b.y * 0.01) * 0.3;
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }
        const alpha = 0.15 + Math.sin(t * 3 + b.x) * 0.1;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(b.x % w, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
