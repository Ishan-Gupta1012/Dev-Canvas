"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Globe2,
  LayoutTemplate,
  Sparkles,
  Upload,
} from "lucide-react";
import { DeveloperFigureBack } from "./DeveloperFigure";
import { MiniPortfolio, MiniResume, ProfileMockup } from "./Mockups";
import { StoryBackdrop } from "./StoryBackdrop";
import { NEW_UPDATE, PROCESS_STEPS } from "./data";

interface SectionProps {
  onEnter: () => void;
}

const STEP_ICONS = [Upload, FileText, LayoutTemplate, Globe2];

/* ─────────────────────────────────────────
   CHAPTER 5 — THE PROCESS
───────────────────────────────────────── */

export function ProcessSection({ onEnter }: SectionProps) {
  const reduce = useReducedMotion();

  return (
    <section id="process" className="story-process" aria-labelledby="process-title">
      <div className="process-aurora" aria-hidden="true" />
      <div className="process-gridlines" aria-hidden="true" />
      <div className="process-inner">
        <motion.div
          className="process-copy"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="story-eyebrow">05 / 07 · The process</div>
          <h2 className="story-display" id="process-title">
            From What You&apos;ve Done to What You Can Show.{" "}
            <em>In Minutes.</em>
          </h2>
          <p className="process-body">
            You do not need a blank page or a perfect system. Start with the work you
            already have, then let DevCanvas turn it into a profile, a resume, and a
            portfolio that stay connected.
          </p>

          <div className="process-time">
            <span className="process-time-value">
              <span aria-hidden="true">≈</span> 4–5 Minutes
            </span>
            <span className="process-time-note">
              Depending on your information and workflow. Most of the time is spent
              reviewing and refining what you already have.
            </span>
          </div>

          <button type="button" className="process-cta" onClick={onEnter}>
            Start with your profile
            <span className="btn-arrow" aria-hidden="true">
              <ArrowUpRight size={12} strokeWidth={1.8} />
            </span>
          </button>
        </motion.div>

        <div className="process-steps">
          <span className="process-path" aria-hidden="true" />
          {PROCESS_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <motion.div
                className="process-step"
                key={step.index}
                initial={reduce ? false : { opacity: 0, x: 22 }}
                whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="process-marker" aria-hidden="true">
                  <span className="process-index">{step.index}</span>
                  <span className="process-icon">
                    <Icon size={17} strokeWidth={1.55} />
                  </span>
                </div>
                <div className="process-step-copy">
                  <span className="process-step-label">{step.label}</span>
                  <p>{step.body}</p>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="process-result"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="process-result-icon">
              <Check size={11} strokeWidth={2.2} />
            </span>
            One source of truth. One link to share.
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CHAPTER 6 — THE UPDATE
───────────────────────────────────────── */

export function UpdateSection({ onEnter }: SectionProps) {
  const reduce = useReducedMotion();

  return (
    <section className="story-update" aria-labelledby="update-title">
      <div className="update-aurora" aria-hidden="true" />
      <div className="story-update-inner">
        <div className="update-grid">
          <motion.div
            className="update-copy"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="story-eyebrow">06 / 07 · The update</div>
            <h2 className="story-display" id="update-title">
              Keep Growing. <em>Your Portfolio Grows With You.</em>
            </h2>
            <p className="update-body">
              Your next project, skill, or achievement shouldn&apos;t mean rebuilding
              your professional presence from scratch. Add it once, and your profile,
              resume, and portfolio stay in step.
            </p>

            <div className="update-entry">
              <div className="update-entry-head">
                <span>Add new experience</span>
                <span className="update-entry-plus">+</span>
              </div>
              <div className="update-entry-row">
                <span className="update-entry-icon">
                  <Sparkles size={12} strokeWidth={1.7} />
                </span>
                <div>
                  <strong>New Project</strong>
                  <span>{NEW_UPDATE.title}</span>
                </div>
                <span className="update-entry-tag">New</span>
              </div>
              <div className="update-entry-row">
                <span className="update-entry-icon">
                  <LayoutTemplate size={12} strokeWidth={1.7} />
                </span>
                <div>
                  <strong>New Skill</strong>
                  <span>Machine Learning</span>
                </div>
                <span className="update-entry-tag">New</span>
              </div>
              <button type="button" className="update-entry-btn" onClick={onEnter}>
                Update Profile
                <ArrowUpRight size={11} strokeWidth={1.9} aria-hidden="true" />
              </button>
            </div>

            <div className="update-note">
              Illustrative update flow · Nothing is published without your review.
            </div>
          </motion.div>

          <motion.div
            className="update-visual"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="update-window">
              <ProfileMockup highlightNew />
            </div>

            <motion.div
              className="update-toast"
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="update-toast-icon">
                <Check size={11} strokeWidth={2.4} />
              </span>
              <div>
                <strong>Profile Updated</strong>
                <span>Resume and portfolio are in sync.</span>
              </div>
            </motion.div>

            <div className="update-new-chip" aria-hidden="true">
              <span>04</span>
              <div>
                <strong>{NEW_UPDATE.title}</strong>
                <span>{NEW_UPDATE.tech.join(" · ")}</span>
              </div>
              <em>Added</em>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CHAPTER 7 — THE FINALE
───────────────────────────────────────── */

export function FinaleSection({
  onEnter,
  stack = false,
}: SectionProps & { stack?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <section
      className={`story-finale ${stack ? "story-stack-finale" : ""}`}
      aria-labelledby="finale-title"
    >
      <StoryBackdrop variant="finale" />
      <div className="story-finale-bg" aria-hidden="true" />
      <div className="story-finale-arch" aria-hidden="true" />

      <div className="story-finale-inner">
        <motion.div
          className="story-finale-copy"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-14%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="story-eyebrow">07 / 07 · The presence</div>
          <h2 className="story-display" id="finale-title">
            You Had the Potential.{" "}
            <em>Now the World Can See It.</em>
          </h2>
          <p className="story-finale-body">
            Build your resume, launch your portfolio, and keep your professional
            identity evolving as your journey unfolds.
          </p>
          <div className="story-finale-actions">
            <button type="button" className="story-btn story-btn--primary" onClick={onEnter}>
              Build My Identity
              <span className="btn-arrow" aria-hidden="true">
                <ArrowUpRight size={12} strokeWidth={1.8} />
              </span>
            </button>
            <Link href="/templates/modern-developer" className="story-btn story-btn--ghost">
              See a Live Portfolio
              <ArrowRight size={12} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <div className="story-finale-note">
            Free to start · Your profile stays yours · Sample identity shown
          </div>
        </motion.div>

        <div className="finale-visual">
          <div className="finale-portal" aria-hidden="true">
            <span className="finale-portal-ring finale-portal-ring--1" />
            <span className="finale-portal-ring finale-portal-ring--2" />
            <span className="finale-portal-ring finale-portal-ring--3" />
            <span className="finale-portal-glow" />
            <DeveloperFigureBack className="finale-figure" />
          </div>

          <motion.div
            className="finale-float finale-float--resume"
            initial={reduce ? false : { opacity: 0, y: 26, rotate: -6 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="finale-float-label">A resume</span>
            <MiniResume />
          </motion.div>

          <motion.div
            className="finale-float finale-float--growth"
            initial={reduce ? false : { opacity: 0, y: -22 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="finale-growth-icon">
              <Sparkles size={13} strokeWidth={1.7} />
            </span>
            <div>
              <strong>Growing together</strong>
              <span>Every new project updates your presence.</span>
            </div>
          </motion.div>

          <motion.div
            className="finale-float finale-float--portfolio"
            initial={reduce ? false : { opacity: 0, y: 22, rotate: 6 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotate: 4 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="finale-float-label">A portfolio</span>
            <MiniPortfolio />
          </motion.div>
        </div>
      </div>

      <footer className="story-footer">
        <div className="story-footer-inner">
          <div className="story-footer-brand">
            <span className="story-logo-mark" aria-hidden="true">
              Po
            </span>
            <span>DevCanvas</span>
          </div>
          <div className="story-footer-links">
            <Link href="/works">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/signin">Log In</Link>
          </div>
          <div className="story-footer-meta">
            <span>Resume → Portfolio</span>
            <span className="story-footer-sample">
              Illustrative sample profile · Ishan Gupta · Not real user data
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
