'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Globe,
  Sparkles,
  Zap,
  Check,
  Copy,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export default function FinaleScene() {
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleGetStarted = () => {
    router.push(user ? '/dashboard' : '/signin');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://dev-canvas-ia.vercel.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="finale" className="relative py-24 sm:py-32 lg:py-40 bg-[#F4F4F2] select-none overflow-hidden">
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
        {/* ── 1. Editorial Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center mb-12 sm:mb-16"
        >
          {/* Subtle Live Badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-[rgba(41,44,48,0.14)] bg-white/80 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="font-mono text-[10.5px] font-semibold tracking-wider uppercase text-[#111315]">
              Instant Career Deployment
            </span>
          </div>

          {/* Thin Editorial Headline */}
          <h2
            className="text-[36px] sm:text-[50px] lg:text-[62px] font-medium sm:font-semibold tracking-[-0.035em] text-[#111315] leading-[1.08] mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            One profile.
            <br />
            Every door open.
            <br />
            <span className="bg-gradient-to-r from-[#DC2626] via-[#E04848] to-[#F87171] bg-clip-text text-transparent font-bold">
              Start in seconds.
            </span>
          </h2>

          <p className="text-[14.5px] sm:text-[16px] text-[#4A4E54] leading-relaxed max-w-2xl mx-auto">
            Drop in your resume. DevCanvas organizes your work into an ATS-proof schema
            and an edge-deployed personal website — one link, always in sync.
          </p>
        </motion.div>

        {/* ── 2. The Deployment Studio Visual (Clean Border without Red Boundary) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-[rgba(41,44,48,0.14)] bg-[#FAF9F6] shadow-[0_24px_70px_rgba(0,0,0,0.06)] overflow-hidden mb-12 sm:mb-14"
        >
          {/* Studio Top Control Strip */}
          <div className="h-10 px-5 sm:px-7 border-b border-[rgba(41,44,48,0.1)] bg-white/60 flex items-center justify-between font-mono text-[11px] text-[#777C82]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              <span className="ml-3 font-semibold text-[#111315] hidden sm:inline">
                devcanvas · career pipeline
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#111315]">Edge Active</span>
              <span className="text-[#CBD0D8]">·</span>
              <span className="text-[#777C82]">Global Sync</span>
            </div>
          </div>

          {/* Split Living Studio: Left Resume ⇄ Center Synapse ⇄ Right Live Browser */}
          <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#FAF9F6] to-[#F2F3F5]">
            {/* Left: ATS Resume Card with Continuous Laser Scanner */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[rgba(41,44,48,0.14)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F1F3]">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#111315]">
                  <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Resume Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-mono text-[9px] font-semibold">
                  98/100 ATS
                </span>
              </div>

              {/* Scanning Laser moving up and down continuously */}
              <div className="relative space-y-2 py-2 overflow-hidden min-h-[92px]">
                <motion.div
                  animate={{
                    top: ['4%', '88%', '4%'],
                  }}
                  transition={{
                    duration: 3.2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent shadow-[0_0_14px_rgba(239,68,68,0.85)] z-20 pointer-events-none"
                >
                  <div className="absolute inset-x-4 -top-2 h-5 bg-[#EF4444]/20 blur-sm rounded-full pointer-events-none" />
                </motion.div>

                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-[#111315] rounded-xs" />
                  <div className="h-2 w-16 bg-[#8E939B]/40 rounded-xs" />
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="h-1.5 w-full bg-[#E5E7EB] rounded-xs" />
                  <div className="h-1.5 w-5/6 bg-[#E5E7EB] rounded-xs" />
                  <div className="h-1.5 w-4/6 bg-[#EF4444]/40 rounded-xs" />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[9px] text-[#4A4E54]">
                <span className="px-2 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">PDF/A Schema</span>
                <span className="px-2 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">JSON-LD Verified</span>
              </div>
            </div>

            {/* Center: Bidirectional Energy Synapse */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
              <div className="relative flex items-center justify-center my-2">
                <div className="w-14 h-14 rounded-full border border-[#EF4444]/30 animate-[ping_3.5s_infinite]" />
                <div className="absolute w-10 h-10 rounded-full border border-dashed border-[#EF4444]/50 animate-[spin_12s_linear_infinite]" />
                <div className="absolute w-7 h-7 rounded-full bg-[#EF4444] flex items-center justify-center text-white shadow-[0_0_16px_rgba(239,68,68,0.7)]">
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className="font-mono text-[10px] font-bold text-[#111315] tracking-wider mt-1">
                SYNC PIPELINE
              </span>
              <span className="font-mono text-[9px] text-[#EF4444] font-semibold">
                &lt; 64ms Real-time
              </span>
            </div>

            {/* Right: Live Browser Card with Copyable dev-canvas-ia.vercel.app */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[rgba(41,44,48,0.14)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F1F3]">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#111315]">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Live Portfolio</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-mono text-[9px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Exact Copyable Domain Requested: dev-canvas-ia.vercel.app */}
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[rgba(41,44,48,0.15)] flex items-center justify-between gap-2 shadow-xs">
                <div className="font-mono text-[11px] sm:text-[12px] text-[#111315] truncate flex items-center gap-1.5">
                  <span className="text-[#8E939B]">https://</span>
                  <span className="font-semibold text-[#111315]">dev-canvas-ia.vercel.app</span>
                </div>

                <button
                  onClick={handleCopyLink}
                  aria-label="Copy domain link"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#111315] hover:bg-[#EF4444] text-white font-mono text-[10px] font-semibold transition-colors duration-200 cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[9px] text-[#4A4E54]">
                <span className="px-2 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">Zero-Config SSL</span>
                <span className="px-2 py-0.5 rounded bg-[#F4F4F6] border border-[#E5E7EB]">Sub-second TTFB</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 3. CTA Buttons (Placed Below the Visual as Shown in Photo 2) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Black Pill Button with Circular Arrow Icon */}
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#111315] hover:bg-[#1E2125] text-white font-semibold text-[13.5px] sm:text-sm tracking-wide shadow-[0_12px_30px_rgba(17,19,21,0.22)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <span>Start with my resume</span>
            <span className="w-6 h-6 rounded-full bg-[#292C30] group-hover:bg-[#EF4444] flex items-center justify-center transition-colors duration-200">
              <ArrowRight className="w-3 h-3 text-white transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          {/* White Pill Button with Diagonal Arrow ↗ */}
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF9F6] border border-[rgba(41,44,48,0.16)] text-[#111315] font-semibold text-[13.5px] sm:text-sm tracking-wide shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <span>See how it works</span>
            <ArrowUpRight className="w-4 h-4 text-[#777C82]" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}