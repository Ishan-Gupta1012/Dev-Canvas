"use client";

import React from "react";

/**
 * Shared atmosphere: a warm horizon, layered mountain silhouettes, and the
 * lavender energy rings that sit behind the protagonist in the references.
 */
export function StoryBackdrop({
  variant = "hero",
}: {
  variant?: "hero" | "stage" | "finale";
}) {
  return (
    <div className={`story-atmosphere story-atmosphere--${variant}`} aria-hidden="true">
      <div className="atmosphere-glow atmosphere-glow--lavender" />
      <div className="atmosphere-glow atmosphere-glow--warm" />
      <div className="atmosphere-rings">
        <i />
        <i />
        <i />
      </div>
      <svg
        className="atmosphere-mountains"
        viewBox="0 0 1440 620"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-40 520 L120 438 L232 492 L352 396 L470 470 L596 418 L728 500 L854 430 L980 486 L1104 392 L1216 460 L1330 418 L1480 512 L1480 640 L-40 640 Z"
          fill="#1c1614"
          opacity="0.85"
        />
        <path
          d="M-40 560 L96 506 L216 548 L336 476 L470 540 L604 490 L744 554 L880 498 L1014 548 L1148 470 L1274 534 L1392 500 L1480 552 L1480 640 L-40 640 Z"
          fill="#171211"
        />
        <path
          d="M-40 600 L140 566 L300 596 L472 548 L650 596 L830 556 L1010 600 L1180 550 L1352 596 L1480 572 L1480 640 L-40 640 Z"
          fill="#120e0d"
        />
      </svg>
      <div className="atmosphere-haze" />
    </div>
  );
}
