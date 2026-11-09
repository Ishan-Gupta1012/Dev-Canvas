'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import type { SectionBreakdown, SectionStatus } from '@/lib/portfolioScore';

/* ─── Helpers ───────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  SectionStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  complete: {
    label: 'Complete',
    color: 'var(--dash-text)',
    bg: 'var(--dash-hover)',
    Icon: CheckCircle2,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'var(--dash-text-secondary)',
    bg: 'var(--dash-hover)',
    Icon: Clock,
  },
  'needs-improvement': {
    label: 'Needs Improvement',
    color: '#E95858',
    bg: 'rgba(233,88,88,0.12)',
    Icon: AlertCircle,
  },
};

/* ─── Mini progress bar inside each row ─────────────────────── */
function MiniBar({ pct, status }: { pct: number; status: SectionStatus }) {
  const fill =
    status === 'complete'
      ? 'var(--dash-text)'
      : status === 'in-progress'
      ? 'var(--dash-text-secondary)'
      : '#E95858';
  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: 'var(--dash-border)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  );
}

/* ─── Score ring for modal header ───────────────────────────── */
function ModalScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg viewBox="0 0 100 100" className="-rotate-90" width={96} height={96} aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--dash-border)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#E95858"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

/* ─── Section row ───────────────────────────────────────────── */
function SectionRow({ section }: { section: SectionBreakdown }) {
  const cfg = STATUS_CONFIG[section.status];
  const StatusIcon = cfg.Icon;
  return (
    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4 shadow-xs">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon size={15} style={{ color: cfg.color, flexShrink: 0 }} />
          <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--dash-text)' }}>
            {section.label}
          </p>
        </div>
        <span
          className="shrink-0 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Progress bar + pts */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1">
          <MiniBar pct={section.pct} status={section.status} />
        </div>
        <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--dash-text-secondary)' }}>
          {section.earned}/{section.max} pts
        </span>
      </div>

      {/* Explanation */}
      <p className="text-xs leading-snug mb-3" style={{ color: 'var(--dash-text-secondary)' }}>
        {section.explanation}
      </p>

      {/* Action button (only when not complete) */}
      {section.status !== 'complete' && (
        <Link
          href={section.href}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: 'var(--dash-invert-bg)', color: 'var(--dash-invert-text)' }}
        >
          {section.actionLabel} <ArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}

/* ─── Modal ─────────────────────────────────────────────────── */

type Props = {
  score: number;
  breakdown: SectionBreakdown[];
  portfolioTitle?: string;
  completedSections: number;
  totalSections: number;
  onClose: () => void;
};

export default function ScoreBreakdownModal({
  score,
  breakdown,
  portfolioTitle,
  completedSections,
  totalSections,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Close on backdrop click */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* Colour for overall score badge */
  const scoreColor =
    score >= 80 ? 'var(--dash-text)' : '#E95858';

  return (
    /* Backdrop */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'var(--dash-overlay)', backdropFilter: 'blur(4px)' }}
      aria-modal
      role="dialog"
      aria-label="Score Breakdown"
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88dvh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden border border-[var(--dash-border)]"
        style={{ background: 'var(--dash-surface)', boxShadow: 'var(--dash-modal-shadow)' }}
      >
        {/* ── Header ── */}
        <div
          className="shrink-0 px-6 pt-6 pb-5"
          style={{ borderBottom: '1px solid var(--dash-border)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <ModalScoreRing score={score} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-serif text-2xl font-bold leading-none"
                    style={{ color: scoreColor }}
                  >
                    {score}
                  </span>
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: 'var(--dash-text-secondary)' }}
                  >
                    /100
                  </span>
                </div>
              </div>
              <div>
                <p
                  className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
                  style={{ color: '#E95858' }}
                >
                  Portfolio Score
                </p>
                <h2
                  className="font-serif text-xl font-bold leading-tight"
                  style={{ color: 'var(--dash-text)' }}
                >
                  {portfolioTitle || 'Score Breakdown'}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--dash-text-secondary)' }}>
                  {completedSections} of {totalSections} sections complete ·{' '}
                  <span style={{ color: scoreColor, fontWeight: 600 }}>
                    {score >= 80
                      ? 'Strong profile'
                      : 'Needs work'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
              style={{ color: 'var(--dash-text-secondary)' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Overall bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--dash-text-secondary)' }}>
                Overall completeness
              </span>
              <span className="font-mono text-[11px] font-bold" style={{ color: scoreColor }}>
                {score}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--dash-border)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${score}%`,
                  background: score >= 80 ? 'var(--dash-text)' : '#E95858',
                  transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Scrollable section list ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-1"
            style={{ color: 'var(--dash-text-secondary)' }}
          >
            Section breakdown
          </p>
          {breakdown.map((section) => (
            <SectionRow key={section.key} section={section} />
          ))}
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 px-6 py-4 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderTop: '1px solid var(--dash-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--dash-text-secondary)' }}>
            Score updates automatically as you edit your portfolio.
          </p>
          <Link
            href="/dashboard/ai-builder"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: 'var(--dash-invert-bg)', color: 'var(--dash-invert-text)' }}
          >
            Open Builder <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

