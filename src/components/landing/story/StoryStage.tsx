"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DeveloperFigure } from "./DeveloperFigure";
import { FloatingFragment, GroupLabel } from "./Fragments";
import { PhoneMockup, PortfolioMockup, ProfileMockup, ResumeMockup } from "./Mockups";
import { StoryBackdrop } from "./StoryBackdrop";
import { FRAGMENTS } from "./data";

interface StageProps {
  onEnter: () => void;
  onSeeProcess: () => void;
}

function ChapterCopy({
  progress,
  start,
  end,
  eyebrow,
  title,
  body,
  meta,
  active,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  meta: string;
  active: boolean;
}) {
  const opacity = useTransform(
    progress,
    [start, start + 0.028, end - 0.028, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, end], [22, -22]);
  const pointerEvents = useTransform(opacity, (value) => (value > 0.08 ? "auto" : "none"));
  const visibility = useTransform(opacity, (value) =>
    value > 0.05 ? "visible" : "hidden",
  );

  return (
    <motion.div
      className="story-copy-panel"
      style={{ opacity, y, pointerEvents, visibility }}
      aria-hidden={!active}
    >
      <div className="story-eyebrow">{eyebrow}</div>
      <h2 className="story-display" style={{ marginTop: 18 }}>
        {title}
      </h2>
      <p className="story-copy-body">{body}</p>
      <span className="story-copy-meta">
        <i />
        {meta}
      </span>
    </motion.div>
  );
}

export default function StoryStage({ onEnter, onSeeProcess }: StageProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.45,
    restDelta: 0.0005,
  });

  useMotionValueEvent(progress, "change", (value) => {
    const next =
      value < 0.095 ? 0 : value < 0.295 ? 1 : value < 0.495 ? 2 : value < 0.695 ? 3 : 4;
    setActiveScene((current) => (current === next ? current : next));
  });

  /* hero */
  const heroOpacity = useTransform(progress, [0, 0.045, 0.09, 0.12], [1, 1, 0, 0]);
  const heroY = useTransform(progress, [0, 0.12], [0, -34]);
  const heroPointer = useTransform(heroOpacity, (value) =>
    value > 0.08 ? "auto" : "none",
  );
  const heroVisibility = useTransform(heroOpacity, (value) =>
    value > 0.05 ? "visible" : "hidden",
  );

  /* atmosphere */
  const spotlightX = useTransform(progress, [0, 0.35, 0.75, 1], ["67%", "67%", "68%", "66%"]);
  const spotlightOpacity = useTransform(progress, [0, 0.3, 0.75, 1], [0.9, 1, 0.8, 0.7]);
  const archOpacity = useTransform(progress, [0, 0.3, 0.8, 1], [0.7, 0.9, 0.55, 0.5]);
  const warmth = useTransform(progress, [0, 0.35, 0.75, 1], [0, 0.1, 0.16, 0.08]);

  /* protagonist */
  const figureLeft = useTransform(
    progress,
    [0, 0.12, 0.3, 0.7, 1],
    ["66%", "65%", "64%", "63%", "62%"],
  );
  const figureScale = useTransform(
    progress,
    [0, 0.12, 0.3, 0.7, 1],
    [1, 1, 0.96, 0.94, 0.92],
  );
  const figureOpacity = useTransform(progress, [0, 0.3, 0.35], [1, 1, 0]);

  /* profile */
  const profileOpacity = useTransform(progress, [0.285, 0.33, 0.475, 0.505], [0, 1, 1, 0]);
  const profileScale = useTransform(progress, [0.285, 0.345, 0.475, 0.505], [0.9, 1, 1, 0.95]);
  const profileY = useTransform(progress, [0.285, 0.345], [26, 0]);

  /* resume */
  const resumeOpacity = useTransform(progress, [0.495, 0.53, 0.7, 0.735], [0, 1, 1, 0]);
  const resumeLeft = useTransform(progress, [0.5, 0.7, 0.79, 1], ["67%", "67%", "47%", "47%"]);
  const resumeScale = useTransform(
    progress,
    [0.495, 0.545, 0.7, 0.8, 1],
    [0.94, 1, 1, 0.56, 0.56],
  );
  const resumeY = useTransform(progress, [0.495, 0.55], [18, 0]);
  const resumeScanTop = useTransform(progress, [0.5, 0.6], ["0%", "100%"]);
  const resumeScanOpacity = useTransform(progress, [0.5, 0.54, 0.6, 0.63], [0, 0.9, 0.9, 0]);
  const generatedOpacity = useTransform(progress, [0.54, 0.575, 0.7, 0.735], [0, 1, 1, 0]);

  /* portfolio */
  const portfolioOpacity = useTransform(progress, [0.705, 0.765, 0.95, 1], [0, 1, 1, 1]);
  const portfolioClip = useTransform(
    progress,
    [0.705, 0.79],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const portfolioScale = useTransform(progress, [0.705, 0.82, 1], [0.93, 1, 1]);
  const portfolioX = useTransform(progress, [0.705, 0.82], [24, 0]);
  const portfolioScanTop = useTransform(progress, [0.73, 0.84], ["0%", "100%"]);
  const portfolioScanOpacity = useTransform(progress, [0.73, 0.77, 0.84, 0.87], [0, 0.7, 0.7, 0]);
  const portfolioBadgeOpacity = useTransform(progress, [0.78, 0.82, 0.95, 1], [0, 1, 1, 0.8]);

  const sourceOpacity = useTransform(progress, [0.78, 0.83, 0.95, 1], [0, 1, 1, 0.7]);

  /* paper transition only appears as the stage hands off to the process */
  const paperEdgeOpacity = useTransform(progress, [0.84, 0.95], [0, 1]);

  /* rail */
  const railOpacity = useTransform(progress, [0, 0.04, 0.1], [0, 0, 1]);
  const railScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section ref={runwayRef} id="features" className="story-runway" aria-label="The transformation story">
      <div className="story-stage">
        <div className="story-stage-bg" />
        <StoryBackdrop variant="stage" />

        {/* Constellation Network Connecting Threads matching screenshot */}
        <motion.svg
          className="pointer-events-none absolute inset-0 w-full h-full z-[8]"
          style={{ opacity: heroOpacity }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-thread-grad" x1="66%" y1="48%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E08758" stopOpacity="0.4" />
            </linearGradient>
            <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {FRAGMENTS.map((f) => (
            <g key={`thread-${f.id}`}>
              <line
                x1="66"
                y1="48"
                x2={f.start.x + 3}
                y2={f.start.y + 4}
                stroke="url(#hero-thread-grad)"
                strokeWidth="0.2"
                strokeDasharray="1.2 0.8"
                filter="url(#hero-glow)"
              />
              <circle
                cx={f.start.x + 3}
                cy={f.start.y + 4}
                r="0.45"
                fill="#C4B5FD"
                filter="url(#hero-glow)"
              />
            </g>
          ))}
          <circle cx="66" cy="48" r="0.7" fill="#C4B5FD" opacity="0.8" />
        </motion.svg>

        <motion.div
          className="story-spotlight"
          style={{ left: spotlightX, opacity: spotlightOpacity }}
        />
        <motion.div className="story-arch" style={{ opacity: archOpacity }} />
        <div className="story-floor" />
        <div className="story-grid" />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: warmth,
            background:
              "radial-gradient(ellipse 50% 55% at 68% 44%, rgba(167,139,250,0.18), transparent 70%)",
          }}
        />

        {/* The protagonist remains in every chapter. */}
        <motion.div
          className="story-figure"
          style={{ left: figureLeft, scale: figureScale, opacity: figureOpacity }}
          aria-hidden="true"
        >
          <DeveloperFigure />
        </motion.div>

        {/* The same fragments that open the story. */}
        {FRAGMENTS.map((fragment) => (
          <FloatingFragment key={fragment.id} fragment={fragment} progress={progress} />
        ))}

        <GroupLabel progress={progress} label="Skills" x={43} y={9} />
        <GroupLabel progress={progress} label="Projects" x={74} y={40} />
        <GroupLabel progress={progress} label="Proof" x={53} y={74} />

        {/* Chapter 2: the profile */}
        <motion.div
          className="story-profile-wrap"
          style={{ opacity: profileOpacity, scale: profileScale, y: profileY }}
          aria-hidden="true"
        >
          <ProfileMockup />
        </motion.div>

        {/* Chapter 3: the resume */}
        <motion.div
          className="story-resume-wrap"
          style={{
            opacity: resumeOpacity,
            left: resumeLeft,
            scale: resumeScale,
            y: resumeY,
          }}
          aria-hidden="true"
        >
          <ResumeMockup />
          <motion.div
            className="story-generated-badge"
            style={{ opacity: generatedOpacity }}
          >
            <span className="story-generated-icon">
              <Check size={10} strokeWidth={2.4} />
            </span>
            Resume Generated
          </motion.div>
          <motion.span
            className="story-scan"
            style={{ top: resumeScanTop, opacity: resumeScanOpacity }}
          />
        </motion.div>

        {/* Chapter 4: the portfolio unfolds from the resume */}
        <motion.div
          className="story-portfolio-wrap"
          style={{
            opacity: portfolioOpacity,
            clipPath: portfolioClip,
            scale: portfolioScale,
            x: portfolioX,
          }}
          aria-hidden="true"
        >
          <div className="story-portfolio-combo">
            <PortfolioMockup />
            <PhoneMockup className="story-phone" />
          </div>
          <motion.div
            className="story-portfolio-badge"
            style={{ opacity: portfolioBadgeOpacity }}
          >
            <Sparkles size={10} strokeWidth={1.9} />
            Resume → Portfolio
          </motion.div>
          <motion.span
            className="story-scan"
            style={{ top: portfolioScanTop, opacity: portfolioScanOpacity }}
          />
        </motion.div>

        <motion.span
          className="story-source-line"
          style={{
            opacity: sourceOpacity,
            left: "48%",
            top: "61%",
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden="true"
        >
          same profile
        </motion.span>

        {/* Hero copy */}
        <motion.div
          className="story-hero-copy"
          style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointer, visibility: heroVisibility }}
          aria-hidden={activeScene !== 0}
        >
          <motion.h1
            className="story-hero-title font-sans font-bold"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            You&apos;ve Built the Skills.
            <br />
            Now Give Them a
            <br />
            Presence.
          </motion.h1>

          <motion.p
            className="story-hero-body"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Turn your skills, projects, and achievements into a professional resume
            and personal portfolio in minutes. Keep your professional identity growing
            as you do.
          </motion.p>

          <motion.div
            className="story-hero-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="story-btn story-btn--primary" onClick={onEnter}>
              Build My Identity
              <span className="btn-arrow" aria-hidden="true">
                <ArrowRight size={13} strokeWidth={2} />
              </span>
            </button>
            <button type="button" className="story-btn story-btn--ghost" onClick={onSeeProcess}>
              See How It Works
            </button>
          </motion.div>

          <motion.div
            className="story-hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <span className="scroll-arrow" aria-hidden="true">↓</span>
            Scroll to explore
          </motion.div>
        </motion.div>

        {/* Chapter copy */}
        <ChapterCopy
          progress={progress}
          start={0.105}
          end={0.285}
          eyebrow="01 / 07 · The potential"
          title={
            <>
              The Potential Is <em>Already There.</em>
            </>
          }
          body="You've built the skills, shipped the projects, and earned the achievements. Now they need one place to come together — and a way to be seen."
          meta="Skills · Projects · Experience · Education"
          active={activeScene === 1}
        />

        <ChapterCopy
          progress={progress}
          start={0.305}
          end={0.485}
          eyebrow="02 / 07 · One place"
          title={
            <>
              Bring Everything You&apos;ve Done{" "}
              <em>Into One Place.</em>
            </>
          }
          body="Start with your existing skills, projects, achievements, education, and experience. We help you shape them into a profile that reads as one story."
          meta="Profile · 8 skills · 3 projects · 3 achievements"
          active={activeScene === 2}
        />

        <ChapterCopy
          progress={progress}
          start={0.505}
          end={0.685}
          eyebrow="03 / 07 · The document"
          title={
            <>
              Your Experience, <em>Presented Properly.</em>
            </>
          }
          body="Turn what you've already accomplished into a polished resume without starting from a blank page."
          meta="Resume · built from the same profile"
          active={activeScene === 3}
        />

        <ChapterCopy
          progress={progress}
          start={0.705}
          end={0.935}
          eyebrow="04 / 07 · The presence"
          title={
            <>
              Give Your Work <em>a Home on the Internet.</em>
            </>
          }
          body="Turn the same information into a personal portfolio website you can publish and share."
          meta="Resume + portfolio · one source of truth"
          active={activeScene === 4}
        />

        {/* scroll cue */}
        <motion.a
          href="#process"
          className="story-scroll-cue"
          style={{ opacity: heroOpacity }}
          onClick={(event) => {
            event.preventDefault();
            onSeeProcess();
          }}
          aria-label="Skip to how it works"
        >
          <span className="story-scroll-cue-line" />
          Scroll to see it come together
        </motion.a>

        {/* chapter rail */}
        <motion.div
          className="story-rail"
          style={{ opacity: railOpacity }}
          aria-hidden="true"
        >
          <div className="story-rail-track">
            <motion.i style={{ scaleX: railScale }} />
          </div>
          <div className="story-rail-labels">
            <span className={activeScene === 1 ? "is-active" : ""}>Potential</span>
            <span className={activeScene === 2 ? "is-active" : ""}>Profile</span>
            <span className={activeScene === 3 ? "is-active" : ""}>Resume</span>
            <span className={activeScene === 4 ? "is-active" : ""}>Portfolio</span>
          </div>
        </motion.div>

        <div className="story-grain" />
        <div className="story-vignette" />
        <motion.div className="story-paper-edge" style={{ opacity: paperEdgeOpacity }} />
      </div>
    </section>
  );
}
