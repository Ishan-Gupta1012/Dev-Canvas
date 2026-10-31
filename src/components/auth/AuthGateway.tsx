'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GenerativeAttractorCanvas from '@/components/OpeningExperience/GenerativeAttractorCanvas';
import { skipIntroOnNextLanding } from '@/lib/intro-entry';
import { ArrowLeft, Loader2, Mail, Lock, RotateCcw, Globe } from 'lucide-react';
import { motion, circOut } from 'framer-motion';

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

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        setMessage({
          tone: 'sent',
          text: 'Account created! Redirecting to dashboard...',
        });
      } else {
        await signInWithPassword(email.trim(), password);
      }
      setPassword('');
      setIsSubmitting(false);
    } catch (error: unknown) {
      setIsSubmitting(false);
      const reason = error instanceof Error ? error.message : '';

      console.error('AuthGateway caught error:', error, 'reason:', reason);

      if (reason.startsWith('ACCOUNT_EXISTS:')) {
        const userMessage = reason.split('ACCOUNT_EXISTS:')[1];
        setMessage({ tone: 'error', text: userMessage });
      } else if (reason.startsWith('EMAIL_NOT_CONFIRMED:')) {
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
      <div className="relative min-h-screen bg-[#F7EFE2] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#A65A3A] animate-spin" aria-label="Checking session" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F7EFE2] text-[#35261E] font-sans flex flex-col overflow-x-hidden selection:bg-[#C9875B]/30 selection:text-[#1A1005]">
      {/* Animated glow orbs layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#D6A15F]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#C9875B]/25 rounded-full blur-[140px] animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-[#8A5A2B]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -top-[5%] left-[35%] w-[20vw] h-[20vw] bg-[#A65A3A]/15 rounded-full blur-[80px] animate-[spin_10s_linear_infinite]" />
      </div>

      {/* Full-bleed attractor canvas on left half */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 55%)', maskImage: 'linear-gradient(to right, transparent 0%, #000 55%)' }}>
        <GenerativeAttractorCanvas mode="static" palette="copper" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            type="button"
            className="inline-flex items-center gap-2 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.2em] text-[#4A3421] hover:text-[#8A5A2B] transition-colors group cursor-pointer"
          >
            <motion.div whileHover={{ x: -2 }} className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true">
              <ArrowLeft />
            </motion.div>
            <span>Back</span>
          </motion.button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8A5A2B] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#35261E] font-bold">
              DevCanvas // Access
            </span>
          </div>
        </header>

        {/* Main content - split layout */}
        <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1440px] mx-auto px-5 sm:px-10 py-6 sm:py-8 lg:py-0 lg:px-14 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: circOut, delay: 0.2 }}
            className="w-full max-w-[480px] border border-[#E3D3BE]/60 bg-[#F7EFE2]/80 backdrop-blur-md rounded-[24px] px-6 sm:px-9 py-10 sm:py-12 lg:py-14 flex flex-col gap-6 lg:gap-7 shadow-[0_40px_80px_-20px_rgba(10,4,2,0.35)]"
          >
            {/* Left: Dramatic headline brand block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: circOut, delay: 0.1 }}
              className="flex flex-col gap-4 mb-2"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: circOut, delay: 0.15 }}
                className="inline-block px-3 py-1 bg-[#C9875B]/10 border border-[#C9875B]/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A5A2B] mb-1"
              >
                Clearance Required
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: circOut, delay: 0.2 }}
                className="font-serif text-[40px] sm:text-[52px] lg:text-[56px] leading-[0.9] tracking-[-2px] text-[#35261E] mb-2"
              >
                {isSignUp ? (
                  <>
                    <span className="block text-[#35261E]">Claim your</span>
                    <span className="block text-[#A65A3A]">workspace.</span>
                  </>
                ) : (
                  <>
                    <span className="block text-[#35261E]">Welcome back.</span>
                    <span className="block text-[#A65A3A]">Continue building.</span>
                  </>
                )}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: circOut, delay: 0.3 }}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#4A3421]/70 leading-[1.6]"
              >
                {isSignUp
                  ? 'Create your portfolio identity and start assembling your story.'
                  : 'Sign in to access your projects, resume data, and published portfolios.'}
              </motion.p>
            </motion.div>

            {/* Status message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="status"
                aria-live="polite"
                className={`border px-5 py-4 font-mono text-[12px] uppercase leading-[1.6] rounded-xl ${
                  message.tone === 'sent'
                    ? 'border-[#8A5A2B]/40 bg-[#8A5A2B]/15 text-[#4A3421] shadow-[0_0_20px_rgba(138,90,43,0.15)]'
                    : 'border-[#D35724]/50 bg-[#D35724]/15 text-[#8A3A15] shadow-[0_0_20px_rgba(211,87,36,0.15)]'
                }`}
              >
                {message?.text}
              </motion.div>
            )}

            {emailNotConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                aria-live="polite"
                className="border border-[#D35724]/50 bg-[#D35724]/15 px-5 py-4 font-mono text-[12px] uppercase leading-[1.6] rounded-xl text-[#8A3A15] shadow-[0_0_20px_rgba(211,87,36,0.15)]"
              >
                Please confirm your email address before signing in. Check your inbox for the confirmation link.
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: circOut, delay: 0.4 }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#4A3421]/80 block mb-1">
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
                    className="h-12 w-full px-4 bg-[#FDF8EF]/60 border border-[#E3D3BE]/50 text-[#35261E] placeholder:text-[#A65A3A] font-mono text-[13px] outline-none transition-all duration-200 focus:border-[#8A5A2B] focus-visible:ring-2 focus-visible:ring-[#A65A3A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7EFE2] rounded-xl"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: circOut, delay: 0.45 }}
                className="flex flex-col gap-2"
              >
                <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#4A3421]/80 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#8A5A2B]/60" aria-hidden="true" />
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A5A2B] pointer-events-none transition-colors group-focus-within:text-[#C9875B]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full pl-12 pr-4 bg-[#FDF8EF]/60 border border-[#E3D3BE]/50 text-[#35261E] placeholder:text-[#A65A3A] font-mono text-[13px] outline-none transition-all duration-200 focus:border-[#8A5A2B] focus-visible:ring-2 focus-visible:ring-[#A65A3A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7EFE2] rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: circOut, delay: 0.5 }}
                className="flex flex-col gap-2"
              >
                <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#4A3421]/80 block mb-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#8A5A2B]/60" aria-hidden="true" />
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A5A2B] pointer-events-none transition-colors group-focus-within:text-[#C9875B]"
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
                    className="h-12 w-full pl-12 pr-4 bg-[#FDF8EF]/60 border border-[#E3D3BE]/50 text-[#35261E] placeholder:text-[#A65A3A] font-mono text-[13px] outline-none transition-all duration-200 focus:border-[#8A5A2B] focus-visible:ring-2 focus-visible:ring-[#A65A3A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7EFE2] rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                type="submit"
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="h-12 w-full inline-flex items-center justify-center gap-2.5 bg-[#8A5A2B] hover:bg-[#A65A3A] disabled:bg-[#A65A3A]/40 text-[#FFFFFF] border border-[#4A3421]/40 font-mono text-[11px] uppercase tracking-[0.22em] font-bold transition-all duration-200 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_30px_rgba(138,90,43,0.25)] hover:shadow-[0_0_40px_rgba(138,90,43,0.35)] rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Working</span>
                  </>
                ) : isSignUp ? (
                  <>
                    <Globe size={16} />
                    <span>Create account</span>
                  </>
                ) : (
                  <>
                    <Globe size={16} />
                    <span>Sign in</span>
                  </>
                )}
              </motion.button>
            </form>

            {!isSignUp && emailNotConfirmed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResendConfirmation}
                disabled={isSubmitting}
                type="button"
                initial="hidden"
                animate="visible"
                className="h-11 w-full inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#EDE1CF] disabled:bg-[#EDE1CF]/30 text-[#4A3421] border border-[#E3D3BE]/40 font-mono text-[10px] uppercase tracking-[0.22em] transition-all duration-200 disabled:cursor-not-allowed cursor-pointer rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} />
                    Resend confirmation email
                  </>
                )}
              </motion.button>
            )}

            <div className="mt-8 flex items-center gap-4" aria-hidden="true">
              <span className="h-[1px] flex-1 bg-[#E3D3BE]/40" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8A5A3A]/60">or continue with</span>
              <span className="h-[1px] flex-1 bg-[#E3D3BE]/40" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {PROVIDERS.map(({ id, label, mark }) => (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  key={id}
                  type="button"
                  onClick={() => handleProvider(id)}
                  aria-label={`Continue with ${label}`}
                  className="group h-12 w-full flex items-center justify-center gap-2.5 px-3 border border-[#E3D3BE]/50 bg-[#FDF8EF]/40 hover:border-[#8A5A2B] hover:bg-[#F7EFE2] transition-all duration-200 cursor-pointer rounded-xl"
                >
                  {mark}
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#35261E]/90 group-hover:text-[#8A5A2B] transition-colors">
                    {label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#E3D3BE]/30 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#4A3421]/60">
                {isSignUp ? 'Already have an account?' : 'No account yet?'}
              </p>
              <Link
                href={isSignUp ? '/signin' : '/signup'}
                className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#8A5A2B] hover:text-[#A65A3A] transition-colors cursor-pointer"
              >
                {isSignUp ? 'Sign in' : 'Create account'}
                <motion.span whileHover={{ x: 4 }} className="transition-transform" aria-hidden="true">
                  →
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="relative z-10 hidden lg:flex w-full max-w-[1440px] mx-auto px-5 sm:px-10 pb-5 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#4A3421]/40">
          <span>© 2026 DevCanvas</span>
          <span>Clearance required</span>
        </footer>
      </div>
    </div>
  );
}
