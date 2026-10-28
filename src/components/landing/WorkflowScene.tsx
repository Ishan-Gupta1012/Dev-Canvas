'use client';

import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useSceneScroll } from '@/components/landing/useSceneScroll';
import { FileText, FolderPlus, Link2, Monitor } from 'lucide-react';

const STEPS = [
  {
    title: 'Add Your Information',
    body: 'Drop in skills, projects, experience — however they are written today.',
    icon: FolderPlus,
  },
  {
    title: 'Generate Your Resume',
    body: 'DevCanvas arranges it into a polished, professional resume.',
    icon: FileText,
  },
  {
    title: 'Build Your Portfolio',
    body: 'The same profile becomes a personal website with your work front and center.',
    icon: Monitor,
  },
  {
    title: 'Publish & Share',
    body: 'Send one link. Update once — the resume and portfolio stay in sync.',
    icon: Link2,
  },
] as const;

/* Compact previews that respond to the active step. */
function StepPreview({ step, reduce }: { step: number; reduce: boolean }) {
  const panels = [
    /* 0 — raw information */
    <div key="info" className="flex flex-wrap items-center justify-center gap-2">
      {['React', 'Next.js', 'Project Aurora', 'NextGen CTO', 'Hackathon'].map((chip, i) => (
        <span
          key={chip}
          className="px-3 py-1.5 rounded-lg text-[11.5px] font-medium text-[#6B4B28]"
          style={{
            background: 'rgba(252, 245, 232, 0.85)',
            border: `1px solid ${i % 2 ? 'rgba(192, 139, 62, 0.35)' : 'rgba(163, 118, 56, 0.2)'}`,
          }}
        >
          {chip}
        </span>
      ))}
    </div>,
    /* 1 — resume forming */
    <div
      key="resume"
      className="mx-auto w-[210px] rounded-lg p-3.5 space-y-2"
      style={{
        background: 'linear-gradient(170deg, #FCF6EA, #F3E7D3)',
        boxShadow: '0 14px 34px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#B0803F]" />
        <span className="h-1.5 w-16 rounded bg-[rgba(36,24,18,0.25)]" />
      </div>
      <div className="h-1 w-full rounded bg-[rgba(36,24,18,0.12)]" />
      <div className="h-1 w-4/5 rounded bg-[rgba(36,24,18,0.12)]" />
      <div className="h-1 w-3/5 rounded bg-[rgba(176,128,63,0.42)]" />
    </div>,
    /* 2 — portfolio forming */
    <div
      key="portfolio"
      className="mx-auto w-[230px] rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(31, 21, 16, 0.96), rgba(21, 14, 11, 0.96))',
        border: '1px solid rgba(223, 211, 209, 0.16)',
        boxShadow: '0 14px 34px rgba(0, 0, 0, 0.45)',
      }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1.5" style={{ borderBottom: '1px solid rgba(223,211,209,0.08)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(223,211,209,0.25)' }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(223,211,209,0.15)' }} />
      </div>
      <div className="p-2.5">
        <div className="h-1.5 w-12 rounded bg-[#C08B3E] mb-1.5" />
        <div className="h-2 w-24 rounded bg-[rgba(243,240,238,0.5)] mb-2" />
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-9 rounded" style={{ background: 'rgba(223,211,209,0.07)', border: '1px solid rgba(223,211,209,0.1)' }} />
          <div className="h-9 rounded" style={{ background: 'rgba(223,211,209,0.07)', border: '1px solid rgba(223,211,209,0.1)' }} />
        </div>
      </div>
    </div>,
    /* 3 — published link */
    <div
      key="published"
      className="mx-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
      style={{
        background: 'rgba(192, 139, 62, 0.14)',
        border: '1px solid rgba(192, 139, 62, 0.38)',
      }}
    >
      <Link2 className="w-4 h-4 text-[#B07C33]" />
      <span className="text-[12.5px] font-mono text-[#5C4326]">ishangupta.dev</span>
      <span
        className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{ background: '#C08B3E', color: '#3A2716' }}
      >
        Live
      </span>
    </div>,
  ];

  return (
    <div className="relative h-[110px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -10 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex items-center justify-center"
        >
          {panels[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* One step on the track — the active MotionValue lights the ring. */
function TrackStep({
  step,
  index,
  active,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: MotionValue<number>;
}) {
  const Icon = step.icon;
  const ringOpacity = useTransform(active, [0, 1], [0, 1], { clamp: true });

  return (
    <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center">
      {/* Badge */}
      <div className="relative shrink-0 md:mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #FCF4E4, #EEDCBC)',
            border: '1px solid rgba(163, 118, 56, 0.32)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          }}
        >
          <Icon className="w-5 h-5 text-[#B07C33]" />
        </div>
        <motion.div
          className="absolute -inset-[3px] rounded-full pointer-events-none"
          style={{
            opacity: ringOpacity,
            border: '1.5px solid rgba(192, 139, 62, 0.6)',
            boxShadow: '0 0 18px rgba(192, 139, 62, 0.38)',
          }}
        />
        <span
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9.5px] font-bold flex items-center justify-center"
          style={{
            background: 'rgba(255, 249, 236, 0.95)',
            border: '1px solid rgba(163, 118, 56, 0.32)',
            color: '#8A6A42',
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* Copy */}
      <div className="md:px-2">
        <p className="text-[15px] font-semibold text-[#35261E] mb-1.5">{step.title}</p>
        <p className="text-[13px] text-[#6B5138] leading-relaxed max-w-[240px] md:mx-auto">
          {step.body}
        </p>
      </div>
    </div>
  );
}

/**
 * Scene 5 — the product workflow as a horizontal process with a
 * scroll-driven progress line and a preview that responds to the
 * active step.
 */
export default function WorkflowScene() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const p = useSceneScroll(ref, ['start 75%', 'end 55%']);

  const lineScale = useTransform(p, [0.06, 0.88], [0, 1], { clamp: true });
  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(p, 'change', (v) => {
    const step = v < 0.26 ? 0 : v < 0.5 ? 1 : v < 0.74 ? 2 : 3;
    setActiveStep((prev) => (prev === step ? prev : step));
  });

  /* Per-step activation, staggered along the scroll. */
  const a0 = useTransform(p, [0.02, 0.14], [0, 1], { clamp: true });
  const a1 = useTransform(p, [0.26, 0.38], [0, 1], { clamp: true });
  const a2 = useTransform(p, [0.5, 0.62], [0, 1], { clamp: true });
  const a3 = useTransform(p, [0.74, 0.86], [0, 1], { clamp: true });
  const activations = [a0, a1, a2, a3];

  return (
    <section id="how-it-works" ref={ref} className="relative py-24 lg:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 800px 420px at 50% 12%, rgba(173, 135, 102, 0.16) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-mono tracking-widest text-[#A9762F] font-semibold">05</span>
            <span className="text-sm font-mono text-[#93795B]">/</span>
            <span className="text-sm font-mono text-[#93795B]">07</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#35261E] leading-[1.12] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            From Scattered Notes
            <br />to a Published Site.
          </h2>
          <p className="text-base sm:text-lg text-[#6B5138] leading-relaxed">
            Four steps, one continuous flow — the same information moves
            through each stage of your professional story.
          </p>
        </div>

        {/* Process track */}
        <div className="relative mt-16 lg:mt-24">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute left-[12.5%] right-[12.5%] top-[27px] h-[2px] rounded"
            style={{ background: 'rgba(122, 88, 48, 0.16)' }}
          />
          <motion.div
            className="hidden md:block absolute left-[12.5%] right-[12.5%] top-[27px] h-[2px] rounded origin-left"
            style={{ background: 'linear-gradient(90deg, #A9762F, #D4A257)', scaleX: lineScale }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {STEPS.map((step, i) => (
              <TrackStep key={step.title} step={step} index={i} active={activations[i]} />
            ))}
          </div>
        </div>

        {/* Responding preview */}
        <div className="mt-14 lg:mt-20">
          <StepPreview step={activeStep} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}
