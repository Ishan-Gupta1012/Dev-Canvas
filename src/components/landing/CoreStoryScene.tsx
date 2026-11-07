'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useSceneScroll } from '@/components/landing/useSceneScroll';
import { ArrowRight, Code2, FileCheck2, FileText, Globe, Trophy, User } from 'lucide-react';
import IdentityCore from '@/components/identity/IdentityCore';
import ResumeDocument from '@/components/identity/ResumeDocument';
import PortfolioBrowser from '@/components/identity/PortfolioBrowser';
import { EASE_OUT } from '@/components/landing/motion';

/* ─── Motion-value helpers (custom hooks: rules of hooks safe) ─── */
function useMul(a: MotionValue<number>, b: MotionValue<number>) {
  return useTransform<number, number>([a, b], ([x, y]) => x * y);
}
function useAdd(a: MotionValue<number>, b: MotionValue<number>) {
  return useTransform<number, number>([a, b], ([x, y]) => x + y);
}

/* ─── Shared bits ─── */

// Visibility for each narrative block is driven by the scroll-linked `phase` MotionValue
// with no React state updates during scroll to avoid scroll jank.
function CopyBlock({
  active,
  phase,
  reduce,
  children,
}: {
  active: number;
  phase: MotionValue<number>;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const opacity = useTransform(phase, (v) => (Math.round(v) === active ? 1 : 0));
  const y = useTransform(phase, (v) => {
    if (Math.round(v) === active) return 0;
    return active === 0 ? -16 : 16;
  });
  const pointerEvents = useTransform(phase, (v) => (Math.round(v) === active ? 'auto' : 'none'));

  return (
    <motion.div
      className="absolute inset-0"
      style={reduce ? { opacity, pointerEvents } : { opacity, y, pointerEvents }}
    >
      {children}
    </motion.div>
  );
}

function StepCounter({ step }: { step: string }) {
  return (
    <div className="flex items-center gap-2 mb-5 lg:mb-6">
      <span className="text-sm font-mono tracking-widest text-[#292C30] font-semibold">{step}</span>
      <span className="text-sm font-mono text-[#AEB3B9]">/</span>
      <span className="text-sm font-mono text-[#777C82]">07</span>
    </div>
  );
}

function Stepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {[1, 2, 3, 4, 5, 6, 7].map((step) =>
        step === active ? (
          <div
            key={step}
            className="h-1.5 w-10 lg:w-14 rounded-full bg-[#292C30] shadow-[0_2px_10px_rgba(41,44,48,0.3)]"
          />
        ) : (
          <div key={step} className="h-1.5 w-5 lg:w-7 rounded-full bg-[rgba(41,44,48,0.12)]" />
        )
      )}
    </div>
  );
}

const Headline = ({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) => (
  <h2
    className={`${
      small ? 'text-[28px] sm:text-[38px] lg:text-[46px]' : 'text-[30px] sm:text-[44px] lg:text-[54px]'
    } font-semibold tracking-tight text-[#292C30] leading-[1.12] mb-4 lg:mb-6`}
    style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
  >
    {children}
  </h2>
);

/* ─── Draggable identity fragment ────────────────────────────────────────
 * The outer div is moved by scroll (assembly). The inner div can be
 * dragged anywhere and springs back on release — the two transforms
 * compose, so dragging never fights the scroll choreography. */
function Fragment({
  p,
  assembleRange,
  from,
  to,
  fadeRange,
  reduce,
  className = '',
  children,
}: {
  p: MotionValue<number>;
  assembleRange: [number, number];
  from: { x: number; y: number; rotate: number };
  to: { x: number; y: number; rotate: number };
  fadeRange: [number, number];
  reduce: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(p, assembleRange, reduce ? [to.x, to.x] : [from.x, to.x], { clamp: true });
  const y = useTransform(p, assembleRange, reduce ? [to.y, to.y] : [from.y, to.y], { clamp: true });
  const rotate = useTransform(
    p,
    assembleRange,
    reduce ? [to.rotate, to.rotate] : [from.rotate, to.rotate],
    { clamp: true }
  );
  const fade = useTransform(p, fadeRange, reduce ? [0, 0] : [1, 0], { clamp: true });

  /* Drag + spring-back (a local offset composed on top of scroll). */
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      className={`absolute pointer-events-auto ${className}`}
      style={reduce ? { opacity: fade } : { x, y, rotate, opacity: fade }}
    >
      <motion.div
        drag
        dragDirectionLock
        dragMomentum={false}
        dragSnapToOrigin
        whileDrag={{ scale: 1.07, zIndex: 60 }}
        onDragEnd={() => {
          animate(dragX, 0, { type: 'spring', stiffness: 260, damping: 20 });
          animate(dragY, 0, { type: 'spring', stiffness: 260, damping: 20 });
        }}
        className="select-none cursor-grab active:cursor-grabbing touch-none"
        style={{ x: dragX, y: dragY }}
      >
        <div
          className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 whitespace-nowrap"
          style={{
            background: 'rgba(244, 244, 242, 0.95)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(174, 179, 185, 0.45)',
            boxShadow: '0 4px 20px rgba(41, 44, 48, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Scenes 1–4 in one continuous pinned sequence. The Identity Core is the
 * single centerpiece: it assembles from scattered fragments (1–2),
 * reorganizes into a resume (3), and expands into a published portfolio
 * browser (4) — without ever leaving the screen.
 */
export default function CoreStoryScene() {
  const { user } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const p = useSceneScroll(sectionRef, ['start start', 'end end']);

  /* Phase is driven by scroll progress via motion values (no React re-renders). */
  const phase = useTransform(p, [0, 0.16, 0.16, 0.42, 0.42, 0.7, 0.7, 1], [0, 0, 1, 1, 2, 2, 3, 3], { clamp: true });
  /* ── Assembly (1 → 2) ── */
  const coreP = useTransform(p, [0.08, 0.34], reduce ? [1, 1] : [0, 1], { clamp: true });
  const coreFloatY = useTransform(p, [0, 0.36, 1], reduce ? [0, 0, 0] : [8, 0, -10]);

  /* ── Core → resume (2 → 3) ── */
  const coreExitO = useTransform(p, [0.36, 0.45], [1, 0], { clamp: true });
  const coreExitScale = useTransform(p, [0.36, 0.46], reduce ? [1, 1] : [1, 0.9], { clamp: true });
  const coreExitRotate = useTransform(p, [0.36, 0.46], reduce ? [0, 0] : [0, -3.5], { clamp: true });
  const coreExitY = useTransform(p, [0.36, 0.46], reduce ? [0, 0] : [0, -20], { clamp: true });
  const coreYCombined = useAdd(coreFloatY, coreExitY);

  const docIn = useTransform(p, [0.4, 0.49], [0, 1], { clamp: true });
  const docOutF = useTransform(p, [0.64, 0.72], [1, 0], { clamp: true });
  const docO = useMul(docIn, docOutF);
  const docScaleIn = useTransform(p, [0.4, 0.5], reduce ? [1, 1] : [0.93, 1], { clamp: true });
  const docScaleOut = useTransform(p, [0.64, 0.72], reduce ? [1, 1] : [1, 0.94], { clamp: true });
  const docScale = useMul(docScaleIn, docScaleOut);
  const docRotIn = useTransform(p, [0.4, 0.5], reduce ? [0, 0] : [-4, 0], { clamp: true });
  const docRotOut = useTransform(p, [0.64, 0.72], reduce ? [0, 0] : [0, 3], { clamp: true });
  const docRotate = useAdd(docRotIn, docRotOut);
  const docX = useTransform(p, [0.64, 0.72], reduce ? [0, 0] : [0, -70], { clamp: true });
  const docP = useTransform(p, [0.46, 0.68], [0, 1], { clamp: true });
  const chipIn = useTransform(p, [0.58, 0.64], [0, 1], { clamp: true });
  const chipO = useMul(chipIn, docOutF);

  /* ── Resume → portfolio (3 → 4) ── */
  const webP = useTransform(p, [0.64, 0.88], [0, 1], { clamp: true });
  /* The published site expands out of the stage into the large left panel. */
  const siteO = useTransform(p, [0.63, 0.77], [0, 1], { clamp: true });
  const siteScale = useTransform(p, [0.63, 0.82], reduce ? [1, 1] : [0.82, 1], { clamp: true });
  const siteX = useTransform(p, [0.63, 0.84], reduce ? [0, 0] : [150, 0], { clamp: true });
  const siteRotate = useTransform(p, [0.63, 0.84], reduce ? [0, 0] : [1.8, 0], { clamp: true });
  /* The small copy block settles in at the lower right after the site lands. */
  const copyO = useTransform(p, [0.74, 0.88], [0, 1], { clamp: true });
  const copyY = useTransform(p, [0.74, 0.9], reduce ? [0, 0] : [30, 0], { clamp: true });
  /* The narrative column bows out so the big site can take its place. */
  const narrativeO = useTransform(p, [0.6, 0.69], [1, 0], { clamp: true });

  const handleGetStarted = () => router.push(user ? '/dashboard' : '/signin');

  return (
    <section id="story" ref={sectionRef} className="relative h-[460vh] lg:h-[560vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center">
        {/* Ambient porcelain light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 700px 560px at 68% 46%, rgba(184, 175, 199, 0.15) 0%, transparent 68%), radial-gradient(ellipse 640px 480px at 30% 22%, rgba(174, 179, 185, 0.18) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-14 items-center pt-[68px] lg:pt-0">
          {/* ── Left: narrative column (crossfading states) ── */}
          <motion.div className="lg:col-span-5 relative" style={{ opacity: narrativeO }}>
            <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[470px]">
              {/* 01 — intro */}
              <CopyBlock active={0} phase={phase} reduce={reduce}>
                <StepCounter step="01" />
                <h1
                  className="text-[30px] sm:text-[44px] lg:text-[54px] font-bold tracking-tight text-[#292C30] leading-[1.14] max-w-[540px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  You&apos;ve Built the Skills.
                  <br />
                  <span className="whitespace-nowrap">Now Give Them a</span>
                  <br />
                  <span className="text-[#777C82]">Presence.</span>
                </h1>
                <p className="mt-5 lg:mt-6 text-[14.5px] sm:text-base lg:text-[17px] text-[#777C82] leading-relaxed max-w-[480px]">
                  Turn your skills, projects, and achievements into a professional
                  resume and personal portfolio in minutes. Keep your professional
                  identity growing as you do.
                </p>
                <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-3 lg:gap-4">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center gap-2.5 px-5 lg:px-6 py-3 lg:py-3.5 rounded-full bg-[#292C30] hover:bg-[#1A1B1D] text-[#F4F4F2] font-semibold text-[13px] lg:text-sm tracking-wide shadow-[0_8px_24px_rgba(41,44,48,0.22)] hover:shadow-[0_10px_28px_rgba(41,44,48,0.32)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <span>Build My Identity</span>
                    <ArrowRight size={15} strokeWidth={2.2} />
                  </button>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center px-5 lg:px-6 py-3 lg:py-3.5 rounded-full bg-[rgba(244,244,242,0.85)] hover:bg-white border border-[#D5D6D8] text-[#292C30] font-medium text-[13px] lg:text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    See How It Works
                  </a>
                </div>
                <div className="mt-8 lg:mt-12 hidden sm:flex items-center gap-2 text-xs text-[#777C82] tracking-wider opacity-75">
                  <span className="text-sm animate-bounce">↓</span>
                  <span>Scroll to explore · drag the cards</span>
                </div>
              </CopyBlock>

              {/* 02 — everything comes together */}
              <CopyBlock active={1} phase={phase} reduce={reduce}>
                <StepCounter step="02" />
                <Headline>
                  The Potential
                  <br />
                  Is Already There.
                </Headline>
                <p className="text-[14.5px] sm:text-base lg:text-[17px] text-[#777C82] leading-relaxed max-w-[470px]">
                  You learned the skills. Shipped the projects. Won the hackathon.
                  Watch it come together into one organized developer identity.
                </p>
                <div className="mt-8 lg:mt-12">
                  <Stepper active={2} />
                </div>
              </CopyBlock>

              {/* 03 — the resume */}
              <CopyBlock active={2} phase={phase} reduce={reduce}>
                <StepCounter step="03" />
                <Headline>
                  Your Experience,
                  <br />
                  Presented Properly.
                </Headline>
                <p className="text-[14.5px] sm:text-base lg:text-[17px] text-[#777C82] leading-relaxed max-w-[470px]">
                  The same profile reorganizes itself into a polished resume —
                  experience, education, skills, and projects, without starting
                  from a blank page.
                </p>
                <div className="mt-8 lg:mt-12">
                  <Stepper active={3} />
                </div>
              </CopyBlock>
            </div>
          </motion.div>

          {/* ── Right: one continuous stage for the Identity Core ── */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="relative w-full max-w-[560px] h-[360px] sm:h-[480px] lg:h-[640px] flex items-center justify-center">
              {/* The Identity Core (entering, then exiting) */}
              <motion.div
                className="absolute origin-center scale-[0.62] sm:scale-[0.8] lg:scale-100"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
              >
                <motion.div
                  style={{
                    opacity: coreExitO,
                    scale: coreExitScale,
                    rotate: coreExitRotate,
                    y: coreYCombined,
                  }}
                >
                  <IdentityCore progress={coreP} reduce={reduce} className="mx-auto" />
                </motion.div>
              </motion.div>

              {/* Scattered fragments flying in */}
              <div className="absolute inset-0 origin-center scale-[0.62] sm:scale-[0.8] lg:scale-100 pointer-events-none">
                <div className="relative w-full h-full pointer-events-auto">
                  <Fragment
                    p={p}
                    assembleRange={[0.03, 0.14]}
                    from={{ x: -60, y: -30, rotate: -8 }}
                    to={{ x: 60, y: 96, rotate: -2 }}
                    fadeRange={[0.13, 0.185]}
                    reduce={reduce}
                    className="left-[0%] top-[6%]"
                  >
                    <Code2 className="w-4 h-4 text-[#61DAFB]" />
                    <span className="text-[12px] font-semibold text-[#292C30]">
                      React · Next.js · +3
                    </span>
                  </Fragment>

                  <Fragment
                    p={p}
                    assembleRange={[0.05, 0.17]}
                    from={{ x: 90, y: -40, rotate: 7 }}
                    to={{ x: -20, y: 60, rotate: 3 }}
                    fadeRange={[0.16, 0.215]}
                    reduce={reduce}
                    className="right-[0%] top-[26%]"
                  >
                    <span
                      className="w-7 h-7 rounded-md overflow-hidden shrink-0"
                      style={{ border: '1px solid rgba(41, 44, 48, 0.15)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/project_aether.png" alt="" className="w-full h-full object-cover" />
                    </span>
                    <span className="text-[12px] font-semibold text-[#292C30]">
                      Project Aurora
                    </span>
                  </Fragment>

                  <Fragment
                    p={p}
                    assembleRange={[0.08, 0.21]}
                    from={{ x: -40, y: 50, rotate: 6 }}
                    to={{ x: 66, y: -6, rotate: 2 }}
                    fadeRange={[0.2, 0.26]}
                    reduce={reduce}
                    className="hidden sm:block left-[-4%] bottom-[30%]"
                  >
                    <User className="w-4 h-4 text-[#777C82]" />
                    <span className="text-[12px] font-semibold text-[#292C30]">
                      NextGen CTO · Intern
                    </span>
                  </Fragment>

                  <Fragment
                    p={p}
                    assembleRange={[0.11, 0.25]}
                    from={{ x: 70, y: 70, rotate: -6 }}
                    to={{ x: -54, y: -30, rotate: -2 }}
                    fadeRange={[0.24, 0.3]}
                    reduce={reduce}
                    className="hidden sm:block right-[2%] bottom-[10%]"
                  >
                    <Trophy className="w-4 h-4 text-[#AEB3B9]" />
                    <span className="text-[12px] font-semibold text-[#292C30]">
                      Hackathon · 2nd Place
                    </span>
                  </Fragment>
                </div>
              </div>

              {/* The resume writing itself */}
              <motion.div
                className="absolute origin-center scale-[0.62] sm:scale-[0.8] lg:scale-100"
                style={{ opacity: docO, scale: docScale, rotate: docRotate, x: docX }}
              >
                <div className="relative flex justify-center">
                  <ResumeDocument progress={docP} reduce={reduce} />

                  {/* Payoff chip */}
                  <motion.div
                    className="absolute -right-1 sm:right-[-28px] top-[46%] hidden sm:block"
                    style={{ opacity: chipO }}
                  >
                    <div
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-[12px] text-[#F4F4F2]"
                      style={{
                        background: 'linear-gradient(140deg, #777C82, #292C30)',
                        boxShadow:
                          '0 14px 34px rgba(41, 44, 48, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                      }}
                    >
                      <FileCheck2 className="w-4 h-4 text-[#B8AFC7]" />
                      Resume Generated
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* The published portfolio site is its own expanding stage below */}
            </div>
          </div>
        </div>

        {/* ── Phase 4: the published site becomes the whole stage ── */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none flex items-center pt-[72px] pb-5 lg:py-0"
          style={{ opacity: siteO }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-9 items-center">
              {/* Large desktop-scale site, anchored left */}
              <div className="min-w-0 flex justify-start">
                <motion.div
                  className="w-full max-w-[900px] origin-center"
                  style={{ scale: siteScale, x: siteX, rotate: siteRotate }}
                >
                  <PortfolioBrowser progress={webP} reduce={reduce} />
                </motion.div>
              </div>

              {/* Compact copy, settling in at the lower right */}
              <motion.div
                className="lg:self-end lg:pb-4 max-w-[400px]"
                style={{ opacity: copyO, y: copyY }}
              >
                <StepCounter step="04" />
                <h2
                  className="text-[24px] sm:text-[30px] lg:text-[32px] font-semibold tracking-tight text-[#292C30] leading-[1.14] mb-2 sm:mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  Give Your Work
                  <br />a Home on the Internet.
                </h2>
                <p className="text-[12.5px] sm:text-[14px] text-[#777C82] leading-relaxed max-w-[340px]">
                  One profile becomes a live portfolio — hero, featured projects, and
                  a link you can publish and share.
                </p>

                {/* Resume → Portfolio flow */}
                <div className="mt-3.5 sm:mt-5 flex items-center gap-2.5">
                  <span
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-[11.5px] text-[#292C30]"
                    style={{
                      background: 'linear-gradient(160deg, #FAF9F6, #F4F4F2)',
                      border: '1px solid #D5D6D8',
                      boxShadow: '0 8px 20px rgba(41, 44, 48, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#777C82]" />
                    Resume
                  </span>

                  <ArrowRight className="w-4 h-4 text-[#777C82]" />

                  <span
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-[11.5px] text-[#292C30]"
                    style={{
                      background: 'rgba(244, 244, 242, 0.95)',
                      border: '1px solid rgba(174, 179, 185, 0.45)',
                      boxShadow: '0 8px 20px rgba(41, 44, 48, 0.08), 0 0 16px rgba(184, 175, 199, 0.25)',
                    }}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#B8AFC7]" />
                    Portfolio
                  </span>
                </div>

                <div className="mt-5 hidden sm:block">
                  <Stepper active={4} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
