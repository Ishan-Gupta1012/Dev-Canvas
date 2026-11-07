'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LandingFooter() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#F4F4F2] border-t border-[rgba(41,44,48,0.1)] select-none pt-16 pb-0 flex flex-col justify-between">
      {/* Background Subtle Tech Dot Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(41, 44, 48, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
        {/* Clean Editorial Brand Row — No Dummy Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-[rgba(41,44,48,0.1)]">
          {/* Brand & Purpose */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-[#111315] tracking-tight">
                DevCanvas
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            </div>
            <p className="font-mono text-[11.5px] text-[#777C82]">
              Career ecosystem engineered for modern developers.
            </p>
          </div>

          {/* Real Live Edge System Status */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(41,44,48,0.14)] bg-white/80 font-mono text-[10.5px] text-[#292C30] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
              <span className="text-[#CBD0D8]">·</span>
              <span className="text-[#777C82]">Edge Deployed</span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-6 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#777C82]">
          <p>© {new Date().getFullYear()} DevCanvas. All rights reserved.</p>
          <p className="text-[#4A4E54] font-medium">One profile. Resume and live portfolio in perpetual sync.</p>
        </div>
      </div>

      {/* ── Interactive Ghost Wordmark (At the Absolute Bottomest Edge) ── */}
      {/* On hover, reflects a soft faded red ambient glow on the portion being hovered */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative z-10 w-full cursor-default select-none overflow-hidden mt-auto pt-2"
      >
        {/* Base Faint Watermark (Quiet resting state) */}
        <p
          className="text-center font-bold tracking-[-0.04em] leading-[0.74] -mb-[0.08em] transition-colors duration-300"
          style={{
            fontSize: 'clamp(4rem, 17vw, 16rem)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            color: 'rgba(17, 19, 21, 0.04)',
          }}
        >
          DEVCANVAS
        </p>

        {/* Dynamic Faded Red Glow Overlay that reveals exactly where the cursor hovers */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            maskImage: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 80%)`,
          }}
        >
          <p
            className="text-center font-bold tracking-[-0.04em] leading-[0.74] -mb-[0.08em]"
            style={{
              fontSize: 'clamp(4rem, 17vw, 16rem)',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              color: '#EF4444',
              textShadow: '0 0 45px rgba(239, 68, 68, 0.65), 0 0 90px rgba(239, 68, 68, 0.35)',
            }}
          >
            DEVCANVAS
          </p>
        </div>
      </div>
    </footer>
  );
}