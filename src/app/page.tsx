'use client';

import React, { useState, useSyncExternalStore } from 'react';
import HeroScene from '@/components/landing/HeroScene';
import PortfolioConstructionScene from '@/components/landing/PortfolioConstructionScene';
import WorkflowScene from '@/components/landing/WorkflowScene';
import GrowthScene from '@/components/landing/GrowthScene';
import FinaleScene from '@/components/landing/FinaleScene';
import LandingFooter from '@/components/landing/LandingFooter';
import ScrollRuler from '@/components/landing/ScrollRuler';
import ScrollToTop from '@/components/landing/ScrollToTop';
import Preloader from '@/components/landing/Preloader';
import { isIntroDone, markIntroDone } from '@/lib/intro-entry';

/**
 * DevCanvas landing — Two cinematic prologue chapters + the career ecosystem:
 *
 * Chapter 01: HeroScene — 3D revolving sphere, particle convergence & emergence of resume + portfolio.
 * Chapter 02: PortfolioConstructionScene — The Blueprint: 8-stage scroll-driven construction of a personalized portfolio.
 * Chapter 03+: WorkflowScene, GrowthScene, FinaleScene — The complete career ecosystem.
 *
 * Theme: White, black, graphite and a touch of technical red alignment guides.
 */
const noopSubscribe = () => () => {};
const getIntroDoneSnapshot = () => isIntroDone();
// The server has no sessionStorage, so hydration must start from "not done".
const getIntroDoneServerSnapshot = () => false;

export default function Home() {
  // Hydration-safe read of the session flag: the server snapshot is always
  // false, then React swaps in the real value right after hydration. Branching
  // on sessionStorage during render is what caused the hydration mismatch.
  const introDone = useSyncExternalStore(
    noopSubscribe,
    getIntroDoneSnapshot,
    getIntroDoneServerSnapshot
  );
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = () => {
    markIntroDone();
    setPreloaderDone(true);
  };

  const reveal = introDone || preloaderDone;

  return (
    <main className="relative bg-[#E9EAEB]">
      {/* White / black atmosphere with a touch of technical red */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 78% 8%, rgba(239, 68, 68, 0.08) 0%, transparent 62%), radial-gradient(ellipse 55% 40% at 12% 72%, rgba(35, 38, 42, 0.06) 0%, transparent 66%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(35, 38, 42, 0.04) 0%, transparent 55%), linear-gradient(180deg, #FFFFFF 0%, #F4F4F2 45%, #E9EAEB 100%)',
        }}
      />
      {!introDone && <Preloader onComplete={handlePreloaderComplete} />}
      <div
        className="relative z-10 transition-opacity duration-700 ease-out"
        style={{ opacity: reveal ? 1 : 0 }}
      >
        <ScrollRuler />
        <ScrollToTop />
        {/* Auto-play only on a fresh visit: the preloader completion is the
            trigger, and it never fires when the intro was already done. */}
        <HeroScene autoPlay={preloaderDone} />
        <PortfolioConstructionScene />
        <WorkflowScene />
        <GrowthScene />
        <FinaleScene />
        <LandingFooter />
      </div>
    </main>
  );
}
