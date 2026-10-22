'use client';

import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardAuthGuard from '@/components/auth/DashboardAuthGuard';
import { cn } from '@/components/dashboard/ui';
import {
  ChevronDown,
  UserCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type NavItem = {
  name: string;
  href?: string;
  exact?: boolean;
  dropdown?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', exact: true },
  {
    name: 'Resume',
    dropdown: [
      // { name: 'Upload / Parse', href: '/dashboard/resume' }, // Hidden - kept in code
      { name: 'Resume Maker', href: '/dashboard/resume-builder' },
      { name: 'Analyzer', href: '/dashboard/resume-analyzer' }
    ]
  },
  { name: 'Templates', href: '/dashboard/templates' },
  { name: 'Auto Builder', href: '/dashboard/ai-builder' },
  { name: 'My Portfolios', href: '/dashboard/portfolios' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, clearNotifications } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

const isActive = (item: NavItem) => {
    if (item.href) return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    if (item.dropdown) return item.dropdown.some(d => pathname.startsWith(d.href));
    return false;
  };

  return (
       <div
         className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container select-none min-h-screen flex flex-col transition-opacity duration-500 ease-out motion-reduce:transition-none"
         style={{ opacity: isMounted ? 1 : 0 }}
       >
        <DashboardAuthGuard />
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/15 backdrop-blur-2xl text-on-background shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between relative">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <span className="font-serif font-semibold text-lg tracking-tight text-primary">DevCanvas</span>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 font-mono text-xs uppercase tracking-widest">
            {navItems.map(item => {
              if (item.dropdown) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 transition-colors hover:text-primary py-4',
                        isActive(item) ? 'text-primary font-semibold' : 'text-on-surface-variant'
                      )}
                    >
                      {item.name}
                      <ChevronDown size={12} className={cn('transition-transform', activeDropdown === item.name && 'rotate-180')} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 w-48 bg-surface border border-outline-variant rounded-xl shadow-sm z-[100] py-2"
                        >
                          {item.dropdown.map(d => (
                            <Link
                              key={d.name}
                              href={d.href}
                              className="block px-4 py-2 text-on-surface-variant hover:text-primary hover:bg-secondary-container transition-colors"
                            >
                              {d.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'relative px-3 py-1.5 rounded-sm transition-colors duration-200',
                    isActive(item) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                  )}
                >
                  {isActive(item) && (
                    <motion.span
                      layoutId="dashboard-nav-active-pill"
                      className="absolute inset-0 rounded-sm bg-primary/10 border border-primary/20 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

{/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              <div className="h-4 w-px bg-outline/20" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary-container transition-colors"
              >
                <img
                  className="w-7 h-7 rounded-sm border border-outline/20 object-cover"
                  src={user?.personalInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
                  alt="Profile"
                />
                <ChevronDown size={14}                 className={cn('text-on-surface transition-transform', isDropdownOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-sm z-[100]"
                  >
                    <div className="p-3 border-b border-outline/10">
                      <p className="font-bold text-sm truncate text-on-surface">{user?.personalInfo?.name || 'Developer'}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/50 truncate">
                        {user?.personalInfo?.email || 'Signed in'}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest"
                      >
                        <UserCircle size={14} /> Profile
                      </Link>
                    </div>
                    <div className="border-t border-outline/10 py-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-tertiary hover:text-tertiary/80 hover:bg-secondary-container transition-colors font-mono text-xs uppercase tracking-widest"
                      >
                        <LogOut size={14} /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-on-background flex items-center"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/60 backdrop-blur-2xl w-full px-6 py-6 flex flex-col gap-4 font-mono text-sm uppercase tracking-wider">
            {navItems.map(item => {
              if (item.dropdown) {
                return (
                  <div key={item.name} className="flex flex-col gap-3">
                    <span className="text-on-background/40 text-xs">{item.name}</span>
                    <div className="pl-4 flex flex-col gap-3 border-l border-outline/15">
                      {item.dropdown.map(d => (
                        <Link
                          key={d.name}
                          href={d.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn('transition-colors', pathname.startsWith(d.href) ? 'text-primary font-semibold' : 'text-on-background/70')}
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn('transition-colors', isActive(item) ? 'text-primary font-semibold' : 'text-on-background/70')}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-background pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline/15 bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-60">
            <span className="font-serif font-semibold text-sm tracking-tight text-on-background">DevCanvas</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="font-mono text-xs uppercase tracking-widest text-on-background/60 hover:text-primary transition-colors">
              About
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/40">
              © {new Date().getFullYear()} DevCanvas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
