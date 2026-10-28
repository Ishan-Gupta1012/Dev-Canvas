/**
 * Shared motion vocabulary for the landing experience.
 * One easing family, three durations, so every transition feels related.
 */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SOFT: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const EASE_SPRING = { type: 'spring', stiffness: 220, damping: 26, mass: 0.6 } as const;

export const DURATION = {
  micro: 0.18,
  quick: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

export const viewportOnce = { once: true, margin: '-12% 0px' } as const;
