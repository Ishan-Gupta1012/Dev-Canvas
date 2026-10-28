'use client';

import React from 'react';
import { MotionValue, motion, useTransform } from 'framer-motion';

/**
 * Scroll-driven "fill" for one content group of the identity.
 *
 * When a scroll progress value is supplied, the group fades and settles into
 * place over its own slice of progress while a dashed slot underneath shows
 * the "not yet organized" state. Without a progress value the group renders
 * fully assembled (used for static scenes and reduced-motion).
 */
export default function FillGroup({
  p,
  range,
  slotLabel,
  reduce,
  children,
}: {
  p: MotionValue<number>;
  range: [number, number];
  slotLabel?: string;
  reduce?: boolean;
  children: React.ReactNode;
}) {
  const fill = useTransform(p, range, [0, 1], { clamp: true });
  const settle = useTransform(fill, [0, 1], [12, 0]);
  const slotOpacity = useTransform(fill, [0, 1], [1, 0]);

  return (
    <div className="relative">
      {slotLabel && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-dashed flex items-center justify-center"
          style={{
            opacity: slotOpacity,
            borderColor: 'rgba(176, 128, 63, 0.42)',
            background: 'radial-gradient(circle, rgba(228, 196, 137, 0.22) 0%, transparent 72%)',
          }}
        >
          <span className="text-[11px] tracking-wide" style={{ color: 'rgba(122, 88, 48, 0.75)' }}>
            {slotLabel}
          </span>
        </motion.div>
      )}
      <motion.div style={{ opacity: fill }}>
        <motion.div style={{ y: reduce ? 0 : settle }}>{children}</motion.div>
      </motion.div>
    </div>
  );
}
