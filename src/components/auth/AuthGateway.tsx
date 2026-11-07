'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { skipIntroOnNextLanding } from '@/lib/intro-entry';
import EtchedBackdrop from '@/components/auth/EtchedBackdrop';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  RotateCcw,
} from 'lucide-react';

export type AuthMode = 'signin' | 'signup';

const FADE_MS = 550;

type Provider = 'google' | 'github';

const PROVIDERS: { id: Provider; label: string; mark: React.ReactNode }[] = [
  {
    id: 'google',
    label: 'Google',
    mark: (
      <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" aria-hidden="true">
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
      <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
];

const FIELD_CLASS =
  'h-[50px] w-full rounded-xl border border-[rgba(41,44,48,0.16)] bg-white px-4 font-mono text-[13px] text-[#111315] placeholder:text-[#9AA0A8] outline-none transition-all duration-200 focus:border-[#111315] focus:ring-4 focus:ring-[#EF4444]/10';

export default function AuthGateway({ mode }: { mode: AuthMode }) {
  const { user, login, signInWithPassword, signUp, resendConfirmationEmail, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: 'sent' | 'error'; text: string } | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
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
    setEmailNotConfirmed(false);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, name.trim());
        // If we get here without error, user is signed in and will be redirected
        setMessage({
          tone: 'sent',
          text: 'Account created! Redirecting to dashboard...',
        });
      } else {
        await signInWithPassword(email.trim(), password);
      }
      setPassword('');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      const reason = error instanceof Error ? error.message : '';

      console.error('AuthGateway caught error:', error, 'reason:', reason);

      // Check for account already exists error
      if (reason.startsWith('ACCOUNT_EXISTS:')) {
        const userMessage = reason.split('ACCOUNT_EXISTS:')[1];
        setMessage({ tone: 'error', text: userMessage });
      }
      // Check for email not confirmed error
      else if (reason.startsWith('EMAIL_NOT_CONFIRMED:')) {
        setEmailNotConfirmed(true);
        const userMessage = reason.split('EMAIL_NOT_CONFIRMED:')[1];
        setMessage({ tone: 'error', text: userMessage });
      } else {
        setMessage({
          tone: 'error',
          text: isSignUp
            ? `Signup failed: ${reason || 'Unknown error'}`
            : 'That email and password did not match an account. Check them and try again.',
        });
      }
    }
  };

  const handleResendConfirmation = async () => {
    setMessage(null);
    setIsSubmitting(true);
    try {
      await resendConfirmationEmail(email.trim());
      setMessage({
        tone: 'sent',
        text: 'Confirmation email sent! Check your inbox and click the link to verify your account.',
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : '';
      setMessage({
        tone: 'error',
        text: 'Failed to send confirmation email. Please try again.',
      });
      if (reason) {
        console.error('Resend confirmation failed:', reason);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProvider = async (provider: Provider) => {
    setMessage(null);
    setHasSubmitted(true);
    await login(provider);
  };

  if (isLoading && !hasSubmitted) {
    return (
      <div className="relative min-h-screen bg-[#E9EAEB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <span className="auth-mini-orb" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#777C82]">
            Checking session
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#E9EAEB] text-[#111315] font-sans flex flex-col overflow-x-hidden">
      <EtchedBackdrop />

      <div
        className="relative z-10 flex flex-col flex-1 min-h-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none"
        style={{ opacity: isVisible && !isLeaving ? 1 : 0 }}
      >
        <header className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 min-h-[44px] font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4A4E54] hover:text-[#EF4444] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Back to landing
          </button>

          <div className="flex items-center gap-2.5">
            <span className="relative grid h-8 w-8 place-items-center rounded-[9px] bg-[#111315] font-mono text-[13px] font-bold text-[#F7F8F8]">
              D
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#E9EAEB]"
                aria-hidden="true"
              />
            </span>
            <span className="leading-none">
              <span className="block font-mono text-[11px] font-bold tracking-[0.24em] text-[#111315]">
                DEVCANVAS
              </span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.22em] text-[#EF4444]">
                Access node
              </span>
            </span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-14 py-6 lg:py-8 grid lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
          {/* ── Form ── */}
          <section className="auth-rise w-full">
            <div className="w-full rounded-[28px] border border-[rgba(41,44,48,0.14)] bg-white/90 backdrop-blur-xl px-6 sm:px-9 py-7 sm:py-9 shadow-[0_30px_80px_-40px_rgba(17,19,21,0.3)]">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#777C82]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-pulse" aria-hidden="true" />
                  {isSignUp ? 'New account // 02' : 'Secure access // 01'}
                </span>

                <h1
                  className="text-[clamp(30px,3.1vw,40px)] font-bold leading-[1.03] tracking-[-0.04em]"
                  style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  <span className="text-[#111315]">
                    {isSignUp ? 'Open your' : 'Welcome back.'}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#DC2626] via-[#E04848] to-[#F87171] bg-clip-text text-transparent">
                    {isSignUp ? 'workspace.' : 'Continue building.'}
                  </span>
                </h1>

                <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-[#4A4E54]">
                  {isSignUp
                    ? 'One account holds your resume, projects and a live portfolio site.'
                    : 'Pick up where you left off — your resume, projects and portfolio are waiting.'}
                </p>
              </div>

              <div
                role="status"
                aria-live="polite"
                className={`mt-5 rounded-xl border px-4 py-3 font-mono text-[11px] uppercase leading-[1.6] tracking-[0.04em] ${
                  message
                    ? message.tone === 'sent'
                      ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800'
                      : 'border-[#EF4444]/35 bg-[#EF4444]/[0.07] text-[#B91C1C]'
                    : 'hidden'
                }`}
              >
                {message?.text}
              </div>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
                {isSignUp && (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#4A4E54]"
                    >
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
                      className={FIELD_CLASS}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#4A4E54]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A8] pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${FIELD_CLASS} pl-11`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#4A4E54]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A8] pointer-events-none"
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
                      className={`${FIELD_CLASS} pl-11`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-1 h-12 w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-[#111315] font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-[#1E2125] hover:shadow-[0_18px_40px_-18px_rgba(17,19,21,0.7)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Working
                    </>
                  ) : (
                    <>
                      {isSignUp ? 'Create account' : 'Sign in'}
                      <ArrowRight
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>

                {!isSignUp && emailNotConfirmed && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isSubmitting}
                    className="h-11 w-full inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(41,44,48,0.16)] bg-white font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#23262A] transition-all duration-200 hover:border-[#111315] hover:bg-[#F4F5F6] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Sending
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        Resend confirmation
                      </>
                    )}
                  </button>
                )}
              </form>

              <div className="mt-5 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-[rgba(41,44,48,0.12)]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#9AA0A8]">
                  or continue with
                </span>
                <span className="h-px flex-1 bg-[rgba(41,44,48,0.12)]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {PROVIDERS.map(({ id, label, mark }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleProvider(id)}
                    aria-label={`Continue with ${label}`}
                    className="group h-[46px] w-full flex items-center justify-center gap-2 rounded-full border border-[rgba(41,44,48,0.16)] bg-white px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#23262A] transition-all duration-200 hover:border-[#111315] hover:bg-[#F4F5F6] cursor-pointer"
                  >
                    {mark}
                    <span className="transition-colors group-hover:text-[#111315]">{label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-[rgba(41,44,48,0.12)] pt-4">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#777C82]">
                  {isSignUp ? 'Already have an account?' : 'No account yet?'}
                </p>
                <Link
                  href={isSignUp ? '/signin' : '/signup'}
                  className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#111315] transition-colors hover:text-[#EF4444] cursor-pointer"
                >
                  {isSignUp ? 'Sign in' : 'Create account'}
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 pb-5 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#9AA0A8]">
          <span>© 2026 DevCanvas</span>
          <span className="hidden sm:inline">Encrypted session · Access node 01</span>
        </footer>
      </div>
    </div>
  );
}
