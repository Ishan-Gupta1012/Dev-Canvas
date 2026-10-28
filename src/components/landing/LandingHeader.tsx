'use client';

import React, { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { MagneticButton, CtaLabel } from './MagneticButton';
import { EASE_OUT } from './motion';

const LINKS = [
  { id: 'showcase', label: 'Showcase', index: '01' },
  { id: 'transform', label: 'Transform', index: '02' },
  { id: 'archive', label: 'Workflow', index: '03' },
  { id: 'features', label: 'Features', index: '04' },
  { id: 'faq', label: 'FAQ', index: '05' },
];

export default function LandingHeader({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 32);
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#4A2F1F] via-[#B4552D] to-[#EBC4A6]"
        style={{ scaleX: progress }}
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ${
          scrolled || open
            ? 'border-b border-[#3A2418]/12 bg-[#FAF7F3]/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-5 sm:py-6'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <a
            href="#hero"
            onClick={go('hero')}
            className="group flex min-h-[44px] items-center gap-3 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6F4A34]"
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[10px] border border-[#3A2418]/20 bg-[#4A2F1F] text-[#F8EADF]">
              <span className="font-serif text-[17px] italic leading-none">Dc</span>
              <span className="pointer-events-none absolute inset-0 translate-y-full bg-[#B4552D] transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-full font-serif text-[17px] italic leading-none text-[#231812] transition-transform duration-500 ease-out group-hover:translate-y-0">
                Dc
              </span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-mono text-[12px] font-bold tracking-[0.26em] text-[#231812]">
                DEVCANVAS
              </span>
              <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#B4552D]">
                Resume → Portfolio
              </span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={go(link.id)}
                className="group relative flex min-h-[44px] items-center font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A2C22] transition-colors hover:text-[#4A2F1F]"
              >
                <span className="mr-1.5 text-[8px] text-[#B4552D] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {link.index}
                </span>
                {link.label}
                <span className="absolute inset-x-0 bottom-2 h-px origin-left scale-x-0 bg-[#4A2F1F] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/signin"
              className="hidden min-h-[44px] items-center px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3A2C22] transition-colors hover:text-[#4A2F1F] sm:inline-flex"
            >
              Sign in
            </Link>
            <div className="hidden sm:block">
              <MagneticButton
                onClick={onEnter}
                strength={6}
                className="h-[44px] rounded-full border border-[#3A2418] bg-[#4A2F1F] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FBF9F6] shadow-[0_12px_30px_-16px_rgba(58,36,24,0.9)] transition-colors duration-300 hover:bg-[#6F4A34]"
                aria-label="Create my portfolio"
              >
                <CtaLabel label="Start building" />
              </MagneticButton>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="landing-mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-[#3A2418]/20 bg-[#FAF7F3]/70 text-[#231812] transition-colors hover:bg-[#F1D2BD] lg:hidden"
            >
              {open ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="landing-mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-[#FAF7F3] px-6 pb-10 pt-28 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <div className="pointer-events-none absolute inset-0 lc-grain opacity-[0.5]" aria-hidden="true" />
            <nav aria-label="Mobile" className="relative flex flex-col">
              {LINKS.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + index * 0.05, duration: 0.5, ease: EASE_OUT }}
                  className="flex items-baseline justify-between border-b border-[#3A2418]/12 py-5"
                >
                  <span className="font-serif text-[clamp(2rem,8vw,2.75rem)] leading-none text-[#231812]">
                    {link.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B4552D]">
                    {link.index}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="relative mt-auto flex flex-col gap-3 pt-10"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: EASE_OUT }}
            >
              <MagneticButton
                onClick={() => {
                  setOpen(false);
                  onEnter();
                }}
                strength={4}
                className="h-[54px] w-full rounded-full border border-[#3A2418] bg-[#4A2F1F] font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#FBF9F6]"
              >
                <CtaLabel label="Create my portfolio" />
              </MagneticButton>
              <Link
                href="/signin"
                className="flex h-[50px] items-center justify-center rounded-full border border-[#3A2418]/25 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3A2C22]"
              >
                Sign in
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
