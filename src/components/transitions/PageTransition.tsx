'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Smoothly restore scroll position to top on page mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  if (shouldReduceMotion) {
    return <div className={`w-full flex-1 flex flex-col ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // Editorial luxury cubic bezier
      }}
      style={{
        willChange: mounted ? 'auto' : 'transform, opacity, filter',
      }}
      className={`w-full flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
