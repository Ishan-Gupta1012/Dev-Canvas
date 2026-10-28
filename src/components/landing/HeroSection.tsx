'use client';

import React from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import GenerativeAttractorCanvas from '@/components/OpeningExperience/GenerativeAttractorCanvas';
import { CtaLabel, MagneticButton, MagneticLink } from './MagneticButton';
import { MaskLine, ScrambleText } from './KineticText';
import Marquee from './Marquee';
import { EASE_OUT } from './motion';

const MARQUEE_ITEMS = [
  'ATS-READY STRUCTURE',
  'ONE SHAREABLE LINK',
  'ZERO RE-TYPING',
  'EDITORIAL TEMPLATES',
  'MOBILE FIRST',
  'LIVE IN MINUTES',
];

export default function HeroSection({
  introReady,
  onEnter,
}: {
  introReady: boolean;
  onEnter: () => void;
}) {
  const reduce = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 20, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 20, mass: 0.5 });

  const accentX = useTransform(smoothX, [-1, 1], [26, -26]);
  const accentY = useTransform(smoothY, [-1, 1], [18, -18]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const scrollTo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section
      id="hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#FAF7F3] pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Generative attractor — the signature texture, held to the upper right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[78svh] opacity-60 [mask-image:radial-gradient(105%_95%_at_82%_38%,#000_14%,transparent_74%)] sm:opacity-80 lg:opacity-95"
      >
        <GenerativeAttractorCanvas mode="hero" palette="copper" />
      </div>

      {/* Paper washes so type always holds contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_68%_at_10%_40%,rgba(250,247,243,0.99)_0%,rgba(250,247,243,0.86)_44%,rgba(250,247,243,0)_80%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,243,0.92)_0%,rgba(250,247,243,0)_20%,rgba(250,247,243,0.1)_56%,rgba(250,247,243,0.88)_82%,rgba(250,247,243,0.99)_100%)]"
      />
      <div aria-hidden="true" className="lc-grid pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="lc-grain pointer-events-none absolute inset-0" />

      {/* Lavender / silver light */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { x: accentX, y: accentY }}
        className="pointer-events-none absolute -right-32 top-[18%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(180,85,45,0.26),rgba(180,85,45,0)_68%)] blur-2xl"
      />
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { x: accentY, y: accentX }}
        className="pointer-events-none absolute -left-28 bottom-16 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(178,168,158,0.34),rgba(178,168,158,0)_70%)] blur-2xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 sm:px-8 lg:px-10">
        {/* ── Headline band ─────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#B4552D]/35 bg-[#F7E4D4]/70 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#4A2F1F] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B4552D] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4A2F1F]" />
                </span>
                Resume-to-portfolio architecture
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#5A493C]">
                Edition 2026 / v2.4
              </span>
            </motion.div>

            <h1 className="font-serif text-[clamp(2.85rem,7.7vw,6rem)] font-medium leading-[0.9] tracking-[-0.045em] text-[#1E1611]">
              <MaskLine trigger="mount" active={introReady} delay={0.05}>
                Your resume,
              </MaskLine>
              <MaskLine trigger="mount" active={introReady} delay={0.14}>
                rebuilt as a
              </MaskLine>
              <MaskLine trigger="mount" active={introReady} delay={0.23} innerClassName="pb-1">
                <span className="lc-ink-gradient italic">living portfolio.</span>
              </MaskLine>
            </h1>
          </div>

          {/* Small live-build caption occupying the art column */}
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end lg:pb-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE_OUT }}
              className="flex flex-col items-end gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#3A2418]/15 bg-[#FAF7F3]/75 px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#3A2C22] backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B4552D] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B4552D]" />
                </span>
                Live build
              </span>
              <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
                {[0.35, 0.55, 0.8, 0.5, 1, 0.65, 0.9, 0.45, 0.75, 0.6, 0.95, 0.4].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] origin-bottom rounded-full bg-[#B4552D]"
                    style={{ height: `${Math.round(h * 32)}px`, opacity: 0.35 + h * 0.5 }}
                    initial={reduce ? undefined : { scaleY: 0.35 }}
                    animate={reduce ? undefined : { scaleY: [0.35, 1, 0.55] }}
                    transition={
                      reduce
                        ? undefined
                        : {
                            duration: 1.8,
                            delay: i * 0.09,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                          }
                    }
                  />
                ))}
              </div>
              <span className="font-serif text-[15px] italic leading-none text-[#5A493C]">
                a resume, re-set as a site.
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── Body band ─────────────────────────────────────────── */}
        <div className="mt-10 grid gap-10 border-t border-[#3A2418]/15 pt-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.8, delay: 0.42, ease: EASE_OUT }}
              className="max-w-[30rem] font-sans text-[15px] leading-[1.7] text-[#3A2C22] sm:text-[16px]"
            >
              DevCanvas reads the resume you already have and rebuilds it as a structured,
              recruiter-ready website — your projects, skills, and milestones set in an
              editorial layout that feels like you.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.8, delay: 0.52, ease: EASE_OUT }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton
                onClick={onEnter}
                className="h-[54px] rounded-full border border-[#3A2418] bg-[#4A2F1F] px-7 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFFFFF] shadow-[0_22px_48px_-24px_rgba(58,36,24,0.85)] transition-colors duration-300 hover:bg-[#6F4A34]"
                aria-label="Create my portfolio"
              >
                <CtaLabel label="Create my portfolio" />
              </MagneticButton>

              <MagneticLink
                href="#showcase"
                onClick={scrollTo('showcase')}
                className="h-[54px] rounded-full border border-[#4A2F1F]/25 bg-[#FFFFFF]/55 px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1E1611] backdrop-blur-sm transition-colors duration-300 hover:border-[#B4552D]/60 hover:bg-[#FFFFFF]/85"
              >
                <span className="mr-2.5 grid h-6 w-6 place-items-center rounded-full border border-[#3A2418]/20 transition-colors group-hover:border-[#B4552D]/60">
                  <ArrowDown size={12} strokeWidth={1.8} />
                </span>
                See it work
              </MagneticLink>
            </motion.div>

            {/* Transformation tokens */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.8, delay: 0.68, ease: EASE_OUT }}
              className="mt-7 flex flex-wrap items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em]"
            >
              <span className="rounded-full border border-[#3A2418]/18 bg-[#FFFFFF]/70 px-2.5 py-1 text-[#3A2C22]">
                resume.pdf
              </span>
              <ArrowRight size={11} className="text-[#B4552D]" aria-hidden="true" />
              <span className="rounded-full border border-[#B4552D]/35 bg-[#F1D2BD]/45 px-2.5 py-1 text-[#4A2F1F]">
                28 fields
              </span>
              <ArrowRight size={11} className="text-[#B4552D]" aria-hidden="true" />
              <span className="rounded-full bg-[#4A2F1F] px-2.5 py-1 text-[#FBF9F6]">
                live link
              </span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom rail: scroll cue + marquee */}
      <div className="relative z-10 mt-10 w-full">
        <div className="mx-auto mb-5 flex w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#showcase"
            onClick={scrollTo('showcase')}
            className="group inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#5A493C] transition-colors hover:text-[#4A2F1F]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#3A2418]/20 transition-transform duration-300 group-hover:translate-y-0.5">
              <ArrowDown size={13} strokeWidth={1.6} />
            </span>
            Scroll to explore
          </a>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-[#3A2418]/55 sm:inline">
            <ScrambleText text="BUILT FOR DEVELOPERS & STUDENTS" active={introReady} />
          </span>
        </div>

        <div className="border-y border-[#3A2418]/12 bg-[#EDE6DF]/60 py-3.5 backdrop-blur-sm">
          <Marquee
            items={MARQUEE_ITEMS}
            itemClassName="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3A2418]/70"
            duration={46}
          />
        </div>
      </div>
    </section>
  );
}
