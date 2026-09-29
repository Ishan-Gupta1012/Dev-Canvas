'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OpeningOverlayProps {
  scrollProgress: number; // 0.0 to 1.0
  onEnterSite: () => void;
  pointerPos: { x: number; y: number }; // normalized -1 to 1
}

export default function OpeningOverlay({
  scrollProgress,
  onEnterSite,
  pointerPos,
}: OpeningOverlayProps) {
  const [localTime, setLocalTime] = useState('');
  const [driftValue, setDriftValue] = useState('+0.042');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subtle procedural fluctuation of system telemetry drift
    const interval = setInterval(() => {
      const val = (Math.random() * 0.08 - 0.04).toFixed(4);
      setDriftValue(val.startsWith('-') ? val : `+${val}`);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Text fade and drift based on scroll
  const textOpacity = Math.max(0, 1 - scrollProgress * 2.2);
  const textTranslateY = -scrollProgress * 120;
  const bottomTranslateY = scrollProgress * 80;

  // Custom cursor follower position
  const [cursorScreenPos, setCursorScreenPos] = useState({ x: -100, y: -100 });
  const [isPointerActive, setIsPointerActive] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorScreenPos({ x: e.clientX, y: e.clientY });
      setIsPointerActive(true);
    };
    const onLeave = () => setIsPointerActive(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden"
      style={{
        opacity: textOpacity,
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Axiom-inspired Interactive Amber Cursor Follower */}
      {isPointerActive && scrollProgress < 0.85 && (
        <div
          className="fixed pointer-events-none z-[99999] rounded-full transition-transform duration-75 ease-out hidden md:block"
          style={{
            left: `${cursorScreenPos.x}px`,
            top: `${cursorScreenPos.y}px`,
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(218, 132, 10)',
            boxShadow: '0 0 16px rgba(218, 132, 10, 0.8), 0 0 4px rgba(255, 255, 255, 0.9)',
          }}
        />
      )}

      {/* TOP BAR: Brand & Technical Telemetry */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: `translateY(${textTranslateY * 0.4}px)` }}
        className="flex items-start justify-between w-full font-mono text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400 border-b border-white/10 pb-4"
      >
        {/* Left: Brand Identity */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-white tracking-[0.2em] text-[12px] sm:text-[13px]">
              DEVCANVAS
            </span>
            <span className="text-neutral-500 hidden sm:inline">/</span>
            <span className="text-neutral-400 hidden sm:inline tracking-widest text-[11px]">
              PORTFOLIO ARCHITECTURE
            </span>
          </div>
          <div className="text-[10px] text-neutral-500 pl-4 tracking-widest">
            EST. 2026 · HANOI // GLOBAL
          </div>
        </div>

        {/* Center: Live Clock & Coordinates (Axiom style) */}
        <div className="hidden lg:flex flex-col items-center gap-0.5 text-center">
          <div className="text-white/90 tracking-widest font-mono text-[11px]">
            HANOI: {localTime || '12:00:00'} VN
          </div>
          <div className="text-[10px] text-neutral-500 tracking-[0.18em]">
            COORD: 21°01&apos;40&quot;N 105°51&apos;08&quot;E
          </div>
        </div>

        {/* Right: Telemetry & Enter Button */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="hidden md:flex flex-col text-right text-[10px] text-neutral-400 tracking-widest gap-0.5">
            <div>
              <span className="text-neutral-500">ATTRACTOR: </span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div>
              <span className="text-neutral-500">SYSTEM DRIFT: </span>
              <span className="text-amber-400">{driftValue}</span>
            </div>
          </div>

          <button
            onClick={onEnterSite}
            className="pointer-events-auto px-3.5 py-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase rounded border border-white/20 text-neutral-300 hover:text-white hover:border-amber-400 hover:bg-amber-500/10 transition-all duration-200 flex items-center gap-1.5 group cursor-pointer"
          >
            <span>ENTER SITE</span>
            <span className="text-amber-400 group-hover:translate-y-0.5 transition-transform duration-200">
              ↓
            </span>
          </button>
        </div>
      </motion.header>

      {/* CENTER / HERO EDITORIAL CONTENT */}
      <div
        className="w-full max-w-5xl mx-auto flex flex-col justify-center items-start my-auto py-12"
        style={{
          transform: `translateY(${textTranslateY}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Section Index Tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] sm:text-xs text-amber-500 tracking-[0.25em] uppercase mb-4 flex items-center gap-2"
        >
          <span>✦</span>
          <span>[00 // ENTRANCE PORTAL]</span>
          <span className="text-neutral-600">—</span>
          <span className="text-neutral-400">RESEARCH &amp; CREATIVE PRACTICE</span>
        </motion.div>

        {/* Large Statement Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white mb-6 max-w-4xl"
        >
          Why are developer portfolios{' '}
          <span className="italic font-light text-neutral-400 text-stroke">
            still stuck in 2020?
          </span>
        </motion.h1>

        {/* Short Editorial Manifesto Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full text-neutral-300 text-xs sm:text-sm font-sans leading-relaxed"
        >
          <div className="md:col-span-7">
            <p className="border-l border-amber-500/60 pl-4 py-1 text-neutral-300/90 font-light">
              We turn developer code into bespoke visual brands. Every portfolio begins with intention—sketched on craft paper, refined with care, and engineered to endure.
            </p>
          </div>
          <div className="md:col-span-5 flex flex-col justify-end font-mono text-[10px] sm:text-[11px] text-neutral-400 tracking-wider">
            <div>CORE ARCHITECTS:</div>
            <div className="text-white font-medium">ISHAN GUPTA &amp; APARNA JHA</div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM BAR: Interaction Instruction & Status */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: `translateY(${bottomTranslateY}px)` }}
        className="flex items-end justify-between w-full font-mono text-[11px] sm:text-xs uppercase tracking-wider text-neutral-400 border-t border-white/10 pt-4"
      >
        {/* Left: Scroll Prompt with Hairline Animation */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-4 h-8 border border-neutral-700 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 bg-amber-400 rounded-full"
            />
          </div>
          <div className="flex flex-col text-[10px] sm:text-[11px]">
            <span className="text-white tracking-widest">SCROLL TO TRANSFORM</span>
            <span className="text-neutral-500 text-[9px] tracking-wider">
              PORTAL UNLOCKS AT 100%
            </span>
          </div>
        </div>

        {/* Center: Scroll Progress Percentage Gauge */}
        <div className="flex flex-col items-center text-center">
          <div className="text-[10px] text-neutral-500 tracking-[0.2em]">PORTAL DILATION</div>
          <div className="font-mono text-sm sm:text-base font-semibold text-amber-400">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* Right: Dynamic Interactive Coordinates / Pointer indicator */}
        <div className="hidden sm:flex flex-col items-end text-right text-[10px] text-neutral-400 tracking-widest gap-0.5">
          <div>
            <span className="text-neutral-500">CURSOR INTERACTION: </span>
            <span className="text-neutral-200">
              X:{pointerPos.x.toFixed(2)} Y:{pointerPos.y.toFixed(2)}
            </span>
          </div>
          <div className="text-neutral-500 text-[9px]">
            INTERACTIVE WEBGL FIELD // THREE.JS
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
