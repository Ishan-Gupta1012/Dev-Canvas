'use client';

import React from 'react';
import { motion, MotionValue, useMotionValue } from 'framer-motion';
import {
  ArrowUpRight,
  Briefcase,
  Check,
  GraduationCap,
  Globe,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react';
import FillGroup from './FillGroup';
import {
  achievement,
  education,
  experience,
  profile,
  projectsFor,
  skills,
} from './identityData';

const INK = '#35261E';
const BODY = '#6B5138';
const MUTED = '#93795B';
const GOLD = '#B07C33';
const AMBER = '#C08B3E';
const HAIRLINE = 'rgba(122, 88, 48, 0.16)';

const Label = ({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-2.5">
    <p
      className="text-[9.5px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: '#96703F' }}
    >
      {children}
    </p>
    {action}
  </div>
);

export interface IdentityDesktopProps {
  /** 0 = loosely organized (dashed slots), 1 = fully assembled. */
  progress?: MotionValue<number>;
  /** Include the project + skill that arrive in the growth scene. */
  includeNewProject?: boolean;
  /** Freeze transform motion (reduced-motion). */
  reduce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The live identity rendered as a full desktop website — browser chrome,
 * site navigation, hero, skills, projects, experience, and a published
 * footer. This is what the growth scene shows updating in real time.
 */
export default function IdentityDesktop({
  progress,
  includeNewProject = false,
  reduce = false,
  className = '',
  style,
}: IdentityDesktopProps) {
  const staticOne = useMotionValue(1);
  const p = progress ?? staticOne;
  const projects = projectsFor(includeNewProject);
  const allSkills = includeNewProject ? [...skills, 'Edge Functions'] : [...skills];

  return (
    <article
      className={`relative w-full max-w-[1000px] rounded-[18px] overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(120% 80% at 86% -12%, rgba(224, 188, 128, 0.38) 0%, transparent 58%), radial-gradient(90% 70% at 0% 108%, rgba(176, 132, 72, 0.22) 0%, transparent 62%), linear-gradient(165deg, #FBF5E9 0%, #F3E5CD 52%, #E7D3AE 100%)',
        border: '1px solid rgba(122, 88, 48, 0.26)',
        boxShadow:
          '0 40px 90px rgba(90, 62, 34, 0.24), 0 0 70px rgba(198, 157, 94, 0.2), inset 0 1px 0 rgba(255, 253, 246, 0.9)',
        ...style,
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${HAIRLINE}`, background: 'rgba(255, 250, 240, 0.46)' }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.38)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.26)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(150, 112, 63, 0.16)' }} />
        </div>
        <div
          className="flex-1 max-w-[340px] mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono"
          style={{
            color: MUTED,
            background: 'rgba(255, 250, 240, 0.72)',
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <Globe className="w-2.5 h-2.5" style={{ color: GOLD }} />
          {profile.site}
        </div>
        <span
          className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md shrink-0"
          style={{ color: '#5C4326', background: 'rgba(192, 139, 62, 0.14)', border: '1px solid rgba(176, 128, 63, 0.32)' }}
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#C08B3E] opacity-60 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#C08B3E]" />
          </span>
          Live
        </span>
      </div>

      {/* Site navigation */}
      <div
        className="flex items-center justify-between px-5 sm:px-6 py-3"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-5 h-5 rounded-md"
            style={{ background: 'linear-gradient(140deg, #EBCF97, #B0803F)' }}
          />
          <div className="leading-tight">
            <p className="text-[12px] font-semibold" style={{ color: INK }}>
              {profile.name}
            </p>
            <p className="text-[9px]" style={{ color: MUTED }}>
              Portfolio &rsquo;26
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[11px]" style={{ color: MUTED }}>
          <span style={{ color: INK }}>Work</span>
          <span>Skills</span>
          <span>About</span>
          <span>Contact</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10.5px] font-semibold"
          style={{
            color: '#3A2716',
            background: 'linear-gradient(140deg, #EBCF97, #C08B3E)',
            boxShadow: '0 6px 16px rgba(176, 128, 63, 0.28)',
          }}
        >
          Resume
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>

      {/* Live update toast */}
      {includeNewProject && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:flex absolute right-5 top-[92px] z-20 items-center gap-2 px-3 py-2 rounded-lg text-[10.5px] font-semibold"
          style={{
            color: '#3A2716',
            background: 'linear-gradient(140deg, #FBF1DD, #EFD9B0)',
            border: '1px solid rgba(176, 128, 63, 0.42)',
            boxShadow: '0 12px 28px rgba(90, 62, 34, 0.18)',
          }}
        >
          <span
            className="flex items-center justify-center w-4 h-4 rounded-full"
            style={{ background: 'rgba(176, 128, 63, 0.22)' }}
          >
            <Check className="w-2.5 h-2.5" style={{ color: '#6B4A24' }} />
          </span>
          Portfolio updated · just now
        </motion.div>
      )}

      <div className="p-5 sm:p-6">
        {/* Hero */}
        <FillGroup p={p} range={[0, 0.18]} slotLabel="Your profile" reduce={reduce}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p
                className="text-[9.5px] uppercase tracking-[0.2em] font-semibold mb-2"
                style={{ color: GOLD }}
              >
                Personal portfolio · live
              </p>
              <h3
                className="text-[30px] sm:text-[36px] font-bold leading-[1.04] tracking-tight"
                style={{ color: INK }}
              >
                {profile.name}
              </h3>
              <p className="text-[14px] mt-1" style={{ color: BODY }}>
                {profile.role}
              </p>
              <p className="text-[11.5px] mt-2.5 max-w-[420px] leading-relaxed" style={{ color: MUTED }}>
                {profile.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[10.5px]" style={{ color: MUTED }}>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" style={{ color: GOLD }} />
                  {profile.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" style={{ color: GOLD }} />
                  {profile.stats.contributions} contributions
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span
                  className="px-3.5 py-1.5 rounded-md text-[11px] font-semibold"
                  style={{
                    color: '#3A2716',
                    background: 'linear-gradient(140deg, #EBCF97, #C08B3E)',
                    boxShadow: '0 8px 20px rgba(176, 128, 63, 0.28)',
                  }}
                >
                  View Work
                </span>
                <span
                  className="px-3.5 py-1.5 rounded-md text-[11px] font-medium"
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

            {/* Portrait panel */}
            <div className="lg:col-span-5">
              <div
                className="relative h-[150px] sm:h-[180px] lg:h-full min-h-[170px] rounded-xl overflow-hidden"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 22%, rgba(226, 186, 116, 0.6) 0%, rgba(242, 220, 180, 0.6) 46%, rgba(250, 243, 229, 0.9) 100%)',
                  border: '1px solid rgba(163, 118, 56, 0.24)',
                }}
              >
                <span
                  className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 text-[9px] font-semibold px-2 py-1 rounded"
                  style={{ color: '#5C4326', background: 'rgba(255, 250, 240, 0.85)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Available for work
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={`${profile.name} portrait`}
                  className="absolute bottom-0 right-0 h-[104%] w-auto max-w-none object-contain object-bottom opacity-95"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 24%, black 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </FillGroup>

        {/* Skills · Projects · Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* Skills */}
          <div className="lg:col-span-4">
            <FillGroup p={p} range={[0.1, 0.32]} slotLabel="Skills" reduce={reduce}>
              <Label action={<span className="text-[9px]" style={{ color: MUTED }}>auto-synced</span>}>
                Skills
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((skill) => {
                  const isNew = skill === 'Edge Functions';
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium"
                      style={
                        isNew
                          ? {
                              color: '#3A2716',
                              background: 'linear-gradient(135deg, #F3DDB2, #D7A557)',
                              border: '1px solid rgba(176, 128, 63, 0.6)',
                              boxShadow: '0 4px 12px rgba(176, 128, 63, 0.22)',
                            }
                          : {
                              color: '#5C4326',
                              background: 'rgba(255, 249, 236, 0.72)',
                              border: '1px solid rgba(163, 118, 56, 0.3)',
                            }
                      }
                    >
                      {skill}
                      {isNew && (
                        <span className="text-[7.5px] font-bold uppercase tracking-wider px-1 rounded-sm" style={{ background: 'rgba(58, 39, 22, 0.14)' }}>
                          new
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
              <p className="text-[9.5px] mt-2.5 leading-relaxed" style={{ color: MUTED }}>
                Add a skill once — it appears here, on your resume, and on your live site.
              </p>
            </FillGroup>
          </div>

          {/* Projects */}
          <div className="lg:col-span-5">
            <FillGroup p={p} range={[0.26, 0.52]} slotLabel="Projects" reduce={reduce}>
              <Label action={<span className="text-[9px]" style={{ color: GOLD }}>View all ↗</span>}>
                Featured projects
              </Label>
              <div className="space-y-2">
                {projects.map((project) => {
                  const isNew = project.id === 'linkops';
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 rounded-lg p-2"
                      style={{
                        background: isNew ? 'rgba(255, 249, 236, 0.94)' : 'rgba(255, 249, 236, 0.66)',
                        border: `1px solid ${isNew ? 'rgba(176, 128, 63, 0.62)' : 'rgba(122, 88, 48, 0.16)'}`,
                        boxShadow: isNew ? '0 8px 20px rgba(176, 128, 63, 0.16)' : 'none',
                      }}
                    >
                      <div
                        className="w-14 h-10 rounded-md overflow-hidden shrink-0"
                        style={{ border: '1px solid rgba(163, 118, 56, 0.24)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.image}
                          alt={`${project.title} preview`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11.5px] font-semibold truncate" style={{ color: INK }}>
                            {project.title}
                          </p>
                          {isNew && (
                            <span
                              className="text-[7.5px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-sm shrink-0"
                              style={{ background: 'linear-gradient(135deg, #EBCF97, #C08B3E)', color: '#3A2716' }}
                            >
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] truncate" style={{ color: BODY }}>
                          {project.subtitle}
                        </p>
                        <p className="text-[8.5px] truncate" style={{ color: MUTED }}>
                          {project.stack}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
                    </div>
                  );
                })}
              </div>
            </FillGroup>
          </div>

          {/* Experience + education */}
          <div className="lg:col-span-3">
            <FillGroup
              p={p}
              range={[0.46, 0.72]}
              slotLabel="Experience & education"
              reduce={reduce}
            >
              <Label>Experience</Label>
              <div className="flex items-start gap-2">
                <Briefcase className="w-3 h-3 mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold leading-snug" style={{ color: INK }}>
                    {experience.title}
                  </p>
                  <p className="text-[9.5px] mt-0.5" style={{ color: BODY }}>
                    {experience.org}
                  </p>
                  <p className="text-[8.5px] mt-0.5 font-mono" style={{ color: MUTED }}>
                    {experience.period}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Label>Education</Label>
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-3 h-3 mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold leading-snug" style={{ color: INK }}>
                      {education.degree}
                    </p>
                    <p className="text-[9.5px] mt-0.5" style={{ color: BODY }}>
                      {education.org}
                    </p>
                    <p className="text-[8.5px] mt-0.5 font-mono" style={{ color: MUTED }}>
                      {education.period}
                    </p>
                  </div>
                </div>
              </div>
            </FillGroup>
          </div>
        </div>

        {/* Published footer */}
        <FillGroup p={p} range={[0.64, 0.88]} slotLabel="Achievements" reduce={reduce}>
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 mt-5"
            style={{
              background: 'linear-gradient(135deg, rgba(252, 242, 222, 0.92), rgba(236, 214, 172, 0.85))',
              border: '1px solid rgba(163, 118, 56, 0.3)',
            }}
          >
            <span className="flex items-center gap-2 text-[10.5px] font-medium" style={{ color: '#5C4326' }}>
              <Trophy className="w-3.5 h-3.5" style={{ color: GOLD }} />
              {achievement}
            </span>
            <span className="flex items-center gap-3 text-[9.5px] font-mono" style={{ color: BODY }}>
              {profile.stats.contributions} contributions · {profile.stats.repos}
              <span className="hidden sm:inline-flex items-center gap-1" style={{ color: GOLD }}>
                <Check className="w-2.5 h-2.5" /> Published
              </span>
            </span>
          </div>
        </FillGroup>
      </div>
    </article>
  );
}
