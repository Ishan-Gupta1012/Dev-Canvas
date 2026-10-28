'use client';

import React, { useRef } from 'react';
import {
  Braces,
  Copy,
  Globe,
  LayoutTemplate,
  Palette,
  ScanLine,
  Upload,
} from 'lucide-react';
import { Eyebrow, Reveal } from '@/components/OpeningExperience/Reveal';
import { MaskLine } from './KineticText';

function SpotlightCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        className="lc-spotlight group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-[#3A2418]/12 bg-[#FFFFFF]/80 p-6 backdrop-blur-sm transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-[#4A2F1F]/30 hover:shadow-[0_30px_70px_-45px_rgba(58,36,24,0.8)] sm:p-7"
      >
        {children}
      </div>
    </Reveal>
  );
}

function CardHead({
  index,
  icon: Icon,
  title,
  body,
}: {
  index: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] border border-[#3A2418]/12 bg-[#FAF7F3] text-[#4A2F1F] transition-all duration-500 group-hover:-rotate-6 group-hover:border-[#4A2F1F]/25 group-hover:bg-[#4A2F1F] group-hover:text-[#F8EADF]">
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B4552D]">
          {index}
        </span>
      </div>
      <h3 className="mt-6 font-serif text-[clamp(1.35rem,2vw,1.6rem)] font-medium leading-[1.1] tracking-tight text-[#1E1611]">
        {title}
      </h3>
      <p className="mt-2.5 max-w-[34ch] font-sans text-[13px] leading-[1.65] text-[#3A2C22]/80">
        {body}
      </p>
    </>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative isolate w-full overflow-hidden border-y border-[#3A2418]/10 bg-[#E7DED3] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
    >
      <div aria-hidden="true" className="lc-grain pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_0%,rgba(180,85,45,0.18),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[42rem]">
            <Reveal>
              <Eyebrow label="[04 // THE TOOLKIT]" />
            </Reveal>
            <h2 className="mt-6 font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em] text-[#1E1611]">
              <MaskLine delay={0.04}>Everything you need.</MaskLine>
              <MaskLine delay={0.12}>
                <span className="lc-ink-gradient italic">Nothing you have to fight.</span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-[26rem] font-sans text-[14.5px] leading-[1.7] text-[#3A2C22]/85">
              Built for the way developers actually work: import once, edit anything,
              publish in a single click.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12">
          {/* Import — hero card */}
          <SpotlightCard className="lg:col-span-7" delay={0.02}>
            <CardHead
              index="01"
              icon={Upload}
              title="Drop a PDF. Keep your evening."
              body="No re-typing into forty form fields. The parser reads education, skills, projects, and experience straight from the document you already maintain."
            />
            <div className="mt-7 flex-1">
              <div className="relative overflow-hidden rounded-[16px] border border-dashed border-[#4A2F1F]/25 bg-[#FAF7F3]/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#4A2F1F]/10 font-mono text-[9px] font-bold text-[#4A2F1F]">
                    PDF
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-[#3A2C22]">
                        yourname_resume.pdf
                      </p>
                      <p className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[#6F4A34]">
                        Parsed
                      </p>
                    </div>
                    <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[#3A2418]/10">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#4A2F1F] to-[#C4703F] transition-[width] duration-700 group-hover:w-full" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {['Profile', 'Education', 'Skills', 'Projects', 'Experience', 'Achievements'].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#3A2418]/12 bg-[#FFFFFF] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#3A2C22]/70"
                      >
                        {chip}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Templates */}
          <SpotlightCard className="lg:col-span-5" delay={0.06}>
            <CardHead
              index="02"
              icon={LayoutTemplate}
              title="Editorial layouts, not themes."
              body="Four typographic systems with real hierarchy — chosen for how recruiters read, not for how a grid looks empty."
            />
            <div className="mt-7 grid flex-1 grid-cols-2 gap-2.5">
              {[
                { name: 'Modern', tone: 'bg-[#FFFFFF]', ink: 'text-[#1E1611]' },
                { name: 'Editorial', tone: 'bg-[#F3E2D6]', ink: 'text-[#1E1611]' },
                { name: 'Developer', tone: 'bg-[#231812]', ink: 'text-[#FBF9F6]' },
                { name: 'Creative', tone: 'bg-[#4A2F1F]', ink: 'text-[#FBF9F6]' },
              ].map((template) => (
                <div
                  key={template.name}
                  className={`flex h-[74px] flex-col justify-between rounded-[10px] border border-[#3A2418]/12 p-2.5 transition-transform duration-300 group-hover:-translate-y-0.5 ${template.tone} ${template.ink}`}
                >
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-30" />
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
                  </div>
                  <div>
                    <p className="font-serif text-[11px] leading-none">{template.name}</p>
                    <div className="mt-1.5 space-y-1">
                      <span className="block h-[2px] w-4/5 rounded-full bg-current opacity-20" />
                      <span className="block h-[2px] w-3/5 rounded-full bg-current opacity-15" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Palette */}
          <SpotlightCard className="lg:col-span-4" delay={0.1}>
            <CardHead
              index="03"
              icon={Palette}
              title="Restyle in one click."
              body="Swap the entire colour system live — every surface, border, and type ramp follows."
            />
            <div className="mt-7 flex flex-1 items-end gap-2">
              {[
                { tone: 'bg-[#FAF7F3]', ring: 'ring-[#3A2418]/20' },
                { tone: 'bg-[#D8B7A5]', ring: 'ring-[#3A2418]/20' },
                { tone: 'bg-[#4A2F1F]', ring: 'ring-[#3A2418]/25' },
                { tone: 'bg-[#231812]', ring: 'ring-[#3A2418]/30' },
              ].map((swatch, index) => (
                <span
                  key={swatch.tone}
                  className={`h-12 flex-1 rounded-[9px] ring-1 ring-inset ${swatch.tone} ${swatch.ring} transition-transform duration-300 group-hover:translate-y-[-4px]`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                />
              ))}
            </div>
          </SpotlightCard>

          {/* Link */}
          <SpotlightCard className="lg:col-span-4" delay={0.14}>
            <CardHead
              index="04"
              icon={Globe}
              title="One link that travels."
              body="Resume footer, LinkedIn, cold email. A single URL that is always the current version."
            />
            <div className="mt-7 flex-1">
              <div className="flex items-center gap-2 rounded-full border border-[#3A2418]/15 bg-[#FAF7F3]/70 px-3 py-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F4A34]" />
                <span className="min-w-0 flex-1 truncate font-mono text-[9.5px] text-[#4A2F1F]">
                  devcanvas.me/your-name
                </span>
                <Copy
                  size={12}
                  strokeWidth={1.6}
                  className="shrink-0 text-[#B4552D] transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <p className="mt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-[#3A2C22]/45">
                Custom domain supported · HTTPS by default
              </p>
            </div>
          </SpotlightCard>

          {/* Structured export */}
          <SpotlightCard className="lg:col-span-4" delay={0.18}>
            <CardHead
              index="05"
              icon={Braces}
              title="Your data stays yours."
              body="Clean, structured content underneath each section — export it, edit it, or take it with you."
            />
            <div className="mt-7 flex-1 rounded-[12px] border border-[#3A2418]/12 bg-[#231812] p-3.5 font-mono text-[8.5px] leading-[1.8] text-[#FBF9F6]/70">
              <p>
                <span className="text-[#EBC4A6]">&quot;projects&quot;</span>: [
              </p>
              <p className="pl-3">
                {'{ '}
                <span className="text-[#EBC4A6]">&quot;name&quot;</span>: &quot;Event Mesh&quot;,
              </p>
              <p className="pl-3">
                <span className="text-[#EBC4A6]">&quot;stack&quot;</span>: [&quot;Rust&quot;,
                &quot;K8s&quot;] {'}'}
              </p>
              <p>]</p>
            </div>
          </SpotlightCard>

          {/* Scan */}
          <SpotlightCard className="lg:col-span-12" delay={0.22}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-[34rem]">
                <CardHead
                  index="06"
                  icon={ScanLine}
                  title="Built to be skimmed, then read."
                  body="Every layout preserves real heading structure, readable contrast, and keyboard navigation — the details that make a portfolio feel professional instead of decorative."
                />
              </div>
              <div className="grid w-full max-w-[340px] grid-cols-2 gap-2.5">
                {[
                  ['Contrast', '4.5:1+'],
                  ['Keyboard', 'Full'],
                  ['Reduced motion', 'Respected'],
                  ['Mobile', '375 → 1440'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[11px] border border-[#3A2418]/12 bg-[#FAF7F3]/60 px-3 py-2.5"
                  >
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#B4552D]">
                      {label}
                    </p>
                    <p className="mt-1 font-serif text-[14px] leading-none text-[#1E1611]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
