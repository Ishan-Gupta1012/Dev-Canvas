'use client';

import React, { useState, useCallback } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PortfolioData } from '@/types/portfolio';

interface DownloadZipButtonProps {
  portfolioData: PortfolioData;
  templateName: string;
  /** Optional className override for the button container */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'outline' | 'compact';
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export default function DownloadZipButton({
  portfolioData,
  templateName,
  className,
  variant = 'default',
}: DownloadZipButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const [progress, setProgress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleDownload = useCallback(async () => {
    if (state === 'loading') return;

    setState('loading');
    setProgress('Initialising…');
    setErrorMsg('');

    try {
      // Dynamic import so JSZip is only loaded when the user clicks
      const { exportPortfolioZip } = await import('@/utils/exportPortfolioZip');
      await exportPortfolioZip(portfolioData, templateName, (msg: string) => {
        setProgress(msg);
      });
      setState('success');
      setProgress('');
      setTimeout(() => setState('idle'), 3500);
    } catch (err) {
      console.error('[DownloadZipButton] Export failed:', err);
      setState('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Download failed. Please try again.'
      );
      setTimeout(() => {
        setState('idle');
        setErrorMsg('');
      }, 5000);
    }
  }, [portfolioData, templateName, state]);

  // ─── Shared button internals ──────────────────────────────────────────────

  const icon = {
    idle: <Download size={16} />,
    loading: <Loader2 size={16} className="animate-spin" />,
    success: <CheckCircle size={16} />,
    error: <AlertCircle size={16} />,
  }[state];

  const label = {
    idle: 'Download ZIP',
    loading: progress || 'Preparing…',
    success: 'Downloaded!',
    error: 'Failed',
  }[state];

  const isDisabled = state === 'loading';

  // ─── Variants ─────────────────────────────────────────────────────────────

  if (variant === 'compact') {
    return (
      <div className={className}>
        <button
          onClick={handleDownload}
          disabled={isDisabled}
          title={
            state === 'error'
              ? errorMsg
              : state === 'loading'
              ? progress
              : 'Download portfolio as a standalone ZIP'
          }
          className={[
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider font-bold transition-all',
            state === 'success'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
              : state === 'error'
              ? 'bg-red-600/20 text-red-400 border border-red-600/30'
              : 'border border-outline/20 text-on-surface-variant hover:text-primary hover:border-primary/40 bg-background',
            isDisabled ? 'opacity-60 cursor-wait' : 'cursor-pointer',
          ].join(' ')}
        >
          {icon}
          <span>{label}</span>
        </button>
        {state === 'error' && errorMsg && (
          <p className="mt-1 text-[11px] text-red-400 font-mono">{errorMsg}</p>
        )}
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <div className={className}>
        <button
          onClick={handleDownload}
          disabled={isDisabled}
          title={
            state === 'error'
              ? errorMsg
              : state === 'loading'
              ? progress
              : 'Download portfolio as a standalone ZIP'
          }
          className={[
            'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all border',
            state === 'success'
              ? 'bg-emerald-600/10 text-emerald-500 border-emerald-600/30'
              : state === 'error'
              ? 'bg-red-600/10 text-red-500 border-red-600/30'
              : 'border-outline/25 bg-background text-on-surface hover:border-primary/50 hover:text-primary',
            isDisabled ? 'opacity-60 cursor-wait' : 'cursor-pointer',
          ].join(' ')}
        >
          {icon}
          <span className="whitespace-nowrap">{label}</span>
        </button>
        {state === 'loading' && (
          <p className="mt-2 text-xs text-on-surface-variant/70 font-mono text-center">
            {progress}
          </p>
        )}
        {state === 'error' && errorMsg && (
          <p className="mt-2 text-xs text-red-500 font-mono text-center">{errorMsg}</p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      <button
        onClick={handleDownload}
        disabled={isDisabled}
        title={
          state === 'error'
            ? errorMsg
            : state === 'loading'
            ? progress
            : 'Download portfolio as a standalone ZIP file'
        }
        className={[
          'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-sm uppercase tracking-wider font-bold transition-all shadow-md active:scale-[.98]',
          state === 'success'
            ? 'bg-emerald-600 text-white shadow-emerald-600/20'
            : state === 'error'
            ? 'bg-red-600 text-white shadow-red-600/20'
            : 'bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20',
          isDisabled ? 'opacity-70 cursor-wait' : 'cursor-pointer',
        ].join(' ')}
      >
        {icon}
        <span className="whitespace-nowrap">{label}</span>
      </button>

      {/* Progress / Error message below button */}
      {state === 'loading' && progress && (
        <p className="mt-2 text-xs text-on-surface-variant/70 font-mono text-center animate-pulse">
          {progress}
        </p>
      )}
      {state === 'error' && errorMsg && (
        <p className="mt-2 text-xs text-red-500 font-mono text-center">{errorMsg}</p>
      )}
      {state === 'success' && (
        <p className="mt-2 text-xs text-emerald-500 font-mono text-center">
          ZIP saved — open index.html to view!
        </p>
      )}
    </div>
  );
}

