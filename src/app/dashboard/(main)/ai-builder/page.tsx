'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PortfolioData, Project, Achievement } from '@/types/portfolio';
import { 
  Terminal, 
  ArrowRight, 
  FileText, 
  Component, 
  Cpu, 
  Activity, 
  Server, 
  Hexagon, 
  Check, 
  ScanLine, 
  Network, 
  Trash2, 
  UploadCloud, 

  FileUp, 
  ShieldCheck, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 6);

export default function AIBuilderPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('software-engineer');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasResume = !!user?.resumeData && Object.keys(user.resumeData as object).length > 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to process telemetry');
      
      if (user) {
        updateProfile({ ...user, resumeData: data.mergedData });
      }
      setStep(2);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'System Error during intake.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && hasResume) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleRemoveResume = async () => {
    if (user && updateProfile) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateProfile({ ...user, resumeData: {} as any });
      } catch (error) {
        console.error("Failed to remove resume:", error);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapResumeToPortfolio = (resume: any): PortfolioData => {
    const hero = {
      name: resume?.personal?.name || 'Developer',
      location: resume?.personal?.location || '',
      logoText: resume?.personal?.name || 'Developer',
      title: resume?.personal?.title || '',
      tagline: resume?.summary ? resume.summary.substring(0, 80) + '...' : 'Building scalable digital experiences.',
      bio: resume?.summary || '',
      avatarUrl: user?.personalInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
      resumeUrl: '',
      socials: [] as { platform: 'github' | 'linkedin'; url: string }[],
      githubUsername: '',
      showGithub: true
    };

    if (resume?.links?.github) {
      hero.socials.push({ platform: 'github', url: resume.links.github });
      try {
        const url = new URL(resume.links.github);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) hero.githubUsername = parts[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // ignore
      }
    }
    if (resume?.links?.linkedin) {
      hero.socials.push({ platform: 'linkedin', url: resume.links.linkedin });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects: Project[] = (resume?.projects || []).map((p: any) => ({
      id: generateId(),
      name: p.name || 'Untitled Project',
      description: p.description || '',
      highlights: p.bullets || [],
      techStack: p.technologies || [],
      images: [],
      githubUrl: p.link || '',
      liveUrl: '',
      demoVideoUrl: ''
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const achievements: Achievement[] = (resume?.experience || []).map((e: any) => ({
      id: generateId(),
      type: 'job',
      title: e.jobTitle || e.role || e.title || e.position || '',
      organization: e.company || e.organization || e.employer || '',
      startDate: e.startDate || (e.duration || e.date)?.split('-')[0]?.trim() || '',
      endDate: e.endDate || (e.duration || e.date)?.split('-')[1]?.trim() || '',
      description: [e.description, ...(e.bullets || [])].filter(Boolean).join('\n')
    }));

    const skillsArr: { id: string; name: string }[] = [];
    if (resume?.skills) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(resume.skills).forEach((arr: any) => {
        if (Array.isArray(arr)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          arr.forEach((s: any) => skillsArr.push({ id: generateId(), name: String(s) }));
        }
      });
    }

    const contact = {
      email: resume?.personal?.email || user?.personalInfo?.email || '',
      location: resume?.personal?.location || '',
      phone: resume?.personal?.phone || ''
    };

    return { hero, projects, achievements, skills: skillsArr, contact };
  };

  const handleSkip = () => {
    if (!user?.resumeData) return;
    const portfolioDraft = mapResumeToPortfolio(user.resumeData);
    sessionStorage.setItem('portfolio_draft_data', JSON.stringify(portfolioDraft));
    router.push(`/dashboard/builder?template=${selectedTemplate}`);
  };

  const handleGenerate = async () => {
    if (!user?.resumeData) return;
    
    setIsEnhancing(true);
    setErrorMsg(null);
    try {
      const portfolioDraft = mapResumeToPortfolio(user.resumeData);
      
      const res = await fetch('/api/portfolio/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: { 
          experience: portfolioDraft.achievements,
          projects: portfolioDraft.projects
        } })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Syntax alignment failed.');
      }
      
      const finalDraft = { ...portfolioDraft };
      if (data.enhancedData) {
        if (Array.isArray(data.enhancedData.experience)) {
          finalDraft.achievements = finalDraft.achievements.map((ach, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const aiItem = data.enhancedData.experience[i] || data.enhancedData.experience.find((e: any) => e.id === ach.id);
            if (aiItem && aiItem.description) {
              return { ...ach, description: aiItem.description };
            }
            return ach;
          });
        }
        if (Array.isArray(data.enhancedData.projects)) {
          finalDraft.projects = finalDraft.projects.map((proj, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const aiItem = data.enhancedData.projects[i] || data.enhancedData.projects.find((p: any) => p.id === proj.id);
            if (aiItem) {
              return { 
                ...proj, 
                description: aiItem.description || proj.description,
                highlights: aiItem.highlights || aiItem.bullets || proj.highlights
              };
            }
            return proj;
          });
        }
      }

      sessionStorage.setItem('portfolio_draft_data', JSON.stringify(finalDraft));
      router.push(`/dashboard/builder?template=${selectedTemplate}`);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'System Failure.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 md:p-10 w-full max-w-[1400px] mx-auto font-sans relative text-on-surface min-h-full">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-fast {
          100% { transform: rotate(-360deg); }
        }
        .scanner-line {
          animation: scanline 3s linear infinite;
          background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.2), transparent);
        }
        .core-ring-1 { animation: spin-slow 12s linear infinite; }
        .core-ring-2 { animation: spin-reverse-fast 8s linear infinite; }
        .glare {
          background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, transparent 30%);
          background-size: 200% 200%;
          transition: background-position 0.5s ease;
        }
        .glare:hover {
          background-position: 100% 100%;
        }
        @keyframes beam {
          0% { top: -20px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: calc(100% - 80px); opacity: 0; }
        }
        .beam-line {
          position: absolute;
          animation: beam 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Sleek Utility Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-outline/10 relative z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              Step {step} of 3
            </span>
          </div>
          <span className="text-outline/30">•</span>
          <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant/60">
            {step === 1 ? 'Upload Resume' : step === 2 ? 'Select Template' : 'AI Site Generation'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-3.5 py-1.5 rounded-lg border border-outline/20 font-mono text-xs uppercase tracking-wider text-on-surface hover:text-primary hover:border-primary/40 transition-colors"
            >
              Back
            </button>
          )}
          <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant/40">
            Automated Pipeline
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 w-full relative z-10">
        
        {/* Terminal Timeline */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="flex flex-col gap-6 relative pb-4">
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-outline-variant/30 hidden lg:block z-0 rounded-full">
              <div className="beam-line left-1/2 -translate-x-1/2 w-[3px] h-[80px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] blur-[1px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[6px] h-[12px] bg-white rounded-full shadow-[0_0_15px_#fff,0_0_20px_rgba(16,185,129,1)]" />
              </div>
            </div>
            {[
            { num: 1, label: 'UPLOAD RESUME', icon: Network, desc: 'Import your data' },
            { num: 2, label: 'SELECT DESIGN', icon: Component, desc: 'Choose a template' },
            { num: 3, label: 'GENERATE SITE', icon: Cpu, desc: 'AI processing' }
          ].map((s) => {
            const isActive = step === s.num;
            const isPast = step > s.num;
            
            return (
              <div key={s.num} className={`relative z-10 flex gap-4 p-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-background/40 backdrop-blur-xl border border-outline/10 shadow-sm' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center border font-mono text-xs font-bold transition-colors ${
                  isActive ? 'bg-primary text-on-primary border-primary shadow-sm' : 
                  isPast ? 'bg-background/40 backdrop-blur-xl border-primary text-primary' : 
                  'bg-background/30 backdrop-blur-xl border-outline text-on-surface-variant'
                }`}>
                  {isPast ? <Check size={14} /> : `0${s.num}`}
                </div>
                <div>
                  <div className={`font-mono text-xs font-bold tracking-wider mb-1 ${isActive ? 'text-primary' : 'text-on-surface'}`}>{s.label}</div>
                  <div className="text-[10px] uppercase font-mono text-on-surface-variant tracking-widest">{s.desc}</div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full p-8 relative overflow-hidden">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />

          {step === 1 && (
            <div className="relative z-10 animate-fade-in-up w-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Network className="text-primary" size={20} />
                <h2 className="text-xl font-mono uppercase tracking-wider font-bold text-on-surface">MODULE 01: UPLOAD RESUME</h2>
              </div>
              
              {hasResume ? (
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="w-full max-w-xl p-8 bg-surface-container-low/70 border border-outline/15 rounded-2xl relative overflow-hidden shadow-sm backdrop-blur-xl">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center shrink-0">
                          <FileText className="text-primary" size={24} />
                        </div>
                        <div>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <h3 className="font-serif text-lg font-bold text-on-surface">
                            {(user?.resumeData as any)?.personal?.name ? String((user.resumeData as any).personal.name) : 'Resume Document'}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Check size={11} /> Ready For Portfolio
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveResume} 
                        title="Remove uploaded resume"
                        className="p-2 text-on-surface-variant/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3.5 bg-background rounded-xl border border-outline/10">
                        <div className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-1">Extracted Sections</div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <div className="font-mono text-sm font-bold text-on-surface">{Object.keys(user?.resumeData as any || {}).length} Identified</div>
                      </div>
                      <div className="p-3.5 bg-background rounded-xl border border-outline/10">
                        <div className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-1">Profile Health</div>
                        <div className="font-mono text-sm font-bold text-emerald-600">Parsed & Valid</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-3 px-4 text-xs font-mono uppercase tracking-wider border border-outline/20 rounded-xl hover:border-primary/40 hover:text-primary transition-colors text-on-surface font-semibold bg-background"
                      >
                        Replace Resume
                      </button>
                      <button 
                        onClick={handleNext}
                        className="flex-1 bg-primary text-on-primary py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                      >
                        <span>Continue to Design</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-6">
                  {/* Clean Technical Container from Screenshot 2 & 3 */}
                  <div 
                    className={`w-full max-w-2xl min-h-[380px] p-8 md:p-14 bg-surface-container-low/40 backdrop-blur-xl border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                      isUploading 
                        ? 'border-emerald-500/50 bg-emerald-500/[0.03]' 
                        : 'border-outline/25 hover:border-primary/60 hover:bg-surface-container-low/70'
                    }`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center text-center py-8 z-10 animate-fade-in">
                        {/* Green Pulse Wave Indicator from Screenshot 3 */}
                        <Activity size={44} className="text-emerald-500 mb-6 animate-pulse" />
                        <div className="font-mono text-sm md:text-base text-emerald-500 font-bold mb-2 uppercase tracking-[0.18em]">
                          INGESTING TELEMETRY (RESUME)...
                        </div>
                        <div className="font-mono text-xs text-on-surface-variant/70 text-center uppercase tracking-widest max-w-sm">
                          PARSING SEMANTIC NODES AND MAPPING VECTORS
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center z-10">
                        {/* Scanning Box Icon from Screenshot 2 */}
                        <div className="w-16 h-16 bg-background/80 rounded-xl border border-outline/20 flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 group-hover:border-primary/40 transition-all">
                          <ScanLine size={30} className="text-on-surface" />
                        </div>

                        {/* Exact Header and Subtitle from Screenshot 2 */}
                        <h3 className="font-mono text-base md:text-lg font-bold text-on-surface mb-2 uppercase tracking-wider">
                          SELECT RAW DATA SOURCE (RESUME)
                        </h3>
                        <p className="font-mono text-xs text-on-surface-variant/70 uppercase tracking-widest max-w-sm mb-8 leading-relaxed">
                          UPLOAD CAREER TELEMETRY (PDF RESUME REQUIRED)
                        </p>

                        {/* Clean BROWSE SYSTEM Button */}
                        <div className="px-7 py-2.5 bg-background border border-outline/25 rounded-md font-mono text-xs uppercase tracking-widest font-bold text-on-surface group-hover:border-primary/60 group-hover:text-primary transition-all shadow-xs">
                          BROWSE SYSTEM
                        </div>
                      </div>
                    )}
                  </div>
                  {uploadError && <p className="mt-4 text-red-500 font-mono text-xs uppercase font-bold text-center">{uploadError}</p>}
                </div>
              )}
              
              <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>
          )}

          {step === 2 && (
            <div className="relative z-10 animate-fade-in-up w-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Component className="text-primary" size={22} />
                <h2 className="text-2xl font-serif font-bold tracking-tight">Select Template Design</h2>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-12 min-h-[450px]">
                {/* Left: Preview Monitor (60%) */}
                <div className="lg:w-3/5 relative rounded-lg border border-outline/10 bg-background/30 backdrop-blur-xl overflow-hidden flex flex-col">
                  {/* Monitor Header */}
                  <div className="h-8 bg-background/40 backdrop-blur-xl border-b border-outline/10 flex items-center px-4 gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    <div className="ml-auto font-mono text-[9px] text-on-surface-variant tracking-widest uppercase">
                      Target: {selectedTemplate === 'modern-developer' ? 'Dark Void' : 'Clean Protocol'}
                    </div>
                  </div>
                  
                  {/* Monitor Display */}
                  <div className="relative flex-1 bg-background/20 backdrop-blur-xl p-4 md:p-8 flex items-center justify-center overflow-hidden">
                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/40" />
                    
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    
                    {/* Scanner Line */}
                    <div className="absolute inset-0 scanner-line mix-blend-screen pointer-events-none z-20" />
                    
                    {/* Image Container */}
                    <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden shadow-xl border border-outline/10 ring-1 ring-white/5 z-10 bg-background/30 backdrop-blur-xl">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         key={selectedTemplate} 
                         src={selectedTemplate === 'modern-developer' ? 'https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png' : 'https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png'} 
                         alt="Preview" 
                         className="w-full h-full object-cover animate-fade-in-up" 
                       />
                    </div>
                  </div>
                </div>

                {/* Right: Architecture Specs (40%) */}
                <div className="lg:w-2/5 flex flex-col gap-4">
                  {[
                    { 
                      id: 'modern-developer', 
                      name: 'Dark Void (Modern)', 
                      tags: ['VIBRANT', 'INTERACTIVE', 'GEOMETRIC'],
                      palette: ['#09090b', '#10b981', '#27272a', '#fafafa'],
                      fonts: 'Geist Mono / Inter',
                      desc: 'High-contrast aesthetic with heavy use of CSS grids, animated borders, and neon accents.'
                    },
                    { 
                      id: 'software-engineer', 
                      name: 'Clean Protocol (Pro)', 
                      tags: ['MINIMAL', 'TYPOGRAPHIC', 'STRUCTURAL'],
                      palette: ['#ffffff', '#000000', '#f4f4f5', '#71717a'],
                      fonts: 'Inter / Roboto Mono',
                      desc: 'A sparse, highly readable interface focusing on negative space and typographic hierarchy.'
                    }
                  ].map(tpl => {
                    const isSelected = selectedTemplate === tpl.id;
                    return (
                      <div 
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`cursor-pointer rounded-lg border transition-all duration-300 overflow-hidden ${
                          isSelected ? 'bg-background/40 backdrop-blur-xl border-primary shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-primary/30' : 'bg-background/20 backdrop-blur-xl border-outline hover:border-primary/50'
                        }`}
                      >
                        {/* Header / Clickable area */}
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary/20' : 'border-outline-variant bg-background/30 backdrop-blur-xl'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                            </div>
                            <h3 className={`font-mono text-sm font-bold tracking-widest uppercase ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{tpl.name}</h3>
                          </div>
                        </div>
                        
                        {/* Expanded Specs */}
                        <div className={`transition-all duration-300 ease-in-out px-5 overflow-hidden ${isSelected ? 'max-h-[300px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                           <p className="font-mono text-xs text-on-surface-variant mb-5 leading-relaxed">{tpl.desc}</p>
                           
                           <div className="space-y-3 mb-6">
                             <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                               <span className="font-mono text-[10px] uppercase text-on-surface-variant">Palette</span>
                               <div className="flex gap-1">
                                 {tpl.palette.map(c => <div key={c} className="w-4 h-4 rounded-full border border-outline/20" style={{backgroundColor: c}} />)}
                               </div>
                             </div>
                             <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                               <span className="font-mono text-[10px] uppercase text-on-surface-variant">Typography</span>
                               <span className="font-mono text-[10px] text-on-surface font-bold">{tpl.fonts}</span>
                             </div>
                           </div>
                           
                           <div className="flex gap-2 flex-wrap">
                             {tpl.tags.map(t => (
                               <span key={t} className="text-[9px] font-mono border border-primary/30 bg-primary/5 px-2 py-1 rounded-sm text-primary font-bold uppercase">{t}</span>
                             ))}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto border-t border-outline-variant/50 pt-8">
                <button onClick={handleBack} className="text-xs font-mono uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2">
                  <ArrowRight size={16} className="rotate-180" /> Reconfigure Input
                </button>
                <button onClick={handleNext} className="px-8 py-4 bg-primary text-on-primary rounded-sm font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-3 hover:bg-primary/90 transition-all shadow-md">
                  Initialize Synthesis <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="relative z-10 animate-fade-in-up w-full h-full flex flex-col items-center justify-center text-center py-6">
              
              {isEnhancing ? (
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-8">
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping opacity-30" />
                    <div className="absolute inset-2 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                    <div className="relative z-10 bg-surface-container-low border border-primary/30 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary animate-pulse">
                        <rect x="3" y="3" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                        <rect x="12" y="12" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                        <line x1="9" y1="9" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-on-surface mb-2">Enhancing Your Portfolio</h3>
                  <p className="font-mono text-xs text-on-surface-variant/70 uppercase tracking-wider mb-6">
                    Polishing project descriptions, action verbs & layouts...
                  </p>

                  <div className="w-full bg-surface-container-low/80 border border-outline/15 p-4 rounded-xl text-left font-mono text-[11px] text-primary/90 leading-relaxed shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold uppercase tracking-wider">
                      <Activity size={12} className="animate-spin" /> Live Processing
                    </div>
                    <p className="opacity-80">• Refining project impact bullet points</p>
                    <p className="opacity-80">• Formatting typography hierarchy</p>
                    <p className="opacity-80">• Assembling responsive showcase</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
                  {/* Icon Header */}
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-low border border-outline/15 flex items-center justify-center mb-6 shadow-sm">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <rect x="3" y="3" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                      <rect x="12" y="12" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                      <line x1="9" y1="9" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-on-surface mb-3">
                    Choose Content Strategy
                  </h2>
                  <p className="text-on-surface-variant/70 text-sm max-w-md mb-8 leading-relaxed">
                    Decide how you'd like your resume content prepared for your live portfolio website.
                  </p>
                  
                  {/* Two Strategy Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8 text-left">
                    {/* Option 1: AI Enhanced (Recommended) */}
                    <div 
                      onClick={handleGenerate}
                      className="group cursor-pointer p-6 rounded-2xl border-2 border-primary/60 bg-primary/[0.03] hover:bg-primary/[0.07] hover:border-primary transition-all duration-200 relative flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono text-[9px] font-bold uppercase tracking-widest">
                          Recommended
                        </span>
                      </div>

                      <div>
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                          <Zap size={20} />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-on-surface mb-1.5 flex items-center gap-1.5">
                          <span>AI Enhanced</span>
                        </h4>
                        <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                          Rewrites bullet points with strong action verbs, highlights technical impact, and makes descriptions sound punchy.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-primary/15 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold group-hover:underline">
                          Generate & Launch
                        </span>
                        <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Option 2: Exact Raw Text */}
                    <div 
                      onClick={handleSkip}
                      className="group cursor-pointer p-6 rounded-2xl border border-outline/20 bg-surface-container-low/40 hover:bg-surface-container-low hover:border-outline/40 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-background border border-outline/15 text-on-surface flex items-center justify-center mb-4">
                          <SlidersHorizontal size={18} />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-on-surface mb-1.5">
                          Original Content
                        </h4>
                        <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                          Uses your exact resume wording without modifications. Perfect if you already have finely tuned copy.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-outline/10 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold group-hover:text-on-surface">
                          Use Exact Text
                        </span>
                        <ArrowRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Return Navigation */}
                  <button 
                    onClick={handleBack} 
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-on-surface-variant/70 hover:text-primary transition-colors py-2 px-4 rounded-lg"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Template Selection</span>
                  </button>
                  
                  {errorMsg && (
                    <div className="mt-6 p-4 border border-red-500/20 bg-red-500/10 text-red-600 font-mono text-xs uppercase font-bold rounded-xl w-full text-center">
                      {errorMsg}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
