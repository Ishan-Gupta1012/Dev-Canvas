'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './motion';

export default function StatCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [inView, reduce, value]);

  const formatted = (reduce ? value : display).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
