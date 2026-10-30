'use client';

import React from 'react';
import SceneHeader from '@/components/landing/SceneHeader';
import CoreStoryScene from '@/components/landing/CoreStoryScene';
import WorkflowScene from '@/components/landing/WorkflowScene';
import GrowthScene from '@/components/landing/GrowthScene';
import FinaleScene from '@/components/landing/FinaleScene';
import LandingFooter from '@/components/landing/LandingFooter';

/**
 * DevCanvas landing — one Identity Core telling a seven-scene story:
 * scattered potential → assembled profile → resume → portfolio →
 * workflow → growth → the complete identity.
 */
export default function Home() {
  return (
    <main className="relative bg-[#F7EFE2]">
      {/* Warm amber atmosphere that ties every scene together */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 78% 8%, rgba(214, 166, 92, 0.22) 0%, transparent 62%), radial-gradient(ellipse 55% 40% at 12% 72%, rgba(190, 138, 66, 0.16) 0%, transparent 66%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(217, 199, 181, 0.14) 0%, transparent 55%), linear-gradient(180deg, #F8F1E5 0%, #F7EFE2 45%, #F4E9D7 100%)',
        }}
      />
      <div className="relative z-10">
        <SceneHeader />
        <CoreStoryScene />
        <WorkflowScene />
        <GrowthScene />
        <FinaleScene />
        <LandingFooter />
      </div>
    </main>
  );
}
