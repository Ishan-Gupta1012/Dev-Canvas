'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { ArrowLeft, Globe, Link as LinkIcon } from 'lucide-react';

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'circOut' },
  },
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
} as const;

const team = [
  {
    name: 'Ishan Gupta',
    role: 'Founder & Core Architect',
    tag: '[ARCHITECT]',
    photo: 'https://i.postimg.cc/KzX2XBJw/Ishan.jpg',
    linkedin: 'https://www.linkedin.com/in/ishan-gupta-08686631a/',
  },
  {
    name: 'Aparna Jha',
    role: 'Product Design Lead',
    tag: '[DESIGNER]',
    photo: 'https://i.postimg.cc/tJW7Q93G/aparna.jpg',
    linkedin: 'https://www.linkedin.com/in/aparna-jha-58662b304/',
  },
];

const problems = [
  {
    title: 'Portfolios stuck in 2020',
    desc: 'Developer portfolios haven\'t evolved. Most still use the same generic templates that scream \'boilerplate\' instead of reflecting technical depth.',
  },
  {
    title: 'Time is the bottleneck',
    desc: 'Between coding, interviewing, and shipping features, building a portfolio from scratch gets pushed to the back burner — forever.',
  },
  {
    title: 'Writing about yourself is hard',
    desc: 'Translating repository metrics, commit history, and technical achievements into compelling narratives requires a completely different muscle.',
  },
  {
    title: 'No true ownership',
    desc: 'Most platforms lock you in. Your portfolio becomes a rental, not something you truly own and control.',
  },
];

const superpowers = [
  { title: 'High Performance', desc: 'Static site generation guarantees 100/100 Lighthouse performance metrics right out of the box.' },
  { title: 'GitHub Syncing', desc: 'Keep your contributions, repositories, and stars up-to-date in real-time with our hooks.' },
  { title: 'Tailwind Core', desc: 'No complex styling engines. Clean, production-ready Tailwind configuration that you fully own.' },
  { title: 'Monospace Detailing', desc: 'Editorial, technical layout details that fit engineering portfolios perfectly.' },
  { title: 'Micro-animations', desc: 'Subtle, premium physics-based animations that make your work feel interactive and alive.' },
  { title: 'Complete Ownership', desc: 'Export raw Next.js codebase at any time. No proprietary locks, no platform lock-in.' },
];

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="bg-[#F7EFE2] text-[#2E180E] min-h-screen flex flex-col font-sans overflow-x-clip custom-cursor">
      <header className={`fixed top-0 left-0 right-0 z-50 bg-[#F7EFE2]/80 backdrop-blur-md border-b border-[#D6A15F]/30 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center min-h-[44px] font-mono text-xs uppercase tracking-widest text-[#5B341E] hover:text-[#8A5A2B] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 md:pt-32 relative">
        {/* Section 1: Hero Hook */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 md:pt-24 pb-24 border-b border-[#D6A15F]/20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col lg:flex-row lg:items-end gap-8"
          >
            <div className="flex-1">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8A5A2B] mb-6">
                ✦ About / Studio Philosophy
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight mb-6 text-[#2E180E]">
                We turn developer code<span className="block italic font-normal text-[#A65A3A]">into visual brands.</span>
              </h1>
              <p className="text-sm md:text-base text-[#5B341E]/80 leading-relaxed max-w-lg">
                DevCanvas is a curated platform for creators. Every portfolio begins with intention — sketched on craft paper, refined with care, built to last.
              </p>
            </div>
            <div className="hidden lg:block w-1/3">
              <div className="h-[300px] w-full bg-[#2E180E]/10 border border-[#D6A15F]/30 rounded-[24px] flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#F7EFE2]/0 to-[#F7EFE2]/100" />
                <div className="w-2 h-full bg-[#D6A15F]/40 animate-pulse mx-auto" />
                <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8A5A2B]/60">Studio Archives</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 2: The Problem */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-b border-[#D6A15F]/20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col lg:flex-row gap-12 items-start lg:items-center"
          >
            <div className="lg:w-1/3">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8A5A2B] mb-6">
                ✦ The Problem
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight text-[#2E180E] mb-8">
                We saw talented developers<span className="block italic font-normal text-[#A65A3A]">ship incredible code onto generic shells.</span>
              </h2>
              <p className="text-sm text-[#5B341E]/70 leading-relaxed">
                Between open-source contributions, GitHub repositories, and technical interviews, developers spend years perfecting their craft — only to present it through templates that look like they were made in 2015.
              </p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {problems.map((p, idx) => (
                <motion.div
                  key={idx}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="border border-[#D6A15F]/25 p-8 rounded-[16px] bg-[#FFFFFF]/60 transition-all duration-300 hover:border-[#8A5A2B]/50 hover:bg-[#F7EFE2]/40"
                >
                  <div className="font-mono text-[9px] text-[#8A5A2B]/60 mb-3 uppercase tracking-[0.2em]">
                    [{String(idx + 1).padStart(2, '0')} / PROBLEM]
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2E180E] mb-3">{p.title}</h3>
                  <p className="text-xs text-[#5B341E]/70 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Section 3: Journey / Solution */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-b border-[#D6A15F]/20 bg-[#FFFFFF]/40">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8A5A2B] mb-6">
                ✦ Our Journey
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight text-[#2E180E] mb-6">
                We built DevCanvas<span className="block italic font-normal text-[#A65A3A]">to fix what was broken.</span>
              </h2>
              <p className="text-sm text-[#5B341E]/70 leading-relaxed mb-6">
                Four simple steps. No configuration. No generic templates. Just your work, framed by design that matches the quality of your code.
              </p>
              <ul className="space-y-4">
                {[
                  'Raw engineering data transformed through AI-powered copywriting',
                  'Hand-crafted templates packed with smooth animations',
                  'Clean Next.js code you fully own and export',
                  'Deploy to your own URL: dev-canvas-ia.vercel.app/your-name',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#5B341E]/80 leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-[#8A5A2B] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-[400px] w-full bg-[#2E180E]/5 border border-[#D6A15F]/20 rounded-[24px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7EFE2]/0 to-[#F7EFE2]" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity duration-700" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#F7EFE2]/90 backdrop-blur p-6 rounded-[16px] border border-[#D6A15F]/30">
                    <div className="font-mono text-[10px] text-[#8A5A2B]/60 uppercase tracking-[0.2em] mb-2">DevCanvas Philosophy</div>
                    <h3 className="font-serif text-xl font-semibold text-[#2E180E] mb-2">Engineering refined by design</h3>
                    <p className="text-xs text-[#5B341E]/70 leading-relaxed">We construct highly optimized portfolio skeletons that sync natively with your GitHub commits.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 5: Capabilities */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-b border-[#D6A15F]/20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8A5A2B] mb-6">
                ✦ Our Capabilities
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight text-[#2E180E] mb-6">
                Engineering skills<span className="block italic font-normal text-[#A65A3A]">refined by design.</span>
              </h2>
              <p className="text-sm text-[#5B341E]/70 leading-relaxed mb-8">
                Our capabilities represent our core philosophy. We construct highly optimized portfolio skeletons that sync natively with your GitHub commits.
              </p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 order-1 lg:order-2"
            >
              {superpowers.map((power, idx) => (
                <motion.div
                  key={idx}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="border border-[#D6A15F]/25 p-8 rounded-[16px] bg-[#FFFFFF]/60 transition-all duration-300 hover:border-[#8A5A2B]/50 hover:bg-[#F7EFE2]/40 hover:shadow-[0_0_30px_rgba(214,161,95,0.15)]"
                >
                  <div className="font-mono text-[9px] text-[#8A5A2B]/60 mb-3 uppercase tracking-[0.2em]">
                    [{String(idx + 1).padStart(2, '0')} / PWR]
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2E180E] mb-3">{power.title}</h3>
                  <p className="text-xs text-[#5B341E]/70 leading-relaxed">{power.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Section 6: Meet the Minds */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-b border-[#D6A15F]/20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col lg:flex-row gap-12 items-start lg:items-center"
          >
            <div className="lg:w-1/2">
              <div className="font-mono text-xs uppercase tracking-widest text-[#8A5A2B] mb-6">
                ✦ Meet the Minds
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight text-[#2E180E] mb-6">
                The people<span className="block italic font-normal text-[#A65A3A]">behind the vision.</span>
              </h2>
              <p className="text-sm text-[#5B341E]/70 leading-relaxed">
                Meet Ishan and Aparna, the minds behind DevCanvas. Together they set out to fix what they saw as a broken system — developers with incredible code trapped behind generic portfolio shells.
              </p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  className="border border-[#D6A15F]/25 p-8 rounded-[16px] bg-[#FFFFFF]/60 transition-all duration-300 hover:border-[#8A5A2B]/50 hover:bg-[#F7EFE2]/40"
                >
                  <div className="w-40 h-40 rounded-[16px] border border-[#D6A15F]/30 overflow-hidden mb-6 bg-[#2E180E]/10 flex items-center justify-center relative group">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#F7EFE2]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#8A5A2B] text-white flex items-center justify-center text-[12px] hover:bg-[#A65A3A] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.214v6.528zM5.337 7.433a2.066 2.066 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#2E180E] mb-1">{member.name}</h3>
                  <p className="font-mono text-[10px] text-[#8A5A2B] mb-3 uppercase tracking-[0.15em]">{member.role}</p>
                  <div className="font-mono text-[9px] text-[#5B341E]/50 uppercase tracking-[0.2em]">{member.tag}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Section 7: Final CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-32 border-b border-[#D6A15F]/20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="rounded-[24px] bg-[#2E180E] border border-[#8A5A2B]/40 p-10 sm:p-16 text-center overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#8A5A2B]/20 to transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="font-mono text-xs uppercase tracking-widest text-[#A65A3A] mb-6">
                ✦ Ready to begin?
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight text-[#F7EFE2] mb-8">
                Build your portfolio.<span className="block italic font-normal text-[#D6A15F]">Own your code.</span>
              </h2>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#8A5A2B] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full hover:bg-[#A65A3A] hover:shadow-[0_0_30px_rgba(138,90,43,0.5)] transition-all duration-300"
              >
                Start Building <LinkIcon size={16} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
