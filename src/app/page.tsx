'use client';

import { useState, useCallback, useEffect } from "react";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import ParadoxSection from "@/components/ParadoxSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TemplatesSection from "@/components/TemplatesSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import LandingRedirect from "@/components/LandingRedirect";
import { ScrollProgress } from "@/components/ScrollProgress";
import RechromaPreloader from "@/components/RechromaPreloader";
import AxiomIntroPage from "@/components/OpeningExperience/AxiomIntroPage";

export default function Home() {
  const [showMainSite, setShowMainSite] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition to main website
  const handleEnterMainSite = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMainSite(true);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 400);
  }, []);

  // Return to introductory Axiom experience
  const handleReturnToIntro = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMainSite(false);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 400);
  }, []);

  // Escape key shortcut to toggle / enter main site
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showMainSite) {
        handleEnterMainSite();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMainSite, handleEnterMainSite]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col custom-cursor font-sans">
      <RechromaPreloader />
      <LandingRedirect />

      {!showMainSite ? (
        <div
          className="relative w-full transition-opacity duration-400 ease-out"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <AxiomIntroPage onEnterMainSite={handleEnterMainSite} />
        </div>
      ) : (
        <div
          id="existing-main-website"
          className="relative w-full transition-opacity duration-400 ease-out"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <ScrollProgress />
          
          {/* Floating pill to return to Axiom opening experience */}
          <button
            onClick={handleReturnToIntro}
            className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEEBE7]/95 backdrop-blur-md border border-[#56241A]/40 text-[#56241A] hover:text-[#FFFFFF] hover:border-[#7C3F2F] hover:bg-[#56241A] text-[11px] font-mono tracking-widest uppercase shadow-2xl transition-all duration-200 hover:scale-105 cursor-pointer group"
            title="Return to Axiom Introductory Experience"
            aria-label="Return to Axiom Introductory Experience"
          >
            <span className="w-2 h-2 rounded-full bg-[#56241A] group-hover:bg-[#FFFFFF] animate-pulse" />
            <span>AXIOM INTRO</span>
          </button>

          {/* Existing Website Components - Preserved exactly as originally constructed */}
          <Hero />
          <TechMarquee />
          <ParadoxSection />
          <HowItWorksSection />
          <TemplatesSection />
          <CtaSection />
          <Footer />
        </div>
      )}
    </div>
  );
}
