'use client';

import React, { useState, useEffect, useRef } from 'react';
import GenerativeAttractorCanvas from './GenerativeAttractorCanvas';
import DossierPlayingCardsSection from './DossierPlayingCardsSection';

interface AxiomIntroPageProps {
  onEnterMainSite: () => void;
}

export default function AxiomIntroPage({ onEnterMainSite }: AxiomIntroPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const smoothScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#EEEBE7] text-[#0A0402] selection:bg-[#56241A] selection:text-[#FFFFFF] antialiased"
      style={{
        fontFamily: 'var(--font-inter, ui-sans-serif, system-ui, sans-serif)',
      }}
    >

      {/* 2. Fixed Background Living Attractor Canvas (Warm Brown, Deep Brown, Earthy Burgundy on Warm Off-White) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GenerativeAttractorCanvas />
      </div>

      {/* 3. Fixed Header with Telemetry & Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none px-[40px] max-sm:px-[20px] pt-[30px] pb-4 transition-colors duration-200">
        <div className="flex items-center justify-between w-full pointer-events-auto max-w-[1440px] mx-auto">
          {/* Logo / Brandmark */}
          <div className="w-[455px] max-lg:w-[299px] max-md:w-[217px] max-sm:w-auto shrink-0">
            <a href="#hero" onClick={smoothScrollTo('hero')} className="inline-flex items-center gap-2 group cursor-pointer">
              <span className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] text-[#0A0402] group-hover:text-[#56241A] transition-colors">
                DEVCANVAS
              </span>
              <span className="font-mono text-[9px] text-[#7C3F2F] border border-[#7C3F2F]/40 bg-[#7C3F2F]/10 px-1.5 py-0.2 rounded-xs uppercase hidden sm:inline">
                PAAS // ARCHITECTURE
              </span>
            </a>
          </div>

          {/* Direct Enter Site CTA */}
          <button
            onClick={onEnterMainSite}
            className="relative overflow-hidden inline-flex items-center gap-[6px] h-[34px] px-4 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] text-[#FFFFFF] transition-all duration-200 cursor-pointer group shadow-sm"
            aria-label="Enter Main Website"
          >
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider">
              ENTER MAIN WEBSITE
            </span>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-sm">
              →
            </span>
          </button>
        </div>
      </header>

      {/* 4. MAIN EDITORIAL SECTION FLOW */}
      <main className="relative z-[1] w-full">
        {/* SECTION 1: HERO */}
        <section
          id="hero"
          className="relative h-[900px] max-lg:h-[768px] max-md:h-[950px] max-sm:h-[730px] w-full overflow-hidden px-[40px] max-sm:px-[20px] pt-[30px] max-md:pb-[40px] max-sm:pb-[60px] flex flex-col justify-between max-w-[1440px] mx-auto"
        >
          <div className="h-[40px] shrink-0" />

          {/* Bottom Area: Scroll indicator on Left, Giant Title on Right */}
          <div className="flex items-end justify-between shrink-0 w-full mb-8">
            {/* Scroll Indicator with Hairline */}
            <div className="flex gap-[10px] items-center shrink-0 max-md:hidden">
              <div className="w-[1px] h-6 bg-[#7C3F2F]/50 animate-pulse" />
              <p className="font-mono text-[12px] tracking-[-0.36px] uppercase text-[#3E1510]/70 leading-[1.2] whitespace-pre w-[135px]">
                Scroll down <br />
                to discover more
              </p>
            </div>

            {/* Giant Title & Lead Paragraph */}
            <div className="flex flex-col gap-[48px] items-end w-[780px] max-lg:w-[580px] max-md:w-full max-md:items-start shrink-0">
              <div className="w-full text-right max-md:text-left">
                <h1 className="font-serif font-medium text-[140px] max-lg:text-[100px] max-sm:text-[68px] leading-[0.82] tracking-[-5px] max-lg:tracking-[-3.5px] max-sm:tracking-[-2px] text-[#0A0402]">
                  DevCanvas
                </h1>
                <div className="font-serif italic text-4xl sm:text-6xl text-[#7C3F2F] mt-2">
                  Portfolio Architecture
                </div>
              </div>

              <p className="font-mono text-[16px] leading-[1.3] uppercase text-[#3E1510] w-[440px] max-md:w-auto text-right max-md:text-left">
                Platform for the architecture of developer portfolios as living engineering brands.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: STATEMENT (#statement) - 🟤 Deep Brown (#3E1510) Architectural Card */}
        <section
          id="statement"
          className="relative h-[800px] max-md:h-[1024px] max-sm:h-[812px] w-full overflow-hidden flex items-center justify-end px-[40px] max-sm:px-[20px] py-[100px] max-md:items-end max-md:pb-[60px] max-sm:py-[60px] max-w-[1440px] mx-auto"
        >
          <div className="bg-[#3E1510] border border-[#270F05] p-12 max-sm:p-8 rounded-xs shadow-2xl flex flex-col gap-[32px] items-start w-[725px] max-lg:w-[517px] max-sm:w-full">
            <p className="font-mono text-[14px] leading-[1.2] uppercase text-[#A0674F] font-bold whitespace-nowrap border-b border-[#270F05] pb-2 w-full">
              [01 // THE CONVICTION]
            </p>
            <div className="font-serif text-[44px] max-lg:text-[36px] max-sm:text-[28px] leading-tight tracking-tight text-[#FFFFFF] w-full">
              <div className="mb-[20px]">
                <h2>We stopped building developer portfolios that look like 2020 resumes.</h2>
              </div>
              <div className="text-[#CCC0B5] italic">
                <p>We started creating architectural environments that prove engineering depth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ABOUT & MOTIVE (#about) */}
        <section
          id="about"
          className="relative h-[800px] max-md:h-[1024px] max-sm:h-[812px] w-full overflow-hidden flex flex-col items-start justify-center max-md:justify-end px-[40px] max-sm:px-[20px] max-md:pb-[60px] max-w-[1440px] mx-auto"
        >
          <div className="flex flex-col gap-[40px] items-start w-[580px] max-md:w-full">
            <p className="font-mono text-[16px] leading-[1.2] uppercase text-[#7C3F2F] font-bold">
              [02 // CORE MOTIVE]
            </p>
            <div className="font-serif text-[48px] max-lg:text-[40px] max-sm:text-[32px] leading-none tracking-[-1.44px] max-lg:tracking-[-1.2px] max-sm:tracking-[-0.96px] text-[#0A0402]">
              <div>
                <h2>We do not build templates.</h2>
              </div>
              <div className="text-[#56241A] italic">
                <p>We architect identities.</p>
              </div>
            </div>

            <div className="max-md:flex max-md:flex-row max-md:gap-[30px] max-sm:flex-col max-sm:gap-[24px]">
              <div className="font-mono text-[12px] leading-[1.5] uppercase text-[#0A0402] max-md:flex-1">
                <p className="mb-[12px]">
                  DevCanvas is a conceptual laboratory and studio dedicated to transforming raw code, GitHub repositories, and system achievements into bespoke digital brands.
                </p>
                <p className="text-[#3E1510]/80">
                  Free from generic template bloat, we focus on what precedes recruitment: the structure, depth, and presentation of thinking itself.
                </p>
              </div>

              {/* Bullet Marker & List */}
              <div className="flex gap-[4px] items-start pl-[60px] max-md:pl-0 max-md:flex-1 max-sm:pl-0 max-sm:flex-none mt-[32px] max-md:mt-0 border-l border-[#CCC0B5]">
                <ul className="font-mono text-[12px] leading-[1.6] uppercase text-[#3E1510] list-disc pl-[24px] space-y-1">
                  <li>We do not build generic builders</li>
                  <li>We do not produce boilerplate templates</li>
                  <li>We shape engineering depth</li>
                  <li>We automate technical storytelling</li>
                  <li>We deliver full Next.js code ownership</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ARCHIVE DOSSIERS (#archive) - SCROLL-DRIVEN 3D PLAYING CARD FLIP */}
        <DossierPlayingCardsSection />

        {/* SECTION 5: CONDITIONS (#models) - 🟤 Dark Chocolate Brown (#34281D) with 🤎 Very Dark Brown (#270F05) Columns */}
        <section
          id="models"
          className="bg-[#34281D] relative z-[10] flex flex-col gap-[120px] max-md:gap-[60px] pt-[120px] pb-[160px] px-[40px] max-sm:px-[20px] my-16 text-[#FFFFFF] border-y border-[#3E1510]"
        >
          <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-[80px]">
            {/* Header */}
            <div className="flex gap-[60px] items-baseline max-md:flex-col max-md:gap-[24px]">
              <div className="flex-1 min-w-0 flex items-center">
                <p className="font-mono text-[16px] leading-[1.2] uppercase text-[#A0674F] font-bold whitespace-nowrap">
                  [04 // CONDITIONS]
                </p>
              </div>
              <div className="flex flex-col gap-[24px] w-[725px] max-lg:w-[517px] max-md:w-full shrink-0 font-serif text-[40px] max-lg:text-[32px] max-sm:text-[28px] leading-tight tracking-[-1.2px] max-lg:tracking-[-0.96px] max-sm:tracking-[-0.84px] text-[#FFFFFF]">
                <div>
                  <h2>The emergence of standout presence depends on deliberate presentation.</h2>
                </div>
                <div>
                  <p className="text-[#CCC0B5] text-2xl max-sm:text-xl font-normal font-sans">
                    Small variations in density, latency and threshold states produce irreversible structural change.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Columns in 🤎 Very Dark Brown (#270F05) */}
            <div className="flex gap-[32px] max-md:flex-col">
              {/* Column 1 */}
              <div className="flex-1 bg-[#270F05] border border-[#3E1510] p-[32px] rounded-xs flex flex-col gap-[32px] shadow-lg">
                <div className="flex justify-between font-mono text-[12px] leading-[1.2] uppercase text-[#CCC0B5] whitespace-nowrap border-b border-[#3E1510] pb-3">
                  <span className="text-[#A0674F] font-semibold">[01 // PARAMETER]</span>
                  <span className="text-[#7C3F2F] font-bold">METRIC // 100%</span>
                </div>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="font-serif text-[38px] max-lg:text-[30px] leading-none tracking-[-1.2px] text-[#FFFFFF]">
                    Field Density
                  </h3>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] leading-[1.4] uppercase text-[#EEEBE7]/80">
                    <p>Increasing engineering density alters how your code is perceived.</p>
                    <p>Depth becomes undeniable only beyond critical concentration and narrative clarity.</p>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex-1 bg-[#270F05] border border-[#3E1510] p-[32px] rounded-xs flex flex-col gap-[32px] shadow-lg">
                <div className="flex justify-between font-mono text-[12px] leading-[1.2] uppercase text-[#CCC0B5] whitespace-nowrap border-b border-[#3E1510] pb-3">
                  <span className="text-[#A0674F] font-semibold">[02 // PARAMETER]</span>
                  <span className="text-[#7C3F2F] font-bold">0MS LATENCY</span>
                </div>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="font-serif text-[38px] max-lg:text-[30px] leading-none tracking-[-1.2px] text-[#FFFFFF]">
                    Signal Latency
                  </h3>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] leading-[1.4] uppercase text-[#EEEBE7]/80">
                    <p>Delayed system response destroys visitor engagement instantly.</p>
                    <p>100/100 Lighthouse performance reshapes the continuity of observed craft.</p>
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="flex-1 bg-[#270F05] border border-[#3E1510] p-[32px] rounded-xs flex flex-col gap-[32px] shadow-lg">
                <div className="flex justify-between font-mono text-[12px] leading-[1.2] uppercase text-[#CCC0B5] whitespace-nowrap border-b border-[#3E1510] pb-3">
                  <span className="text-[#A0674F] font-semibold">[03 // PARAMETER]</span>
                  <span className="text-[#7C3F2F] font-bold">PERMANENT</span>
                </div>
                <div className="flex flex-col gap-[16px]">
                  <h3 className="font-serif text-[38px] max-lg:text-[30px] leading-none tracking-[-1.2px] text-[#FFFFFF]">
                    Critical Threshold
                  </h3>
                  <div className="flex flex-col gap-[12px] font-mono text-[12px] leading-[1.4] uppercase text-[#EEEBE7]/80">
                    <p>Near hiring thresholds, generic template builders collapse into boilerplate noise.</p>
                    <p>Bespoke architecture guarantees permanent retention in the minds of leaders.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: MANIFESTO (#manifesto) */}
        <section
          id="manifesto"
          className="border-b border-[#CCC0B5] px-[40px] max-sm:px-[20px] py-[140px] max-md:py-[80px] max-w-[1440px] mx-auto"
        >
          <div className="font-serif text-[40px] max-lg:text-[32px] leading-tight tracking-[-1.2px] max-lg:tracking-[-0.96px] text-[#0A0402] flex-1 max-w-4xl">
            <div className="font-mono text-[14px] text-[#56241A] font-bold uppercase tracking-widest mb-6">
              [05 // MANIFESTO]
            </div>
            <div className="mb-[20px]">
              <h2>A portfolio is not something you copy.<br />It is an environment you command.</h2>
            </div>
            <div className="mb-[20px] text-[#7C3F2F]">
              <p>Not an object.<br />Not a function.</p>
            </div>
            <div className="text-[#56241A] font-semibold">
              <p>A condition of reality we are only beginning to notice.</p>
            </div>
          </div>
        </section>

        {/* SECTION 7: GATEWAY FOOTER (#contact) - 🤎 Very Dark Brown (#270F05) */}
        <footer
          id="contact"
          className="bg-[#270F05] text-[#FFFFFF] border-t border-[#3E1510] min-h-[660px] max-md:h-auto flex flex-col justify-between px-[40px] max-sm:px-[20px] pt-[80px] max-sm:pt-[60px] pb-[30px] w-full"
        >
          <div className="max-w-[1440px] mx-auto w-full flex items-start justify-between max-md:flex-col max-md:gap-[40px]">
            {/* Left Big Brand */}
            <div>
              <div className="w-[12px] h-[12px] bg-[#56241A] rounded-full mb-6 animate-pulse" />
              <div className="font-mono text-[12px] uppercase text-[#A0674F] tracking-widest font-medium">
                CREATIVE PRACTICE // HANOI, VN
              </div>
            </div>

            {/* Right Interactive Gateway Card in 🟤 Dark Chocolate Brown (#34281D) */}
            <div className="bg-[#34281D] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[40px] max-sm:gap-[24px] w-[723px] max-lg:w-[517px] max-md:w-full shadow-2xl">
              <div>
                <h2 className="font-serif font-medium text-[120px] max-lg:text-[100px] max-sm:text-[56px] leading-[0.79] tracking-[-4.8px] max-lg:tracking-[-4px] max-sm:tracking-[-2.24px] text-[#FFFFFF]">
                  DevCanvas
                </h2>
              </div>

              <div className="flex flex-col gap-[24px] w-[585px] max-md:w-full">
                <div className="font-mono text-[12px] leading-[1.4] uppercase text-[#EEEBE7]">
                  <p className="mb-[12px]">
                    The introductory portal has stabilized. Explore our live templates, interactive ruler, and curated developer portfolios.
                  </p>
                  <p className="text-[#A0674F] font-semibold">
                    Step forward into the main website:
                  </p>
                </div>

                {/* Earthy Burgundy Action Button */}
                <button
                  onClick={onEnterMainSite}
                  className="relative overflow-hidden inline-flex items-center gap-[8px] h-[52px] px-8 bg-[#56241A] hover:bg-[#7C3F2F] text-[#FFFFFF] border border-[#3E1510] font-mono font-bold text-[13px] uppercase tracking-[0.2em] transition-colors duration-300 group self-start cursor-pointer rounded-xs shadow-xl"
                  aria-label="Enter Main Website"
                >
                  <span className="flex items-center gap-[6px]">
                    <span>ENTER MAIN WEBSITE</span>
                    <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between font-mono text-[12px] tracking-[-0.36px] uppercase leading-[1.2] text-[#CCC0B5]/70 max-md:mt-[100px] max-sm:mt-[80px] border-t border-[#3E1510] pt-6">
            <p>© 2026 DevCanvas // PAAS. All rights reserved.</p>
            <p>Architects: Ishan Gupta &amp; Aparna Jha</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
