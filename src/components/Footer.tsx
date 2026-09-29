'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Footer() {
  const { scrollY } = useScroll();

  const footerY = useTransform(scrollY, [600, 1800], [80, -120]);
  const footerOpacity = useTransform(scrollY, [600, 1200], [0.5, 1]);

  return (
    <motion.footer
      className="bg-[#34281D] border-t border-[#3E1510] font-sans relative"
      style={{ y: footerY, opacity: footerOpacity }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-[#CCC0B5]/75">
        <div className="flex gap-8 md:gap-12">
          <Link href="/" className="hover:text-[#FFFFFF] transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">
            About
          </Link>
        </div>
        <div>
          © 2026 PAAS. All Rights Reserved.
        </div>
      </div>
    </motion.footer>
  );
}
