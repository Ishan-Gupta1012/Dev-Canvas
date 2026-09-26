'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Terminal, ArrowRight, FileText, Component, Cpu, Activity, Server, Hexagon, Check, ScanLine, Network, Trash2 } from 'lucide-react';
import { PortfolioData, Project, Achievement } from '@/types/portfolio';

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
    <div className="flex flex-col flex-1 p-6 md:p-12 w-full max-w-[1400px] mx-auto font-sans relative text-on-surface bg-surface-container-lowest min-h-full">
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

      {/* Header */}
      <div className="mb-12 border-b border-outline-variant/30 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 w-full">
        <div className="flex-1 min-w-0 w-full">
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-3">Synthesis Engine</h1>
          <p className="text-on-surface-variant font-mono text-xs uppercase tracking-wider opacity-70 w-full">
            // Neural ingestion interface. Parsing raw telemetry into optimized architecture.
          </p>
        </div>
        <div className="flex items-center gap-4 opacity-50 shrink-0">
          <Terminal size={24} className="text-on-surface-variant" />
          <Server size={24} className="text-on-surface-variant" />
          <ScanLine size={24} className="text-on-surface-variant" />
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
              <div key={s.num} className={`relative z-10 flex gap-4 p-4 rounded-lg transition-all duration-300 ${isActive ? 'bg-surface-container-highest border border-outline shadow-sm' : isPast ? 'opacity-70' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center border font-mono text-xs font-bold transition-colors ${
                  isActive ? 'bg-primary text-on-primary border-primary shadow-sm' : 
                  isPast ? 'bg-surface-container border-primary text-primary' : 
                  'bg-surface-container border-outline text-on-surface-variant'
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
        <div className="flex-1 w-full bg-surface-container border border-outline/30 rounded-xl p-8 relative overflow-hidden shadow-lg">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />

          {step === 1 && (
            <div className="relative z-10 animate-fade-in-up w-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Network className="text-primary" size={24} />
                <h2 className="text-2xl font-display font-bold tracking-tight uppercase">Module 01: Upload Resume</h2>
              </div>
              
              {hasResume ? (
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="w-[90%] md:w-[500px] shrink-0 p-8 bg-surface-container-high border border-outline-variant rounded-lg shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                    
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-sm border border-emerald-500/20">
                          <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <div>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <div className="font-mono text-base text-emerald-600 dark:text-emerald-400 font-bold mb-1">{(user?.resumeData as any)?.personal?.name ? String((user.resumeData as any).personal.name).toUpperCase() : 'RESUME.PDF'}</div>
                          <div className="font-mono text-xs text-on-surface-variant tracking-widest">[ STATUS: UPLOADED SUCCESSFULLY ]</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleRemoveResume} 
                          title="Remove Resume"
                          className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                        <Check className="text-emerald-500" size={24} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-surface-container-highest rounded-md border border-outline-variant/50">
                        <div className="font-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">Data Extracted</div>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <div className="font-mono text-sm font-bold">{Object.keys(user?.resumeData as any || {}).length} Sections Found</div>
                      </div>
                      <div className="p-4 bg-surface-container-highest rounded-md border border-outline-variant/50">
                        <div className="font-mono text-[10px] text-on-surface-variant mb-2 uppercase tracking-widest">Parsing Quality</div>
                        <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">Excellent</div>
                      </div>
                    </div>

                    <div className="flex gap-4 w-full">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-4 text-xs font-mono uppercase tracking-widest border border-outline-variant rounded-sm hover:bg-surface-container transition-colors text-on-surface font-bold whitespace-nowrap"
                      >
                        Upload Different Resume
                      </button>
                      <button 
                        onClick={handleNext}
                        className="flex-1 bg-primary text-on-primary py-4 rounded-sm font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
                      >
                        Choose Template
                      </button>
                    </div>
                  </div>
                  
                  {isUploading && (
                    <div className="mt-8 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                      <Activity size={18} className="animate-pulse" /> Scanning new telemetry...
                    </div>
                  )}
                  {uploadError && <p className="mt-8 text-red-500 font-mono text-xs uppercase font-bold">{uploadError}</p>}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-8">
                  <div 
                    className={`w-[90%] md:w-[500px] min-h-[300px] p-8 md:p-12 bg-surface-container-lowest border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${
                      isUploading ? 'border-emerald-500/50' : 'border-outline hover:border-primary/50 hover:bg-surface-container-high'
                    }`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <>
                        <div className="absolute inset-0 scanner-line z-0" />
                        <Activity size={48} className="text-emerald-500 mb-6 relative z-10 animate-pulse" />
                        <div className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase relative z-10 tracking-widest text-center">Ingesting Telemetry (Resume)...</div>
                        <div className="font-mono text-xs text-on-surface-variant text-center uppercase tracking-widest relative z-10">Parsing semantic nodes and mapping vectors</div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-surface-container rounded-lg flex items-center justify-center mb-6 border border-outline/30 shadow-sm shrink-0">
                          <ScanLine size={32} className="text-on-surface-variant" />
                        </div>
                        <div className="font-mono text-base md:text-lg text-on-surface font-bold mb-3 uppercase tracking-wider text-center whitespace-nowrap">Select Raw Data Source (Resume)</div>
                        <div className="font-mono text-xs text-on-surface-variant text-center mb-8 uppercase tracking-widest max-w-[300px] leading-relaxed">Upload career telemetry (PDF Resume required)</div>
                        <button className="px-8 py-3 bg-surface-container-high border border-primary/30 text-primary rounded-sm font-mono text-xs uppercase tracking-widest font-bold hover:bg-primary/10 transition-colors shrink-0">
                          Browse System
                        </button>
                      </>
                    )}
                  </div>
                  {uploadError && <p className="mt-6 text-red-500 font-mono text-xs uppercase font-bold text-center">{uploadError}</p>}
                </div>
              )}
              
              <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </div>
          )}

          {step === 2 && (
            <div className="relative z-10 animate-fade-in-up w-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Component className="text-primary" size={24} />
                <h2 className="text-2xl font-display font-bold tracking-tight uppercase">Module 02: Architecture Selection</h2>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-12 min-h-[450px]">
                {/* Left: Preview Monitor (60%) */}
                <div className="lg:w-3/5 relative rounded-lg border border-outline/50 bg-surface-container overflow-hidden shadow-inner flex flex-col">
                  {/* Monitor Header */}
                  <div className="h-8 bg-surface-container-highest border-b border-outline/30 flex items-center px-4 gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    <div className="ml-auto font-mono text-[9px] text-on-surface-variant tracking-widest uppercase">
                      Target: {selectedTemplate === 'modern-developer' ? 'Dark Void' : 'Clean Protocol'}
                    </div>
                  </div>
                  
                  {/* Monitor Display */}
                  <div className="relative flex-1 bg-surface-container-lowest p-4 md:p-8 flex items-center justify-center overflow-hidden">
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
                    <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden shadow-2xl border border-outline/20 ring-1 ring-white/5 z-10 bg-surface-container">
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
                          isSelected ? 'bg-surface-container-highest border-primary shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-primary/30' : 'bg-surface-container-lowest border-outline hover:border-primary/50'
                        }`}
                      >
                        {/* Header / Clickable area */}
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary/20' : 'border-outline-variant'}`}>
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
            <div className="relative z-10 animate-fade-in-up w-full h-full flex flex-col items-center justify-center text-center py-12">
              
              {isEnhancing ? (
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
                  <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
                    {/* Core Rings */}
                    <div className="absolute inset-0 border border-primary/30 rounded-full core-ring-1" />
                    <div className="absolute inset-2 border-2 border-dashed border-primary/50 rounded-full core-ring-2" />
                    <div className="absolute inset-8 border border-primary/40 rounded-full core-ring-1 opacity-70" />
                    
                    {/* Glowing Core */}
                    <div className="absolute inset-16 bg-primary rounded-full blur-xl opacity-20 animate-pulse" />
                    <div className="relative z-10 bg-surface-container-highest border border-primary/50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                      <Cpu size={28} className="text-primary animate-pulse" />
                    </div>
                    
                    {/* Scanning Line overlay */}
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                       <div className="absolute inset-0 scanner-line" />
                    </div>
                  </div>
                  
                  <div className="font-mono text-lg text-primary font-bold uppercase tracking-[0.2em] mb-6">Neural Synthesis Active</div>
                  <div className="w-full bg-surface-container-highest border border-outline-variant p-5 rounded-sm text-left h-36 overflow-hidden relative shadow-inner">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-highest z-10 pointer-events-none" />
                     <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold leading-loose uppercase animate-fade-in-up">
                       &gt; Extracting semantic nodes...<br/>
                       &gt; Aligning vector syntax...<br/>
                       &gt; Optimizing descriptive metrics...<br/>
                       &gt; Structuring matrix layouts...<br/>
                       &gt; Injecting robust vocabulary arrays...<br/>
                       &gt; Compiling final architecture...
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-[90%] md:w-[500px] mx-auto">
                  <div className="w-24 h-24 relative flex items-center justify-center mb-8 shrink-0">
                    <div className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-full animate-pulse" />
                    <Cpu size={36} className="text-primary relative z-10" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase mb-4 text-center whitespace-nowrap">Module 03: Content Generation</h2>
                  <p className="text-on-surface-variant font-mono text-xs leading-relaxed uppercase tracking-widest max-w-[450px] mb-12 text-center">
                    Your data is ready. We can use AI to automatically enhance, rewrite, and optimize your resume into a high-impact narrative. Alternatively, you can skip the AI and use your exact raw text.
                  </p>
                  
                  <div className="flex flex-col w-full gap-4 shrink-0">
                    <button 
                      onClick={handleGenerate}
                      className="w-full min-w-[250px] bg-primary text-on-primary py-4 rounded-sm font-mono text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-md relative overflow-hidden group whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                      <Cpu size={20} className="relative z-10 shrink-0" /> 
                      <span className="relative z-10">Generate with AI (Recommended)</span>
                    </button>
                    <button 
                      onClick={handleSkip}
                      className="w-full bg-surface-container-high border border-outline text-on-surface py-4 rounded-sm font-mono text-xs uppercase tracking-widest font-bold hover:bg-surface-container-highest hover:border-outline-variant transition-all whitespace-nowrap"
                    >
                      Skip AI & Use Raw Text
                    </button>
                    <button onClick={handleBack} className="mt-6 text-xs font-mono uppercase tracking-widest font-bold text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap shrink-0">
                      [ Return to Architecture ]
                    </button>
                  </div>
                  
                  {errorMsg && (
                    <div className="mt-8 p-4 border border-red-500/30 bg-red-500/10 text-red-600 font-mono text-sm uppercase font-bold rounded-sm w-full">
                      [ERROR]: {errorMsg}
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
