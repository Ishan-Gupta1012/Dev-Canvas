'use client';

import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from 'framer-motion';

/**
 * Scroll progress for a pinned scene — a plain MotionValue mirror of
 * useScroll's scrollYProgress.
 *
 * Why the mirror: useScroll attaches an `.accelerate` config (native
 * ViewTimeline/WAAPI rendering) to its progress values. Every
 * useTransform() of such a value inherits that config, and when the
 * result is bound to `style` framer compiles it into a native
 * scroll-driven animation whose progress diverges from the JS scroll
 * progress — opacity layers then sit on stale, wrong values while
 * x/y/rotate (not in the accelerated key set) keep tracking correctly.
 * A plain MotionValue has no `.accelerate`, so every derived transform
 * stays on framer's standard inline-style path, driven by the exact
 * progress we measure.
 */
export function useSceneScroll(
  target: React.RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>['offset']
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (value) => progress.set(value));
  return progress;
}
