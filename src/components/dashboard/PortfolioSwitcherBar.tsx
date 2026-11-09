'use client';

import Link from 'next/link';
import { ChevronRight, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getPortfolioCompletion, TEMPLATE_LABELS, type PortfolioLike } from '@/lib/portfolioScore';
import { cn } from '@/components/dashboard/ui';

type Props = {
  portfolios: PortfolioLike[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
};

function shortDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function PortfolioSwitcherBar({ portfolios, selectedId, onSelect, loading }: Props) {
  const [expanded, setExpanded] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (delta > 4 && y > 20) setExpanded(true);
        else if (delta < -4 || y <= 8) setExpanded(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="sticky top-[4.5rem] z-30 max-w-7xl mx-auto px-4 sm:px-8"
      aria-label="Portfolio switcher"
    >
      <div
        className={cn(
          'w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
          expanded ? 'scale-x-[1.04]' : 'scale-x-100'
        )}
        style={{ transformOrigin: 'center center' }}
      >
        <section
          className={cn(
            'rounded-[1.35rem] border border-[var(--dash-border)] bg-[var(--dash-surface-translucent)] backdrop-blur-md transition-[padding,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            expanded ? 'rounded-[1.6rem]' : 'rounded-[1.35rem]'
          )}
          style={{
            boxShadow: expanded
              ? 'var(--dash-card-shadow-expanded)'
              : 'var(--dash-card-shadow)',
          }}
        >
          <div
            className={cn(
              'px-3 sm:px-4 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              expanded ? 'py-3 sm:py-3.5' : 'py-2.5'
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-0 pr-1" style={{ scrollbarWidth: 'none' }}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'shrink-0 rounded-xl bg-surface-container-low border border-outline/10 animate-pulse transition-[height,width] duration-500',
                          expanded ? 'h-[58px] w-[232px]' : 'h-[52px] w-[220px]'
                        )}
                      />
                    ))}
                  </div>
                ) : portfolios.length === 0 ? (
                  <div className="text-sm text-on-surface-variant py-2 pr-2">No portfolios yet.</div>
                ) : (
                  portfolios.map((p) => {
                    const { completedSections, totalSections, score } = getPortfolioCompletion(p);
                    const active = p.id === selectedId;
                    const template = TEMPLATE_LABELS[p.template_name || ''] || p.template_name || 'Template';
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => p.id && onSelect(p.id)}
                        className={cn(
                          'shrink-0 text-left rounded-xl border px-3 transition-[padding,min-width,max-width,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                          expanded ? 'py-2.5 min-w-[224px] max-w-[296px]' : 'py-2 min-w-[210px] max-w-[280px]',
                          active
                            ? 'border-primary/30 bg-primary/5 shadow-[0_1px_0_rgba(122,46,31,0.06)]'
                            : 'border-outline/10 bg-background/70 hover:border-primary/20 hover:bg-surface-container-low/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={cn('text-sm font-semibold truncate', active ? 'text-primary' : 'text-on-surface')}>
                              {p.title || 'Untitled portfolio'}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/70 truncate mt-0.5">
                              {template}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className={cn('font-mono text-[11px] font-bold', active ? 'text-primary' : 'text-on-surface')}>
                              {score}%
                            </span>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/55">
                              {completedSections}/{totalSections}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1 flex-1 rounded-full bg-surface-container-high/80 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-[width] duration-500"
                              style={{ width: `${score}%`, background: active ? '#E95858' : 'var(--dash-text-secondary)' }}
                            />
                          </div>
                          <span className={cn('font-mono text-[9px] uppercase tracking-wider', p.status === 'published' ? 'text-[var(--dash-text)]' : 'text-on-surface-variant/55')}>
                            {p.status === 'published' ? 'Live' : 'Draft'}
                          </span>
                          {p.updated_at && (
                            <span className="font-mono text-[9px] text-on-surface-variant/45">{shortDate(p.updated_at)}</span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <Link
                href="/dashboard/ai-builder"
                className={cn(
                  'shrink-0 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/6 font-mono text-[11px] uppercase tracking-wider font-semibold text-primary hover:bg-primary/10 transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  expanded ? 'px-4 py-2.5' : 'px-3.5 py-2'
                )}
                title="Create new portfolio"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Create New Portfolio</span>
                <span className="sm:hidden">New</span>
                <ChevronRight size={13} className="opacity-55 hidden sm:block" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
