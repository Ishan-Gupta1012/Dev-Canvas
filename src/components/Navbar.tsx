'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xs border-b border-outline/15 text-on-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-h-[44px] group">
          <div className="border border-primary w-7 h-7 rounded-sm flex items-center justify-center font-serif text-sm font-semibold transition-all group-hover:bg-primary group-hover:text-on-primary">
            P
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">PAAS</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-widest">
          <Link
            href="/"
            className={`inline-flex items-center min-h-[44px] transition-colors hover:text-primary ${isActive('/') ? 'text-primary font-semibold underline underline-offset-4' : 'text-on-background/60'}`}
          >
            Home
          </Link>
          <Link
            href="/works"
            className={`inline-flex items-center min-h-[44px] transition-colors hover:text-primary ${isActive('/works') ? 'text-primary font-semibold underline underline-offset-4' : 'text-on-background/60'}`}
          >
            Works
          </Link>
          <Link
            href="/contact"
            className={`inline-flex items-center min-h-[44px] transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary font-semibold underline underline-offset-4' : 'text-on-background/60'}`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA / Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
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
        <div className="md:hidden border-t border-outline/15 bg-background w-full px-6 py-8 flex flex-col gap-6 font-mono text-sm uppercase tracking-wider">
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
