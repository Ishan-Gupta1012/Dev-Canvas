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
    style={{ color: '#777C82' }}
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
          'radial-gradient(120% 80% at 84% -12%, rgba(184, 175, 199, 0.25) 0%, transparent 60%), radial-gradient(95% 70% at 4% 106%, rgba(174, 179, 185, 0.22) 0%, transparent 64%), linear-gradient(165deg, #FAF9F6 0%, #F4F4F2 55%, #E9EAEB 100%)',
        border: '1px solid rgba(213, 214, 216, 0.95)',
        boxShadow:
          '0 28px 70px rgba(41, 44, 48, 0.12), 0 0 50px rgba(184, 175, 199, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        ...style,
      }}
    >
      {/* Object chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(213, 214, 216, 0.7)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
            style={{ background: 'linear-gradient(140deg, #D5D6D8, #292C30)' }}
          >
            ✦
          </span>
          <span className="text-[10.5px] tracking-wide font-medium" style={{ color: '#777C82' }}>
            Identity
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium"
          style={{
            color: '#292C30',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(213, 214, 216, 0.7)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8AFC7] animate-pulse" />
          Live profile
        </span>
      </div>

      {/* Ambient identity focal point */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="absolute top-16 left-1/2 -translate-x-1/2 opacity-70" width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="58" stroke="rgba(174, 179, 185, 0.45)" strokeWidth="1" />
          <circle cx="80" cy="80" r="42" stroke="rgba(184, 175, 199, 0.35)" strokeWidth="1" />
          <motion.circle
            cx="80"
            cy="22"
            r="2.2"
            fill="rgba(174, 179, 185, 0.75)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="140"
            cy="66"
            r="2"
            fill="rgba(184, 175, 199, 0.75)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.circle
            cx="80"
            cy="138"
            r="2.2"
            fill="rgba(174, 179, 185, 0.75)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          />
          <motion.circle
            cx="20"
            cy="66"
            r="2"
            fill="rgba(184, 175, 199, 0.75)"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
          />
        </svg>
        <motion.div
          className="absolute top-24 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 175, 199, 0.35) 0%, transparent 70%)',
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
              style={{ border: '2px solid rgba(213, 214, 216, 0.8)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={`${profile.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[20px] font-bold leading-tight" style={{ color: '#292C30' }}>
                {profile.name}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: '#777C82' }}>
                {profile.role}
              </p>
            </div>
            <span
              className="ml-auto hidden sm:flex items-center gap-1.5 text-[10.5px] px-2.5 py-1.5 rounded-lg shrink-0 font-medium"
              style={{
                color: '#292C30',
                background: 'rgba(244, 244, 242, 0.95)',
                border: '1px solid rgba(213, 214, 216, 0.7)',
              }}
            >
              <Globe className="w-3 h-3 text-[#777C82]" />
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
                  color: '#292C30',
                  background: 'rgba(244, 244, 242, 0.85)',
                  border: '1px solid rgba(213, 214, 216, 0.7)',
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
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: `1px solid ${
                    project.id === 'linkops'
                      ? 'rgba(184, 175, 199, 0.8)'
                      : 'rgba(213, 214, 216, 0.65)'
                  }`,
                }}
              >
                <div
                  className="w-20 h-14 rounded-lg overflow-hidden shrink-0"
                  style={{ border: '1px solid rgba(213, 214, 216, 0.7)' }}
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
                      style={{ color: '#292C30' }}
                    >
                      {project.title}
                    </p>
                    {project.id === 'linkops' && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: 'linear-gradient(135deg, #B8AFC7, #777C82)', color: '#F4F4F2' }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: '#777C82' }}>
                    {project.subtitle}
                  </p>
                  <p className="text-[9.5px] truncate mt-0.5" style={{ color: '#AEB3B9' }}>
                    {project.stack}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" style={{ color: '#777C82' }} />
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
                <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#777C82' }} />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: '#292C30' }}>
                    {experience.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#777C82' }}>
                    {experience.org}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 font-mono"
                    style={{ color: '#AEB3B9' }}
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
                  style={{ color: '#777C82' }}
                />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: '#292C30' }}>
                    {education.degree}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#777C82' }}>
                    {education.org}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 font-mono"
                    style={{ color: '#AEB3B9' }}
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
              background: 'linear-gradient(135deg, rgba(250, 249, 246, 0.95), rgba(244, 244, 242, 0.9))',
              border: '1px solid rgba(213, 214, 216, 0.7)',
            }}
          >
            <span className="flex items-center gap-2 text-[12px] font-medium" style={{ color: '#292C30' }}>
              <Trophy className="w-4 h-4" style={{ color: '#AEB3B9' }} />
              {achievement}
            </span>
            <span className="text-[10.5px] font-mono" style={{ color: '#777C82' }}>
              {profile.stats.contributions} contributions · {profile.stats.repos}
            </span>
          </div>
        </FillGroup>
      </div>
    </article>
  );
}
