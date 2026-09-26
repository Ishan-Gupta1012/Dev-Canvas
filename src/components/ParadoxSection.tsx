'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

const cardReveal = {
  hidden: { opacity: 0, y: 80, scale: 0.95, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.12,
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function ParadoxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const sectionY = useSpring(useTransform(scrollY, [200, 1000], [60, -100]), { stiffness: 30, damping: 20 });
  const sectionOpacity = useTransform(scrollY, [200, 700], [0.4, 1]);

  return (
    <motion.section
      ref={ref}
      className="py-20 md:py-32 bg-[#F7F4EF] border-b border-[#111111] text-[#111111] font-sans bg-grid-paper relative"
      style={{ opacity: sectionOpacity }}
    >
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-8"
        style={{ y: sectionY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column (Bento Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Box 1: Title Box */}
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={cardReveal} className="border border-[#111111] p-8 bg-[#F7F4EF] rounded-sm flex flex-col justify-center flex-1 min-h-[220px]">
              <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
                ✦ The Dilemma
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
                We all want a perfect portfolio.<br />
                <span className="italic font-normal text-stroke">Few of us ever ship one.</span>
              </h2>
            </motion.div>
            
            {/* Box 2: Detail Box (Bento Box in bottom left) */}
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={cardReveal} className="border border-[#111111] p-8 bg-[#F7F4EF] rounded-sm min-h-[140px] flex flex-col justify-center">
              <div className="font-mono text-xs text-[#111111]/40 mb-4">[00 / The Conflict]</div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">Building takes a back seat</h3>
              <p className="text-xs sm:text-sm text-[#111111]/85 leading-relaxed">
                Between coding, preparing for technical interviews, and your daily tasks, building a personal website from scratch is often pushed to the back burner.
              </p>
            </motion.div>
          </div>

          {/* Right Column (Bento Cards) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Box 3 */}
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={cardReveal} className="border border-[#111111] p-8 bg-[#F7F4EF] rounded-sm transition-all hover:bg-[#111111]/5 flex-1">
              <div className="font-mono text-xs text-[#111111]/40 mb-4">[01 / Time Constraint]</div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">Time is the bottleneck</h3>
              <p className="text-xs sm:text-sm text-[#111111]/85 leading-relaxed">
                Setting up Next.js configuration, styling layouts, and polishing responsive frames takes hours of micro-adjustments you don&apos;t have.
              </p>
            </motion.div>
            
            {/* Box 4 */}
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={cardReveal} className="border border-[#111111] p-8 bg-[#F7F4EF] rounded-sm transition-all hover:bg-[#111111]/5 flex-1">
              <div className="font-mono text-xs text-[#111111]/40 mb-4">[02 / Copywriting Struggle]</div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">Writing about yourself is hard</h3>
              <p className="text-xs sm:text-sm text-[#111111]/85 leading-relaxed">
                Converting technical work experience and repository statistics into clean, readable highlights requires a completely different muscle.
              </p>
            </motion.div>
            
            {/* Box 5 */}
            <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={cardReveal} className="border border-[#111111] p-8 bg-[#F7F4EF] rounded-sm transition-all hover:bg-[#111111]/5 flex-1">
              <div className="font-mono text-xs text-[#111111]/40 mb-4">[03 / Generic Look]</div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">Template generators feel generic</h3>
              <p className="text-xs sm:text-sm text-[#111111]/85 leading-relaxed">
                Most template builders scream &ldquo;generic builder&rdquo;. Developers want premium, unique, hand-crafted code they&apos;re proud to link.
              </p>
            </motion.div>
            
          </div>
          
        </div>
      </motion.div>
    </motion.section>
  );
}
