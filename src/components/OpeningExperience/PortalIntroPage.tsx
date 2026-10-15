'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'framer-motion';
import GenerativeAttractorCanvas from './GenerativeAttractorCanvas';
import DossierPlayingCardsSection from './DossierPlayingCardsSection';
import InteractivePortfolioShowcase from './InteractivePortfolioShowcase';
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

// Animation variants for Section 2 Burgundy Card: 800ms ease-out, 30px slide-up, 120ms staggered children
const cardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // 800ms
      ease: 'easeOut',
      delayChildren: 0.12,
      staggerChildren: 0.12, // 120ms stagger between child text elements
    },
  },
};

const textItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function PortalIntroPage({ onEnterMainSite }: PortalIntroPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Hero section motion
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 90, damping: 22, mass: 0.6 });
  const heroTitleY = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 700], [0, 130]);
  const heroFade = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 480], [1, 0]);
  const scrollHintFade = useTransform(reduceMotion ? scrollY : smoothScrollY, [0, 180], [1, 0]);
  const heroMotionStyle = reduceMotion ? undefined : { y: heroTitleY, opacity: heroFade };

  // Section 2 Burgundy Card Trigger: Fire once when section reaches 20% visibility in viewport
  const isStatementInView = useInView(statementRef, { once: true, amount: 0.2 });

  // Section 2 Orbital Artwork: Continuous scroll-linked rotation (max 8°) and vertical shift (up to 20px)
  const { scrollYProgress: statementScrollProgress } = useScroll({
    target: statementRef,
    offset: ['start end', 'end start'],
  });

  const rawArtworkRotate = useTransform(
    statementScrollProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 8]
  );
  const rawArtworkY = useTransform(
    statementScrollProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 20]
  );

  const artworkRotate = useSpring(rawArtworkRotate, { stiffness: 90, damping: 25, mass: 0.5 });
  const artworkY = useSpring(rawArtworkY, { stiffness: 90, damping: 25, mass: 0.5 });
  const artworkMotionStyle = reduceMotion
    ? undefined
    : { rotate: artworkRotate, y: artworkY };

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
      {/* 2. Fixed Header with Telemetry & Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none px-6 sm:px-10 lg:px-14 pt-6 sm:pt-7 pb-4 transition-colors duration-200">
        <div className="flex items-center justify-between w-full pointer-events-auto max-w-[1520px] mx-auto">
          {/* Logo / Brandmark */}
          <div className="shrink-0">
            <a href="#hero" onClick={smoothScrollTo('hero')} className="inline-flex items-center gap-3 min-h-[44px] group cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3F2F]">
              <span className="font-mono text-body font-bold tracking-[0.25em] text-[#0A0402] group-hover:text-[#56241A] transition-colors">
                DEVCANVAS
              </span>
              <span className="font-mono text-caption text-[#7C3F2F] border border-[#7C3F2F]/40 bg-[#7C3F2F]/10 px-2.5 py-0.5 rounded-xs uppercase hidden sm:inline font-semibold">
                RESUME → PORTFOLIO BUILDER
              </span>
            </a>
          </div>

          {/* Direct Enter Site CTA */}
          <button
            onClick={onEnterMainSite}
            className="relative overflow-hidden inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-lg hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] transition-all duration-200 cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3F2F]"
            aria-label="Create My Portfolio"
          >
            <span className="font-mono font-bold text-button uppercase">
              CREATE MY PORTFOLIO
            </span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 text-button">
              →
            </span>
          </button>
        </div>
      </header>

      {/* 4. MAIN EDITORIAL SECTION FLOW */}
      <main className="relative z-[1] w-full">
      {/* Sticky pinned attractor: stays on screen for the whole page, morphs with scroll */}
      <motion.div
        className="sticky top-0 h-screen pointer-events-none will-change-transform"
        aria-hidden="true"
        style={artworkMotionStyle}
      >
        <GenerativeAttractorCanvas />
      </motion.div>
      <div className="-mt-[100vh] relative">
        {/* SECTION 1: HERO */}
        <section
          id="hero"
          className="relative min-h-screen w-full px-6 sm:px-10 lg:px-14 pt-[105px] sm:pt-[120px] pb-8 flex flex-col justify-between max-w-[1520px] mx-auto z-10"
        >
          {/* Main Hero Architectural Stage */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-6 sm:py-10">
            
            {/* Left Spatial Column: Generative Attractor Framing (Preserved space for artwork) */}
            <div className="hidden lg:block lg:col-span-5 pointer-events-none select-none" aria-hidden="true" />

            {/* Right Column: Hero Typographic Lockup (Shifted 120px right on desktop) */}
            <div className="lg:col-span-7 lg:translate-x-[120px] flex flex-col items-start text-left max-lg:items-center max-lg:text-center z-10 w-full">
              <motion.div
                style={heroMotionStyle}
                className="flex flex-col items-start text-left max-lg:items-center max-lg:text-center w-full"
              >
                {/* Grand Display Headline */}
                <h1 className="font-serif font-medium text-display text-[#0A0402] whitespace-normal sm:whitespace-nowrap">
                  DevCanvas
                </h1>

                {/* Editorial Tagline */}
                <div className="font-serif italic font-normal text-heading-lg text-[#7C3F2F] mt-2 sm:mt-3 whitespace-normal sm:whitespace-nowrap">
                  Your Journey. Your Craft. Your Canvas.
                </div>

                {/* Architectural Gauge / Meter */}
                <div className="flex items-center gap-3 w-full max-w-[560px] my-5 sm:my-6">
                  <span className="w-2 h-2 rotate-45 bg-[#7C3F2F] shrink-0" />
                  <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#7C3F2F]/60 via-[#7C3F2F]/25 to-transparent max-lg:bg-[#7C3F2F]/35" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#A0674F] font-semibold shrink-0">
                    EST. 2026 // EDITION v2.4
                  </span>
                </div>

                {/* Balanced Description Paragraph */}
                <p className="font-sans text-body-lg font-normal text-[#34281D]/90 max-w-[620px]">
                  Turn your resume into a portfolio that feels unmistakably yours. Your skills, projects, and milestones — thoughtfully brought together into a structured, recruiter-ready website.
                </p>

                {/* Scaled-Up Action Suite */}
                <div className="mt-6 sm:mt-9 flex items-center gap-3 sm:gap-4 flex-wrap max-lg:justify-center">
                  <button
                    onClick={onEnterMainSite}
                    className="inline-flex items-center gap-2.5 sm:gap-3 h-[50px] sm:h-[54px] px-6 sm:px-9 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] text-[#FFFFFF] font-mono font-bold text-button uppercase transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 group"
                    aria-label="Create My Portfolio"
                  >
                    <span>CREATE MY PORTFOLIO</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 text-button">→</span>
                  </button>
                  <a
                    href="#statement"
                    onClick={smoothScrollTo('statement')}
                    className="inline-flex items-center gap-2 h-[50px] sm:h-[54px] px-5 sm:px-8 font-mono text-button uppercase text-[#7C3F2F] hover:text-[#56241A] hover:bg-[#7C3F2F]/10 transition-all duration-200 border border-[#7C3F2F]/40 hover:border-[#56241A] rounded-xs font-semibold"
                  >
                    <span>EXPLORE THE WORKFLOW</span>
                    <span>↓</span>
                  </a>
                </div>

                {/* Hero Value Proof Points */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-7 border-t border-[#7C3F2F]/20 grid grid-cols-3 gap-2 sm:gap-6 w-full max-w-[640px]">
                  <div className="flex flex-col gap-1 text-left max-lg:text-center">
                    <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-[#A0674F] font-semibold flex items-center gap-1 max-lg:justify-center">
                      <span className="text-[#7C3F2F]">01 /</span> PARSE
                    </div>
                    <span className="text-[12px] sm:text-[13px] font-sans font-medium text-[#270F05] leading-snug">
                      <span className="hidden sm:inline">1-Click PDF Extraction</span>
                      <span className="sm:hidden">1-Click PDF</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-left max-lg:text-center">
                    <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-[#A0674F] font-semibold flex items-center gap-1 max-lg:justify-center">
                      <span className="text-[#7C3F2F]">02 /</span> STRUCTURE
                    </div>
                    <span className="text-[12px] sm:text-[13px] font-sans font-medium text-[#270F05] leading-snug">
                      <span className="hidden sm:inline">Curated Editorial Layouts</span>
                      <span className="sm:hidden">Editorial Design</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-left max-lg:text-center">
                    <div className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-[#A0674F] font-semibold flex items-center gap-1 max-lg:justify-center">
                      <span className="text-[#7C3F2F]">03 /</span> DEPLOY
                    </div>
                    <span className="text-[12px] sm:text-[13px] font-sans font-medium text-[#270F05] leading-snug">
                      <span className="hidden sm:inline">Recruiter-Ready Live Link</span>
                      <span className="sm:hidden">Live Web Link</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full-Width Architectural Baseline Bar */}
          <div className="w-full pt-5 pb-1 border-t border-[#CCC0B5]/70 flex items-center justify-between font-mono text-caption uppercase text-[#7C3F2F] tracking-wider mt-auto max-sm:flex-col max-sm:gap-2.5 max-sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3F2F] animate-pulse" />
              <a href="#statement" onClick={smoothScrollTo('statement')} className="hover:text-[#56241A] transition-colors inline-flex items-center gap-2">
                <span>SCROLL TO EXPLORE WORKFLOW</span>
                <span className="text-[#56241A] font-bold">↓</span>
              </a>
            </div>
            <div className="text-[#56241A] font-semibold">
              DESIGNED FOR DEVELOPERS &amp; STUDENTS
            </div>
          </div>
        </section>

        {/* SECTION 2: DYNAMIC INTERACTIVE PORTFOLIO SHOWCASE (#statement) */}
        <section
          id="statement"
          ref={statementRef}
          className="relative min-h-[850px] w-full flex items-center justify-end px-6 sm:px-10 lg:px-14 py-20 sm:py-28 max-w-[1520px] mx-auto z-10"
        >
          <GhostNumeral numeral="01" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] -top-6 right-[24px]" />
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? "visible" : (isStatementInView ? "visible" : "hidden")}
            variants={cardContainerVariants}
            className="w-full lg:max-w-[880px] z-10 flex justify-end"
          >
            <InteractivePortfolioShowcase />
          </motion.div>
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
              <h2 className="font-serif font-medium text-heading-xl text-[#0A0402]">
                Your resume, reimagined as a website.
              </h2>
            </Reveal>

            {/* 2. Subheading — 22-26px guideline */}
            <Reveal delay={0.06}>
              <div className="font-serif italic font-normal text-heading-lg text-[#7C3F2F] mt-3.5 sm:mt-4">
                Built from your journey. Designed to make you stand out.
              </div>
            </Reveal>

            {/* 3. Small Introductory Label — 12-14px guideline */}
            <Reveal delay={0.1}>
              <div className="mt-8 sm:mt-10 mb-3.5 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rotate-45 bg-[#7C3F2F]" />
                <span className="font-mono text-label uppercase text-[#7C3F2F] font-semibold">
                  YOUR EXPERIENCE DESERVES MORE THAN A DOCUMENT.
                </span>
              </div>
            </Reveal>

            {/* 4. Description Paragraph — 16-18px guideline */}
            <Reveal delay={0.14}>
              <p className="font-sans text-body-lg font-normal text-[#34281D]/90 max-w-[620px]">
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
                    <span className="font-sans text-body text-[#270F05] font-medium">
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
                  <h2 className="font-serif font-medium text-heading-xl text-[#FFFFFF]">
                    Stand out to recruiters with a portfolio that highlights what matters.
                  </h2>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="font-serif italic font-normal text-heading-lg text-[#CCC0B5]">
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
                    <div className="flex flex-wrap justify-between gap-x-4 font-mono text-label uppercase text-[#CCC0B5] border-b border-[#3E1510] pb-3">
                      <span className="text-[#A0674F] font-semibold">{col.index}</span>
                      <span className="text-[#7C3F2F] font-bold">{col.tag}</span>
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <h3 className="font-serif font-medium text-heading-md text-[#FFFFFF]">
                        {col.title}
                      </h3>
                      <div className="flex flex-col gap-[12px] font-sans text-body text-[#EEEBE7]/85">
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
              <div className="font-mono text-label text-[#56241A] font-bold uppercase mb-8">
                [05 // OUR PHILOSOPHY]
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mb-[24px]">
                <h2 className="font-serif font-medium text-heading-xl text-[#0A0402]">
                  Your portfolio should reflect the hard work<br />you put into your projects and education.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mb-[20px]">
                <p className="font-serif italic font-normal text-heading-lg text-[#7C3F2F]">
                  No tedious boilerplate setup. No building everything from scratch.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div>
                <p className="font-sans text-body-lg font-normal text-[#56241A] max-w-2xl">
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
                <div className="font-mono text-label uppercase text-[#A0674F] font-medium">
                  RESUME-TO-PORTFOLIO BUILDER // STUDENTS &amp; DEVELOPERS
                </div>
              </div>
            </Reveal>

            {/* Right Interactive Gateway Card in 🟤 Dark Chocolate Brown (#34281D) */}
            <Reveal delay={0.1} className="w-[723px] max-lg:w-[517px] max-md:w-full">
              <div className="bg-[#34281D] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[36px] max-sm:gap-[24px] w-full shadow-2xl">
                <div>
                  <h2 className="font-serif font-medium text-display text-[#FFFFFF] break-words">
                    DevCanvas
                  </h2>
                </div>

                <div className="flex flex-col gap-[20px] w-[585px] max-lg:w-full">
                  <div className="flex flex-col gap-[10px]">
                    <p className="font-sans text-body text-[#EEEBE7]/90">
                      Turn your resume into a professional portfolio website in minutes. Extract your skills, projects, and education into a clean, shareable showcase.
                    </p>
                    <p className="font-mono text-label uppercase text-[#A0674F] font-semibold">
                      Start building your portfolio today:
                    </p>
                  </div>

                  {/* Earthy Burgundy Action Button */}
                  <button
                    onClick={onEnterMainSite}
                    className="relative overflow-hidden inline-flex items-center gap-[8px] h-[52px] px-8 bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-xl hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] border border-[#3E1510] font-mono font-bold text-button uppercase transition-all duration-300 group self-start cursor-pointer rounded-xs shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0674F]"
                    aria-label="Create My Portfolio"
                  >
                    <span className="flex items-center gap-[6px]">
                      <span>CREATE MY PORTFOLIO</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200 text-button">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom Line */}
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between font-mono text-caption uppercase text-[#CCC0B5]/70 max-md:mt-[100px] max-sm:mt-[80px] border-t border-[#3E1510] pt-6 flex-wrap gap-4">
            <p>© 2026 DevCanvas. All rights reserved.</p>
            <p>Designed for students, fresh graduates, and aspiring professionals</p>
          </div>
        </footer>
      </div>
      </main>
    </div>
  );
}
