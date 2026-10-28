"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import StoryStage from "./StoryStage";
import StoryStack from "./StoryStack";
import { FinaleSection, ProcessSection, UpdateSection } from "./StorySections";
import "./story.css";
import "./portfolio.css";

interface StoryLandingProps {
  onEnter: () => void;
}

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#process" },
  { label: "Work", href: "/works" },
];

export default function StoryLanding({ onEnter }: StoryLandingProps) {
  const reduceMotion = useReducedMotion();
  const reduce = reduceMotion ?? false;
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setIsDesktop(mql.matches);
      if (mql.matches) setMenuOpen(false);
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const scrollToId = useCallback(
    (id: string) => {
      setMenuOpen(false);
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduce],
  );

  const scrollToProcess = useCallback(() => {
    scrollToId("process");
  }, [scrollToId]);

  const enter = useCallback(() => {
    setMenuOpen(false);
    onEnter();
  }, [onEnter]);

  const scrollToTop = useCallback(() => {
    scrollToId("top");
  }, [scrollToId]);

  const usePinnedStage = isDesktop && !reduce;

  return (
    <div className="story-root" id="top" data-reduced={reduce ? "true" : "false"}>
      <a href="#main" className="story-skip">
        Skip to content
      </a>

      <header className={`story-nav ${scrolled ? "is-scrolled" : ""}`}>
        <button
          type="button"
          className="story-logo"
          onClick={scrollToTop}
          aria-label="DevCanvas — back to top"
        >
          <span className="story-logo-mark" aria-hidden="true">
            Po
          </span>
          <span className="story-logo-word">DevCanvas</span>
        </button>

        <nav className="story-nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("#") ? (
              <button
                key={link.label}
                type="button"
                className="story-nav-link"
                onClick={() => scrollToId(link.href.slice(1))}
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.label} href={link.href} className="story-nav-link">
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="story-nav-actions">
          <Link href="/signin" className="story-nav-signin">
            Log In
          </Link>
          <button type="button" className="story-nav-cta" onClick={enter}>
            Get Started
          </button>
          <button
            type="button"
            className="story-menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="story-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
          </button>
        </div>

        {menuOpen && (
          <div className="story-mobile-menu" id="story-mobile-menu">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToId(link.href.slice(1))}
                >
                  {link.label}
                  <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
                </button>
              ) : (
                <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                  <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
                </Link>
              ),
            )}
            <Link href="/signin" onClick={() => setMenuOpen(false)}>
              Log In
              <ArrowUpRight size={13} strokeWidth={1.7} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="story-btn story-btn--primary"
              onClick={enter}
              style={{ justifyContent: "space-between" }}
            >
              Get Started
              <span className="btn-arrow" aria-hidden="true">
                <ArrowUpRight size={12} strokeWidth={1.8} />
              </span>
            </button>
          </div>
        )}
      </header>

      <main id="main">
        {usePinnedStage ? (
          <StoryStage onEnter={enter} onSeeProcess={scrollToProcess} />
        ) : (
          <StoryStack onEnter={enter} onSeeProcess={scrollToProcess} />
        )}

        <ProcessSection onEnter={enter} />
        <UpdateSection onEnter={enter} />
        <FinaleSection onEnter={enter} stack={!usePinnedStage} />
      </main>
    </div>
  );
}
