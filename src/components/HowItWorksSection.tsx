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

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const sectionY = useSpring(useTransform(scrollY, [300, 1200], [80, -120]), { stiffness: 30, damping: 20 });
  const sectionOpacity = useTransform(scrollY, [300, 900], [0.4, 1]);

  return (
    <motion.section
      ref={ref}
      className="py-20 md:py-32 bg-[#3E1510] border-b border-[#270F05] text-[#FFFFFF] font-sans relative"
      style={{ opacity: sectionOpacity }}
    >
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-8"
        style={{ y: sectionY }}
      >
        
        {/* Header */}
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={cardReveal} className="mb-16 text-center max-w-2xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-widest text-[#A0674F] mb-6">
            ✦ Simple Workflow
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight tracking-tight mb-4 text-[#FFFFFF]">
            Raw details in. <span className="italic font-normal text-[#CCC0B5]">Premium portfolio out.</span>
          </h2>
          <p className="text-sm md:text-base text-[#CCC0B5]/90">
            Four simple steps. No complex layouts to configure. We transform your raw engineering data into a stunning, responsive portfolio.
          </p>
        </motion.div>

        {/* 4-column border-boxed grid showcasing Deep Brown (#3E1510) and Very Dark Brown (#270F05) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#34281D]">
          {/* Step 1 */}
          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={cardReveal} className="p-8 border-r border-b border-[#34281D] bg-[#270F05] hover:bg-[#34281D] transition-colors flex flex-col justify-between min-h-[220px] shadow-md">
            <div>
              <div className="font-mono text-xs text-[#A0674F] mb-6 font-semibold">[01 / INPUT]</div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-[#FFFFFF]">Dump raw details</h3>
              <p className="text-xs text-[#CCC0B5] leading-relaxed">
                Paste your resume, share your GitHub link, or draft bullet points. No formatting necessary.
              </p>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={cardReveal} className="p-8 border-r border-b border-[#34281D] bg-[#270F05] hover:bg-[#34281D] transition-colors flex flex-col justify-between min-h-[220px] shadow-md">
            <div>
              <div className="font-mono text-xs text-[#A0674F] mb-6 font-semibold">[02 / REWRITE]</div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-[#FFFFFF]">AI formats & polishes</h3>
              <p className="text-xs text-[#CCC0B5] leading-relaxed">
                We restructure your projects, calculate metrics, and write descriptions. You maintain complete edit control.
              </p>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={cardReveal} className="p-8 border-r border-b border-[#34281D] bg-[#270F05] hover:bg-[#34281D] transition-colors flex flex-col justify-between min-h-[220px] shadow-md">
            <div>
              <div className="font-mono text-xs text-[#A0674F] mb-6 font-semibold">[03 / THEME]</div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-[#FFFFFF]">Select a template</h3>
              <p className="text-xs text-[#CCC0B5] leading-relaxed">
                Pick a template built with premium animations (GSAP, Framer Motion) and fully clean code.
              </p>
            </div>
          </motion.div>
          
          {/* Step 4 */}
          <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={cardReveal} className="p-8 border-r border-b border-[#34281D] bg-[#270F05] hover:bg-[#34281D] transition-colors flex flex-col justify-between min-h-[220px] shadow-md">
            <div>
              <div className="font-mono text-xs text-[#A0674F] mb-6 font-semibold">[04 / DEPLOY]</div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-[#FFFFFF]">Export or Deploy</h3>
              <p className="text-xs text-[#CCC0B5] leading-relaxed">
                Deploy directly to Vercel/Netlify with one click, or export clean code to host anywhere.
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </motion.section>
  );
}
