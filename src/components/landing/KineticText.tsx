'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT, viewportOnce } from './motion';

type MaskLineProps = {
  children: React.ReactNode;
  /** When false the line stays hidden — used to sync the hero with the intro fade. */
  active?: boolean;
  delay?: number;
  duration?: number;
  /** 'mount' animates on load (hero); 'view' waits for the viewport. */
  trigger?: 'mount' | 'view';
  className?: string;
  innerClassName?: string;
};

/**
 * MaskLine — the core kinetic primitive.
 * A clipped line whose content rises from below. Reads as typography being
 * "set" rather than simply fading in.
 */
export function MaskLine({
  children,
  active = true,
  delay = 0,
  duration = 0.95,
  trigger = 'view',
  className = '',
  innerClassName = '',
}: MaskLineProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={`block ${className}`}>{children}</span>;
  }

  if (trigger === 'view') {
    return (
      <motion.span
        className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.span
          className={`block will-change-transform ${innerClassName}`}
          variants={{
            hidden: { y: '115%', opacity: 0 },
            visible: { y: '0%', opacity: 1 },
          }}
          transition={{ duration, delay, ease: EASE_OUT }}
        >
          {children}
        </motion.span>
      </motion.span>
    );
  }

  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <motion.span
        className={`block will-change-transform ${innerClassName}`}
        initial={{ y: '115%', opacity: 0 }}
        animate={active ? { y: '0%', opacity: 1 } : { y: '115%', opacity: 0 }}
        transition={{ duration, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * ScrambleText — a short mono label that resolves character by character.
 * Reserved for cryptic system labels, never body copy.
 */
export function ScrambleText({
  text,
  active = true,
  className = '',
  speed = 32,
}: {
  text: string;
  active?: boolean;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (!active) return;
    if (reduce) return;

    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]';
    let frame = 0;
    let raf = 0;

    const tick = () => {
      frame += 1;
      const revealed = Math.floor(frame / 2);
      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < revealed) return char;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');
      setValue(next);
      if (revealed < text.length) {
        raf = window.setTimeout(tick, speed);
      } else {
        setValue(text);
      }
    };

    tick();
    return () => window.clearTimeout(raf);
  }, [active, reduce, speed, text]);

  const display = reduce ? text : value;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{display || '\u00A0'}</span>
    </span>
  );
}

/**
 * WordStagger — words rise one after another. Used for short statements.
 */
export function WordStagger({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.045,
  active = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '110%', opacity: 0 }}
            animate={active ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.85, delay: delay + index * stagger, ease: EASE_OUT }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * DrawRule — hairline that draws itself when scrolled into view.
 */
export function DrawRule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px origin-left ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    />
  );
}
