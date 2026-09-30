'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GenerativeAttractorCanvas from '@/components/OpeningExperience/GenerativeAttractorCanvas';
import { skipIntroOnNextLanding } from '@/lib/intro-entry';
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';

export type AuthMode = 'signin' | 'signup';

const FADE_MS = 550;

type Provider = 'google' | 'github';

const PROVIDERS: { id: Provider; label: string; mark: React.ReactNode }[] = [
  {
    id: 'google',
    label: 'Google',
    mark: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    mark: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
];

export default function AuthGateway({ mode }: { mode: AuthMode }) {
  const { user, login, signInWithPassword, signUp, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: 'sent' | 'error'; text: string } | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const isLeavingRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleBack = () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    setIsLeaving(true);
    skipIntroOnNextLanding();
    window.setTimeout(() => {
      router.push('/');
    }, FADE_MS);
  };

  const isSignUp = mode === 'signup';

  useEffect(() => {
    if (!user || isLoading) return;
    // The gateway fades itself out before handing over to the dashboard
    const fadeFrame = window.requestAnimationFrame(() => setIsLeaving(true));
    const timer = window.setTimeout(() => {
      skipIntroOnNextLanding();
      router.push('/dashboard');
    }, FADE_MS);
    return () => {
      window.cancelAnimationFrame(fadeFrame);
      window.clearTimeout(timer);
    };
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && !name.trim()) {
      setMessage({ tone: 'error', text: 'Enter your name so the account has an owner.' });
      return;
    }
    if (!email) {
      setMessage({ tone: 'error', text: 'Enter your email to continue.' });
      return;
    }
    if (!password) {
      setMessage({ tone: 'error', text: 'Enter your password to continue.' });
      return;
    }

    setMessage(null);
    setHasSubmitted(true);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, name.trim());
        setMessage({
          tone: 'sent',
          text: 'Account created. Check your email to confirm it, then sign in.',
        });
      } else {
        await signInWithPassword(email.trim(), password);
      }
      setPassword('');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      const reason = error instanceof Error ? error.message : '';
      setMessage({
        tone: 'error',
        text: isSignUp
          ? 'That account was not created. If the address is already in use, sign in instead.'
          : 'That email and password did not match an account. Check them and try again.',
      });
      if (reason) {
        console.error('Auth request failed:', reason);
      }
    }
  };

  const handleProvider = async (provider: Provider) => {
    setMessage(null);
    setHasSubmitted(true);
    await login(provider);
  };

  if (isLoading && !hasSubmitted) {
    return (
      <div className="relative min-h-screen bg-[#EEEBE7] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#7C3F2F] animate-spin" aria-label="Checking session" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[#EEEBE7] text-[#0A0402] font-sans flex flex-col overflow-x-hidden">
      <div
        className="flex flex-col flex-1 min-h-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none"
        style={{ opacity: isVisible && !isLeaving ? 1 : 0 }}
      >
      {/* Full-bleed attractor with the left side faded so the form sits on clear ground */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 42%, #000 78%)',
          maskImage: 'linear-gradient(to right, transparent 42%, #000 78%)',
        }}
      >
        <GenerativeAttractorCanvas />
      </div>

      <header className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.2em] text-[#3E1510] hover:text-[#56241A] transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#56241A] animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#0A0402] font-bold">
            DevCanvas // Access
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-5 sm:px-10 py-6 sm:py-8 lg:py-0 lg:px-14 flex items-center justify-start">
        <div className="w-full max-w-[480px] border border-[#CCC0B5] bg-[#EEEBE7]/90 backdrop-blur-[2px] px-6 sm:px-9 py-10 sm:py-12 lg:py-12 flex flex-col gap-6 lg:gap-7 shadow-[0_24px_60px_-30px_rgba(10,4,2,0.5)]">
          <h1 className="font-serif text-[36px] sm:text-[42px] lg:text-[40px] leading-[0.95] tracking-[-1.4px]">
            {isSignUp ? (
              <>
                <span className="text-[#0A0402]">Open your</span>
                <br />
                <span className="text-[#7C3F2F]">workspace.</span>
              </>
            ) : (
              <>
                <span className="text-[#0A0402]">Pick up</span>
                <br />
                <span className="text-[#7C3F2F]">where you left off.</span>
              </>
            )}
          </h1>

          <div
            role="status"
            aria-live="polite"
            className={
              message
                ? `border px-4 py-3 font-mono text-[12px] uppercase leading-[1.5] ${
                    message.tone === 'sent'
                      ? 'border-[#56241A]/40 bg-[#56241A]/10 text-[#3E1510]'
                      : 'border-[#D35724]/50 bg-[#D35724]/10 text-[#8A3A15]'
                  }`
                : 'hidden'
            }
          >
            {message?.text}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            {isSignUp && (
              <div className="flex flex-col gap-2.5">
                <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#3E1510]">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full px-4 bg-[#FFFFFF] border border-[#CCC0B5] text-[#0A0402] placeholder:text-[#7C3F2F] font-mono text-[13px] outline-none transition-colors focus:border-[#56241A] focus-visible:ring-2 focus-visible:ring-[#7C3F2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEBE7]"
                />
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#3E1510]">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C3F2F] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="xyz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full pl-11 pr-4 bg-[#FFFFFF] border border-[#CCC0B5] text-[#0A0402] placeholder:text-[#7C3F2F] font-mono text-[13px] outline-none transition-colors focus:border-[#56241A] focus-visible:ring-2 focus-visible:ring-[#7C3F2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEBE7]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#3E1510]">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C3F2F] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full pl-11 pr-4 bg-[#FFFFFF] border border-[#CCC0B5] text-[#0A0402] placeholder:text-[#7C3F2F] font-mono text-[13px] outline-none transition-colors focus:border-[#56241A] focus-visible:ring-2 focus-visible:ring-[#7C3F2F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEBE7]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full inline-flex items-center justify-center gap-2 bg-[#56241A] hover:bg-[#7C3F2F] disabled:bg-[#7C3F2F]/50 text-[#FFFFFF] border border-[#3E1510] font-mono text-[12px] uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Working
                </>
              ) : isSignUp ? (
                'Sign up'
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-[#CCC0B5]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#7C3F2F]">or continue with</span>
            <span className="h-px flex-1 bg-[#CCC0B5]" />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {PROVIDERS.map(({ id, label, mark }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleProvider(id)}
                aria-label={`Continue with ${label}`}
                className="group h-12 w-full flex items-center justify-center gap-2 px-3 border border-[#CCC0B5] bg-[#FFFFFF] hover:border-[#56241A] transition-colors duration-200 cursor-pointer"
              >
                {mark}
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0A0402]">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#CCC0B5] pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#3E1510]/70">
              {isSignUp ? 'Already have an account?' : 'No account yet?'}
            </p>
            <Link
              href={isSignUp ? '/signin' : '/signup'}
              className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.2em] text-[#56241A] hover:text-[#7C3F2F] transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Create account'}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 hidden lg:flex w-full max-w-[1440px] mx-auto px-5 sm:px-10 pb-5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-[#3E1510]/50">
        <span>© 2026 DevCanvas // PaaS</span>
        <span>Clearance required</span>
      </footer>

      </div>
    </div>
  );
}
