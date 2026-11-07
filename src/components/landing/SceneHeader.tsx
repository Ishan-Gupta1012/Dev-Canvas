'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMotionValueEvent, useScroll } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Growth', href: '#growth' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Minimal sticky navigation for the landing story. */
export default function SceneHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const next = v > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl' : ''
      }`}
      style={{
        background: scrolled ? 'rgba(233, 234, 235, 0.92)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'rgba(213, 214, 216, 0.8)' : 'transparent'}`,
      }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 lg:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
            style={{ background: 'linear-gradient(140deg, #D5D6D8, #292C30)' }}
          >
            ✦
          </span>
          <span className="text-[15px] font-bold text-[#292C30] tracking-tight">DevCanvas</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#777C82] hover:text-[#292C30] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#777C82] hover:text-[#292C30] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="hidden sm:inline-flex text-[13px] font-medium text-[#777C82] hover:text-[#292C30] transition-colors px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center text-[13px] font-semibold text-[#F4F4F2] bg-[#292C30] hover:bg-[#1A1B1D] transition-colors rounded-full px-4 py-2 shadow-[0_4px_16px_rgba(41,44,48,0.18)]"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
