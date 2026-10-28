'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, FileText, Globe, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/OpeningExperience/Reveal';
import { MaskLine } from './KineticText';
import { EASE_OUT } from './motion';

type View = 'resume' | 'portfolio';

export default function TransformSection() {
  const [view, setView] = useState<View>('resume');
  const reduce = useReducedMotion();
  const isPortfolio = view === 'portfolio';

  return (
    <section
      id="transform"
      className="relative isolate w-full overflow-hidden bg-[#FAF7F3] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
    >
      <div aria-hidden="true" className="lc-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="max-w-[52rem]">
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A2F1F]">
              <span className="h-1.5 w-1.5 rotate-45 bg-[#6F4A34]" />
              [02 // THE TRANSFORM]
            </div>
          </Reveal>
          <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.0] tracking-[-0.03em] text-[#1E1611]">
            <MaskLine delay={0.04}>Same story.</MaskLine>
            <MaskLine delay={0.12}>
              <span className="lc-ink-gradient italic">Radically different</span>
            </MaskLine>
            <MaskLine delay={0.2}>first impression.</MaskLine>
          </h2>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-[38rem] font-sans text-[15px] leading-[1.7] text-[#3A2C22] sm:text-[16px]">
              A recruiter spends seconds on a resume. Give them the version where your
              work is legible, navigable, and impossible to skim past.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:mt-16 lg:grid-cols-[0.85fr_1.35fr] lg:gap-14">
          {/* Controls */}
          <div className="order-2 lg:order-1">
            <div
              role="group"
              aria-label="Preview format"
              className="inline-flex w-full max-w-[340px] rounded-full border border-[#3A2418]/15 bg-[#FBF9F6]/70 p-1.5 backdrop-blur-sm"
            >
              {([
                { id: 'resume' as View, label: 'The resume', icon: FileText },
                { id: 'portfolio' as View, label: 'The portfolio', icon: Globe },
              ]).map((option) => {
                const active = view === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setView(option.id)}
                    aria-pressed={active}
                    className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                      active ? 'text-[#FBF9F6]' : 'text-[#3A2C22] hover:text-[#4A2F1F]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="transform-toggle"
                        className="absolute inset-0 rounded-full bg-[#4A2F1F] shadow-[0_10px_24px_-14px_rgba(58,36,24,0.9)]"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                      />
                    )}
                    <option.icon size={12} strokeWidth={1.8} className="relative z-10" />
                    <span className="relative z-10">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-5">
              {[
                {
                  title: 'Structured, not scraped',
                  body: 'Sections are rebuilt as real components — not a screenshot of a PDF.',
                },
                {
                  title: 'Scannable in six seconds',
                  body: 'Projects, stacks, and impact get a hierarchy a recruiter can follow.',
                },
                {
                  title: 'One link, always current',
                  body: 'Update the source once and every shared link reflects the latest version.',
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={0.06 * index}>
                  <div className="group flex gap-4">
                    <span className="mt-1 font-mono text-[9px] font-bold tracking-[0.16em] text-[#B4552D]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-sans text-[14px] font-semibold text-[#1E1611]">
                        {item.title}
                      </p>
                      <p className="mt-1 max-w-[24rem] font-sans text-[13px] leading-[1.6] text-[#3A2C22]/80">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="order-1 lg:order-2">
            <motion.div
              animate={{ backgroundColor: isPortfolio ? '#231812' : '#E6DED6' }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[30px] border border-[#3A2418]/20 px-4 pb-20 pt-10 shadow-[0_50px_120px_-70px_rgba(58,36,24,0.85)] sm:min-h-[520px] sm:px-8"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                  isPortfolio ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background:
                    'radial-gradient(70% 60% at 50% 0%, rgba(180,85,45,0.32), transparent 70%)',
                }}
              />
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                  isPortfolio ? 'lc-grid-dark opacity-70' : 'lc-grid opacity-50'
                }`}
              />

              <AnimatePresence mode="wait" initial={false}>
                {view === 'resume' ? (
                  <motion.div
                    key="resume"
                    initial={reduce ? false : { opacity: 0, y: 26, rotate: -3, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotate: -1.2, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -22, rotate: 2, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="relative w-full max-w-[360px]"
                  >
                    <ResumeMock />
                  </motion.div>
                ) : (
                  <motion.div
                    key="portfolio"
                    initial={reduce ? false : { opacity: 0, y: 26, rotate: 3, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotate: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0, y: -22, rotate: -2, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="relative w-full max-w-[440px]"
                  >
                    <PortfolioMock />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating annotation */}
              <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center px-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={view}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.16em] backdrop-blur-sm ${
                      isPortfolio
                        ? 'border-[#FBF9F6]/20 bg-[#FBF9F6]/10 text-[#EBC4A6]'
                        : 'border-[#3A2418]/15 bg-[#FBF9F6]/70 text-[#4A2F1F]'
                    }`}
                  >
                    <Sparkles size={11} strokeWidth={1.6} />
                    {isPortfolio
                      ? 'Your work, in context — live and linkable'
                      : 'One page. Four hundred words. Six seconds.'}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="mt-4 flex items-center justify-between px-1">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#B4552D]">
                Figure 02 — {isPortfolio ? 'Rendered portfolio' : 'Source document'}
              </span>
              <button
                type="button"
                onClick={() => setView(isPortfolio ? 'resume' : 'portfolio')}
                className="group inline-flex cursor-pointer items-center gap-1.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[#4A2F1F] transition-colors hover:text-[#B4552D]"
              >
                Switch to {isPortfolio ? 'resume' : 'portfolio'}
                <ArrowRight
                  size={11}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumeMock() {
  return (
    <div className="relative rounded-[6px] border border-[#3A2418]/25 bg-[#FFFFFF] px-6 py-7 shadow-[0_30px_60px_-30px_rgba(58,36,24,0.6)]">
      <div className="flex items-start justify-between border-b border-[#3A2418]/15 pb-3">
        <div>
          <p className="font-serif text-[19px] leading-none text-[#1E1611]">Your Name</p>
          <p className="mt-1.5 font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#3A2C22]/55">
            you@mail.com · Bengaluru · github.com/you
          </p>
        </div>
        <span className="rounded-[3px] border border-[#3A2418]/20 px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.14em] text-[#4A2F1F]">
          PDF
        </span>
      </div>

      {[
        { heading: 'Experience', rows: [3, 2] },
        { heading: 'Projects', rows: [3] },
        { heading: 'Skills', rows: [2] },
      ].map((block) => (
        <div key={block.heading} className="mt-4">
          <p className="font-mono text-[6.5px] font-bold uppercase tracking-[0.2em] text-[#4A2F1F]">
            {block.heading}
          </p>
          <div className="mt-1.5 space-y-2">
            {block.rows.map((count, rowIndex) => (
              <div key={rowIndex}>
                <div className="flex items-center justify-between">
                  <span className="h-[4px] w-[38%] rounded-full bg-[#3A2418]/22" />
                  <span className="h-[4px] w-[16%] rounded-full bg-[#3A2418]/12" />
                </div>
                <div className="mt-1.5 space-y-1">
                  {Array.from({ length: count }).map((_, lineIndex) => (
                    <span
                      key={lineIndex}
                      className="block h-[3px] rounded-full bg-[#3A2418]/10"
                      style={{ width: `${94 - lineIndex * 11}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-5 flex items-center justify-between border-t border-[#3A2418]/12 pt-2.5 font-mono text-[6px] uppercase tracking-[0.14em] text-[#3A2C22]/40">
        <span>Your_Name_Resume.pdf</span>
        <span>Page 1 / 1</span>
      </div>
    </div>
  );
}

function PortfolioMock() {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#FBF9F6]/20 bg-[#1B120D] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-[#FBF9F6]/12 bg-[#33231A] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#B4552D]/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#EBC4A6]/50" />
        <span className="ml-2 flex-1 truncate rounded-full bg-[#1B120D] px-2.5 py-1 font-mono text-[7.5px] text-[#EBC4A6]">
          devcanvas.me/your-name
        </span>
        <span className="flex items-center gap-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#EBC4A6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#EBC4A6]" />
          Live
        </span>
      </div>

      <div className="relative p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_0%,rgba(180,85,45,0.28),transparent_70%)]"
        />
        <div className="relative">
          <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#EBC4A6]">
            Selected work // 2026
          </p>
          <p className="mt-2 font-serif text-[clamp(1.6rem,4vw,2rem)] leading-none text-[#FBF9F6]">
            Your Name
          </p>
          <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.16em] text-[#FBF9F6]/50">
            Full-stack developer
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Rust'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#FBF9F6]/18 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#FBF9F6]/70"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { name: 'HyperScale Event Mesh', meta: '12.4k req/sec' },
              { name: 'Neural Doc Parser', meta: '99.4% accuracy' },
            ].map((project) => (
              <div
                key={project.name}
                className="rounded-[10px] border border-[#FBF9F6]/12 bg-[#FBF9F6]/[0.04] p-2.5"
              >
                <p className="font-serif text-[11.5px] leading-tight text-[#FBF9F6]">
                  {project.name}
                </p>
                <p className="mt-1 font-mono text-[6.5px] uppercase tracking-[0.1em] text-[#EBC4A6]">
                  {project.meta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#FBF9F6]/12 pt-2.5">
            <span className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#FBF9F6]/40">
              Generated via DevCanvas
            </span>
            <span className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#EBC4A6]">
              Contact ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
