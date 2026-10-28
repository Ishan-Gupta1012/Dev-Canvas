"use client";

import React, { useId } from "react";

interface FigureProps {
  className?: string;
  style?: React.CSSProperties;
  /** A soft rim-light that reads against dark scenes. */
  glow?: boolean;
}

/**
 * The protagonist matching the cinematic reference screenshot.
 * A realistic, stylish developer in a hoodie with backpack standing in the
 * twilight landscape with atmospheric rim-light and cosmic purple backdrop.
 */
export function DeveloperFigure({ className = "", style }: FigureProps) {
  return (
    <div
      className={`developer-figure-container relative h-full w-full flex items-end justify-center select-none ${className}`}
      style={style}
    >
      {/* Background warm/lavender rim glow */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-[75%] rounded-full blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(196, 181, 253, 0.45) 0%, rgba(224, 135, 88, 0.28) 55%, transparent 75%)",
        }}
      />

      {/* Cinematic Photorealistic Hero Developer matching reference screenshot */}
      <div className="relative h-full w-auto max-h-[720px] flex items-end justify-center pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/developer_hero.jpg"
          alt="Developer Protagonist"
          className="relative h-full w-auto max-h-[720px] object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 86% at 50% 44%, black 54%, rgba(0,0,0,0.86) 72%, transparent 96%), linear-gradient(to bottom, black 84%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 86% at 50% 44%, black 54%, rgba(0,0,0,0.86) 72%, transparent 96%), linear-gradient(to bottom, black 84%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * The same character seen from behind, facing the portal in the closing scene.
 * The backpack and silhouette carry the identity without needing a face.
 */
export function DeveloperFigureBack({ className = "" }: { className?: string }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const hoodie = `hoodie-back-${id}`;
  const pack = `pack-back-${id}`;
  const rim = `rim-back-${id}`;

  return (
    <svg
      viewBox="0 0 360 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={hoodie} x1="120" y1="220" x2="250" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5F5048" />
          <stop offset="0.55" stopColor="#4A3C35" />
          <stop offset="1" stopColor="#2E2521" />
        </linearGradient>
        <linearGradient id={pack} x1="132" y1="250" x2="238" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A3E36" />
          <stop offset="1" stopColor="#221C18" />
        </linearGradient>
        <linearGradient id={rim} x1="236" y1="240" x2="266" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4B5FD" stopOpacity="0.75" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="184" cy="688" rx="130" ry="16" fill="#080403" opacity="0.55" />

      {/* legs */}
      <path d="M132 418 L180 418 L174 552 L162 664 L122 664 L132 552 Z" fill="#2A2420" />
      <path d="M184 418 L232 418 L246 552 L256 664 L216 664 L204 552 Z" fill="#221D1A" />
      {/* shoes */}
      <path d="M120 658 C134 650 154 650 166 658 L169 678 C147 689 114 684 110 673 Z" fill="#14100E" />
      <path d="M214 658 C228 650 246 650 256 658 L260 678 C238 688 212 684 208 673 Z" fill="#14100E" />

      {/* hoodie body, seen from behind */}
      <path
        d="M124 238 C140 220 158 212 180 212 C202 212 220 220 236 238 L252 430 C254 446 240 454 228 448 L216 404 L144 404 L132 448 C120 454 106 446 108 430 Z"
        fill={`url(#${hoodie})`}
      />
      {/* hood */}
      <path
        d="M142 230 C148 202 162 190 180 190 C198 190 212 202 218 230 C206 242 154 242 142 230 Z"
        fill="#3B302A"
      />
      <path d="M150 230 C160 218 170 214 180 214 C190 214 200 218 210 230" stroke="#2A221E" strokeWidth="1.2" opacity="0.7" />

      {/* arms at the sides */}
      <path
        d="M124 238 C110 268 104 326 104 382 L102 424 C102 436 116 440 122 428 L132 382 C138 336 140 282 148 246 Z"
        fill="#40352E"
      />
      <path
        d="M236 238 C250 268 256 326 256 382 L258 424 C258 436 244 440 238 428 L228 382 C222 336 220 282 212 246 Z"
        fill="#3A302A"
      />

      {/* backpack */}
      <path
        d="M144 250 C142 232 158 220 180 220 C202 220 218 232 216 250 L222 398 C222 420 204 432 180 432 C156 432 138 420 138 398 Z"
        fill={`url(#${pack})`}
      />
      <path d="M148 288 C164 282 196 282 212 288" stroke="#5F5046" strokeWidth="1.4" opacity="0.6" />
      <path d="M148 340 C164 334 196 334 212 340" stroke="#5F5046" strokeWidth="1.4" opacity="0.45" />
      <rect x="160" y="360" width="40" height="46" rx="5" fill="#2E2621" stroke="#5C4D43" strokeWidth="1" />
      <path d="M180 360 V406" stroke="#5C4D43" strokeWidth="1" opacity="0.7" />
      <circle cx="180" cy="382" r="3" fill="#A78BFA" opacity="0.7" />

      {/* head from behind */}
      <path
        d="M150 150 C150 110 162 82 182 82 C203 82 216 110 216 150 C216 176 208 196 195 206 L169 206 C156 196 150 176 150 150 Z"
        fill="#8A5338"
      />
      <path
        d="M146 148 C142 108 156 76 182 74 C208 72 224 100 220 142 C218 160 216 176 212 190 C208 168 202 152 192 144 C182 136 168 136 158 144 C152 150 150 162 148 176 C146 166 146 158 146 148 Z"
        fill="#1B120E"
      />
      <path d="M152 176 C160 190 204 190 212 176 L210 198 C198 208 164 208 152 198 Z" fill="#7C4A32" />

      {/* rim light */}
      <path
        d="M236 238 L252 430 C254 446 240 454 228 448"
        stroke={`url(#${rim})`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M216 150 C216 176 208 196 195 206"
        stroke="#C4B5FD"
        strokeOpacity="0.3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A small, circular portrait that uses the same face, hair, and palette as the
 * full figure. It appears in the profile and portfolio mockups so the identity
 * stays consistent even at thumbnail scale.
 */
export function DeveloperAvatar({ className = "" }: { className?: string }) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`av-bg-${id}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B9A6F6" />
          <stop offset="1" stopColor="#4B3366" />
        </linearGradient>
        <linearGradient id={`av-skin-${id}`} x1="36" y1="30" x2="86" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C08A64" />
          <stop offset="1" stopColor="#7D4C34" />
        </linearGradient>
        <linearGradient id={`av-hair-${id}`} x1="30" y1="20" x2="94" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#241914" />
          <stop offset="1" stopColor="#17100D" />
        </linearGradient>
        <clipPath id={`av-clip-${id}`}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#av-clip-${id})`}>
        <rect width="120" height="120" fill={`url(#av-bg-${id})`} />
        <circle cx="60" cy="54" r="44" fill="#F0E2D2" opacity="0.08" />
        {/* shoulders + hoodie */}
        <path d="M6 120 C10 92 32 80 60 80 C88 80 110 92 114 120 Z" fill="#4A3C35" />
        <path d="M40 80 C44 94 76 94 80 80 L90 88 C82 104 38 104 30 88 Z" fill="#6A5A50" />
        {/* backpack straps */}
        <path d="M38 84 C34 98 34 110 36 120 L46 120 C44 108 44 96 46 86 Z" fill="#2C2420" />
        <path d="M82 84 C86 98 86 110 84 120 L74 120 C76 108 76 96 74 86 Z" fill="#2C2420" />
        {/* neck */}
        <path d="M48 62 L48 82 C54 90 66 90 72 82 L72 62 Z" fill="#7D4C34" />
        {/* ears */}
        <ellipse cx="35" cy="56" rx="5" ry="8" fill="#9C6648" />
        <ellipse cx="85" cy="56" rx="5" ry="8" fill="#9C6648" />
        {/* short hair back */}
        <path
          d="M32 58 C29 34 42 18 60 18 C79 18 92 34 89 58 C88 68 86 76 82 82 C84 70 84 62 82 54 C74 60 64 62 56 60 C50 59 44 56 40 52 C38 64 37 74 34 82 C31 74 31 66 32 58 Z"
          fill={`url(#av-hair-${id})`}
        />
        {/* face */}
        <path
          d="M36 52 C36 34 45 24 60 24 C75 24 84 35 84 53 C84 70 77 83 66 88 C59 91 50 88 44 82 C39 76 36 65 36 52 Z"
          fill={`url(#av-skin-${id})`}
        />
        {/* features */}
        <path d="M45 52 Q50 49 55 52" stroke="#2E1B13" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M65 52 Q70 49 75 52" stroke="#2E1B13" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M46 60 Q50 57 54 60" stroke="#1F120D" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M66 60 Q70 57 74 60" stroke="#1F120D" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 62 C59 66 58 69 61 70" stroke="#6E402C" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 76 Q60 73 66 76 Q60 81 54 76 Z" fill="#7C443B" />
        <path d="M50 82 C55 88 65 88 70 82" stroke="#3A2418" strokeWidth="2" opacity="0.2" />
        {/* short fringe */}
        <path
          d="M36 48 C39 32 47 23 61 23 C74 23 83 31 86 44 C80 40 73 36 66 36 C60 36 55 34 61 31 C61 34 63 35 66 35 C73 35 80 38 84 44 C81 32 74 25 65 24 C57 23 51 26 47 31 C42 36 38 42 37 48 Z"
          fill={`url(#av-hair-${id})`}
        />
      </g>
    </svg>
  );
}
