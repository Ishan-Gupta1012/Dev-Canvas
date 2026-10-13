'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import GenerativeAttractorCanvas from './GenerativeAttractorCanvas';
import DossierPlayingCardsSection from './DossierPlayingCardsSection';
import { Eyebrow, GhostNumeral, Reveal } from './Reveal';

interface PortalIntroPageProps {
  onEnterMainSite: () => void;
}

const BULLETS = [
  'Automated resume information extraction',
  'Structured showcase for projects and skills',
  'Highlights education, internships and achievements',
  'Less manual work creating a portfolio',
  'Ready to share with recruiters and teams',
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
            <a href="#hero" onClick={smoothScrollTo('hero')} className="inline-flex items-center gap-2 min-h-[44px] group cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3F2F]">
              <span className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] text-[#0A0402] group-hover:text-[#56241A] transition-colors">
                DEVCANVAS
              </span>
              <span className="font-mono text-[9px] text-[#7C3F2F] border border-[#7C3F2F]/40 bg-[#7C3F2F]/10 px-1.5 py-0.2 rounded-xs uppercase hidden sm:inline">
                RESUME → PORTFOLIO BUILDER
              </span>
            </a>
          </div>

          {/* Direct Enter Site CTA */}
          <button
            onClick={onEnterMainSite}
            className="relative overflow-hidden inline-flex items-center gap-[6px] min-h-[44px] px-4 rounded-xs border border-[#3E1510] bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-lg hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] transition-all duration-200 cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3F2F]"
            aria-label="Create My Portfolio"
          >
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider">
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
          className="relative min-h-[820px] max-lg:min-h-[768px] max-md:min-h-[950px] max-sm:min-h-[730px] w-full px-[40px] max-sm:px-[20px] pt-[30px] max-md:pb-[40px] max-sm:pb-[60px] flex flex-col justify-between max-w-[1440px] mx-auto"
        >
          <div className="h-[40px] shrink-0" />

          {/* Bottom Area: Scroll indicator on Left, Giant Title on Right */}
          <div className="flex items-end justify-between shrink-0 w-full mb-8">
            {/* Scroll Indicator with Hairline */}
            <motion.div
              style={reduceMotion ? undefined : { opacity: scrollHintFade }}
              className="flex gap-[10px] items-center shrink-0 max-md:hidden"
            >
              <div className="w-[1px] h-10 bg-[#7C3F2F]/50 animate-pulse" />
              <p className="font-mono text-[12px] tracking-[-0.36px] uppercase text-[#3E1510]/70 leading-[1.2] whitespace-pre w-[135px]">
                See How It Works <br />
                Scroll down
              </p>
            </motion.div>

            {/* Giant Title & Lead Paragraph */}
            <motion.div
              style={heroMotionStyle}
              className="flex flex-col gap-[48px] items-end w-[820px] max-lg:w-[580px] max-md:w-full max-md:items-start shrink-0"
            >
              <div className="w-full text-right max-md:text-left">
                <h1 className="font-serif font-medium text-[clamp(3.25rem,11vw,10rem)] leading-[0.82] tracking-[-0.035em] text-[#0A0402] break-words">
                  DevCanvas
                </h1>
                <div className="font-serif italic text-4xl sm:text-6xl text-[#7C3F2F] mt-4">
                  Your Resume. Your Story. Your Portfolio.
                </div>
              </div>

              <p className="font-mono text-[16px] leading-[1.3] uppercase text-[#3E1510] w-[440px] max-md:w-auto text-right max-md:text-left">
                Turn your resume into a professional portfolio website. Let your skills, projects, education, and achievements speak for themselves.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: STATEMENT (#statement) - 🟤 Deep Brown (#3E1510) Architectural Card */}
        <section
          id="statement"
          className="relative min-h-[800px] max-md:min-h-[1024px] max-sm:min-h-[812px] w-full flex items-center justify-end px-[40px] max-sm:px-[20px] py-[160px] max-md:items-end max-md:pb-[60px] max-sm:py-[80px] max-w-[1440px] mx-auto"
        >
          <GhostNumeral numeral="01" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] -top-6 right-[24px]" />
          <Reveal className="w-[760px] max-lg:w-[517px] max-sm:w-full">
            <div className="bg-[#3E1510] border border-[#270F05] p-14 max-sm:p-8 rounded-xs shadow-2xl flex flex-col gap-[36px] items-start w-full">
              <Eyebrow label="[01 // THE PURPOSE]" dark className="w-full" />
              <div className="font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-[#FFFFFF] w-full">
                <div className="mb-[24px]">
                  <h2>Stop spending days building your portfolio website from scratch.</h2>
                </div>
                <div className="text-[#CCC0B5] italic">
                  <p>Upload your resume, and turn your experience into a structured, professional portfolio that proves your capabilities.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SECTION 3: ABOUT & MOTIVE (#about) */}
        <section
          id="about"
          className="relative min-h-[800px] max-md:min-h-[1024px] max-sm:min-h-[812px] w-full flex flex-col items-start justify-center max-md:justify-end px-[40px] max-sm:px-[20px] py-[140px] max-md:pb-[60px] max-w-[1440px] mx-auto"
        >
          <GhostNumeral numeral="02" className="text-[220px] max-lg:text-[160px] max-sm:text-[110px] top-10 left-[24px]" />
          <div className="flex flex-col gap-[48px] items-start w-[640px] max-md:w-full">
            <Reveal>
              <Eyebrow label="[02 // BUILT FOR STUDENTS & ASPIRING TALENT]" className="w-full" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] tracking-[-0.03em] text-[#0A0402]">
                <div>
                  <h2>Your resume turned into a website.</h2>
                </div>
                <div className="text-[#56241A] italic mt-3">
                  <p>Structured, verified, and shareable.</p>
                </div>
              </div>
            </Reveal>

            <div className="max-md:flex max-md:flex-row max-md:gap-[30px] max-sm:flex-col max-sm:gap-[24px]">
              <Reveal delay={0.14} className="font-mono text-[13px] leading-[1.6] uppercase text-[#0A0402] max-md:flex-1">
                <p className="mb-[16px]">
                  DevCanvas is a resume-to-portfolio builder created for college students, fresh graduates, and aspiring professionals who want to showcase their skills online without building from zero.
                </p>
                <p className="text-[#3E1510]/80">
                  Simply provide your resume. Our platform parses your details, structures your education, experience, and projects, and helps you launch an impactful personal portfolio website.
                </p>
              </Reveal>

              {/* Bullet Marker & List */}
              <Reveal delay={0.2} className="pl-[60px] max-md:pl-0 max-md:flex-1 max-sm:pl-0 max-sm:flex-none mt-[32px] max-md:mt-0 border-l border-[#CCC0B5]">
                <ul className="font-mono text-[12px] leading-[1.6] uppercase text-[#3E1510] space-y-3">
                  {BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-[5px] w-[7px] h-[7px] rotate-45 bg-[#7C3F2F]/70 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
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
              <div className="flex flex-col gap-[24px] w-[725px] max-lg:w-[517px] max-md:w-full shrink-0">
                <Reveal delay={0.08}>
                  <h2 className="font-serif text-[clamp(2rem,3.5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-[#FFFFFF]">
                    Stand out to recruiters with a portfolio that highlights what matters.
                  </h2>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="text-[#CCC0B5] text-2xl max-sm:text-xl font-normal font-sans">
                    Turn raw resume bullets into clear, structured sections that showcase your true potential.
                  </p>
                </Reveal>
              </div>
            </div>

            {/* 3 Columns in 🤎 Very Dark Brown (#270F05) */}
            <div className="flex gap-[32px] max-md:flex-col">
              {COLUMNS.map((col, i) => (
                <Reveal key={col.title} delay={i * 0.1} className="flex-1">
                  <div className="h-full bg-[#270F05] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[32px] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7C3F2F]/60 hover:shadow-2xl">
                    <div className="flex flex-wrap justify-between gap-x-4 font-mono text-[12px] leading-[1.2] uppercase text-[#CCC0B5] border-b border-[#3E1510] pb-3">
                      <span className="text-[#A0674F] font-semibold">{col.index}</span>
                      <span className="text-[#7C3F2F] font-bold">{col.tag}</span>
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <h3 className="font-serif text-[40px] max-lg:text-[32px] leading-none tracking-[-1.2px] text-[#FFFFFF]">
                        {col.title}
                      </h3>
                      <div className="flex flex-col gap-[12px] font-mono text-[12px] leading-[1.5] uppercase text-[#EEEBE7]/80">
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
          <div className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] tracking-[-0.02em] text-[#0A0402] flex-1 max-w-5xl">
            <Reveal>
              <div className="font-mono text-[14px] text-[#56241A] font-bold uppercase tracking-widest mb-8">
                [05 // OUR PHILOSOPHY]
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="mb-[28px]">
                <h2>Your portfolio should reflect the hard work<br />you put into your projects and education.</h2>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mb-[28px] text-[#7C3F2F]">
                <p>No tedious boilerplate setup.<br />No building everything from scratch.</p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="text-[#56241A] font-semibold">
                <p>Just a clear, structured website that lets your achievements speak for themselves.</p>
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
                <div className="font-mono text-[12px] uppercase text-[#A0674F] tracking-widest font-medium">
                  RESUME-TO-PORTFOLIO BUILDER // STUDENTS &amp; DEVELOPERS
                </div>
              </div>
            </Reveal>

            {/* Right Interactive Gateway Card in 🟤 Dark Chocolate Brown (#34281D) */}
            <Reveal delay={0.1} className="w-[723px] max-lg:w-[517px] max-md:w-full">
              <div className="bg-[#34281D] border border-[#3E1510] p-10 rounded-xs flex flex-col gap-[40px] max-sm:gap-[24px] w-full shadow-2xl">
                <div>
                  <h2 className="font-serif font-medium text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.79] tracking-[-0.04em] text-[#FFFFFF] break-words">
                    DevCanvas
                  </h2>
                </div>

                <div className="flex flex-col gap-[24px] w-[585px] max-lg:w-full">
                  <div className="font-mono text-[12px] leading-[1.4] uppercase text-[#EEEBE7]">
                    <p className="mb-[12px]">
                      Turn your resume into a professional portfolio website in minutes. Extract your skills, projects, and education into a clean, shareable showcase.
                    </p>
                    <p className="text-[#A0674F] font-semibold">
                      Start building your portfolio today:
                    </p>
                  </div>

                  {/* Earthy Burgundy Action Button */}
                  <button
                    onClick={onEnterMainSite}
                    className="relative overflow-hidden inline-flex items-center gap-[8px] h-[52px] px-8 bg-[#56241A] hover:bg-[#7C3F2F] hover:shadow-xl hover:-translate-y-px active:translate-y-0 text-[#FFFFFF] border border-[#3E1510] font-mono font-bold text-[13px] uppercase tracking-[0.2em] transition-all duration-300 group self-start cursor-pointer rounded-xs shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0674F]"
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
          <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between font-mono text-[12px] tracking-[-0.36px] uppercase leading-[1.2] text-[#CCC0B5]/70 max-md:mt-[100px] max-sm:mt-[80px] border-t border-[#3E1510] pt-6">
            <p>© 2026 DevCanvas. All rights reserved.</p>
            <p>Designed for students, fresh graduates, and aspiring professionals</p>
          </div>
        </footer>
      </div>
      </main>
    </div>
  );
}
