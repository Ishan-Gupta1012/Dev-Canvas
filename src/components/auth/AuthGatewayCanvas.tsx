'use client';

import React, { useEffect, useRef } from 'react';

interface AuthGatewayCanvasProps {
  /** When true, particles spiral inward toward the portal core */
  focused?: boolean;
  className?: string;
}

export default function AuthGatewayCanvas({ focused = false, className = '' }: AuthGatewayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusedRef = useRef(focused);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    focusedRef.current = focused;
  }, [focused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let frameId = 0;
    let time = 0;

    const PARTICLE_COUNT = 720;
    const majorR = 1.4;
    const minorR = 0.42;

    // Pre-compute torus positions
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const u = (i / PARTICLE_COUNT) * Math.PI * 2;
      const v = ((i * 7) % PARTICLE_COUNT / PARTICLE_COUNT) * Math.PI * 2;
      return { u, v, phase: Math.random() * Math.PI * 2 };
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      time += prefersReducedMotion ? 0 : 0.012;
      const focusTarget = focusedRef.current ? 1 : 0;
      // Smooth focus transition stored on canvas element
      const prev = (canvas as HTMLCanvasElement & { _fb?: number })._fb ?? 0;
      const fb = prev + (focusTarget - prev) * 0.06;
      (canvas as HTMLCanvasElement & { _fb?: number })._fb = fb;

      // Deep void background with subtle radial warmth
      const bg = ctx.createRadialGradient(w * 0.35, h * 0.5, 0, w * 0.35, h * 0.5, Math.max(w, h) * 0.7);
      bg.addColorStop(0, '#1A0C08');
      bg.addColorStop(0.45, '#0A0402');
      bg.addColorStop(1, '#050201');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.38;
      const cy = h * 0.5;
      const scale = Math.min(w, h) * 0.22;
      const { x: mx, y: my } = mouseRef.current;
      const hasMouse = mx > -9000;

      const rotY = time * 0.7;
      const rotX = 0.55 + Math.sin(time * 0.4) * 0.15;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Core glow
      const corePulse = 0.6 + Math.sin(time * 2.2) * 0.2;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.35 * (1 - fb * 0.5));
      coreGrad.addColorStop(0, `rgba(255, 107, 74, ${0.35 * corePulse})`);
      coreGrad.addColorStop(0.4, `rgba(232, 168, 124, ${0.12 * corePulse})`);
      coreGrad.addColorStop(1, 'rgba(10, 4, 2, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Scan rings
      if (!prefersReducedMotion) {
        for (let ring = 0; ring < 3; ring++) {
          const ringR = scale * (0.55 + ring * 0.18 + ((time * 0.3 + ring * 0.33) % 1) * 0.25);
          ctx.strokeStyle = `rgba(232, 168, 124, ${0.04 - ring * 0.01})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      interface Projected {
        sx: number;
        sy: number;
        depth: number;
        idx: number;
      }
      const projected: Projected[] = [];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const { u, v, phase } = particles[i];
        const wobble = Math.sin(time * 3 + phase) * 0.02 * (1 - fb);

        let tx = (majorR + (minorR + wobble) * Math.cos(v)) * Math.cos(u);
        let ty = (majorR + (minorR + wobble) * Math.cos(v)) * Math.sin(u);
        let tz = (minorR + wobble) * Math.sin(v);

        // Focus spiral — pull toward center
        const spiral = fb * 0.72;
        tx *= 1 - spiral;
        ty *= 1 - spiral;
        tz *= 1 - spiral;

        // Y rotation
        let rx = tx * cosY - tz * sinY;
        let rz = tx * sinY + tz * cosY;
        let ry = ty;

        // X rotation
        const ry2 = ry * cosX - rz * sinX;
        const rz2 = ry * sinX + rz * cosX;

        const persp = 1 / (3.2 - rz2);
        let sx = cx + rx * scale * persp;
        let sy = cy + ry2 * scale * persp;

        // Mouse lens distortion
        if (hasMouse && !prefersReducedMotion) {
          const dx = sx - mx;
          const dy = sy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 1) {
            const force = ((180 - dist) / 180) * 40;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
          }
        }

        projected.push({ sx, sy, depth: rz2, idx: i });
      }

      projected.sort((a, b) => a.depth - b.depth);

      for (const p of projected) {
        const depthNorm = (p.depth + 2) / 4;
        const alpha = 0.15 + depthNorm * 0.65;
        const size = 0.8 + depthNorm * 1.8;

        // Amber → vermillion → copper based on position
        const hue = p.idx / PARTICLE_COUNT;
        let r: number, g: number, b: number;
        if (hue < 0.33) {
          r = 255; g = 107; b = 74;
        } else if (hue < 0.66) {
          r = 232; g = 168; b = 124;
        } else {
          r = 160; g = 103; b = 79;
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby particles with faint lines (creates mesh effect)
      ctx.lineWidth = 0.4;
      const step = prefersReducedMotion ? 8 : 4;
      for (let i = 0; i < projected.length; i += step) {
        const a = projected[i];
        for (let j = i + step; j < Math.min(i + step * 4, projected.length); j += step) {
          const b = projected[j];
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          if (dx * dx + dy * dy < 3600) {
            ctx.strokeStyle = `rgba(232, 168, 124, ${0.06 * ((a.depth + b.depth) / 4 + 0.5)})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        frameId = requestAnimationFrame(render);
      }
    };

    render();

    const onResize = () => resize();
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
