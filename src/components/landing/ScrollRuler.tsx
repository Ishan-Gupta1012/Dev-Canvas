'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SectionTarget {
  id: string;
  label: string;
}

const SECTIONS: SectionTarget[] = [
  { id: 'home', label: 'Intro' },
  { id: 'story', label: 'The build' },
  { id: 'how-it-works', label: 'Workflow' },
  { id: 'growth', label: 'Growth' },
  { id: 'finale', label: 'Launch' },
];

/**
 * Technical Ruler Sidebar Navigation
 * Replaces traditional scrollbar with a precise technical measuring ruler,
 * traveling red marker, and active section pill indicator.
 */
export default function ScrollRuler() {
  const { scrollYProgress } = useScroll();
  // Silky smooth spring interpolation for the indicator position
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.2,
  });

  const [activeLabel, setActiveLabel] = useState<string>('Intro');

  // Track active section via IntersectionObserver & scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveLabel(SECTIONS[i].label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute indicator top percentage (kept within 4% to 96% of viewport height)
  const dotTopPercent = useTransform(smoothProgress, [0, 1], ['4%', '96%']);

  // Generate 72 tick marks along the ruler
  const ticks = useMemo(() => {
    return Array.from({ length: 72 }, (_, i) => {
      const isMajor = i % 10 === 0;
      const isMedium = i % 5 === 0 && !isMajor;
      return { id: i, isMajor, isMedium };
    });
  }, []);

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickRatio = Math.max(0, Math.min(1, clickY / rect.height));

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: clickRatio * totalHeight,
      behavior: 'smooth',
    });
  };

  const handleSectionClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Scroll navigation ruler"
      className="fixed right-0 top-0 bottom-0 z-40 w-24 flex items-center justify-end select-none pointer-events-none"
    >
      {/* ── Vertical Ruler Track ── */}
      <div
        onClick={handleRulerClick}
        className="relative h-[92vh] w-12 flex flex-col justify-between items-end pr-2 sm:pr-3 cursor-pointer pointer-events-auto group"
        title="Click to scroll"
      >
        {/* Subtle background ruler edge line */}
        <div className="absolute right-2 sm:right-3 inset-y-0 w-px bg-[rgba(41,44,48,0.12)]" />

        {/* Notches / Ticks */}
        {ticks.map((tick) => (
          <div
            key={tick.id}
            className={`h-px transition-colors duration-150 ${
              tick.isMajor
                ? 'w-3.5 bg-[rgba(41,44,48,0.38)] group-hover:bg-[#EF4444]/60'
                : tick.isMedium
                ? 'w-2 bg-[rgba(41,44,48,0.22)] group-hover:bg-[rgba(41,44,48,0.4)]'
                : 'w-1 bg-[rgba(41,44,48,0.12)] group-hover:bg-[rgba(41,44,48,0.25)]'
            }`}
          />
        ))}

        {/* ── Traveling Red Indicator Dot & Active Component Pill ── */}
        <motion.div
          style={{ top: dotTopPercent }}
          className="absolute right-1 sm:right-2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto"
        >
          {/* Active Component Monospace Pill (e.g. [ Intro ], [ The build ]) */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="flex items-center px-2 py-0.5 rounded-md border border-[rgba(41,44,48,0.16)] bg-white/95 backdrop-blur-md shadow-xs text-[10.5px] font-mono text-[#292C30] cursor-pointer hover:border-[#EF4444]/50 transition-colors"
          >
            <span className="leading-none tracking-tight">{activeLabel}</span>
          </motion.div>

          {/* Red Indicator Dot on the ruler tick line */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)] ring-2 ring-white/80" />
            <span className="absolute w-4 h-4 rounded-full bg-[#EF4444]/20 animate-ping pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </aside>
  );
}

