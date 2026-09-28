'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const heroY = useSpring(useTransform(scrollY, [0, 700], [0, -180]), { stiffness: 40, damping: 20 });
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.88]);

  const headlineY = useSpring(useTransform(scrollY, [100, 800], [60, -100]), { stiffness: 50, damping: 20 });
  const headlineOpacity = useTransform(scrollY, [100, 600], [1, 0]);

  const metaY = useSpring(useTransform(scrollY, [0, 350], [0, -50]), { stiffness: 50, damping: 20 });
  const metaOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-primary bg-grid-paper select-none text-on-background"
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Local time and metadata */}
        <motion.div
          style={{ y: metaY, opacity: metaOpacity }}
          className="flex justify-between items-center border-b border-primary pb-6 mb-8 md:mb-12 font-mono text-xs uppercase tracking-widest text-on-background/70"
        >
          <div>Creative Practice / Hanoi, VN</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft"></span>
            Hanoi: {localTime || '12:00 PM'}
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="md:col-span-8"
          >
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              Why are developer portfolios <span className="italic text-stroke font-normal">still stuck</span> in 2020?
            </h1>
          </motion.div>
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="md:col-span-4 md:pl-6 flex flex-col justify-between h-full pt-2"
          >
            <p className="font-sans text-sm md:text-base leading-relaxed text-on-background/85 mb-8">
              Portfol.io is a curated platform for creators. We believe every portfolio begins with intention—sketched on craft paper, refined with care, and built to last. We shape your work into a premium, editorial presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signin" 
                className="bg-primary text-on-primary hover:bg-primary/85 transition-colors px-6 py-3 text-center font-mono text-xs uppercase tracking-widest rounded-sm border border-primary"
              >
                Get Started
              </Link>
              <Link 
                href="/works" 
                className="bg-transparent text-on-background hover:bg-primary/5 transition-colors px-6 py-3 text-center font-mono text-xs uppercase tracking-widest rounded-sm border border-primary"
              >
                Browse Works
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Draggable ruler micro-interaction */}
        <div className="border border-primary bg-background rounded-sm p-6 relative overflow-hidden flex flex-col gap-4">
          <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest text-on-background/70">
            <div>Interactive Tool / Curiosity Index</div>
            <div className="text-right">Scale: <span className="text-on-background font-bold">50%</span></div>
          </div>

          {/* Draggable Container */}
          <div className="h-24 border-y border-outline/25 relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center bg-background transition-shadow">
            {/* The ruler track */}
            <div className="absolute left-1/2 flex items-end gap-1.5 h-16 w-max transition-transform duration-75 ease-out" style={{ transform: `translateX(-150px)` }}>
              {Array.from({ length: 120 }).map((_, i) => {
                const isMajor = i % 10 === 0;
                const isMedium = i % 5 === 0 && !isMajor;
                
                return (
                  <div key={i} className="flex flex-col items-center justify-end h-full w-2">
                    {isMajor && (
                      <span className="font-mono text-[9px] text-on-background/50 mb-1 select-none">
                        {i * 10}
                      </span>
                    )}
                    <div 
                      className="w-0.5 bg-primary transition-all"
                      style={{ 
                        height: isMajor ? '28px' : isMedium ? '18px' : '10px',
                        opacity: isMajor ? 0.6 : isMedium ? 0.4 : 0.2
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Central indicator line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-sm" />
          </div>

          <div className="font-mono text-[10px] text-on-background/50 uppercase tracking-wider text-center">
            ← Drag the ruler to measure your curiosity limit →
          </div>
        </div>

      </div>
    </motion.section>
  );
}
