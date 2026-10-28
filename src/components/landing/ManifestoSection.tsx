'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MaskLine } from './KineticText';
import Marquee from './Marquee';
import { EASE_OUT } from './motion';

const PROOFS = [
  { index: '01', title: 'No forms', body: 'Your existing resume is the only input.' },
  { index: '02', title: 'No blank canvas', body: 'Every section arrives structured and editable.' },
  { index: '03', title: 'No code', body: 'Publish a real site without touching a repo.' },
];

export default function ManifestoSection({ onEnter }: { onEnter: () => void }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="models"
      className="relative isolate w-full overflow-hidden bg-[#231812] px-5 pb-20 pt-24 text-[#FBF9F6] sm:px-8 sm:pb-24 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-32"
    >
      <div aria-hidden="true" className="lc-grain lc-grain-dark pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(124,63,47,0.45),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="lc-grid-dark pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[52rem]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#EBC4A6]"
            >
              <span className="h-1.5 w-1.5 rotate-45 bg-[#EBC4A6]" />
              [05 // OUR PHILOSOPHY]
            </motion.div>

            <h2 className="mt-7 font-serif text-[clamp(2.2rem,5.2vw,4.4rem)] font-medium leading-[1.0] tracking-[-0.03em] text-[#FBF9F6]">
              <MaskLine delay={0.04}>Your portfolio should reflect</MaskLine>
              <MaskLine delay={0.12}>
                the work you <span className="text-[#EBC4A6] italic">actually</span> put in.
              </MaskLine>
            </h2>

            <MaskLine delay={0.22} className="mt-6">
              <span className="block max-w-[40rem] font-serif text-[clamp(1.15rem,2.1vw,1.6rem)] italic leading-[1.4] text-[#FBF9F6]/65">
                No tedious boilerplate. No blank canvas. Just a clear, structured website
                that lets your achievements speak for themselves.
              </span>
            </MaskLine>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.7, delay: 0.28, ease: EASE_OUT }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={onEnter}
                className="group inline-flex h-[52px] cursor-pointer items-center gap-3 rounded-full border border-[#EBC4A6]/40 bg-[#FBF9F6] px-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#231812] transition-all duration-300 hover:border-[#EBC4A6] hover:bg-[#EBC4A6]"
              >
                Start your canvas
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#FBF9F6]/40">
                Free to start · No card needed
              </span>
            </motion.div>
          </div>

          {/* Rotating seal */}
          <div className="relative hidden h-[168px] w-[168px] shrink-0 lg:block" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-[#FBF9F6]/12" />
            <div className="absolute inset-3 rounded-full border border-dashed border-[#FBF9F6]/12" />
            <div className={`absolute inset-0 ${reduce ? '' : 'lc-spin-slow'}`}>
              <svg viewBox="0 0 168 168" className="h-full w-full">
                <defs>
                  <path
                    id="manifesto-seal-path"
                    d="M84,84 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
                  />
                </defs>
                <text className="fill-[#EBC4A6]/70 font-mono text-[8.5px] uppercase tracking-[0.32em]">
                  <textPath href="#manifesto-seal-path">
                    YOUR STORY · YOUR CRAFT · YOUR CANVAS ·
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-serif text-[30px] italic leading-none text-[#FBF9F6]">Dc</span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-[#FBF9F6]/12 bg-[#FBF9F6]/12 sm:grid-cols-3">
          {PROOFS.map((proof, index) => (
            <motion.div
              key={proof.index}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_OUT }}
              className="group bg-[#231812] p-6 transition-colors duration-500 hover:bg-[#33231A] sm:p-7"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#EBC4A6]">
                  {proof.index}
                </span>
                <span className="h-px flex-1 bg-[#FBF9F6]/10 transition-colors duration-500 group-hover:bg-[#EBC4A6]/40" />
              </div>
              <p className="mt-5 font-serif text-[22px] leading-none text-[#FBF9F6]">{proof.title}</p>
              <p className="mt-2.5 font-sans text-[13px] leading-[1.6] text-[#FBF9F6]/55">
                {proof.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none mt-16 select-none border-y border-[#FBF9F6]/10 py-4">
        <Marquee
          items={['YOUR STORY', 'YOUR CRAFT', 'YOUR CANVAS', 'DEVCANVAS']}
          itemClassName="font-serif text-[clamp(2rem,5vw,3.6rem)] italic leading-none text-[#FBF9F6]/20"
          separator="✦"
          duration={38}
          reverse
        />
      </div>
    </section>
  );
}
