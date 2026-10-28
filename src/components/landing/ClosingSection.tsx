'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUp, Check, Sparkles } from 'lucide-react';
import { CtaLabel, MagneticButton } from './MagneticButton';
import { MaskLine } from './KineticText';
import { EASE_OUT } from './motion';

const STEPS = [
  { label: 'Create your workspace', meta: 'Email + password', done: true },
  { label: 'Upload your resume', meta: 'PDF or DOCX · 5 MB', done: true },
  { label: 'Choose a layout, publish', meta: 'One shareable link', done: false },
];

const FOOTER_LINKS = [
  { label: 'Showcase', href: '#showcase' },
  { label: 'Transform', href: '#transform' },
  { label: 'Workflow', href: '#archive' },
  { label: 'Features', href: '#features' },
  { label: 'Questions', href: '#faq' },
];

const PRODUCT_LINKS = [
  { label: 'Sign in', href: '/signin' },
  { label: 'Create account', href: '/signup' },
  { label: 'About', href: '/about' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '/contact' },
];

export default function ClosingSection({ onEnter }: { onEnter: () => void }) {
  const reduce = useReducedMotion();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer
      id="contact"
      className="relative isolate w-full overflow-hidden bg-[#1B120D] text-[#FBF9F6]"
    >
      <div aria-hidden="true" className="lc-grain lc-grain-dark pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(180,85,45,0.4),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(76,58,47,0.55),transparent_68%)] blur-2xl"
      />

      {/* CTA */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#EBC4A6]"
            >
              <span className="h-1.5 w-1.5 rotate-45 bg-[#EBC4A6]" />
              [07 // START HERE]
            </motion.div>

            <h2 className="mt-7 font-serif text-[clamp(2.4rem,6vw,4.8rem)] font-medium leading-[0.96] tracking-[-0.035em]">
              <MaskLine delay={0.04}>Your next opportunity</MaskLine>
              <MaskLine delay={0.12}>is one link</MaskLine>
              <MaskLine delay={0.2}>
                <span className="italic text-[#EBC4A6]">away.</span>
              </MaskLine>
            </h2>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
              className="mt-6 max-w-[30rem] font-sans text-[15px] leading-[1.7] text-[#FBF9F6]/60 sm:text-[16px]"
            >
              Turn the document you already have into a portfolio that introduces you
              properly. Structured, responsive, and ready to share in minutes.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <MagneticButton
                onClick={onEnter}
                className="h-[56px] w-full rounded-full border border-[#EBC4A6]/50 bg-[#FBF9F6] px-7 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1B120D] shadow-[0_24px_60px_-24px_rgba(235,196,166,0.6)] transition-colors duration-300 hover:bg-[#EBC4A6] sm:w-auto"
                aria-label="Create my portfolio"
              >
                <CtaLabel label="Create my portfolio" />
              </MagneticButton>
              <a
                href="#showcase"
                className="inline-flex h-[56px] items-center justify-center rounded-full border border-[#FBF9F6]/20 px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FBF9F6]/80 transition-colors duration-300 hover:border-[#FBF9F6]/50 hover:text-[#FBF9F6]"
              >
                Look around first
              </a>
            </motion.div>
          </div>

          {/* Onboarding card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE_OUT }}
              className="relative overflow-hidden rounded-[24px] border border-[#FBF9F6]/12 bg-[#231812]/80 p-6 backdrop-blur-sm sm:p-7"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(180,85,45,0.25),transparent_70%)]"
              />
              <div className="relative flex items-center justify-between border-b border-[#FBF9F6]/10 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#EBC4A6]">
                  Launch sequence
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-[#FBF9F6]/12 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#FBF9F6]/50">
                  <Sparkles size={9} strokeWidth={1.8} />
                  ~3 min
                </span>
              </div>

              <ol className="relative mt-5 space-y-4">
                {STEPS.map((step, index) => (
                  <li key={step.label} className="flex items-center gap-3.5">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[9px] font-bold ${
                        step.done
                          ? 'border-[#EBC4A6]/50 bg-[#EBC4A6]/15 text-[#EBC4A6]'
                          : 'border-[#FBF9F6]/20 text-[#FBF9F6]/50'
                      }`}
                    >
                      {step.done ? <Check size={12} strokeWidth={2.4} /> : `0${index + 1}`}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[13.5px] font-medium text-[#FBF9F6]">
                        {step.label}
                      </p>
                      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#FBF9F6]/40">
                        {step.meta}
                      </p>
                    </div>
                    {step.done && (
                      <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#EBC4A6]/70">
                        Ready
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              <div className="relative mt-6 flex items-center gap-2 rounded-full border border-[#FBF9F6]/10 bg-[#1B120D] px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EBC4A6]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#FBF9F6]/55">
                  No card required to start
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="mt-20 grid grid-cols-1 gap-10 border-t border-[#FBF9F6]/12 pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#hero" className="inline-flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-[#FBF9F6]/15 bg-[#FBF9F6]/[0.06] font-serif text-[17px] italic text-[#EBC4A6]">
                Dc
              </span>
              <span className="font-mono text-[12px] font-bold tracking-[0.26em] text-[#FBF9F6]">
                DEVCANVAS
              </span>
            </a>
            <p className="mt-5 max-w-[22rem] font-sans text-[13px] leading-[1.7] text-[#FBF9F6]/45">
              A resume-to-portfolio builder for students, graduates, and developers who
              would rather ship than fight a website builder.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#EBC4A6]">Sections</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[28px] font-sans text-[13px] text-[#FBF9F6]/60 transition-colors hover:text-[#FBF9F6]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#EBC4A6]">Product</p>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[28px] font-sans text-[13px] text-[#FBF9F6]/60 transition-colors hover:text-[#FBF9F6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 lg:justify-self-end">
            <button
              type="button"
              onClick={backToTop}
              aria-label="Back to top"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#FBF9F6]/20 text-[#FBF9F6]/70 transition-colors hover:border-[#EBC4A6]/60 hover:text-[#EBC4A6]"
            >
              <ArrowUp size={15} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#FBF9F6]/10 pt-6 font-mono text-[8.5px] uppercase tracking-[0.16em] text-[#FBF9F6]/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DevCanvas. All rights reserved.</p>
          <p>Designed for students, graduates &amp; developers</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="relative select-none overflow-hidden px-2 pb-2" aria-hidden="true">
        <motion.p
          initial={reduce ? false : { y: '32%', opacity: 0 }}
          whileInView={reduce ? undefined : { y: '0%', opacity: 1 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          className="bg-gradient-to-b from-[#FBF9F6]/16 to-[#FBF9F6]/[0.02] bg-clip-text text-center font-serif text-[clamp(3.5rem,16vw,14rem)] font-medium leading-[0.78] tracking-[-0.05em] text-transparent"
        >
          DevCanvas
        </motion.p>
      </div>
    </footer>
  );
}
