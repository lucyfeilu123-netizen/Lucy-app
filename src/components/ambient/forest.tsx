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

    // Snowflakes
    const snow = Array.from({ length: 180 }, () => ({
      x: Math.random() * 3000, y: Math.random() * 2000,
      size: 0.8 + Math.random() * 3, speed: 0.2 + Math.random() * 0.6,
      drift: Math.random() * Math.PI * 2, driftAmp: 0.2 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.7,
    }));

    // Mist blobs
    const mistBlobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * 3000, y: 0.3 + Math.random() * 0.4,
      radius: 200 + Math.random() * 300, speed: 0.08 + Math.random() * 0.12,
      opacity: 0.04 + Math.random() * 0.04,
    }));

    function drawTrunk(x: number, baseY: number, height: number, width: number, color: string, barkDetail: boolean) {
      ctx.fillStyle = color;
      // Slightly tapered trunk
      ctx.beginPath();
      ctx.moveTo(x - width * 0.5, baseY);
      ctx.lineTo(x - width * 0.35, baseY - height);
      ctx.lineTo(x + width * 0.35, baseY - height);
      ctx.lineTo(x + width * 0.5, baseY);
      ctx.closePath();
      ctx.fill();
      // Bark texture lines
      if (barkDetail) {
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 6; i++) {
          const bx = x - width * 0.25 + Math.random() * width * 0.5;
          const by = baseY - Math.random() * height * 0.8;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + (Math.random() - 0.5) * 3, by + 15 + Math.random() * 20);
          ctx.stroke();
        }
      }
    }

    function drawPineBranches(x: number, trunkTop: number, trunkBase: number, spread: number, color: string, snowColor: string, snowAmount: number) {
      const layers = 5;
      for (let i = 0; i < layers; i++) {
        const ly = trunkTop + (trunkBase - trunkTop) * (i * 0.18 + 0.05);
        const lSpread = spread * (0.3 + i * 0.15);
        // Branch cluster (irregular triangle)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, ly - 8);
        ctx.quadraticCurveTo(x - lSpread * 0.6, ly + 4, x - lSpread, ly + 12 + Math.sin(i * 2.1) * 4);
        ctx.lineTo(x, ly + 6);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, ly - 8);
        ctx.quadraticCurveTo(x + lSpread * 0.6, ly + 4, x + lSpread, ly + 12 + Math.cos(i * 1.7) * 4);
        ctx.lineTo(x, ly + 6);
        ctx.closePath();
        ctx.fill();
        // Snow on branches
        if (snowAmount > 0) {
          ctx.fillStyle = snowColor;
          ctx.globalAlpha = 0.7 * snowAmount;
          ctx.beginPath();
          ctx.ellipse(x - lSpread * 0.4, ly - 2, lSpread * 0.5, 4, -0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(x + lSpread * 0.35, ly - 1, lSpread * 0.45, 3.5, 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.004;

      // Background — misty fog gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#d8d8d8');
      bg.addColorStop(0.3, '#e0e0e0');
      bg.addColorStop(0.7, '#d0d0d0');
      bg.addColorStop(1, '#c0c0c0');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Very subtle warm light from above
      ctx.globalAlpha = 0.06;
      const sunGlow = ctx.createRadialGradient(w * 0.5, h * 0.05, 0, w * 0.5, h * 0.05, h * 0.6);
      sunGlow.addColorStop(0, '#f0e8d8');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const groundY = h * 0.88;

      // --- Distant trees (faded, small) ---
      ctx.globalAlpha = 0.25;
      const distTrees = [0.05, 0.12, 0.22, 0.3, 0.42, 0.55, 0.65, 0.75, 0.82, 0.93];
      for (const px of distTrees) {
        const tx = w * px + Math.sin(px * 20) * 15;
        drawTrunk(tx, groundY, 160 + Math.sin(px * 30) * 30, 6, '#8a7a6a', false);
        drawPineBranches(tx, groundY - 160 + Math.sin(px * 30) * 30 * -1, groundY, 22, '#7a9a7a', '#e8e8e8', 0.3);
      }
      ctx.globalAlpha = 1;

      // --- Mid trees ---
      ctx.globalAlpha = 0.55;
      const midTrees = [0.08, 0.25, 0.4, 0.6, 0.78, 0.92];
      for (const px of midTrees) {
        const tx = w * px + Math.sin(px * 15) * 25;
        const th = 220 + Math.sin(px * 20) * 40;
        drawTrunk(tx, groundY, th, 10, '#5a4a3a', false);
        drawPineBranches(tx, groundY - th, groundY, 35, '#4a6a4a', '#e0e0e0', 0.6);
      }
      ctx.globalAlpha = 1;

      // --- Foreground trees (large, detailed, on edges) ---
      // Left tree
      drawTrunk(w * 0.04, groundY + 20, h * 0.65, 28, '#5a4a3a', true);
      drawPineBranches(w * 0.04, groundY + 20 - h * 0.65, groundY + 20, 55, '#3a5a3a', '#e8e8e8', 0.8);
      // Right tree
      drawTrunk(w * 0.95, groundY + 15, h * 0.6, 24, '#6b5b4b', true);
      drawPineBranches(w * 0.95, groundY + 15 - h * 0.6, groundY + 15, 50, '#3a5a3a', '#e8e8e8', 0.8);
      // Center-right tree
      drawTrunk(w * 0.7, groundY + 10, h * 0.5, 20, '#5a4a3a', true);
      drawPineBranches(w * 0.7, groundY + 10 - h * 0.5, groundY + 10, 45, '#4a6a4a', '#e0e0e0', 0.7);

      // --- Snowy ground ---
      const groundGrad = ctx.createLinearGradient(0, groundY - 20, 0, h);
      groundGrad.addColorStop(0, '#e8e8e8');
      groundGrad.addColorStop(0.3, '#f0f0f0');
      groundGrad.addColorStop(1, '#d0d0d0');
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      // Undulating snow ground
      for (let x = 0; x <= w; x += 4) {
        const y = groundY + Math.sin(x * 0.008 + 1.2) * 8 + Math.sin(x * 0.02 + 0.5) * 3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fill();
      // Subtle snow surface shadows
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#8888aa';
      for (let i = 0; i < 8; i++) {
        const sx = w * (i / 8) + 30;
        const sy = groundY + 10 + Math.sin(i * 3.1) * 5;
        ctx.beginPath();
        ctx.ellipse(sx, sy, 40 + i * 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // --- Drifting mist ---
      for (const m of mistBlobs) {
        m.x += m.speed;
        if (m.x > w + m.radius * 2) m.x = -m.radius * 2;
        ctx.globalAlpha = m.opacity + Math.sin(t + m.y * 5) * 0.015;
        const mg = ctx.createRadialGradient(m.x, h * m.y, 0, m.x, h * m.y, m.radius);
        mg.addColorStop(0, 'rgba(220, 220, 220, 0.9)');
        mg.addColorStop(0.6, 'rgba(210, 210, 210, 0.4)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;

      // --- Falling snow ---
      const windX = Math.sin(t * 0.7) * 0.3;
      for (const s of snow) {
        s.y += s.speed;
        s.x += Math.sin(s.drift + t * 1.2) * s.driftAmp + windX;
        if (s.y > h + 10) { s.y = -5; s.x = Math.random() * w; }
        if (s.x > w + 10) s.x = -5;
        if (s.x < -10) s.x = w + 5;
        ctx.globalAlpha = s.opacity * (0.7 + Math.sin(t * 2 + s.drift) * 0.3);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x % w, s.y, s.size, 0, Math.PI * 2);
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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
