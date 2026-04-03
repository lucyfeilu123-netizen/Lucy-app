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
    let lightningTimer = 10 + Math.random() * 10;
    let lightningFlash = 0;
    let secondFlash = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops = Array.from({ length: 350 }, () => ({
      x: Math.random() * 4000,
      y: Math.random() * 2000,
      len: 10 + Math.random() * 20,
      speed: 12 + Math.random() * 10,
      alpha: 0.08 + Math.random() * 0.25,
      width: 0.5 + Math.random() * 1,
    }));

    const splashes: { x: number; y: number; r: number; alpha: number; type: number }[] = [];

    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: (i / 5) * 3000 + Math.random() * 400,
      y: -20 + Math.random() * 60,
      rx: 160 + Math.random() * 140,
      ry: 50 + Math.random() * 40,
      dx: 0.08 + Math.random() * 0.12,
      blobs: Array.from({ length: 4 }, () => ({
        ox: (Math.random() - 0.5) * 200,
        oy: (Math.random() - 0.5) * 30,
        r: 60 + Math.random() * 80,
      })),
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.016;

      // Lightning
      lightningTimer -= 0.016;
      if (lightningTimer <= 0) {
        lightningFlash = 1;
        setTimeout(() => { secondFlash = 0.6; }, 200);
        lightningTimer = 10 + Math.random() * 10;
      }
      if (lightningFlash > 0) lightningFlash -= 0.016 / 0.5;
      if (secondFlash > 0) secondFlash -= 0.016 / 0.5;

      // Sky
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0f1523');
      bg.addColorStop(0.4, '#151d30');
      bg.addColorStop(1, '#1a2233');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Lightning flash
      const flashIntensity = Math.max(lightningFlash, secondFlash);
      if (flashIntensity > 0) {
        ctx.globalAlpha = flashIntensity * 0.25;
        ctx.fillStyle = '#c8d8ff';
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      // Clouds
      for (const c of clouds) {
        c.x += c.dx;
        if (c.x > w + c.rx + 200) c.x = -c.rx - 200;
        for (const b of c.blobs) {
          const bx = c.x + b.ox;
          const by = c.y + b.oy;
          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
          grad.addColorStop(0, 'rgba(18, 22, 35, 0.85)');
          grad.addColorStop(0.6, 'rgba(22, 28, 42, 0.5)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(bx - b.r, by - b.r, b.r * 2, b.r * 2);
        }
        // Cloud highlight during lightning
        if (flashIntensity > 0) {
          const grad = ctx.createRadialGradient(c.x, c.y + 20, 0, c.x, c.y + 20, c.rx);
          grad.addColorStop(0, `rgba(200, 216, 255, ${flashIntensity * 0.15})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(c.x - c.rx, c.y - c.ry, c.rx * 2, c.ry * 2);
        }
      }

      // Rain
      const angle = 0.08;
      for (const d of drops) {
        d.y += d.speed;
        d.x += angle * d.speed;
        if (d.y > h) {
          if (splashes.length < 50) {
            const sx = ((d.x % w) + w) % w;
            splashes.push({ x: sx, y: h - 2, r: 0, alpha: 0.3 + Math.random() * 0.2, type: Math.random() > 0.5 ? 0 : 1 });
          }
          d.y = -d.len - Math.random() * 100;
          d.x = Math.random() * w;
        }
        const dx = ((d.x % w) + w) % w;
        ctx.globalAlpha = d.alpha;
        ctx.strokeStyle = d.alpha > 0.2 ? '#88aabb' : '#6888aa';
        ctx.lineWidth = d.width;
        ctx.beginPath();
        ctx.moveTo(dx, d.y);
        ctx.lineTo(dx + angle * d.len, d.y + d.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.r += 0.5;
        s.alpha -= 0.012;
        if (s.alpha <= 0) { splashes.splice(i, 1); continue; }
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = '#5577aa';
        ctx.lineWidth = 0.6;
        if (s.type === 0) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        } else {
          for (let j = -1; j <= 1; j++) {
            ctx.beginPath();
            ctx.arc(s.x + j * 2, s.y - s.r * 0.3, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Mist / fog near bottom
      const mistY = h * 0.75;
      for (let i = 0; i < 3; i++) {
        const my = mistY + i * (h * 0.08);
        const drift = Math.sin(t * 0.15 + i * 2) * 40;
        ctx.globalAlpha = 0.04 + i * 0.02;
        const mist = ctx.createLinearGradient(0, my, 0, my + h * 0.15);
        mist.addColorStop(0, 'transparent');
        mist.addColorStop(0.5, '#1a2233');
        mist.addColorStop(1, 'transparent');
        ctx.fillStyle = mist;
        ctx.fillRect(drift, my, w, h * 0.15);
      }
      ctx.globalAlpha = 1;

      // Puddle reflections at bottom
      const puddleY = h - 15;
      for (let px = 0; px < w; px += 60) {
        const pw = 30 + Math.random() * 40;
        const shimmer = 0.03 + Math.sin(t * 2 + px * 0.1) * 0.02;
        ctx.globalAlpha = shimmer;
        const pGrad = ctx.createLinearGradient(px, puddleY, px, h);
        pGrad.addColorStop(0, '#5577aa');
        pGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pGrad;
        ctx.fillRect(px, puddleY, pw, h - puddleY);
      }
      ctx.globalAlpha = 1;

      // Ground reflection shimmer
      const gGrad = ctx.createLinearGradient(0, h - 25, 0, h);
      gGrad.addColorStop(0, 'transparent');
      gGrad.addColorStop(1, 'rgba(85, 119, 170, 0.06)');
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, h - 25, w, 25);

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
