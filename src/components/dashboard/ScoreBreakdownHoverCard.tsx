'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, X } from 'lucide-react';
import type { SectionBreakdown, SectionStatus } from '@/lib/portfolioScore';

const STATUS_CONFIG: Record<
  SectionStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  complete: {
    label: 'Complete',
    color: '#1A1C1E',
    bg: 'rgba(26,28,30,0.08)',
    Icon: CheckCircle2,
  },
  'in-progress': {
    label: 'In Progress',
    color: '#767B81',
    bg: 'rgba(118,123,129,0.12)',
    Icon: Clock,
  },
  'needs-improvement': {
    label: 'Needs Work',
    color: '#E95858',
    bg: 'rgba(233,88,88,0.12)',
    Icon: AlertCircle,
  },
};

function MiniBar({ pct, status }: { pct: number; status: SectionStatus }) {
  const fill =
    status === 'complete'
      ? '#1A1C1E'
      : status === 'in-progress'
      ? '#767B81'
      : '#E95858';
  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: 'rgba(218, 220, 224, 0.7)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  );
}

function SectionRow({ section }: { section: SectionBreakdown }) {
  const cfg = STATUS_CONFIG[section.status];
  const StatusIcon = cfg.Icon;
  return (
    <div
      className="rounded-2xl p-3.5 transition-all duration-200"
      style={{
        background: '#FFFFFF',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid #DADCE0',
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <StatusIcon size={14} style={{ color: cfg.color, flexShrink: 0 }} />
          <p className="text-xs font-semibold leading-tight truncate" style={{ color: '#1A1C1E' }}>
            {section.label}
          </p>
        </div>
        <span
          className="shrink-0 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1">
          <MiniBar pct={section.pct} status={section.status} />
        </div>
        <span className="font-mono text-[10px] shrink-0 font-medium" style={{ color: '#767B81' }}>
          {section.earned}/{section.max} pts
        </span>
      </div>

      <p className="text-[11px] leading-snug mb-2" style={{ color: '#767B81' }}>
        {section.explanation}
      </p>

      {section.status !== 'complete' && (
        <Link
          href={section.href}
          className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md transition-opacity hover:opacity-85"
          style={{ background: '#1A1C1E', color: '#FFFFFF' }}
        >
          {section.actionLabel} <ArrowRight size={10} />
        </Link>
      )}
    </div>
  );
}

type Props = {
  score: number;
  breakdown: SectionBreakdown[];
  portfolioTitle?: string;
  completedSections: number;
  totalSections: number;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function ScoreBreakdownHoverCard({
  score,
  breakdown,
  portfolioTitle,
  completedSections,
  totalSections,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scoreColor =
    score >= 80 ? '#1A1C1E' : '#E95858';

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-none"
      style={{
        background: 'rgba(26, 28, 30, 0.35)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        ref={panelRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl p-5 sm:p-6 overflow-hidden transition-all duration-300 pointer-events-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid #DADCE0',
          boxShadow:
            '0 24px 64px -12px rgba(26, 28, 30, 0.20), 0 8px 24px rgba(26, 28, 30, 0.06), inset 0 1.5px 2px rgba(255, 255, 255, 0.95)',
        }}
      >
        {/* Header */}
        <div className="pb-3.5 mb-3 border-b border-[#DADCE0]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#E95858' }}>
                Detailed Breakdown
              </p>
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight" style={{ color: '#1A1C1E' }}>
                {portfolioTitle || 'Portfolio Quality Score'}
              </h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-serif text-2xl font-bold leading-none" style={{ color: scoreColor }}>
                  {score}
                </span>
                <span className="font-mono text-[10px] ml-0.5" style={{ color: '#767B81' }}>
                  / 100
                </span>
                <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#767B81' }}>
                  {completedSections}/{totalSections} done
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 text-[#767B81] hover:text-[#1A1C1E]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-2.5 w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#DADCE0' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background: score >= 80 ? '#1A1C1E' : '#E95858',
              }}
            />
          </div>
        </div>

        {/* Scrollable sections list */}
        <div className="space-y-2.5 max-h-[46vh] sm:max-h-[50vh] overflow-y-auto pr-1">
          {breakdown.map((sec) => (
            <SectionRow key={sec.key} section={sec} />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3.5 mt-3 border-t border-[#DADCE0] flex items-center justify-between gap-2 text-xs flex-wrap">
          <span className="text-[11px]" style={{ color: '#767B81' }}>
            Updates live as you edit your portfolio.
          </span>
          <Link
            href="/dashboard/ai-builder"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-85"
            style={{ background: '#1A1C1E', color: '#FFFFFF' }}
          >
            Open Builder <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
