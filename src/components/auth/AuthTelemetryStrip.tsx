'use client';

import React from 'react';

const TICKER_ITEMS = [
  'GATEWAY STATUS: OPEN',
  'ENCRYPTION: AES-256-GCM',
  'IDENTITY LAYER: v3.2.1',
  'SESSION TTL: 7200s',
  'NODE: HANOI-PRIMARY',
  'PORTFOLIO ENGINE: READY',
  'OAUTH PROVIDERS: 3 ACTIVE',
  'MAGIC LINK: ENABLED',
];

export default function AuthTelemetryStrip({ reverse = false }: { reverse?: boolean }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-[#DADCE0] py-2 bg-[#1A1C1E] backdrop-blur-sm">
      <div
        className={`inline-flex gap-12 ${reverse ? 'animate-auth-ticker-reverse' : 'animate-auth-ticker'}`}
      >
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono text-[10px] tracking-[0.3em] text-[#DADCE0]/70 shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
