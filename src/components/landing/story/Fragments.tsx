"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import {
  Award,
  BriefcaseBusiness,
  FolderGit2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { FloatingFragment } from "./data";

function FragmentIcon({ id, kind }: { id: string; kind: string }) {
  if (id === "skill-react") {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 text-[#58C4DC] fill-none stroke-current" strokeWidth="1">
        <circle cx="0" cy="0" r="2.05" fill="#58C4DC" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    );
  }
  if (id === "skill-ts") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 rounded" fill="#3178C6">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M12.5 17.5v-7h-3v-1.5h7.5V10.5h-3v7h-1.5zm-5.7 0c-.8 0-1.4-.2-1.9-.6-.4-.4-.7-1-.7-1.8h1.6c0 .4.1.7.4.9.2.2.6.3 1 .3.4 0 .7-.1.9-.3.2-.2.3-.4.3-.7 0-.3-.1-.5-.3-.7-.1-.1-.4-.3-.9-.4l-1.1-.4c-.7-.2-1.2-.6-1.5-1-.3-.4-.4-.9-.4-1.5 0-.8.3-1.4.8-1.8.5-.4 1.2-.6 2.1-.6.8 0 1.5.2 2 .6.5.4.8 1 .8 1.8h-1.6c0-.4-.1-.7-.4-.9-.2-.2-.5-.3-.9-.3-.4 0-.7.1-.9.3-.2.2-.3.4-.3.7 0 .2.1.4.2.6.1.1.4.3.8.4l1.1.4c.8.3 1.3.6 1.6 1 .3.4.5.9.5 1.5 0 .8-.3 1.4-.8 1.8-.5.4-1.2.6-2 .6z" fill="#FFFFFF" />
      </svg>
    );
  }
  if (id === "skill-next") {
    return (
      <svg viewBox="0 0 180 180" className="w-5 h-5" fill="none">
        <circle cx="90" cy="90" r="90" fill="#000000" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="#FFFFFF" />
        <rect x="115" y="54" width="12" height="72" fill="#FFFFFF" />
      </svg>
    );
  }
  if (id === "link-github") {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    );
  }
  if (kind === "achievement") {
    return <Award size={16} strokeWidth={1.8} className="text-[#FBBF24]" />;
  }
  if (kind === "education") {
    return <GraduationCap size={16} strokeWidth={1.8} className="text-[#C4B5FD]" />;
  }
  if (kind === "experience") {
    return <BriefcaseBusiness size={16} strokeWidth={1.8} className="text-[#E08758]" />;
  }
  if (kind === "project") {
    return <FolderGit2 size={16} strokeWidth={1.8} className="text-[#C4B5FD]" />;
  }
  return <Sparkles size={16} strokeWidth={1.8} className="text-[#C4B5FD]" />;
}

function FragmentCard({ fragment }: { fragment: FloatingFragment }) {
  const isSkill = fragment.kind === "skill";

  if (isSkill) {
    return (
      <div className="fragment-card fragment-card--skill">
        <span className="fragment-icon" aria-hidden="true">
          <FragmentIcon id={fragment.id} kind={fragment.kind} />
        </span>
        <span className="fragment-title">{fragment.title}</span>
      </div>
    );
  }

  return (
    <div className={`fragment-card fragment-card--detailed ${fragment.className ?? ""}`}>
      <div className="fragment-head">
        <span className="fragment-icon" aria-hidden="true">
          <FragmentIcon id={fragment.id} kind={fragment.kind} />
        </span>
        <div className="fragment-copy">
          <span className="fragment-title">{fragment.title}</span>
        </div>
      </div>
      {fragment.meta && <span className="fragment-meta">{fragment.meta}</span>}
      {fragment.detail && <span className="fragment-detail">{fragment.detail}</span>}
    </div>
  );
}

export function FloatingFragment({
  fragment,
  progress,
}: {
  fragment: FloatingFragment;
  progress: MotionValue<number>;
}) {
  const groupDx = fragment.group.x - fragment.start.x;
  const groupDy = fragment.group.y - fragment.start.y;
  const profileDx = 67 - fragment.start.x;
  const profileDy = 50 - fragment.start.y;

  const x = useTransform(
    progress,
    [0, 0.08, 0.25, 0.33],
    ["0vw", "0vw", `${groupDx}vw`, `${profileDx}vw`],
  );
  const y = useTransform(
    progress,
    [0, 0.08, 0.25, 0.33],
    ["0vh", "0vh", `${groupDy}vh`, `${profileDy}vh`],
  );
  const rotate = useTransform(
    progress,
    [0, 0.08, 0.25, 0.33],
    [fragment.rotate, fragment.rotate * 0.6, 0, 0],
  );
  const scale = useTransform(progress, [0, 0.08, 0.25, 0.33], [1, 1, 0.95, 0.58]);
  const opacity = useTransform(progress, [0, 0.05, 0.27, 0.33], [1, 1, 0.92, 0]);

  return (
    <motion.div
      className={`fragment fragment--${fragment.kind} ${fragment.className ?? ""}`}
      style={{
        left: `${fragment.start.x}%`,
        top: `${fragment.start.y}%`,
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
    >
      <div className="fragment-float">
        <FragmentCard fragment={fragment} />
      </div>
    </motion.div>
  );
}

export function StaticFragment({
  fragment,
  style,
}: {
  fragment: FloatingFragment;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`fragment fragment--${fragment.kind} ${fragment.className ?? ""}`}
      style={style}
    >
      <div className="fragment-float">
        <FragmentCard fragment={fragment} />
      </div>
    </div>
  );
}

export function GroupLabel({
  progress,
  label,
  x,
  y,
}: {
  progress: MotionValue<number>;
  label: string;
  x: number;
  y: number;
}) {
  const opacity = useTransform(progress, [0.1, 0.16, 0.25, 0.3], [0, 0.9, 0.9, 0]);
  const translateX = useTransform(progress, [0.1, 0.16], [-6, 0]);

  return (
    <motion.span
      className="story-group-label"
      style={{ left: `${x}%`, top: `${y}%`, opacity, x: translateX }}
      aria-hidden="true"
    >
      {label}
    </motion.span>
  );
}
