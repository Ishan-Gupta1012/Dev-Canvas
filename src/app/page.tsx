'use client';

import React, { useState } from 'react';
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
export default function Home() {
  // Lazily read sessionStorage once on mount: true means preloader + intro
  // autoscroll already ran this session, so skip both until reopen.
  const introDone = useState(() => isIntroDone())[0];
  const [preloaderDone, setPreloaderDone] = useState(introDone);

  const handlePreloaderComplete = () => {
    markIntroDone();
    setPreloaderDone(true);
  };

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
      <div className="relative z-10">
        {!introDone && <Preloader onComplete={handlePreloaderComplete} />}
        <ScrollRuler />
        <ScrollToTop />
        <HeroScene autoPlay={!introDone && preloaderDone} />
        <PortfolioConstructionScene />
        <WorkflowScene />
        <GrowthScene />
        <FinaleScene />
        <LandingFooter />
      </div>
    </main>
  );
}
