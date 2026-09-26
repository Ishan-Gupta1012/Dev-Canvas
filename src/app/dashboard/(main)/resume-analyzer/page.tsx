'use client';

import React, { useState } from 'react';
import { UploadCloud, FileSearch, CheckCircle2, AlertCircle, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywords: { matched: string[]; missing: string[] };
  }>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.docx')) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    setFile(selected);
    setAnalysis(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const runAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      setAnalysis({
        atsScore: 72,
        strengths: [
          'Clear section headings and consistent formatting',
          'Quantified achievements with metrics',
          'Relevant technical keywords present',
        ],
        weaknesses: [
          'Missing a professional summary at the top',
          'Experience bullets could use stronger action verbs',
          'No links to portfolio or GitHub detected',
        ],
        suggestions: [
          'Add a 2-3 line professional summary highlighting your focus area',
          'Rewrite 2 experience bullets starting with "Led", "Built", or "Optimized"',
          'Add LinkedIn and GitHub links in the contact section',
          'Include 3-5 role-specific keywords from the target job description',
        ],
        keywords: {
          matched: ['JavaScript', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Git'],
          missing: ['AWS', 'Docker', 'GraphQL', 'CI/CD', 'Agile'],
        },
      });
      setIsAnalyzing(false);
    }, 1800);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-tertiary';
    if (score >= 60) return 'text-amber-600';
    return 'text-error';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-tertiary-container/20 border-tertiary/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-error-container/20 border-error/20';
  };

  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full min-h-screen space-y-lg">
      {/* Header */}
      <div className="mb-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Workspace / Resume Analyzer</p>
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">Resume Analyzer</h1>
        <p className="text-on-surface-variant text-sm">Upload your resume to get an ATS compatibility score, keyword insights, and actionable suggestions.</p>
      </div>

      {/* Upload / Analyze Card */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('analyzer-file-input')?.click()}
        className={`bg-surface-container-lowest border-2 border-dashed rounded-2xl p-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] ${
          dragActive ? 'border-primary bg-primary-container/10 scale-[0.99]' : 'border-outline-variant hover:border-primary/50'
        }`}
      >
        <input
          id="analyzer-file-input"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <>
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
              <UploadCloud size={28} className="text-primary" />
            </div>
            <h3 className="font-bold text-lg text-on-surface mb-2">Drop your resume here</h3>
            <p className="text-on-surface-variant text-sm mb-4">or click to browse local files</p>
            <button
              type="button"
              className="px-md py-sm bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95"
            >
              Choose File
            </button>
            <p className="text-on-surface-variant text-xs mt-4">Supported formats: PDF, DOCX</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-sm">
            <FileSearch size={32} className="text-primary" />
            <p className="font-semibold text-on-surface text-sm">{file.name}</p>
            <p className="text-on-surface-variant text-xs">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                runAnalysis();
              }}
              disabled={isAnalyzing}
              className="mt-sm px-md py-sm bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95 flex items-center gap-xs"
            >
              {isAnalyzing && <RefreshCw size={16} className="animate-spin" />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setAnalysis(null);
              }}
              className="text-xs text-on-surface-variant hover:text-error underline"
            >
              Remove file
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-lg"
          >
            {/* Score Banner */}
            <div className={`flex items-center gap-md p-lg rounded-2xl border ${getScoreBg(analysis.atsScore)}`}>
              <div className="flex-1">
                <p className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">ATS Compatibility Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(analysis.atsScore)}`}>{analysis.atsScore}<span className="text-lg text-on-surface-variant">/100</span></p>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {analysis.atsScore >= 80 ? 'Strong match — this resume is likely to pass most ATS filters.' : analysis.atsScore >= 60 ? 'Moderate match — a few improvements can significantly increase pass rate.' : 'Weak match — revise structure and keywords to improve ATS compatibility.'}
                </p>
              </div>
              <Sparkles className="text-primary" size={32} />
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm">
                  <CheckCircle2 className="text-tertiary" size={18} />
                  Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-xs">
                  {analysis.keywords.matched.map((kw) => (
                    <span key={kw} className="px-3 py-1.5 bg-tertiary-container/10 text-tertiary rounded-full text-xs font-semibold border border-tertiary/20">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm">
                  <AlertCircle className="text-amber-600" size={18} />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-xs">
                  {analysis.keywords.missing.map((kw) => (
                    <span key={kw} className="px-3 py-1.5 bg-amber-500/10 text-amber-700 rounded-full text-xs font-semibold border border-amber-500/20">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths / Weaknesses / Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm text-tertiary">
                  <CheckCircle2 size={18} />
                  Strengths
                </h3>
                <ul className="space-y-sm">
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-sm text-body-sm text-on-surface">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-tertiary shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm text-amber-700">
                  <AlertCircle size={18} />
                  Weaknesses
                </h3>
                <ul className="space-y-sm">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-sm text-body-sm text-on-surface">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-headline-md mb-md flex items-center gap-sm text-primary">
                  <Lightbulb size={18} />
                  Suggestions
                </h3>
                <ul className="space-y-sm">
                  {analysis.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-sm text-body-sm text-on-surface">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Step */}
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-sm">
              <div>
                <p className="font-semibold text-on-surface">Ready to improve your resume?</p>
                <p className="text-body-sm text-on-surface-variant">Use the Resume Builder to apply these suggestions and create a stronger resume.</p>
              </div>
              <a
                href="/dashboard/resume-builder"
                className="px-md py-sm bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95 whitespace-nowrap"
              >
                Open Resume Builder
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
