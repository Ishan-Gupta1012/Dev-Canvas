'use client';

import React from 'react';

/**
 * Marquee — CSS-driven infinite ticker.
 * Duplicated track keeps the loop seamless; hover pauses, reduced motion stops.
 */
export default function Marquee({
  items,
  reverse = false,
  duration = 42,
  className = '',
  itemClassName = '',
  separator = '·',
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const group = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center">
          <span className={`whitespace-nowrap ${itemClassName}`}>{item}</span>
          <span className="mx-6 opacity-40 sm:mx-9" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`lc-marquee relative overflow-hidden ${className}`}>
      <span className="sr-only">{items.join(', ')}</span>
      <div
        className="lc-marquee-track flex w-max"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {group}
        {group}
      </div>
    </div>
  );
}
