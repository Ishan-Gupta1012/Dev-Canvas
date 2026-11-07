'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from 'framer-motion';

/**
 * Scroll progress for a pinned scene.
 *
 * Root cause of the trackpad-vs-mouse inconsistency: raw `scrollYProgress`
 * lands as a fine stream on a trackpad but as discrete jumps on an external
 * mouse wheel (one jump per tick). Feeding that raw value straight into the
 * film made the mouse feel jumpy while the trackpad felt cinematic.
 *
 * Fix: a single requestAnimationFrame loop that exponentially damps (lerps)
 * the exposed `progress` toward the raw target every frame. One damping
 * system only — every consumer (sphere, particles, camera, connector labels,
 * transforms) reads this same smoothed `progress`, so there is no double
 * smoothing and nothing else changes.
 *
 * First-order damping never overshoots or oscillates, so reverse scrolling
 * stays precise and there is no sudden acceleration or abrupt stopping. When
 * the remaining gap falls below `SNAP_THRESHOLD` the value snaps to target,
 * which removes end-of-scroll lag once the finger lifts without adding
 * perceptible inertia while scrolling.
 *
 * DeltaMode / wheel-delta normalisation is not needed at this layer: the
 * browser has already resolved the wheel into document scroll position, and
 * `scrollYProgress` is that resolved 0–1 position, so trackpad, Magic Mouse
 * and wheel mice all contribute to the same continuous target.
 */

/**
 * Decay rate for exponential damping (lambda in 1 - exp(-lambda * dt)).
 * At lambda = 12, the half-life is ~58ms:
 * - External mouse notches (100px steps) are smoothed gracefully over 6–8 frames.
 * - MacBook trackpad gestures (continuous fine deltas) track with zero perceptible lag.
 * - Frame-rate independent: identical behaviour across 60Hz, 120Hz ProMotion and external displays.
 */
const LAMBDA = 12.0;

/** Snap to target once within this threshold to eliminate end-of-scroll drift. */
const SNAP_THRESHOLD = 5e-5;

export function useSceneScroll(
  target: React.RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>['offset']
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  const progress = useMotionValue(0);

  const raw = useRef(0);
  const frame = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  /* Capture the raw target on every scroll change (trackpad stream or wheel ticks). */
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    raw.current = value;
  });

  const tick = (now: number) => {
    if (lastTime.current === null) {
      lastTime.current = now;
    }
    // Cap dt to 64ms (approx 15fps) to prevent leaps if the tab was suspended or throttled
    const dt = Math.min((now - lastTime.current) / 1000, 0.064);
    lastTime.current = now;

    const targetProgress = raw.current;
    let current = progress.get();
    const diff = targetProgress - current;

    if (Math.abs(diff) < SNAP_THRESHOLD) {
      current = targetProgress;
    } else {
      // Precise frame-rate independent exponential interpolation
      const factor = 1 - Math.exp(-LAMBDA * dt);
      current += diff * factor;
    }

    progress.set(current);
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    /* Seed from current scroll position */
    raw.current = scrollYProgress.get();
    progress.set(raw.current);
    lastTime.current = performance.now();
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return progress;
}
