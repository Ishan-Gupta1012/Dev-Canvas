'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function TechMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const marqueeY = useSpring(useTransform(scrollY, [100, 900], [40, -80]), { stiffness: 30, damping: 20 });
  const marqueeOpacity = useTransform(scrollY, [100, 500], [0.3, 1]);

  return (
    <motion.section
      ref={ref}
      className="py-6 border-b border-[#111111] bg-[#F7F4EF] overflow-hidden relative z-20"
      style={{ opacity: marqueeOpacity }}
    >
      <motion.div
        className="relative flex max-w-[100vw] overflow-hidden"
        style={{ y: marqueeY }}
      >
        <div className="flex w-max animate-marquee gap-8 pr-8 items-center font-mono text-xs uppercase tracking-widest text-[#111111]/70">
          {[...Array(3)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-8 whitespace-nowrap">
              {["TypeScript", "TailwindCSS", "Framer Motion", "GSAP Animations", "PostgreSQL", "Next.js Framework",
                "React Native", "Supabase DB", "NodeJS Backend", "Vercel Deployments", "Rust Core", "GitHub API"
              ].map((item, i) => (
                <span key={`${repeat}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
                  <span>{item}</span>
                  <span className="text-[#111111]/30">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
