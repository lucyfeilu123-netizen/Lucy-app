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

    // Stars with color variation
    const stars = Array.from({ length: 450 }, () => {
      const brightness = Math.random();
      const r = brightness > 0.85 ? 1.2 + Math.random() * 1.3 : 0.5 + Math.random() * 0.8;
      // Brighter stars are blue-white, dimmer are warmer
      const color = brightness > 0.7
        ? `rgb(${200 + Math.random() * 55}, ${210 + Math.random() * 45}, 255)`
        : `rgb(255, ${220 + Math.random() * 35}, ${180 + Math.random() * 50})`;
      return {
        x: Math.random() * 4000, y: Math.random() * 2500,
        r, color, brightness,
        twinkleSpeed: 0.5 + Math.random() * 2.5,
        twinklePhase: Math.random() * Math.PI * 2,
      };
    });

    // Nebula patches
    const nebulae = [
      { x: 0.3, y: 0.25, r: 200, color: '#2a1040', dx: 0.01 },
      { x: 0.7, y: 0.35, r: 180, color: '#0a2040', dx: -0.008 },
      { x: 0.5, y: 0.15, r: 250, color: '#3a2010', dx: 0.012 },
      { x: 0.15, y: 0.45, r: 160, color: '#1a0a30', dx: -0.006 },
    ];

    // Shooting star state
    let shootingStar: { x: number; y: number; dx: number; dy: number; life: number; maxLife: number; trail: { x: number; y: number }[] } | null = null;
    let shootingTimer = 6 + Math.random() * 6;

    // Tree line generation
    const treePoints: { x: number; h: number; w: number }[] = [];
    for (let tx = -20; tx < 4000; tx += 8 + Math.random() * 15) {
      treePoints.push({ x: tx, h: 40 + Math.random() * 80, w: 12 + Math.random() * 20 });
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.004;

      // Sky gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#050510');
      bg.addColorStop(0.5, '#0a1530');
      bg.addColorStop(0.85, '#121a35');
      bg.addColorStop(1, '#1a2040');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Warm horizon glow
      const horizonGlow = ctx.createRadialGradient(w * 0.5, h * 0.88, 0, w * 0.5, h * 0.88, h * 0.4);
      horizonGlow.addColorStop(0, 'rgba(26, 42, 16, 0.25)');
      horizonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // Milky Way band — diagonal strip with dense glow
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(-0.5);
      const mwW = w * 0.25;
      const mwH = h * 1.6;
      // Core glow
      const mwGrad = ctx.createLinearGradient(-mwW, 0, mwW, 0);
      mwGrad.addColorStop(0, 'transparent');
      mwGrad.addColorStop(0.3, 'rgba(212, 184, 150, 0.04)');
      mwGrad.addColorStop(0.45, 'rgba(180, 160, 200, 0.07)');
      mwGrad.addColorStop(0.55, 'rgba(212, 184, 150, 0.06)');
      mwGrad.addColorStop(0.7, 'rgba(136, 119, 170, 0.04)');
      mwGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mwGrad;
      ctx.fillRect(-mwW, -mwH / 2, mwW * 2, mwH);
      // Extra dense stars in band
      ctx.fillStyle = 'rgba(255, 245, 230, 0.6)';
      for (let i = 0; i < 300; i++) {
        const sx = (Math.random() - 0.5) * mwW * 1.4;
        const sy = (Math.random() - 0.5) * mwH;
        const sr = 0.3 + Math.random() * 0.6;
        const density = 1 - Math.abs(sx) / (mwW * 0.7);
        if (density < 0) continue;
        ctx.globalAlpha = density * (0.2 + Math.random() * 0.4);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // Nebula patches
      for (const n of nebulae) {
        const nx = (n.x * w + Math.sin(t * n.dx * 10) * 30) % w;
        const ny = n.y * h;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = grad;
        ctx.fillRect(nx - n.r, ny - n.r, n.r * 2, n.r * 2);
      }
      ctx.globalAlpha = 1;

      // Stars
      for (const s of stars) {
        const sx = s.x % w;
        const sy = s.y % (h * 0.82);
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.brightness > 0.85
          ? 0.6 + twinkle * 0.3
          : 0.2 + twinkle * 0.2;
        ctx.globalAlpha = Math.max(0.05, alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fill();
        // Bright star glow
        if (s.r > 1.5) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 4);
          glow.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.15})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(sx - s.r * 4, sy - s.r * 4, s.r * 8, s.r * 8);
        }
      }
      ctx.globalAlpha = 1;

      // Shooting star
      shootingTimer -= 0.016;
      if (shootingTimer <= 0 && !shootingStar) {
        const startX = Math.random() * w * 0.7 + w * 0.1;
        const startY = Math.random() * h * 0.35;
        const angle = 0.3 + Math.random() * 0.4;
        const speed = 8 + Math.random() * 6;
        shootingStar = {
          x: startX, y: startY,
          dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
          life: 0, maxLife: 35 + Math.random() * 25, trail: [],
        };
        shootingTimer = 6 + Math.random() * 6;
      }
      if (shootingStar) {
        const ss = shootingStar;
        ss.trail.push({ x: ss.x, y: ss.y });
        if (ss.trail.length > 20) ss.trail.shift();
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life++;
        const progress = ss.life / ss.maxLife;
        const headAlpha = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);
        // Fading trail
        for (let i = 0; i < ss.trail.length - 1; i++) {
          const ta = (i / ss.trail.length) * headAlpha * 0.5;
          ctx.globalAlpha = ta;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5 * (i / ss.trail.length);
          ctx.beginPath();
          ctx.moveTo(ss.trail[i].x, ss.trail[i].y);
          ctx.lineTo(ss.trail[i + 1].x, ss.trail[i + 1].y);
          ctx.stroke();
        }
        // Head
        const glow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 8);
        glow.addColorStop(0, `rgba(255, 255, 255, ${headAlpha})`);
        glow.addColorStop(0.5, `rgba(200, 220, 255, ${headAlpha * 0.4})`);
        glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = 1;
        ctx.fillStyle = glow;
        ctx.fillRect(ss.x - 8, ss.y - 8, 16, 16);
        if (ss.life >= ss.maxLife) shootingStar = null;
      }
      ctx.globalAlpha = 1;

      // Tree silhouettes
      const treeBase = h * 0.88;
      ctx.fillStyle = '#000000';
      for (const tp of treePoints) {
        const tx = tp.x % w;
        // Pine tree shape
        ctx.beginPath();
        ctx.moveTo(tx, treeBase - tp.h);
        ctx.lineTo(tx - tp.w * 0.5, treeBase);
        ctx.lineTo(tx + tp.w * 0.5, treeBase);
        ctx.closePath();
        ctx.fill();
        // Second layer for fullness
        ctx.beginPath();
        ctx.moveTo(tx, treeBase - tp.h * 0.7);
        ctx.lineTo(tx - tp.w * 0.65, treeBase - tp.h * 0.1);
        ctx.lineTo(tx + tp.w * 0.65, treeBase - tp.h * 0.1);
        ctx.closePath();
        ctx.fill();
      }
      // Ground fill
      ctx.fillRect(0, treeBase, w, h - treeBase);

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
