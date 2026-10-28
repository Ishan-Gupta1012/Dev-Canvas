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
        background: scrolled ? 'rgba(247, 239, 226, 0.92)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'rgba(122, 88, 48, 0.16)' : 'transparent'}`,
      }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 lg:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-5 h-5 rounded"
            style={{ background: 'linear-gradient(140deg, #EBCF97, #B0803F)' }}
          />
          <span className="text-[15px] font-bold text-[#35261E] tracking-tight">DevCanvas</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6B5138] hover:text-[#3A2716] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-[#6B5138] hover:text-[#3A2716] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="hidden sm:inline-flex text-[13px] font-medium text-[#6B5138] hover:text-[#3A2716] transition-colors px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center text-[13px] font-semibold text-[#3A2716] bg-[#E3BE7C] hover:bg-[#D3A557] transition-colors rounded-full px-4 py-2 shadow-[0_6px_18px_rgba(176,128,63,0.28)]"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
