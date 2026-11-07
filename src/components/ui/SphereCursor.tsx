"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Additive sphere cursor.
 *
 * The native pointer stays exactly where it is — this only adds a small,
 * glossy 3D orb that trails it with a soft spring. It grows over anything
 * clickable, shrinks over text fields, squashes with velocity, and rolls its
 * material as it travels. Disabled on touch/coarse pointers and for users who
 * prefer reduced motion.
 */

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "summary",
  "select",
  "label",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  "[data-cursor='hover']",
  "input[type='button']",
  "input[type='submit']",
  "input[type='checkbox']",
  "input[type='radio']",
  "input[type='range']",
  "input[type='file']",
  "input[type='color']",
].join(",");

const TEXT_SELECTOR = [
  "textarea",
  "[contenteditable='true']",
  "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']):not([type='range']):not([type='file']):not([type='color'])",
].join(",");

const FOLLOW_ORB = 0.24;
const FOLLOW_AURA = 0.11;
const ROLL_RADIUS = 13;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.matchMedia("(pointer: fine)").matches
  );
}

export default function SphereCursor() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const auraWrapRef = useRef<HTMLDivElement>(null);
  const orbWrapRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const root = rootRef.current;
    const auraWrap = auraWrapRef.current;
    const orbWrap = orbWrapRef.current;
    const squash = squashRef.current;
    const roll = rollRef.current;
    if (!root || !auraWrap || !orbWrap || !squash || !roll) return;
    if (!hasFinePointer()) return;

    const reduceMotion = prefersReducedMotion();

    let frame = 0;
    let lastTime = performance.now();
    let initialized = false;
    let visible = false;
    let rollAngle = 0;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orb = { ...target };
    const aura = { ...target };
    const previousOrb = { ...target };

    const show = () => {
      if (visible) return;
      visible = true;
      root.classList.add("is-visible");
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      root.classList.remove("is-visible");
      root.classList.remove("is-active", "is-text", "is-pressed");
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;

      if (!initialized) {
        initialized = true;
        orb.x = aura.x = previousOrb.x = target.x;
        orb.y = aura.y = previousOrb.y = target.y;
      }

      show();
    };

    const classify = (node: Element | null) => {
      const element = node?.closest?.(INTERACTIVE_SELECTOR) ?? null;
      if (element) {
        root.classList.add("is-active");
        root.classList.remove("is-text");
        return;
      }

      const text = node?.closest?.(TEXT_SELECTOR) ?? null;
      root.classList.toggle("is-text", Boolean(text));
      root.classList.remove("is-active");
    };

    const onPointerOver = (event: PointerEvent) => {
      classify(event.target instanceof Element ? event.target : null);
    };

    const onPointerDown = () => root.classList.add("is-pressed");
    const onPointerUp = () => root.classList.remove("is-pressed");
    const onLeave = () => hide();
    const onBlur = () => hide();

    const onVisibility = () => {
      if (document.hidden) hide();
    };

    const tick = (time: number) => {
      const delta = Math.min(48, time - lastTime) / 16.667;
      lastTime = time;

      const orbEase = reduceMotion ? 1 : 1 - Math.pow(1 - FOLLOW_ORB, delta);
      const auraEase = reduceMotion ? 1 : 1 - Math.pow(1 - FOLLOW_AURA, delta);

      previousOrb.x = orb.x;
      previousOrb.y = orb.y;

      orb.x += (target.x - orb.x) * orbEase;
      orb.y += (target.y - orb.y) * orbEase;
      aura.x += (target.x - aura.x) * auraEase;
      aura.y += (target.y - aura.y) * auraEase;

      const vx = orb.x - previousOrb.x;
      const vy = orb.y - previousOrb.y;
      const speed = Math.hypot(vx, vy);

      if (!reduceMotion && speed > 0.01) {
        const reach = Math.min(speed / 14, 1);
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
        const stretchX = 1 + reach * 0.2;
        const stretchY = 1 - reach * 0.16;

        squash.style.transform = `rotate(${angle}deg) scale(${stretchX}, ${stretchY}) rotate(${-angle}deg)`;

        rollAngle +=
          ((vx * 0.7 + vy * 0.35) / ROLL_RADIUS) * (180 / Math.PI);
        roll.style.transform = `rotate(${rollAngle}deg)`;
      } else if (!reduceMotion) {
        squash.style.transform = "rotate(0deg) scale(1, 1) rotate(0deg)";
      }

      orbWrap.style.transform = `translate3d(${orb.x}px, ${orb.y}px, 0)`;
      auraWrap.style.transform = `translate3d(${aura.x}px, ${aura.y}px, 0)`;

      frame = requestAnimationFrame(tick);
    };

    // The pointer can start moving before the first frame is scheduled.
    auraWrap.style.transform = "translate3d(-100px, -100px, 0)";
    orbWrap.style.transform = "translate3d(-100px, -100px, 0)";

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  if (pathname !== "/") {
    return null;
  }

  return (
    <div ref={rootRef} className="sphere-cursor" aria-hidden="true">
      <div ref={auraWrapRef} className="sphere-cursor__aura-wrap">
        <span className="sphere-cursor__aura" />
        <span className="sphere-cursor__aura-core" />
      </div>

      <div ref={orbWrapRef} className="sphere-cursor__wrap">
        <span className="sphere-cursor__shadow" />
        <span className="sphere-cursor__ring" />

        <div ref={squashRef} className="sphere-cursor__squash">
          <div className="sphere-cursor__ball">
            <span ref={rollRef} className="sphere-cursor__roll" />
            <span className="sphere-cursor__shade" />
            <span className="sphere-cursor__rim" />
            <span className="sphere-cursor__spec" />
            <span className="sphere-cursor__spark" />
          </div>
        </div>
      </div>
    </div>
  );
}
