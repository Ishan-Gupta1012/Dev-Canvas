'use client';
import './story-landing.css';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────
   STORY LANDING PAGE
   Theme: deep brown · silver · whisper-lavender
   Pattern: Scroll-Driven Narrative
   Chapters:
     0 – Prologue   – "You exist. But are you seen?"
     1 – Chapter 1  – Scattered skills, no voice
     2 – Chapter 2  – Upload your resume
     3 – Chapter 3  – AI understands you
     4 – Chapter 4  – Your portfolio materialises
     5 – Epilogue   – The world discovers you
───────────────────────────────────────────── */

export default function StoryLandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [viewH, setViewH] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const rafRef = useRef<number | null>(null);

  /* ── Cursor tracker for spotlight ── */
  const heroRef = useRef<HTMLElement>(null);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  useEffect(() => {
    setViewH(window.innerHeight);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const onMQ = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', onMQ);

    const onResize = () => setViewH(window.innerHeight);
    window.addEventListener('resize', onResize, { passive: true });

    let lastY = window.scrollY;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        lastY = window.scrollY;
        setScrollY(lastY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const hero = heroRef.current;
    hero?.addEventListener('mousemove', handleMouseMove);

    return () => {
      mq.removeEventListener('change', onMQ);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      hero?.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  /* ── Scroll math helpers ── */
  const progress = (start: number, end: number) => {
    if (prefersReduced) return 1;
    if (viewH === 0 || end === start) return 0; // guard against NaN before mount
    const raw = (scrollY - start) / (end - start);
    return Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0;
  };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  /* section offsets (vh multiples) */
  const S = viewH; // 1 screen-height
  const ch1Start = S * 0.8;
  const ch2Start = S * 1.8;
  const ch3Start = S * 2.8;
  const ch4Start = S * 3.8;
  const epStart  = S * 4.8;

  /* chapter progresses */
  const p0 = progress(0, ch1Start);                    // prologue fade
  const p1 = progress(ch1Start, ch2Start);             // chapter 1
  const p2 = progress(ch2Start, ch3Start);             // chapter 2
  const p3 = progress(ch3Start, ch4Start);             // chapter 3
  const p4 = progress(ch4Start, epStart);              // chapter 4
  const pEp = progress(epStart, epStart + S * 0.8);   // epilogue

  const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  return (
    <div ref={containerRef} className="story-root">

      {/* ══════════════════════════════════════
          STICKY PROGRESS BAR
      ══════════════════════════════════════ */}
      <div
        className="story-progress-bar"
        style={{ width: S > 0 ? `${Math.min(100, (scrollY / (S * 5.6)) * 100)}%` : '0%' }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════
          PROLOGUE — Hero
          "You exist. But are you truly seen?"
      ══════════════════════════════════════ */}
      <section
        className="story-section story-hero lc-spotlight"
        ref={heroRef as React.RefObject<HTMLElement>}
        style={{ '--mx': '50%', '--my': '40%' } as React.CSSProperties}
        aria-label="Prologue: You exist"
      >
        {/* Ambient grain */}
        <div className="story-grain" aria-hidden="true" />
        {/* Subtle grid */}
        <div className="story-grid" aria-hidden="true" />

        {/* Floating orbits */}
        <div
          className="story-orbit"
          style={{
            opacity: prefersReduced ? 0.15 : lerp(0.15, 0, ease(p0)),
            transform: `rotate(${prefersReduced ? 0 : lerp(0, 60, p0)}deg)`,
          }}
          aria-hidden="true"
        >
          <span className="story-orbit-dot story-orbit-dot--1" />
          <span className="story-orbit-dot story-orbit-dot--2" />
          <span className="story-orbit-dot story-orbit-dot--3" />
        </div>

        <div
          className="story-hero-content"
          style={{
            opacity: prefersReduced ? 1 : lerp(1, 0, ease(Math.min(1, p0 * 1.4))),
            transform: `translateY(${prefersReduced ? 0 : lerp(0, -60, ease(p0))}px)`,
          }}
        >
          <div className="story-eyebrow">
            <span className="story-eyebrow-line" />
            <span>A story of being seen</span>
            <span className="story-eyebrow-line" />
          </div>

          <h1 className="story-hero-h1">
            <span className="story-ink-gradient">You exist.</span>
            <br />
            <span className="story-hero-h1-sub">But does the world<br />know you?</span>
          </h1>

          <p className="story-hero-body">
            Every great person has a story. Most of them stay silent
            — buried in a PDF no one truly reads.
          </p>

          <div className="story-cursor-blink" aria-hidden="true">
            <span>●</span>
          </div>

          <a
            href="#chapter-1"
            className="story-scroll-cue"
            aria-label="Scroll to begin your story"
          >
            <span>Begin the story</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Silver shimmer overlay as you scroll */}
        <div
          className="story-hero-silver-veil"
          style={{ opacity: prefersReduced ? 0 : ease(p0) * 0.7 }}
          aria-hidden="true"
        />
      </section>

      {/* SPACER */}
      <div style={{ height: '100vh' }} aria-hidden="true" />

      {/* ══════════════════════════════════════
          CHAPTER 1 — Scattered skills, no voice
          "You have everything. But no stage."
      ══════════════════════════════════════ */}
      <section
        id="chapter-1"
        className="story-section story-chapter-1"
        aria-label="Chapter 1: Your skills are invisible"
      >
        <div
          className="story-chapter-inner"
          style={{
            opacity: prefersReduced ? 1 : ease(p1),
            transform: `translateY(${prefersReduced ? 0 : lerp(40, 0, ease(p1))}px)`,
          }}
        >
          <ChapterLabel n="01" label="The Problem" />
          <h2 className="story-chapter-h2">
            Your talent is real.<br />
            <em>But it's invisible.</em>
          </h2>
          <p className="story-chapter-body">
            You have skills, projects, experiences, achievements.
            They live in your head — or worse, in a plain Word document
            that lands in a folder nobody opens.
          </p>
        </div>

        {/* Floating scattered words */}
        <ScatteredWords p={p1} prefersReduced={prefersReduced} />
      </section>

      <div style={{ height: '100vh' }} aria-hidden="true" />

      {/* ══════════════════════════════════════
          CHAPTER 2 — Upload your resume
          "Give it a voice."
      ══════════════════════════════════════ */}
      <section
        className="story-section story-chapter-2"
        aria-label="Chapter 2: Upload your resume"
      >
        <div
          className="story-chapter-inner"
          style={{
            opacity: prefersReduced ? 1 : ease(p2),
            transform: `translateY(${prefersReduced ? 0 : lerp(40, 0, ease(p2))}px)`,
          }}
        >
          <ChapterLabel n="02" label="The Spark" />
          <h2 className="story-chapter-h2">
            One document.<br />
            <em>Infinite potential.</em>
          </h2>
          <p className="story-chapter-body">
            Simply upload your resume — PDF, Word, or paste it in.
            That's all it takes. Your story is already there.
            We just need to set it free.
          </p>
        </div>

        {/* Animated document */}
        <DocumentAnimation p={p2} prefersReduced={prefersReduced} />
      </section>

      <div style={{ height: '100vh' }} aria-hidden="true" />

      {/* ══════════════════════════════════════
          CHAPTER 3 — AI understands you
          "Our AI reads between the lines."
      ══════════════════════════════════════ */}
      <section
        className="story-section story-chapter-3"
        aria-label="Chapter 3: AI understands you"
      >
        <div
          className="story-chapter-inner"
          style={{
            opacity: prefersReduced ? 1 : ease(p3),
            transform: `translateY(${prefersReduced ? 0 : lerp(40, 0, ease(p3))}px)`,
          }}
        >
          <ChapterLabel n="03" label="The Alchemy" />
          <h2 className="story-chapter-h2">
            AI reads your story.<br />
            <em>And truly understands.</em>
          </h2>
          <p className="story-chapter-body">
            Our model extracts every skill, every project, every achievement.
            It structures your experience into a narrative
            that recruiters, clients, and collaborators actually want to read.
          </p>
        </div>

        {/* AI nodes animation */}
        <AINodeAnimation p={p3} prefersReduced={prefersReduced} />
      </section>

      <div style={{ height: '100vh' }} aria-hidden="true" />

      {/* ══════════════════════════════════════
          CHAPTER 4 — Portfolio materialises
          "Your stage appears."
      ══════════════════════════════════════ */}
      <section
        className="story-section story-chapter-4"
        aria-label="Chapter 4: Your portfolio website appears"
      >
        <div
          className="story-chapter-inner"
          style={{
            opacity: prefersReduced ? 1 : ease(p4),
            transform: `translateY(${prefersReduced ? 0 : lerp(40, 0, ease(p4))}px)`,
          }}
        >
          <ChapterLabel n="04" label="The Stage" />
          <h2 className="story-chapter-h2">
            A portfolio website.<br />
            <em>Crafted just for you.</em>
          </h2>
          <p className="story-chapter-body">
            A stunning, personalised website — yours instantly.
            Choose your template, your colours, your layout.
            No code. No design degree. Just you.
          </p>
        </div>

        {/* Portfolio preview mockup */}
        <PortfolioMockup p={p4} prefersReduced={prefersReduced} />
      </section>

      <div style={{ height: '120vh' }} aria-hidden="true" />

      {/* ══════════════════════════════════════
          EPILOGUE — The world discovers you
          "Now. Begin your story."
      ══════════════════════════════════════ */}
      <section
        className="story-section story-epilogue"
        aria-label="Epilogue: The world discovers you"
      >
        <div
          className="story-epilogue-inner"
          style={{
            opacity: prefersReduced ? 1 : ease(pEp),
            transform: `translateY(${prefersReduced ? 0 : lerp(50, 0, ease(pEp))}px)`,
          }}
        >
          <div className="story-epilogue-glow" aria-hidden="true" />

          <span className="story-epilogue-label">Your story ends here</span>

          <h2 className="story-epilogue-h2">
            <span className="story-ink-gradient">Now the world</span>
            <br />
            discovers you.
          </h2>

          <p className="story-epilogue-body">
            From a blank page to a portfolio the world can see.
            Your journey starts with a single upload.
          </p>

          <div className="story-epilogue-cta-group">
            <button
              id="story-cta-start"
              className="story-cta-primary"
              onClick={() => router.push('/signup')}
              aria-label="Start building your portfolio"
            >
              <span>Start your story</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              id="story-cta-signin"
              className="story-cta-secondary"
              onClick={() => router.push('/signin')}
              aria-label="Sign in to your account"
            >
              Sign in
            </button>
          </div>

          <div className="story-social-proof">
            <div className="story-avatars" aria-hidden="true">
              {['A','B','C','D'].map((l, i) => (
                <span key={l} className="story-avatar" style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}>{l}</span>
              ))}
            </div>
            <span className="story-social-text">Join thousands who found their voice</span>
          </div>
        </div>

        {/* Footer strip */}
        <footer className="story-footer">
          <span className="story-footer-brand">DevCanvas</span>
          <nav className="story-footer-nav" aria-label="Footer navigation">
            <a href="/about" className="story-footer-link">About</a>
            <a href="/templates" className="story-footer-link">Templates</a>
            <a href="/contact" className="story-footer-link">Contact</a>
          </nav>
          <span className="story-footer-copy">© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function ChapterLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="story-chapter-label">
      <span className="story-chapter-num">{n}</span>
      <span className="story-chapter-name">{label}</span>
    </div>
  );
}

/* Scattered floating words for Chapter 1 */
const WORDS = [
  'React', 'TypeScript', 'Leadership', 'Python', 'Design',
  'Strategy', 'Node.js', 'Figma', 'AWS', 'SQL',
  'Communication', 'Vision', 'Problem-solving', 'Swift', 'Data',
];
function ScatteredWords({ p, prefersReduced }: { p: number; prefersReduced: boolean }) {
  return (
    <div className="story-scattered" aria-hidden="true">
      {WORDS.map((w, i) => {
        const angle = (i / WORDS.length) * Math.PI * 2;
        const radius = 200 + (i % 3) * 80;
        const baseX = 50 + Math.cos(angle) * (radius / 6);
        const baseY = 50 + Math.sin(angle) * (radius / 6);
        return (
          <span
            key={w}
            className="story-word-float"
            style={{
              left: `${baseX}%`,
              top: `${baseY}%`,
              opacity: prefersReduced ? 0.6 : p * 0.75,
              transform: prefersReduced
                ? 'translate(-50%, -50%)'
                : `translate(-50%, -50%) scale(${0.4 + p * 0.6}) rotate(${(i % 5 - 2) * 4}deg)`,
              transitionDelay: `${i * 0.03}s`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
}

/* Document upload animation for Chapter 2 */
function DocumentAnimation({ p, prefersReduced }: { p: number; prefersReduced: boolean }) {
  const lift = prefersReduced ? 1 : p;
  return (
    <div className="story-doc-wrap" aria-hidden="true">
      <div
        className="story-doc"
        style={{
          transform: `perspective(900px) rotateX(${lerp(18, 0, lift)}deg) rotateY(${lerp(-8, 0, lift)}deg) translateY(${lerp(30, 0, lift)}px)`,
          opacity: prefersReduced ? 1 : 0.3 + p * 0.7,
        }}
      >
        <div className="story-doc-header">
          <div className="story-doc-circle story-doc-circle--brown" />
          <div className="story-doc-circle story-doc-circle--silver" />
          <div className="story-doc-circle story-doc-circle--lavender" />
        </div>
        {/* Fake resume lines */}
        <div className="story-doc-body">
          <div className="story-doc-name">Jane A. Smith</div>
          {['Software Engineer · 5 years', 'React • Node • AWS • Python'].map(l => (
            <div key={l} className="story-doc-subtitle">{l}</div>
          ))}
          <div className="story-doc-divider" />
          {[80,60,90,45,70].map((w,i) => (
            <div
              key={i}
              className="story-doc-line"
              style={{
                width: `${w}%`,
                opacity: prefersReduced ? 1 : Math.max(0, p * 2 - i * 0.15),
              }}
            />
          ))}
          <div className="story-doc-section-label">Experience</div>
          {[90,55,75,40].map((w,i) => (
            <div
              key={i}
              className="story-doc-line story-doc-line--thin"
              style={{
                width: `${w}%`,
                opacity: prefersReduced ? 1 : Math.max(0, p * 2 - i * 0.2 - 0.5),
              }}
            />
          ))}
        </div>

        {/* Upload arrow */}
        <div
          className="story-doc-upload-arrow"
          style={{ opacity: prefersReduced ? 1 : Math.min(1, p * 3) }}
        >
          <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M20 28V14M13 21l7-7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Upload resume</span>
        </div>
      </div>
    </div>
  );
}

/* AI node graph animation for Chapter 3 */
const AI_NODES = [
  { label: 'Skills', x: 50, y: 20 },
  { label: 'Projects', x: 20, y: 55 },
  { label: 'Experience', x: 80, y: 55 },
  { label: 'Education', x: 35, y: 80 },
  { label: 'Achievements', x: 65, y: 80 },
];
function AINodeAnimation({ p, prefersReduced }: { p: number; prefersReduced: boolean }) {
  return (
    <div className="story-ai-wrap" aria-hidden="true">
      <svg className="story-ai-svg" viewBox="0 0 300 220" fill="none">
        {/* Lines */}
        {AI_NODES.slice(1).map((n, i) => {
          const src = AI_NODES[0];
          const op = prefersReduced ? 0.4 : Math.max(0, p * 2 - i * 0.3);
          return (
            <line
              key={i}
              x1={src.x * 3} y1={src.y * 2.2}
              x2={n.x * 3} y2={n.y * 2.2}
              stroke="rgba(160,148,200,0.45)"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity={op}
            />
          );
        })}
        {/* Nodes */}
        {AI_NODES.map((n, i) => {
          const op = prefersReduced ? 1 : Math.max(0, p * 2 - i * 0.25);
          const scale = prefersReduced ? 1 : Math.min(1, p * 2 - i * 0.2);
          return (
            <g key={n.label} transform={`translate(${n.x * 3}, ${n.y * 2.2})`} opacity={op}>
              <circle
                r="22"
                fill="rgba(58,36,24,0.85)"
                stroke={i === 0 ? 'rgba(192,180,215,0.7)' : 'rgba(160,148,200,0.35)'}
                strokeWidth={i === 0 ? '1.5' : '1'}
                transform={`scale(${scale})`}
              />
              {i === 0 && (
                <circle r="28" fill="none" stroke="rgba(192,180,215,0.2)" strokeWidth="1" transform={`scale(${scale})`} />
              )}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fill="#d4c8a0"
                fontFamily="var(--font-inter, sans-serif)"
              >
                {n.label}
              </text>
            </g>
          );
        })}
        {/* Central pulsing ring */}
        <circle
          cx={AI_NODES[0].x * 3}
          cy={AI_NODES[0].y * 2.2}
          r={prefersReduced ? 35 : lerp(22, 40, (Math.sin(Date.now() / 1000) + 1) / 2)}
          fill="none"
          stroke="rgba(192,180,215,0.15)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* Portfolio browser mockup for Chapter 4 */
function PortfolioMockup({ p, prefersReduced }: { p: number; prefersReduced: boolean }) {
  const v = prefersReduced ? 1 : p;
  return (
    <div
      className="story-portfolio-wrap"
      style={{
        opacity: prefersReduced ? 1 : p,
        transform: `perspective(1000px) rotateX(${lerp(12, 0, v)}deg) scale(${lerp(0.88, 1, v)})`,
      }}
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div className="story-browser">
        <div className="story-browser-bar">
          <div className="story-browser-dots">
            <span style={{ background: '#c0503a' }} />
            <span style={{ background: '#d4a53a' }} />
            <span style={{ background: '#5ab55a' }} />
          </div>
          <div className="story-browser-url">
            <span>devcanvas.me/<strong>janesmit</strong></span>
          </div>
        </div>
        {/* "Website" content */}
        <div className="story-browser-content">
          <div className="story-site-hero-strip">
            <div
              className="story-site-name"
              style={{ opacity: prefersReduced ? 1 : Math.min(1, p * 2.5) }}
            >
              Jane Smith
            </div>
            <div
              className="story-site-title"
              style={{ opacity: prefersReduced ? 1 : Math.min(1, p * 2 - 0.3) }}
            >
              Software Engineer · Builder · Dreamer
            </div>
          </div>
          <div className="story-site-cards">
            {['Projects', 'Skills', 'Contact'].map((t, i) => (
              <div
                key={t}
                className="story-site-card"
                style={{ opacity: prefersReduced ? 1 : Math.max(0, p * 3 - i * 0.5 - 1) }}
              >
                <div className="story-site-card-label">{t}</div>
                <div className="story-site-card-line" />
                <div className="story-site-card-line story-site-card-line--short" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow underneath */}
      <div className="story-portfolio-glow" />
    </div>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
