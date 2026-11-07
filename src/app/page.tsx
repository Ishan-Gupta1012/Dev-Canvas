'use client';

import React from 'react';
import HeroScene from '@/components/landing/HeroScene';
import PortfolioConstructionScene from '@/components/landing/PortfolioConstructionScene';
import WorkflowScene from '@/components/landing/WorkflowScene';
import GrowthScene from '@/components/landing/GrowthScene';
import FinaleScene from '@/components/landing/FinaleScene';
import LandingFooter from '@/components/landing/LandingFooter';
import ScrollRuler from '@/components/landing/ScrollRuler';
import ScrollToTop from '@/components/landing/ScrollToTop';
import Preloader from '@/components/landing/Preloader';

/**
 * DevCanvas landing — Two cinematic prologue chapters + the career ecosystem:
 *
 * Chapter 01: HeroScene — 3D revolving sphere, particle convergence & emergence of resume + portfolio.
 * Chapter 02: PortfolioConstructionScene — The Blueprint: 8-stage scroll-driven construction of a personalized portfolio.
 * Chapter 03+: WorkflowScene, GrowthScene, FinaleScene — The complete career ecosystem.
 *
 * Theme: Soft porcelain grey, graphite, brushed silver, subtle muted lavender & technical red alignment guides.
 */
export default function Home() {
  const [preloaderDone, setPreloaderDone] = React.useState(false);

  return (
    <main className="relative bg-[#E9EAEB]">
      {/* Soft porcelain atmosphere with brushed silver and subtle muted lavender highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 78% 8%, rgba(184, 175, 199, 0.16) 0%, transparent 62%), radial-gradient(ellipse 55% 40% at 12% 72%, rgba(174, 179, 185, 0.18) 0%, transparent 66%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(213, 214, 216, 0.22) 0%, transparent 55%), linear-gradient(180deg, #F4F4F2 0%, #E9EAEB 45%, #E3E4E6 100%)',
        }}
      />
      <div className="relative z-10">
        <Preloader onComplete={() => setPreloaderDone(true)} />
        <ScrollRuler />
        <ScrollToTop />
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
