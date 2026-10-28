'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/OpeningExperience/Reveal';
import { MaskLine } from './KineticText';
import { EASE_OUT } from './motion';

const FAQS = [
  {
    question: 'Do I have to rebuild my resume for this?',
    answer:
      'No. Upload the PDF or DOCX you already send to recruiters. DevCanvas is designed around the document you maintain, not a new set of forms.',
  },
  {
    question: 'What exactly gets extracted?',
    answer:
      'Your profile, education, technical skills, projects, work history, and achievements are read into structured sections. Anything the parser misses stays editable.',
  },
  {
    question: 'Can I edit what the parser reads?',
    answer:
      'Yes. Every field, section, and ordering decision is editable. The import is a starting point, not a locked result.',
  },
  {
    question: 'Can I change the design later?',
    answer:
      'Templates and colour themes are applied on top of your content. Switch them at any time without re-entering a single line.',
  },
  {
    question: 'Does it work on phones?',
    answer:
      'Every template is built mobile-first and tested from 375px upward. Your public link is responsive by default.',
  },
  {
    question: 'Can I use my own domain?',
    answer:
      'Yes. Publish on your DevCanvas link first, then connect a custom domain whenever you are ready.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section
      id="faq"
      className="relative isolate w-full overflow-hidden bg-[#FAF7F3] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
    >
      <div aria-hidden="true" className="lc-grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#4A2F1F]">
                <span className="h-1.5 w-1.5 rotate-45 bg-[#6F4A34]" />
                [06 // QUESTIONS]
              </div>
            </Reveal>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[1.03] tracking-[-0.03em] text-[#1E1611]">
              <MaskLine delay={0.04}>The short</MaskLine>
              <MaskLine delay={0.12}>
                <span className="lc-ink-gradient italic">answers.</span>
              </MaskLine>
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-[24rem] font-sans text-[14px] leading-[1.7] text-[#3A2C22]/80">
                Still curious about something? Write to us at{' '}
                <Link
                  href="/contact"
                  className="font-medium text-[#4A2F1F] underline decoration-[#4A2F1F]/30 underline-offset-4 transition-colors hover:decoration-[#4A2F1F]"
                >
                  our contact page
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="border-t border-[#3A2418]/15">
            {FAQS.map((item, index) => {
              const isOpen = open === index;
              return (
                <Reveal key={item.question} delay={index * 0.03}>
                  <div className="border-b border-[#3A2418]/15">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-trigger-${index}`}
                        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[#4A2F1F] sm:py-6"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-[#B4552D]">
                            0{index + 1}
                          </span>
                          <span className="font-serif text-[clamp(1.05rem,2vw,1.35rem)] font-medium leading-snug text-[#1E1611] transition-colors group-hover:text-[#4A2F1F]">
                            {item.question}
                          </span>
                        </span>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                            isOpen
                              ? 'border-[#4A2F1F] bg-[#4A2F1F] text-[#FBF9F6]'
                              : 'border-[#3A2418]/20 text-[#4A2F1F] group-hover:border-[#4A2F1F]/50'
                          }`}
                        >
                          {isOpen ? <Minus size={13} strokeWidth={1.8} /> : <Plus size={13} strokeWidth={1.8} />}
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${index}`}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: EASE_OUT }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[38rem] pb-6 pl-[2.1rem] pr-10 font-sans text-[13.5px] leading-[1.75] text-[#3A2C22]/80">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
