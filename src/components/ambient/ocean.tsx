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

    const spray = Array.from({ length: 60 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, active: false,
    }));

    const mist = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * 2000, speed: 0.1 + Math.random() * 0.15, opacity: 0.03 + Math.random() * 0.04, y: 0.48 + i * 0.04,
    }));

    function waveLine(w: number, h: number, baseY: number, amp: number, freq: number, phase: number, x: number) {
      return baseY
        + Math.sin(x * freq + phase) * amp
        + Math.sin(x * freq * 2.3 + phase * 0.7) * amp * 0.35
        + Math.sin(x * freq * 0.4 + phase * 1.6) * amp * 0.5;
    }

    function drawWave(w: number, h: number, baseY: number, amp: number, freq: number, phase: number, color: string, alpha: number) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 3) {
        ctx.lineTo(x, waveLine(w, h, baseY, amp, freq, phase, x));
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawFoamLine(w: number, h: number, baseY: number, amp: number, freq: number, phase: number, alpha: number) {
      ctx.beginPath();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#d4e8f0';
      ctx.lineWidth = 1.8;
      for (let x = 0; x <= w; x += 3) {
        const y = waveLine(w, h, baseY, amp, freq, phase, x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function emitSpray(wx: number, wy: number) {
      for (const p of spray) {
        if (!p.active) {
          p.x = wx; p.y = wy;
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = -Math.random() * 2.5 - 0.5;
          p.life = 0; p.maxLife = 40 + Math.random() * 40;
          p.size = 1 + Math.random() * 2.5; p.active = true;
          return;
        }
      }
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.005;

      // Sky gradient — overcast purple-gray to pale blue-gray
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#4a4e5e');
      sky.addColorStop(0.3, '#6b7b8d');
      sky.addColorStop(0.7, '#8a95a4');
      sky.addColorStop(1, '#9daab8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.52);

      // Subtle cloud streaks
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 4; i++) {
        const cy = h * (0.08 + i * 0.1);
        const cx = (w * 0.3 + i * w * 0.2 + Math.sin(t * 0.2 + i) * 60) % w;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.25);
        grad.addColorStop(0, '#b0b8c4');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h * 0.5);
      }
      ctx.globalAlpha = 1;

      // Horizon glow
      const horizGlow = ctx.createLinearGradient(0, h * 0.42, 0, h * 0.55);
      horizGlow.addColorStop(0, 'rgba(180, 190, 200, 0.3)');
      horizGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizGlow;
      ctx.fillRect(0, h * 0.42, w, h * 0.13);

      // Distant ocean layer
      const distOcean = ctx.createLinearGradient(0, h * 0.48, 0, h * 0.58);
      distOcean.addColorStop(0, '#2a4a5a');
      distOcean.addColorStop(1, '#0a2535');
      ctx.fillStyle = distOcean;
      ctx.fillRect(0, h * 0.48, w, h * 0.12);
      // Shimmer on distant water
      ctx.globalAlpha = 0.07;
      for (let x = 0; x < w; x += 12) {
        const shimmer = Math.sin(x * 0.03 + t * 1.5) * 0.5 + 0.5;
        if (shimmer > 0.6) {
          ctx.fillStyle = '#8aaabb';
          ctx.fillRect(x, h * 0.49 + Math.sin(x * 0.01 + t) * 3, 6 + shimmer * 4, 1);
        }
      }
      ctx.globalAlpha = 1;

      // Mid waves (back to front)
      drawWave(w, h, h * 0.56, 12, 0.005, t * 0.3, '#0d3047', 0.9);
      drawFoamLine(w, h, h * 0.56, 12, 0.005, t * 0.3, 0.15);

      drawWave(w, h, h * 0.62, 16, 0.006, t * 0.4 + 1, '#1a4a5c', 0.85);
      drawFoamLine(w, h, h * 0.62, 16, 0.006, t * 0.4 + 1, 0.2);

      drawWave(w, h, h * 0.68, 20, 0.007, t * 0.5 + 2.5, '#0d3047', 0.8);
      drawFoamLine(w, h, h * 0.68, 20, 0.007, t * 0.5 + 2.5, 0.25);

      drawWave(w, h, h * 0.75, 18, 0.008, t * 0.55 + 4, '#2d6b7a', 0.75);
      drawFoamLine(w, h, h * 0.75, 18, 0.008, t * 0.55 + 4, 0.3);

      // Foreground wave — large rolling wave with bezier crest
      const fgBase = h * 0.82;
      const fgAmp = 28;
      const fgPhase = t * 0.35;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 3) {
        const y = waveLine(w, h, fgBase, fgAmp, 0.004, fgPhase, x);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h); ctx.closePath();
      const fgGrad = ctx.createLinearGradient(0, fgBase - fgAmp, 0, h);
      fgGrad.addColorStop(0, '#1a4a5c');
      fgGrad.addColorStop(0.4, '#0a2535');
      fgGrad.addColorStop(1, '#061a28');
      ctx.fillStyle = fgGrad;
      ctx.fill();

      // Foam on foreground crest
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = waveLine(w, h, fgBase, fgAmp, 0.004, fgPhase, x);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Emit spray particles from wave crests
      if (Math.random() < 0.3) {
        const sx = Math.random() * w;
        const sy = waveLine(w, h, fgBase, fgAmp, 0.004, fgPhase, sx);
        emitSpray(sx, sy);
      }
      if (Math.random() < 0.15) {
        const sx = Math.random() * w;
        const sy = waveLine(w, h, h * 0.68, 20, 0.007, t * 0.5 + 2.5, sx);
        emitSpray(sx, sy);
      }

      // Update and draw spray
      for (const p of spray) {
        if (!p.active) continue;
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life++;
        if (p.life > p.maxLife) { p.active = false; continue; }
        const alpha = 1 - p.life / p.maxLife;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = '#d4e8f0';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Mist layers near water surface
      for (const m of mist) {
        m.x += m.speed;
        if (m.x > w + 200) m.x = -400;
        ctx.globalAlpha = m.opacity + Math.sin(t * 0.5 + m.y * 10) * 0.015;
        const mg = ctx.createRadialGradient(m.x, h * m.y, 0, m.x, h * m.y, w * 0.35);
        mg.addColorStop(0, 'rgba(200, 210, 220, 0.8)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.fillRect(0, h * 0.4, w, h * 0.5);
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
