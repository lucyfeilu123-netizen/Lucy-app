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
    let gustTimer = 5 + Math.random() * 8;
    let gustStrength = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const flakes = Array.from({ length: 250 }, () => ({
      x: Math.random() * 4000,
      y: Math.random() * 2000,
      r: 1 + Math.random() * 3,
      speed: 0.4 + Math.random() * 1.2,
      drift: Math.random() * Math.PI * 2,
      alpha: 0.4 + Math.random() * 0.5,
    }));

    // Tree definitions: x (0-1), scale, depth (0=far, 1=near)
    const trees = [
      // Back row (faded)
      { x: 0.08, scale: 0.7, depth: 0.2 },
      { x: 0.22, scale: 0.85, depth: 0.25 },
      { x: 0.75, scale: 0.75, depth: 0.2 },
      { x: 0.92, scale: 0.8, depth: 0.22 },
      // Mid row
      { x: 0.02, scale: 1.1, depth: 0.55 },
      { x: 0.18, scale: 1.3, depth: 0.6 },
      { x: 0.38, scale: 1.0, depth: 0.5 },
      { x: 0.62, scale: 1.05, depth: 0.5 },
      { x: 0.82, scale: 1.25, depth: 0.58 },
      { x: 0.95, scale: 1.15, depth: 0.55 },
      // Front row (darkest, largest)
      { x: -0.05, scale: 1.6, depth: 0.9 },
      { x: 0.3, scale: 1.4, depth: 0.85 },
      { x: 0.7, scale: 1.5, depth: 0.88 },
      { x: 1.05, scale: 1.45, depth: 0.9 },
    ].sort((a, b) => a.depth - b.depth);

    const drawPineTree = (cx: number, baseY: number, scale: number, depth: number, w: number) => {
      const treeH = 160 * scale;
      const treeW = 70 * scale;
      const layers = 5;
      // Depth-based color: far trees lighter, near trees darker
      const green = Math.round(42 + (1 - depth) * 50);
      const treeColor = `rgb(${Math.round(green * 0.6)}, ${green}, ${Math.round(green * 0.6)})`;
      const snowColor = depth > 0.7 ? '#e8e8f0' : '#d0d0d8';
      const snowAlpha = depth > 0.7 ? 0.9 : 0.7;

      // Trunk
      ctx.fillStyle = treeColor;
      ctx.fillRect(cx - 4 * scale, baseY - treeH * 0.15, 8 * scale, treeH * 0.15);

      // Tree layers (triangles)
      for (let i = 0; i < layers; i++) {
        const layerY = baseY - treeH * 0.1 - (i / layers) * treeH * 0.85;
        const layerW = treeW * (1 - i * 0.12);
        const layerH = treeH / layers * 1.3;
        // Green body
        ctx.fillStyle = treeColor;
        ctx.beginPath();
        ctx.moveTo(cx, layerY - layerH);
        ctx.lineTo(cx - layerW / 2, layerY);
        ctx.lineTo(cx + layerW / 2, layerY);
        ctx.closePath();
        ctx.fill();
        // Snow on top of each layer
        ctx.globalAlpha = snowAlpha;
        ctx.fillStyle = snowColor;
        ctx.beginPath();
        ctx.moveTo(cx, layerY - layerH);
        ctx.lineTo(cx - layerW * 0.35, layerY - layerH * 0.45);
        ctx.lineTo(cx + layerW * 0.35, layerY - layerH * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += 0.005;

      // Wind gusts
      gustTimer -= 0.016;
      if (gustTimer <= 0) {
        gustStrength = 1.5 + Math.random() * 2.5;
        gustTimer = 5 + Math.random() * 8;
      }
      if (gustStrength > 0) gustStrength *= 0.992;

      // Overcast sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#b8b8c0');
      sky.addColorStop(0.5, '#c4c4cc');
      sky.addColorStop(1, '#d0d0d8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Snow ground (thick, with gentle drifts)
      const groundY = h * 0.72;
      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let gx = 0; gx <= w; gx += 3) {
        const gy = groundY + Math.sin(gx * 0.008) * 12 + Math.sin(gx * 0.02 + 1) * 5;
        ctx.lineTo(gx, gy);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      // Snow highlight
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 5);
      for (let gx = 0; gx <= w; gx += 3) {
        const gy = groundY + 5 + Math.sin(gx * 0.008) * 12 + Math.sin(gx * 0.02 + 1) * 5;
        ctx.lineTo(gx, gy);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // Trees (sorted by depth, back to front)
      for (const tree of trees) {
        const tx = tree.x * w;
        const baseY = groundY + Math.sin(tree.x * 10) * 8;
        drawPineTree(tx, baseY, tree.scale, tree.depth, w);
      }

      // Cabin
      const cabinX = w * 0.5;
      const cabinY = groundY + Math.sin(0.5 * 10) * 8;
      const cabinW = 50;
      const cabinH = 35;
      const roofH = 25;
      // Cabin body
      ctx.fillStyle = '#8a7a60';
      ctx.fillRect(cabinX - cabinW / 2, cabinY - cabinH, cabinW, cabinH);
      // Darker wood lines
      ctx.strokeStyle = '#6a5a40';
      ctx.lineWidth = 1;
      for (let ly = cabinY - cabinH + 7; ly < cabinY; ly += 7) {
        ctx.beginPath();
        ctx.moveTo(cabinX - cabinW / 2, ly);
        ctx.lineTo(cabinX + cabinW / 2, ly);
        ctx.stroke();
      }
      // Roof
      ctx.fillStyle = '#5a4a3a';
      ctx.beginPath();
      ctx.moveTo(cabinX, cabinY - cabinH - roofH);
      ctx.lineTo(cabinX - cabinW / 2 - 8, cabinY - cabinH);
      ctx.lineTo(cabinX + cabinW / 2 + 8, cabinY - cabinH);
      ctx.closePath();
      ctx.fill();
      // Snow on roof
      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath();
      ctx.moveTo(cabinX, cabinY - cabinH - roofH - 3);
      ctx.lineTo(cabinX - cabinW / 2 - 12, cabinY - cabinH + 4);
      ctx.lineTo(cabinX + cabinW / 2 + 12, cabinY - cabinH + 4);
      ctx.closePath();
      ctx.fill();
      // Window with warm glow
      const winX = cabinX - 6;
      const winY = cabinY - cabinH + 10;
      const winW = 12;
      const winH = 14;
      ctx.fillStyle = '#e8c870';
      ctx.fillRect(winX, winY, winW, winH);
      // Window glow
      const wGlow = ctx.createRadialGradient(winX + winW / 2, winY + winH / 2, 0, winX + winW / 2, winY + winH / 2, 50);
      wGlow.addColorStop(0, 'rgba(232, 200, 112, 0.15)');
      wGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = wGlow;
      ctx.fillRect(winX - 40, winY - 40, winW + 80, winH + 80);
      // Window cross
      ctx.strokeStyle = '#6a5a40';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX, winY + winH / 2);
      ctx.lineTo(winX + winW, winY + winH / 2);
      ctx.stroke();
      // Door
      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(cabinX + 8, cabinY - 18, 10, 18);
      // Snow drift at cabin base
      ctx.fillStyle = '#e8e8f0';
      ctx.beginPath();
      ctx.ellipse(cabinX, cabinY, cabinW / 2 + 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Snowflakes
      const windX = Math.sin(t * 0.8) * 0.4 + gustStrength * 1.2;
      ctx.fillStyle = '#ffffff';
      for (const f of flakes) {
        f.y += f.speed;
        f.x += Math.sin(f.drift + t * 1.2) * 0.3 + windX * f.speed * 0.4;
        if (f.y > h + 5) {
          f.y = -5 - Math.random() * 30;
          f.x = Math.random() * w;
        }
        const fx = ((f.x % w) + w) % w;
        ctx.globalAlpha = f.alpha * (0.7 + Math.sin(t + f.drift) * 0.3);
        ctx.beginPath();
        ctx.arc(fx, f.y, f.r, 0, Math.PI * 2);
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
