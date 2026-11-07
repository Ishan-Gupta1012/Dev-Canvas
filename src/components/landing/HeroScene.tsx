'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSceneScroll } from '@/components/landing/useSceneScroll';
import {
  ANNOTATIONS,
  RAIL,
  annotationBindings,
  annotationWindow,
  type Annotation,
} from '@/components/landing/hero/labels';

/**
 * The canvas is client-only: WebGL cannot render on the server and the film
 * must never block first paint, so it loads after hydration.
 */
const HeroCanvas = dynamic(() => import('@/components/landing/hero/HeroCanvas'), {
  ssr: false,
});

/** WebGL runs on genuine desktop widths; everything narrower gets the CSS cut. */
const DESKTOP_QUERY = '(min-width: 900px)';

const clampNum = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getDesktopSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getDesktopServerSnapshot = () => false;

/** Viewport size, so the CSS cut can be scaled as one fixed-size composition. */
function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange);
  window.addEventListener('orientationchange', onChange);
  return () => {
    window.removeEventListener('resize', onChange);
    window.removeEventListener('orientationchange', onChange);
  };
}

const getViewportWidth = () => window.innerWidth;
const getViewportHeight = () => window.innerHeight;
const getServerViewportSize = () => 0;

/**
 * Type scale, expressed so a single formula covers every aspect ratio:
 * `min(vw-based, vh-based)` is exactly "fit the 16:9 reference frame", and the
 * clamps only guard absurdly small or large windows.
 */
const TYPE = {
  title:
    'text-[clamp(26px,min(8.7vw,4.35dvh),56px)] min-[900px]:text-[clamp(34px,min(4.31vw,6.89dvh),104px)]',
  body:
    'text-[clamp(13px,min(3.7vw,1.86dvh),18px)] min-[900px]:text-[clamp(14px,min(1.18vw,1.89dvh),32px)]',
  caption:
    'text-[clamp(17px,min(5.1vw,2.55dvh),28px)] min-[900px]:text-[clamp(20px,min(1.94vw,3.11dvh),52px)]',
} as const;

/**
 * Four spoken beats, timed to the 3D timeline in HeroCanvas. They are the film's
 * subtitles, not a marketing pitch — one line each, read in under a second.
 */
const BEATS = [
  { range: [-0.04, 0.2] as const, line: 'You already did the work.' },
  { range: [0.2, 0.44] as const, line: 'The resume. The repos. The projects.' },
  { range: [0.44, 0.62] as const, line: 'One profile holds all of it.' },
  { range: [0.62, 0.85] as const, line: 'Out comes a resume — and a website.' },
];

/**
 * Scene 0 — a short film, not a chapter.
 *
 * The stage is pinned for the length of the runway, plays five 3D beats, then
 * releases: the last frame holds while the story scrolls up underneath it.
 * Counters stay 01–07 from the next section onward.
 */
export default function HeroScene({ autoPlay = false }: { autoPlay?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    getServerViewportSize
  );
  const viewportHeight = useSyncExternalStore(
    subscribeToViewport,
    getViewportHeight,
    getServerViewportSize
  );

  /* The CSS cut is authored at 390×780; scale it as one piece so it keeps shape. */
  const cssScale =
    viewportWidth > 0
      ? clampNum(Math.min(viewportWidth / 390, viewportHeight / 780), 0.62, 1.5)
      : 1;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { margin: '0px 0px -15% 0px' });

  const progress = useSceneScroll(sectionRef, ['start start', 'end end']);

  /* The title card is the film's last frame; it arrives after the cut. */
  const titleOpacity = useTransform(progress, [0.86, 0.94], [0, 1]);
  const titleY = useTransform(progress, [0.86, 0.96], reduce ? [0, 0] : [34, 0]);

  /* The scroll hint belongs to the opening beat only. */
  const hintOpacity = useTransform(progress, [0, 0.06, 0.12], [1, 1, 0]);

  /* Once the film is over the skip link is no longer needed. */
  const skipOpacity = useTransform(progress, [0, 0.9, 0.97], [1, 1, 0]);

  const [titleLive, setTitleLive] = useState(false);
  useMotionValueEvent(progress, 'change', (value) => {
    const next = value > 0.92;
    setTitleLive((prev) => (prev === next ? prev : next));
  });

  const handleGetStarted = () => router.push(user ? '/dashboard' : '/signin');

  const isAutoScrollingRef = useRef(false);

  // Cinematic Auto-scroll: plays the intro film automatically till the final beat, then unlocks full scrolling
  useEffect(() => {
    if (!autoPlay || reduce) return;

    // Only auto-play if starting from the top
    if (window.scrollY > 80) return;

    const section = sectionRef.current;
    if (!section) return;

    const targetDistance = (section.offsetHeight - window.innerHeight) * 0.95;
    if (targetDistance <= 0) return;

    isAutoScrollingRef.current = true;

    // Prevent manual wheel/touch interference during the cinematic playback
    const blockScroll = (e: Event) => {
      if (isAutoScrollingRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    // Total duration: ~9.2s, with a large deliberate slow-down around the orbit & tag callouts
    const DURATION = 9200;
    const startTime = performance.now();
    let animId: number;

    /**
     * Non-linear cinematic pacing curve:
     * - 0.00 -> 0.20: Smoothly forms the sphere (~1.6s)
     * - 0.20 -> 0.60: Noticeably SLOWS DOWN so the user can easily read all 7 floating tags,
     *                 observe the orbit, and absorb "One profile holds all of it." (~5.0s!)
     * - 0.60 -> 0.82: Merge collapse & flare (~1.4s)
     * - 0.82 -> 0.95: Output split into resume + portfolio, settling smoothly on the final title card (~1.2s)
     */
    const getCinematicProgress = (t: number): number => {
      if (t <= 0.18) {
        // Phase 1: Form sphere (progress 0.0 -> 0.20)
        const local = t / 0.18;
        const ease = local * local * (3 - 2 * local);
        return 0.20 * ease;
      } else if (t <= 0.72) {
        // Phase 2: SLOW-MOTION WINDOW around the tags & "One profile holds all of it."
        // progress 0.20 -> 0.60 over 54% of total time (~5 seconds)
        const local = (t - 0.18) / 0.54;
        return 0.20 + 0.40 * local;
      } else if (t <= 0.88) {
        // Phase 3: Core merge & flare (progress 0.60 -> 0.80)
        const local = (t - 0.72) / 0.16;
        const ease = local * local * (3 - 2 * local);
        return 0.60 + 0.20 * ease;
      } else {
        // Phase 4: Split & settle on "Your resume has a website in it." (progress 0.80 -> 0.95)
        const local = (t - 0.88) / 0.12;
        const ease = 1 - Math.pow(1 - local, 3);
        return 0.80 + 0.15 * ease;
      }
    };

    const step = (now: number) => {
      if (!isAutoScrollingRef.current) return;

      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      const progressRatio = getCinematicProgress(t);

      window.scrollTo({
        top: progressRatio * targetDistance,
        behavior: 'instant' as ScrollBehavior,
      });

      if (t < 1) {
        animId = requestAnimationFrame(step);
      } else {
        // Auto-scroll complete! Unlock full bi-directional user scrolling
        isAutoScrollingRef.current = false;
        window.removeEventListener('wheel', blockScroll);
        window.removeEventListener('touchmove', blockScroll);
      }
    };

    animId = requestAnimationFrame(step);

    return () => {
      isAutoScrollingRef.current = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
    };
  }, [autoPlay, reduce]);

  const skipToStory = () => {
    isAutoScrollingRef.current = false;
    document.getElementById('story')?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-[240vh] lg:h-[360vh] motion-reduce:h-[100dvh]"
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden motion-reduce:relative">
        {/* ── Background: clean white, crisp silver falloff ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #FFFFFF 34%, rgba(255,255,255,0) 70%), linear-gradient(180deg, #FFFFFF 0%, #F6F7F8 58%, #E9EBED 100%)',
          }}
        />

        {/* ── Atmosphere: two defined silver pools behind the stage ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 520px 420px at 50% 36%, rgba(118,124,133,0.16) 0%, rgba(118,124,133,0.05) 44%, transparent 64%), radial-gradient(ellipse 700px 520px at 16% 10%, rgba(146,152,161,0.16) 0%, transparent 58%)',
          }}
        />

        {/* ── Vignette: a hard frame so the centre reads bright ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 72% at 50% 44%, rgba(255,255,255,0) 40%, rgba(140,146,155,0.14) 74%, rgba(96,102,110,0.26) 100%)',
          }}
        />

        {/* ── The stage ── */}
        <div
          ref={stageRef}
          aria-hidden="true"
          className="absolute inset-0 z-10 motion-reduce:opacity-100"
          style={{ opacity: reduce ? 0.9 : 1 }}
        >
          {isDesktop && !reduce ? (
            <HeroCanvas progress={progress} reduce={reduce} active={stageInView} />
          ) : (
            <MobileStage progress={progress} reduce={reduce} scale={cssScale} />
          )}
        </div>

        {/* ── Scrim: keeps the type legible over the stage ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46%]"
          style={{
            background:
              'linear-gradient(to top, #E9EAEB 0%, rgba(233,234,235,0.92) 16%, rgba(255,255,255,0.58) 42%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* ── Annotations: names for the particles in the orbit ── */}
        {isDesktop && !reduce && (
          <AnnotationLayer progress={progress} />
        )}

        {/* ── Split labels: RESUME / PORTFOLIO appear after the sphere emits them ── */}
        {isDesktop && !reduce && (
          <SplitLabels progress={progress} />
        )}

        {/* ── Section label: the promise, from the first frame ── */}
        <div className="pointer-events-none absolute inset-x-0 top-8 z-30 flex justify-center px-6 lg:top-10">
          <span className="inline-flex items-center gap-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#777C82]">
            <span className="h-px w-6 bg-[rgba(41,44,48,0.22)]" />
            PDF in · Site out
            <span className="h-px w-6 bg-[rgba(41,44,48,0.22)]" />
          </span>
        </div>

        {/* ── Beat captions (the film's subtitles) ── */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[13vh] z-30 px-6">
            <div
              className={`relative mx-auto h-[clamp(64px,11.5dvh,132px)] w-full max-w-[min(88vw,23em)] ${TYPE.caption}`}
            >
              {BEATS.map((beat) => (
                <BeatCaption key={beat.line} progress={progress} beat={beat} />
              ))}
            </div>
          </div>
        )}

        {/* ── Title card ── */}
        <motion.div
          className="absolute inset-x-0 bottom-[5vh] z-30 px-6 lg:bottom-[6vh]"
          style={{
            opacity: reduce ? 1 : titleOpacity,
            y: reduce ? 0 : titleY,
            pointerEvents: titleLive || reduce ? 'auto' : 'none',
          }}
        >
          <div className="mx-auto w-full max-w-[min(94vw,900px)] text-center">
            <h1
              className={`mx-auto max-w-[min(92vw,12.4em)] text-balance font-bold leading-[1.06] tracking-[-0.03em] text-[#23262A] ${TYPE.title}`}
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Your resume has
              <br className="hidden sm:block" />{' '}
              <span className="bg-gradient-to-r from-[#DC2626] via-[#E04848] to-[#F87171] bg-clip-text text-transparent">a website</span> in it.
            </h1>

            <p
              className={`mx-auto mt-[1.9dvh] max-w-[min(90vw,30em)] leading-relaxed text-[#6E737A] [@media(max-height:620px)]:hidden ${TYPE.body}`}
            >
              Drop in the PDF you already send to recruiters. The same profile
              becomes a resume and a live portfolio — one link, always in sync.
            </p>

            <div className="mt-[3dvh] flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleGetStarted}
                className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#292C30] px-6 py-3.5 text-[13px] font-semibold tracking-wide text-[#F4F4F2] shadow-[0_8px_24px_rgba(41,44,48,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A1B1D] hover:shadow-[0_10px_28px_rgba(41,44,48,0.32)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#292C30] lg:text-sm"
              >
                <span>Start with my resume</span>
                <ArrowRight
                  size={15}
                  strokeWidth={2.2}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-full border border-[rgba(41,44,48,0.16)] bg-[rgba(255,255,255,0.72)] px-6 py-3.5 text-[13px] font-medium text-[#292C30] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.95)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#292C30] lg:text-sm"
              >
                See how it works
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── Scroll hint (opening beat only) ── */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[3.4vh] z-30 flex justify-center"
            style={{ opacity: hintOpacity }}
          >
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#777C82]">
              <span className="animate-bounce">↓</span> Scroll
            </span>
          </motion.div>
        )}

        {/* ── Skip: never trap someone inside the film ── */}
        <motion.button
          onClick={skipToStory}
          style={{ opacity: skipOpacity }}
          className="absolute bottom-[3.2vh] left-5 z-30 cursor-pointer rounded-full border border-[rgba(41,44,48,0.14)] bg-[rgba(255,255,255,0.72)] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#777C82] backdrop-blur-md transition-colors duration-200 hover:border-[rgba(41,44,48,0.32)] hover:text-[#292C30] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#292C30] sm:bottom-auto sm:left-auto sm:right-8 sm:top-8 lg:right-12 lg:top-10"
        >
          Skip intro
        </motion.button>
      </div>
    </section>
  );
}

/* ─── Annotations ──────────────────────────────────────────────────────── */

/**
 * The callout layer for the 3D film.
 *
 * The wrapper is the same 8:5 window the camera is fitted to, so a callout
 * lands at the same point of the composition on a 21:9 monitor, a 1440×900
 * laptop and a portrait tablet. The text is HTML (crisp at any DPR); the leader
 * lines are SVG in percentage space, so they never need measuring.
 */
function AnnotationLayer({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute left-1/2 top-1/2 aspect-[8/5] w-[min(100%,160dvh)] -translate-x-1/2 -translate-y-1/2">
        {ANNOTATIONS.map((label, index) => (
          <Annotation key={label.id} label={label} index={index} progress={progress} />
        ))}
      </div>
    </div>
  );
}

function Annotation({
  label,
  index,
  progress,
}: {
  label: Annotation;
  index: number;
  progress: MotionValue<number>;
}) {
  const { appear, leave } = annotationWindow(index);
  const left = label.side === 'left';

  const opacity = useTransform(
    progress,
    [appear[0], appear[1], leave[0], leave[1]],
    [0, 1, 1, 0],
    { clamp: true }
  );
  /* Slide in from the outside edge — labels feel like they arrive one by one. */
  const shift = useTransform(
    progress,
    [appear[0], appear[1]],
    [left ? 14 : -14, 0],
    { clamp: true }
  );
  /* Slight vertical drift so each label is visually distinct on arrival. */
  const rise = useTransform(
    progress,
    [appear[0], appear[1]],
    [6, 0],
    { clamp: true }
  );

  return (
    <>
      {/* Leader line + anchor dot — driven by the WebGL render loop */}
      <motion.div style={{ opacity }} className="absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            ref={(node) => {
              const slot = (annotationBindings[index] ??= { line: null, dot: null });
              slot.line = node;
              return () => {
                slot.line = null;
              };
            }}
            fill="none"
            stroke="rgba(150,156,163,0.65)"
            strokeWidth={0.9}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Anchor dot on the orbit */}
        <div
          ref={(node) => {
            const slot = (annotationBindings[index] ??= { line: null, dot: null });
            slot.dot = node;
            return () => {
              slot.dot = null;
            };
          }}
          className="absolute h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5A5F66]"
          style={{
            boxShadow:
              '0 0 0 2.5px rgba(255,255,255,0.9), 0 0 0 4px rgba(140,146,153,0.25)',
          }}
        />
      </motion.div>

      {/* Label text — slides in from the outside edge */}
      <motion.div
        style={{
          top: `${label.slot}%`,
          width: `${RAIL.width}%`,
          opacity,
          x: shift,
          y: rise,
          ...(left ? { left: `${RAIL.inset}%` } : { right: `${RAIL.inset}%` }),
        }}
        className={`absolute ${left ? 'text-right' : 'text-left'}`}
      >
        <p className="font-mono text-[clamp(7.5px,min(0.694vw,1.111dvh),11px)] font-semibold uppercase leading-none tracking-[0.2em] text-[#3C4046]">
          {label.title}
        </p>
        <p className="mt-[0.55em] text-[clamp(8.5px,min(0.764vw,1.222dvh),12px)] leading-[1.3] text-[#7E838A]">
          {label.sub}
        </p>
      </motion.div>
    </>
  );
}

/* ─── Split labels ──────────────────────────────────────────────────────── */

/**
 * Minimal uppercase RESUME / PORTFOLIO labels that appear after the sphere
 * emits its two outputs. Each label floats above its card with a hairline rule,
 * fades in independently, then clears before the headline takes the stage.
 *
 * Positioned inside the same 8:5 frame as AnnotationLayer so they align
 * perfectly with the 3D composition at any screen size.
 */
function SplitLabels({ progress }: { progress: MotionValue<number> }) {
  /*
   * Split phase: T.split = [0.62, 0.84].
   * Cards are clearly separated by ≈ 0.70. Labels appear after that moment
   * so the sphere has already performed its reveal. Both exit before the
   * headline arrives at 0.86.
   */
  const resumeOpacity = useTransform(
    progress,
    [0.70, 0.76, 0.83, 0.87],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const resumeY = useTransform(progress, [0.70, 0.76], [8, 0], { clamp: true });

  const portfolioOpacity = useTransform(
    progress,
    [0.73, 0.79, 0.83, 0.87],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const portfolioY = useTransform(progress, [0.73, 0.79], [8, 0], { clamp: true });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      {/* Same frame window as AnnotationLayer */}
      <div className="absolute left-1/2 top-1/2 aspect-[8/5] w-[min(100%,160dvh)] -translate-x-1/2 -translate-y-1/2">

        {/* RESUME — floats above the left card, ~14 % from the left edge of the frame */}
        <motion.div
          style={{
            opacity: resumeOpacity,
            y: resumeY,
            left: '14%',
            top: '34%',
          }}
          className="absolute flex flex-col items-center gap-[7px]"
        >
          <span
            className="h-px w-5"
            style={{ background: 'rgba(41,44,48,0.18)' }}
          />
          <p
            className="font-mono font-semibold uppercase leading-none tracking-[0.22em]"
            style={{
              fontSize: 'clamp(7px,min(0.65vw,1.04dvh),10px)',
              color: '#5C6068',
            }}
          >
            Resume
          </p>
        </motion.div>

        {/* PORTFOLIO — floats above the right card, ~4 % from the right edge of the frame */}
        <motion.div
          style={{
            opacity: portfolioOpacity,
            y: portfolioY,
            right: '8%',
            top: '34%',
          }}
          className="absolute flex flex-col items-center gap-[7px]"
        >
          <span
            className="h-px w-5"
            style={{ background: 'rgba(41,44,48,0.18)' }}
          />
          <p
            className="font-mono font-semibold uppercase leading-none tracking-[0.22em]"
            style={{
              fontSize: 'clamp(7px,min(0.65vw,1.04dvh),10px)',
              color: '#5C6068',
            }}
          >
            Portfolio
          </p>
        </motion.div>

      </div>
    </div>
  );
}

/* ─── Caption ──────────────────────────────────────────────────────────── */

function BeatCaption({
  progress,
  beat,
}: {
  progress: MotionValue<number>;
  beat: (typeof BEATS)[number];
}) {
  const [start, end] = beat.range;

  const opacity = useTransform(
    progress,
    [start, start + 0.03, end - 0.03, end],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const y = useTransform(progress, [start, end], [8, -8]);

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-balance text-center font-medium leading-[1.3] tracking-[-0.01em] text-[#2A2D32]"
      aria-hidden="true"
    >
      {beat.line}
    </motion.p>
  );
}

/* ─── Non-WebGL cut of the same film ───────────────────────────────────── */

/**
 * Phones and reduced-motion get the same story in pure CSS: the core rises out
 * of the haze, then emits the resume and the site. No canvas, no main-thread
 * cost, identical silhouette.
 */
function MobileStage({
  progress,
  reduce,
  scale,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  scale: number;
}) {
  const coreScale = useTransform(progress, [0, 0.22, 0.62, 0.84, 1], [0.55, 1, 0.86, 0.9, 0.98]);
  const split = useTransform(progress, [0.6, 0.82], [0, 1]);
  const cardsOpacity = useTransform(progress, [0.58, 0.7], [0, 1]);
  const cardScale = useTransform(split, [0, 1], [0.68, 1]);
  const leftX = useTransform(split, [0, 1], [0, -118]);
  const rightX = useTransform(split, [0, 1], [0, 118]);

  return (
    <div className="absolute inset-x-0 top-[8%] z-10 flex justify-center">
      {/* Authored at 390×300, then scaled as one piece — never reflowed. */}
      <div
        className="relative grid h-[300px] w-[390px] shrink-0 place-items-center"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
      >
        {/* Core */}
        <motion.div
          className="col-start-1 row-start-1"
          style={{ scale: reduce ? 1 : coreScale }}
        >
          <CoreOrb />
        </motion.div>

        {/* Resume */}
        <motion.div
          className="col-start-1 row-start-1 -translate-y-2"
          style={{
            x: reduce ? -118 : leftX,
            opacity: reduce ? 1 : cardsOpacity,
            scale: reduce ? 1 : cardScale,
          }}
        >
          <ResumeCard />
        </motion.div>

        {/* Site */}
        <motion.div
          className="col-start-1 row-start-1 translate-y-3"
          style={{
            x: reduce ? 118 : rightX,
            opacity: reduce ? 1 : cardsOpacity,
            scale: reduce ? 1 : cardScale,
          }}
        >
          <SiteCard />
        </motion.div>
      </div>
    </div>
  );
}

function CoreOrb() {
  return (
    <div className="relative h-[172px] w-[172px] xs:h-[190px] xs:w-[190px]">
      <div
        className="absolute inset-[-10%] rounded-full border"
        style={{ borderColor: 'rgba(41, 44, 48, 0.18)', transform: 'rotateX(68deg) rotateZ(-14deg)' }}
      />
      <div
        className="absolute inset-[-2%] rounded-full border"
        style={{ borderColor: 'rgba(41, 44, 48, 0.12)', transform: 'rotateX(74deg) rotateZ(36deg)' }}
      />
      <div
        className="absolute inset-[12%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 34% 26%, #787C85 0%, #44474E 22%, #26282D 50%, #141519 78%, #08090B 100%)',
          boxShadow:
            '0 30px 70px -26px rgba(20, 22, 26, 0.55), inset 0 -16px 40px rgba(15, 16, 20, 0.7), inset 0 10px 26px rgba(255, 255, 255, 0.16)',
        }}
      />
      <div
        className="absolute inset-[12%] overflow-hidden rounded-full"
        style={{
          background:
            'conic-gradient(from 208deg at 50% 50%, rgba(255,255,255,0.22) 0deg, rgba(255,255,255,0) 38deg, rgba(0,0,0,0.5) 96deg, rgba(0,0,0,0) 148deg, rgba(255,255,255,0.18) 206deg, rgba(255,255,255,0) 256deg, rgba(0,0,0,0.4) 308deg, rgba(255,255,255,0.24) 360deg)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        className="absolute inset-[34%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(226,223,244,0.4) 0%, rgba(196,192,224,0.18) 48%, rgba(196,192,224,0) 74%)',
          filter: 'blur(6px)',
        }}
      />
    </div>
  );
}

function ResumeCard() {
  return (
    <div className="w-[76px] rounded-[9px] border border-[rgba(41,44,48,0.14)] bg-[#FCFCFB] p-[8px] shadow-[0_18px_36px_rgba(41,44,48,0.18)]">
      <div className="h-[5px] w-[30px] rounded-full bg-[#23262A]" />
      <div className="mt-[4px] h-[3px] w-[20px] rounded-full bg-[#8C86A6]/80" />
      <div className="mt-[9px] space-y-[3.5px]">
        {[100, 84, 92, 70, 88, 78].map((width, index) => (
          <div
            key={index}
            className="h-[2px] rounded-full bg-[rgba(41,44,48,0.18)]"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      <div className="mt-[7px] grid grid-cols-2 gap-[4px]">
        <div className="h-[14px] rounded-[3px] bg-[#EDEDEF]" />
        <div className="h-[14px] rounded-[3px] bg-[#EDEDEF]" />
      </div>
    </div>
  );
}

function SiteCard() {
  return (
    <div className="w-[108px] overflow-hidden rounded-[9px] border border-[rgba(41,44,48,0.14)] bg-[#FCFCFB] shadow-[0_18px_36px_rgba(41,44,48,0.18)]">
      <div className="flex items-center gap-[3px] bg-[#EFF0F2] px-[6px] py-[4px]">
        <span className="h-[3px] w-[3px] rounded-full bg-[#8C86A6]" />
        <span className="h-[3px] w-[3px] rounded-full bg-[rgba(41,44,48,0.2)]" />
        <span className="h-[3px] w-[3px] rounded-full bg-[rgba(41,44,48,0.2)]" />
        <span className="ml-1 h-[4px] flex-1 rounded-full bg-[rgba(41,44,48,0.12)]" />
      </div>
      <div className="p-[7px]">
        <div className="flex items-center gap-[6px]">
          <div className="h-[18px] w-[18px] rounded-full bg-[#D3D4D8]" />
          <div className="flex-1 space-y-[3px]">
            <div className="h-[3px] w-[42px] rounded-full bg-[#23262A]" />
            <div className="h-[2px] w-[26px] rounded-full bg-[rgba(41,44,48,0.24)]" />
          </div>
        </div>
        <div className="mt-[7px] grid grid-cols-2 gap-[4px]">
          <div className="h-[22px] rounded-[3px] bg-[#EDEDEF]" />
          <div className="h-[22px] rounded-[3px] bg-[#EDEDEF]" />
        </div>
      </div>
    </div>
  );
}
