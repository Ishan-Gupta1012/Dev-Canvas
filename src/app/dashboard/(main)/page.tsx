'use client';

import { useMemo } from 'react';
import type { ComponentType } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  FilePlus,
  LayoutTemplate,
  FileText,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileSearch,
  Eye,
  Layers,
  Cpu,
  TrendingUp,
  BookOpen,
  Code2,
  AlertCircle,
} from 'lucide-react';

function usePortfolioScore(user: ReturnType<typeof useAuth>['user']) {
  return useMemo(() => {
    if (!user) return { score: 0, checks: [] as { label: string; done: boolean; href: string }[] };
    const checks = [
      { label: 'Personal info filled', done: !!(user.personalInfo?.name && user.personalInfo?.title), href: '/dashboard/resume-builder' },
      { label: 'Bio written', done: !!(user.bio && user.bio.length > 20), href: '/dashboard/resume-builder' },
      { label: 'At least 1 project added', done: (user.projects?.length ?? 0) > 0, href: '/dashboard/resume-builder' },
      { label: 'Work experience added', done: (user.experience?.length ?? 0) > 0, href: '/dashboard/resume-builder' },
      { label: 'Skills listed (3+)', done: (user.skills?.length ?? 0) >= 3, href: '/dashboard/resume-builder' },
      { label: 'Resume uploaded', done: !!(user.resumeData && Object.keys(user.resumeData).length > 0), href: '/dashboard/resume' },
      { label: 'Template selected', done: !!(user.themeSettings?.templateName), href: '/dashboard/templates' },
      { label: 'Portfolio published', done: user.status === 'Published', href: '/dashboard/settings' },
    ];
    const done = checks.filter((c) => c.done).length;
    return { score: Math.round((done / checks.length) * 100), checks };
  }, [user]);
}

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 60 ? '#10b981' : score >= 30 ? '#f59e0b' : '#ef4444';
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-[#111111]/10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1)' }} />
    </svg>
  );
}

type QA = { label: string; desc: string; href: string; icon: ComponentType<{ size?: number; className?: string }>; accent: string };
const quickActions: QA[] = [
  { label: 'Build Content', desc: 'Add projects & skills', href: '/dashboard/resume-builder', icon: FilePlus, accent: '#3b82f6' },
  { label: 'AI Polish', desc: 'Let AI enhance it', href: '/dashboard/ai-builder', icon: Sparkles, accent: '#8b5cf6' },
  { label: 'Pick Template', desc: 'Choose your design', href: '/dashboard/templates', icon: LayoutTemplate, accent: '#10b981' },
  { label: 'Upload Resume', desc: 'Parse an existing one', href: '/dashboard/resume', icon: FileText, accent: '#f59e0b' },
  { label: 'Analyze Resume', desc: 'Get AI feedback', href: '/dashboard/resume-analyzer', icon: FileSearch, accent: '#ec4899' },
];

function StatChip({ icon: Icon, value, label }: { icon: ComponentType<{ size?: number }>; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-[#F7F4EF] border border-[#111111]/10 rounded-xl">
      <div className="p-3 bg-[#111111]/5 rounded-lg"><Icon size={20} /></div>
      <div>
        <p className="font-serif text-2xl font-bold text-[#111111] leading-none">{value}</p>
        <p className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { score, checks } = usePortfolioScore(user);
  const firstName = user?.personalInfo?.name?.split(' ')[0] || 'Developer';
  const nextAction = checks.find((c) => !c.done);
  const completedCount = checks.filter((c) => c.done).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10 text-[#111111]">

      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            Good {greeting}, {firstName}.
          </h1>
          <p className="text-lg text-[#111111]/60 mt-2">
            {score === 100 ? 'Your portfolio is complete. Keep it fresh!' : nextAction ? `Next up: ${nextAction.label.toLowerCase()}.` : 'Looking good — keep going!'}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {user?.status && (
            <span className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border ${
              user?.status === 'Published'
                ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
            }`}>
              {user.status}
            </span>
          )}
          {user?.status === 'Published' && user?.username && (
            <a href={`https://${user.username}.portfolioai.dev`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-[#10b981]/40 text-[#10b981] bg-[#10b981]/5 hover:bg-[#10b981]/10 transition-colors">
              <ExternalLink size={14} /> View live
            </a>
          )}
        </div>
      </div>

      {/* Score + Stats + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score card */}
        <div className="bg-[#F7F4EF] border border-[#111111]/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-6">
          <div className="relative w-48 h-48">
            <ScoreRing score={score} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-6xl font-bold text-[#111111]">{score}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mt-1">% done</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-serif text-xl font-semibold text-[#111111]">Portfolio Score</p>
            <p className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mt-1">{completedCount} of {checks.length} sections done</p>
          </div>
          {nextAction && (
            <Link href={nextAction.href}
              className="w-full text-center font-mono text-sm uppercase tracking-widest bg-[#111111] text-[#F7F4EF] py-3 px-4 rounded-lg hover:bg-[#111111]/80 transition-colors flex items-center justify-center gap-2">
              Fix next: {nextAction.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Stats + checklist */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatChip icon={Eye} value={user?.sectionViews ?? 0} label="Profile Views" />
            <StatChip icon={Layers} value={user?.projects?.length ?? 0} label="Projects" />
            <StatChip icon={BookOpen} value={user?.experience?.length ?? 0} label="Roles" />
            <StatChip icon={Code2} value={user?.skills?.length ?? 0} label="Skills" />
          </div>

          {/* AI credits */}
          <div className="bg-[#F7F4EF] border border-[#111111]/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Cpu size={18} className="text-[#8b5cf6]" />
                <p className="font-mono text-sm uppercase tracking-widest text-[#111111]/60">AI Credits Used</p>
              </div>
              <span className="font-serif text-xl font-bold">{user?.aiCreditsUsed ?? 0} / 50</span>
            </div>
            <div className="w-full h-2 bg-[#111111]/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(((user?.aiCreditsUsed ?? 0) / 50) * 100, 100)}%`, backgroundColor: (user?.aiCreditsUsed ?? 0) >= 40 ? '#ef4444' : '#8b5cf6' }} />
            </div>
            <p className="font-mono text-xs text-[#111111]/50 mt-2">{50 - (user?.aiCreditsUsed ?? 0)} credits remaining this month</p>
          </div>

          {/* Checklist */}
          <div className="bg-[#F7F4EF] border border-[#111111]/10 rounded-2xl p-6 flex-1">
            <p className="font-mono text-sm uppercase tracking-widest text-[#111111]/50 mb-4">Completion Checklist</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {checks.map((c) => (
                <Link key={c.label} href={c.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#111111]/5 transition-colors group">
                  {c.done
                    ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    : <Circle size={18} className="text-[#111111]/25 shrink-0 group-hover:text-[#111111]/50 transition-colors" />}
                  <span className={`text-sm ${c.done ? 'text-[#111111]/40 line-through' : 'text-[#111111]/80 font-medium'}`}>{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="text-center mb-10">
          <p className="font-serif text-2xl font-semibold">Quick Actions</p>
          <p className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mt-2">Jump straight in</p>
        </div>
        <div className="flex justify-center flex-wrap gap-4 max-w-5xl mx-auto">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}
              className="group flex flex-col gap-4 p-5 bg-[#F7F4EF] border border-[#111111]/10 rounded-2xl hover:shadow-md hover:border-[#111111]/20 transition-all duration-200 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: `${action.accent}18` }}>
                <span style={{ color: action.accent }}><action.icon size={20} /></span>
              </div>
              <div>
                <p className="font-mono text-sm font-bold uppercase tracking-widest text-[#111111] leading-tight">{action.label}</p>
                <p className="text-sm text-[#111111]/60 mt-1 leading-snug">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Your Live Portfolio */}
      <div className="relative overflow-hidden rounded-3xl border border-[#111111]/10 bg-[#111111] text-[#F7F4EF] p-8 md:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-[#F7F4EF]/60 mb-2">Your Live Portfolio</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              {user?.status === 'Published' && user?.username
                ? `${user.username}.portfolioai.dev`
                : 'Deploying soon...'}
            </h2>
            <p className="text-lg text-[#F7F4EF]/70 mt-2">
              {user?.status === 'Published'
                ? `${user?.sectionViews ?? 0} views so far. Share your link and get noticed.`
                : 'Your portfolio is being prepared. Finish your checklist and publish to go live.'}
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link href="/dashboard/templates"
              className="flex items-center gap-2 px-6 py-3 border border-[#F7F4EF]/20 text-[#F7F4EF] font-mono text-sm uppercase tracking-widest rounded-xl hover:bg-[#F7F4EF]/10 transition-colors">
              <LayoutTemplate size={18} /> Preview
            </Link>
            <Link href="/dashboard/settings"
              className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white font-mono text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-[#059669] transition-colors">
              <TrendingUp size={18} /> {user?.status === 'Published' ? 'Manage' : 'Publish'}
            </Link>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      {(user?.notifications?.length ?? 0) > 0 && (
        <div>
          <p className="font-serif text-2xl font-semibold mb-6">Recent Activity</p>
          <div className="space-y-3">
            {user!.notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-4 p-5 bg-[#F7F4EF] border border-[#111111]/10 rounded-2xl">
                {n.unread
                  ? <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  : <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold">{n.title}</p>
                  <p className="text-sm text-[#111111]/70 mt-1">{n.description}</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#111111]/40 shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
