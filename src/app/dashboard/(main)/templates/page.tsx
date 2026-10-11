/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const templates = [
  {
    id: 'modern-developer',
    name: 'Modern Developer',
    index: '01',
    img: 'https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png',
    tags: ['Vibrant', 'Interactive', 'Dark'],
    palette: ['#09090b', '#10b981', '#27272a'],
    previewHref: '/dashboard/preview?template=modern-developer',
    buildHref: '/dashboard/builder?template=modern-developer',
  },
  {
    id: 'software-engineer',
    name: 'Developer Pro',
    index: '02',
    img: 'https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png',
    tags: ['Minimal', 'Typographic', 'Light'],
    palette: ['#ffffff', '#111111', '#71717a'],
    previewHref: '/dashboard/preview?template=software-engineer',
    buildHref: '/dashboard/builder?template=software-engineer',
  },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Your Templates', 'Premium'];

  return (
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full select-none text-on-background">

      {/* Sleek Utility Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-outline/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-on-background/80 font-medium">
              {templates.length} Curated Layouts
            </span>
          </div>
          <span className="text-outline/30">•</span>
          <span className="font-mono text-xs uppercase tracking-wider text-on-background/50">
            Production Ready
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-container-low/70 rounded-xl border border-outline/15 font-mono text-xs uppercase shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg tracking-wider transition-all duration-200 font-bold ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-background/60 hover:text-on-background'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl) => (
          <div key={tpl.id} className="group flex flex-col border border-outline/10 rounded-xl overflow-hidden bg-background hover:shadow-xl transition-shadow duration-300">

            {/* Image frame */}
            <div className="relative w-full aspect-video overflow-hidden bg-on-background">
              <img
                src={tpl.img}
                alt={tpl.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out blur-[1.5px] group-hover:blur-0 group-hover:scale-[1.04]"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-on-background/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2 mb-1">
                  {tpl.palette.map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={tpl.previewHref}
                    className="px-5 py-2.5 bg-background text-on-background font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-surface transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    href={tpl.buildHref}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-emerald-700 transition-colors"
                  >
                    Build Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-on-background/40 uppercase tracking-widest">{tpl.index}</span>
                  <h3 className="font-serif text-lg font-semibold">{tpl.name}</h3>
                </div>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {tpl.tags.map((t) => (
                    <span key={t} className="font-mono text-[9px] uppercase tracking-widest border border-outline/15 px-2 py-0.5 text-on-background/60">{t}</span>
                  ))}
                </div>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider border border-emerald-600/40 text-emerald-600 px-2 py-0.5 shrink-0 mt-1">Free</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
