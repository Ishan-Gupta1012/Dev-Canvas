'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  GraduationCap,
  Target,
  Plus,
  X,
  FileText,
  Copy,
  Check,
  Wand2,
  HelpCircle,
  Info,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobDetails, JobAnalysisResult } from '@/lib/resume/jobAnalyzer';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

// Comprehensive options for searchable dropdowns
export const JOB_TITLE_OPTIONS = [
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Data Analyst',
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Web Developer',
  'Python Developer',
  'DevOps Engineer',
  'Cloud Engineer / Cloud Architect',
  'Mobile Developer (iOS / Android)',
  'Cybersecurity Engineer',
  'QA / Test Automation Engineer',
  'Product Manager (Technical)',
  'Solutions Architect',
  'Systems Engineer',
  'Site Reliability Engineer (SRE)',
  'Database Administrator (DBA)',
  'UI/UX Engineer',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  'Computer Vision Engineer',
  'NLP Engineer',
  'Other'
];

export const JOB_LOCATION_OPTIONS = [
  'Remote (Worldwide)',
  'Remote (United States)',
  'Remote (Europe)',
  'Remote (Asia-Pacific)',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Iceland',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'Japan',
  'Spain',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Brazil',
  'Saudi Arabia',
  'South Korea',
  'China',
  'Poland',
  'New Zealand',
  'Mexico',
  'South Africa',
  'Argentina',
  'Austria',
  'Belgium',
  'Chile',
  'Colombia',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Finland',
  'Greece',
  'Hong Kong',
  'Hungary',
  'Malaysia',
  'Norway',
  'Pakistan',
  'Philippines',
  'Portugal',
  'Qatar',
  'Romania',
  'Thailand',
  'Turkey',
  'Vietnam',
  'Other'
];

export const JOB_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
  'Remote',
  'Hybrid',
  'On-site',
  'Other'
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  'Entry Level (0-1 years)',
  'Junior Level (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior Level (5-8 years)',
  'Lead / Staff (8+ years)',
  'Principal / Architect (10+ years)',
  'Director / Executive (12+ years)',
  'Internship / Student',
  'Not Specified / Any Experience',
  'Other'
];

export const EDUCATION_LEVEL_OPTIONS = [
  "Bachelor's in Computer Science or related field",
  "Master's in Computer Science / Engineering",
  'Ph.D. / Doctorate in technical field',
  'Associate Degree in Software / IT',
  'Coding Bootcamp Graduate',
  'Self-Taught / Equivalent Practical Experience',
  'High School Diploma / GED',
  'Not Specified / Any Background',
  'Other'
];

export const INDUSTRY_OPTIONS = [
  'Technology & Software (SaaS)',
  'Financial Services & FinTech',
  'Artificial Intelligence & Machine Learning',
  'Healthcare & HealthTech',
  'E-Commerce & Retail',
  'Cloud Computing & Infrastructure',
  'Cybersecurity & Information Security',
  'Media, Entertainment & Gaming',
  'Education & EdTech',
  'Telecommunications',
  'Automotive & Aerospace',
  'Consulting & Professional Services',
  'Non-Profit & Government',
  'Other'
];

// Preset sample jobs for instant testing
const SAMPLE_JOBS: { label: string; details: JobDetails }[] = [
  {
    label: 'Senior Full-Stack Engineer (React & Node)',
    details: {
      title: 'Senior Full-Stack Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA (Hybrid / Remote)',
      jobType: 'Full-time',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'REST APIs', 'CI/CD'],
      experienceRequirement: '4+ years of professional full-stack web development experience',
      educationRequirement: "Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience",
      description: `We are looking for a Senior Full-Stack Engineer to architect, build, and scale world-class financial infrastructure and developer dashboards.

Responsibilities:
- Build highly responsive, accessible web interfaces using React, Next.js, and TypeScript.
- Design scalable backend microservices and RESTful / GraphQL APIs in Node.js and PostgreSQL.
- Partner with product managers and designers to launch mission-critical payment workflows.
- Champion code quality, comprehensive automated testing (Jest, Cypress), and CI/CD pipelines.
- Optimize web vitals, latency, and distributed database performance.

Requirements:
- 4+ years building production web applications in TypeScript, React, and Node.js.
- Strong understanding of relational databases (PostgreSQL) and cloud infrastructure (AWS or GCP).
- Experience containerizing services with Docker and deploying via automated pipelines.
- Demonstrated problem solving, ownership mindset, and excellent cross-functional communication.`,
      otherRequirements: 'Experience with financial systems, payment gateways, or SOC2 compliance is a plus.'
    }
  },
  {
    label: 'Frontend Developer (Next.js & UI/UX)',
    details: {
      title: 'Frontend Developer',
      company: 'Vercel',
      location: 'Remote (Worldwide)',
      jobType: 'Full-time',
      requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Performance Optimization', 'Git'],
      experienceRequirement: '2-4 years of modern frontend experience',
      educationRequirement: "Bachelor's degree or equivalent technical experience",
      description: `Join our team to build next-generation web applications with delightful user experiences.

Responsibilities:
- Develop modern, responsive web applications using React, Next.js (App Router), and Tailwind CSS.
- Translate Figma designs into pixel-perfect, accessible, and performant user interfaces.
- Collaborate with designers to evolve our design system and interactive component library.
- Profile and improve Core Web Vitals, caching strategies, and asset bundling.

Requirements:
- 2+ years of professional React experience with a strong command of TypeScript and CSS.
- Deep familiarity with Next.js features (Server Components, streaming, API routes).
- Passion for animations, micro-interactions, and accessibility standards (WCAG).`,
      otherRequirements: 'Portfolio of live web applications or open source contributions required.'
    }
  },
  {
    label: 'Cloud & DevOps Engineer (AWS & K8s)',
    details: {
      title: 'DevOps / Cloud Infrastructure Engineer',
      company: 'Datadog',
      location: 'New York, NY (Hybrid)',
      jobType: 'Full-time',
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Python'],
      experienceRequirement: '3+ years managing production cloud platforms',
      educationRequirement: "BS in Computer Science, Engineering, or relevant industry experience",
      description: `We are seeking an Infrastructure Engineer to scale our cloud platforms and CI/CD automation.

Key Responsibilities:
- Manage multi-region cloud infrastructure on AWS using Terraform and infrastructure-as-code.
- Build and maintain Kubernetes clusters, service meshes, and deployment pipelines.
- Automate build and release workflows using GitHub Actions and ArgoCD.
- Monitor system reliability, uptime, and latency with Datadog and Prometheus.
- Implement security best practices, zero-trust policies, and incident response runbooks.

Requirements:
- 3+ years in DevOps, SRE, or Cloud Engineering.
- Deep expertise with Docker container orchestration in Kubernetes.
- Strong scripting skills in Python or Bash.`,
      otherRequirements: 'AWS Solutions Architect or CKA certification preferred.'
    }
  }
];

const SAMPLE_CANDIDATE_RESUME = {
  fileName: 'Alex_Chen_FullStack_Resume.pdf',
  fileSize: '142 KB',
  rawText: `Alex Chen
San Francisco, CA | alex.chen@email.com | (555) 123-4567 | github.com/alexchen | linkedin.com/in/alexchen

PROFESSIONAL SUMMARY
Full-Stack Developer with 3+ years of experience engineering scalable web applications and distributed APIs using React, TypeScript, Node.js, and PostgreSQL. Passionate about clean architecture, performance optimization, and developer productivity.

SKILLS
- Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Responsive Web Design
- Backend: Node.js, Express.js, RESTful APIs, GraphQL
- Databases: PostgreSQL, MongoDB, Redis, Prisma
- Cloud & DevOps: AWS (S3, EC2), Docker, Git, CI/CD (GitHub Actions)
- Testing: Jest, React Testing Library

EXPERIENCE
Software Engineer | NexaTech Systems (Jan 2022 - Present)
- Architected and shipped 6 core web microservices using React, TypeScript, and Node.js serving 120,000+ daily active users.
- Built reusable UI component system reducing frontend feature delivery turnaround by 30%.
- Designed and optimized PostgreSQL database queries, reducing API latency from 450ms to 95ms.
- Implemented CI/CD pipelines using GitHub Actions for automated unit testing and Docker deployments on AWS.

Junior Web Developer | CloudBridge Labs (Jun 2020 - Dec 2021)
- Built interactive customer dashboards with React and Redux, integrating RESTful backends.
- Developed automated test suites in Jest achieving 85% code coverage across frontend modules.
- Collaborated in an agile scrum team participating in bi-weekly sprints and peer code reviews.

EDUCATION
Bachelor of Science in Computer Science (2016 - 2020)
University of California, Davis | GPA: 3.7 / 4.0

PROJECTS
DevStream (Real-time Developer Collaboration Tool)
- Tech Stack: React, Next.js, Node.js, Socket.io, Redis, Tailwind CSS
- Built real-time code collaboration workspace with presence indicators and collaborative whiteboard.
- Deployed on AWS with automated Docker workflows.`,
  resumeData: {
    personal: {
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      phone: '(555) 123-4567',
      role: 'Full-Stack Developer',
      location: 'San Francisco, CA',
      bio: 'Full-Stack Developer with 3+ years of experience engineering scalable web applications.',
      github: 'https://github.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen'
    },
    experience: [
      {
        id: '1',
        role: 'Software Engineer',
        company: 'NexaTech Systems',
        duration: 'Jan 2022 - Present (2.5 years)',
        description: 'Architected and shipped core web microservices using React, TypeScript, and Node.js.',
        achievements: [
          'Built reusable UI component system reducing turnaround by 30%',
          'Optimized PostgreSQL queries reducing latency from 450ms to 95ms',
          'Implemented CI/CD pipelines via GitHub Actions and Docker'
        ],
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'CI/CD']
      },
      {
        id: '2',
        role: 'Junior Web Developer',
        company: 'CloudBridge Labs',
        duration: 'Jun 2020 - Dec 2021 (1.5 years)',
        description: 'Built interactive customer dashboards with React and Redux.',
        achievements: ['Developed automated test suites in Jest achieving 85% coverage'],
        technologies: ['React', 'Redux', 'JavaScript', 'Jest', 'REST APIs']
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Davis',
        year: '2016 - 2020',
        gpa: '3.7'
      }
    ],
    skills: [
      { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'SQL'] },
      { category: 'Frontend', items: ['React', 'Next.js', 'Redux', 'Tailwind CSS'] },
      { category: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL'] },
      { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
      { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Git', 'CI/CD'] }
    ],
    projects: [
      {
        id: '1',
        title: 'DevStream Collaboration Platform',
        description: 'Real-time collaborative workspace with presence indicators and live markdown.',
        technologies: ['React', 'Next.js', 'Node.js', 'Redis', 'AWS']
      }
    ]
  }
};

export default function ResumeAnalyzerPage() {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [cachedResumeText, setCachedResumeText] = useState<string>('');
  const [cachedResumeData, setCachedResumeData] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  // Job Details state
  const [jobTab, setJobTab] = useState<'form' | 'paste'>('form');
  const [pastedJD, setPastedJD] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isExtractingJD, setIsExtractingJD] = useState(false);
  const [jobData, setJobData] = useState<JobDetails>({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    requiredSkills: [],
    experienceRequirement: '',
    educationRequirement: '',
    description: '',
    otherRequirements: '',
    industry: ''
  });

  // Analysis status & results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null);
  const [copiedSuggestions, setCopiedSuggestions] = useState(false);

  // Handle file selection
  const handleFile = (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.docx') && !selected.name.endsWith('.pdf')) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    setFile(selected);
    setCachedResumeText('');
    setCachedResumeData(null);
    setAnalysis(null);
    setAnalysisError(null);
  };

  const handleLoadSampleResume = () => {
    const sampleBlob = new Blob([SAMPLE_CANDIDATE_RESUME.rawText], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], SAMPLE_CANDIDATE_RESUME.fileName, { type: 'application/pdf' });
    setFile(sampleFile);
    setCachedResumeText(SAMPLE_CANDIDATE_RESUME.rawText);
    setCachedResumeData(SAMPLE_CANDIDATE_RESUME.resumeData);
    setAnalysis(null);
    setAnalysisError(null);
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

  // Add / remove skill tags
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !jobData.requiredSkills.includes(trimmed)) {
      setJobData(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, trimmed] }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }));
  };

  // Apply a sample job
  const handleApplySample = (sample: typeof SAMPLE_JOBS[0]) => {
    setJobData({ ...sample.details });
    setPastedJD(sample.details.description);
    setAnalysisError(null);
  };

  // Auto-extract job details from pasted text
  const handleAutoExtractJD = async () => {
    if (!pastedJD.trim()) {
      alert('Please paste a job description first.');
      return;
    }
    setIsExtractingJD(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract-job', rawText: pastedJD })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setJobData(prev => ({
          ...prev,
          title: data.data.title || prev.title,
          company: data.data.company || prev.company,
          location: data.data.location || prev.location,
          jobType: data.data.jobType || prev.jobType || 'Full-time',
          experienceRequirement: data.data.experienceRequirement || prev.experienceRequirement,
          educationRequirement: data.data.educationRequirement || prev.educationRequirement,
          requiredSkills: Array.from(new Set([...prev.requiredSkills, ...(data.data.requiredSkills || [])])),
          description: pastedJD,
        }));
        setJobTab('form');
      }
    } catch (err) {
      console.error('Failed to extract job details', err);
    } finally {
      setIsExtractingJD(false);
    }
  };

  // Run comprehensive Job-Specific Analysis
  const runAnalysis = async () => {
    if (!file && !cachedResumeText) {
      setAnalysisError('Please upload a resume file (PDF or DOCX).');
      return;
    }

    const currentTitle = jobData.title.trim() || (pastedJD.split('\n')[0] || '').slice(0, 50).trim();
    const currentDesc = jobData.description.trim() || pastedJD.trim();

    if (!currentTitle && !currentDesc && jobData.requiredSkills.length === 0) {
      setAnalysisError('Please enter a Job Title and paste or enter the Job Description / Required Skills.');
      return;
    }

    const compiledJobData: JobDetails = {
      ...jobData,
      title: currentTitle || 'Target Position',
      description: currentDesc || 'Standard role requirements based on declared skills.',
    };

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      let res: Response;

      // If we already have the resume text cached, analyze directly
      if (cachedResumeText) {
        res = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: cachedResumeText,
            resumeData: cachedResumeData,
            jobData: compiledJobData,
            fileName: file ? file.name : 'Uploaded-Resume.pdf',
            fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : '142 KB'
          })
        });
      } else {
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('jobData', JSON.stringify(compiledJobData));

        res = await fetch('/api/resume/analyze', {
          method: 'POST',
          body: formData
        });
      }

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Failed to analyze resume against job description.');
      }

      setAnalysis(result.data);
      if (result.extractedResumeText) {
        setCachedResumeText(result.extractedResumeText);
      }
      if (result.resumeData) {
        setCachedResumeData(result.resumeData);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalysisError(err?.message || 'Failed to complete analysis. Please check file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy suggestions to clipboard
  const copySuggestions = () => {
    if (!analysis) return;
    const text = analysis.suggestions.map((s, idx) => `${idx + 1}. [${s.priority.toUpperCase()}] ${s.title}\n   Action: ${s.action}\n   Impact: ${s.impact}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedSuggestions(true);
    setTimeout(() => setCopiedSuggestions(false), 2500);
  };

  // Color helper functions
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-700 dark:text-amber-400';
    return 'text-rose-700 dark:text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200';
    return 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-screen space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant/80 mb-1 flex items-center gap-1.5">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-primary font-semibold">Job-Specific Resume Analyzer</span>
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Job-Specific Resume Analyzer
        </h1>
        <p className="text-on-surface-variant text-sm sm:text-base mt-1.5 max-w-3xl">
          Compare your resume against a specific target role. Identify matching qualifications, pinpoint missing skills, and receive tailored ATS improvements to maximize your shortlisting chances.
        </p>
      </div>

      {/* Quick Sample Selector */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-on-surface">
          <Sparkles size={16} className="text-primary shrink-0" />
          <span>Quick Test: Try a pre-configured target job:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_JOBS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-container-low hover:bg-primary/10 hover:text-primary text-on-surface-variant border border-outline-variant/50 transition-colors"
            >
              {sample.label.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Section: Resume Upload (Left) & Job Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resume Upload (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
              <FileSearch size={18} className="text-primary" />
              1. Upload Your Resume
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">PDF or DOCX</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !file && document.getElementById('analyzer-file-input')?.click()}
            className={`bg-surface-container-lowest border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all min-h-[360px] relative ${
              dragActive
                ? 'border-primary bg-primary-container/10 scale-[0.99]'
                : file
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-outline-variant hover:border-primary/50 cursor-pointer'
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
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mb-4 text-on-surface-variant shadow-sm border border-outline-variant/30">
                  <UploadCloud size={30} className="text-primary" />
                </div>
                <h3 className="font-bold text-base text-on-surface mb-1">Upload Candidate Resume</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm mb-4 max-w-xs">
                  Drag and drop your file here, or click to browse local files.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('analyzer-file-input')?.click();
                    }}
                    className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95"
                  >
                    Choose Resume File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadSampleResume();
                    }}
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-medium text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-primary" />
                    Load Sample Resume
                  </button>
                </div>
                <div className="mt-5 pt-4 border-t border-outline-variant/40 text-[11px] text-on-surface-variant/80 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-tertiary" />
                  <span>Supports ATS formatting, standard text, and LaTeX PDFs</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                  <FileText size={28} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-on-surface text-sm sm:text-base break-all">{file.name}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB &bull; Ready for comparison</p>
                </div>

                <div className="w-full bg-surface-container-low/80 p-3 rounded-xl border border-outline-variant/40 text-left text-xs space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Target Verification:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Check size={13} /> Loaded
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Parsing Engine:</span>
                    <span className="font-mono text-[11px] text-on-surface">Dual ATS & Semantic</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('analyzer-file-input')?.click();
                    }}
                    className="px-3 py-1.5 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors"
                  >
                    Replace File
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setCachedResumeText('');
                      setCachedResumeData(null);
                      setAnalysis(null);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dedicated Job Details Panel (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              2. Target Job Opening Details
            </h2>
            {/* Mode switch */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/50 text-xs font-medium">
              <button
                type="button"
                onClick={() => setJobTab('form')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  jobTab === 'form' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Structured Fields
              </button>
              <button
                type="button"
                onClick={() => setJobTab('paste')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  jobTab === 'paste' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Paste Full JD
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            {jobTab === 'paste' ? (
              /* Paste Full JD Mode */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="pasted-jd-textarea" className="text-xs font-semibold text-on-surface uppercase tracking-wider">
                    Paste Complete Job Posting
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoExtractJD}
                    disabled={isExtractingJD || !pastedJD.trim()}
                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isExtractingJD ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    {isExtractingJD ? 'Extracting...' : 'Auto-Extract Fields'}
                  </button>
                </div>
                <textarea
                  id="pasted-jd-textarea"
                  rows={10}
                  value={pastedJD}
                  onChange={(e) => {
                    setPastedJD(e.target.value);
                    setJobData(prev => ({ ...prev, description: e.target.value }));
                  }}
                  placeholder="Paste the job opening text here (Role title, company, requirements, responsibilities, skills, qualifications)..."
                  className="w-full p-3.5 rounded-xl border border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono leading-relaxed"
                />
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <Info size={12} className="shrink-0" />
                  <span>Click <strong>Auto-Extract Fields</strong> to automatically fill Job Title, Skills, and Experience from this text.</span>
                </p>
              </div>
            ) : (
              /* Structured Fields Mode */
              <div className="space-y-4">
                {/* Title & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <SearchableDropdown
                      id="job-title-dropdown"
                      label="Job Title"
                      icon={<Briefcase size={12} />}
                      required
                      options={JOB_TITLE_OPTIONS}
                      value={jobData.title}
                      onChange={(val) => setJobData(prev => ({ ...prev, title: val }))}
                      placeholder="Search or select job title (e.g. AI Engineer, Full Stack...)"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-name-input" className="block text-xs font-semibold text-on-surface mb-1 flex items-center gap-1">
                      <Building2 size={12} /> Company Name
                    </label>
                    <input
                      id="company-name-input"
                      type="text"
                      value={jobData.company}
                      onChange={(e) => setJobData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Stripe, Google, Startup"
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                {/* Location & Job Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <SearchableDropdown
                      id="location-dropdown"
                      label="Job Location"
                      icon={<MapPin size={12} />}
                      options={JOB_LOCATION_OPTIONS}
                      value={jobData.location || ''}
                      onChange={(val) => setJobData(prev => ({ ...prev, location: val }))}
                      placeholder="Type country (e.g. India, United States...) or Remote"
                    />
                  </div>
                  <div>
                    <SearchableDropdown
                      id="job-type-dropdown"
                      label="Job Type"
                      icon={<Clock size={12} />}
                      options={JOB_TYPE_OPTIONS}
                      value={jobData.jobType || 'Full-time'}
                      onChange={(val) => setJobData(prev => ({ ...prev, jobType: val }))}
                      placeholder="Select or search job type..."
                    />
                  </div>
                </div>

                {/* Required Skills Tag Input */}
                <div>
                  <label htmlFor="required-skill-input" className="block text-xs font-semibold text-on-surface mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Target size={12} /> Required Skills & Tech Stack
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-normal">
                      Press enter or comma to add
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="required-skill-input"
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Type skill (e.g. React, AWS, Docker) and click Add"
                      className="flex-1 px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {jobData.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {jobData.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium flex items-center gap-1.5"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="hover:text-rose-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience & Education Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <SearchableDropdown
                      id="experience-req-dropdown"
                      label="Experience Requirements"
                      icon={<Clock size={12} />}
                      options={EXPERIENCE_LEVEL_OPTIONS}
                      value={jobData.experienceRequirement || ''}
                      onChange={(val) => setJobData(prev => ({ ...prev, experienceRequirement: val }))}
                      placeholder="Select or search experience level..."
                    />
                  </div>
                  <div>
                    <SearchableDropdown
                      id="education-req-dropdown"
                      label="Education Requirements"
                      icon={<GraduationCap size={12} />}
                      options={EDUCATION_LEVEL_OPTIONS}
                      value={jobData.educationRequirement || ''}
                      onChange={(val) => setJobData(prev => ({ ...prev, educationRequirement: val }))}
                      placeholder="Select or search education requirement..."
                    />
                  </div>
                </div>

                {/* Industry / Domain & Additional Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <SearchableDropdown
                      id="industry-dropdown"
                      label="Industry / Domain"
                      icon={<Building2 size={12} />}
                      options={INDUSTRY_OPTIONS}
                      value={jobData.industry || ''}
                      onChange={(val) => setJobData(prev => ({ ...prev, industry: val }))}
                      placeholder="Select or search industry (e.g. FinTech, AI, SaaS)..."
                    />
                  </div>
                  <div>
                    <label htmlFor="other-requirements-input" className="block text-xs font-semibold text-on-surface mb-1 flex items-center gap-1">
                      <Target size={12} /> Other Requirements / Preferences
                    </label>
                    <input
                      id="other-requirements-input"
                      type="text"
                      value={jobData.otherRequirements || ''}
                      onChange={(e) => setJobData(prev => ({ ...prev, otherRequirements: e.target.value }))}
                      placeholder="e.g. Security clearance, SOC2, relocation..."
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                {/* Full Description Textarea */}
                <div>
                  <label htmlFor="job-description-textarea" className="block text-xs font-semibold text-on-surface mb-1">
                    Job Description & Responsibilities
                  </label>
                  <textarea
                    id="job-description-textarea"
                    rows={4}
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Paste role description, key responsibilities, or project context..."
                    className="w-full p-3 rounded-xl border border-outline-variant/60 bg-surface-container-low text-xs sm:text-sm text-on-surface focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action / Trigger Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-on-surface text-sm sm:text-base">
            Ready to compare Resume vs Target Job?
          </h3>
          <p className="text-on-surface-variant text-xs sm:text-sm">
            {!file && !cachedResumeText
              ? 'Please upload your resume to begin.'
              : !jobData.title && !jobData.description && jobData.requiredSkills.length === 0
              ? 'Please provide at least a Job Title and Description/Skills on the right.'
              : `Comparing candidate profile against ${jobData.title || 'target job'} ${jobData.company ? `@ ${jobData.company}` : ''}.`}
          </p>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
          disabled={isAnalyzing || (!file && !cachedResumeText)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isAnalyzing && <RefreshCw size={16} className="animate-spin" />}
          {isAnalyzing ? 'Analyzing Resume vs Job...' : 'Analyze Match & Get Recommendations'}
        </button>
      </div>

      {/* Error Banner */}
      {analysisError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Analysis Notice</p>
            <p className="text-xs sm:text-sm mt-0.5">{analysisError}</p>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-8 pt-4"
          >
            {/* Comparison Overview Dossier Header */}
            <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
                {/* Candidate Resume Info */}
                <div className="flex-1 bg-surface-container-low/70 p-4 rounded-xl border border-outline-variant/40">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                    Candidate Resume
                  </p>
                  <p className="text-base font-bold text-on-surface mt-1 truncate">
                    {analysis.resumeSnapshot?.fileName || 'Uploaded Resume'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-on-surface-variant">
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      Candidate: {analysis.resumeSnapshot?.candidateName || 'Applicant'}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      Skills found: {analysis.resumeSnapshot?.totalSkillsCount || analysis.matchingSkills.length}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      Exp: {analysis.resumeSnapshot?.totalExperienceYears || 'Documented'}
                    </span>
                  </div>
                </div>

                {/* VS & Prominent Match Score */}
                <div className="flex flex-col items-center justify-center px-4 py-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    Job Match Alignment
                  </span>
                  <div className={`flex items-baseline gap-1 px-6 py-2.5 rounded-2xl border ${getScoreBg(analysis.matchScore)}`}>
                    <span className={`text-4xl sm:text-5xl font-black tracking-tight ${getScoreColor(analysis.matchScore)}`}>
                      {analysis.matchScore}%
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium mt-1">
                    {analysis.matchScore >= 80 ? 'High Candidate Fit' : analysis.matchScore >= 60 ? 'Moderate Alignment' : 'Substantial Gap'}
                  </span>
                </div>

                {/* Target Job Info */}
                <div className="flex-1 bg-surface-container-low/70 p-4 rounded-xl border border-outline-variant/40">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                    Target Job Opening
                  </p>
                  <p className="text-base font-bold text-on-surface mt-1 truncate">
                    {analysis.jobSnapshot?.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-on-surface-variant">
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      {analysis.jobSnapshot?.company || 'Company'}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      {analysis.jobSnapshot?.location || 'Flexible'}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container rounded-md">
                      {analysis.jobSnapshot?.jobType || 'Full-time'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Score Breakdown Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-outline-variant/50">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">Skills Match</span>
                    <span className="font-bold text-on-surface">{analysis.scoreBreakdown.skillsScore}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.scoreBreakdown.skillsScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">Experience Fit</span>
                    <span className="font-bold text-on-surface">{analysis.scoreBreakdown.experienceScore}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-tertiary h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.scoreBreakdown.experienceScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">Education Match</span>
                    <span className="font-bold text-on-surface">{analysis.scoreBreakdown.educationScore}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.scoreBreakdown.educationScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">ATS Keyword Fit</span>
                    <span className="font-bold text-on-surface">{analysis.scoreBreakdown.keywordScore}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysis.scoreBreakdown.keywordScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Comparison: Matched vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                      <CheckCircle2 className="text-emerald-600" size={20} />
                      Matching Skills ({analysis.matchingSkills.length})
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20">
                      Validated in Resume
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">
                    These qualifications were successfully identified in your resume and align with {analysis.jobSnapshot.title}:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingSkills.length > 0 ? (
                      analysis.matchingSkills.map((sk) => (
                        <span
                          key={sk.name}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5"
                        >
                          <Check size={12} className="text-emerald-600" />
                          <span>{sk.name}</span>
                          {sk.category && (
                            <span className="text-[10px] text-emerald-700/70 font-normal">({sk.category})</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-on-surface-variant italic">No exact skill matches identified against declared criteria.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                      <AlertTriangle className="text-amber-600" size={20} />
                      Missing Skills ({analysis.missingSkills.length})
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-semibold border border-amber-500/20">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Skills requested in this job posting that were not detected in your resume:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.length > 0 ? (
                      analysis.missingSkills.map((sk) => (
                        <span
                          key={sk.name}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                            sk.importance === 'critical'
                              ? 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <AlertCircle size={12} className={sk.importance === 'critical' ? 'text-rose-600' : 'text-amber-600'} />
                          <span>{sk.name}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${
                            sk.importance === 'critical' ? 'text-rose-700' : 'text-amber-700'
                          }`}>
                            [{sk.importance}]
                          </span>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-700 font-medium">All declared job skills are covered in your resume!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience & Education Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Assessment */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    Relevant Experience Match
                  </h3>
                  <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                    {analysis.experienceMatch.score}% Fit
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl text-xs space-y-2 border border-outline-variant/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-on-surface-variant font-medium">Job Requirement:</span>
                    <span className="font-semibold text-on-surface text-right">{analysis.experienceMatch.required}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-on-surface-variant font-medium">Candidate Background:</span>
                    <span className="font-semibold text-on-surface text-right">{analysis.experienceMatch.candidateSummary}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  {analysis.experienceMatch.assessment}
                </p>

                {analysis.experienceMatch.matchingPoints.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Matching Highlights:</p>
                    {analysis.experienceMatch.matchingPoints.map((pt, i) => (
                      <p key={i} className="text-xs text-on-surface-variant flex items-start gap-1.5">
                        <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </p>
                    ))}
                  </div>
                )}

                {analysis.experienceMatch.gapsOrUnstated.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Gaps or Unstated Information:</p>
                    {analysis.experienceMatch.gapsOrUnstated.map((pt, i) => (
                      <p key={i} className="text-xs text-on-surface-variant flex items-start gap-1.5">
                        <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Assessment */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" />
                    Education Requirements Match
                  </h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    analysis.educationMatch.status === 'matched'
                      ? 'bg-emerald-500/10 text-emerald-700'
                      : analysis.educationMatch.status === 'partial'
                      ? 'bg-amber-500/10 text-amber-700'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {analysis.educationMatch.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-surface-container-low p-3.5 rounded-xl text-xs space-y-2 border border-outline-variant/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-on-surface-variant font-medium">Position Criteria:</span>
                    <span className="font-semibold text-on-surface text-right">{analysis.educationMatch.required}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-on-surface-variant font-medium">Candidate Degree:</span>
                    <span className="font-semibold text-on-surface text-right truncate max-w-[200px]">{analysis.educationMatch.candidateSummary}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  {analysis.educationMatch.assessment}
                </p>

                <div className="p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant flex items-center gap-2">
                  <Award size={16} className="text-primary shrink-0" />
                  <span>
                    Distinction: Academic criteria verify educational relevance while respecting equivalent hands-on experience.
                  </span>
                </div>
              </div>
            </div>

            {/* ATS Missing & Matched Keywords */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-on-surface flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    ATS Keywords & Terminology Scan
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    ATS filters scan for exact terms mentioned in the job posting.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Keywords */}
                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Matched ATS Keywords ({analysis.keywords.matched.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keywords.matched.slice(0, 16).map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-md text-[11px] font-mono font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Missing Keywords in Resume ({analysis.keywords.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keywords.missing.slice(0, 16).map((kw) => (
                      <span key={kw} className="px-2 py-1 bg-amber-500/10 text-amber-800 dark:text-amber-300 rounded-md text-[11px] font-mono font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses (Job-Specific) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 size={20} />
                  Role Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <AlertCircle size={20} />
                  Gaps & Areas of Concern
                </h3>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prioritized Actionable Improvement Suggestions */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-on-surface flex items-center gap-2">
                    <Lightbulb size={22} className="text-primary" />
                    Targeted Resume Optimization Plan
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                    Actionable, prioritized edits specifically customized for {analysis.jobSnapshot.title}:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copySuggestions}
                  className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedSuggestions ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedSuggestions ? 'Copied!' : 'Copy Action Items'}
                </button>
              </div>

              <div className="space-y-4">
                {analysis.suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border border-outline-variant/60 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          item.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                            : item.priority === 'medium'
                            ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-xs font-semibold text-on-surface-variant capitalize">
                          [{item.category}]
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant font-mono">#{idx + 1}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-on-surface">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>Action:</strong> {item.action}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 pt-1">
                      <Sparkles size={13} className="text-primary shrink-0" />
                      <span><strong>Impact:</strong> {item.impact}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps / Integration with Resume Builder */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-on-surface">
                  Ready to apply these improvements?
                </h4>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
                  Open the Resume Builder to edit your bullet points, inject missing keywords, and export a job-tailored PDF.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-xs sm:text-sm transition-colors"
                >
                  Adjust Job Criteria
                </button>
                <a
                  href="/dashboard/resume-builder"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  Open Resume Builder <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
