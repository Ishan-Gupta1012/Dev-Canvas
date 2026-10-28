"use client";

import React from "react";
import {
  Award,
  BriefcaseBusiness,
  FolderGit2,
  GraduationCap,
  Sparkles,
  UserRound,
} from "lucide-react";
import { DeveloperAvatar } from "./DeveloperFigure";
import { PROFILE, NEW_UPDATE } from "./data";

const PROFILE_TABS = [
  { label: "Overview", icon: UserRound },
  { label: "Skills", icon: Sparkles },
  { label: "Projects", icon: FolderGit2 },
  { label: "Experience", icon: BriefcaseBusiness },
  { label: "Education", icon: GraduationCap },
  { label: "Awards", icon: Award },
] as const;

/* ─────────────────────────────────────────
   PROFILE — the platform's profile editor
───────────────────────────────────────── */

export function ProfileMockup({
  className = "",
  highlightNew = false,
}: {
  className?: string;
  highlightNew?: boolean;
}) {
  return (
    <div
      className={`profile-shell ${className}`}
      role="img"
      aria-label="Sample DevCanvas profile editor for Ishan Gupta, showing skills, projects, experience, education, and achievements."
    >
      <div className="profile-topbar">
        <div className="profile-brand">
          <span className="profile-mark">Po</span>
          <span>Profile</span>
        </div>
        <div className="profile-top-actions">
          <span className="profile-saved">
            <i /> Saved
          </span>
          <span className="profile-mini-btn">Preview</span>
        </div>
      </div>

      <div className="profile-app">
        <nav className="profile-tabrail" aria-hidden="true">
          <span className="profile-tabrail-logo">P</span>
          {PROFILE_TABS.map(({ label, icon: Icon }, index) => (
            <span
              className={`profile-tabrail-item ${index === 0 ? "is-active" : ""}`}
              key={label}
              title={label}
            >
              <Icon size={11} strokeWidth={1.7} />
            </span>
          ))}
          <DeveloperAvatar className="profile-tabrail-avatar" />
        </nav>

        <div className="profile-body">
        <aside className="profile-rail">
          <DeveloperAvatar className="profile-avatar" />
          <div className="profile-name">{PROFILE.name}</div>
          <div className="profile-role">{PROFILE.role}</div>
          <div className="profile-location">{PROFILE.location}</div>
          <span className="open-chip">
            <i /> Open to work
          </span>

          <div className="profile-completeness">
            <div className="profile-completeness-label">
              <span>Completeness</span>
              <strong>86%</strong>
            </div>
            <div className="profile-bar">
              <i style={{ width: "86%" }} />
            </div>
          </div>

          <div className="profile-links">
            <span>{PROFILE.github}</span>
            <span>{PROFILE.linkedin}</span>
            <span>{PROFILE.website}</span>
          </div>
        </aside>

        <div className="profile-content">
          <div className="profile-content-head">
            <div>
              <h4>Profile</h4>
              <p>One source for your resume and portfolio.</p>
            </div>
            <span className="profile-count">08 fields</span>
          </div>

          <section className="profile-section">
            <h5>
              Summary <span>01</span>
            </h5>
            <p className="profile-summary">{PROFILE.summary}</p>
          </section>

          <section className="profile-section">
            <h5>
              Skills <span>08</span>
            </h5>
            <div className="profile-chips">
              {PROFILE.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h5>
              Projects <span>03</span>
            </h5>
            <div className="profile-projects">
              {PROFILE.projects.map((project, index) => (
                <div
                  className={`profile-project ${
                    index === 0 ? "profile-project--featured" : ""
                  }`}
                  key={project.id}
                >
                  <span className="profile-project-index">{project.index}</span>
                  <div>
                    <strong>{project.name}</strong>
                    <span>{project.tagline}</span>
                  </div>
                  <span className="profile-project-tech">{project.tech[0]}</span>
                </div>
              ))}
              {highlightNew && (
                <div className="profile-project profile-project--new">
                  <span className="profile-project-index">04</span>
                  <div>
                    <strong>{NEW_UPDATE.title}</strong>
                    <span>{NEW_UPDATE.detail}</span>
                  </div>
                  <span className="profile-project-tech">New</span>
                </div>
              )}
            </div>
          </section>

          <div className="profile-two-col">
            <section className="profile-section">
              <h5>
                Experience <span>01</span>
              </h5>
              {PROFILE.experience.map((job) => (
                <div className="profile-role-row" key={job.role}>
                  <strong>{job.role}</strong>
                  <span>
                    {job.company} · {job.period}
                  </span>
                </div>
              ))}
            </section>

            <section className="profile-section">
              <h5>
                Education <span>01</span>
              </h5>
              {PROFILE.education.map((edu) => (
                <div className="profile-role-row" key={edu.institution}>
                  <strong>{edu.degree}</strong>
                  <span>
                    {edu.institution} · {edu.period}
                  </span>
                </div>
              ))}
            </section>
          </div>

          <section className="profile-section">
            <h5>
              Achievements <span>03</span>
            </h5>
            <div className="profile-awards">
              {PROFILE.achievements.map((achievement) => (
                <div key={achievement.title}>
                  <i />
                  <span>{achievement.title}</span>
                  <em>{achievement.year}</em>
                </div>
              ))}
            </div>
          </section>
        </div>
        </div>
      </div>

      <div className="profile-footer">
        <span>Everything here feeds the resume and the portfolio.</span>
        <span className="profile-footer-action">Save changes</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   RESUME — a real document, not a white box
───────────────────────────────────────── */

export function ResumeMockup({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`resume-sheet ${compact ? "resume-sheet--compact" : ""} ${className}`}
      role="img"
      aria-label="Sample one-page resume for Ishan Gupta built from the same profile."
    >
      <header className="resume-head">
        <div>
          <span className="resume-kicker">Resume · 2026</span>
          <h3>{PROFILE.name}</h3>
          <p className="resume-role">{PROFILE.role}</p>
        </div>
        <div className="resume-contact">
          <span>{PROFILE.location}</span>
          <span>{PROFILE.email}</span>
          <span>{PROFILE.github}</span>
          <span>{PROFILE.linkedin}</span>
        </div>
      </header>

      <div className="resume-hairline">
        <i />
      </div>

      <p className="resume-summary">{PROFILE.summary}</p>

      <section className="resume-section">
        <h4>Experience</h4>
        {PROFILE.experience.map((job) => (
          <div className="resume-entry" key={job.role}>
            <div className="resume-entry-head">
              <strong>{job.role}</strong>
              <span>{job.period}</span>
            </div>
            <div className="resume-entry-sub">
              {job.company} · {job.location}
            </div>
            <ul>
              {job.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h4>Selected Projects</h4>
        {PROFILE.projects.map((project) => (
          <div className="resume-project" key={project.id}>
            <div className="resume-entry-head">
              <strong>
                {project.name} <span className="resume-project-tag">{project.tagline}</span>
              </strong>
              <span>{project.year}</span>
            </div>
            <div className="resume-entry-sub">{project.tech.join(" · ")}</div>
            <p>{project.description}</p>
          </div>
        ))}
      </section>

      <div className="resume-two-col">
        <section className="resume-section">
          <h4>Skills</h4>
          <div className="resume-skills">
            {PROFILE.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h4>Education</h4>
          {PROFILE.education.map((edu) => (
            <div className="resume-entry" key={edu.institution}>
              <div className="resume-entry-head">
                <strong>{edu.degree}</strong>
                <span>{edu.period}</span>
              </div>
              <div className="resume-entry-sub">{edu.institution}</div>
              <p>{edu.detail}</p>
            </div>
          ))}
        </section>
      </div>

      <section className="resume-section resume-section--awards">
        <h4>Honours &amp; Certifications</h4>
        {PROFILE.achievements
          .filter((_, index) => index !== 1)
          .map((achievement) => (
            <div className="resume-award" key={achievement.title}>
              <i />
              <span>{achievement.title}</span>
              <em>{achievement.year}</em>
            </div>
          ))}
      </section>

      <footer className="resume-footer">
        <span>{PROFILE.name} · {PROFILE.role}</span>
        <span>Page 1 / 1</span>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────
   PORTFOLIO — the published site
───────────────────────────────────────── */

export function PortfolioMockup({
  className = "",
  highlightNew = false,
}: {
  className?: string;
  highlightNew?: boolean;
}) {
  return (
    <div
      className={`portfolio-browser ${className}`}
      role="img"
      aria-label="Sample published portfolio website for Ishan Gupta, with a hero, selected projects, skills, experience, and links."
    >
      <div className="browser-bar">
        <div className="browser-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="browser-url">
          <span className="browser-lock" />
          <span>{PROFILE.website}</span>
        </div>
        <span className="browser-live">
          <i /> Live
        </span>
      </div>

      <div className="portfolio-site">
        <div className="site-nav">
          <div className="site-brand">
            <span className="site-monogram">{PROFILE.initials}</span>
            <span>{PROFILE.name}</span>
          </div>
          <div className="site-nav-links">
            <span className="site-nav-active">Work</span>
            <span>About</span>
            <span>Contact</span>
          </div>
          <span className="site-nav-cta">Open to work</span>
        </div>

        <div className="site-hero">
          <div className="site-hero-copy">
            <span className="site-eyebrow">Full Stack Developer · New Delhi</span>
            <h3>
              {PROFILE.name}
              <em> builds products that feel effortless.</em>
            </h3>
            <p>
              I work where engineering meets product: fast interfaces, careful
              systems, and the small details that make complex work feel simple.
            </p>
            <div className="site-hero-actions">
              <span className="site-button">View selected work</span>
              <span className="site-text-link">Read the resume ↗</span>
            </div>
            <div className="site-socials">
              <span>GitHub</span>
              <span>LinkedIn</span>
              <span>Email</span>
            </div>
          </div>
          <div className="site-hero-portrait">
            <DeveloperAvatar className="site-avatar" />
            <span className="site-portrait-caption">Currently building Project Aurora</span>
          </div>
        </div>

        <div className="site-projects">
          <div className="site-section-head">
            <span>Selected work</span>
            <span>2024 — 2025</span>
          </div>
          <div className="site-project-grid">
            <article className="site-project site-project--featured">
              <div className="site-project-top">
                <span>01 / Featured</span>
                <span>★ {PROFILE.projects[0].stars}</span>
              </div>
              <h4>{PROFILE.projects[0].name}</h4>
              <p>{PROFILE.projects[0].tagline}. {PROFILE.projects[0].description}</p>
              <div className="site-project-tags">
                {PROFILE.projects[0].tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
            <article className="site-project">
              <div className="site-project-top">
                <span>02 / Project</span>
                <span>★ {PROFILE.projects[1].stars}</span>
              </div>
              <h4>{PROFILE.projects[1].name}</h4>
              <p>{PROFILE.projects[1].tagline}.</p>
              <div className="site-project-tags">
                {PROFILE.projects[1].tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
            <article className={`site-project ${highlightNew ? "site-project--new" : ""}`}>
              <div className="site-project-top">
                <span>{highlightNew ? "New / Project" : "03 / Project"}</span>
                <span>{highlightNew ? "Just added" : `★ ${PROFILE.projects[2].stars}`}</span>
              </div>
              <h4>{highlightNew ? NEW_UPDATE.title : PROFILE.projects[2].name}</h4>
              <p>
                {highlightNew
                  ? `${NEW_UPDATE.detail} Built with ${NEW_UPDATE.tech.join(", ")}.`
                  : `${PROFILE.projects[2].tagline}.`}
              </p>
              <div className="site-project-tags">
                {(highlightNew ? NEW_UPDATE.tech : PROFILE.projects[2].tech).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="site-lower">
          <div>
            <h5>Toolkit</h5>
            <div className="site-skill-row">
              {PROFILE.skills.slice(0, 6).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h5>Currently</h5>
            <p>B.Tech Computer Science at MAIT, 2024—2028.</p>
          </div>
          <div>
            <h5>Elsewhere</h5>
            <p>{PROFILE.github}</p>
            <p>{PROFILE.linkedin}</p>
          </div>
        </div>

        <div className="site-footer">
          <span>{PROFILE.name} · {new Date().getFullYear()}</span>
          <span>Built from a living profile.</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MINI ARTIFACTS for the process rail
───────────────────────────────────────── */

/* A compact phone companion for the published portfolio. */
export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`phone-mockup ${className}`}
      role="img"
      aria-label="Mobile version of Ishan Gupta's published portfolio."
    >
      <span className="phone-notch" aria-hidden="true" />
      <div className="phone-screen">
        <div className="phone-top">
          <span className="phone-monogram">{PROFILE.initials}</span>
          <span className="phone-menu">Menu</span>
        </div>
        <span className="phone-eyebrow">Full Stack Developer</span>
        <h4>{PROFILE.name}</h4>
        <p>I build fast, thoughtful products from interface to database.</p>
        <div className="phone-portrait">
          <DeveloperAvatar className="phone-avatar" />
        </div>
        <div className="phone-work">
          <span>Selected work</span>
          <strong>{PROFILE.projects[0].name}</strong>
          <em>{PROFILE.projects[0].tagline}</em>
          <div className="phone-tags">
            {PROFILE.projects[0].tech.slice(0, 2).map((tech) => (
              <i key={tech}>{tech}</i>
            ))}
          </div>
        </div>
        <div className="phone-footer">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );
}

export function MiniResume() {
  return (
    <div className="mini-resume" aria-hidden="true">
      <div className="mini-resume-head">
        <span>ISHAN GUPTA</span>
        <i />
      </div>
      <div className="mini-line mini-line--80" />
      <div className="mini-line mini-line--55" />
      <div className="mini-section">
        <span>EXPERIENCE</span>
        <div className="mini-line mini-line--90" />
        <div className="mini-line mini-line--70" />
      </div>
      <div className="mini-section">
        <span>PROJECTS</span>
        <div className="mini-line mini-line--85" />
        <div className="mini-line mini-line--60" />
        <div className="mini-line mini-line--75" />
      </div>
      <div className="mini-section mini-section--split">
        <span>SKILLS</span>
        <span>EDUCATION</span>
      </div>
    </div>
  );
}

export function MiniPortfolio() {
  return (
    <div className="mini-portfolio" aria-hidden="true">
      <div className="mini-browser">
        <i />
        <i />
        <i />
        <span>ishangupta.portfolioos.dev</span>
      </div>
      <div className="mini-portfolio-body">
        <span className="mini-site-name">{PROFILE.name}</span>
        <div className="mini-project-grid">
          <div />
          <div />
          <div />
        </div>
        <div className="mini-line mini-line--70" />
        <div className="mini-line mini-line--45" />
      </div>
    </div>
  );
}

/* A compact identity card for the closing scene. */
export function MiniProfile() {
  return (
    <div className="mini-profile" aria-hidden="true">
      <div className="mini-profile-top">
        <span className="mini-profile-brand">DevCanvas</span>
        <span className="mini-profile-saved">Saved</span>
      </div>
      <div className="mini-profile-id">
        <DeveloperAvatar className="mini-profile-avatar" />
        <div>
          <strong>{PROFILE.name}</strong>
          <span>{PROFILE.role}</span>
          <em>{PROFILE.location}</em>
        </div>
      </div>
      <div className="mini-profile-chips">
        {PROFILE.skills.slice(0, 4).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
      <div className="mini-profile-rows">
        <div>
          <span>Projects</span>
          <i style={{ width: "82%" }} />
        </div>
        <div>
          <span>Achievements</span>
          <i style={{ width: "64%" }} />
        </div>
      </div>
      <div className="mini-profile-footer">
        <span>Resume</span>
        <span>Portfolio</span>
        <span>Links</span>
      </div>
    </div>
  );
}
