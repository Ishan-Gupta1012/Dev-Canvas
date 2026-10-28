'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  useEffect(() => {
    // Smoothly restore scroll position to top on page mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    // Keep this wrapper free of filter / will-change: transform: both create a
    // containing block and break `position: fixed` in the landing header.
    // Reduced motion is handled in CSS (.page-transition) so the markup stays
    // identical between server and client and hydration never freezes it.
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // Editorial luxury cubic bezier
      }}
      className={`page-transition w-full flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
