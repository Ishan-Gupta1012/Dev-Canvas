'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';

const contentReveal = {
  hidden: { opacity: 0, y: 80, scale: 0.97, filter: 'blur(6px)' },
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

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const sectionY = useSpring(useTransform(scrollY, [500, 1600], [100, -160]), { stiffness: 30, damping: 20 });
  const sectionOpacity = useTransform(scrollY, [500, 1100], [0.4, 1]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formName: 'CTA Early Queue Signup',
          subject: `Early Queue Signup: ${email}`
        })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <motion.section
      ref={ref}
      className="py-20 md:py-32 bg-background border-b border-primary text-on-background font-sans bg-grid-paper select-none relative"
      style={{ opacity: sectionOpacity }}
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-8 text-center"
        style={{ y: sectionY }}
      >
        
        {/* Tag */}
        <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={contentReveal} className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
          ✦ Get in Touch
        </motion.div>

        {/* Heading */}
        <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={contentReveal}>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-8">
            Let&apos;s build something <span className="italic font-normal">thoughtful together.</span>
          </h2>
          
          {/* Description */}
          <p className="text-sm md:text-base text-on-background/70 leading-relaxed mb-12 max-w-[600px] mx-auto">
            We&apos;re launching soon. Join our early queue to preview templates, influence the design roadmap, and deploy your custom layout.
          </p>
        </motion.div>

        {/* Clean Input Form */}
        <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={contentReveal} className="max-w-[450px] mx-auto mb-16">
          {status === 'success' ? (
            <div className="border border-primary p-4 bg-background font-mono text-xs text-green-600">
              [SUCCESSFULLY JOINED THE QUEUE]
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 border border-primary p-1.5 bg-background rounded-sm">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email address..." 
                className="flex-1 bg-transparent text-sm text-on-background px-4 py-3 outline-hidden font-mono"
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-primary text-on-primary hover:bg-primary/85 transition-colors px-6 py-3 font-mono text-xs uppercase tracking-widest rounded-sm disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join Queue'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="mt-2 font-mono text-xs text-red-600">
              [ERROR: Failed to join queue. Please try again.]
            </div>
          )}
        </motion.div>

        {/* Grid Questions */}
        <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={contentReveal} className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-primary">
          <div className="p-6 border-r border-b border-primary bg-background/50">
            <div className="font-mono text-[9px] text-on-background/40 mb-3">[QA.01]</div>
            <p className="text-xs text-on-background/80 leading-relaxed">Do you want a portfolio that evolves with your craft?</p>
          </div>
          <div className="p-6 border-r border-b border-primary bg-background/50">
            <div className="font-mono text-[9px] text-on-background/40 mb-3">[QA.02]</div>
            <p className="text-xs text-on-background/80 leading-relaxed">Would a premium UI help highlight your best work?</p>
          </div>
          <div className="p-6 border-r border-b border-primary bg-background/50">
            <div className="font-mono text-[9px] text-on-background/40 mb-3">[QA.03]</div>
            <p className="text-xs text-on-background/80 leading-relaxed">Do you want full control over your exported static bundle?</p>
          </div>
        </motion.div>

      </motion.div>
    </motion.section>
  );
}
