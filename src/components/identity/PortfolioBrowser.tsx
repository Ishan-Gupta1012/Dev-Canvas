'use client';

import React from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Share2 } from 'lucide-react';
import FillGroup from './FillGroup';
import { profile, projectsFor, skills } from './identityData';

const NAV_LINKS = ['Home', 'Work', 'About', 'Contact'] as const;

/* Warm paper + amber ink palette shared with the Identity Core. */
const INK = '#35261E';
const BODY = '#6B5138';
const MUTED = '#93795B';
const GOLD = '#B07C33';
const AMBER = '#C08B3E';
const HAIRLINE = 'rgba(122, 88, 48, 0.14)';

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
          'radial-gradient(120% 90% at 88% -10%, rgba(230, 194, 130, 0.4) 0%, transparent 60%), linear-gradient(160deg, #FCF7EC 0%, #F5E9D4 60%, #EEDCBE 100%)',
        border: '1px solid rgba(122, 88, 48, 0.24)',
        boxShadow:
          '0 40px 90px rgba(90, 62, 34, 0.3), 0 0 70px rgba(201, 160, 95, 0.2), inset 0 1px 0 rgba(255, 253, 246, 0.85)',
        ...style,
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.38)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.26)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.16)' }} />
        </div>
        <div
          className="flex-1 max-w-[320px] mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono"
          style={{
            color: MUTED,
            background: 'rgba(255, 250, 240, 0.7)',
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
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
            className="w-3.5 h-3.5 rounded"
            style={{ background: 'linear-gradient(140deg, #EBCF97, #B0803F)' }}
          />
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
                  background: 'linear-gradient(140deg, #FBF1DD 0%, #F1E0C0 70%)',
                  border: '1px solid rgba(163, 118, 56, 0.2)',
                }}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 w-[44%] flex items-end justify-center overflow-hidden"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 30%, rgba(224, 183, 112, 0.55) 0%, rgba(240, 219, 182, 0.55) 45%, rgba(250, 242, 228, 0.9) 100%)',
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
                  <p className="text-[9px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: GOLD }}>
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
                        color: '#3A2716',
                        background: 'linear-gradient(140deg, #EBCF97, #C08B3E)',
                        boxShadow: '0 6px 16px rgba(176, 128, 63, 0.3)',
                      }}
                    >
                      View Projects
                    </span>
                    <span
                      className="px-3 py-1.5 rounded-md text-[10.5px] font-medium"
                      style={{
                        color: '#5C4326',
                        border: '1px solid rgba(163, 118, 56, 0.3)',
                        background: 'rgba(255, 249, 236, 0.6)',
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
                        background: 'rgba(255, 249, 236, 0.7)',
                        border:
                          project.id === 'linkops'
                            ? '1px solid rgba(176, 128, 63, 0.5)'
                            : '1px solid rgba(122, 88, 48, 0.16)',
                      }}
                    >
                      <div
                        className="relative h-16 sm:h-24 lg:h-28 rounded-lg overflow-hidden"
                        style={{ border: '1px solid rgba(163, 118, 56, 0.24)' }}
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
                            style={{ background: 'linear-gradient(135deg, #EBCF97, #C08B3E)', color: '#3A2716' }}
                          >
                            New
                          </span>
                        ) : (
                          <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
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
                  background: 'rgba(192, 139, 62, 0.12)',
                  border: '1px solid rgba(176, 128, 63, 0.3)',
                }}
              >
                <span className="flex items-center gap-2 text-[11px] font-medium" style={{ color: '#5C4326' }}>
                  <Share2 className="w-3.5 h-3.5" style={{ color: GOLD }} />
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
