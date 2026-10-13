'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import GenerativeAttractorCanvas from './GenerativeAttractorCanvas';
import DossierPlayingCardsSection from './DossierPlayingCardsSection';
import { Eyebrow, GhostNumeral, Reveal } from './Reveal';

interface PortalIntroPageProps {
  onEnterMainSite: () => void;
}

const FEATURES = [
  'Your resume, intelligently transformed',
  'Your projects and skills, beautifully presented',
  'Your achievements, thoughtfully organized',
  'Your portfolio, ready to share',
  'Your story, presented your way',
];

const COLUMNS = [
  {
    index: '[01 // EXTRACTION]',
    tag: 'AUTOMATED',
    title: 'Resume Parsing',
    lines: [
      'Instantly extracts your bio, education, technical skills, projects, and work history.',
      'No need to re-type existing information into dozens of separate form fields.',
    ],
  },
  {
    index: '[02 // STRUCTURE]',
    tag: 'ORGANIZED',
    title: 'Project Showcase',
    lines: [
      'Displays your projects, tech stacks, live links, and achievements in structured cards.',
      'Gives hiring managers and recruiters a fast, organized view of your technical capabilities.',
    ],
  },
  {
    index: '[03 // IMPACT]',
    tag: 'SHAREABLE',
    title: 'Online Presence',
    lines: [
      'Provides a clean, professional web link to share on resumes, LinkedIn, and applications.',
      'A convenient starting point for students and early-career developers launching their careers.',
    ],
  },
];

export default function PortalIntroPage({ onEnterMainSite }: PortalIntroPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Spring-smoothed scroll: text glides ahead while the pattern trails.
  const smoothScrollY = useSpring(scrollY, { stiffness: 90, damping: 22, mass: 0.6 });
  const heroTitleY = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 700], [0, 130]);
  const heroFade = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 480], [1, 0]);
  const scrollHintFade = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 180], [1, 0]);
  const heroMotionStyle = reduceMotion ? undefined : { y: heroTitleY, opacity: heroFade };

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

      {/* 2. Fixed Header with Telemetry & Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none px-[40px] max-sm:px-[20px] pt-[30px] pb-4 transition-colors duration-200">
        <div className="flex items-center justify-between w-full pointer-events-auto max-w-[1440px] mx-auto">
          {/* Logo / Brandmark */}
          <div className="w-[455px] max-lg:w-[299px] max-md:w-[217px] max-sm:w-auto shrink-0">
            <a href="#hero" onClick={smoothScrollTo('hero')} className="inline-flex items-center gap-2.5 min-h-[44px] group cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3F2F]">
              <span className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] text-[#0A0402] group-hover:text-[#56241A] transition-colors">
                DEVCANVAS
              </span>
              <span className="font-mono text-[11px] text-[#7C3F2F] border border-[#7C3F2F]/40 bg-[#7C3F2F]/10 px-2 py-0.5 rounded-xs uppercase tracking-wider hidden sm:inline">
                RESUME → PORTFOLIO BUILDER
              </span>
            </a>
          </div>

          {/* Direct Enter Site CTA */}
          <button
            onClick={onEnterMainSite}
            className="relative overflow-hidden inline-flex items-center gap-[6px] min-h-[44px] px-5 py-2.5 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-lg hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] transition-all duration-200 cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3F2F]"
            aria-label="Create My Portfolio"
          >
            <span className="font-mono font-bold text-[13px] uppercase tracking-wider">
              CREATE MY PORTFOLIO
            </span>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200 text-sm">
              →
            </span>
          </button>
        </div>
      </header>

      {/* 4. MAIN EDITORIAL SECTION FLOW */}
      <main className="relative z-[1] w-full">
      {/* Sticky pinned attractor: stays on screen for the whole page, morphs with scroll */}
      <div className="sticky top-0 h-screen pointer-events-none will-change-transform" aria-hidden="true">
        <GenerativeAttractorCanvas />
      </div>
      <div className="-mt-[100vh] relative">
        {/* SECTION 1: HERO */}
        <section
          id="hero"
          className="relative min-h-screen w-full px-[40px] max-sm:px-[20px] pt-[90px] pb-[50px] flex flex-col justify-center max-w-[1440px] mx-auto"
        >
          {/* Main Hero Layout: Attractor on Left, Typography Cluster on Right */}
          <div className="w-full flex items-center justify-end my-auto py-12">
            {/* Unified Art-Directed Typographic Lockup */}
            <motion.div
              style={heroMotionStyle}
              className="w-full lg:w-[680px] xl:w-[760px] flex flex-col items-center text-center max-lg:items-center max-lg:text-center z-10"
            >
              {/* Refined Eyebrow */}
              <div className="flex items-center gap-2 mb-4 font-mono text-[12px] tracking-[0.22em] uppercase text-[#7C3F2F] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3F2F] animate-pulse" />
                <span>RESUME-TO-PORTFOLIO ARCHITECTURE</span>
              </div>

              {/* Main Heading — 64-76px guideline */}
              <h1 className="font-serif font-medium text-[clamp(3.25rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] text-[#0A0402] whitespace-nowrap">
                DevCanvas
              </h1>

              {/* Subheading — 22-26px guideline */}
              <div className="font-serif italic font-normal text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.3] tracking-[-0.015em] text-[#7C3F2F] mt-3.5 sm:mt-4 whitespace-normal sm:whitespace-nowrap">
                Your Journey. Your Craft. Your Canvas.
              </div>

              {/* Delicate Editorial Accent Divider */}
              <div className="w-16 h-[1.5px] bg-[#7C3F2F]/35 my-5 sm:my-6" />

              {/* Balanced Description Paragraph — 16-18px guideline */}
              <p className="font-sans text-[16px] sm:text-[17px] leading-[1.65] font-normal text-[#34281D]/85 max-w-[550px] tracking-[-0.01em]">
                Turn your resume into a portfolio that feels unmistakably yours. Your skills, projects, and milestones, thoughtfully brought together in one beautiful space.
              </p>

              {/* Quick Action Buttons */}
              <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
                <button
                  onClick={onEnterMainSite}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] text-[#FFFFFF] font-mono font-bold text-[13px] uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0"
                  aria-label="Create My Portfolio"
                >
                  <span>CREATE MY PORTFOLIO</span>
                  <span className="text-xs">→</span>
                </button>
                <a
                  href="#statement"
                  onClick={smoothScrollTo('statement')}
                  className="font-mono text-[13px] uppercase tracking-wider text-[#7C3F2F] hover:text-[#56241A] transition-colors py-2.5 px-3.5 border border-[#7C3F2F]/30 hover:border-[#56241A] rounded-xs font-semibold"
                >
                  EXPLORE THE WORKFLOW ↓
                </a>
              </div>
            </motion.div>
          </div>

          {/* Floating Scroll Indicator in Lower Left Corner */}
          <motion.div
            style={reduceMotion ? undefined : { opacity: scrollHintFade }}
            className="absolute bottom-8 left-[40px] max-sm:left-[20px] flex items-center gap-3.5 max-md:hidden"
          >
            <div className="w-[1px] h-9 bg-[#7C3F2F]/60 animate-pulse" />
            <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#3E1510]/75 leading-[1.4]">
              See How It Works <br />
              <span className="text-[#7C3F2F] font-semibold">Scroll Down</span>
            </p>
          </motion.div>
        </section>

        {/* SECTION 2: STATEMENT (#statement) - 🟤 Deep Brown (#3E1510) Architectural Card */}
        <section
          id="statement"
          className="relative min-h-[800px] max-md:min-h-[1024px] max-sm:min-h-[812px] w-full flex items-center justify-end px-[40px] max-sm:px-[20px] py-[160px] max-md:items-end max-md:pb-[60px] max-sm:py-[80px] max-w-[1440px] mx-auto"
        >
          <GhostNumeral numeral="01" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] -top-6 right-[24px]" />
          <Reveal className="w-[760px] max-lg:w-[517px] max-sm:w-full">
            <div className="bg-[#3E1510] border border-[#270F05] p-14 max-sm:p-8 rounded-xs shadow-2xl flex flex-col gap-[32px] items-start w-full">
              <Eyebrow label="[01 // THE PURPOSE]" dark className="w-full" />
              <div className="flex flex-col gap-[16px] w-full">
                <h2 className="font-serif font-medium text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.08] tracking-[-0.025em] text-[#FFFFFF]">
                  Stop spending days building your portfolio website from scratch.
                </h2>
                <p className="font-serif italic font-normal text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.3] tracking-[-0.015em] text-[#CCC0B5] mt-2">
                  Upload your resume, and turn your experience into a structured, professional portfolio that proves your capabilities.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION 3: ABOUT & MOTIVE (#about) */}
        <section
          id="about"
          className="relative min-h-[850px] max-md:min-h-auto w-full flex flex-col items-start justify-center px-[40px] max-sm:px-[20px] py-[140px] max-md:py-[90px] max-w-[1440px] mx-auto overflow-hidden"
        >
          <GhostNumeral numeral="02" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] top-10 left-[24px]" />
          <div className="relative z-10 flex flex-col items-start max-w-[720px] w-full">
            {/* 1. Main Heading — 44-56px guideline */}
            <Reveal>
              <h2 className="font-serif font-medium text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.08] tracking-[-0.025em] text-[#0A0402]">
                Your resume, reimagined as a website.
              </h2>
            </Reveal>

            {/* 2. Subheading — 22-26px guideline */}
            <Reveal delay={0.06}>
              <div className="font-serif italic font-normal text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.3] tracking-[-0.015em] text-[#7C3F2F] mt-3.5 sm:mt-4">
                Built from your journey. Designed to make you stand out.
              </div>
            </Reveal>

            {/* 3. Small Introductory Label — 12-14px guideline */}
            <Reveal delay={0.1}>
              <div className="mt-8 sm:mt-10 mb-3.5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#7C3F2F]" />
                <span className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#7C3F2F] font-semibold">
                  YOUR EXPERIENCE DESERVES MORE THAN A DOCUMENT.
                </span>
              </div>
            </Reveal>

            {/* 4. Description Paragraph — 16-18px guideline */}
            <Reveal delay={0.14}>
              <p className="font-sans text-[16px] sm:text-[17px] leading-[1.65] font-normal text-[#34281D]/90 max-w-[620px] tracking-[-0.01em]">
                DevCanvas transforms your resume into a polished, personalized portfolio website — bringing your education, projects, skills, and achievements together in one place.
              </p>
            </Reveal>

            {/* 5. Feature List — 15-17px guideline */}
            <Reveal delay={0.18}>
              <ul className="mt-7 sm:mt-8 space-y-3.5 sm:space-y-4">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3.5 group">
                    <span
                      aria-hidden="true"
                      className="w-[6px] h-[6px] rotate-45 bg-[#7C3F2F] shrink-0 transition-transform duration-200 group-hover:scale-125"
                    />
                    <span className="font-sans text-[15px] sm:text-[16px] leading-[1.45] text-[#270F05] font-medium tracking-[-0.01em]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* SECTION 4: ARCHIVE DOSSIERS (#archive) - SCROLL-DRIVEN 3D PLAYING CARD FLIP */}
        <DossierPlayingCardsSection />

        {/* SECTION 5: CONDITIONS (#models) - 🟤 Dark Chocolate Brown (#34281D) with 🤎 Very Dark Brown (#270F05) Columns */}
        <section
          id="models"
          className="bg-[#34281D] relative z-[10] flex flex-col gap-[120px] max-md:gap-[60px] pt-[160px] pb-[200px] px-[40px] max-sm:px-[20px] my-16 text-[#FFFFFF] border-y border-[#3E1510] overflow-hidden"
        >
          <GhostNumeral numeral="04" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] top-8 right-[32px] opacity-25" />
          <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-[90px]">
            {/* Header */}
            <div className="flex gap-[60px] items-baseline max-md:flex-col max-md:gap-[24px]">
              <div className="flex-1 min-w-0">
                <Reveal>
                  <Eyebrow label="[04 // CORE ADVANTAGES]" dark />
                </Reveal>
              </div>
              <div className="flex flex-col gap-[20px] w-[725px] max-lg:w-[517px] max-md:w-full shrink-0">
                <Reveal delay={0.08}>
                  <h2 className="font-serif font-medium text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.08] tracking-[-0.025em] text-[#FFFFFF]">
                    Stand out to recruiters with a portfolio that highlights what matters.
                  </h2>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="font-serif italic font-normal text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.3] tracking-[-0.015em] text-[#CCC0B5]">
                    Turn raw resume bullets into clear, structured sections that showcase your true potential.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* 3 Columns in 🤎 Very Dark Brown (#270F05) */}
            <div className="flex gap-[32px] max-md:flex-col">
              {COLUMNS.map((col, i) => (
                <Reveal key={col.title} delay={i * 0.1} className="flex-1">
                  <div className="h-full bg-[#270F05] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[28px] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7C3F2F]/60 hover:shadow-2xl">
                    <div className="flex flex-wrap justify-between gap-x-4 font-mono text-[12px] leading-[1.2] uppercase text-[#CCC0B5] border-b border-[#3E1510] pb-3">
                      <span className="text-[#A0674F] font-semibold">{col.index}</span>
                      <span className="text-[#7C3F2F] font-bold">{col.tag}</span>
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <h3 className="font-serif font-medium text-[clamp(1.75rem,2.2vw,2.15rem)] leading-tight tracking-[-0.02em] text-[#FFFFFF]">
                        {col.title}
                      </h3>
                      <div className="flex flex-col gap-[12px] font-sans text-[14px] sm:text-[15px] leading-[1.6] text-[#EEEBE7]/85">
                        {col.lines.map((line) => (
                          <p key={line.slice(0, 24)}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: MANIFESTO (#manifesto) */}
        <section
          id="manifesto"
          className="relative border-b border-[#CCC0B5] px-[40px] max-sm:px-[20px] py-[180px] max-md:py-[100px] max-w-[1440px] mx-auto overflow-hidden"
        >
          <GhostNumeral numeral="05" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] -top-4 right-[24px]" />
          <div className="flex-1 max-w-5xl">
            <Reveal>
              <div className="font-mono text-[12px] text-[#56241A] font-bold uppercase tracking-[0.2em] mb-8">
                [05 // OUR PHILOSOPHY]
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mb-[24px]">
                <h2 className="font-serif font-medium text-[clamp(2.25rem,3.8vw,3.25rem)] leading-[1.08] tracking-[-0.025em] text-[#0A0402]">
                  Your portfolio should reflect the hard work<br />you put into your projects and education.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mb-[20px]">
                <p className="font-serif italic font-normal text-[clamp(1.25rem,1.8vw,1.6rem)] leading-[1.35] tracking-[-0.015em] text-[#7C3F2F]">
                  No tedious boilerplate setup. No building everything from scratch.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div>
                <p className="font-sans text-[16px] sm:text-[17px] leading-[1.65] font-normal text-[#56241A] max-w-2xl">
                  Just a clear, structured website that lets your achievements speak for themselves.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* SECTION 7: GATEWAY FOOTER (#contact) - 🤎 Very Dark Brown (#270F05) */}
        <footer
          id="contact"
          className="bg-[#270F05] text-[#FFFFFF] border-t border-[#3E1510] min-h-[660px] max-md:h-auto flex flex-col justify-between px-[40px] max-sm:px-[20px] pt-[110px] max-sm:pt-[60px] pb-[30px] w-full"
        >
          <div className="max-w-[1440px] mx-auto w-full flex items-start justify-between max-md:flex-col max-md:gap-[40px]">
            {/* Left Big Brand */}
            <Reveal>
              <div>
                <div className="w-[12px] h-[12px] bg-[#56241A] rounded-full mb-6 animate-pulse" />
                <div className="font-mono text-[12px] uppercase text-[#A0674F] tracking-[0.2em] font-medium">
                  RESUME-TO-PORTFOLIO BUILDER // STUDENTS &amp; DEVELOPERS
                </div>
              </div>
            </Reveal>

            {/* Right Interactive Gateway Card in 🟤 Dark Chocolate Brown (#34281D) */}
            <Reveal delay={0.1} className="w-[723px] max-lg:w-[517px] max-md:w-full">
              <div className="bg-[#34281D] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[36px] max-sm:gap-[24px] w-full shadow-2xl">
                <div>
                  <h2 className="font-serif font-medium text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[0.95] tracking-[-0.035em] text-[#FFFFFF] break-words">
                    DevCanvas
                  </h2>
                </div>

                <div className="flex flex-col gap-[20px] w-[585px] max-lg:w-full">
                  <div className="flex flex-col gap-[10px]">
                    <p className="font-sans text-[15px] sm:text-[16px] leading-[1.6] text-[#EEEBE7]/90">
                      Turn your resume into a professional portfolio website in minutes. Extract your skills, projects, and education into a clean, shareable showcase.
                    </p>
                    <p className="font-mono text-[12px] uppercase tracking-wider text-[#A0674F] font-semibold">
                      Start building your portfolio today:
                    </p>
                  </div>

                  {/* Earthy Burgundy Action Button */}
                  <button
                    onClick={onEnterMainSite}
                    className="relative overflow-hidden inline-flex items-center gap-[8px] h-[52px] px-8 bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-xl hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] border border-[#3E1510] font-mono font-bold text-[13px] uppercase tracking-[0.18em] transition-all duration-300 group self-start cursor-pointer rounded-xs shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0674F]"
                    aria-label="Create My Portfolio"
                  >
                    <span className="flex items-center gap-[6px]">
                      <span>CREATE MY PORTFOLIO</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom Line */}
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between font-mono text-[12px] tracking-[0.05em] uppercase leading-[1.4] text-[#CCC0B5]/70 max-md:mt-[100px] max-sm:mt-[80px] border-t border-[#3E1510] pt-6 flex-wrap gap-4">
            <p>© 2026 DevCanvas. All rights reserved.</p>
            <p>Designed for students, fresh graduates, and aspiring professionals</p>
          </div>
        </footer>
      </div>
      </main>
    </div>
  );
}
