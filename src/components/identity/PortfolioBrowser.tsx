'use client';

import React from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Share2 } from 'lucide-react';
import FillGroup from './FillGroup';
import { profile, projectsFor, skills } from './identityData';

const NAV_LINKS = ['Home', 'Work', 'About', 'Contact'] as const;

/* Porcelain, graphite, silver & subtle lavender palette. */
const INK = '#292C30';
const BODY = '#777C82';
const MUTED = '#777C82';
const SILVER = '#AEB3B9';
const ACCENT = '#B8AFC7';
const HAIRLINE = 'rgba(213, 214, 216, 0.7)';

export interface PortfolioBrowserProps {
  /** 0 = window collapsing to a resume page, 1 = full portfolio site. */
  progress?: MotionValue<number>;
  includeNewProject?: boolean;
  reduce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The published portfolio website inside a browser frame — the same
 * identity and the same projects, now as a shareable personal site.
 * Laid out like a real desktop screen so it can fill the stage.
 */
export default function PortfolioBrowser({
  progress,
  includeNewProject = false,
  reduce = false,
  className = '',
  style,
}: PortfolioBrowserProps) {
  const staticOne = useMotionValue(1);
  const p = progress ?? staticOne;
  const projects = projectsFor(includeNewProject);

  return (
    <div
      className={`relative w-full max-w-[920px] rounded-[18px] overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(120% 90% at 88% -10%, rgba(184, 175, 199, 0.22) 0%, transparent 60%), linear-gradient(160deg, #FAF9F6 0%, #F4F4F2 60%, #E9EAEB 100%)',
        border: '1px solid rgba(213, 214, 216, 0.85)',
        boxShadow:
          '0 40px 90px rgba(41, 44, 48, 0.16), 0 0 50px rgba(184, 175, 199, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        ...style,
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(41, 44, 48, 0.35)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(174, 179, 185, 0.5)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(213, 214, 216, 0.7)' }} />
        </div>
        <div
          className="flex-1 max-w-[320px] mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono"
          style={{
            color: MUTED,
            background: 'rgba(255, 255, 255, 0.85)',
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8AFC7] animate-pulse" />
          {profile.site}
        </div>
      </div>

      {/* Site nav */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-md flex items-center justify-center text-[7px] font-bold text-white shadow-xs"
            style={{ background: 'linear-gradient(140deg, #D5D6D8, #292C30)' }}
          >
            ✦
          </span>
          <span className="text-[10.5px] font-semibold" style={{ color: INK }}>
            {profile.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[9.5px]" style={{ color: MUTED }}>
          {NAV_LINKS.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="lg:grid lg:grid-cols-12 lg:gap-5">
          {/* Hero — the personal introduction */}
          <div className="lg:col-span-7">
            <FillGroup p={p} range={[0, 0.24]} reduce={reduce}>
              <div
                className="relative rounded-xl overflow-hidden min-h-[152px] sm:min-h-[210px] lg:min-h-[320px]"
                style={{
                  background: 'linear-gradient(140deg, #F4F4F2 0%, #E9EAEB 70%)',
                  border: '1px solid rgba(213, 214, 216, 0.7)',
                }}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-[44%] flex items-end justify-center overflow-hidden"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 30%, rgba(184, 175, 199, 0.35) 0%, rgba(213, 214, 216, 0.35) 45%, rgba(244, 244, 242, 0.9) 100%)',
                    maskImage: 'linear-gradient(to right, transparent, black 35%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt=""
                    className="h-[86%] w-auto object-contain object-bottom opacity-95"
                  />
                </div>
                <div className="relative p-4 sm:p-5 max-w-[62%]">
                  <p className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: SILVER }}>
                    Portfolio
                  </p>
                  <p className="text-[22px] min-[380px]:text-[26px] sm:text-[30px] font-bold leading-tight" style={{ color: INK }}>
                    {profile.name}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: BODY }}>
                    {profile.role}
                  </p>
                  <p className="text-[9.5px] mt-1 leading-relaxed hidden sm:block" style={{ color: MUTED }}>
                    {skills.join(' · ')}
                  </p>
                  <div className="flex items-center gap-2 mt-3.5">
                    <span
                      className="px-3 py-1.5 rounded-md text-[10.5px] font-semibold"
                      style={{
                        color: '#F4F4F2',
                        background: 'linear-gradient(140deg, #292C30, #1E2023)',
                        boxShadow: '0 4px 14px rgba(41, 44, 48, 0.2)',
                      }}
                    >
                      View Projects
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-md text-[10.5px] font-medium"
                      style={{
                        color: '#292C30',
                        border: '1px solid #D5D6D8',
                        background: 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      Contact
                    </span>
                  </div>
                </div>
              </div>
            </FillGroup>
          </div>

          {/* Projects + published state */}
          <div className="mt-4 lg:mt-0 lg:col-span-5 flex flex-col">
            {/* On short phones the card stays a clean hero + published state. */}
            <div className="[@media(max-height:840px)_and_(max-width:1023px)]:hidden">
              <FillGroup p={p} range={[0.18, 0.52]} reduce={reduce}>
                <p className="text-[12.5px] font-semibold mb-2.5" style={{ color: INK }}>
                  Featured Projects
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl p-2.5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        border:
                          project.id === 'linkops'
                            ? '1px solid rgba(184, 175, 199, 0.7)'
                            : '1px solid rgba(213, 214, 216, 0.7)',
                      }}
                    >
                      <div
                        className="relative h-16 sm:h-24 lg:h-28 rounded-lg overflow-hidden"
                        style={{ border: '1px solid rgba(213, 214, 216, 0.7)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2.5">
                        <p className="text-[12px] font-semibold truncate" style={{ color: INK }}>
                          {project.title}
                        </p>
                        {project.id === 'linkops' ? (
                          <span
                            className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: 'linear-gradient(135deg, #B8AFC7, #777C82)', color: '#F4F4F2' }}
                          >
                            New
                          </span>
                        ) : (
                          <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: SILVER }} />
                        )}
                      </div>
                      <p className="text-[10px] mt-0.5 leading-snug" style={{ color: MUTED }}>
                        {project.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </FillGroup>
            </div>

            <FillGroup p={p} range={[0.5, 0.76]} reduce={reduce}>
              <div
                className="mt-3 flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5"
                style={{
                  background: 'rgba(244, 244, 242, 0.9)',
                  border: '1px solid rgba(213, 214, 216, 0.7)',
                }}
              >
                <span className="flex items-center gap-2 text-[11px] font-medium" style={{ color: '#292C30' }}>
                  <Share2 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                  Published · live
                </span>
                <span className="text-[10px] font-mono" style={{ color: MUTED }}>
                  {profile.site}
                </span>
              </div>
            </FillGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
