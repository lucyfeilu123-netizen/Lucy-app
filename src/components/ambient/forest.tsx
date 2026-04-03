'use client';

import { useEffect, useRef } from 'react';

interface Props {
  active: boolean;
  className?: string;
}

export function ForestScene({ active, className }: Props) {
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

    // Fireflies
    const fireflies = Array.from({ length: 35 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      dx: Math.random() * 0.4 - 0.2,
      dy: Math.random() * 0.3 - 0.15,
    }));

    // Leaves
    const leaves = Array.from({ length: 15 }, () => ({
      x: Math.random() * 2000,
      y: -Math.random() * 500,
      rot: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2,
      size: 3 + Math.random() * 4,
    }));

    const drawTree = (x: number, baseY: number, h: number, w: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, baseY - h);
      ctx.lineTo(x - w / 2, baseY);
      ctx.lineTo(x + w / 2, baseY);
      ctx.closePath();
      ctx.fill();
      // Second triangle (overlapping)
      ctx.beginPath();
      ctx.moveTo(x, baseY - h * 0.75);
      ctx.lineTo(x - w * 0.4, baseY - h * 0.1);
      ctx.lineTo(x + w * 0.4, baseY - h * 0.1);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.006;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0a1a0a');
      bg.addColorStop(0.6, '#0f240f');
      bg.addColorStop(1, '#1a3a1a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Back tree layer
      const baseY = h * 0.95;
      for (let i = 0; i < 12; i++) {
        const x = (i / 12) * w + Math.sin(i * 2.3) * 40;
        drawTree(x, baseY, 180 + Math.sin(i) * 40, 80 + Math.sin(i * 1.5) * 20, '#0f1e0f');
      }

      // Mid tree layer
      for (let i = 0; i < 8; i++) {
        const x = (i / 8) * w + 60 + Math.sin(i * 1.7) * 50;
        drawTree(x, baseY + 20, 220 + Math.sin(i * 0.8) * 50, 100 + Math.sin(i) * 25, '#1a3a1a');
      }

      // Foreground tree layer
      for (let i = 0; i < 5; i++) {
        const x = (i / 5) * w + 100 + Math.sin(i * 3.1) * 80;
        drawTree(x, baseY + 40, 280 + Math.sin(i * 1.2) * 60, 130 + Math.sin(i * 0.7) * 30, '#2d5a2d');
      }

      // Ground
      ctx.fillStyle = '#0a1a0a';
      ctx.fillRect(0, h * 0.92, w, h * 0.08);

      // Mist/fog at bottom
      const mistY = h * 0.75;
      const mistShift = Math.sin(t * 0.5) * 30;
      ctx.globalAlpha = 0.08 + Math.sin(t * 0.3) * 0.03;
      const mist = ctx.createLinearGradient(0, mistY, 0, h);
      mist.addColorStop(0, 'transparent');
      mist.addColorStop(0.4, '#3a5a3a');
      mist.addColorStop(1, 'transparent');
      ctx.fillStyle = mist;
      ctx.fillRect(mistShift - 30, mistY, w + 60, h - mistY);
      ctx.globalAlpha = 1;

      // Falling leaves
      ctx.fillStyle = '#8b6914';
      for (const l of leaves) {
        l.y += l.speed;
        l.x += Math.sin(l.wobble + t * 2) * 0.5;
        l.rot += 0.02;
        if (l.y > h + 10) {
          l.y = -10;
          l.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(l.x % w, l.y);
        ctx.rotate(l.rot);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, l.size, l.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // Fireflies
      for (const f of fireflies) {
        f.x += f.dx + Math.sin(t + f.phase) * 0.3;
        f.y += f.dy + Math.cos(t * 0.7 + f.phase) * 0.2;
        if (f.x < 0) f.x = w;
        if (f.x > w) f.x = 0;
        if (f.y < h * 0.2) f.y = h * 0.8;
        if (f.y > h * 0.85) f.y = h * 0.3;

        const brightness = 0.3 + Math.sin(t * f.speed * 4 + f.phase) * 0.3;
        const glowR = 8 + brightness * 12;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
        grad.addColorStop(0, `rgba(232, 212, 77, ${brightness})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(f.x - glowR, f.y - glowR, glowR * 2, glowR * 2);

        ctx.fillStyle = '#e8d44d';
        ctx.globalAlpha = brightness;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
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
