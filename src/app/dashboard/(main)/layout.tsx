'use client';

import type { ComponentType } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/components/dashboard/ui';
import {
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';

type NavItem = {
  name: string;
  href?: string;
  exact?: boolean;
  dropdown?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', exact: true },
  { name: 'Templates', href: '/dashboard/templates' },
  { name: 'Auto Builder', href: '/dashboard/ai-builder' },
  {
    name: 'Resume',
    dropdown: [
      { name: 'Upload / Parse', href: '/dashboard/resume' },
      { name: 'Resume Builder', href: '/dashboard/resume-builder' },
      { name: 'Analyzer', href: '/dashboard/resume-analyzer' }
    ]
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, clearNotifications } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const unreadCount = user?.notifications?.filter((n) => n.unread).length ?? 0;
  const recentNotifications = (user?.notifications ?? [])
    .slice()
    .sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1));

  const isActive = (item: NavItem) => {
    if (item.href) return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    if (item.dropdown) return item.dropdown.some(d => pathname.startsWith(d.href));
    return false;
  };

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container select-none min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-outline/15 text-on-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="border border-primary w-7 h-7 rounded-sm flex items-center justify-center font-serif text-sm font-semibold transition-all group-hover:bg-primary group-hover:text-on-primary">
              P
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">PAAS</span>
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
                        isActive(item) ? 'text-primary font-semibold' : 'text-on-background/60'
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
                          className="absolute top-full left-0 w-48 bg-background border border-outline/15 rounded-xl shadow-lg z-[100] py-2"
                        >
                          {item.dropdown.map(d => (
                            <Link
                              key={d.name}
                              href={d.href}
                              className="block px-4 py-2 text-on-background/70 hover:text-primary hover:bg-on-background/5 transition-colors"
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
                    'transition-colors hover:text-primary py-4',
                    isActive(item) ? 'text-primary font-semibold underline underline-offset-4' : 'text-on-background/60'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-on-background/60 hover:text-primary transition-colors rounded-lg"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-background border border-outline/15 rounded-xl shadow-lg ring-1 ring-black/5 z-[100]"
                  >
                    <div className="p-3 border-b border-outline/10 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/50">
                        Notifications
                      </p>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            clearNotifications();
                            setIsNotificationsOpen(false);
                          }}
                          className="text-[10px] font-mono uppercase tracking-widest text-on-background/60 hover:text-primary"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {recentNotifications.length === 0 ? (
                        <p className="p-4 text-xs text-on-background/50 text-center">No notifications.</p>
                      ) : (
                        recentNotifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-on-background/5 transition-colors border-b last:border-0 border-outline/5">
                            <div className="flex gap-2">
                              <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-full', n.unread ? 'bg-black' : 'bg-transparent')} />
                              <div className="flex-1">
                                <p className="text-xs font-bold">{n.title}</p>
                                <p className="mt-0.5 text-xs text-on-background/60">{n.description}</p>
                                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-on-background/40">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-outline/20" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-on-background/5 transition-colors"
              >
                <img
                  className="w-7 h-7 rounded-sm border border-outline/20 object-cover"
                  src={user?.personalInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
                  alt="Profile"
                />
                <ChevronDown size={14} className={cn('text-on-background transition-transform', isDropdownOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background border border-outline/15 rounded-xl shadow-lg z-[100]"
                  >
                    <div className="p-3 border-b border-outline/10">
                      <p className="font-bold text-sm truncate">{user?.personalInfo?.name || 'Developer'}</p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/50 truncate">
                        {user?.personalInfo?.email || 'Signed in'}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 text-on-background hover:bg-on-background/5 transition-colors font-mono text-xs uppercase tracking-widest"
                      >
                        <UserCircle size={14} /> Profile
                      </Link>
                    </div>
                    <div className="py-1 border-t border-outline/10">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 text-on-background hover:bg-on-background/5 transition-colors font-mono text-xs uppercase tracking-widest"
                      >
                        <UserCircle size={14} /> Settings
                      </Link>
                    </div>
                    <div className="border-t border-outline/10 py-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-on-background/5 transition-colors font-mono text-xs uppercase tracking-widest"
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
          <div className="md:hidden border-t border-outline/15 bg-background w-full px-6 py-6 flex flex-col gap-4 font-mono text-sm uppercase tracking-wider">
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
            <div className="border border-primary w-5 h-5 rounded-sm flex items-center justify-center font-serif text-[10px] font-semibold">
              P
            </div>
            <span className="font-serif font-semibold text-sm tracking-tight text-on-background">PAAS</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="font-mono text-xs uppercase tracking-widest text-on-background/60 hover:text-primary transition-colors">
              About
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/40">
              © {new Date().getFullYear()} PAAS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
