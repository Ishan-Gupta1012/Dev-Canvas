'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-lg py-md border-b border-outline-variant', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-lg py-md', className)} {...props}>
      {children}
    </div>
  );
}

type IconButtonProps = HTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label?: string;
  active?: boolean;
};

export function IconButton({ icon, label, active, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'p-sm rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors',
        active && 'text-primary bg-surface-container-low',
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  children: ReactNode;
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant',
    accent: 'bg-primary/10 text-primary',
    success: 'bg-surface-container-high text-on-surface',
    warning: 'bg-tertiary/10 text-tertiary',
    error: 'bg-error-container/20 text-on-error-container',
    outline: 'border border-outline-variant text-on-surface-variant',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type StatCardProps = {
  icon?: ReactNode;
  value: string | number;
  label: string;
  hint?: string;
  className?: string;
};

export function StatCard({ icon, value, label, hint, className }: StatCardProps) {
  return (
    <Card className={cn('p-lg flex flex-col items-center text-center', className)}>
      {icon && (
        <div className="mb-sm flex items-center justify-center text-primary">{icon}</div>
      )}
      <span className="text-3xl font-bold text-on-surface">{value}</span>
      <span className="mt-xs font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      {hint && (
        <span className="mt-xs text-xs text-on-surface-variant/70">{hint}</span>
      )}
    </Card>
  );
}

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, eyebrow, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-md flex-wrap', className)}>
      <div>
        {eyebrow && (
          <p className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/50 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">{title}</h2>
        {subtitle && (
          <p className="text-sm text-on-surface-variant mt-xs">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

type MetricBarProps = {
  label: string;
  value: number;
  max?: number;
  icon?: ReactNode;
  accent?: boolean;
};

export function MetricBar({ label, value, max = 100, icon, accent = false }: MetricBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm text-label-sm text-on-surface-variant">
          {icon && <span className="text-on-surface-variant">{icon}</span>}
          <span>{label}</span>
        </div>
        <span className="font-mono text-xs text-on-surface-variant">{pct}%</span>
      </div>
      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            accent ? 'bg-tertiary' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
};

export function ProgressRing({ value, size = 104, strokeWidth = 8, label, sublabel }: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-container-high"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-tertiary transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display-md text-display-md font-bold text-on-surface">{pct}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/60">
          {label}
        </span>
      </div>
      {sublabel && (
        <p className="absolute bottom-0 text-xs text-on-surface-variant">{sublabel}</p>
      )}
    </div>
  );
}
