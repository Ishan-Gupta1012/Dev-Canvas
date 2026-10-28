"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeveloperFigure } from "./DeveloperFigure";
import { StaticFragment } from "./Fragments";
import { PortfolioMockup, ProfileMockup, ResumeMockup } from "./Mockups";
import { StoryBackdrop } from "./StoryBackdrop";
import { FRAGMENTS } from "./data";

interface StackProps {
  onEnter: () => void;
  onSeeProcess: () => void;
}

const HERO_FRAGMENT_IDS = [
  "skill-react",
  "skill-next",
  "project-aurora",
  "achievement-hackathon",
];

const HERO_POSITIONS: Record<string, { x: number; y: number }> = {
  "skill-react": { x: 18, y: 24 },
  "skill-next": { x: 82, y: 22 },
  "project-aurora": { x: 63, y: 14 },
  "achievement-hackathon": { x: 21, y: 43 },
};

const SCATTER_IDS = [
  "skill-react",
  "skill-next",
  "project-aurora",
  "achievement-hackathon",
  "project-portfolioos",
  "education-mait",
];

const SCATTER_POSITIONS: Record<string, { x: number; y: number }> = {
  "skill-react": { x: 20, y: 12 },
  "skill-next": { x: 78, y: 8 },
  "project-aurora": { x: 56, y: 36 },
  "achievement-hackathon": { x: 22, y: 58 },
  "project-portfolioos": { x: 82, y: 62 },
  "education-mait": { x: 51, y: 84 },
};

function StackCopy({
  eyebrow,
  title,
  body,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  meta: string;
}) {
  return (
    <div className="story-copy-panel">
      <div className="story-eyebrow">{eyebrow}</div>
      <h2 className="story-display" style={{ marginTop: 18 }}>
        {title}
      </h2>
      <p className="story-copy-body">{body}</p>
      <span className="story-copy-meta">
        <i />
        {meta}
      </span>
    </div>
  );
}

export default function StoryStack({ onEnter, onSeeProcess }: StackProps) {
  const heroFragments = HERO_FRAGMENT_IDS.map((id) =>
    FRAGMENTS.find((fragment) => fragment.id === id),
  ).filter(Boolean);
  const scatterFragments = SCATTER_IDS.map((id) =>
    FRAGMENTS.find((fragment) => fragment.id === id),
  ).filter(Boolean);

  return (
    <div className="story-stack" id="features">
      {/* HERO */}
      <section className="story-stack-hero" aria-labelledby="stack-hero-title">
        <div className="story-stack-hero-bg" />
        <StoryBackdrop variant="hero" />
        <div className="story-grid" />
        <div className="story-grain" />
        <div className="story-vignette" />

        <div className="story-stack-hero-copy">
          <div className="story-hero-kicker">
            <i />
            DevCanvas · Resume → Portfolio
          </div>
          <h1 className="story-hero-title" id="stack-hero-title">
            You&apos;ve Built the Skills.
            <br />
            Now Give Them <em>a Presence.</em>
          </h1>
          <p className="story-hero-body">
            Turn your skills, projects, and achievements into a professional resume
            and personal portfolio in minutes. Keep your professional identity growing
            as you do.
          </p>
          <div className="story-hero-actions">
            <button type="button" className="story-btn story-btn--primary" onClick={onEnter}>
              Build My Identity
              <span className="btn-arrow" aria-hidden="true">
                <ArrowUpRight size={12} strokeWidth={1.8} />
              </span>
            </button>
            <button type="button" className="story-btn story-btn--ghost" onClick={onSeeProcess}>
              See How It Works
              <ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          <div className="story-hero-note">
            <i />
            Illustrative profile: Ishan Gupta · No real user data
          </div>
          <div className="story-stack-scroll">
            <span className="story-scroll-cue-line" />
            Scroll to see it come together
          </div>
        </div>

        <div className="story-stack-hero-stage">
          <div className="story-arch" />
          <div className="story-floor" />

          <div className="story-stack-figure" aria-hidden="true">
            <DeveloperFigure />
          </div>

          <div className="story-stack-fragments" aria-hidden="true">
            {heroFragments.map((fragment) => {
              if (!fragment) return null;
              const position = HERO_POSITIONS[fragment.id];
              return (
                <div
                  className="story-stack-fragment"
                  key={fragment.id}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <StaticFragment fragment={fragment} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHAPTER 1 */}
      <section className="story-stack-section" aria-labelledby="stack-ch1">
        <StackCopy
          eyebrow="01 / 07 · The potential"
          title={
            <span id="stack-ch1">
              The Potential Is <em>Already There.</em>
            </span>
          }
          body="You've built the skills, shipped the projects, and earned the achievements. Now they need one place to come together — and a way to be seen."
          meta="Skills · Projects · Experience · Education"
        />

        <div className="story-stack-visual" style={{ height: 430 }}>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 62% 55% at 50% 50%, rgba(104,48,29,0.32), transparent 72%)",
            }}
          />
          <div className="story-stack-figure-small" aria-hidden="true">
            <DeveloperFigure />
          </div>
          {scatterFragments.map((fragment) => {
            if (!fragment) return null;
            const position = SCATTER_POSITIONS[fragment.id];
            return (
              <div
                className="story-stack-fragment"
                key={fragment.id}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%) scale(0.6)",
                }}
              >
                <StaticFragment fragment={fragment} />
              </div>
            );
          })}
        </div>
      </section>

      {/* CHAPTER 2 */}
      <section className="story-stack-section" aria-labelledby="stack-ch2">
        <StackCopy
          eyebrow="02 / 07 · One place"
          title={
            <span id="stack-ch2">
              Bring Everything You&apos;ve Done <em>Into One Place.</em>
            </span>
          }
          body="Start with your existing skills, projects, achievements, education, and experience. We help you shape them into a profile that reads as one story."
          meta="Profile · 8 skills · 3 projects · 3 achievements"
        />
        <div className="story-stack-visual">
          <div className="story-stack-profile">
            <ProfileMockup />
          </div>
        </div>
      </section>

      {/* CHAPTER 3 */}
      <section className="story-stack-section" aria-labelledby="stack-ch3">
        <StackCopy
          eyebrow="03 / 07 · The document"
          title={
            <span id="stack-ch3">
              Your Experience, <em>Presented Properly.</em>
            </span>
          }
          body="Turn what you've already accomplished into a polished resume without starting from a blank page."
          meta="Resume · built from the same profile"
        />
        <div className="story-stack-visual">
          <div className="story-stack-resume">
            <ResumeMockup compact />
          </div>
        </div>
      </section>

      {/* CHAPTER 4 */}
      <section className="story-stack-section" aria-labelledby="stack-ch4">
        <StackCopy
          eyebrow="04 / 07 · The presence"
          title={
            <span id="stack-ch4">
              Give Your Work <em>a Home on the Internet.</em>
            </span>
          }
          body="Turn the same information into a personal portfolio website you can publish and share."
          meta="Resume + portfolio · one source of truth"
        />
        <div className="story-stack-visual">
          <div className="story-stack-portfolio">
            <PortfolioMockup />
          </div>
        </div>
      </section>
    </div>
  );
}
