'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Works', path: '/works' },
    { label: 'Contact', path: '/contact' },
  ];

  const authLinks = user ? [
    { label: 'My Portfolios', path: '/dashboard/portfolios' },
    { label: 'Dashboard', path: '/dashboard' },
  ] : [
    { label: 'Sign in', path: '/signin' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/25 backdrop-blur-2xl text-on-background border-b border-outline/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 min-h-[44px] inline-flex items-center rounded-sm transition-colors duration-200 ${
                  active ? 'text-primary font-bold' : 'text-on-background/60 hover:text-primary'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-sm bg-primary/10 border border-primary/20 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA / Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
              <Link
                href="/dashboard/portfolios"
                className="transition-colors hover:text-primary flex items-center gap-2 border border-outline/20 px-3 py-1 rounded-sm text-on-background/80"
              >
                My Portfolios
              </Link>
              <Link
                href="/dashboard"
                className="transition-colors hover:text-primary flex items-center gap-2 border border-primary px-3 py-1 rounded-sm text-on-background"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {user.personalInfo?.avatar ? (
                  <img
                    src={user.personalInfo.avatar}
                    alt={user.personalInfo.name ?? 'User'}
                    className="w-4 h-4 rounded-full object-cover border border-outline/20"
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center min-h-[44px] text-on-background/60 hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
              <Link
                href="/signin"
                className="hidden sm:inline-flex sm:items-center min-h-[44px] text-on-background/60 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center min-h-[44px] bg-primary text-on-primary hover:bg-primary/80 transition-colors px-4 rounded-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-on-background"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/60 backdrop-blur-2xl w-full px-6 py-8 flex flex-col gap-6 font-mono text-sm uppercase tracking-wider">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-on-background/60'}`}
          >
            Home
          </Link>
          <Link
            href="/works"
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/works') ? 'text-primary font-semibold' : 'text-on-background/60'}`}
          >
            Works
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/contact') ? 'text-primary font-semibold' : 'text-on-background/60'}`}
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
