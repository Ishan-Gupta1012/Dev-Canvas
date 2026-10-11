'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageVeil() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!isTransitioning) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300 ease-out"
      style={{
        opacity: isTransitioning ? 0.08 : 0,
        background: 'radial-gradient(circle at 50% 30%, #56241A 0%, #34281D 70%, transparent 100%)',
        backdropFilter: 'blur(2px)',
      }}
    />
  );
}
