'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSceneScroll } from '@/components/landing/useSceneScroll';
import { ArrowRight } from 'lucide-react';
import { baseProjects, skills } from '@/components/identity/identityData';

/**
 * 8-Stage Narrative Progression: "From a line to a button."
 *
 * 01: The Beginning (coordinates, central reticle, empty canvas — 0% - 10%)
 * 02: A Grid (frame appears, horizontal guides, 12 columns cascade left-to-right — 10% - 24%)
 * 03: Navigation & Foundation (horizontal guides removed, navbar takes position — 24% - 35%)
 * 04: Editorial Headline (vertical bars gently recede, clean typography appears — 35% - 48%)
 * 05: Identity & Skills (skill chips & action buttons assemble — 48% - 62%)
 * 06: Verified Profile & Projects (identity card & project showcases lock into place — 62% - 74%)
 * 07: The Compression (portfolio collapses into the "Start a project" button — 74% - 80%)
 * 08: The Climax (Button · 190 × 52 centered, oversized "Go on, click me.", 100% complete — 80% - 86%)
 */
const STAGES = [
  {
    num: '01',
    title: 'The beginning.',
    sub: 'From a line to a button.',
    desc: 'A blank canvas establishes coordinates, orientation and boundaries.',
  },
  {
    num: '02',
    title: 'A grid.',
    sub: 'Layout boundaries established.',
    desc: 'Columns cascade from left to right, calculating layout rhythm.',
  },
  {
    num: '03',
    title: 'Structure.',
    sub: 'Navigation & framework.',
    desc: 'The browser chassis and top navigation take their positions.',
  },
  {
    num: '04',
    title: 'Type takes shape.',
    sub: 'Precision editorial hierarchy.',
    desc: 'Clean typography scales and aligns to the baseline.',
  },
  {
    num: '05',
    title: 'Identity & skills.',
    sub: 'Interactive action & stack.',
    desc: 'Technical proficiencies and action buttons assemble.',
  },
  {
    num: '06',
    title: 'The complete portfolio.',
    sub: 'Engineering products with clarity.',
    desc: 'Verified identity card and project showcases lock into place.',
  },
  {
    num: '07',
    title: 'Compressing to an action.',
    sub: 'From a line to a button.',
    desc: 'The entire interface collapses down into the primary interactive element.',
  },
  {
    num: '08',
    title: 'From a line to a button.',
    sub: 'Go on, click me.',
    desc: 'The complete transformation concludes with your primary interactive action.',
  },
] as const;

/* Portfolio identity — Clean sample persona */
const PORTFOLIO = {
  name: 'Alex Rivera',
  initials: 'AR',
  role: 'Systems & Interface Architect',
  location: 'San Francisco, CA',
  experience: 'Senior Systems Engineer',
  company: 'Vanguard Systems',
  tagline: 'React · Next.js · TypeScript — building fast, thoughtful products.',
  headline: 'Engineering products\nwith clarity & craft.',
} as const;

export default function PortfolioConstructionScene() {
  const { user } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  const progress = useSceneScroll(sectionRef, ['start start', 'end end']);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState('000');

  useMotionValueEvent(progress, 'change', (v) => {
    // Build progress reaches 100% when the centered button & "Go on, click me." appear fully (at 0.80 scroll)
    const pct = Math.min(Math.max(Math.round((v / 0.80) * 100), 0), 100);
    setProgressPercent(pct.toString().padStart(3, '0'));

    let idx = 0;
    if (v >= 0.80) idx = 7;
    else if (v >= 0.73) idx = 6;
    else if (v >= 0.62) idx = 5;
    else if (v >= 0.48) idx = 4;
    else if (v >= 0.35) idx = 3;
    else if (v >= 0.24) idx = 2;
    else if (v >= 0.10) idx = 1;
    else idx = 0;

    if (idx !== activeStageIndex) {
      setActiveStageIndex(idx);
    }
  });

  const activeStage = STAGES[activeStageIndex];

  /* ── 1. Initial Canvas Markings & Reticles (0.00 -> 0.22) ── */
  const initialCanvasMarkings = useTransform(progress, [0.00, 0.05, 0.22, 0.26], [1, 1, 1, 0]);

  /* ── 2. Browser Frame & Top Bar: NOT present from start, appears at 5-10% build progress (0.07 -> 0.13) ── */
  const browserFrameEnterOpacity = useTransform(progress, [0.06, 0.12], [0, 1]);
  const browserFrameEnterScale = useTransform(progress, [0.06, 0.12], reduce ? [1, 1] : [0.96, 1]);

  /* ── 3. Caliper 1080x675 & Circle r=118 ── */
  const calipersOpacity = useTransform(progress, [0.07, 0.12, 0.22, 0.26], [0, 1, 1, 0]);

  /* ── 4. 12-Column Grid: Cascading Left to Right (0.10 -> 0.22) ── */
  const col0 = useTransform(progress, [0.095, 0.115], [0, 1]);
  const col1 = useTransform(progress, [0.105, 0.125], [0, 1]);
  const col2 = useTransform(progress, [0.115, 0.135], [0, 1]);
  const col3 = useTransform(progress, [0.125, 0.145], [0, 1]);
  const col4 = useTransform(progress, [0.135, 0.155], [0, 1]);
  const col5 = useTransform(progress, [0.145, 0.165], [0, 1]);
  const col6 = useTransform(progress, [0.155, 0.175], [0, 1]);
  const col7 = useTransform(progress, [0.165, 0.185], [0, 1]);
  const col8 = useTransform(progress, [0.175, 0.195], [0, 1]);
  const col9 = useTransform(progress, [0.185, 0.205], [0, 1]);
  const col10 = useTransform(progress, [0.195, 0.215], [0, 1]);
  const col11 = useTransform(progress, [0.205, 0.225], [0, 1]);
  const colScales = [col0, col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11];

  /* ── 5. Horizontal Red Lines: REMOVE immediately after all vertical bars appear (0.22 -> 0.25) ── */
  const horizontalGuidesOpacity = useTransform(progress, [0.07, 0.12, 0.22, 0.25], [0, 1, 1, 0]);

  /* ── 6. Vertical Red Bars: Stay for some scrolling, then remove slowly (0.32 -> 0.38) ── */
  const columnsContainerOpacity = useTransform(progress, [0.09, 0.13, 0.32, 0.38], [0, 0.85, 0.85, 0]);

  /* ── 7. Progressive Component-by-Component Assembly (Building one by one!) ── */
  // Step A: Top Navigation Bar (0.24 -> 0.30)
  const navOpacity = useTransform(progress, [0.24, 0.30], [0, 1]);
  const navY = useTransform(progress, [0.24, 0.30], reduce ? [0, 0] : [-12, 0]);

  // Step B: Available Badge, Clean Headline & Subtitle (0.33 -> 0.40)
  const headlineOpacity = useTransform(progress, [0.33, 0.40], [0, 1]);
  const headlineY = useTransform(progress, [0.33, 0.40], reduce ? [0, 0] : [14, 0]);

  // Step C: Skill Chips & Action Buttons (0.43 -> 0.50)
  const skillsOpacity = useTransform(progress, [0.43, 0.50], [0, 1]);
  const skillsY = useTransform(progress, [0.43, 0.50], reduce ? [0, 0] : [10, 0]);

  // Step D: Developer Identity Card (Right Column) (0.52 -> 0.60)
  const identityCardOpacity = useTransform(progress, [0.52, 0.60], [0, 1]);
  const identityCardX = useTransform(progress, [0.52, 0.60], reduce ? [0, 0] : [16, 0]);

  // Step E: Bottom Project Showcase Cards (0.61 -> 0.69)
  const projectsOpacity = useTransform(progress, [0.61, 0.69], [0, 1]);
  const projectsY = useTransform(progress, [0.61, 0.69], reduce ? [0, 0] : [14, 0]);

  /* ── 8. COMPRESSION INTO THE BUTTON (0.72 -> 0.77) ── */
  // All dashboard content collapses/fades down into the "Start a project" button
  const contentCollapseOpacity = useTransform(progress, [0.72, 0.76], [1, 0]);
  const contentCollapseScale = useTransform(progress, [0.72, 0.77], reduce ? [1, 1] : [1, 0.2]);

  // The browser chassis frame also shrinks down around the button's position and fades
  const browserFrameCompressScale = useTransform(progress, [0.72, 0.78], reduce ? [1, 1] : [1, 0.12]);
  const browserFrameCompressOpacity = useTransform(progress, [0.75, 0.78], [1, 0]);

  /* ── 9. THE BUTTON GLIDES TO CENTER & ENLARGES (0.75 -> 0.80) ── */
  // Standalone centered button container becomes active as the dashboard finishes compression
  const standaloneButtonOpacity = useTransform(progress, [0.74, 0.76], [0, 1]);
  const buttonX = useTransform(progress, [0.75, 0.80], reduce ? ['0%', '0%'] : ['-24%', '0%']);
  const buttonY = useTransform(progress, [0.75, 0.80], reduce ? ['0%', '0%'] : ['14%', '0%']);
  const buttonScale = useTransform(progress, [0.75, 0.80], reduce ? [1, 1] : [0.95, 1.25]);

  /* ── 10. Climax Annotations: Red Box, Coordinates, "Go on, click me." (0.795 -> 0.815) ── */
  const buttonAnnotationOpacity = useTransform(progress, [0.795, 0.815], [0, 1]);

  // Smooth release for handoff to Chapter 03
  const sceneOutOpacity = useTransform(progress, [0.86, 0.92], [1, 0.15]);

  const handleSkip = () => {
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleActionClick = () => {
    router.push(user ? '/dashboard' : '/signin');
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative h-[380vh] lg:h-[440vh] bg-[#F4F4F2] select-none overflow-clip"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between p-4 sm:p-7 lg:p-10 z-10">

        {/* ── Background: Technical dot grid on soft porcelain ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: 'radial-gradient(rgba(41, 44, 48, 0.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* ── HUD: Top Bar ── */}
        <div className="relative z-30 flex items-start justify-between w-full pointer-events-none">
          {/* Top-Left: The build label + changing sub-heading */}
          <div className="space-y-1">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#777C82]">
              The build
            </p>
            <p className="font-mono text-[12px] sm:text-[13.5px] font-medium text-[#292C30] transition-all duration-300">
              {activeStage.sub}
            </p>
          </div>

          {/* Top-Right: Build Progress Counter (reaches 100% when centered button climax appears) */}
          <div className="text-right space-y-0.5 pr-6 sm:pr-8 lg:pr-10">
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#777C82]">
              Build progress
            </p>
            <p
              className="font-mono font-light text-[38px] sm:text-[54px] lg:text-[68px] leading-none tracking-tight text-[#292C30]/20 sm:text-[#292C30]/25 transition-all"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {progressPercent}%
            </p>
          </div>
        </div>

        {/* ── Centerpiece Stage: Progressive Assembly, Compression & Climax ── */}
        <motion.div
          style={{ opacity: sceneOutOpacity }}
          className="relative z-20 flex-1 flex items-center justify-center my-auto w-full"
        >
          <div className="relative w-full max-w-[1040px] aspect-[16/10] max-h-[66vh] flex items-center justify-center">

            {/* ── Initial Canvas Reticle (Present at Stage 01 when canvas is empty) ── */}
            <motion.div
              style={{ opacity: initialCanvasMarkings }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center z-10"
              aria-hidden="true"
            >
              <div className="w-8 h-8 rounded-full border border-[#EF4444]/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              </div>
              <div className="absolute font-mono text-[9.5px] text-[#777C82] tracking-wider translate-y-7">
                canvas · initialized
              </div>
            </motion.div>

            {/* ── Caliper 1080 × 675 (Top) & Coordinates ── */}
            <motion.div
              style={{ opacity: calipersOpacity }}
              className="pointer-events-none absolute inset-0 z-30"
              aria-hidden="true"
            >
              {/* Corner crosshairs with real coordinate markers */}
              <div className="absolute -top-3 left-0 font-mono text-[9px] text-[#777C82] flex items-center gap-1">
                <span className="text-[#292C30] font-bold">+</span> x 420 · y 121
              </div>
              <div className="absolute -top-3 right-0 font-mono text-[9px] text-[#777C82] flex items-center gap-1">
                x 1500 · y 121 <span className="text-[#292C30] font-bold">+</span>
              </div>
              <div className="absolute -bottom-3 left-0 font-mono text-[9px] text-[#777C82] flex items-center gap-1">
                <span className="text-[#292C30] font-bold">+</span> x 420 · y 796
              </div>
              <div className="absolute -bottom-3 right-0 font-mono text-[9px] text-[#777C82] flex items-center gap-1">
                x 1500 · y 796 <span className="text-[#292C30] font-bold">+</span>
              </div>

              {/* Top Caliper: ├─── 1080 × 675 ───┤ */}
              <div className="absolute -top-6 inset-x-0 flex items-center justify-between text-[#EF4444]">
                <span className="h-2 w-px bg-[#EF4444]" />
                <div className="flex-1 flex items-center mx-1">
                  <span className="flex-1 h-px bg-[#EF4444]/50" />
                  <span className="font-mono text-[9.5px] px-2 tracking-wider">
                    1080 × 675
                  </span>
                  <span className="flex-1 h-px bg-[#EF4444]/50" />
                </div>
                <span className="h-2 w-px bg-[#EF4444]" />
              </div>

              {/* Circular dimension marker: r = 118 with red center dot */}
              <div className="absolute left-[18%] bottom-[12%] w-24 h-24 rounded-full border border-[#EF4444]/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                <span className="absolute left-[105%] top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#EF4444] whitespace-nowrap pl-1">
                  r = 118
                </span>
              </div>

              {/* Focal Target Reticle ⊙ */}
              <div className="absolute right-[24%] top-[45%] -translate-y-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-[#EF4444] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#EF4444]" />
                </div>
              </div>
            </motion.div>

            {/* ── The Portfolio Browser Frame ── */}
            {/* NOT present from starting — enters at 5-10% build progress! */}
            {/* Later compresses toward bottom-left button origin (18% X, 82% Y) */}
            <motion.div
              style={{
                opacity: browserFrameEnterOpacity,
                scale: browserFrameEnterScale,
              }}
              className="relative w-full h-full flex flex-col"
            >
              <motion.div
                style={{
                  opacity: browserFrameCompressOpacity,
                  scale: browserFrameCompressScale,
                  transformOrigin: '18% 82%',
                }}
                className="relative w-full h-full rounded-2xl border border-[rgba(41,44,48,0.25)] bg-[#FAF9F6] shadow-xl overflow-hidden flex flex-col"
              >
                {/* Browser Header Bar */}
                <div className="h-8 sm:h-9 px-4 sm:px-5 flex items-center justify-between border-b border-[rgba(41,44,48,0.14)] bg-[#FAF9F6] shrink-0">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#AEB3B9]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#AEB3B9]/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#AEB3B9]/40" />
                  </div>

                  {/* Single Domain Pill */}
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[rgba(244,244,242,0.95)] border border-[rgba(213,214,216,0.8)] text-[10px] font-mono text-[#5A5F66]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>dev-canvas-ia.vercel.app/portfolio</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8.5px] text-[#777C82] px-1 py-0.5 rounded bg-black/5 hidden sm:block">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Browser Viewport Body */}
                <div className="relative flex-1 p-5 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden">

                  {/* ── STRICTLY BOUNDED Horizontal Red Guide Lines ── */}
                  {/* REMOVED immediately after all vertical bars finish appearing! */}
                  <motion.div
                    style={{ opacity: horizontalGuidesOpacity }}
                    className="pointer-events-none absolute inset-0 z-30"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-x-0 top-[12%] h-px bg-[#EF4444]/45" />
                    <div className="absolute inset-x-0 top-[30%] h-px bg-[#EF4444]/45" />
                    <div className="absolute inset-x-0 top-[60%] h-px bg-[#EF4444]/45" />
                    <div className="absolute inset-x-0 bottom-[16%] h-px bg-[#EF4444]/45" />
                    <div className="absolute inset-y-0 left-[50%] w-px border-l border-dashed border-[#EF4444]/60" />
                  </motion.div>

                  {/* ── 12-Column Grid: Staggered from Left to Right ── */}
                  {/* Stays for some scrolling, then removed slowly */}
                  <motion.div
                    style={{ opacity: columnsContainerOpacity }}
                    className="pointer-events-none absolute inset-x-5 sm:inset-x-8 lg:inset-x-10 inset-y-0 z-20 grid grid-cols-12 gap-2 sm:gap-3"
                    aria-hidden="true"
                  >
                    {colScales.map((scale, i) => (
                      <motion.div
                        key={i}
                        style={{
                          scaleY: scale,
                          transformOrigin: 'top center',
                        }}
                        className="h-full rounded-xs bg-[#EF4444]/[0.06] border-x border-[#EF4444]/15"
                      />
                    ))}
                  </motion.div>

                  {/* ── Progressive Portfolio Assembly: Building One by One ── */}
                  <motion.div
                    style={{
                      opacity: contentCollapseOpacity,
                      scale: contentCollapseScale,
                      transformOrigin: '18% 82%',
                    }}
                    className="relative z-10 flex-1 flex flex-col justify-between"
                  >
                    {/* Component 1: Top Navigation Bar */}
                    <motion.header
                      style={{
                        opacity: navOpacity,
                        y: navY,
                      }}
                      className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[rgba(213,214,216,0.6)]"
                    >
                      <div className="flex items-center gap-2">
                        {/* AR Initials Badge */}
                        <div className="w-7 h-7 rounded-md bg-[#292C30] text-white text-[10px] font-bold flex items-center justify-center">
                          {PORTFOLIO.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] sm:text-[13px] font-semibold text-[#111315] leading-tight">
                            {PORTFOLIO.name}
                          </span>
                          <span className="text-[9px] text-[#777C82] font-mono uppercase tracking-wider leading-tight">
                            {PORTFOLIO.role}
                          </span>
                        </div>
                      </div>

                      <nav className="flex items-center gap-2">
                        {['Work', 'Experience', 'Stack', 'Contact'].map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 text-[11.5px] font-medium text-[#4A4E54] rounded-full border border-transparent hover:border-[#D5D6D8] hover:bg-white/70 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </nav>
                    </motion.header>

                    {/* Main Hero Section: Left Hero + Right Identity Card */}
                    <div className="grid grid-cols-12 gap-6 my-auto items-center py-3">
                      {/* Left Column: Headline, Skills, Buttons */}
                      <div className="col-span-12 sm:col-span-7 space-y-3 sm:space-y-4">

                        {/* Component 2: Available Tag & Clean Headline & Subtitle */}
                        <motion.div
                          style={{
                            opacity: headlineOpacity,
                            y: headlineY,
                          }}
                          className="space-y-3 sm:space-y-3.5"
                        >
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(213,214,216,0.8)] bg-white/60 text-[10px] font-mono uppercase tracking-widest text-[#4A4E54]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Available for roles
                          </div>

                          {/* CLEAN HEADLINE (Red bounding rectangle completely removed) */}
                          <h1 className="text-[28px] sm:text-[38px] lg:text-[44px] font-bold text-[#111315] leading-[1.08] tracking-[-0.03em]">
                            Engineering products
                            <br />
                            with clarity & craft.
                          </h1>

                          <p className="text-[12px] sm:text-[13.5px] text-[#60656D] leading-relaxed max-w-[420px]">
                            {PORTFOLIO.tagline}
                          </p>
                        </motion.div>

                        {/* Component 3: Skill Chips & Action Buttons */}
                        <motion.div
                          style={{
                            opacity: skillsOpacity,
                            y: skillsY,
                          }}
                          className="space-y-3 pt-1"
                        >
                          {/* Skill Chips */}
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#4A4E54] border border-[#D5D6D8] bg-white/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Button Group (Contains in-place "Start a project" button) */}
                          <div className="pt-1">
                            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl border border-[rgba(41,44,48,0.2)] bg-white/40">
                              <button
                                onClick={handleActionClick}
                                className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#111315] hover:bg-black text-white text-[12px] sm:text-[13px] font-medium tracking-wide shadow-xs transition-transform active:scale-98 cursor-pointer"
                              >
                                <span>Start a project</span>
                                <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[11px] font-bold">
                                  ↗
                                </span>
                              </button>
                              <button
                                onClick={handleSkip}
                                className="px-3.5 sm:px-4 py-2 rounded-full text-[12px] font-medium text-[#4A4E54] hover:text-[#111315] hover:bg-white transition-colors cursor-pointer"
                              >
                                Resume PDF
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Component 4: Right Column Identity Card */}
                      <motion.div
                        style={{
                          opacity: identityCardOpacity,
                          x: identityCardX,
                        }}
                        className="col-span-12 sm:col-span-5"
                      >
                        <div className="rounded-xl border border-[#D5D6D8] bg-white/70 p-5 space-y-4 shadow-2xs">
                          {/* Top: Avatar + Name + Location */}
                          <div className="flex items-start gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#E3E4E2] shrink-0">
                              <Image
                                src="/avatar_kasey.png"
                                alt={PORTFOLIO.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#111315] leading-tight">
                                {PORTFOLIO.name}
                              </p>
                              <p className="text-[11px] text-[#777C82] leading-snug">
                                {PORTFOLIO.location}
                              </p>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-[#777C82] mt-1.5" />
                          </div>

                          <div className="h-px bg-[#E3E4E2]" />

                          {/* Experience & Company */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-[#777C82]">Experience</span>
                              <span className="text-[11px] font-semibold text-[#111315]">
                                {PORTFOLIO.experience}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-[#777C82]">Company</span>
                              <span className="text-[11px] font-semibold text-[#111315]">
                                {PORTFOLIO.company}
                              </span>
                            </div>
                          </div>

                          <div className="h-px bg-[#E3E4E2]" />

                          {/* Verified */}
                          <div className="flex items-center gap-1.5 text-[10px] text-[#777C82]">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Verified by DevCanvas Career Engine</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Component 5: Bottom Project Showcase Cards */}
                    <motion.div
                      style={{
                        opacity: projectsOpacity,
                        y: projectsY,
                      }}
                      className="flex gap-4"
                    >
                      {baseProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#D5D6D8] bg-white/50"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#E3E4E2] shrink-0">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#111315] truncate">
                              {project.title}
                            </p>
                            <p className="text-[10px] text-[#777C82] truncate">
                              {project.subtitle}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#AEB3B9]">↗</span>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>

                </div>
              </motion.div>
            </motion.div>

            {/* ── STAGE 7 & 8: THE BUTTON GLIDE & CLIMAX (100% BUILD COMPLETE) ── */}
            <motion.div
              style={{
                opacity: standaloneButtonOpacity,
                x: buttonX,
                y: buttonY,
                scale: buttonScale,
              }}
              className="absolute z-50 flex items-center justify-center pointer-events-auto"
            >
              <div className="relative flex flex-col items-center">

                {/* Technical Alignment Crosshairs (snaps on when button reaches center) */}
                <motion.div
                  style={{ opacity: buttonAnnotationOpacity }}
                  className="pointer-events-none absolute inset-0 -inset-x-[35vw] -inset-y-[20vh] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="absolute inset-x-0 h-px bg-[#777C82]/20" />
                  <div className="absolute inset-y-0 w-px bg-[#777C82]/20" />
                </motion.div>

                {/* Red Bounding Box with Corner Anchor Handles (Button · 190 × 52) */}
                <motion.div
                  style={{ opacity: buttonAnnotationOpacity }}
                  className="pointer-events-none absolute -inset-3.5 sm:-inset-4 border border-[#EF4444] rounded-xs"
                  aria-hidden="true"
                >
                  <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#EF4444]" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#EF4444]" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#EF4444]" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#EF4444]" />

                  <span className="absolute left-0 -bottom-5 font-mono text-[10px] text-[#EF4444] tracking-wider whitespace-nowrap">
                    Button · 190 × 52
                  </span>
                </motion.div>

                {/* Target Reticle ⊙ below button */}
                <motion.div
                  style={{ opacity: buttonAnnotationOpacity }}
                  className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-4 h-4 rounded-full border border-[#EF4444] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#EF4444]" />
                  </div>
                </motion.div>

                {/* The "Start a project ↗" Button */}
                <button
                  onClick={handleActionClick}
                  className="group relative z-20 inline-flex items-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#111315] hover:bg-black text-white text-[15px] sm:text-[17px] font-semibold tracking-wide shadow-2xl transition-all hover:scale-105 active:scale-98 cursor-pointer"
                >
                  <span>Start a project</span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[13px] sm:text-[14px] font-bold group-hover:rotate-45 transition-transform duration-200">
                    ↗
                  </span>
                </button>

                {/* OVERSIZED "Go on, click me." annotation */}
                <motion.div
                  style={{ opacity: buttonAnnotationOpacity }}
                  className="pointer-events-none absolute -top-22 sm:-top-26 left-[88%] sm:left-[96%] w-72 sm:w-84 flex flex-col items-start z-30"
                  aria-hidden="true"
                >
                  <p
                    className="text-[#EF4444] text-[32px] sm:text-[44px] lg:text-[50px] italic font-serif leading-none tracking-tight whitespace-nowrap pl-5 sm:pl-7 select-none"
                    style={{
                      fontFamily: "'Caveat', 'Nanum Pen Script', 'Brush Script MT', 'Bradley Hand', cursive, Georgia, serif",
                      textShadow: '0 0 1px rgba(239, 68, 68, 0.4)',
                    }}
                  >
                    Go on, click me.
                  </p>
                  <svg className="w-24 h-16 sm:w-28 sm:h-20 text-[#EF4444] -mt-1 ml-2" viewBox="0 0 80 50" fill="none">
                    <path
                      d="M 58 4 C 44 20, 24 30, 8 36"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 8 36 L 18 28 M 8 36 L 19 40"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* ── HUD: Bottom Bar ── */}
        <div className="relative z-30 flex items-end justify-between w-full">
          {/* Bottom-Left: Stage Counter & Name */}
          <div className="space-y-1 max-w-[420px]">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-[#EF4444] font-bold">{activeStage.num}</span>
              <span className="text-[#D5D6D8]">──</span>
              <span className="text-[#777C82]">08</span>
            </div>
            <h3 className="text-[20px] sm:text-[28px] font-bold text-[#292C30] leading-tight">
              {activeStage.title}
            </h3>
            <p className="text-[12px] sm:text-[13px] text-[#777C82] line-clamp-1 sm:line-clamp-none">
              {activeStage.desc}
            </p>
          </div>

          {/* Bottom-Right: Skip Control & Segmented Progress */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto pr-6 sm:pr-8 lg:pr-10">
            {/* 8 Segmented Progress Dots */}
            <div className="flex items-center gap-1.5">
              {STAGES.map((s, idx) => (
                <div
                  key={s.num}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeStageIndex
                      ? 'w-6 bg-[#EF4444]'
                      : idx < activeStageIndex
                      ? 'w-2 bg-[#292C30]/40'
                      : 'w-2 bg-[#292C30]/15'
                  }`}
                />
              ))}
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#D5D6D8] font-mono text-[10px] uppercase tracking-[0.16em] text-[#777C82] hover:text-[#292C30] hover:bg-white backdrop-blur-xs transition-colors cursor-pointer"
            >
              <span>Skip the build</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
