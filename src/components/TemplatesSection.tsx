'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const templates = [
  {
    id: "01",
    name: "Modern Developer",
    stack: ["TypeScript", "Next.js", "TailwindCSS"],
    link: "/templates/modern-developer"
  },
  {
    id: "02",
    name: "Developer Pro",
    stack: ["React", "TypeScript", "Framer Motion"],
    link: "/templates/software-engineer"
  }
];

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

export default function TemplatesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const sectionY = useSpring(useTransform(scrollY, [400, 1400], [80, -140]), { stiffness: 30, damping: 20 });
  const sectionOpacity = useTransform(scrollY, [400, 1000], [0.4, 1]);

  return (
    <motion.section
      ref={ref}
      className="py-20 md:py-32 bg-background border-b border-primary text-on-background font-sans bg-grid-paper relative"
      style={{ opacity: sectionOpacity }}
    >
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-8"
        style={{ y: sectionY }}
      >
        
        {/* Header */}
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={cardReveal} className="mb-16 border-b border-primary/30 pb-10">
          <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
            ✦ Selected Layouts
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                Templates designed <span className="italic font-normal">to feel bespoke.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-on-background/70 leading-relaxed">
                We custom-crafted each template with performance and clean code at the center. Clean motion, structural grids, and fully customizable source layouts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Templates Grid showcasing Dark Chocolate (#34281D) & Deep Brown (#3E1510) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templates.map((template, index) => {
            const isDarkChocolate = index === 0;
            return (
              <motion.div 
                key={template.id} 
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={cardReveal}
                className={`border ${isDarkChocolate ? 'border-[#3E1510] bg-[#34281D]' : 'border-[#270F05] bg-[#3E1510]'} rounded-sm p-8 text-[#FFFFFF] flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] shadow-xl`}
              >
                <div>
                  {/* Index tag */}
                  <div className={`flex justify-between items-center mb-6 font-mono text-xs ${isDarkChocolate ? 'text-[#A0674F] border-[#3E1510]' : 'text-[#7C3F2F] border-[#270F05]'} border-b pb-4`}>
                    <span className="font-semibold">LAYOUT CODE</span>
                    <span>[{template.id} / SLT]</span>
                  </div>
                  
                  {/* Heading */}
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-4 text-[#FFFFFF]">
                    {template.name}
                  </h3>
                </div>

                {/* Stack & Link */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {template.stack.map((s, idx) => (
                      <span key={idx} className="font-mono text-[9px] uppercase tracking-wider bg-[#270F05] text-[#CCC0B5] px-2 py-0.5 rounded-xs border border-[#3E1510]">
                        {s}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={template.link}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-[#56241A] text-[#FFFFFF] bg-[#56241A] hover:bg-[#7C3F2F] hover:border-[#7C3F2F] px-4 py-2.5 transition-all w-full justify-center shadow-md rounded-xs"
                  >
                    Live Preview 
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </motion.div>
    </motion.section>
  );
}
