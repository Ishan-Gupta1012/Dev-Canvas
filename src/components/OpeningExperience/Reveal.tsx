'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveal — the landing's single motion primitive.
 * Fade + rise + de-blur on first scroll into view, with optional stagger.
 * Renders statically when the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Eyebrow — mono index label with a hairline rule that draws itself in.
 * Keeps the dossier numbering already used across the landing copy.
 */
export function Eyebrow({
  label,
  dark = false,
  className = '',
}: {
  label: string;
  dark?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const line = dark ? 'bg-[#A0674F]/60' : 'bg-[#7C3F2F]/40';
  const text = dark ? 'text-[#A0674F]' : 'text-[#7C3F2F]';
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <p className={`font-mono text-[13px] leading-none uppercase font-bold tracking-[0.18em] whitespace-nowrap ${text}`}>
        {label}
      </p>
      {reduce ? (
        <span className={`h-px flex-1 ${line}`} aria-hidden="true" />
      ) : (
        <motion.span
          className={`h-px flex-1 origin-left ${line}`}
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

/**
 * GhostNumeral — giant outlined section index set behind content.
 * Decorative only.
 */
export function GhostNumeral({
  numeral,
  className = '',
}: {
  numeral: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`text-stroke pointer-events-none select-none absolute font-serif italic leading-none opacity-40 ${className}`}
    >
      {numeral}
    </span>
  );
}
