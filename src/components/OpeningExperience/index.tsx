'use client';

import React, { useCallback, useEffect } from 'react';
import AxiomIntroPage from './AxiomIntroPage';

interface OpeningExperienceProps {
  onEnterMainSite?: () => void;
}

export default function OpeningExperience({ onEnterMainSite }: OpeningExperienceProps) {
  // Smooth scroll down to existing main website or trigger callback
  const handleEnterMainSite = useCallback(() => {
    if (onEnterMainSite) {
      onEnterMainSite();
      return;
    }
    const el = document.getElementById('existing-main-website');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onEnterMainSite]);

  // Escape key shortcut to jump to main site
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnterMainSite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnterMainSite]);

  return (
    <section className="relative w-full">
      <AxiomIntroPage onEnterMainSite={handleEnterMainSite} />
    </section>
  );
}
