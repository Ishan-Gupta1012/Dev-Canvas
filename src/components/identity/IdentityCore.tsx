'use client';

import React from 'react';
import { motion, MotionValue, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Briefcase, GraduationCap, Globe, Trophy } from 'lucide-react';
import FillGroup from './FillGroup';
import {
  achievement,
  education,
  experience,
  profile,
  projectsFor,
  skills,
} from './identityData';

const Label = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2.5"
    style={{ color: '#96703F' }}
  >
    {children}
  </p>
);

export interface IdentityCoreProps {
  /** 0 = loosely organized (dashed slots), 1 = fully assembled. */
  progress?: MotionValue<number>;
  /** Include the project that arrives in the growth scene. */
  includeNewProject?: boolean;
  /** Freeze transform motion (reduced-motion). */
  reduce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function IdentityCore({
  progress,
  includeNewProject = false,
  reduce = false,
  className = '',
  style,
}: IdentityCoreProps) {
  const staticOne = useMotionValue(1);
  const p = progress ?? staticOne;
  const projects = projectsFor(includeNewProject);

  return (
    <article
      className={`relative w-full max-w-[560px] rounded-2xl overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(120% 80% at 84% -12%, rgba(224, 188, 128, 0.42) 0%, transparent 60%), radial-gradient(95% 70% at 4% 106%, rgba(176, 132, 72, 0.26) 0%, transparent 64%), linear-gradient(165deg, #FBF5E9 0%, #F2E3CA 55%, #E4CEA8 100%)',
        border: '1px solid rgba(122, 88, 48, 0.26)',
        boxShadow:
          '0 28px 70px rgba(90, 62, 34, 0.2), 0 0 55px rgba(198, 157, 94, 0.2), inset 0 1px 0 rgba(255, 253, 246, 0.85), inset 0 0 80px rgba(150, 106, 52, 0.08)',
        ...style,
      }}
    >
      {/* Object chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(122, 88, 48, 0.16)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded"
            style={{ background: 'linear-gradient(140deg, #EBCF97, #B0803F)' }}
          />
          <span className="text-[10.5px] tracking-wide" style={{ color: '#7A5B39' }}>
            Identity
          </span>
        </div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium"
                  style={{
                    color: '#5C4326',
                    background: 'rgba(255, 248, 232, 0.9)',
                    border: '1px solid rgba(163, 118, 56, 0.3)',
                  }}
                >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C08B3E]" />
          Live profile
        </span>
      </div>

      {/* Ambient identity focal point */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute top-16 left-1/2 -translate-x-1/2 opacity-70" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="58" stroke="rgba(190, 147, 82, 0.32)" strokeWidth="1" />
          <circle cx="80" cy="80" r="42" stroke="rgba(173, 126, 63, 0.3)" strokeWidth="1" />
          <motion.circle
            cx="80"
            cy="22"
            r="2.2"
            fill="rgba(190, 147, 82, 0.65)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="140"
            cy="66"
            r="2"
            fill="rgba(176, 128, 63, 0.65)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="80"
            cy="138"
            r="2.2"
            fill="rgba(190, 147, 82, 0.6)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
          <motion.circle
            cx="20"
            cy="66"
            r="2"
            fill="rgba(176, 128, 63, 0.6)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          />
        </svg>
        <motion.div
          className="absolute top-24 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(228, 196, 137, 0.38) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="p-5 sm:p-6 space-y-5 relative z-10">
        {/* Profile header */}
        <FillGroup p={p} range={[0, 0.18]} slotLabel="Your profile" reduce={reduce}>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full overflow-hidden shrink-0"
              style={{ border: '1px solid rgba(163, 118, 56, 0.3)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={`${profile.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-tight" style={{ color: '#35261E' }}>
                {profile.name}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: '#6B5138' }}>
                {profile.role}
              </p>
            </div>
            <span
              className="ml-auto hidden sm:flex items-center gap-1.5 text-[10.5px] px-2.5 py-1.5 rounded-lg shrink-0"
              style={{
                color: '#5C4326',
                background: 'rgba(255, 248, 232, 0.9)',
                border: '1px solid rgba(163, 118, 56, 0.3)',
              }}
            >
              <Globe className="w-3 h-3" />
              {profile.site}
            </span>
          </div>
        </FillGroup>

        {/* Skills */}
        <FillGroup p={p} range={[0.1, 0.32]} slotLabel="Skills" reduce={reduce}>
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md text-[11.5px] font-medium"
                style={{
                  color: '#5C4326',
                  background: 'rgba(255, 249, 236, 0.72)',
                  border: '1px solid rgba(163, 118, 56, 0.3)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </FillGroup>

        {/* Projects */}
        <FillGroup p={p} range={[0.26, 0.52]} slotLabel="Projects" reduce={reduce}>
          <Label>Projects</Label>
          <div className="space-y-2.5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3.5 rounded-xl p-2.5"
                style={{
                  background: 'rgba(255, 249, 236, 0.8)',
                  border: `1px solid ${
                    project.id === 'linkops'
                      ? 'rgba(176, 128, 63, 0.6)'
                      : 'rgba(122, 88, 48, 0.18)'
                  }`,
                }}
              >
                <div
                  className="w-20 h-14 rounded-lg overflow-hidden shrink-0"
                  style={{ border: '1px solid rgba(163, 118, 56, 0.28)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-[13px] font-semibold truncate"
                      style={{ color: '#35261E' }}
                    >
                      {project.title}
                    </p>
                    {project.id === 'linkops' && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: 'linear-gradient(135deg, #EBCF97, #B0803F)', color: '#3A2716' }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: '#6B5138' }}>
                    {project.subtitle}
                  </p>
                  <p className="text-[9.5px] truncate mt-0.5" style={{ color: '#93795B' }}>
                    {project.stack}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" style={{ color: '#A9762F' }} />
              </div>
            ))}
          </div>
        </FillGroup>

        {/* Experience + Education */}
        <FillGroup
          p={p}
          range={[0.46, 0.72]}
          slotLabel="Experience & education"
          reduce={reduce}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Experience</Label>
              <div className="flex items-start gap-2">
                <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#A9762F' }} />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: '#35261E' }}>
                    {experience.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#6B5138' }}>
                    {experience.org}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 font-mono"
                    style={{ color: '#93795B' }}
                  >
                    {experience.period}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label>Education</Label>
              <div className="flex items-start gap-2">
                <GraduationCap
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: '#A9762F' }}
                />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: '#35261E' }}>
                    {education.degree}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#6B5138' }}>
                    {education.org}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 font-mono"
                    style={{ color: '#93795B' }}
                  >
                    {education.period}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FillGroup>

        {/* Achievement + stats */}
        <FillGroup p={p} range={[0.64, 0.88]} slotLabel="Achievements" reduce={reduce}>
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3.5 py-3"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 242, 222, 0.92), rgba(236, 214, 172, 0.85))',
              border: '1px solid rgba(163, 118, 56, 0.3)',
            }}
          >
            <span className="flex items-center gap-2 text-[12px] font-medium" style={{ color: '#5C4326' }}>
              <Trophy className="w-4 h-4" style={{ color: '#A9762F' }} />
              {achievement}
            </span>
            <span className="text-[10.5px] font-mono" style={{ color: '#6B5138' }}>
              {profile.stats.contributions} contributions · {profile.stats.repos}
            </span>
          </div>
        </FillGroup>
      </div>
    </article>
  );
}
