'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type PortfolioTab = 'projects' | 'skills' | 'experience' | 'achievements';
type ColorTheme = 'warm' | 'burgundy' | 'editorial';

interface TabData {
  id: PortfolioTab;
  index: string;
  label: string;
  headline: string;
  tagline: string;
  sourceLabel: string;
  extractedFrom: string;
}

const TABS: TabData[] = [
  {
    id: 'projects',
    index: '01',
    label: 'PROJECTS',
    headline: 'Transform raw bullet points into interactive case studies.',
    tagline: 'Your GitHub repositories and system diagrams reimagined as high-converting project showcases.',
    sourceLabel: 'RESUME SECTION: TECHNICAL PROJECTS',
    extractedFrom: 'Extracted from 4 project bullets in resume.pdf',
  },
  {
    id: 'skills',
    index: '02',
    label: 'SKILLS',
    headline: 'Turn comma-separated lists into an authoritative matrix.',
    tagline: 'Replace generic keyword lists with categorized architectures, real-world tools, and proven stacks.',
    sourceLabel: 'RESUME SECTION: CORE COMPETENCIES',
    extractedFrom: 'Extracted from 28 technical keywords across 3 roles',
  },
  {
    id: 'experience',
    index: '03',
    label: 'EXPERIENCE',
    headline: 'Elevate employment history into an executive career narrative.',
    tagline: 'Every promotion, company, and quantifiable impact mapped onto a structured editorial timeline.',
    sourceLabel: 'RESUME SECTION: PROFESSIONAL EXPERIENCE',
    extractedFrom: 'Extracted from 3 corporate roles & leadership milestones',
  },
  {
    id: 'achievements',
    index: '04',
    label: 'ACHIEVEMENTS',
    headline: 'Quantify your impact with verified credentials & metrics.',
    tagline: 'Awards, certifications, and open-source contributions presented as recruiter-ready proof points.',
    sourceLabel: 'RESUME SECTION: HONORS & CERTIFICATIONS',
    extractedFrom: 'Extracted from education honors, patents & hackathons',
  },
];

export default function InteractivePortfolioShowcase() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('projects');
  const [activeTheme, setActiveTheme] = useState<ColorTheme>('warm');
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  // Auto-cycle through tabs every 6 seconds when not hovered by user
  useEffect(() => {
    if (isHovered || reduceMotion) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TABS.findIndex((t) => t.id === prev);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex].id;
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [isHovered, reduceMotion]);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div
      className="w-full max-w-[880px] flex flex-col gap-8 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. TOP CONTROL BAR: CATEGORY TABS & LIVE THEME TOGGLE */}
      <div className="flex flex-col gap-4">
        {/* Eyebrow Status Bar */}
        <div className="flex items-center justify-between border-b border-[#3E1510]/20 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3F2F] animate-pulse" />
            <span className="font-mono text-caption uppercase text-[#7C3F2F] tracking-[0.2em] font-bold">
              PORTFOLIO ENGINE // RESUME-TO-WEB TRANSFORMATION
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#A0674F]">
            <span className="hidden sm:inline">PREVIEW STYLE:</span>
            <div className="flex items-center gap-1 bg-[#CCC0B5]/30 p-0.5 rounded-xs border border-[#3E1510]/15">
              <button
                onClick={() => setActiveTheme('warm')}
                className={`px-2 py-0.5 text-[10px] rounded-xs font-semibold transition-all cursor-pointer ${
                  activeTheme === 'warm'
                    ? 'bg-[#56241A] text-[#FFFFFF] shadow-xs'
                    : 'text-[#3E1510] hover:text-[#56241A]'
                }`}
              >
                WARM
              </button>
              <button
                onClick={() => setActiveTheme('burgundy')}
                className={`px-2 py-0.5 text-[10px] rounded-xs font-semibold transition-all cursor-pointer ${
                  activeTheme === 'burgundy'
                    ? 'bg-[#3E1510] text-[#FFFFFF] shadow-xs'
                    : 'text-[#3E1510] hover:text-[#56241A]'
                }`}
              >
                BURGUNDY
              </button>
              <button
                onClick={() => setActiveTheme('editorial')}
                className={`px-2 py-0.5 text-[10px] rounded-xs font-semibold transition-all cursor-pointer ${
                  activeTheme === 'editorial'
                    ? 'bg-[#270F05] text-[#FFFFFF] shadow-xs'
                    : 'text-[#3E1510] hover:text-[#56241A]'
                }`}
              >
                DARK
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 sm:px-4 py-2.5 rounded-xs font-mono text-caption uppercase tracking-wider text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#3E1510] text-[#FFFFFF] border-[#270F05] shadow-md'
                    : 'bg-[#EEEBE7]/80 text-[#56241A] border-[#3E1510]/20 hover:border-[#7C3F2F] hover:bg-[#CCC0B5]/40'
                }`}
                aria-label={`Showcase ${tab.label}`}
              >
                <div className="flex items-center justify-between">
                  <span className={isActive ? 'text-[#A0674F]' : 'text-[#7C3F2F]'}>
                    {tab.index}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="tabActiveIndicator"
                      className="w-1.5 h-1.5 rounded-full bg-[#A0674F]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </div>
                <div className="font-bold text-label mt-1 truncate">{tab.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC HEADLINE & EDITORIAL CONTEXT */}
      <div className="flex flex-col gap-2 min-h-[96px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#7C3F2F] font-semibold bg-[#7C3F2F]/10 px-2 py-0.5 rounded-xs border border-[#7C3F2F]/20">
                {currentTab.sourceLabel}
              </span>
              <span className="text-[#A0674F] font-mono text-[10px] hidden sm:inline">
                • {currentTab.extractedFrom}
              </span>
            </div>
            <h2 className="font-serif font-medium text-heading-xl text-[#0A0402] leading-[1.08]">
              {currentTab.headline}
            </h2>
            <p className="font-sans text-body-lg text-[#34281D]/85 max-w-[720px]">
              {currentTab.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. LAYERED PORTFOLIO SHOWCASE: MAIN BROWSER + OVERLAPPING TILES */}
      <div className="relative w-full pt-4 pb-8">
        
        {/* A. FLOATING CONVERSION BADGE (Top-Right Offset) */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [-3, 3, -3],
                }
          }
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-3 right-4 sm:right-10 z-30 bg-[#EEEBE7]/95 border border-[#3E1510]/30 shadow-xl px-3.5 py-1.5 rounded-xs backdrop-blur-md flex items-center gap-2 font-mono text-[10px] uppercase text-[#56241A] font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-[#7C3F2F] animate-ping" />
          <span>1-CLICK RESUME IMPORT</span>
          <span className="text-[#A0674F] border-l border-[#3E1510]/20 pl-2">100% RESPONSIVE</span>
        </motion.div>

        {/* B. PRIMARY DESKTOP BROWSER FRAME */}
        <motion.div
          layout
          className={`relative z-10 w-full rounded-xs border transition-colors duration-400 overflow-hidden shadow-2xl ${
            activeTheme === 'warm'
              ? 'bg-[#F9F7F4] border-[#3E1510]/30'
              : activeTheme === 'burgundy'
              ? 'bg-[#3E1510] border-[#270F05] text-[#FFFFFF]'
              : 'bg-[#18110D] border-[#34281D] text-[#FFFFFF]'
          }`}
        >
          {/* Browser Top Navigation Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#3E1510]/20 bg-[#EEEBE7]/50 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3F2F]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#A0674F]/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCC0B5]" />
            </div>

            {/* Address Bar Pill */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-xs bg-[#FFFFFF]/80 border border-[#3E1510]/15 font-mono text-[10px] text-[#56241A] font-medium shadow-2xs">
              <span className="text-[#7C3F2F]">🔒</span>
              <span>devcanvas.me/alexander-vance/{activeTab}</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[10px] uppercase text-[#7C3F2F] font-semibold">
              <span className="hidden sm:inline">LIVE SHOWCASE</span>
              <span className="text-button">↗</span>
            </div>
          </div>

          {/* Rendered Live Portfolio Mockup Content */}
          <div className="p-5 sm:p-7 min-h-[360px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeTab === 'projects' && (
                <motion.div
                  key="projects-view"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-5"
                >
                  {/* Portfolio Header Inside Browser */}
                  <div className="flex items-center justify-between border-b border-current/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                        ALEXANDER VANCE // SENIOR SYSTEMS ENGINEER
                      </span>
                      <h3 className="font-serif text-[24px] sm:text-[28px] font-medium leading-none mt-1">
                        Selected Technical Projects
                      </h3>
                    </div>
                    <div className="font-mono text-caption px-2.5 py-1 rounded-xs bg-[#56241A] text-[#FFFFFF] uppercase tracking-wider font-semibold">
                      3 OF 8 DEPLOYED
                    </div>
                  </div>

                  {/* Overlapping Interactive Project Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Project Card 1 */}
                    <div
                      className={`p-4 rounded-xs border transition-all duration-200 group hover:-translate-y-1 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15 shadow-sm hover:shadow-md'
                          : 'bg-[#270F05] border-[#3E1510] shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase mb-2">
                        <span className="text-[#A0674F] font-bold">01 // CLOUD RUNTIME</span>
                        <span className="text-[#7C3F2F] font-semibold">12.4K REQ/SEC</span>
                      </div>
                      <h4 className="font-serif text-[19px] font-semibold tracking-tight">
                        HyperScale Event Mesh
                      </h4>
                      <p className="text-[12px] opacity-80 mt-1 leading-relaxed">
                        Distributed stream orchestrator built with Rust &amp; eBPF. Reduced latency from 45ms to 1.8ms under 100K simulated concurrent clients.
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-current/10 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">RUST</span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">KUBERNETES</span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">EBPF</span>
                      </div>
                    </div>

                    {/* Project Card 2 */}
                    <div
                      className={`p-4 rounded-xs border transition-all duration-200 group hover:-translate-y-1 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15 shadow-sm hover:shadow-md'
                          : 'bg-[#270F05] border-[#3E1510] shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] uppercase mb-2">
                        <span className="text-[#A0674F] font-bold">02 // WEB PLATFORM</span>
                        <span className="text-[#7C3F2F] font-semibold">1-CLICK PARSER</span>
                      </div>
                      <h4 className="font-serif text-[19px] font-semibold tracking-tight">
                        Neural Document Extractor
                      </h4>
                      <p className="text-[12px] opacity-80 mt-1 leading-relaxed">
                        Client-side resume parser and live editorial renderer. Synthesizes PDFs into structured semantic schema with 99.4% accuracy.
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-current/10 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">TYPESCRIPT</span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">NEXT.JS</span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-[#7C3F2F]/15 font-semibold">TAILWIND</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills-view"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between border-b border-current/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                        PROVEN ARCHITECTURAL CAPABILITY
                      </span>
                      <h3 className="font-serif text-[24px] sm:text-[28px] font-medium leading-none mt-1">
                        Technical Proficiency Matrix
                      </h3>
                    </div>
                    <div className="font-mono text-caption px-2.5 py-1 rounded-xs bg-[#7C3F2F] text-[#FFFFFF] uppercase tracking-wider font-semibold">
                      28 STACKS VERIFIED
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Matrix Column 1 */}
                    <div
                      className={`p-3.5 rounded-xs border ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="font-mono text-[11px] font-bold text-[#A0674F] uppercase border-b border-current/10 pb-1.5 mb-2.5">
                        [CORE SYSTEMS]
                      </div>
                      <ul className="space-y-1.5 font-sans text-[12px]">
                        <li className="flex items-center justify-between font-medium">
                          <span>Rust / C++</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">95% PRO</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>Distributed Cons.</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">RAFT / PAXOS</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>eBPF &amp; Linux Net</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">KERNEL</span>
                        </li>
                      </ul>
                    </div>

                    {/* Matrix Column 2 */}
                    <div
                      className={`p-3.5 rounded-xs border ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="font-mono text-[11px] font-bold text-[#A0674F] uppercase border-b border-current/10 pb-1.5 mb-2.5">
                        [FRONTEND CRAFT]
                      </div>
                      <ul className="space-y-1.5 font-sans text-[12px]">
                        <li className="flex items-center justify-between font-medium">
                          <span>TypeScript &amp; React</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">STAFF LVL</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>Next.js Architecture</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">SSR/RSC</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>WebGL / Shaders</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">GLSL / 3D</span>
                        </li>
                      </ul>
                    </div>

                    {/* Matrix Column 3 */}
                    <div
                      className={`p-3.5 rounded-xs border ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="font-mono text-[11px] font-bold text-[#A0674F] uppercase border-b border-current/10 pb-1.5 mb-2.5">
                        [PLATFORM &amp; DATA]
                      </div>
                      <ul className="space-y-1.5 font-sans text-[12px]">
                        <li className="flex items-center justify-between font-medium">
                          <span>PostgreSQL &amp; Redis</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">OPTIMIZED</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>Docker &amp; K8s</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">MULTI-REGION</span>
                        </li>
                        <li className="flex items-center justify-between font-medium">
                          <span>CI/CD Automation</span>
                          <span className="font-mono text-[10px] text-[#7C3F2F]">ZERO DOWNTIME</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  key="experience-view"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-current/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                        CAREER PROGRESSION &amp; IMPACT
                      </span>
                      <h3 className="font-serif text-[24px] sm:text-[28px] font-medium leading-none mt-1">
                        Executive Timeline
                      </h3>
                    </div>
                    <div className="font-mono text-caption px-2.5 py-1 rounded-xs bg-[#56241A] text-[#FFFFFF] uppercase tracking-wider font-semibold">
                      5+ YRS EXPERIENCE
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Role 1 */}
                    <div
                      className={`p-3.5 rounded-xs border flex flex-col gap-1.5 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] flex-wrap gap-2">
                        <span className="font-bold text-[#56241A] dark:text-[#A0674F]">
                          STAFF SYSTEMS ARCHITECT // CLOUDMESH LABS
                        </span>
                        <span className="text-[#7C3F2F] font-semibold">2023 — PRESENT</span>
                      </div>
                      <p className="text-[12px] opacity-85 leading-snug">
                        Led platform engineering group of 14 devs. Overhauled event gateway servicing 4.2B daily RPCs, cutting compute overhead by 28% ($420k/yr).
                      </p>
                    </div>

                    {/* Role 2 */}
                    <div
                      className={`p-3.5 rounded-xs border flex flex-col gap-1.5 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] flex-wrap gap-2">
                        <span className="font-bold text-[#56241A] dark:text-[#A0674F]">
                          SOFTWARE ENGINEER II // DATAROUTE
                        </span>
                        <span className="text-[#7C3F2F] font-semibold">2021 — 2023</span>
                      </div>
                      <p className="text-[12px] opacity-85 leading-snug">
                        Engineered fault-tolerant pub/sub ingest broker. Designed zero-copy buffer serializer reducing P99 latency by 32ms.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements-view"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-current/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                        HONORS, AWARDS &amp; CREDENTIALS
                      </span>
                      <h3 className="font-serif text-[24px] sm:text-[28px] font-medium leading-none mt-1">
                        Quantified Impact
                      </h3>
                    </div>
                    <div className="font-mono text-caption px-2.5 py-1 rounded-xs bg-[#7C3F2F] text-[#FFFFFF] uppercase tracking-wider font-semibold">
                      VERIFIED PROOF
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div
                      className={`p-4 rounded-xs border flex flex-col gap-1 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="font-mono text-heading-lg font-bold text-[#7C3F2F]">
                        14,800+
                      </div>
                      <div className="font-serif text-[16px] font-semibold">
                        GitHub Open Source Stars
                      </div>
                      <p className="text-[12px] opacity-80 leading-snug mt-1">
                        Creator and lead maintainer of high-performance memory allocator library used in production by Fortune 500 teams.
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-xs border flex flex-col gap-1 ${
                        activeTheme === 'warm'
                          ? 'bg-[#FFFFFF] border-[#3E1510]/15'
                          : 'bg-[#270F05] border-[#3E1510]'
                      }`}
                    >
                      <div className="font-mono text-heading-lg font-bold text-[#56241A] dark:text-[#A0674F]">
                        1ST PLACE
                      </div>
                      <div className="font-serif text-[16px] font-semibold">
                        Global Hackathon Winner
                      </div>
                      <p className="text-[12px] opacity-80 leading-snug mt-1">
                        Won 1st out of 1,200 participants for autonomous agent framework with verified on-chain state verification.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Footer inside Mockup */}
            <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between font-mono text-[10px] opacity-75">
              <span>GENERATED VIA DEVCANVAS v2.4</span>
              <span>HTTPS://DEVCANVAS.ME/PREVIEW</span>
            </div>
          </div>
        </motion.div>

        {/* C. OVERLAPPING MOBILE DEVICE VIEWPORT (Layered Bottom-Right) */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [4, -4, 4],
                  rotate: [3, 2, 3],
                }
          }
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-6 -right-2 sm:-right-6 z-20 w-[180px] sm:w-[220px] rounded-sm border-2 border-[#3E1510] bg-[#EEEBE7] shadow-2xl p-2 hidden xs:flex flex-col gap-2 backdrop-blur-md"
        >
          {/* Mobile Notch & Speaker */}
          <div className="w-16 h-1.5 bg-[#3E1510]/40 rounded-full mx-auto" />

          {/* Mobile Screen Preview */}
          <div className="bg-[#FFFFFF] rounded-xs border border-[#3E1510]/15 p-2 flex flex-col gap-1.5 font-sans">
            <div className="flex items-center justify-between border-b border-[#3E1510]/10 pb-1">
              <span className="font-serif font-bold text-[11px] text-[#0A0402]">A. Vance</span>
              <span className="font-mono text-[8px] bg-[#56241A] text-[#FFFFFF] px-1 py-0.2 rounded-xs">
                {activeTab.toUpperCase()}
              </span>
            </div>
            <div className="text-[9px] text-[#34281D] font-medium leading-tight line-clamp-2">
              {currentTab.headline}
            </div>
            <div className="h-1 w-full bg-[#7C3F2F]/20 rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-[#7C3F2F]"
                animate={{ width: ['20%', '80%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="font-mono text-[8px] text-[#7C3F2F] font-bold text-center">
              MOBILE READY
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
