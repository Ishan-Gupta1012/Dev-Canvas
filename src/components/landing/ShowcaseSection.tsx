'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import InteractivePortfolioShowcase from '@/components/OpeningExperience/InteractivePortfolioShowcase';
import { Eyebrow, Reveal } from '@/components/OpeningExperience/Reveal';
import { EASE_OUT } from './motion';

type Tone = {
  bg: string;
  solid: string;
  ink: string;
  soft: string;
  card: string;
  highlightInk: string;
  accent: string;
  tape: string;
};

type Chapter = {
  n: string;
  kicker: string;
  title: readonly [string, string, string];
  body: string;
  tags: readonly string[];
  annotation: string;
  sticker: string;
  tone: Tone;
};

const CHAPTERS: Chapter[] = [
  {
    n: '0',
    kicker: 'INGEST',
    title: ['Start with the', 'resume', 'you already send.'],
    body: 'Drop the PDF you send recruiters today. No account setup, no forms, no re-typing a single line.',
    tags: ['PDF only', 'No forms', '30 seconds'],
    annotation: 'the file you already send',
    sticker: 'PDF IN',
    tone: {
      bg: 'rgba(228, 200, 166, 0.88)',
      solid: '#E4C8A6',
      highlightInk: '#FFFBF3',
      ink: '#241812',
      soft: '#4F3924',
      card: '#FFFBF3',
      accent: '#9A3F1B',
      tape: '#C9A98B',
    },
  },
  {
    n: '1',
    kicker: 'STRUCTURE',
    title: ['Every line becomes', 'structure', 'you can edit.'],
    body: 'Projects, skills, experience and honors are parsed into 28 structured fields — then set in a hierarchy recruiters can scan.',
    tags: ['28 fields', 'Auto-tagged', 'Editable'],
    annotation: 'projects · skills · milestones',
    sticker: 'PARSED',
    tone: {
      bg: 'rgba(196, 137, 90, 0.87)',
      solid: '#C4895A',
      highlightInk: '#FFF8EF',
      ink: '#241812',
      soft: '#472817',
      card: '#FFF8EF',
      accent: '#6E2F16',
      tape: '#E8C9AD',
    },
  },
  {
    n: '2',
    kicker: 'STYLE',
    title: ['Set it in a', 'look', 'that feels like you.'],
    body: 'Four editorial themes, type-first layouts and responsive spacing. Restyle the entire site in one click.',
    tags: ['4 themes', 'Type-first', 'Responsive'],
    annotation: 'restyle the whole site',
    sticker: '4 THEMES',
    tone: {
      bg: 'rgba(122, 71, 44, 0.89)',
      solid: '#7A472C',
      highlightInk: '#7A472C',
      ink: '#FFF4E8',
      soft: '#F0CDB4',
      card: '#FFF9F2',
      accent: '#E9B183',
      tape: '#C4703F',
    },
  },
  {
    n: '3',
    kicker: 'PUBLISH',
    title: ['Publish one', 'link', 'that stays current.'],
    body: 'Your portfolio lives at a single URL. Update your work once and every recruiter sees the latest version.',
    tags: ['Live URL', 'Always on', 'Zero upkeep'],
    annotation: 'send it anywhere',
    sticker: 'LIVE',
    tone: {
      bg: 'rgba(36, 22, 16, 0.92)',
      solid: '#241610',
      highlightInk: '#241610',
      ink: '#FBF1E6',
      soft: '#D9C2AF',
      card: '#F9EFE4',
      accent: '#D08A5E',
      tape: '#8A5232',
    },
  },
];

/* ── small scene props ─────────────────────────────────────────── */

function Tape({ tone, className = '' }: { tone: Tone; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-6 w-24 opacity-95 shadow-[0_1px_2px_rgba(20,12,8,0.12)] ${className}`}
      style={{
        background: tone.tape,
        clipPath:
          'polygon(0 8%, 4% 0, 96% 0, 100% 8%, 98% 96%, 94% 100%, 6% 100%, 2% 92%)',
      }}
    />
  );
}

function Sticker({
  label,
  tone,
  className = '',
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      className={`absolute z-20 border-2 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] shadow-[4px_4px_0_rgba(20,12,8,0.28)] ${className}`}
      style={{ background: tone.accent, color: tone.card, borderColor: tone.ink }}
    >
      {label}
    </span>
  );
}

function Annotation({ text, tone }: { text: string; tone: Tone }) {
  return (
    <span
      className="absolute -bottom-9 left-1 -rotate-2 font-serif text-[15px] italic"
      style={{ color: tone.ink }}
    >
      {text}
    </span>
  );
}

function Rule({ tone, w }: { tone: Tone; w: number }) {
  return (
    <span
      className="mt-2 block h-[3px] rounded-full"
      style={{ width: `${w}%`, background: `${tone.ink}22` }}
    />
  );
}

/* ── chapter visuals ───────────────────────────────────────────── */

function ResumeVisual({ tone }: { tone: Tone }) {
  const ink = '#241812';
  return (
    <div className="relative mx-auto w-full max-w-[370px]">
      <div
        className="relative rounded-[4px] border border-[#241812]/25 bg-[#FFFDF9] p-5 shadow-[12px_14px_0_rgba(20,12,8,0.12),0_30px_50px_-30px_rgba(20,12,8,0.6)] sm:p-6"
        style={{ transform: 'rotate(-2.5deg)', color: ink }}
      >
        <Tape tone={tone} className="-top-3 left-1/2 w-20 -translate-x-1/2 -rotate-2" />
        <div className="flex items-start justify-between border-b border-[#241812]/15 pb-3">
          <div>
            <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#B4552D]">
              Resume / 2026
            </p>
            <p className="mt-2 font-serif text-[24px] leading-none text-[#241812]">Your Name</p>
            <p className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#5A493C]">
              Product engineer · Bengaluru
            </p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#241812] font-serif text-[11px] italic text-[#FFFDF9]">
            YN
          </span>
        </div>

        <div className="mt-4">
          <p className="font-mono text-[6px] uppercase tracking-[0.18em] text-[#B4552D]">
            Experience
          </p>
          <div className="mt-2 space-y-2.5">
            {[
              { role: 'Senior Engineer', meta: '2023 — now', w: 82 },
              { role: 'Product Engineer', meta: '2021 — 23', w: 64 },
            ].map((row) => (
              <div key={row.role}>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-[12px] leading-none text-[#241812]">
                    {row.role}
                  </span>
                  <span className="font-mono text-[6px] uppercase tracking-[0.14em] text-[#5A493C]">
                    {row.meta}
                  </span>
                </div>
                <Rule tone={tone} w={row.w} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.18em] text-[#B4552D]">
              Projects
            </p>
            <Rule tone={tone} w={92} />
            <Rule tone={tone} w={70} />
            <Rule tone={tone} w={80} />
          </div>
          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.18em] text-[#B4552D]">
              Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {['TS', 'React', 'Rust', 'SQL'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#241812]/15 px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.1em] text-[#241812]/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#241812]/20 pt-2.5">
          <span className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#5A493C]">
            yourname_resume.pdf
          </span>
          <span className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#B4552D]">
            1 page · 84 KB
          </span>
        </div>
      </div>
      <Sticker label="PDF IN" tone={tone} className="-right-4 -top-4 rotate-[7deg]" />
      <Annotation text="« the file you already send »" tone={tone} />
    </div>
  );
}

function StructureVisual({ tone }: { tone: Tone }) {
  const ink = '#241812';
  const fields = [
    { label: 'Projects', count: '06', w: 88 },
    { label: 'Skills', count: '12', w: 72 },
    { label: 'Experience', count: '04', w: 94 },
    { label: 'Honors', count: '06', w: 58 },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div
        className="relative rounded-[4px] border border-[#241812]/25 bg-[#FFFDF9] p-5 shadow-[12px_14px_0_rgba(20,12,8,0.12),0_30px_50px_-30px_rgba(20,12,8,0.6)] sm:p-6"
        style={{ transform: 'rotate(2deg)', color: ink }}
      >
        <Tape tone={tone} className="-top-3 right-8 w-20 rotate-2" />
        <div className="flex items-center justify-between border-b border-[#241812]/15 pb-3">
          <div>
            <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#B4552D]">
              Parse / output
            </p>
            <p className="mt-1.5 font-serif text-[20px] leading-none text-[#241812]">
              Structured resume
            </p>
          </div>
          <span className="rounded-full bg-[#122430] px-2 py-1 font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-[#F8FDFF]">
            28 fields
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-[6px] border border-[#241812]/12 bg-[#F7F1EA] p-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[6.5px] uppercase tracking-[0.16em] text-[#5A493C]">
                  {field.label}
                </span>
                <span className="font-serif text-[17px] leading-none text-[#241812]">
                  {field.count}
                </span>
              </div>
              <span className="mt-2 block h-[3px] overflow-hidden rounded-full bg-[#241812]/10">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${field.w}%`, background: tone.accent }}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[6px] border border-dashed border-[#241812]/20 px-3 py-2.5">
          <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#B4552D]">
            Extracted entities
          </p>
          <p className="mt-1.5 font-mono text-[7.5px] leading-relaxed text-[#241812]/75">
            roles · companies · dates · stack · metrics · links
          </p>
        </div>
      </div>
      <Sticker label="PARSED" tone={tone} className="-right-4 -bottom-4 rotate-[5deg]" />
      <Annotation text="every section, re-authored" tone={tone} />
    </div>
  );
}

function SiteVisual({ tone }: { tone: Tone }) {
  const ink = '#241812';
  return (
    <div className="relative mx-auto w-full max-w-[410px]">
      <div
        className="overflow-hidden rounded-[8px] border border-[#241812]/30 bg-[#FFFDF9] shadow-[12px_14px_0_rgba(20,12,8,0.14),0_30px_50px_-30px_rgba(20,12,8,0.6)]"
        style={{ transform: 'rotate(-1.5deg)', color: ink }}
      >
        <div className="flex items-center gap-1.5 border-b border-[#241812]/12 bg-[#E7DED3] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B4552D]/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#C4703F]/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#BDB6AD]" />
          <span className="ml-2 flex-1 truncate rounded-full border border-[#241812]/10 bg-[#FFFDF9] px-2.5 py-1 font-mono text-[6.5px] tracking-wide text-[#4A2F1F]">
            devcanvas.me/you
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#B4552D]">
                Portfolio / 01
              </p>
              <p className="mt-1.5 font-serif text-[26px] leading-none text-[#241812]">
                Your Name
              </p>
              <p className="mt-1 font-mono text-[6.5px] uppercase tracking-[0.16em] text-[#5A493C]">
                Developer · Designer
              </p>
            </div>
            <div className="flex gap-1">
              {['#EBD3B7', '#C4895A', '#7A472C', '#241610'].map((swatch) => (
                <span
                  key={swatch}
                  className="h-4 w-4 rounded-full border border-[#241812]/20"
                  style={{ background: swatch }}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { index: '01', name: 'Event Mesh', meta: 'Rust · K8s' },
              { index: '02', name: 'Doc Parser', meta: 'Next · TS' },
            ].map((project) => (
              <div
                key={project.name}
                className="rounded-[5px] border border-[#241812]/12 bg-[#F7F1EA] p-2.5"
              >
                <p className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-[#B4552D]">
                  {project.index} {'// Project'}
                </p>
                <p className="mt-1 font-serif text-[12px] leading-none text-[#241812]">
                  {project.name}
                </p>
                <p className="mt-1 font-mono text-[5.5px] uppercase tracking-[0.12em] text-[#5A493C]">
                  {project.meta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#241812]/10 pt-2.5">
            <span className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-[#5A493C]">
              Theme · Mocha
            </span>
            <span className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-[#B4552D]">
              Fully responsive
            </span>
          </div>
        </div>
      </div>
      <Sticker label="4 THEMES" tone={tone} className="-right-4 -top-4 rotate-[7deg]" />
      <Annotation text="restyle the whole site" tone={tone} />
    </div>
  );
}

const QR = [
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1],
];

function PublishVisual({ tone }: { tone: Tone }) {
  const ink = '#241812';
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div
        className="relative mx-auto w-[188px] rounded-[30px] border-[5px] border-[#241812] bg-[#241812] p-1.5 shadow-[0_44px_80px_-44px_rgba(20,12,8,0.9)] sm:w-[206px]"
        style={{ transform: 'rotate(3deg)' }}
      >
        <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#241812]/50" />
        <div className="overflow-hidden rounded-[23px] bg-[#FFF9F0] px-3 pb-4 pt-6" style={{ color: ink }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-[#241812]/15 bg-white px-2 py-1 font-mono text-[5.5px] tracking-wide text-[#4A2F1F]">
              devcanvas.me/you
            </span>
            <span className="flex items-center gap-1 font-mono text-[5px] uppercase tracking-[0.14em] text-[#B4552D]">
              <span className="h-1 w-1 rounded-full bg-[#B4552D]" />
              live
            </span>
          </div>

          <p className="mt-4 font-mono text-[5px] uppercase tracking-[0.2em] text-[#B4552D]">
            Portfolio / 2026
          </p>
          <p className="mt-1.5 font-serif text-[25px] leading-[0.95] text-[#241812]">
            Your
            <br />
            Name
          </p>
          <p className="mt-1.5 font-mono text-[5.5px] uppercase tracking-[0.14em] text-[#5A493C]">
            Developer · Bengaluru
          </p>

          <div className="mt-3 space-y-1.5">
            {['Event Mesh', 'Doc Parser', 'Open Source'].map((name, i) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-[4px] border border-[#241812]/10 bg-white px-2 py-1.5"
              >
                <span className="font-serif text-[9px] text-[#241812]">{name}</span>
                <span className="font-mono text-[5px] text-[#B4552D]">0{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div className="grid grid-cols-7 gap-[1.5px]">
              {QR.flat().map((cell, i) => (
                <span
                  key={i}
                  className="h-[3px] w-[3px]"
                  style={{ background: cell ? '#241812' : 'transparent' }}
                />
              ))}
            </div>
            <span className="font-serif text-[8px] italic text-[#5A493C]">scan me</span>
          </div>
        </div>
      </div>

      <Sticker label="LIVE" tone={tone} className="-right-2 top-6 rotate-[8deg]" />
      <Annotation text="send it anywhere" tone={tone} />
    </div>
  );
}

function ChapterVisual({ index, tone }: { index: number; tone: Tone }) {
  if (index === 0) return <ResumeVisual tone={tone} />;
  if (index === 1) return <StructureVisual tone={tone} />;
  if (index === 2) return <SiteVisual tone={tone} />;
  return <PublishVisual tone={tone} />;
}

/* ── chapter typography ────────────────────────────────────────── */

function ChapterCopy({ chapter }: { chapter: Chapter }) {
  const { tone } = chapter;
  const [before, highlight, after] = chapter.title;

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-[0.34em] select-none font-serif text-[clamp(7rem,24vw,15rem)] font-medium leading-[0.7] opacity-95"
        style={{ color: tone.card, WebkitTextStroke: `2px ${tone.soft}` }}
      >
        {chapter.n}
      </span>

      <div className="relative pt-[clamp(3.8rem,9vw,6.5rem)]">
        <p
          className="flex items-center gap-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em]"
          style={{ color: tone.ink }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: tone.ink }}
          />
          {chapter.n} — {chapter.kicker}
        </p>

        <h3
          className="mt-3 max-w-[17ch] font-serif text-[clamp(2.15rem,5.4vw,4.35rem)] font-medium leading-[0.96] tracking-[-0.035em]"
          style={{ color: tone.ink }}
        >
          {before}{' '}
          <span className="relative mx-0.5 inline-block px-1.5">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[0.06em] h-[0.56em] -rotate-1"
              style={{ background: tone.ink }}
            />
            <span className="relative" style={{ color: tone.highlightInk }}>
              {highlight}
            </span>
          </span>{' '}
          {after}
        </h3>

        <p
          className="mt-4 max-w-[33rem] font-sans text-[13.5px] font-medium leading-[1.62] sm:text-[15px]"
          style={{ color: tone.soft }}
        >
          {chapter.body}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {chapter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[3px] border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em]"
              style={{
                borderColor: `${tone.ink}66`,
                color: tone.ink,
                background: `${tone.ink}12`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── section chrome ────────────────────────────────────────────── */

function Intro() {
  return (
    <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-10 pt-24 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14 lg:pt-32">
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow label="[02 // THE PORTFOLIO ENGINE]" />
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-[#1E1611]">
              See exactly what your
              <span className="lc-ink-gradient italic"> resume becomes.</span>
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={0.12}>
            <p className="max-w-[30rem] font-sans text-[15px] leading-[1.7] text-[#3A2C22] sm:text-[16px]">
              Four moves, one scroll. Watch a flat PDF turn into a structured,
              styled, live portfolio — then drive the engine yourself below.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function LiveDemo() {
  return (
    <div className="relative border-t border-[#3A2418]/12 bg-[#FAF7F3] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(180,85,45,0.14),transparent_72%)]"
      />
      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow label="[03 // DRIVE IT YOURSELF]" />
            <h3 className="mt-5 font-serif text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.04] tracking-[-0.03em] text-[#1E1611]">
              Switch the section. Change the theme.
              <span className="lc-ink-gradient italic"> Watch the site rebuild.</span>
            </h3>
          </div>
          <p className="max-w-[26rem] font-sans text-[14px] leading-[1.7] text-[#3A2C22] lg:col-span-4 lg:col-start-9">
            This is the real preview engine — every tab and theme is live. Hover to pause
            the auto-advance.
          </p>
        </div>

        <div className="relative mt-10 rounded-[28px] border border-[#3A2418]/15 bg-[#FDFBF9]/85 p-5 shadow-[0_50px_120px_-70px_rgba(58,36,24,0.8)] backdrop-blur-sm sm:mt-12 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#B4552D]/60 to-transparent"
          />
          <div className="mx-auto w-full max-w-[980px]">
            <InteractivePortfolioShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── main section ──────────────────────────────────────────────── */

export default function ShowcaseSection() {
  const reduce = useReducedMotion();
  const runwayRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);

  const { scrollYProgress } = useScroll({
    target: reduce ? undefined : runwayRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value < 0.3 ? 0 : value < 0.55 ? 1 : value < 0.8 ? 2 : 3;
    setChapter(next);
  });

  const wipe1 = useTransform(scrollYProgress, [0.16, 0.34], [0, 165], { clamp: true });
  const wipe2 = useTransform(scrollYProgress, [0.41, 0.59], [0, 165], { clamp: true });
  const wipe3 = useTransform(scrollYProgress, [0.66, 0.84], [0, 165], { clamp: true });

  const clip1 = useTransform(wipe1, (v) => `circle(${v}% at 0% 100%)`);
  const clip2 = useTransform(wipe2, (v) => `circle(${v}% at 0% 0%)`);
  const clip3 = useTransform(wipe3, (v) => `circle(${v}% at 0% 50%)`);

  const jumpTo = (index: number) => {
    const element = runwayRef.current;
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const scrollable = element.offsetHeight - window.innerHeight;
    const positions = [0.02, 0.38, 0.63, 0.9];
    window.scrollTo({
      top: top + positions[index] * scrollable,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const activeTone = CHAPTERS[chapter].tone;

  return (
    <section id="showcase" className="relative isolate w-full bg-[#FAF7F3]">
      <Intro />

      {reduce ? (
        /* Static, stacked version when motion is reduced */
        <div ref={runwayRef} className="space-y-4 px-4 pb-16 sm:px-6">
          {CHAPTERS.map((c, index) => (
            <div
              key={c.n}
              className="rounded-[24px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
              style={{ background: c.tone.bg, color: c.tone.ink }}
            >
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <ChapterCopy chapter={c} />
                </div>
                <div className="lg:col-span-6">
                  <ChapterVisual index={index} tone={c.tone} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={runwayRef} data-showcase-runway className="relative h-[380vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* Moving brown / silver light behind the translucent chapter washes */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#1B120D]">
              <motion.div
                className="absolute -left-[18%] -top-[22%] h-[78vmax] w-[78vmax] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(214,132,74,0.75), rgba(196,112,63,0) 64%)',
                }}
                animate={
                  reduce
                    ? undefined
                    : { x: ['0%', '12%', '-5%', '0%'], y: ['0%', '9%', '-7%', '0%'] }
                }
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -right-[14%] top-[6%] h-[64vmax] w-[64vmax] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(210,204,196,0.5), rgba(198,194,189,0) 66%)',
                }}
                animate={
                  reduce
                    ? undefined
                    : { x: ['0%', '-9%', '7%', '0%'], y: ['0%', '-8%', '10%', '0%'] }
                }
                transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
              <motion.div
                className="absolute bottom-[-26%] left-[18%] h-[62vmax] w-[62vmax] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(160,74,38,0.82), rgba(143,64,32,0) 66%)',
                }}
                animate={reduce ? undefined : { scale: [1, 1.16, 0.96, 1], opacity: [0.85, 1, 0.72, 0.85] }}
                transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(72%_62%_at_50%_42%,transparent,rgba(20,12,8,0.62))]" />
            </div>

            {/* Base + curved colour wipes */}
            <div className="absolute inset-0" style={{ background: CHAPTERS[0].tone.bg }} />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: CHAPTERS[1].tone.bg, clipPath: clip1 }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: CHAPTERS[2].tone.bg, clipPath: clip2 }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: CHAPTERS[3].tone.bg, clipPath: clip3 }}
            />

            {/* Slow light sweep so the section keeps moving */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-45 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'linear-gradient(115deg, transparent 28%, rgba(255,244,229,0.7) 47%, transparent 66%)',
                backgroundSize: '280% 280%',
              }}
              animate={reduce ? undefined : { backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            />

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-75 mix-blend-soft-light"
            >
              <motion.div
                className="absolute -left-[18%] top-[-24%] h-[74vmax] w-[74vmax] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,226,196,0.95), rgba(255,226,196,0) 62%)',
                }}
                animate={
                  reduce ? undefined : { x: ['0%', '16%', '-4%', '0%'], y: ['0%', '12%', '-6%', '0%'] }
                }
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -right-[16%] bottom-[-28%] h-[66vmax] w-[66vmax] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(206,202,196,0.9), rgba(206,202,196,0) 64%)',
                }}
                animate={
                  reduce ? undefined : { x: ['0%', '-14%', '6%', '0%'], y: ['0%', '-10%', '8%', '0%'] }
                }
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[130vmax] w-[130vmax] rounded-full"
                style={{
                  x: '-50%',
                  y: '-50%',
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(255,232,208,0.55) 58deg, transparent 132deg, rgba(206,202,196,0.32) 218deg, transparent 296deg)',
                }}
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Paper texture over the colour */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-multiply"
              style={{
                backgroundImage: 'radial-gradient(#241812 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
            <div aria-hidden="true" className="lc-grain pointer-events-none absolute inset-0 opacity-60" />

            {/* Top rail */}
            <div
              className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-24 font-mono text-[8.5px] uppercase tracking-[0.22em] transition-colors duration-500 sm:px-8 lg:px-10 lg:pt-28"
              style={{ color: activeTone.ink }}
            >
              <span>Resume → live site</span>
              <span className="hidden items-center gap-2 sm:flex">
                Scroll to build
                <span aria-hidden="true">↓</span>
              </span>
            </div>

            {/* Chapter scenes */}
            <div className="absolute inset-0">
              {CHAPTERS.map((c, index) => (
                <motion.div
                  key={c.n}
                  aria-hidden={chapter !== index}
                  initial={false}
                  animate={{
                    opacity: chapter === index ? 1 : 0,
                    y: chapter === index ? 0 : 22,
                  }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className={`absolute inset-0 flex flex-col justify-end px-6 pb-28 pt-24 sm:px-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:pb-20 lg:pt-28 ${
                    chapter === index ? '' : 'pointer-events-none'
                  }`}
                  style={{ color: c.tone.ink }}
                >
                  {/* Scene card — floats above the copy on mobile */}
                  <div className="pointer-events-none absolute right-3 top-24 w-[180px] origin-top-right scale-[0.72] sm:right-8 sm:top-28 sm:w-[300px] sm:scale-90 lg:static lg:order-2 lg:col-span-6 lg:mx-auto lg:w-full lg:max-w-[430px] lg:scale-100 lg:pointer-events-auto">
                    <ChapterVisual index={index} tone={c.tone} />
                  </div>

                  <div className="relative z-10 max-w-[36rem] lg:order-1 lg:col-span-6">
                    <ChapterCopy chapter={c} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress rail */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2.5 px-6 pb-6 sm:px-8 sm:pb-7 lg:px-10 lg:pb-8">
              {CHAPTERS.map((c, index) => {
                const active = index === chapter;
                return (
                  <button
                    key={c.n}
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-label={`Go to chapter ${c.n}: ${c.kicker}`}
                    aria-current={active ? 'step' : undefined}
                    className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-full border font-mono text-[9px] font-bold transition-all duration-300 after:absolute after:-inset-1.5 after:content-[''] hover:scale-110 sm:h-10 sm:w-10"
                    style={{
                      background: active ? activeTone.ink : 'transparent',
                      color: active ? activeTone.bg : activeTone.ink,
                      borderColor: active ? activeTone.ink : `${activeTone.ink}55`,
                    }}
                  >
                    {c.n}
                  </button>
                );
              })}
              <div
                className="ml-2 h-px w-full max-w-[240px] overflow-hidden"
                style={{ background: `${activeTone.ink}30` }}
              >
                <motion.div
                  className="h-full origin-left"
                  style={{ scaleX: scrollYProgress, background: activeTone.ink }}
                />
              </div>
              <span
                className="ml-auto hidden font-mono text-[8px] uppercase tracking-[0.2em] sm:block"
                style={{ color: `${activeTone.ink}99` }}
              >
                {String(chapter + 1).padStart(2, '0')} / 04 · {CHAPTERS[chapter].kicker}
              </span>
            </div>

            {/* Announce chapter changes to assistive tech without a live region on scroll */}
            <ol className="sr-only">
              {CHAPTERS.map((c) => (
                <li key={c.n}>
                  Chapter {c.n}: {c.kicker}. {c.title.join(' ')}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <LiveDemo />
    </section>
  );
}
