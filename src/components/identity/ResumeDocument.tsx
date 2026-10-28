'use client';

import React from 'react';
import { MotionValue, useMotionValue } from 'framer-motion';
import { Briefcase, GraduationCap, Mail, MapPin } from 'lucide-react';
import FillGroup from './FillGroup';
import {
  education,
  experience,
  profile,
  projectsFor,
  skills,
} from './identityData';

const INK = '#241812';
const HEADING = '#1F1410';
const MUTED = '#6E625C';
const FAINT = '#8A7E77';
const ACCENT = '#A9762F';

/* ─── GitHub mark (lucide dropped brand icons) ─── */
export const GithubMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-2.5">
    <Briefcase className="w-3.5 h-3.5" style={{ color: ACCENT }} />
    <p className="text-[13px] font-bold tracking-wide" style={{ color: HEADING }}>
      {children}
    </p>
  </div>
);

export interface ResumeDocumentProps {
  /** 0 = document forming, 1 = fully written. */
  progress?: MotionValue<number>;
  includeNewProject?: boolean;
  reduce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The light resume document — the same identity, reorganized as a
 * professional one-page resume. Reads every fact from identityData.
 */
export default function ResumeDocument({
  progress,
  includeNewProject = false,
  reduce = false,
  className = '',
  style,
}: ResumeDocumentProps) {
  const staticOne = useMotionValue(1);
  const p = progress ?? staticOne;
  const projects = projectsFor(includeNewProject);

  return (
    <div
      className={`relative w-full max-w-[480px] rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(170deg, #FCF6EA 0%, #F4E9D7 100%)',
        border: '1px solid rgba(226, 205, 172, 0.7)',
        boxShadow:
          '0 40px 90px rgba(0, 0, 0, 0.5), 0 0 60px rgba(201, 160, 95, 0.2), inset 0 1px 0 rgba(255, 253, 246, 0.85)',
        ...style,
      }}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <FillGroup p={p} range={[0, 0.16]} reduce={reduce}>
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-full overflow-hidden shrink-0"
              style={{ border: '2px solid rgba(255, 255, 255, 0.7)', boxShadow: '0 4px 14px rgba(0,0,0,0.16)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar} alt={`${profile.name} avatar`} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[18px] font-bold leading-tight" style={{ color: HEADING }}>
                {profile.name}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: MUTED }}>
                {profile.role}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 mt-3 text-[10.5px]" style={{ color: MUTED }}>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              Contact
            </span>
            <span className="flex items-center gap-1.5">
              <GithubMark className="w-3 h-3" />
              GitHub
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {profile.location}
            </span>
          </div>
        </FillGroup>

        <div className="h-px" style={{ background: 'rgba(36, 24, 18, 0.1)' }} />

        {/* Experience */}
        <FillGroup p={p} range={[0.12, 0.36]} reduce={reduce}>
          <SectionTitle>Experience</SectionTitle>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold" style={{ color: INK }}>
                {experience.title}
              </p>
              <p className="text-[11.5px] mt-0.5" style={{ color: MUTED }}>
                {experience.org}
              </p>
              <p className="text-[10.5px] mt-0.5" style={{ color: FAINT }}>
                {experience.detail}
              </p>
            </div>
            <p className="text-[10.5px] whitespace-nowrap mt-0.5 font-mono" style={{ color: FAINT }}>
              {experience.period}
            </p>
          </div>
        </FillGroup>

        {/* Education */}
        <FillGroup p={p} range={[0.3, 0.52]} reduce={reduce}>
          <SectionTitle>Education</SectionTitle>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold" style={{ color: INK }}>
                {education.degree}
              </p>
              <p className="text-[11.5px] mt-0.5" style={{ color: MUTED }}>
                {education.org}
              </p>
            </div>
            <p className="text-[10.5px] whitespace-nowrap mt-0.5 font-mono" style={{ color: FAINT }}>
              {education.period}
            </p>
          </div>
        </FillGroup>

        {/* Skills */}
        <FillGroup p={p} range={[0.46, 0.66]} reduce={reduce}>
          <div className="flex items-center gap-2 mb-2.5">
            <GraduationCap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            <p className="text-[13px] font-bold tracking-wide" style={{ color: HEADING }}>
              Skills
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[11px] font-medium"
                style={{ color: '#4A3B33', background: 'rgba(36, 24, 18, 0.06)', border: '1px solid rgba(36, 24, 18, 0.1)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </FillGroup>

        {/* Projects */}
        <FillGroup p={p} range={[0.6, 0.86]} reduce={reduce}>
          <div className="flex items-center gap-2 mb-2.5">
            <Briefcase className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            <p className="text-[13px] font-bold tracking-wide" style={{ color: HEADING }}>
              Projects
            </p>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg px-2.5 py-1.5"
                style={
                  project.id === 'linkops'
                    ? { background: 'rgba(192, 139, 62, 0.1)', border: '1px solid rgba(176, 128, 63, 0.34)' }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px] font-semibold" style={{ color: INK }}>
                    {project.title}
                  </p>
                  {project.id === 'linkops' && (
                    <span
                      className="text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[#FBF4E7]"
                      style={{ background: ACCENT }}
                    >
                      New
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                  {project.subtitle} · {project.stack}
                </p>
              </div>
            ))}
          </div>
        </FillGroup>
      </div>
    </div>
  );
}
