'use client';

import Link from 'next/link';
import {
  FilePlus,
  Sparkles,
  LayoutTemplate,
  FileText,
  FileSearch,
  ArrowRight,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Action = {
  label: string;
  desc: string;
  href: string;
  icon: typeof FilePlus;
  accent: string;
  glow: string;
};

const ACTIONS: Action[] = [
  {
    label: 'Build Content',
    desc: 'Add projects, skills & experience from scratch',
    href: '/dashboard/resume-builder',
    icon: FilePlus,
    accent: '#f9a8d4',
    glow: 'rgba(244,114,182,0.35)',
  },
  {
    label: 'AI Polish',
    desc: 'Let AI enhance & refine it',
    href: '/dashboard/ai-builder',
    icon: Sparkles,
    accent: '#c4b5fd',
    glow: 'rgba(139,92,246,0.35)',
  },
  {
    label: 'Pick Template',
    desc: 'Choose your design',
    href: '/dashboard/templates',
    icon: LayoutTemplate,
    accent: '#6ee7b7',
    glow: 'rgba(16,185,129,0.30)',
  },
  {
    label: 'Upload Resume',
    desc: 'Parse an existing one',
    href: '/dashboard/resume',
    icon: FileText,
    accent: '#fcd34d',
    glow: 'rgba(245,158,11,0.30)',
  },
  {
    label: 'Analyze',
    desc: 'AI feedback on your resume',
    href: '/dashboard/resume-analyzer',
    icon: FileSearch,
    accent: '#f9a8d4',
    glow: 'rgba(236,72,153,0.30)',
  },
];

function MagneticCard({ action }: { action: Action }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = (x / r.width - 0.5) * 14;
    const py = (y / r.height - 0.5) * 14;
    setPos({ x: px, y: py });
    setGlow({ x: (x / r.width) * 100, y: (y / r.height) * 100, on: true });
  };

  const onLeave = () => {
    setPos({ x: 0, y: 0 });
    setGlow((g) => ({ ...g, on: false }));
  };

  const Icon = action.icon;

  return (
    <Link
      ref={cardRef}
      href={action.href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="group relative overflow-hidden rounded-2xl border border-outline/10 bg-background p-6 flex flex-col justify-between w-[260px] sm:w-[300px] h-[180px] shrink-0"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={
          glow.on
            ? {
                opacity: 1,
                background: `radial-gradient(260px circle at ${glow.x}% ${glow.y}%, ${action.glow}, transparent 70%)`,
              }
            : undefined
        }
      />
      <div className="relative flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${action.accent}1f` }}
        >
          <Icon size={22} style={{ color: action.accent }} />
        </div>
        <ArrowRight
          size={20}
          className="text-on-background/30 group-hover:text-on-background/70 group-hover:translate-x-1 transition-all"
          style={{ transform: `translate(${pos.x * 0.6}px, ${pos.y * 0.6}px)` }}
        />
      </div>
      <div className="relative">
        <p className="font-serif text-lg font-bold tracking-tight">{action.label}</p>
        <p className="text-xs text-on-background/60 mt-1 font-medium">{action.desc}</p>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let raf = 0;
    const speed = 1.1; // px per frame (~66px/s at 60fps)

    const tick = () => {
      if (!hovering) {
        el.scrollLeft += speed;
        // seamless loop: when we reach the end, jump back to start
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovering]);

  // duplicate the list so the loop is seamless
  const items = [...ACTIONS, ...ACTIONS];

  return (
    <div className="relative">
      <div className="mb-8">
        <p className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          Quick Actions
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-on-background/40 mt-2 font-semibold">
          Jump straight in
        </p>
      </div>

      <div
        ref={stripRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar cursor-grab active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent, black 18%, black 82%, transparent)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, black 18%, black 82%, transparent)',
        }}
      >
        {items.map((a, i) => (
          <MagneticCard key={i} action={a} />
        ))}
      </div>
    </div>
  );
}