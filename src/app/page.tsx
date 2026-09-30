'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RechromaPreloader from "@/components/RechromaPreloader";
import PortalIntroPage from "@/components/OpeningExperience/PortalIntroPage";
import { shouldSkipIntro } from "@/lib/intro-entry";

const FADE_MS = 550;
// The preloader owns Escape until it has dissolved
const PRELOADER_MS = 3200;
// The intro stays dimmed until the preloader panel starts lifting away
const REVEAL_DELAY_MS = 1750;
const REVEAL_MS = 1100;

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showPreloader, setShowPreloader] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const isLeavingRef = useRef(false);
  const isPreloaderDoneRef = useRef(false);
  const skipPreloaderRef = useRef<boolean | null>(null);

  // An authenticated visitor never belongs on the landing page. Send them
  // straight to the dashboard.
  useEffect(() => {
    if (isLoading || !user) return;
    router.replace("/dashboard");
  }, [isLoading, user, router]);

  // The preloader only belongs to a fresh landing load, never to a return from
  // the access gateway. It also waits for the session check to settle and stays
  // off entirely for an authenticated visitor, so the redirect above never
  // paints it. No skip is parked here, otherwise it would leak into the next
  // genuine landing visit and swallow that visitor's preloader.
  useEffect(() => {
    if (isLoading || user) return;
    if (skipPreloaderRef.current === null) {
      skipPreloaderRef.current = shouldSkipIntro();
    }
    const frame = window.requestAnimationFrame(() => {
      if (skipPreloaderRef.current) {
        isPreloaderDoneRef.current = true;
        setIsVisible(true);
      }
      setShowPreloader(!skipPreloaderRef.current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isLoading, user]);

  useEffect(() => {
    if (showPreloader !== true) return;
    const timer = window.setTimeout(() => setIsVisible(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [showPreloader]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      isPreloaderDoneRef.current = true;
    }, PRELOADER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Entering the main website fades the intro out, then sends authed users to the
  // dashboard and everyone else to sign in
  const handleEnterMainSite = useCallback(() => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    setIsLeaving(true);
    window.setTimeout(() => {
      router.push(user ? "/dashboard" : "/signin");
    }, FADE_MS);
  }, [router, user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreloaderDoneRef.current) {
        handleEnterMainSite();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnterMainSite]);

  return (
    <div className="relative bg-background text-on-background min-h-screen flex flex-col custom-cursor font-sans">
      {showPreloader === true && <RechromaPreloader />}

      <div
        className="transition-opacity ease-out motion-reduce:transition-none"
        style={{
          opacity: isVisible && !isLeaving ? 1 : 0,
          transitionDuration: isVisible && !isLeaving ? `${REVEAL_MS}ms` : `${FADE_MS}ms`,
        }}
      >
        <PortalIntroPage onEnterMainSite={handleEnterMainSite} />
      </div>
    </div>
  );
}
