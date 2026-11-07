'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal button once the user scrolls down past 450px
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 14 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 left-6 z-50 group flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white border border-[rgba(41,44,48,0.16)] hover:border-[#EF4444] text-[#111315] hover:text-[#EF4444] shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.18)] backdrop-blur-md transition-all duration-200 cursor-pointer select-none"
        >
          <span className="w-6 h-6 rounded-full bg-[#FAF9F6] border border-[rgba(41,44,48,0.1)] group-hover:border-[#EF4444]/40 flex items-center justify-center transition-colors">
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </span>
          <span className="font-mono text-[10.5px] font-semibold tracking-wider uppercase pr-1 text-[#292C30] group-hover:text-[#EF4444] transition-colors">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
