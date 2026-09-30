'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Exact 7-row high-definition digital pixel matrix coordinates for "DevCanvas" (44 columns x 7 rows)
interface PixelBlock {
  col: number;
  row: number;
  charIndex: number;
}

const WORDMARK_BLOCKS: PixelBlock[] = [
  // 'D' (cols 0..3, rows 0..6)
  { col: 0, row: 0, charIndex: 0 },
  { col: 1, row: 0, charIndex: 0 },
  { col: 2, row: 0, charIndex: 0 },
  { col: 0, row: 1, charIndex: 0 },
  { col: 3, row: 1, charIndex: 0 },
  { col: 0, row: 2, charIndex: 0 },
  { col: 3, row: 2, charIndex: 0 },
  { col: 0, row: 3, charIndex: 0 },
  { col: 3, row: 3, charIndex: 0 },
  { col: 0, row: 4, charIndex: 0 },
  { col: 3, row: 4, charIndex: 0 },
  { col: 0, row: 5, charIndex: 0 },
  { col: 3, row: 5, charIndex: 0 },
  { col: 0, row: 6, charIndex: 0 },
  { col: 1, row: 6, charIndex: 0 },
  { col: 2, row: 6, charIndex: 0 },

  // 'e' (cols 5..8, rows 2..6)
  { col: 6, row: 2, charIndex: 1 },
  { col: 7, row: 2, charIndex: 1 },
  { col: 5, row: 3, charIndex: 1 },
  { col: 8, row: 3, charIndex: 1 },
  { col: 5, row: 4, charIndex: 1 },
  { col: 6, row: 4, charIndex: 1 },
  { col: 7, row: 4, charIndex: 1 },
  { col: 8, row: 4, charIndex: 1 },
  { col: 5, row: 5, charIndex: 1 },
  { col: 6, row: 6, charIndex: 1 },
  { col: 7, row: 6, charIndex: 1 },
  { col: 8, row: 6, charIndex: 1 },

  // 'v' (cols 10..13, rows 2..6)
  { col: 10, row: 2, charIndex: 2 },
  { col: 13, row: 2, charIndex: 2 },
  { col: 10, row: 3, charIndex: 2 },
  { col: 13, row: 3, charIndex: 2 },
  { col: 10, row: 4, charIndex: 2 },
  { col: 13, row: 4, charIndex: 2 },
  { col: 11, row: 5, charIndex: 2 },
  { col: 12, row: 5, charIndex: 2 },
  { col: 11, row: 6, charIndex: 2 },
  { col: 12, row: 6, charIndex: 2 },

  // 'C' (cols 15..18, rows 0..6)
  { col: 16, row: 0, charIndex: 3 },
  { col: 17, row: 0, charIndex: 3 },
  { col: 18, row: 0, charIndex: 3 },
  { col: 15, row: 1, charIndex: 3 },
  { col: 15, row: 2, charIndex: 3 },
  { col: 15, row: 3, charIndex: 3 },
  { col: 15, row: 4, charIndex: 3 },
  { col: 15, row: 5, charIndex: 3 },
  { col: 16, row: 6, charIndex: 3 },
  { col: 17, row: 6, charIndex: 3 },
  { col: 18, row: 6, charIndex: 3 },

  // 'a' (cols 20..23, rows 2..6)
  { col: 21, row: 2, charIndex: 4 },
  { col: 22, row: 2, charIndex: 4 },
  { col: 23, row: 3, charIndex: 4 },
  { col: 21, row: 4, charIndex: 4 },
  { col: 22, row: 4, charIndex: 4 },
  { col: 23, row: 4, charIndex: 4 },
  { col: 20, row: 5, charIndex: 4 },
  { col: 23, row: 5, charIndex: 4 },
  { col: 21, row: 6, charIndex: 4 },
  { col: 22, row: 6, charIndex: 4 },
  { col: 23, row: 6, charIndex: 4 },

  // 'n' (cols 25..28, rows 2..6)
  { col: 25, row: 2, charIndex: 5 },
  { col: 26, row: 2, charIndex: 5 },
  { col: 27, row: 2, charIndex: 5 },
  { col: 25, row: 3, charIndex: 5 },
  { col: 28, row: 3, charIndex: 5 },
  { col: 25, row: 4, charIndex: 5 },
  { col: 28, row: 4, charIndex: 5 },
  { col: 25, row: 5, charIndex: 5 },
  { col: 28, row: 5, charIndex: 5 },
  { col: 25, row: 6, charIndex: 5 },
  { col: 28, row: 6, charIndex: 5 },

  // 'v' (cols 30..33, rows 2..6)
  { col: 30, row: 2, charIndex: 6 },
  { col: 33, row: 2, charIndex: 6 },
  { col: 30, row: 3, charIndex: 6 },
  { col: 33, row: 3, charIndex: 6 },
  { col: 30, row: 4, charIndex: 6 },
  { col: 33, row: 4, charIndex: 6 },
  { col: 31, row: 5, charIndex: 6 },
  { col: 32, row: 5, charIndex: 6 },
  { col: 31, row: 6, charIndex: 6 },
  { col: 32, row: 6, charIndex: 6 },

  // 'a' (cols 35..38, rows 2..6)
  { col: 36, row: 2, charIndex: 7 },
  { col: 37, row: 2, charIndex: 7 },
  { col: 38, row: 3, charIndex: 7 },
  { col: 36, row: 4, charIndex: 7 },
  { col: 37, row: 4, charIndex: 7 },
  { col: 38, row: 4, charIndex: 7 },
  { col: 35, row: 5, charIndex: 7 },
  { col: 38, row: 5, charIndex: 7 },
  { col: 36, row: 6, charIndex: 7 },
  { col: 37, row: 6, charIndex: 7 },
  { col: 38, row: 6, charIndex: 7 },

  // 's' (cols 40..43, rows 2..6)
  { col: 41, row: 2, charIndex: 8 },
  { col: 42, row: 2, charIndex: 8 },
  { col: 43, row: 2, charIndex: 8 },
  { col: 40, row: 3, charIndex: 8 },
  { col: 41, row: 4, charIndex: 8 },
  { col: 42, row: 4, charIndex: 8 },
  { col: 43, row: 5, charIndex: 8 },
  { col: 40, row: 6, charIndex: 8 },
  { col: 41, row: 6, charIndex: 8 },
  { col: 42, row: 6, charIndex: 8 },
];

const CHROMATIC_PALETTE = [
  '#F3E7D8', // Warm Cream
  '#E8C39E', // Sand
  '#D9A066', // Amber
  '#C97B4A', // Terracotta
  '#A0674F', // Warm Copper
  '#7C3F2F', // Burnt Sienna
  '#56241A', // Earthy Burgundy
  '#E8C39E', // Sand
  '#F3E7D8', // Warm Cream
];

interface AnimatedBlock {
  base: PixelBlock;
  appearTime: number;
  lockTime: number;
  initialOffsetCols: number;
  initialOffsetRows: number;
  flickerRate: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  birthTime: number;
  lifetime: number;
}

const EXIT_MS = 900;

export default function RechromaPreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [statusText, setStatusText] = useState('ASSEMBLING DEVCANVAS MATRIX');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isFinishedRef = useRef(false);
  const sparklesRef = useRef<SparkleParticle[]>([]);

  // The panel dissolves slowly so the page underneath is already readable by the
  // time it lifts away
  const finishPreloader = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setOpacity(0);
    setTimeout(() => {
      setIsVisible(false);
    }, EXIT_MS);
  }, []);

  useEffect(() => {
    // Safety fallback: guaranteed to dismiss after 2.8s maximum
    const safetyTimer = setTimeout(() => {
      finishPreloader();
    }, 2800);

    return () => clearTimeout(safetyTimer);
  }, [finishPreloader]);

  // Main Canvas Particle Assemblage Loop
  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Escape key listener to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finishPreloader();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Generate block initial states
    const blocks: AnimatedBlock[] = WORDMARK_BLOCKS.map((b, idx) => ({
      base: b,
      appearTime: 0.04 + (b.charIndex * 0.07) + ((idx % 3) * 0.03),
      lockTime: 0.8 + (b.charIndex * 0.05),
      initialOffsetCols: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 4),
      initialOffsetRows: (Math.random() - 0.5) * 2,
      flickerRate: 18 + Math.random() * 22,
    }));

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Status text progression
      if (elapsed > 1.0 && elapsed < 1.8) {
        setStatusText('DEVCANVAS MATRIX LOCKED');
      } else if (elapsed >= 1.8) {
        setStatusText('DEVCANVAS READY');
      }

      // Automatically trigger finish at 2.2s
      if (elapsed >= 2.2 && !isFinishedRef.current) {
        finishPreloader();
      }

      ctx.clearRect(0, 0, width, height);

      // Sizing for 44 columns x 7 rows
      const targetWidth = Math.min(width * 0.9, 860);
      const blockSize = targetWidth / 44;
      const gridHeight = blockSize * 7;
      const originX = (width - targetWidth) / 2;
      const originY = (height - gridHeight) / 2;

      // Spawn sparkling micro-particles around the letters
      if (elapsed < 2.0 && Math.random() < 0.45) {
        const randBlock = blocks[Math.floor(Math.random() * blocks.length)];
        const sx = originX + randBlock.base.col * blockSize + (Math.random() - 0.5) * blockSize * 2;
        const sy = originY + randBlock.base.row * blockSize + (Math.random() - 0.5) * blockSize * 2;
        sparklesRef.current.push({
          x: sx,
          y: sy,
          size: Math.random() * 2.5 + 1,
          alpha: 0.8,
          birthTime: elapsed,
          lifetime: 0.2 + Math.random() * 0.25,
        });
      }

      // Draw and update sparkling particles
      sparklesRef.current = sparklesRef.current.filter((sp) => {
        const age = elapsed - sp.birthTime;
        if (age > sp.lifetime) return false;
        const curAlpha = sp.alpha * (1 - age / sp.lifetime);
        ctx.fillStyle = `rgba(243, 231, 216, ${curAlpha})`;
        ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
        return true;
      });

      // Render the DevCanvas pixel blocks
      blocks.forEach((block) => {
        let col = block.base.col;
        let row = block.base.row;
        let alpha = 0;
        let isLocked = false;

        if (elapsed < block.appearTime) {
          alpha = 0;
        } else if (elapsed < block.lockTime) {
          const progress = (elapsed - block.appearTime) / (block.lockTime - block.appearTime);
          const decay = Math.pow(1 - progress, 2);

          // Sparkling digital flicker
          const flicker = Math.sin(elapsed * block.flickerRate);
          alpha = flicker > -0.2 ? 0.35 + progress * 0.65 : 0.08;

          col = block.base.col + block.initialOffsetCols * decay;
          row = block.base.row + block.initialOffsetRows * decay;
        } else {
          // Permanently locked into place
          col = block.base.col;
          row = block.base.row;
          alpha = 1.0;
          isLocked = true;
        }

        if (alpha > 0.02) {
          const bx = Math.round(originX + col * blockSize);
          const by = Math.round(originY + row * blockSize);
          const bSize = Math.max(1, Math.round(blockSize - 1));

          ctx.save();
          ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

          // Color: Starts pale cream and warms into the landing palette once locked
          if (isLocked && elapsed > 1.1) {
            ctx.fillStyle = CHROMATIC_PALETTE[block.base.charIndex % CHROMATIC_PALETTE.length];
            // Subtle glow
            ctx.shadowColor = CHROMATIC_PALETTE[block.base.charIndex % CHROMATIC_PALETTE.length];
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = '#F3E7D8';
            ctx.shadowColor = 'rgba(232, 195, 158, 0.5)';
            ctx.shadowBlur = 4;
          }

          ctx.fillRect(bx, by, bSize, bSize);

          // Crisp inner pixel border
          if (bSize >= 10) {
            ctx.strokeStyle = 'rgba(62, 21, 16, 0.28)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + 0.5, by + 0.5, bSize - 1, bSize - 1);
          }

          ctx.restore();
        }
      });

      if (!isFinishedRef.current || elapsed < 2.6) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, finishPreloader]);

  if (!isVisible) return null;

  return (
    <div
      onClick={finishPreloader}
      className="fixed inset-0 z-[9999] bg-[#3E1510] flex flex-col items-center justify-center select-none cursor-pointer"
      style={{
        opacity,
        transition: `opacity ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: opacity <= 0 ? 'none' : 'auto',
      }}
      title="Click anywhere or press [ESC] to skip"
    >
      {/* Background Subtle Radial Glow */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #56241A 0%, #2A0E08 78%)',
        }}
      />

      {/* High-Performance Canvas where the sparkling pixels assemble DevCanvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Minimal Status Indicator at Bottom */}
      <div className="absolute bottom-12 flex items-center gap-2.5 text-[#E8C39E] font-mono text-[11px] tracking-[0.2em] uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9A066] animate-pulse" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
