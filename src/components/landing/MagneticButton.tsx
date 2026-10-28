'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { EASE_SPRING } from './motion';

type MagneticProps = {
  strength?: number;
  className?: string;
  children: React.ReactNode;
};

function useMagnetic<T extends HTMLElement>(strength: number) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, EASE_SPRING);
  const y = useSpring(rawY, EASE_SPRING);

  const onPointerMove = (event: React.PointerEvent<T>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    rawX.set(relX * strength * 2);
    rawY.set(relY * strength);
  };

  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onPointerMove, onPointerLeave, reduce };
}

export function MagneticButton({
  children,
  className = '',
  strength = 10,
  onClick,
  ...rest
}: MagneticProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic<HTMLButtonElement>(strength);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className={`group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}

export function MagneticLink({
  children,
  className = '',
  strength = 8,
  href,
  onClick,
}: MagneticProps & { href: string; onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic<HTMLAnchorElement>(strength);

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className={`group relative inline-flex cursor-pointer items-center justify-center ${className}`}
    >
      {children}
    </motion.a>
  );
}

/** The shared inner content for the primary CTA: label + travelling arrow + sheen. */
export function CtaLabel({ label }: { label: string }) {
  return (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        <span>{label}</span>
        <span className="relative block h-[10px] w-[18px] overflow-hidden">
          <span className="absolute inset-0 flex items-center transition-transform duration-300 ease-out group-hover:translate-x-[18px]">
            <ArrowGlyph />
          </span>
          <span className="absolute inset-0 flex -translate-x-[18px] items-center transition-transform duration-300 ease-out group-hover:translate-x-0">
            <ArrowGlyph />
          </span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
    </>
  );
}

function ArrowGlyph() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h15M11 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
