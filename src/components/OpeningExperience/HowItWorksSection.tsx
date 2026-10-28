'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Check, Sparkles, Upload } from 'lucide-react';

type Scene = {
  index: string;
  stage: string;
  headline: string;
  body: string;
  tags: string[];
  theme: {
    panel: string;
    ink: string;
    sub: string;
    accent: string;
    paper: string;
  };
};

const SCENES: Scene[] = [
  {
    index: '01',
    stage: 'Upload',
    headline: 'Start with the resume you already have.',
    body: 'Drop in a PDF. No forms, no re-typing — the document you already maintain is the only input.',
    tags: ['PDF or DOCX', '5 MB max', 'No forms'],
    theme: {
      panel: '#E9E1D8',
      ink: '#1E1611',
      sub: '#6B5A4E',
      accent: '#6F4A34',
      paper: '#FFFFFF',
    },
  },
  {
    index: '02',
    stage: 'Extract',
    headline: 'Every section, pulled into place.',
    body: 'Education, skills, projects, and experience become clean, labeled blocks you can edit — never a wall of raw text.',
    tags: ['Profile', 'Skills', 'Projects', 'Experience'],
    theme: {
      panel: '#D8B7A5',
      ink: '#1E1611',
      sub: '#6F5648',
      accent: '#4A2F1F',
      paper: '#FFFFFF',
    },
  },
  {
    index: '03',
    stage: 'Showcase',
    headline: 'One link that does the introducing.',
    body: 'Publish a structured portfolio on a professional link for resumes, LinkedIn, and applications.',
    tags: ['Live URL', 'Recruiter-ready', 'Always editable'],
    theme: {
      panel: '#352016',
      ink: '#FBF9F6',
      sub: '#D8B7A5',
      accent: '#EBC4A6',
      paper: '#FFFFFF',
    },
  },
];

function ResumeArt({ scene }: { scene: Scene }) {
  return (
    <div className="relative w-full max-w-[450px]">
      <div
        className="rotate-[3deg] rounded-[22px] border-2 p-5 shadow-[10px_12px_0_rgba(43,33,27,0.16)] sm:p-6"
        style={{ backgroundColor: scene.theme.paper, borderColor: 'rgba(43,33,27,0.55)' }}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6F4A34]">
            resume_2026.pdf
          </span>
          <span className="rounded-full border border-[#6F4A34]/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#6F4A34]">
            PDF
          </span>
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-[6px] w-1/2 rounded-full bg-[#352016]/20" />
          <div className="h-[6px] w-3/4 rounded-full bg-[#352016]/12" />
          <div className="h-[6px] w-2/3 rounded-full bg-[#352016]/12" />
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-[16px] border-2 border-dashed border-[#6F4A34]/40 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6F4A34]/10">
            <Upload className="h-4 w-4 text-[#6F4A34]" strokeWidth={1.6} />
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#1E1611]">
              Drop to parse
            </div>
            <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#1E1611]/50">
              PDF · DOCX · 5 MB
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute -right-2 -top-3 rounded-full border-2 border-[#352016] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#FBF9F6]"
        style={{ backgroundColor: scene.theme.accent }}
      >
        01
      </div>
    </div>
  );
}

function ExtractArt({ scene }: { scene: Scene }) {
  return (
    <div className="relative w-full max-w-[480px]">
      <div
        className="-rotate-[2deg] rounded-[22px] border-2 p-5 shadow-[10px_12px_0_rgba(43,33,27,0.16)] sm:p-6"
        style={{ backgroundColor: scene.theme.paper, borderColor: 'rgba(43,33,27,0.55)' }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#352016]/15 pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6F4A34]">
            Parsed profile
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#6F4A34]/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#4A2F1F]">
            <Check className="h-2.5 w-2.5" strokeWidth={2.4} /> 28 fields
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {[
            ['Name', 'Your Name'],
            ['Role', 'Full-stack Developer'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#6F4A34]">
                {label}
              </span>
              <span className="font-sans text-[11px] text-[#1E1611]/80">{value}</span>
            </div>
          ))}
          <div className="flex items-start justify-between gap-3">
            <span className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#6F4A34]">
              Skills
            </span>
            <div className="flex flex-wrap justify-end gap-1">
              {['React', 'TypeScript', 'Node'].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#6F4A34]/30 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#4A2F1F]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-[14px] bg-[#352016]/[0.05] p-3">
          {[
            ['Senior Systems Engineer', '2023 — Now'],
            ['Software Engineer II', '2021 — 2023'],
          ].map(([role, years]) => (
            <div key={role} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6F4A34]" />
              <span className="truncate font-sans text-[10px] text-[#1E1611]/75">{role}</span>
              <span className="ml-auto shrink-0 font-mono text-[8px] uppercase tracking-[0.12em] text-[#1E1611]/45">
                {years}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute -right-2 -top-3 rounded-full border-2 border-[#352016] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#FBF9F6]"
        style={{ backgroundColor: scene.theme.accent }}
      >
        02
      </div>
    </div>
  );
}

function ShowcaseArt({ scene }: { scene: Scene }) {
  return (
    <div className="relative w-full max-w-[500px]">
      <div className="rotate-[2deg] overflow-hidden rounded-[22px] border-2 border-[#352016]/70 bg-[#FFFFFF] shadow-[10px_12px_0_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-2 border-b border-[#C6C2BD] bg-[#EDE7E0] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#6F4A34]/40" />
          <span className="h-2 w-2 rounded-full bg-[#B4552D]/40" />
          <span className="h-2 w-2 rounded-full bg-[#C6C2BD]" />
          <span className="ml-2 flex-1 truncate rounded-full border border-[#C6C2BD] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[8px] text-[#4A2F1F]">
            devcanvas.me/you
          </span>
          <ArrowUpRight className="h-3 w-3 shrink-0 text-[#6F4A34]" strokeWidth={1.6} />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#6F4A34]">
                Portfolio // 2026
              </div>
              <div className="mt-1 font-serif text-[20px] leading-none text-[#1E1611]">
                Your Name
              </div>
              <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-[#B4552D]">
                Full-stack Developer
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-[#6F4A34]/30 bg-[#6F4A34]/10 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-[#4A2F1F]">
              <Sparkles className="h-2.5 w-2.5" strokeWidth={1.6} /> Live
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ['01 // Project', 'Event Mesh', 'Rust · K8s'],
              ['02 // Project', 'Doc Parser', 'Next · TS'],
            ].map(([index, name, stack]) => (
              <div
                key={name}
                className="rounded-[12px] border border-[#C6C2BD] bg-[#F5F1EC] p-2.5"
              >
                <div className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#6F4A34]">
                  {index}
                </div>
                <div className="mt-1 font-serif text-[12px] leading-tight text-[#1E1611]">
                  {name}
                </div>
                <div className="mt-1.5 font-mono text-[6.5px] uppercase tracking-[0.12em] text-[#1E1611]/45">
                  {stack}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute -right-2 -top-3 rounded-full border-2 border-[#352016] px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#FBF9F6]"
        style={{ backgroundColor: scene.theme.accent }}
      >
        03
      </div>
    </div>
  );
}

const ART = [ResumeArt, ExtractArt, ShowcaseArt];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // The stage behaves like a vertical deck: each scene holds, then slides
  // up as the next one arrives from below. Only one is ever in place.
  const sceneY = [
    useTransform(scrollYProgress, [0, 0.29, 0.35, 1], ['0%', '0%', '-100%', '-100%']),
    useTransform(
      scrollYProgress,
      [0, 0.29, 0.35, 0.64, 0.7, 1],
      ['100%', '100%', '0%', '0%', '-100%', '-100%'],
    ),
    useTransform(scrollYProgress, [0, 0.64, 0.7, 1], ['100%', '100%', '0%', '0%']),
  ];
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value < 0.32 ? 0 : value < 0.67 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  const activeTheme = SCENES[active].theme;

  return (
    <div id="archive" ref={sectionRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 flex h-screen w-full flex-col bg-[#FAF7F3] px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:px-8">
        {/* Compact section header */}
        <div className="mx-auto flex w-full max-w-[1440px] shrink-0 items-baseline justify-between gap-6 pb-3 sm:pb-4">
          <div className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#4A2F1F] sm:text-[10px]">
            [03 // HOW IT WORKS]
          </div>
          <div className="hidden font-serif text-[15px] text-[#352016]/70 md:block">
            Three steps from resume to live portfolio.
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6F4A34] sm:text-[10px]">
            Scroll to advance
          </div>
        </div>

        {/* Scene frame */}
        <div className="relative mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col overflow-hidden rounded-[26px] border border-[#352016]/30 shadow-[0_30px_70px_-40px_rgba(58,44,36,0.6)] sm:rounded-[34px]">
          {/* Vertical deck: each scene is a full panel that slides through */}
          {SCENES.map((scene, index) => {
            const Art = ART[index];
            const isDark = index === 2;
            return (
              <motion.div
                key={scene.index}
                className="absolute inset-0 flex items-center"
                style={{
                  backgroundColor: scene.theme.panel,
                  y: sceneY[index],
                }}
                aria-hidden={active !== index}
              >
                <div className="grid w-full items-center gap-5 px-6 py-7 sm:gap-8 sm:px-10 sm:py-10 lg:grid-cols-12 lg:gap-14 lg:px-16 lg:py-12">
                  {/* Copy */}
                  <div className="lg:col-span-6">
                    <div className="flex items-end gap-3 sm:gap-5">
                      <span
                        className="font-serif text-[clamp(4rem,9vw,8rem)] font-medium leading-[0.75] tracking-[-0.04em]"
                        style={{ color: scene.theme.ink }}
                      >
                        {scene.index}
                      </span>
                      <span
                        className="pb-1 font-serif text-[clamp(2.2rem,4.8vw,4.4rem)] font-medium leading-[0.9] tracking-[-0.03em]"
                        style={{ color: scene.theme.ink }}
                      >
                        {scene.stage}
                      </span>
                    </div>

                    <p
                      className="mt-5 max-w-[520px] font-serif text-[clamp(1.5rem,2.9vw,2.4rem)] italic leading-[1.22] sm:mt-7"
                      style={{ color: scene.theme.ink }}
                    >
                      {scene.headline}
                    </p>

                    <p
                      className="mt-3 max-w-[460px] font-sans text-[13px] leading-[1.7] sm:mt-5 sm:text-[16px]"
                      style={{ color: scene.theme.sub }}
                    >
                      {scene.body}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2 sm:mt-7">
                      {scene.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border px-3.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] sm:text-[9px]"
                          style={{
                            borderColor: isDark ? 'rgba(248,247,245,0.3)' : 'rgba(43,33,27,0.28)',
                            color: scene.theme.ink,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Artwork */}
                  <div className="flex justify-center lg:col-span-6 lg:justify-end">
                    <Art scene={scene} />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Progress indicator */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-5">
            <div
              className="flex items-center gap-2.5 rounded-full border px-4 py-2 transition-colors duration-300 sm:gap-3"
              style={{
                borderColor: active === 2 ? 'rgba(248,247,245,0.28)' : 'rgba(43,33,27,0.2)',
                color: activeTheme.ink,
                backgroundColor:
                  active === 2 ? 'rgba(248,247,245,0.06)' : 'rgba(255,252,246,0.45)',
              }}
            >
              {SCENES.map((scene, index) => (
                <span
                  key={scene.index}
                  className="block h-2 w-2 rounded-full transition-all duration-300 sm:h-2.5 sm:w-2.5"
                  style={
                    index === active
                      ? { backgroundColor: activeTheme.ink, transform: 'scale(1.15)' }
                      : {
                          border: `1.5px solid ${
                            active === 2 ? 'rgba(248,247,245,0.5)' : 'rgba(43,33,27,0.35)'
                          }`,
                        }
                  }
                />
              ))}
              <span className="mx-1 h-[2px] w-14 overflow-hidden rounded-full bg-current/20 sm:w-24">
                <motion.span
                  className="block h-full origin-left rounded-full"
                  style={{ scaleX: progress, backgroundColor: activeTheme.ink }}
                />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] sm:text-[9px]">
                0{active + 1} / 03
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
