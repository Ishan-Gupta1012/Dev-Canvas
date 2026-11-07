'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, ArrowRight, Sparkles, Layers, Eye } from 'lucide-react';

interface PortfolioTemplate {
  id: string;
  tag: string;
  year: string;
  title: string;
  subtitle: string;
  tags: string[];
  cta: string;
  href: string;
  img?: string;
  coordinates: string;
  isComingSoon?: boolean;
}

const TEMPLATES: PortfolioTemplate[] = [
  {
    id: 'modern-developer',
    tag: 'Template 1264×506',
    year: 'Website 2026',
    title: 'Modern Developer',
    subtitle: 'Vibrant, high-impact dark architecture designed for full-stack and systems engineers.',
    tags: ['Full-stack', 'Interactive', 'Dark mode', 'Next.js 15'],
    cta: 'Preview template',
    href: '/dashboard/preview?template=modern-developer',
    img: 'https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png',
    coordinates: 'x 817  y 51',
  },
  {
    id: 'developer-pro',
    tag: 'Template 1276×510',
    year: 'Website 2026',
    title: 'Developer Pro',
    subtitle: 'Clean typographic clarity engineered for staff engineers, architects, and technical leads.',
    tags: ['Minimal', 'Typographic', 'Light mode', 'Executive'],
    cta: 'Preview template',
    href: '/dashboard/preview?template=software-engineer',
    img: 'https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png',
    coordinates: 'x 1106  y 42',
  },
  {
    id: 'creative-edge',
    tag: 'In Pipeline 1280×520',
    year: 'Website 2026',
    title: 'Creative Edge',
    subtitle: 'Ultra-fast 3D Canvas, dynamic editorial layouts, and high-frequency shader archetypes.',
    tags: ['3D WebGL', 'Editorial', 'Custom Shaders', 'Coming Soon'],
    cta: 'Explore archetype queue',
    href: '/dashboard/templates',
    coordinates: 'x 940  y 78',
    isComingSoon: true,
  },
];

function TemplateStackCard({
  template,
  index,
  total,
}: {
  template: PortfolioTemplate;
  index: number;
  total: number;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  // Spring smoothing turns discrete external mouse wheel ticks into continuous momentum interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Scale down slightly as subsequent cards stack on top
  const scale = useTransform(smoothProgress, [0.5, 1], [1, 1 - (total - index - 1) * 0.032]);

  const handleAction = () => {
    router.push(user ? template.href : '/signin');
  };

  return (
    <div
      ref={cardRef}
      className="sticky top-20 sm:top-24 mb-12 sm:mb-20 last:mb-0 w-full"
      style={{
        zIndex: 10 + index,
      }}
    >
      <motion.div
        style={{
          scale,
          transformOrigin: 'top center',
        }}
        className="relative w-full rounded-2xl sm:rounded-3xl bg-[#FAF9F6] border border-[#EF4444] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden transition-shadow duration-300 select-none transform-gpu will-change-transform"
      >
        {/* ── Technical Red Bounding Tag & Corner Anchors (Exact Reference Style) ── */}
        <div className="absolute top-0 left-0 bg-[#EF4444] text-white px-3 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium tracking-wide flex items-center gap-2 z-30 rounded-br-sm shadow-xs select-none">
          <span>{template.tag}</span>
        </div>

        {/* 4 Corner Anchor Handles */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">
          {/* Left Column: Editorial Information */}
          <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[rgba(41,44,48,0.1)] bg-[#FAF9F6]">
            {/* Top Year / Label */}
            <div>
              <p className="font-mono text-[11px] text-[#777C82] tracking-wider mb-6">
                {template.year}
              </p>

              <h3
                className="text-[30px] sm:text-[38px] lg:text-[42px] font-bold tracking-tight text-[#111315] leading-[1.08] mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
              >
                {template.title}
              </h3>

              <p className="text-[14px] sm:text-[15px] text-[#4A4E54] leading-relaxed max-w-sm mb-6">
                {template.subtitle}
              </p>
            </div>

            {/* Bottom: Tags & Action Button */}
            <div className="pt-6 border-t border-[rgba(41,44,48,0.08)] space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-white border border-[rgba(41,44,48,0.14)] text-[10.5px] font-medium text-[#292C30]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleAction}
                className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#111315] text-[#FAF9F6] hover:bg-[#EF4444] transition-colors duration-200 cursor-pointer shadow-xs"
              >
                <span className="text-[12.5px] font-medium tracking-wide">{template.cta}</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview Area */}
          <div className="lg:col-span-7 relative overflow-hidden bg-[#0D0F12] flex items-center justify-center min-h-[300px] lg:min-h-full">
            {template.isComingSoon ? (
              /* Coming Soon Archetype Visual */
              <div className="relative w-full h-full p-8 sm:p-12 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-tr from-[#0D0F12] via-[#14171C] to-[#1A1D24]">
                {/* Background Tech Blueprint Grid */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                {/* Animated Glowing Waveform / Radar */}
                <div className="relative z-10 w-44 h-44 rounded-full border border-white/10 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#EF4444]/40 animate-[spin_20s_linear_infinite]" />
                  <div className="w-28 h-28 rounded-full border border-white/15 bg-white/5 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-[#EF4444] animate-pulse" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444] font-mono text-[11px] font-semibold tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                    <span>Coming Soon · 4 New Layouts</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#8E939B] max-w-xs">
                    Shaders · Interactive Canvas · Minimalist Monospaced
                  </p>
                </div>
              </div>
            ) : (
              /* Real Template Screenshot with Technical Crosshair and Reticle */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Template Screenshot */}
                <img
                  src={template.img}
                  alt={template.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
                />

                {/* Red Technical Crosshair Grid Lines (Matching Screenshot) */}
                <div className="absolute inset-x-0 top-[28%] h-px bg-[#EF4444]/40 pointer-events-none" />
                <div className="absolute inset-y-0 left-[62%] w-px bg-[#EF4444]/40 pointer-events-none" />

                {/* Circular Magnifying / Target Reticle */}
                <div className="absolute top-[16%] left-[54%] pointer-events-none flex items-center gap-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#EF4444] flex items-center justify-center bg-[#EF4444]/5 backdrop-blur-[1px] shadow-sm">
                    <div className="w-1 h-1 rounded-full bg-[#EF4444]" />
                  </div>

                  {/* Coordinate Chip */}
                  <div className="px-2 py-0.5 rounded bg-white/95 border border-[rgba(41,44,48,0.2)] font-mono text-[9px] font-bold text-[#111315] shadow-xs">
                    {template.coordinates}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function GrowthScene() {
  const router = useRouter();
  const { user } = useAuth();

  const handleExploreAll = () => {
    router.push(user ? '/dashboard/templates' : '/signin');
  };

  return (
    <section id="growth" className="relative py-24 sm:py-32 lg:py-36 bg-[#F4F4F2] select-none">
      {/* Background Subtle Tech Dot Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(41, 44, 48, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ── Section Header (Longer, Thinner Editorial Layout matching WorkflowScene) ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 font-mono text-[11px] tracking-[0.2em] uppercase text-[#777C82]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>Production Archetypes</span>
            </div>
            <h2
              className="text-[34px] sm:text-[48px] lg:text-[58px] font-medium sm:font-semibold tracking-[-0.03em] text-[#111315] leading-[1.08] max-w-3xl"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
            >
              Template showcase.
              <br />
              Engineered for your story.
              <br />
              From day one.
            </h2>
          </div>

          {/* Right Action: All templates link */}
          <button
            onClick={handleExploreAll}
            className="group inline-flex items-center gap-1.5 font-mono text-[12px] sm:text-[13px] font-semibold text-[#111315] hover:text-[#EF4444] transition-colors cursor-pointer self-start sm:self-auto mb-2"
          >
            <span>All templates</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* ── Stacking Cards on Scroll (Smooth on Mouse Wheel & Trackpad) ── */}
        <div className="relative w-full pb-16 sm:pb-24">
          {TEMPLATES.map((tpl, idx) => (
            <TemplateStackCard
              key={tpl.id}
              template={tpl}
              index={idx}
              total={TEMPLATES.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}