'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function DossierPlayingCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this 260vh pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Physical playing-card spring configuration: realistic inertia, zero robotic snap
  const springConfig = { stiffness: 90, damping: 22, mass: 0.7 };

  // --- CARD 01 SEQUENTIAL FLIP (0.06 -> 0.34) ---
  // Rotates 0deg -> -180deg around Y axis (Right to Left flip)
  const r1 = useTransform(scrollYProgress, [0.06, 0.34], [0, -180]);
  const z1 = useTransform(scrollYProgress, [0.06, 0.20, 0.34], [0, 45, 0]);
  const springR1 = useSpring(r1, springConfig);
  const springZ1 = useSpring(z1, springConfig);

  // --- CARD 02 SEQUENTIAL FLIP (0.34 -> 0.62) ---
  const r2 = useTransform(scrollYProgress, [0.34, 0.62], [0, -180]);
  const z2 = useTransform(scrollYProgress, [0.34, 0.48, 0.62], [0, 45, 0]);
  const springR2 = useSpring(r2, springConfig);
  const springZ2 = useSpring(z2, springConfig);

  // --- CARD 03 SEQUENTIAL FLIP (0.62 -> 0.90) ---
  const r3 = useTransform(scrollYProgress, [0.62, 0.90], [0, -180]);
  const z3 = useTransform(scrollYProgress, [0.62, 0.76, 0.90], [0, 45, 0]);
  const springR3 = useSpring(r3, springConfig);
  const springZ3 = useSpring(z3, springConfig);

  // Dynamic progress indicator feedback
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      id="archive"
      ref={containerRef}
      className="relative w-full h-[260vh] max-sm:h-[300vh]"
    >
      {/* Pinned Sticky 3D Interaction Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center px-[40px] max-sm:px-[20px] overflow-hidden pointer-events-auto">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-[36px]">
          
          {/* Section Header with Telemetry & Flip Indicator */}
          <div className="flex justify-between items-baseline border-b border-[#CCC0B5] pb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-mono text-[16px] leading-[1.2] uppercase text-[#56241A] font-bold">
                [03 // RESEARCH DOSSIERS]
              </h2>
              <span className="font-mono text-[10px] text-[#A0674F] border border-[#A0674F]/40 bg-[#A0674F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wider hidden sm:inline">
                SCROLL-CONTROLLED 3D CARDS
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#7C3F2F] uppercase hidden md:flex">
                <span>FLIP SEQUENCE:</span>
                <span className="text-[#56241A] font-bold">RIGHT → LEFT 180°</span>
              </div>
              <span className="font-mono text-[12px] uppercase text-[#7C3F2F] font-medium">
                CASE STUDIES IN PORTFOLIO COHERENCE
              </span>
            </div>
          </div>

          {/* 3 Horizontal Playing Cards Grid (Perspective Container) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] w-full">
            
            {/* ==================== CARD 01 ==================== */}
            <div
              className="w-full h-[400px] max-lg:h-[360px]"
              style={{ perspective: 1400 }}
            >
              <motion.div
                className="relative w-full h-full rounded-xs shadow-xl"
                style={{
                  rotateY: springR1,
                  z: springZ1,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* FRONT FACE (EXACT EXISTING CONTENT & STYLING PRESERVED) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#34281D] flex flex-col justify-between p-[24px] text-[#FFFFFF] rounded-xs border border-[#3E1510] shadow-md select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <div>
                    <div className="flex justify-between font-mono text-[12px] tracking-[-0.36px] uppercase border-b border-[#3E1510] pb-3 mb-4">
                      <span className="font-bold text-[#CCC0B5]">DOSSIER 01</span>
                      <span className="text-[#A0674F] font-semibold">[COHERENCE]</span>
                    </div>
                    <h3 className="font-serif text-[34px] max-sm:text-[26px] leading-tight tracking-[-1.2px] py-2 text-[#FFFFFF]">
                      Field Coherence in Technical Portfolios
                    </h3>
                  </div>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] max-sm:text-[11px] leading-[1.4] uppercase border-t border-[#3E1510] pt-4">
                    <p className="text-[#EEEBE7]/80">
                      Under typical conditions, developer achievements remain buried in unread PDFs.
                    </p>
                    <p className="text-[#EEEBE7]/80">
                      Coherence emerges not from text bloat, but as an immediate stabilization of technical trajectories and commit architectures.
                    </p>
                  </div>
                </div>

                {/* BACK FACE (ELEGANT EDITORIAL PLAYING-CARD REVERSE) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#270F05] text-[#FFFFFF] rounded-xs border border-[#3E1510] shadow-md select-none p-3"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-full h-full border border-[#A0674F]/30 p-5 rounded-xs flex flex-col justify-between bg-[#270F05]/90">
                    {/* Top Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#A0674F]">
                      <span className="font-bold border border-[#A0674F]/40 px-1.5 py-0.5 rounded-xs">[01]</span>
                      <span className="text-xs text-[#7C3F2F]">✦</span>
                    </div>

                    {/* Central Seal & Monogram */}
                    <div className="flex flex-col items-center justify-center text-center gap-3 my-auto">
                      <div className="w-16 h-16 rounded-full border border-[#56241A] bg-[#34281D] flex items-center justify-center shadow-lg">
                        <span className="font-serif italic text-2xl text-[#A0674F]">C</span>
                      </div>
                      <div className="font-mono text-[12px] tracking-[0.25em] uppercase text-[#EEEBE7] font-bold">
                        COHERENCE SPEC
                      </div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-[#CCC0B5]/60">
                        DEVCANVAS // ARCHITECTURE 01
                      </div>
                      <div className="w-12 h-[1px] bg-[#A0674F]/40 my-1" />
                      <div className="font-mono text-[9px] uppercase tracking-wider text-[#7C3F2F] font-semibold">
                        STATUS: STABILIZED MANIFOLD
                      </div>
                    </div>

                    {/* Bottom Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#A0674F]">
                      <span className="text-xs text-[#7C3F2F]">✦</span>
                      <span className="font-bold border border-[#A0674F]/40 px-1.5 py-0.5 rounded-xs">[01]</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ==================== CARD 02 ==================== */}
            <div
              className="w-full h-[400px] max-lg:h-[360px]"
              style={{ perspective: 1400 }}
            >
              <motion.div
                className="relative w-full h-full rounded-xs shadow-xl"
                style={{
                  rotateY: springR2,
                  z: springZ2,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* FRONT FACE (EXACT EXISTING CONTENT & STYLING PRESERVED) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#3E1510] flex flex-col justify-between p-[24px] text-[#FFFFFF] rounded-xs border border-[#270F05] shadow-md select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <div>
                    <div className="flex justify-between font-mono text-[12px] tracking-[-0.36px] uppercase border-b border-[#270F05] pb-3 mb-4">
                      <span className="font-bold text-[#CCC0B5]">DOSSIER 02</span>
                      <span className="text-[#7C3F2F] font-semibold">[ATTRACTOR]</span>
                    </div>
                    <h3 className="font-serif text-[34px] max-sm:text-[26px] leading-tight tracking-[-1.2px] py-2 text-[#FFFFFF]">
                      Attractor Formation in Engineering Identity
                    </h3>
                  </div>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] max-sm:text-[11px] leading-[1.4] uppercase border-t border-[#270F05] pt-4">
                    <p className="text-[#EEEBE7]/80">
                      Recruiters and engineering leads spend under 15 seconds evaluating a portfolio.
                    </p>
                    <p className="text-[#EEEBE7]/80">
                      A bespoke architectural presence acts as an immediate gravitational attractor, permanently altering evaluation states.
                    </p>
                  </div>
                </div>

                {/* BACK FACE (ELEGANT EDITORIAL PLAYING-CARD REVERSE) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#34281D] text-[#FFFFFF] rounded-xs border border-[#3E1510] shadow-md select-none p-3"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-full h-full border border-[#7C3F2F]/35 p-5 rounded-xs flex flex-col justify-between bg-[#34281D]/90">
                    {/* Top Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#7C3F2F]">
                      <span className="font-bold border border-[#7C3F2F]/40 px-1.5 py-0.5 rounded-xs">[02]</span>
                      <span className="text-xs text-[#A0674F]">✦</span>
                    </div>

                    {/* Central Seal & Monogram */}
                    <div className="flex flex-col items-center justify-center text-center gap-3 my-auto">
                      <div className="w-16 h-16 rounded-full border border-[#7C3F2F] bg-[#270F05] flex items-center justify-center shadow-lg">
                        <span className="font-serif italic text-2xl text-[#7C3F2F]">A</span>
                      </div>
                      <div className="font-mono text-[12px] tracking-[0.25em] uppercase text-[#EEEBE7] font-bold">
                        ATTRACTOR FIELD
                      </div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-[#CCC0B5]/60">
                        DEVCANVAS // TRAJECTORY 02
                      </div>
                      <div className="w-12 h-[1px] bg-[#7C3F2F]/40 my-1" />
                      <div className="font-mono text-[9px] uppercase tracking-wider text-[#A0674F] font-semibold">
                        STATUS: GRAVITATIONAL LOCK
                      </div>
                    </div>

                    {/* Bottom Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#7C3F2F]">
                      <span className="text-xs text-[#A0674F]">✦</span>
                      <span className="font-bold border border-[#7C3F2F]/40 px-1.5 py-0.5 rounded-xs">[02]</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ==================== CARD 03 ==================== */}
            <div
              className="w-full h-[400px] max-lg:h-[360px]"
              style={{ perspective: 1400 }}
            >
              <motion.div
                className="relative w-full h-full rounded-xs shadow-xl"
                style={{
                  rotateY: springR3,
                  z: springZ3,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* FRONT FACE (EXACT EXISTING CONTENT & STYLING PRESERVED) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#270F05] flex flex-col justify-between p-[24px] text-[#FFFFFF] rounded-xs border border-[#3E1510] shadow-md select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <div>
                    <div className="flex justify-between font-mono text-[12px] tracking-[-0.36px] uppercase border-b border-[#3E1510] pb-3 mb-4">
                      <span className="font-bold text-[#CCC0B5]">DOSSIER 03</span>
                      <span className="text-[#A0674F] font-semibold">[BIFURCATION]</span>
                    </div>
                    <h3 className="font-serif text-[34px] max-sm:text-[26px] leading-tight tracking-[-1.2px] py-2 text-[#FFFFFF]">
                      Bifurcation Points in Career Trajectories
                    </h3>
                  </div>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] max-sm:text-[11px] leading-[1.4] uppercase border-t border-[#3E1510] pt-4">
                    <p className="text-[#EEEBE7]/80">
                      At specific thresholds, minimal variations in presentation produce irreversible divergence.
                    </p>
                    <p className="text-[#EEEBE7]/80">
                      Engineers presenting bespoke code diverge permanently from those trapped in generic boilerplates.
                    </p>
                  </div>
                </div>

                {/* BACK FACE (ELEGANT EDITORIAL PLAYING-CARD REVERSE) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#3E1510] text-[#FFFFFF] rounded-xs border border-[#270F05] shadow-md select-none p-3"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-full h-full border border-[#56241A]/45 p-5 rounded-xs flex flex-col justify-between bg-[#3E1510]/90">
                    {/* Top Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#A0674F]">
                      <span className="font-bold border border-[#A0674F]/40 px-1.5 py-0.5 rounded-xs">[03]</span>
                      <span className="text-xs text-[#7C3F2F]">✦</span>
                    </div>

                    {/* Central Seal & Monogram */}
                    <div className="flex flex-col items-center justify-center text-center gap-3 my-auto">
                      <div className="w-16 h-16 rounded-full border border-[#A0674F] bg-[#270F05] flex items-center justify-center shadow-lg">
                        <span className="font-serif italic text-2xl text-[#A0674F]">B</span>
                      </div>
                      <div className="font-mono text-[12px] tracking-[0.25em] uppercase text-[#EEEBE7] font-bold">
                        BIFURCATION POINT
                      </div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-[#CCC0B5]/60">
                        DEVCANVAS // DIVERGENCE 03
                      </div>
                      <div className="w-12 h-[1px] bg-[#A0674F]/40 my-1" />
                      <div className="font-mono text-[9px] uppercase tracking-wider text-[#56241A] font-bold">
                        STATUS: PERMANENT RETENTION
                      </div>
                    </div>

                    {/* Bottom Pips */}
                    <div className="flex justify-between items-center font-mono text-[11px] uppercase tracking-wider text-[#A0674F]">
                      <span className="text-xs text-[#7C3F2F]">✦</span>
                      <span className="font-bold border border-[#A0674F]/40 px-1.5 py-0.5 rounded-xs">[03]</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Bottom Flip Progress Tracker Bar */}
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#CCC0B5] pt-2">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#56241A] animate-pulse" />
              <span>SCROLL DOWN TO FLIP CARDS CONSECUTIVELY</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#A0674F]">CARD 01 → 02 → 03</span>
              <div className="w-24 h-1.5 bg-[#CCC0B5]/25 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#56241A]"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
