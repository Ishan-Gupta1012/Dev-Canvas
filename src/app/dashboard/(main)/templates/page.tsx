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
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full select-none text-[#111111]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#111111]/15">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/40 mb-1">Workspace / Templates</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#111111]">Templates Library</h1>
          <p className="text-sm text-[#111111]/60 mt-1">Select a layout and build your public developer portfolio.</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 p-1 bg-[#111111]/5 rounded-md border border-[#111111]/10 font-mono text-xs uppercase shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-sm tracking-widest transition-all duration-200 font-semibold ${
                activeCategory === cat
                  ? 'bg-[#111111] text-[#F7F4EF] shadow-sm'
                  : 'text-[#111111]/50 hover:text-[#111111]'
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
          <div key={tpl.id} className="group flex flex-col border border-[#111111]/12 rounded-xl overflow-hidden bg-[#F7F4EF] hover:shadow-xl transition-shadow duration-300">

            {/* Image frame */}
            <div className="relative w-full aspect-video overflow-hidden bg-[#111111]">
              <img
                src={tpl.img}
                alt={tpl.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out blur-[1.5px] group-hover:blur-0 group-hover:scale-[1.04]"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#111111]/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2 mb-1">
                  {tpl.palette.map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white/30" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={tpl.previewHref}
                    className="px-5 py-2.5 bg-[#F7F4EF] text-[#111111] font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    href={tpl.buildHref}
                    className="px-5 py-2.5 bg-[#10b981] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#059669] transition-colors"
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
                  <span className="font-mono text-[9px] text-[#111111]/40 uppercase tracking-widest">{tpl.index}</span>
                  <h3 className="font-serif text-lg font-semibold text-[#111111]">{tpl.name}</h3>
                </div>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {tpl.tags.map((t) => (
                    <span key={t} className="font-mono text-[9px] uppercase tracking-widest border border-[#111111]/15 px-2 py-0.5 text-[#111111]/60">{t}</span>
                  ))}
                </div>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider border border-[#10b981]/40 text-[#10b981] px-2 py-0.5 shrink-0 mt-1">Free</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
