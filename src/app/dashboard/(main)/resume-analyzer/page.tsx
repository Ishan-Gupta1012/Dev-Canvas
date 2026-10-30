'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  UploadCloud,
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

function PipelineStep({
  index,
  label,
  detail,
  done,
  active,
  divider
}: {
  index: string;
  label: string;
  detail: string;
  done: boolean;
  active?: boolean;
  divider?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 min-w-0 ${divider ? 'sm:border-l sm:border-dashed sm:border-outline/20 sm:pl-4' : ''}`}>
      <div
        className={`w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center font-mono text-[11px] font-bold transition-colors ${
          done
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            : active
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface-container-low border-outline/20 text-on-background/55'
        }`}
      >
        {done ? <Check size={14} /> : index}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/55">{label}</p>
        <p className="text-xs font-semibold text-on-background truncate">{detail}</p>
      </div>
    </div>
  );
}

function MatchDial({ value }: { value: number | null }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const pct = value ?? 0;
  const stroke =
    value === null ? 'rgba(91,67,49,0.22)' : value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-16 h-16 shrink-0" role="img" aria-label={value === null ? 'No match score yet' : `Match score ${value} percent`}>
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="5" stroke="currentColor" className="text-on-background/10" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          stroke={stroke}
          strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
          style={{ transition: 'stroke-dasharray 700ms cubic-bezier(.4,0,.2,1), stroke 300ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-sm font-bold text-on-background">
          {value === null ? '—' : `${value}`}
        </span>
      </div>
    </div>
  );
}

export default function ResumeAnalyzerPage() {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [cachedResumeText, setCachedResumeText] = useState<string>('');
  const [cachedResumeData, setCachedResumeData] = useState<unknown>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'parsing' | 'done'>('idle');
  const uploadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Job Details state
  const [jobTab, setJobTab] = useState<'form' | 'paste'>('paste');
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
  const reportRef = useRef<HTMLDivElement>(null);

  // Bring the generated report into view once it exists
  useEffect(() => {
    if (!analysis) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    reportRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [analysis]);

  // Handle file selection
  const handleFile = (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.docx') && !selected.name.endsWith('.pdf')) {
      alert('Please upload a PDF or DOCX file.');
      return;
    }
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    setUploadStage('uploading');
    setFile(null);
    setCachedResumeText('');
    setCachedResumeData(null);
    setAnalysis(null);
    setAnalysisError(null);
    uploadTimerRef.current = setTimeout(() => {
      setUploadStage('parsing');
      uploadTimerRef.current = setTimeout(() => {
        setUploadStage('done');
        setFile(selected);
        uploadTimerRef.current = setTimeout(() => setUploadStage('idle'), 900);
      }, 900);
    }, 900);
  };

  const handleLoadSampleResume = () => {
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    setUploadStage('idle');
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
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to complete analysis. Please check file format.');
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

  const hasResume = Boolean(file || cachedResumeText);
  const hasBrief = Boolean(
    jobData.title.trim() ||
      jobData.description.trim() ||
      pastedJD.trim() ||
      jobData.requiredSkills.length > 0
  );
  const matchVerdict = analysis
    ? analysis.matchScore >= 80
      ? 'High candidate fit'
      : analysis.matchScore >= 60
      ? 'Moderate alignment'
      : 'Substantial gap'
    : 'Not run yet';

  const analyzerStatus = isAnalyzing
    ? 'Running comparison'
    : analysis
    ? 'Match report ready'
    : hasResume && hasBrief
    ? 'Ready to compare'
    : hasResume || hasBrief
    ? 'Inputs incomplete'
    : 'Analyzer idle';

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full text-on-background">

      {/* Sleek utility header — same convention as the rest of the dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-6 border-b border-outline/10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAnalyzing
                  ? 'bg-primary animate-pulse'
                  : analysis
                  ? 'bg-emerald-500'
                  : hasResume && hasBrief
                  ? 'bg-primary'
                  : 'bg-outline'
              }`}
            />
            <span className="font-mono text-xs uppercase tracking-wider text-on-background/80 font-medium">
              {analyzerStatus}
            </span>
          </span>
          <span className="text-outline/30">•</span>
          <span className="font-mono text-xs uppercase tracking-wider text-on-background/50">
            Dual ATS + semantic engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-on-background/55">
            Sample brief
          </span>
          <div className="flex items-center gap-1 p-1 bg-surface-container-low/70 rounded-xl border border-outline/15">
            {SAMPLE_JOBS.map((sample) => (
              <button
                key={sample.details.company}
                type="button"
                onClick={() => handleApplySample(sample)}
                title={sample.label}
                className="px-2.5 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider text-on-background/60 hover:text-on-background hover:bg-surface-container transition-colors"
              >
                {sample.details.company}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline strip */}
      <div className="mb-6 rounded-2xl border border-outline/20 bg-surface-container-lowest p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PipelineStep
            index="01"
            label="Resume intake"
            detail={file ? file.name : cachedResumeText ? 'Sample resume loaded' : 'No file attached'}
            done={hasResume}
            active={!hasResume}
          />
          <PipelineStep
            index="02"
            label="Target brief"
            detail={jobData.title.trim() || (pastedJD.trim() ? 'Pasted job description' : 'No role defined')}
            done={hasBrief}
            active={hasResume && !hasBrief}
            divider
          />
          <PipelineStep
            index="03"
            label="Match report"
            detail={analysis ? `${analysis.matchScore}% alignment` : isAnalyzing ? 'Comparing profile…' : 'Not generated'}
            done={Boolean(analysis)}
            active={isAnalyzing}
            divider
          />
        </div>

        <div className="flex items-center gap-3 border-t border-outline/10 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:border-outline/15 lg:pl-5">
          <MatchDial value={analysis ? analysis.matchScore : null} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/55">Alignment</p>
            <p className="text-sm font-semibold text-on-background">{matchVerdict}</p>
          </div>
        </div>
      </div>

      {/* Workspace: intake + brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 01 — Resume intake */}
        <section className="lg:col-span-5 rounded-2xl border border-outline/15 bg-surface-container-lowest overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-outline/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-background/55">01</span>
              <span className="h-3 w-px bg-outline/20" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-on-background truncate">
                Resume intake
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-background/55 shrink-0">PDF · DOCX</span>
          </div>

          <div className="p-4 sm:p-5">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload a resume file"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && document.getElementById('analyzer-file-input')?.click()}
              onKeyDown={(e) => {
                if (!file && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  document.getElementById('analyzer-file-input')?.click();
                }
              }}
              className={`rounded-xl border border-dashed p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all min-h-[320px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                dragActive
                  ? 'border-primary bg-primary-container/20'
                  : file
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-outline/25 hover:border-primary/50 hover:bg-surface-container-low/40 cursor-pointer'
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
                uploadStage === 'idle' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-low border border-outline/15 flex items-center justify-center mb-4 text-on-surface-variant">
                      <UploadCloud size={26} className="text-primary" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-on-background mb-1">Drop your resume here</h3>
                    <p className="text-on-background/50 text-xs mb-4 max-w-[15rem]">
                      Or browse local files. Standard text, ATS and LaTeX PDFs are supported.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('analyzer-file-input')?.click();
                        }}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs shadow-sm hover:opacity-90 transition-all active:scale-95"
                      >
                        Choose file
                      </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSampleResume();
                      }}
                      className="px-3 py-2 border border-outline/20 hover:border-primary/40 text-on-background/70 hover:text-primary rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles size={13} className="text-primary" />
                      Load sample
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-xl flex flex-col items-center justify-center text-center py-20 animate-pulse-soft"
                >
                  <div className="relative mb-4">
                    <RefreshCw size={40} className="text-primary animate-spin" />
                    <Sparkles size={16} className="text-primary-container absolute -top-1 -right-1" />
                  </div>
                  <h3 className="font-bold text-lg text-on-surface mb-2">
                    {uploadStage === 'uploading' ? 'Uploading resume…' : 'Parsing resume…'}
                  </h3>
                  <p className="text-on-surface-variant text-sm w-full max-w-[400px] px-4 mx-auto mb-6">
                    {uploadStage === 'uploading'
                      ? 'Sending your file securely to the parser.'
                      : 'Running deterministic layout extraction and analysis.'}
                  </p>
                  <div className="w-full max-w-[400px] bg-surface-container-low h-2.5 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="bg-primary h-full rounded-full"
                      animate={{ width: uploadStage === 'uploading' ? 50 : 100 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {uploadStage === 'uploading' ? '50% Complete' : 'Parsing complete'}
                  </span>
                </motion.div>
              ))
              : (
                <div className="w-full max-w-sm">
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-background text-sm break-all leading-snug">{file.name}</p>
                      <p className="text-[11px] text-on-background/60 mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB &bull; Parsed and ready
                      </p>
                    </div>
                  </div>

                  <dl className="mt-4 border-y border-outline/10 divide-y divide-outline/10">
                    <div className="flex items-center justify-between gap-3 py-2">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-on-background/55">Engine</dt>
                      <dd className="font-mono text-[11px] text-on-background/70">Dual ATS + semantic</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 py-2">
                      <dt className="font-mono text-[10px] uppercase tracking-widest text-on-background/55">Status</dt>
                      <dd className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Check size={12} /> Loaded
                      </dd>
                    </div>
                  </dl>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('analyzer-file-input')?.click();
                      }}
                      className="px-3 py-1.5 border border-outline/20 hover:border-primary/40 text-on-background/70 hover:text-primary rounded-lg font-mono text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
                        setUploadStage('idle');
                        setFile(null);
                        setCachedResumeText('');
                        setCachedResumeData(null);
                        setAnalysis(null);
                      }}
                      className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-500/5 rounded-lg transition-colors"
                    >
                  Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* What the report will cover */}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-outline/10 pt-4">
              {[
                ['Skills overlap', 'Required vs present'],
                ['Experience fit', 'Years and relevance'],
                ['Education match', 'Degree criteria'],
                ['ATS keywords', 'Exact-term scan'],
              ].map(([label, hint]) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-on-background/60">{label}</dt>
                    <dd className="text-[10px] text-on-background/50 leading-snug">{hint}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 02 — Target brief */}
        <section className="lg:col-span-7 rounded-2xl border border-outline/15 bg-surface-container-lowest overflow-hidden">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-outline/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-background/55">02</span>
              <span className="h-3 w-px bg-outline/20" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-on-background truncate">
                Target brief
              </h2>
            </div>

            <div className="flex items-center gap-0.5 p-0.5 bg-surface-container-low/70 rounded-lg border border-outline/15 font-mono text-[10px] uppercase tracking-wider shrink-0 self-start xs:self-auto">
              <button
                type="button"
                onClick={() => setJobTab('paste')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  jobTab === 'paste' ? 'bg-primary text-on-primary font-bold' : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Paste JD
              </button>
              <button
                type="button"
                onClick={() => setJobTab('form')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  jobTab === 'form' ? 'bg-primary text-on-primary font-bold' : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Fields
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {jobTab === 'paste' ? (
              /* Paste Full JD Mode */
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="pasted-jd-textarea" className="font-mono text-[10px] font-bold uppercase tracking-widest text-on-background/55">
                    Paste complete job posting
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoExtractJD}
                    disabled={isExtractingJD || !pastedJD.trim()}
                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isExtractingJD ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    {isExtractingJD ? 'Extracting' : 'Auto-extract'}
                  </button>
                </div>
                <textarea
                  id="pasted-jd-textarea"
                  rows={14}
                  value={pastedJD}
                  onChange={(e) => {
                    setPastedJD(e.target.value);
                    setJobData(prev => ({ ...prev, description: e.target.value }));
                  }}
                  placeholder="Paste the role title, company, requirements, responsibilities, skills and qualifications here..."
                  className="w-full p-3.5 rounded-lg border border-outline/15 bg-surface-container-low/60 text-xs sm:text-sm text-on-background focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-mono leading-relaxed resize-y"
                />
                <p className="text-[11px] text-on-background/50 flex items-center gap-1.5">
                  <Info size={12} className="shrink-0" />
                  <span>Auto-extract fills the title, skills and experience fields for you.</span>
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
                    <label htmlFor="company-name-input" className="block text-xs font-semibold text-on-background mb-1 flex items-center gap-1">
                      <Building2 size={12} /> Company Name
                    </label>
                    <input
                      id="company-name-input"
                      type="text"
                      value={jobData.company}
                      onChange={(e) => setJobData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. Stripe, Google, Startup"
                      className="w-full px-3 py-2 rounded-lg border border-outline/15 bg-surface-container-low/60 text-xs sm:text-sm text-on-background focus:outline-hidden focus:border-primary transition-colors"
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
                  <label htmlFor="required-skill-input" className="block text-xs font-semibold text-on-background mb-1 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      <Target size={12} /> Required Skills & Tech Stack
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-on-background/55 font-normal">
                      Enter or comma
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
                      placeholder="Type skill (e.g. React, AWS, Docker)"
                      className="flex-1 px-3 py-2 rounded-lg border border-outline/15 bg-surface-container-low/60 text-xs sm:text-sm text-on-background focus:outline-hidden focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-2 border border-outline/20 hover:border-primary/40 text-on-background/70 hover:text-primary rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>

                  {jobData.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {jobData.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 bg-primary/10 text-on-background border border-primary/25 rounded-md font-mono text-[11px] font-medium flex items-center gap-1.5"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            aria-label={`Remove ${sk}`}
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
                    <label htmlFor="other-requirements-input" className="block text-xs font-semibold text-on-background mb-1 flex items-center gap-1">
                      <Target size={12} /> Other Requirements / Preferences
                    </label>
                    <input
                      id="other-requirements-input"
                      type="text"
                      value={jobData.otherRequirements || ''}
                      onChange={(e) => setJobData(prev => ({ ...prev, otherRequirements: e.target.value }))}
                      placeholder="e.g. Security clearance, SOC2, relocation..."
                      className="w-full px-3 py-2 rounded-lg border border-outline/15 bg-surface-container-low/60 text-xs sm:text-sm text-on-background focus:outline-hidden focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Full Description Textarea */}
                <div>
                  <label htmlFor="job-description-textarea" className="block text-xs font-semibold text-on-background mb-1">
                    Job Description & Responsibilities
                  </label>
                  <textarea
                    id="job-description-textarea"
                    rows={4}
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Paste role description, key responsibilities, or project context..."
                    className="w-full p-3 rounded-lg border border-outline/15 bg-surface-container-low/60 text-xs sm:text-sm text-on-background focus:outline-hidden focus:border-primary transition-colors resize-y"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

{hasResume && hasBrief && (
      <AnimatePresence>
        <motion.div
          key="match-cta"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="mt-6 flex justify-center"
        >
          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing || !hasResume}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background whitespace-nowrap"
          >
            {isAnalyzing && <RefreshCw size={16} className="animate-spin" />}
            {isAnalyzing ? 'Analyzing…' : analysis ? 'Re-run analysis' : 'Run match analysis'}
            {!isAnalyzing && <ArrowRight size={15} />}
          </button>
        </motion.div>
      </AnimatePresence>
    )}

      {/* Error Banner */}
      {analysisError && (
        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-2.5">
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
            ref={reportRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-8 pt-4 scroll-mt-24"
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
