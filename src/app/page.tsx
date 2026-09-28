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

export default function Home() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col custom-cursor font-sans">
      <RechromaPreloader />
      <ScrollProgress />
      <LandingRedirect />
      <Hero />
      <TechMarquee />
      <ParadoxSection />
      <HowItWorksSection />
      <TemplatesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
