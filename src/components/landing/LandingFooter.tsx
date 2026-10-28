'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Aperture, ArrowRight, Check } from 'lucide-react';

/* ─── Brand mark ─── */
const Logo = () => (
  <span
    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
    style={{
      background: 'linear-gradient(140deg, #F0D6A4, #C08B3E)',
      boxShadow: '0 6px 16px rgba(176,128,63,0.32), inset 0 1px 0 rgba(255,255,255,0.5)',
    }}
  >
    <Aperture className="w-4.5 h-4.5 text-[#1F1410]" />
  </span>
);

/* ─── Social icons ─── */
const GitHubMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const LinkedInMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v16h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.9c0-1.9-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.16V24h-4V8z" />
  </svg>
);

const XMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
  </svg>
);

const DiscordMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8.5 14.5c2.3 1.2 4.7 1.2 7 0" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com', Icon: GitHubMark },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInMark },
  { label: 'X', href: 'https://x.com', Icon: XMark },
  { label: 'Community', href: '#', Icon: DiscordMark },
];

/* ─── Link columns ─── */
const PRODUCT_LINKS = [
  { label: 'Features', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#home' },
];

const RESOURCE_LINKS = [
  { label: 'Blog', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Contact', href: '/contact' },
];

/* ─── Section ─── */
export default function LandingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-transparent">
      {/* Soft amber glow at the top edge */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,166,92,0.2) 0%, transparent 70%)' }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,166,92,0.4), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 sm:pt-20 pb-8">
        {/* ── Top: brand + columns + newsletter ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-[17px] font-bold text-[#35261E] tracking-tight">DevCanvas</span>
            </div>
            <p className="mt-4 text-sm text-[#6B5138] leading-relaxed max-w-[260px]">
              Your skills. Your story. Your identity.
            </p>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="text-[#6B5138] hover:text-[#A9762F] transition-colors duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 lg:col-start-6"
          >
            <p className="text-[13px] font-bold text-[#35261E] mb-4">Product</p>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6B5138] hover:text-[#35261E] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <p className="text-[13px] font-bold text-[#35261E] mb-4">Resources</p>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6B5138] hover:text-[#35261E] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stay Updated */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 lg:col-start-10"
          >
            <p className="text-[13px] font-bold text-[#35261E] mb-4">Stay Updated</p>
            <p className="text-sm text-[#6B5138] leading-relaxed mb-4">
              Get the latest updates and tips on building your professional
              identity.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={subscribed ? 'Subscribed ✓' : 'Enter your email'}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm text-[#35261E] placeholder:text-[#93795B] outline-none transition-all duration-200 focus:border-[rgba(176,128,63,0.55)]"
                style={{
                  background: 'rgba(255, 249, 236, 0.85)',
                  border: '1px solid rgba(122, 88, 48, 0.18)',
                }}
              />
              <button
                type="submit"
                aria-label={subscribed ? 'Subscribed' : 'Subscribe'}
                className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-[#3A2716] transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: 'linear-gradient(160deg, #F0D6A4, #C08B3E)',
                  boxShadow: '0 8px 20px rgba(176, 128, 63, 0.35), inset 0 1px 0 rgba(255,250,240,0.6)',
                }}
              >
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── Divider + bottom bar ── */}
        <div
          className="mt-14 h-px"
          style={{ background: 'rgba(122, 88, 48, 0.18)' }}
        />
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#93795B]">
            © {new Date().getFullYear()} DevCanvas. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-[#93795B] hover:text-[#6B5138] transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-[#93795B] hover:text-[#6B5138] transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* ── Translucent faded wordmark ── */}
      <div className="relative z-0 select-none pointer-events-none px-6 md:px-12 lg:px-20 overflow-hidden">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
          className="text-center font-bold tracking-tight leading-[0.85] -mb-[0.16em] pt-4"
          style={{
            fontSize: 'clamp(3.5rem, 15vw, 13rem)',
            backgroundImage: 'linear-gradient(to bottom, rgba(58, 39, 22, 0.22) 0%, rgba(192, 139, 62, 0.18) 55%, transparent 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          DevCanvas
        </motion.p>
      </div>
    </footer>
  );
}
