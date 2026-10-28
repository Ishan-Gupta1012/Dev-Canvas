'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import IdentityCore from '@/components/identity/IdentityCore';
import { EASE_OUT } from '@/components/landing/motion';

/**
 * Scene 7 — the final state: the same Identity Core from the hero,
 * now complete and organized, with a clear call to action.
 */
export default function FinaleScene() {
  const { user } = useAuth();
  const router = useRouter();
  const reduce = useReducedMotion() ?? false;

  const handleGetStarted = () => router.push(user ? '/dashboard' : '/signin');

  return (
    <section id="finale" className="relative py-24 lg:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 820px 620px at 50% 58%, rgba(212, 166, 92, 0.2) 0%, transparent 68%), radial-gradient(ellipse 700px 420px at 50% 8%, rgba(176, 132, 72, 0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Copy */}
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: reduce ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm font-mono tracking-widest text-[#A9762F] font-semibold">07</span>
            <span className="text-sm font-mono text-[#93795B]">/</span>
            <span className="text-sm font-mono text-[#93795B]">07</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#35261E] leading-[1.12] mb-6"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            You Had the Potential.
            <br />
            <span className="text-[#A9762F]">Now the World Can See It.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6B5138] leading-relaxed">
            Your skills, projects, and experience — organized into one identity,
            one resume, one portfolio. You keep growing. Your portfolio should
            too.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#C08B3E] hover:bg-[#D4A257] text-[#3A2716] font-semibold text-sm tracking-wide shadow-[0_8px_24px_rgba(176,128,63,0.32)] hover:shadow-[0_10px_28px_rgba(176,128,63,0.42)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span>Build My Identity</span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3.5 rounded-full bg-[rgba(252,244,229,0.8)] hover:bg-[rgba(244,229,204,0.9)] border border-[rgba(163,118,56,0.28)] text-[#3A2716] font-medium text-sm backdrop-blur-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* The complete Identity Core — a callback to the hero */}
        <motion.div
          className="mt-14 lg:mt-20 flex justify-center"
          initial={{ opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
        >
          <div className="origin-center scale-[0.88] sm:scale-95 lg:scale-100">
            <IdentityCore includeNewProject reduce={reduce} />
          </div>
        </motion.div>

        {/* Stepper */}
        <motion.div
          className="mt-12 lg:mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex items-center gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7].map((step) =>
              step === 7 ? (
                <div
                  key={step}
                  className="h-1.5 w-14 rounded-full bg-[#C08B3E] shadow-[0_2px_10px_rgba(192,139,62,0.45)]"
                />
              ) : (
                <div key={step} className="h-1.5 w-7 rounded-full bg-[rgba(122,88,48,0.16)]" />
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
