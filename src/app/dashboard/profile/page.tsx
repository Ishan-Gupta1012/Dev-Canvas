/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Mail, Shield, MapPin, Building, Eye, Sparkles,
  FolderOpen, CheckCircle2, Clock, Zap, Briefcase, GraduationCap, FileText,
  Cpu, Globe, Code2, AtSign, UserCircle, CalendarDays, BadgeCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioSummary {
  id: string;
  title: string;
  template_name: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

const AI_CREDITS_TOTAL = 50;

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  );
}

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: React.ReactNode; label: string; accent: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 md:p-7 rounded-2xl border border-outline-variant shadow-sm flex items-center gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-serif text-2xl font-bold text-on-surface leading-none">{value}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1.5">{label}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
        <h3 className="font-serif text-lg font-bold text-on-surface">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [portfoliosLoading, setPortfoliosLoading] = useState(true);

  const { personalInfo, socialLinks, provider: userProvider } = user || {};
  const provider = userProvider ? userProvider.charAt(0).toUpperCase() + userProvider.slice(1) : 'Supabase Auth';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/portfolio/save');
        const result = await res.json();
        if (!cancelled && res.ok) setPortfolios(result.portfolios || []);
      } catch {
        // keep empty state
      } finally {
        if (!cancelled) setPortfoliosLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedCount = portfolios.filter((p) => p.status === 'published').length;
  const draftCount = portfolios.filter((p) => p.status === 'draft').length;

  const creditsUsed = user?.aiCreditsUsed ?? 0;
  const creditsRemaining = Math.max(0, AI_CREDITS_TOTAL - creditsUsed);
  const creditsPct = Math.min((creditsUsed / AI_CREDITS_TOTAL) * 100, 100);

  const socials = [
    { label: 'GitHub', href: socialLinks?.github, icon: <GithubIcon /> },
    { label: 'LinkedIn', href: socialLinks?.linkedin, icon: <LinkedinIcon /> },
    { label: 'Twitter / X', href: socialLinks?.twitter, icon: <XIcon size={16} /> },
    { label: 'Blog', href: socialLinks?.blog, icon: <Globe size={18} /> },
    { label: 'LeetCode', href: socialLinks?.leetcode, icon: <Code2 size={18} /> },
  ];
  const linkedSocials = socials.filter((s) => !!s.href);

  const statusTone =
    user?.status === 'Published'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      : user?.status === 'Draft'
        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        : 'bg-on-surface-variant/10 text-on-surface-variant';

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <header className="flex items-center w-full h-16 px-lg sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant">
        <Link href="/dashboard" className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors flex items-center gap-2">
          <ArrowLeft size={20} />
          <span className="font-semibold text-label-md">Back to Dashboard</span>
        </Link>
      </header>

      <main className="px-6 md:px-10 py-10 md:py-14 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-10"
        >
          {/* Identity hero */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-primary/20 via-tertiary/10 to-primary/5" />
            <div className="px-8 md:px-10 pb-8 md:pb-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
                <img
                  src={personalInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
                  alt="Profile Avatar"
                  className="w-28 h-28 rounded-2xl border-4 border-surface-container-lowest shadow-md object-cover bg-surface-container-low"
                />
                <div className="flex-1 min-w-0 sm:pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-serif text-2xl font-bold text-on-surface">
                      {personalInfo?.name || 'Developer'}
                    </h1>
                    <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full ${statusTone}`}>
                      {user?.status || 'Unpublished'}
                    </span>
                  </div>
                  <p className="text-base text-on-surface-variant mt-1">
                    {personalInfo?.title || 'Software Engineer'}
                    {user?.username ? <span className="font-mono text-xs"> · {user.username}.portfolioai.dev</span> : null}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:pb-1">
                  <Link
                    href="/dashboard/resume-builder"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    <FileText size={14} /> Edit details
                  </Link>
                  <Link
                    href="/dashboard/portfolios"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                  >
                    <FolderOpen size={14} /> Portfolios
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-7 pt-7 border-t border-outline-variant font-mono text-xs text-on-surface-variant">
                <span className="inline-flex items-center gap-2"><Mail size={14} className="text-primary" />{personalInfo?.email || 'No email'}</span>
                <span className="inline-flex items-center gap-2"><MapPin size={14} />{personalInfo?.location || 'Not specified'}</span>
                <span className="inline-flex items-center gap-2"><Building size={14} />{user?.experience?.[0]?.company || 'Not specified'}</span>
                <span className="inline-flex items-center gap-2"><Shield size={14} />via {provider}</span>
                {personalInfo?.isOpenToWork && (
                  <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><BadgeCheck size={14} />Open to work</span>
                )}
              </div>
            </div>
          </div>

          {/* Stat band */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={<FolderOpen size={20} />} value={portfoliosLoading ? '…' : portfolios.length} label="Portfolios" accent="bg-primary/10 text-primary" />
            <StatCard icon={<CheckCircle2 size={20} />} value={portfoliosLoading ? '…' : publishedCount} label="Published" accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
            <StatCard icon={<Clock size={20} />} value={portfoliosLoading ? '…' : draftCount} label="Drafts" accent="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
            <StatCard icon={<Zap size={20} />} value={`${creditsUsed}/${AI_CREDITS_TOTAL}`} label="AI credits used" accent="bg-[#8b5cf6]/10 text-[#8b5cf6]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              <SectionCard title="About">
                <p className="text-body-md text-on-surface leading-relaxed">
                  {user?.bio || 'No bio added yet. Head to the resume builder to tell your story.'}
                </p>
                {(user?.skills?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user!.skills.map((s) => (
                      <span key={s} className="px-3 py-1.5 bg-surface-container-low text-on-surface font-mono text-xs rounded-full border border-outline-variant/50">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="Recent portfolios"
                action={
                  <Link href="/dashboard/portfolios" className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary hover:opacity-80">
                    View all <ArrowRight size={14} />
                  </Link>
                }
              >
                {portfoliosLoading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-16 rounded-xl bg-surface-container-low animate-pulse" />
                    ))}
                  </div>
                ) : portfolios.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen size={28} className="mx-auto text-on-surface-variant/40 mb-3" />
                    <p className="text-body-md text-on-surface-variant">No portfolios yet.</p>
                    <Link href="/dashboard/ai-builder" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl font-mono text-xs uppercase tracking-widest hover:opacity-90">
                      <Sparkles size={14} /> Generate one
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {portfolios.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-low/50">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-on-surface truncate">{p.title}</p>
                          <p className="font-mono text-[11px] text-on-surface-variant/60 mt-0.5">
                            Updated {formatDate(p.updated_at)}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full shrink-0 ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionCard title="Experience">
                  {(user?.experience?.length ?? 0) === 0 ? (
                    <p className="text-sm text-on-surface-variant">No experience added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {user!.experience.slice(0, 3).map((e, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Briefcase size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-on-surface truncate">{e.role || 'Role'}</p>
                            <p className="text-xs text-on-surface-variant">{e.company}{e.startDate ? ` · ${e.startDate} – ${e.endDate || 'Present'}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Education">
                  {(user?.education?.length ?? 0) === 0 ? (
                    <p className="text-sm text-on-surface-variant">No education added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {user!.education.slice(0, 3).map((e, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                            <GraduationCap size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-on-surface truncate">{e.degree || 'Degree'}</p>
                            <p className="text-xs text-on-surface-variant">{e.institution}{e.gradYear ? ` · ${e.gradYear}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              <SectionCard title="Social links">
                {linkedSocials.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">No social links added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {linkedSocials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-primary/40 hover:bg-surface-container-low transition-colors group"
                      >
                        <span className="text-on-surface-variant group-hover:text-primary transition-colors">{s.icon}</span>
                        <span className="flex-1 text-sm font-medium text-on-surface">{s.label}</span>
                        <ArrowRight size={14} className="text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </a>
                    ))}
                  </div>
                )}
                {socials.some((s) => !s.href) && (
                  <p className="font-mono text-[11px] text-on-surface-variant/50 mt-3">
                    {socials.filter((s) => !s.href).length} of {socials.length} profiles not linked
                  </p>
                )}
              </SectionCard>

              <SectionCard title="AI credits">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center">
                    <Cpu size={18} />
                  </div>
                  <div>
                    <p className="font-serif text-xl font-bold text-on-surface leading-none">{creditsUsed} / {AI_CREDITS_TOTAL}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60 mt-1">used this month</p>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${creditsPct}%`, backgroundColor: creditsUsed >= 40 ? '#ef4444' : '#8b5cf6' }}
                  />
                </div>
                <p className="font-mono text-xs text-on-surface-variant/60 mt-2">{creditsRemaining} credits remaining</p>
              </SectionCard>

              <SectionCard title="Account">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-on-surface-variant"><UserCircle size={15} />Provider</span>
                    <span className="font-bold text-on-surface">{provider}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-on-surface-variant"><AtSign size={15} />Subdomain</span>
                    <span className="font-mono text-xs text-on-surface truncate">{user?.username ? `${user.username}.portfolioai.dev` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-on-surface-variant"><CalendarDays size={15} />Last updated</span>
                    <span className="font-medium text-on-surface">{user?.lastUpdated || 'Never'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-on-surface-variant"><Eye size={15} />Profile views</span>
                    <span className="font-bold text-on-surface">{user?.sectionViews ?? 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-on-surface">Authenticated</p>
                    <p className="font-mono text-[11px] text-on-surface-variant truncate">Secured by Supabase · Verified</p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
