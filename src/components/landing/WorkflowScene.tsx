'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  RefreshCw,
  Cpu,
  FileText,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WorkflowCard {
  id: string;
  num: string;
  title: string;
  verticalLabel: string;
  subtitle: string;
  meta: string;
  cta: string;
  tag: string;
  graphicType: 'grid' | 'resume' | 'ai' | 'showcase' | 'deploy' | 'sync';
}

const CARDS: WorkflowCard[] = [
  {
    id: 'resume',
    num: '01',
    title: 'ATS Resume Engine',
    verticalLabel: 'ATS resume engine',
    subtitle: 'Engineered schemas that pass recruiters and hiring algorithms.',
    meta: 'Executive schema',
    cta: 'Explore resume builder',
    tag: 'ATS resume engine 443×544',
    graphicType: 'resume',
  },
  {
    id: 'intelligence',
    num: '02',
    title: 'Career Intelligence',
    verticalLabel: 'Career intelligence',
    subtitle: 'Real-time AI gap analysis, role matching, and skill scoring.',
    meta: 'AI powered',
    cta: 'Analyze profile',
    tag: 'Career intelligence 443×544',
    graphicType: 'ai',
  },
  {
    id: 'portfolio',
    num: '03',
    title: 'Websites & Portfolios',
    verticalLabel: 'Websites & portfolios',
    subtitle: 'Hand-crafted for your career, from the first pixel.',
    meta: 'on request',
    cta: 'Take a closer look',
    tag: 'Websites & portfolios 443×544',
    graphicType: 'grid',
  },
  {
    id: 'showcase',
    num: '04',
    title: 'Interactive Showcases',
    verticalLabel: 'Interactive showcases',
    subtitle: 'Live code repos, verifiable case studies, and media decks.',
    meta: 'Live widgets',
    cta: 'View demo showcase',
    tag: 'Interactive showcases 443×544',
    graphicType: 'showcase',
  },
  {
    id: 'deploy',
    num: '05',
    title: 'Edge Deployment',
    verticalLabel: 'Edge deployment',
    subtitle: 'Instant shareable link, global edge delivery, zero-config SSL.',
    meta: 'Global latency <18ms',
    cta: 'Check hosting',
    tag: 'Edge deployment 443×544',
    graphicType: 'deploy',
  },
  {
    id: 'sync',
    num: '06',
    title: 'Perpetual Sync',
    verticalLabel: 'Perpetual sync',
    subtitle: 'Update once in your career core — resume and site stay in sync.',
    meta: 'Two-way sync',
    cta: 'Learn sync engine',
    tag: 'Perpetual sync 443×544',
    graphicType: 'sync',
  },
];

/**
 * Procedural High-Fidelity Graphics for Each Card
 * Directly matching the industrial macro-photography & technical reticle reference
 */
function CardGraphic({ type }: { type: WorkflowCard['graphicType'] }) {
  // ── 01. Websites & Portfolios ──
  // Perspective macro silicon/grid with focal red target + live devcanvas-ia.vercel.app/portfolio chip
  if (type === 'grid') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-tr from-[#E6E9EE] via-[#F1F3F6] to-[#FAF9F6]">
        {/* Floating live domain chip matching user requirement */}
        <div className="absolute top-10 left-6 sm:left-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/90 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10.5px] sm:text-[11px] text-[#111315]">
              <span className="text-[#8E939B]">https://</span>
              <span className="font-semibold text-[#111315]">devcanvas-ia.vercel.app</span>
              <span className="text-[#EF4444] font-medium">/portfolio</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 hidden sm:inline">
              LIVE
            </span>
          </div>
        </div>

        {/* 3D Perspective Macro Grid with shallow depth of field */}
        <div
          className="absolute inset-0 opacity-85"
          style={{
            perspective: '700px',
            transform: 'rotateX(38deg) rotateZ(-14deg) scale(1.35) translateY(-6%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 100%)',
          }}
        >
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2 w-full h-full p-4">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xs transition-all duration-500 ${
                  i === 54
                    ? 'bg-[#EF4444] shadow-[0_0_24px_rgba(239,68,68,0.85)] scale-105 z-10'
                    : i % 17 === 0
                    ? 'bg-[#CBD0D8] border border-[#BAC0C8]'
                    : 'bg-[#CBD0D8]/65 hover:bg-[#B0B6C0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Ambient depth lighting */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#E2E6EC]/40 pointer-events-none" />
      </div>
    );
  }

  // ── 02. ATS Resume Engine ──
  // High-fidelity architectural resume document with ATS score telemetry & scanner beam
  if (type === 'resume') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#F5F6F8] via-[#ECEEF2] to-[#E2E5EB] flex items-center justify-center p-6 sm:p-8">
        {/* ATS Telemetry Badge */}
        <div className="absolute top-10 left-6 sm:left-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-white/90 backdrop-blur-md shadow-xs font-mono text-[10.5px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-[#111315]">ATS Score: 98/100</span>
            <span className="text-[#8E939B]">·</span>
            <span className="text-emerald-700 font-medium">Recruiter Ready</span>
          </div>
        </div>

        {/* Architectural Resume Sheet */}
        <div className="relative w-full max-w-[280px] sm:max-w-[310px] bg-white rounded-xl shadow-md border border-[rgba(41,44,48,0.12)] p-4 sm:p-5 overflow-hidden">
          {/* Continuous Scanning Laser Beam Moving Up and Down Non-stop */}
          <motion.div
            animate={{
              top: ['3%', '94%', '3%'],
            }}
            transition={{
              duration: 3.2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent shadow-[0_0_14px_rgba(239,68,68,0.85)] z-20 pointer-events-none"
          >
            {/* Ambient scanner beam glow */}
            <div className="absolute inset-x-6 -top-2 h-5 bg-[#EF4444]/20 blur-sm rounded-full pointer-events-none" />
          </motion.div>

          {/* Header block */}
          <div className="space-y-1 pb-3 border-b border-[#F0F1F3]">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-[#111315] rounded-xs" />
              <span className="font-mono text-[9px] text-[#EF4444] font-semibold">PDF/A · JSON-LD</span>
            </div>
            <div className="h-1.5 w-40 bg-[#8E939B]/60 rounded-xs" />
          </div>

          {/* Experience entries */}
          <div className="space-y-2 py-3 border-b border-[#F0F1F3]">
            <div className="flex items-center justify-between">
              <div className="h-2 w-24 bg-[#292C30]/80 rounded-xs" />
              <div className="h-1.5 w-12 bg-[#8E939B]/40 rounded-xs" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-[#E5E7EB] rounded-xs" />
              <div className="h-1.5 w-5/6 bg-[#E5E7EB] rounded-xs" />
              <div className="h-1.5 w-4/6 bg-[#EF4444]/40 rounded-xs" />
            </div>
          </div>

          {/* Skills tags */}
          <div className="pt-2 flex flex-wrap gap-1 font-mono text-[8px] text-[#4A4E54]">
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">Distributed Systems</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">Next.js 15</span>
            <span className="px-1.5 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">PostgreSQL</span>
          </div>
        </div>
      </div>
    );
  }

  // ── 03. Career Intelligence ──
  // Circular AI neural radar & skill vector matrix with degree markers & match confidence
  if (type === 'ai') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#F4F5F7] via-[#E8EAEF] to-[#DBDFE7] flex items-center justify-center">
        {/* Top Telemetry Chip */}
        <div className="absolute top-10 left-6 sm:left-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/90 backdrop-blur-md shadow-xs font-mono text-[10.5px]">
            <Sparkles className="w-3 h-3 text-[#EF4444]" />
            <span className="font-semibold text-[#111315]">Neural Skill Matrix</span>
            <span className="text-[#8E939B]">·</span>
            <span className="text-[#EF4444] font-medium">99.4% Fit</span>
          </div>
        </div>

        {/* AI Radar Reticle */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-[rgba(41,44,48,0.15)] flex items-center justify-center">
          {/* Degree markers */}
          <span className="absolute top-1 font-mono text-[8px] text-[#8E939B]">000°</span>
          <span className="absolute bottom-1 font-mono text-[8px] text-[#8E939B]">180°</span>
          <span className="absolute left-1 font-mono text-[8px] text-[#8E939B]">270°</span>
          <span className="absolute right-1 font-mono text-[8px] text-[#8E939B]">090°</span>

          {/* Crosshair lines */}
          <div className="absolute inset-x-0 h-px bg-[rgba(41,44,48,0.1)]" />
          <div className="absolute inset-y-0 w-px bg-[rgba(41,44,48,0.1)]" />

          {/* Outer dashed orbit */}
          <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-dashed border-[#EF4444]/35 animate-[spin_32s_linear_infinite] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444] -translate-x-20 sm:-translate-x-22" />
          </div>

          {/* Inner concentric ring */}
          <div className="w-24 h-24 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/40 flex items-center justify-center">
            {/* Center readout */}
            <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-[#CBD0D8] flex flex-col items-center justify-center">
              <span className="font-mono text-[12px] font-bold text-[#111315]">99.4%</span>
              <span className="font-mono text-[7px] uppercase tracking-wider text-[#777C82]">Match</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── 04. Interactive Showcases ──
  // Interactive live code chassis & verified project deck preview
  if (type === 'showcase') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-tr from-[#E8EAED] via-[#F3F4F6] to-[#FAF9F6] flex items-center justify-center p-6 sm:p-8">
        {/* Top Telemetry Chip */}
        <div className="absolute top-10 left-6 sm:left-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/90 backdrop-blur-md shadow-xs font-mono text-[10.5px]">
            <Cpu className="w-3 h-3 text-[#292C30]" />
            <span className="font-semibold text-[#111315]">Live Code Showcase</span>
            <span className="text-[#8E939B]">·</span>
            <span className="text-emerald-600 font-medium">Verified</span>
          </div>
        </div>

        {/* Code & Project Card Frame */}
        <div className="relative w-full max-w-[290px] sm:max-w-[320px] rounded-xl border border-[rgba(41,44,48,0.16)] bg-white/95 shadow-md overflow-hidden">
          {/* Window Bar */}
          <div className="h-7 px-3 bg-[#F0F1F3] border-b border-[rgba(41,44,48,0.1)] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </div>
            <span className="font-mono text-[9px] text-[#777C82]">showcase.config.ts</span>
          </div>

          {/* Code snippet */}
          <div className="p-3 font-mono text-[9.5px] leading-relaxed text-[#292C30] bg-[#FAF9F6] border-b border-[#F0F1F3]">
            <p className="text-[#8E939B]">{'// Verified repository export'}</p>
            <p>
              <span className="text-[#EF4444] font-semibold">export const</span> showcase = {'{'}
            </p>
            <p className="pl-3">
              project: <span className="text-emerald-700">&apos;Aether Kernel&apos;</span>,
            </p>
            <p className="pl-3">
              stars: <span className="text-[#EF4444]">1240</span>, live: <span className="text-emerald-700">true</span>
            </p>
            <p>{'};'}</p>
          </div>

          {/* Mini project preview footer */}
          <div className="p-2.5 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center font-mono text-[10px] font-bold text-[#EF4444]">
                A
              </div>
              <span className="font-sans text-[11px] font-semibold text-[#111315]">Aether AI Kernel</span>
            </div>
            <span className="font-mono text-[9px] text-[#8E939B]">View repo ↗</span>
          </div>
        </div>
      </div>
    );
  }

  // ── 05. Edge Deployment ──
  // Rich Global Edge Infrastructure Map & Low-Latency Routing Nodes (Replaced the empty card!)
  if (type === 'deploy') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#F2F4F7] via-[#E4E8EE] to-[#D5DAE3] flex items-center justify-center p-6">
        {/* Top Telemetry Chip */}
        <div className="absolute top-10 left-6 sm:left-8 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-white/90 backdrop-blur-md shadow-xs font-mono text-[10.5px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-[#111315]">Global Edge Active</span>
            <span className="text-[#8E939B]">·</span>
            <span className="text-emerald-700 font-medium">&lt; 18ms TTFB</span>
          </div>
        </div>

        {/* Global Edge Topology Map */}
        <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[16/10] bg-white/80 rounded-2xl border border-[rgba(41,44,48,0.15)] shadow-md p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle world grid lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(41,44,48,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(41,44,48,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Routing Arcs connecting Global Nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Arcs between nodes */}
            <path d="M 50 65 Q 120 30 180 50" fill="none" stroke="#CBD0D8" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 180 50 Q 230 40 270 75" fill="none" stroke="#CBD0D8" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 50 65 Q 160 110 270 75" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.4" />
          </svg>

          {/* Edge Server Nodes */}
          {/* SFO Node */}
          <div className="absolute top-[55px] left-[40px] flex items-center gap-1.5 z-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-mono text-[9px] font-semibold text-[#111315] bg-white/90 px-1 py-0.2 rounded border border-[#E5E7EB]">
              SFO · 12ms
            </span>
          </div>

          {/* FRA / EU Node */}
          <div className="absolute top-[40px] left-[165px] flex items-center gap-1.5 z-10">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] font-semibold text-[#111315] bg-white/90 px-1 py-0.2 rounded border border-[#E5E7EB]">
              FRA · 16ms
            </span>
          </div>

          {/* TYO / APAC Node */}
          <div className="absolute top-[68px] right-[25px] flex items-center gap-1.5 z-10">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] font-semibold text-[#111315] bg-white/90 px-1 py-0.2 rounded border border-[#E5E7EB]">
              TYO · 28ms
            </span>
          </div>

          {/* Routing Footer Banner */}
          <div className="relative z-10 mt-auto pt-4 flex items-center justify-between border-t border-[rgba(41,44,48,0.1)] font-mono text-[9px] text-[#4A4E54]">
            <div className="flex items-center gap-1 text-[#111315]">
              <Globe className="w-3 h-3 text-[#EF4444]" />
              <span className="font-semibold">Anycast Network</span>
            </div>
            <span>TLS 1.3 · HTTP/3</span>
          </div>
        </div>
      </div>
    );
  }

  // ── 06. Perpetual Sync ──
  // High-End Bidirectional Two-Way Synchronization Engine (Completely redesigned for user requirement!)
  // Left: Resume PDF Schema ⇄ Center: Synaptic Real-Time Diff Pipeline ⇄ Right: Live Portfolio Website
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-tr from-[#E9ECF0] via-[#F4F5F8] to-[#FAF9F6] flex items-center justify-center p-6 sm:p-8">
      {/* Top Telemetry Chip */}
      <div className="absolute top-10 left-6 sm:left-8 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#EF4444]/30 bg-white/90 backdrop-blur-md shadow-xs font-mono text-[10.5px]">
          <RefreshCw className="w-3 h-3 text-[#EF4444] animate-[spin_6s_linear_infinite]" />
          <span className="font-semibold text-[#111315]">Bidirectional Real-Time Sync</span>
          <span className="text-[#8E939B]">·</span>
          <span className="text-[#EF4444] font-medium">Zero Drift</span>
        </div>
      </div>

      {/* Dual Synced Architecture Chassis */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Resume PDF Core */}
        <div className="flex-1 bg-white rounded-xl border border-[rgba(41,44,48,0.15)] shadow-sm p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F0F1F3]">
            <div className="flex items-center gap-1.5 font-mono text-[9px] font-semibold text-[#111315]">
              <FileText className="w-3 h-3 text-[#EF4444]" />
              <span>Resume PDF</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-[#292C30] rounded-xs" />
            <div className="h-1 w-full bg-[#E5E7EB] rounded-xs" />
            <div className="h-1 w-4/5 bg-[#E5E7EB] rounded-xs" />
            <div className="h-1 w-3/5 bg-[#EF4444]/60 rounded-xs animate-pulse" />
          </div>
          <div className="pt-1 font-mono text-[8px] text-[#777C82]">
            <span>schema: v2.4</span>
          </div>
        </div>

        {/* Center: Synaptic Sync Tunnel with animated pulsing energy flow */}
        <div className="relative flex flex-col items-center justify-center shrink-0 w-16 sm:w-20">
          {/* Top Sync Arrow Indicator */}
          <div className="flex items-center gap-1 font-mono text-[9px] text-[#EF4444] font-bold tracking-wider mb-1">
            <span>⇄</span>
          </div>

          {/* Central Pulsing Beacon */}
          <div className="relative w-10 h-10 rounded-full border border-[#EF4444]/40 bg-white shadow-xs flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#EF4444]/15 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
              <Zap className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Micro Telemetry */}
          <span className="font-mono text-[8px] text-[#4A4E54] mt-1.5 font-semibold">
            &lt; 64ms diff
          </span>
        </div>

        {/* Right Side: Live Portfolio Website */}
        <div className="flex-1 bg-white rounded-xl border border-[rgba(41,44,48,0.15)] shadow-sm p-3 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F0F1F3]">
            <div className="flex items-center gap-1.5 font-mono text-[9px] font-semibold text-[#111315]">
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>Live Site</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#F4F5F7] rounded-xs border border-[#E5E7EB] flex items-center px-1">
              <span className="font-mono text-[6px] text-[#8E939B] truncate">devcanvas-ia.vercel.app</span>
            </div>
            <div className="h-1 w-full bg-[#E5E7EB] rounded-xs" />
            <div className="h-1 w-4/5 bg-[#10B981]/50 rounded-xs" />
          </div>
          <div className="pt-1 font-mono text-[8px] text-[#777C82]">
            <span>revalidated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowScene() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeCardId, setActiveCardId] = useState<string>('resume');
  const hoverTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleAction = () => {
    router.push(user ? '/dashboard' : '/signin');
  };

  const handleCardHover = (id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveCardId(id);
    }, 70);
  };

  const handleCardLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const activeIndex = CARDS.findIndex((c) => c.id === activeCardId);

  const handleNext = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const nextIdx = (activeIndex + 1) % CARDS.length;
    setActiveCardId(CARDS[nextIdx].id);
  };

  const handlePrev = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const prevIdx = (activeIndex - 1 + CARDS.length) % CARDS.length;
    setActiveCardId(CARDS[prevIdx].id);
  };

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F4F4F2] select-none overflow-clip"
    >
      {/* Background Subtle Tech Dot Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(41, 44, 48, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ── Section Header (Editorial Typography matching reference) ── */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          {/* Large Thin & Sleek Editorial Headline */}
          <h2
            className="text-[34px] sm:text-[48px] lg:text-[58px] font-medium sm:font-semibold tracking-[-0.03em] text-[#111315] leading-[1.08] max-w-3xl"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
          >
            Everything your
            <br />
            career needs online.
            <br />
            From one profile.
          </h2>
        </div>

        {/* ── Horizontal Accordion Gallery (Industrial Design & Bounding Box) ── */}
        <div className="relative w-full">
          {/* Cards Track */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 h-auto md:h-[500px] lg:h-[530px] w-full items-stretch">
            {CARDS.map((card) => {
              const isActive = card.id === activeCardId;

              return (
                <motion.div
                  key={card.id}
                  layout
                  onMouseEnter={() => handleCardHover(card.id)}
                  onMouseLeave={handleCardLeave}
                  onClick={() => {
                    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                    setActiveCardId(card.id);
                  }}
                  transition={{
                    layout: {
                      type: 'spring',
                      stiffness: 155,
                      damping: 23,
                      mass: 0.8,
                    },
                  }}
                  className={`relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-colors duration-300 ${
                    isActive
                      ? 'md:flex-[3.8] lg:flex-[4.2] h-[400px] md:h-full shadow-xl bg-[#FAF9F6] border border-[#EF4444]'
                      : 'md:flex-[0.8] lg:flex-[0.9] h-[72px] md:h-full bg-white/70 hover:bg-white/90 border border-[rgba(41,44,48,0.14)] hover:border-[#EF4444]/40'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {/* ── ACTIVE EXPANDED VIEW WITH REFERENCE 3 RED BOUNDING BOX ── */}
                    {isActive ? (
                      <motion.div
                        key={`active-${card.id}`}
                        initial={{ opacity: 0, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.985 }}
                        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 z-10"
                      >
                        {/* Top-Left Red Technical Dimension Tag (Matching Reference Screenshot 3) */}
                        <div className="absolute top-0 left-0 bg-[#EF4444] text-white px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium tracking-wide flex items-center gap-2 z-30 rounded-br-sm shadow-xs select-none">
                          <span>{card.tag}</span>
                        </div>

                        {/* 4 Corner Anchor Handles (Matching Reference Screenshot 3) */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#EF4444] z-30 pointer-events-none" />

                        {/* Top-Right Technical Reticle ⊙ (Matching Reference Screenshot 3) */}
                        <div className="absolute top-3.5 right-4 z-20 flex items-center justify-center pointer-events-none">
                          <div className="w-5 h-5 rounded-full border border-[#EF4444] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          </div>
                        </div>

                        {/* Graphic Area in Center/Top */}
                        <div className="absolute inset-0 z-0">
                          <CardGraphic type={card.graphicType} />
                          {/* Soft gradient mask for bottom text readability */}
                          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent" />
                        </div>

                        {/* Bottom Text Content directly matching reference */}
                        <div className="relative z-20 mt-auto pt-16">
                          <h3 className="text-[22px] sm:text-[26px] font-bold text-[#111315] leading-tight tracking-tight mb-2">
                            {card.title}
                          </h3>
                          <p className="text-[13px] sm:text-[14px] text-[#4A4E54] leading-relaxed max-w-md mb-5">
                            {card.subtitle}
                          </p>

                          {/* Bottom Row: Left meta + Right Action Link */}
                          <div className="flex items-center justify-between pt-2 border-t border-[rgba(41,44,48,0.1)]">
                            <span className="font-mono text-[11px] text-[#777C82] lowercase">
                              {card.meta}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction();
                              }}
                              className="group inline-flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-[#111315] hover:text-[#EF4444] transition-colors cursor-pointer"
                            >
                              <span>{card.cta}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* ── COLLAPSED SLENDER VIEW ── */
                      <motion.div
                        key={`collapsed-${card.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full h-full flex md:flex-col items-center justify-between p-4 sm:p-5 z-10"
                      >
                        {/* Top Number */}
                        <span className="font-mono text-[11px] font-semibold text-[#777C82]">
                          {card.num}
                        </span>

                        {/* Faded Background Graphic Watermark */}
                        <div className="hidden md:block absolute inset-0 z-0 opacity-15 pointer-events-none">
                          <CardGraphic type={card.graphicType} />
                        </div>

                        {/* Rotated Vertical Title on Desktop / Horizontal on Mobile */}
                        <div className="relative z-10 md:my-auto">
                          <p className="md:[writing-mode:vertical-lr] md:rotate-180 text-[13px] sm:text-[14px] font-semibold text-[#292C30] tracking-wide whitespace-nowrap">
                            {card.verticalLabel}
                          </p>
                        </div>

                        {/* Subtle Bottom Accent Indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-[rgba(41,44,48,0.2)] md:block hidden" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ── Bottom Controls & Technical Reticles ── */}
          <div className="mt-8 flex items-center justify-between">
            {/* Left Technical Reticle ⊙ */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-[#EF4444] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#EF4444]" />
              </div>
              <span className="font-mono text-[10px] text-[#777C82] tracking-wider uppercase hidden sm:inline">
                interactive · deck
              </span>
            </div>

            {/* Right Pagination & Navigation Controls */}
            <div className="flex items-center gap-3">
              {/* Previous / Next buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  aria-label="Previous step"
                  className="w-7 h-7 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/70 hover:bg-white flex items-center justify-center text-[#292C30] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next step"
                  className="w-7 h-7 rounded-full border border-[rgba(41,44,48,0.18)] bg-white/70 hover:bg-white flex items-center justify-center text-[#292C30] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Segmented Dots Indicator */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-[rgba(41,44,48,0.15)]">
                {CARDS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCardId(c.id)}
                    aria-label={`Jump to ${c.title}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      c.id === activeCardId
                        ? 'w-6 bg-[#EF4444]'
                        : 'w-2 bg-[rgba(41,44,48,0.2)] hover:bg-[rgba(41,44,48,0.4)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
