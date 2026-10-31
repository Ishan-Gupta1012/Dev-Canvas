'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileArchive, Info, CheckCircle } from 'lucide-react';
import DownloadZipButton from '@/components/DownloadZipButton';
import { PortfolioData, initialPortfolioData } from '@/types/portfolio';

const STORAGE_KEY = 'portfolio_builder_draft';
const STORAGE_KEY_TEMPLATE = 'portfolio_builder_template';

export default function ExportPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [templateName, setTemplateName] = useState<string>('software-engineer');
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
      if (stored) {
        const parsed = JSON.parse(stored);
        const data = parsed.data || parsed;
        setPortfolioData(data);
        setTemplateName(parsed.template || storedTemplate || 'software-engineer');
        setHasDraft(true);
      }
    } catch {
      // localStorage unavailable or malformed
    }
  }, []);

  const templateDisplayName: Record<string, string> = {
    'software-engineer': 'Developer Pro',
    'creative-edge': 'Creative Edge',
    'modern-developer': 'Modern Developer',
  };

  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-serif text-2xl font-bold text-on-surface mb-2">Export Portfolio</h1>
        <p className="text-on-surface-variant text-sm">
          Download your portfolio as a standalone ZIP you can host anywhere — no DevCanvas account needed.
        </p>
      </div>

      {/* Main Export Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5 text-primary">
            <FileArchive size={28} />
          </div>
          <h3 className="font-serif font-bold text-xl mb-2">Download Portfolio ZIP</h3>
          <p className="text-on-surface-variant text-sm max-w-md mb-6 leading-relaxed">
            Generates a self-contained HTML + CSS bundle with your profile photo and project images
            embedded. Extract and open <code className="font-mono text-xs bg-surface-container-low px-1 py-0.5 rounded">index.html</code> in any browser.
          </p>

          {hasDraft && portfolioData ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <DownloadZipButton
                portfolioData={portfolioData}
                templateName={templateName}
                variant="default"
                className="w-full flex flex-col items-center"
              />
              <p className="text-xs text-on-surface-variant/70 font-mono">
                Template: <strong className="text-on-surface">{templateDisplayName[templateName] || templateName}</strong>
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-on-surface-variant/80">
                No portfolio draft found. Build your portfolio first, then come back to export it.
              </p>
              <a
                href="/dashboard/builder"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-mono text-xs uppercase tracking-wider font-bold hover:bg-primary/90 transition-all"
              >
                Open Portfolio Builder →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
        <h4 className="font-serif font-bold text-base mb-4 flex items-center gap-2">
          <Info size={16} className="text-primary" />
          What&apos;s included in the ZIP
        </h4>
        <ul className="space-y-2">
          {[
            'index.html — Complete standalone portfolio page',
            'styles/style.css — Global reset and utility styles',
            'assets/avatar.* — Your profile photo (if uploaded)',
            'assets/project-*.* — Project images (if uploaded)',
            'README.md — Setup and customisation guide',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="font-mono text-xs">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-5 border-t border-outline/10">
          <p className="text-xs text-on-surface-variant/70 leading-relaxed">
            <strong className="text-on-surface">No server required.</strong> The ZIP works completely offline. 
            Images uploaded via the builder (data URLs) are embedded directly.
            Remote images are fetched where CORS allows, otherwise they remain as external links.
          </p>
        </div>
      </div>
    </div>
  );
}
