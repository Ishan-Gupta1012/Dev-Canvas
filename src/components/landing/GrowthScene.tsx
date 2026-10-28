'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useSceneScroll } from '@/components/landing/useSceneScroll';
import { Check, FileText, FolderGit2, Globe, Plus, Sparkles } from 'lucide-react';
import IdentityDesktop from '@/components/identity/IdentityDesktop';
import { baseProjects, newProject } from '@/components/identity/identityData';

function Stepper({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {[1, 2, 3, 4, 5, 6, 7].map((step) =>
        step === active ? (
          <div
            key={step}
            className="h-1.5 w-14 rounded-full bg-[#C08B3E] shadow-[0_0_12px_rgba(192,139,62,0.5)]"
          />
        ) : (
          <div key={step} className="h-1.5 w-7 rounded-full bg-[rgba(122,88,48,0.16)]" />
        )
      )}
    </div>
  );
}

/* Mini preview strip showing the new project landing in resume/portfolio. */
function UpdatedStrip({
  kind,
  updated,
}: {
  kind: 'resume' | 'portfolio';
  updated: MotionValue<number>;
}) {
  const isNew = useTransform(updated, [0.4, 1], [0, 1], { clamp: true });
  const isResume = kind === 'resume';

  return (
    <div
      className="rounded-xl px-4 py-3.5 flex-1 min-w-0"
      style={
        isResume
          ? {
              background: 'linear-gradient(170deg, #FBF4E7, #F2E6D2)',
              border: '1px solid rgba(163, 118, 56, 0.24)',
              boxShadow: '0 14px 34px rgba(90, 62, 34, 0.12)',
            }
          : {
              background: 'linear-gradient(160deg, #FCF7EC, #EEDCBE)',
              border: '1px solid rgba(163, 118, 56, 0.3)',
              boxShadow: '0 14px 34px rgba(90, 62, 34, 0.14)',
            }
      }
    >
      <p
        className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider mb-2.5"
        style={{ color: isResume ? '#A9762F' : '#A9762F' }}
      >
        {isResume ? <FileText className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
        {isResume ? 'Resume · Projects' : 'Portfolio · Featured'}
        <span className="ml-auto inline-flex items-center gap-1 normal-case tracking-normal" style={{ color: '#93795B' }}>
          <Check className="w-2.5 h-2.5" style={{ color: '#B07C33' }} /> synced
        </span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {baseProjects.map((project) => (
          <span
            key={project.id}
            className="px-2 py-0.5 rounded text-[10.5px] font-medium"
            style={{
              color: '#4A3B33',
              background: 'rgba(255, 249, 236, 0.7)',
              border: '1px solid rgba(122, 88, 48, 0.16)',
            }}
          >
            {project.title}
          </span>
        ))}
        <motion.span
          className="px-2 py-0.5 rounded text-[10.5px] font-semibold"
          style={{
            opacity: isNew,
            color: '#3A2716',
            background: 'linear-gradient(135deg, #F3DDB2, #D7A557)',
            border: '1px solid rgba(176, 128, 63, 0.6)',
          }}
        >
          {newProject.title} · New
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Scene 6 — the portfolio grows with you. A new project (and the skill it
 * brings) is dropped in once; the live desktop site, resume, and portfolio
 * all update together.
 */
export default function GrowthScene() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const p = useSceneScroll(ref, ['start 78%', 'end 55%']);

  const copyOpacity = useTransform(p, [0, 0.1], [0, 1], { clamp: true });
  const coreScale = useTransform(p, [0, 0.5], reduce ? [1, 1] : [0.97, 1], { clamp: true });

  /* The incoming LinkOps card flies toward the live site. */
  const cardOpacityIn = useTransform(p, [0.06, 0.18], [0, 1], { clamp: true });
  const cardOpacityOut = useTransform(p, [0.46, 0.58], [1, 0], { clamp: true });
  const cardX = useTransform(p, [0.1, 0.54], reduce ? [0, 0] : [-170, 150], { clamp: true });
  const cardY = useTransform(p, [0.1, 0.54], reduce ? [0, 0] : [90, -10], { clamp: true });
  const cardRotate = useTransform(p, [0.1, 0.54], reduce ? [0, 0] : [-8, 1.5], { clamp: true });

  /* The moment the update lands. */
  const updated = useTransform(p, [0.5, 0.9], [0, 1], { clamp: true });
  const stripsOpacity = useTransform(p, [0.58, 0.72], [0, 1], { clamp: true });
  const stripsY = useTransform(p, [0.58, 0.74], reduce ? [0, 0] : [22, 0], { clamp: true });

  const [includeNew, setIncludeNew] = useState(false);
  useMotionValueEvent(p, 'change', (v) => {
    const landed = reduce || v > 0.52;
    setIncludeNew((prev) => (prev === landed ? prev : landed));
  });

  return (
    <section id="growth" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 760px 500px at 50% 46%, rgba(212, 166, 92, 0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Centered header — distinct from the split scenes */}
        <motion.div className="max-w-3xl mx-auto text-center" style={{ opacity: copyOpacity }}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm font-mono tracking-widest text-[#A9762F] font-semibold">06</span>
            <span className="text-sm font-mono text-[#93795B]">/</span>
            <span className="text-sm font-mono text-[#93795B]">07</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-[46px] font-semibold tracking-tight text-[#35261E] leading-[1.14] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Keep Growing.
            <br />Your Portfolio Grows With You.
          </h2>
          <p className="text-base sm:text-lg text-[#6B5138] leading-relaxed">
            Ship a project or learn a skill — add it once and your live site,
            resume, and portfolio update together. No rebuilding from scratch.
          </p>
        </motion.div>

        {/* Stage: the live desktop site + the new entry dropping in */}
        <div className="relative mt-12 lg:mt-16 flex flex-col items-center">
          <motion.div
            className="relative w-full flex justify-center origin-center"
            style={{ scale: coreScale }}
          >
            <IdentityDesktop includeNewProject={includeNew} reduce={reduce} />

            {/* Incoming LinkOps card */}
            <motion.div
              className="hidden motion-safe:block absolute left-[2%] sm:left-[4%] lg:left-[8%] top-[58%] z-20 origin-center scale-[0.78] sm:scale-90 lg:scale-100"
              style={{ opacity: cardOpacityIn, x: cardX }}
            >
              <motion.div
                style={reduce ? { opacity: cardOpacityOut } : { y: cardY, rotate: cardRotate, opacity: cardOpacityOut }}
                className="rounded-xl overflow-hidden w-[240px] select-none"
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, #FCF7EC, #EBD7B5)',
                    border: '1px solid rgba(176, 128, 63, 0.55)',
                    boxShadow:
                      '0 24px 60px rgba(90, 62, 34, 0.3), 0 0 34px rgba(192, 139, 62, 0.24)',
                  }}
                >
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(122, 88, 48, 0.16)' }}>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#A9762F' }}>
                      <Plus className="w-3 h-3" /> Adding to portfolio
                    </span>
                    <span
                      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ background: 'linear-gradient(135deg, #EBCF97, #C08B3E)', color: '#3A2716' }}
                    >
                      New
                    </span>
                  </div>
                  <div className="h-20 overflow-hidden" style={{ borderBottom: '1px solid rgba(122, 88, 48, 0.14)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={newProject.image}
                      alt={`${newProject.title} preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-3.5 h-3.5" style={{ color: '#B07C33' }} />
                      <p className="text-[12.5px] font-semibold" style={{ color: '#35261E' }}>{newProject.title}</p>
                    </div>
                    <p className="text-[10px] mt-0.5" style={{ color: '#6B5138' }}>{newProject.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          color: '#5C4326',
                          background: 'rgba(255, 249, 236, 0.8)',
                          border: '1px solid rgba(163, 118, 56, 0.3)',
                        }}
                      >
                        <Sparkles className="w-2.5 h-2.5" style={{ color: '#B07C33' }} /> Edge Functions
                      </span>
                      <span className="text-[9px]" style={{ color: '#93795B' }}>+1 skill</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Updated resume + portfolio strips */}
          <motion.div
            className="w-full max-w-[760px] mt-10 flex flex-col sm:flex-row gap-4"
            style={{ opacity: stripsOpacity, y: stripsY }}
          >
            <UpdatedStrip kind="resume" updated={updated} />
            <UpdatedStrip kind="portfolio" updated={updated} />
          </motion.div>

          {/* Stepper */}
          <motion.div className="mt-12" style={{ opacity: stripsOpacity }}>
            <Stepper active={6} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
