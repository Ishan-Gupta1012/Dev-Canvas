'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Minimal preloader: a single wordmark, a hairline progress rule and a quiet
 * percentage. When the bar fills, the overlay dissolves and the landing page
 * fades in underneath — no 3D scene, no grid, no status chatter.
 */
export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [percent, setPercent] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const beginClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const finish = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setIsDone(true);
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    // Calm, roughly ~1.5s progression.
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Brief hold at 100% before the fade.
          setTimeout(beginClose, 260);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 5) + 2, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, [beginClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') beginClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [beginClose]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={
            isClosing ? { opacity: 0, scale: 1.015 } : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (isClosing) finish();
          }}
          onClick={beginClose}
          className="fixed inset-0 z-[100] flex cursor-pointer select-none items-center justify-center bg-[#08090C]"
          aria-label="Loading"
        >
          {/* Faint centre light — just enough to lift the wordmark off the black. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 42% at 50% 50%, rgba(255, 255, 255, 0.045) 0%, transparent 72%)',
            }}
          />

          <div className="relative flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-[4px]"
            >
              <span className="text-[24px] font-medium leading-none tracking-[-0.01em] text-white sm:text-[28px]">
                DevCanvas
              </span>
              <span className="h-[5px] w-[5px] rounded-full bg-[#EF4444]" />
            </motion.div>

            {/* Hairline progress rule */}
            <div className="mt-7 h-px w-40 overflow-hidden bg-white/10 sm:w-48">
              <div
                className="h-full bg-white/70"
                style={{
                  width: `${percent}%`,
                  transition: 'width 120ms linear',
                }}
              />
            </div>

            <span className="mt-4 font-mono text-[10px] tracking-[0.22em] text-white/30 tabular-nums">
              {percent.toString().padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
