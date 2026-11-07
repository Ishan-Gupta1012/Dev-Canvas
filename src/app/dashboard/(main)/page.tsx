'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ExternalLink,
  ArrowRight,
  Eye,
  Layers,
  BookOpen,
  Code2,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import PortfolioSwitcherBar from '@/components/dashboard/PortfolioSwitcherBar';
import ScoreBreakdownHoverCard from '@/components/dashboard/ScoreBreakdownHoverCard';
import {
  getPortfolioCompletion,
  buildSuggestions,
  type PortfolioLike,
} from '@/lib/portfolioScore';

const ACTIVE_PORTFOLIO_KEY = 'devcanvas_active_portfolio_id';

/* ─── Animated counter hook ─────────────────────────────────── */
function useCountUp(target: number, duration = 900) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;
    if (delta === 0) return;

    cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

/* ─── Score ring (CSS-transition based) ─────────────────────── */
function BentoScoreRing({ score }: { score: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.max(0, Math.min(100, score)) / 100) * circ;
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#DADCE0" strokeWidth="9" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#E95858"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="bento-gauge-ring"
      />
    </svg>
  );
}

/* ─── Stat tile ─────────────────────────────────────────────── */
function StatTile({
  icon: Icon,
  value,
  label,
  accent = '#1A1C1E',
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  value: string | number;
  label: string;
  accent?: string;
}) {
  return (
    <div className="bento-card p-4 flex items-center gap-3 min-w-0">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(26, 28, 30, 0.06)' }}
      >
        <Icon size={17} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p
          className="font-serif text-2xl font-bold leading-none"
          style={{ color: '#1A1C1E' }}
        >
          {value}
        </p>
        <p
          className="font-mono text-[10px] uppercase tracking-widest mt-0.5 truncate"
          style={{ color: '#767B81' }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── Dashboard page ─────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioLike[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scoreHovered, setScoreHovered] = useState(false);
  const isOverCardRef = useRef(false);
  const isOverModalRef = useRef(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fetched = useRef(false);

  /* ── Fetch portfolios ── */
  const fetchPortfolios = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoadingPortfolios(true);
      try {
        const res = await fetch('/api/portfolio/save', { cache: 'no-store' });
        if (!res.ok) {
          setPortfolios([]);
          return;
        }
        const json = await res.json();
        const list = Array.isArray(json?.portfolios)
          ? (json.portfolios as PortfolioLike[])
          : [];
        setPortfolios(list);
        setSelectedId((prev) => {
          if (prev && list.some((p) => p.id === prev)) return prev;
          const stored =
            typeof window !== 'undefined'
              ? localStorage.getItem(ACTIVE_PORTFOLIO_KEY)
              : null;
          if (stored && list.some((p) => p.id === stored)) return stored;
          return list[0]?.id ?? null;
        });
      } catch {
        setPortfolios([]);
      } finally {
        setLoadingPortfolios(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    if (selectedId && typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_PORTFOLIO_KEY, selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    const onFocus = () => void fetchPortfolios({ silent: true });
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchPortfolios]);

  /* ── Hover debounce helpers ── */
  const checkClose = (delay = 60) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (!isOverCardRef.current && !isOverModalRef.current) {
        setScoreHovered(false);
      }
    }, delay);
  };

  const handleMouseEnterScore = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    isOverCardRef.current = true;
    setScoreHovered(true);
  };

  const handleMouseLeaveScore = () => {
    isOverCardRef.current = false;
    checkClose(60);
  };

  const handleMouseEnterModal = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    isOverModalRef.current = true;
  };

  const handleMouseLeaveModal = () => {
    isOverModalRef.current = false;
    checkClose(60);
  };

  /* ── Derived data ── */
  const selected = useMemo(
    () => portfolios.find((p) => p.id === selectedId) ?? portfolios[0] ?? null,
    [portfolios, selectedId],
  );

  const completion = useMemo(
    () => getPortfolioCompletion(selected),
    [selected],
  );
  const suggestions = useMemo(
    () => buildSuggestions(selected),
    [selected],
  );

  const { score, checks, breakdown, stats, completedSections, totalSections, isPublished } =
    completion;

  /* ── Animated counter ── */
  const displayScore = useCountUp(score);

  const nextAction = checks.find((c) => !c.done);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName =
    user?.personalInfo?.name?.trim().split(/\s+/)[0] || 'Aparna';

  const creditsUsed = user?.aiCreditsUsed ?? 0;
  const creditsPct = Math.min((creditsUsed / 50) * 100, 100);

  const builderHref = selected?.id
    ? `/dashboard/builder?portfolio=${selected.id}`
    : '/dashboard/builder';
  const liveHref =
    selected?.status === 'published' && selected?.slug
      ? `/${selected.slug}`
      : user?.status === 'Published' && user?.username
        ? `https://${user.username}.portfolioai.dev`
        : null;

  return (
    <div
      className="relative min-h-full bento-grid-root dashboard-flow"
      style={{ background: '#F3F4F5' }}
    >
      {/* Greeting */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 md:pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1
              className="font-serif font-bold tracking-tight"
              style={{
                fontSize: 'clamp(1.55rem, 1.25rem + 1.1vw, 2.1rem)',
                color: '#1A1C1E',
                lineHeight: 1.15,
              }}
            >
              {greeting}, {firstName}.
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: '#767B81' }}>
              {!selected
                ? 'Create a portfolio to start tracking your score and checklist.'
                : score === 100
                  ? `${selected.title || 'This portfolio'} is complete — keep it fresh.`
                  : nextAction
                    ? `Next: ${nextAction.label.toLowerCase()}.`
                    : 'Keep improving your portfolio quality.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selected && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={
                  isPublished
                    ? {
                        background: 'rgba(26,28,30,0.06)',
                        color: '#1A1C1E',
                        border: '1px solid rgba(26,28,30,0.14)',
                      }
                    : {
                        background: 'rgba(233,88,88,0.10)',
                        color: '#E95858',
                        border: '1px solid rgba(233,88,88,0.24)',
                      }
                }
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
            )}
            {liveHref && (
              <a
                href={liveHref}
                target={liveHref.startsWith('http') ? '_blank' : undefined}
                rel={
                  liveHref.startsWith('http') ? 'noopener noreferrer' : undefined
                }
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: 'rgba(26,28,30,0.06)',
                  color: '#1A1C1E',
                  border: '1px solid #DADCE0',
                }}
              >
                <ExternalLink size={11} /> Live
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Switcher */}
      <PortfolioSwitcherBar
        portfolios={portfolios}
        selectedId={selectedId}
        onSelect={setSelectedId}
        loading={loadingPortfolios}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-6 md:pb-8">

        {/* Score + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-5 lg:items-start">

          {/* ── Score Card with Hover Breakdown ── */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={handleMouseEnterScore}
            onMouseLeave={handleMouseLeaveScore}
          >
            <div
              className="bento-card p-5 md:p-6 text-left w-full transition-all duration-200"
              style={{
                boxShadow: scoreHovered
                  ? 'var(--bento-shadow-hover)'
                  : undefined,
                transform: scoreHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
            >
              <div className="flex items-center gap-5">
                {/* Ring */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
                  <BentoScoreRing score={score} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="font-serif font-bold leading-none"
                      style={{
                        fontSize: 'clamp(1.9rem, 1.5rem + 1vw, 2.5rem)',
                        color: '#1A1C1E',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {displayScore}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest mt-0.5"
                      style={{ color: '#767B81' }}
                    >
                      / 100
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: '#E95858' }}
                  >
                    Portfolio Score
                  </p>
                  <p
                    className="font-serif text-xl md:text-2xl font-semibold leading-tight"
                    style={{ color: '#1A1C1E' }}
                  >
                    {selected
                      ? selected.title || 'Selected portfolio'
                      : 'No portfolio selected'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#767B81' }}>
                    {selected
                      ? `${completedSections} of ${totalSections} sections complete`
                      : 'Your score will appear after you create a portfolio.'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: '#767B81' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                          background: score === 100 ? '#1A1C1E' : '#E95858',
                        }}
                      />
                      {score === 100 ? 'Complete' : 'In progress'}
                    </span>
                    {nextAction && selected && (
                      <Link
                        href={builderHref}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider font-semibold transition-opacity hover:opacity-85"
                        style={{ background: '#1A1C1E', color: '#FFFFFF' }}
                      >
                        Fix next <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <p
                className="mt-3 pt-3 text-[11px] leading-snug"
                style={{
                  color: '#767B81',
                  borderTop: '1px solid #DADCE0',
                }}
              >
                {selected
                  ? 'Weighted by content quality. Hover to view complete score breakdown.'
                  : 'Score is weighted by content quality and completeness.'}
              </p>
            </div>

            {/* Hover Breakdown Popover in Center with Glassmorphism */}
            {scoreHovered && selected && (
              <ScoreBreakdownHoverCard
                score={score}
                breakdown={breakdown}
                portfolioTitle={selected.title}
                completedSections={completedSections}
                totalSections={totalSections}
                onClose={() => {
                  isOverCardRef.current = false;
                  isOverModalRef.current = false;
                  setScoreHovered(false);
                }}
                onMouseEnter={handleMouseEnterModal}
                onMouseLeave={handleMouseLeaveModal}
              />
            )}
          </div>

          {/* ── Stats column ── */}
          <div className="lg:col-span-7 flex flex-col gap-4 lg:gap-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 lg:gap-4">
              <StatTile
                icon={Eye}
                value={user?.sectionViews ?? 0}
                label="Profile Views"
                accent="#1A1C1E"
              />
              <StatTile
                icon={Layers}
                value={stats.projects}
                label="Projects"
                accent="#1A1C1E"
              />
              <StatTile
                icon={BookOpen}
                value={stats.roles}
                label="Roles"
                accent="#1A1C1E"
              />
              <StatTile
                icon={Code2}
                value={stats.skills}
                label="Skills"
                accent="#1A1C1E"
              />
            </div>
          </div>
        </div>

        {/* AI Credits Bar */}
        <div className="bento-card p-4 flex items-center justify-between gap-3 flex-wrap min-w-0">
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: '#767B81' }}
            >
              AI Credits
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#1A1C1E' }}>
              {creditsUsed} / 50
            </p>
          </div>
          <div className="w-[200px] sm:w-[300px] h-1.5 rounded-full overflow-hidden flex-shrink-0"
            style={{ background: '#DADCE0' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${creditsPct}%`,
                background: creditsUsed >= 40 ? '#E95858' : '#1A1C1E',
              }}
            />
          </div>
        </div>

        {/* Checklist + AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 mb-5 lg:items-start">
          {/* Checklist */}
          <div className="lg:col-span-7 bento-card p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-widest font-semibold"
                  style={{ color: '#767B81' }}
                >
                  Completion Checklist
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#767B81' }}>
                  Connected to the selected portfolio&apos;s actual data.
                </p>
              </div>
              <span
                className="font-mono text-[11px] font-semibold"
                style={{ color: '#1A1C1E' }}
              >
                {completedSections}/{totalSections}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
              {checks.map((c) => (
                <Link
                  key={c.key}
                  href={
                    selected?.id
                      ? `${c.href}${c.href.includes('?') ? '&' : '?'}portfolio=${selected.id}`
                      : c.href
                  }
                  className="flex items-center gap-2.5 py-2 px-1 rounded-lg transition-colors hover:bg-black/[0.04]"
                  style={{ color: c.done ? '#A3A6AC' : '#1A1C1E' }}
                >
                  {c.done ? (
                    <CheckCircle2
                      size={16}
                      style={{ color: '#1A1C1E', flexShrink: 0 }}
                    />
                  ) : (
                    <span
                      className="w-4 h-4 rounded-full border-2 shrink-0"
                      style={{ borderColor: '#DADCE0' }}
                      aria-hidden
                    />
                  )}
                  <span
                    className="text-sm leading-snug"
                    style={
                      c.done
                        ? { textDecoration: 'line-through', opacity: 0.7 }
                        : { fontWeight: 500 }
                    }
                  >
                    {c.label}
                  </span>
                </Link>
              ))}
            </div>
            {!selected && !loadingPortfolios && (
              <div
                className="mt-3 pt-3 flex items-center justify-between gap-3"
                style={{ borderTop: '1px solid #DADCE0' }}
              >
                <p className="text-sm" style={{ color: '#767B81' }}>
                  No portfolio data yet.
                </p>
                <Link
                  href="/dashboard/ai-builder"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider font-semibold"
                  style={{ background: '#1A1C1E', color: '#FFFFFF' }}
                >
                  <Sparkles size={13} /> Auto Build
                </Link>
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="lg:col-span-5 bento-card p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(233,88,88,0.10)' }}
              >
                <Lightbulb size={15} style={{ color: '#E95858' }} />
              </div>
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-widest font-semibold"
                  style={{ color: '#767B81' }}
                >
                  AI Suggestions
                </p>
                <p className="text-xs" style={{ color: '#767B81' }}>
                  Based on the selected portfolio
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              {suggestions.map((s, i) => (
                <div
                  key={`${s.title}-${i}`}
                  className="rounded-xl border border-[#DADCE0] bg-[#FFFFFF] p-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-sm font-semibold leading-snug"
                      style={{ color: '#1A1C1E' }}
                    >
                      {s.title}
                    </p>
                    {s.href && (
                      <Link
                        href={s.href.startsWith('/') ? s.href : '#'}
                        className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-[#767B81] hover:text-[#1A1C1E] transition-colors"
                      >
                        Open
                      </Link>
                    )}
                  </div>
                  <p
                    className="text-[13px] leading-snug mt-1"
                    style={{ color: '#767B81' }}
                  >
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
