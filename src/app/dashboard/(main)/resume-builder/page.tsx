'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Plus,
  Trash2,
  Eye,
  Download,
  ExternalLink,
  Palette,
  Check,
  Sparkles,
  Award,
  FolderPlus,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Layers,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
  Camera,
  Upload,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export type TemplateId = 'blue-minimalist' | 'black-white-minimalist';

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  category: string;
  items: CustomSectionItem[];
}

interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
}

interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  gradYear: string;
}

const labelMap: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolio',
  leetcode: 'LeetCode',
};

const formatUrl = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const getPlatformLabel = (key: string, url: string = ''): string => {
  const normalizedKey = key.toLowerCase().trim();
  if (labelMap[normalizedKey]) {
    return labelMap[normalizedKey];
  }
  const cleanUrl = (url || '').toLowerCase().trim();
  if (cleanUrl.includes('github.com')) return 'GitHub';
  if (cleanUrl.includes('linkedin.com')) return 'LinkedIn';
  if (cleanUrl.includes('leetcode.com')) return 'LeetCode';
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) return 'Twitter / X';
  if (cleanUrl.includes('behance.net')) return 'Behance';
  if (cleanUrl.includes('dribbble.com')) return 'Dribbble';
  if (cleanUrl.includes('medium.com')) return 'Medium';
  if (cleanUrl.includes('dev.to')) return 'Dev.to';
  if (cleanUrl.includes('kaggle.com')) return 'Kaggle';
  if (cleanUrl.includes('gitlab.com')) return 'GitLab';
  if (cleanUrl.includes('codepen.io')) return 'CodePen';
  if (cleanUrl.includes('stackoverflow.com')) return 'Stack Overflow';
  if (cleanUrl.includes('youtube.com')) return 'YouTube';
  if (/portfolio|website|site|personal/i.test(normalizedKey)) return 'Portfolio';

  try {
    const formatted = formatUrl(cleanUrl);
    const host = new URL(formatted).hostname.replace(/^www\./, '');
    const parts = host.split('.');
    if (parts.length >= 2) {
      const name = parts[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  } catch {}

  return key.charAt(0).toUpperCase() + key.slice(1);
};

// Helper: Crops an image to a perfect circle with optional border on off-screen canvas
export const makeCircularImage = async (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    if (!imageSrc) return resolve('');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const size = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
        if (size <= 0) return resolve(imageSrc);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imageSrc);

        // Circular clipping
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw image centered & cropped
        const sx = ((img.naturalWidth || img.width) - size) / 2;
        const sy = ((img.naturalHeight || img.height) - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

        // Subtle outer border ring in warm ivory
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 1.5, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(2, size * 0.015);
        ctx.strokeStyle = '#FAF6F0';
        ctx.stroke();

        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('makeCircularImage canvas error:', e);
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
};

const inputCls =
  'w-full h-9.5 px-3 bg-surface-container-lowest border border-outline-variant/80 rounded-lg text-sm text-on-background placeholder:text-on-background/35 outline-none focus:border-[#49352F] focus:ring-2 focus:ring-[#49352F]/15 transition-all shadow-2xs';
const labelCls =
  'block text-[10.5px] font-mono uppercase tracking-wider text-on-background/70 font-semibold mb-1';

// Realistic, rich sample data matching the Canva Sebastian Bennett reference template
const sampleResumeData = {
  personal: {
    name: 'Sebastian Bennett',
    title: 'Real Estate Agent',
    email: 'hello@reallygreatsite.com',
    phone: '123-456-7890',
    location: '123 Anywhere St., Any City',
    photo: '',
    summary:
      'I am an experienced Real Estate Agent with a passion for helping clients find their dream homes. I have extensive experience in the industry, including more than 5 years working as a real estate agent. I am knowledgeable about the latest market trends and understand the nuances of the real estate market. I pride myself on my ability to negotiate the best deals for my clients and to navigate complex real estate agreements. I am highly organized, detail-oriented, and have strong communication skills.',
  },
  experience: [
    {
      id: 'exp1',
      role: 'Real Estate Agent',
      company: 'Really Great Company',
      start: 'June 2015',
      end: 'Present',
      bullets: [
        'Negotiate contracts and complex real estate transactions',
        'Provide excellent customer service to clients',
        'Update and maintain client files',
        'Research and monitor the local real estate market',
        'Develop marketing campaigns for properties',
        'Utilize social media platforms to market properties',
        'Participate in open houses and home tours',
      ],
    },
    {
      id: 'exp2',
      role: 'Real Estate Agent',
      company: 'Really Great Company',
      start: 'June 2014',
      end: '2015',
      bullets: [
        'Prepared contracts and documents for transactions',
        'Conducted market research on local real estate trends',
        'Compiled property information and photos',
        'Managed client database and contact information',
        'Scheduled property tours and open houses',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'University',
      degree: 'B.A. in Business Administration',
      field: '',
      gradYear: '2010 - 2014',
    },
  ],
  skills: [
    'Knowledge of the local real estate market',
    'Communication skills',
    'Negotiation skills',
    'Problem-solving skills',
    'Organization and time management skills',
  ],
  customSections: [
    {
      id: 'awards1',
      category: 'Awards & Certifications',
      items: [
        { id: 'aw1', title: 'Licensed Real Estate Agent' },
        { id: 'aw2', title: 'Certified Real Estate Negotiator' },
        { id: 'aw3', title: 'Top Sales Agent Award 2016' },
      ],
    },
  ],
  links: {
    github: '',
    linkedin: '',
    portfolio: 'reallygreatsite.com',
    leetcode: '',
  },
};

export default function ResumeBuilderPage() {
  const { user } = useAuth();

  // Workflow state: start on 'select-template', then transition to 'editor'
  const [workflowStep, setWorkflowStep] = useState<'select-template' | 'editor'>('select-template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('blue-minimalist');

  // Active form section in dedicated editor
  const [activeSection, setActiveSection] = useState<
    'personal' | 'experience' | 'education' | 'skills' | 'additional' | 'links'
  >('personal');

  // Preview view mode in editor (Side-by-side or Dedicated Preview Tab)
  const [viewMode, setViewMode] = useState<'editor-only' | 'split' | 'preview-only'>('split');

  // Resume form state initialized empty by default so users can enter their own details directly
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    photo: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPersonal((prev) => ({ ...prev, photo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPersonal((prev) => ({ ...prev, photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [experience, setExperience] = useState<ExperienceEntry[]>([
    {
      id: '1',
      role: '',
      company: '',
      start: '',
      end: '',
      bullets: [''],
    },
  ]);

  const [education, setEducation] = useState<EducationEntry[]>([
    {
      id: '1',
      school: '',
      degree: '',
      field: '',
      gradYear: '',
    },
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: 'reference',
      category: 'References',
      items: [
        {
          id: '1',
          title: '',
          subtitle: '',
          date: '',
          description: '',
        },
      ],
    },
    {
      id: 'languages',
      category: 'Languages',
      items: [
        { id: '1', title: '', subtitle: '', date: '', description: '' },
      ],
    },
    {
      id: 'projects',
      category: 'Projects',
      items: [
        {
          id: '1',
          title: '',
          subtitle: '',
          date: '',
          description: '',
        },
      ],
    },
    {
      id: 'certifications',
      category: 'Certifications',
      items: [
        {
          id: '1',
          title: '',
          subtitle: '',
          date: '',
          description: '',
        },
      ],
    },
  ]);

  const [links, setLinks] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
    leetcode: '',
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAutofilled, setHasAutofilled] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Debounced auto-save to browser localStorage
  useEffect(() => {
    const hasData =
      Boolean(personal.name || personal.title || personal.email || personal.phone || personal.location || personal.summary || personal.photo) ||
      experience.some((e) => e.role || e.company) ||
      education.some((e) => e.school) ||
      skills.length > 0;

    if (!hasData) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const payload = {
          personal,
          experience,
          education,
          skills,
          customSections,
          links,
          selectedTemplate,
        };
        localStorage.setItem('devcanvas_resume_draft', JSON.stringify(payload));
        setSaveStatus('saved');
      } catch {
        setSaveStatus('saved');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [personal, experience, education, skills, customSections, links, selectedTemplate]);

  // Restore draft from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('devcanvas_resume_draft');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.personal) setPersonal(parsed.personal);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.customSections) setCustomSections(parsed.customSections);
        if (parsed.links) setLinks(parsed.links);
        if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
      }
    } catch {}
  }, []);

  // Helper to quickly reload the Connor Hamilton reference sample
  const handleLoadReferenceSample = () => {
    setPersonal(sampleResumeData.personal);
    setExperience(sampleResumeData.experience);
    setEducation(sampleResumeData.education);
    setSkills(sampleResumeData.skills);
    setCustomSections(sampleResumeData.customSections as any);
    setLinks(sampleResumeData.links);
  };

  // Helper to reset/clear form
  const handleResetForm = () => {
    setPersonal({
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
      photo: '',
    });
    setExperience([{ id: '1', role: '', company: '', start: '', end: '', bullets: [''] }]);
    setEducation([{ id: '1', school: '', degree: '', field: '', gradYear: '' }]);
    setSkills([]);
    setCustomSections([
      { id: 'reference', category: 'References', items: [{ id: '1', title: '', subtitle: '', date: '', description: '' }] },
      { id: 'languages', category: 'Languages', items: [{ id: '1', title: '', subtitle: '', date: '', description: '' }] },
      { id: 'projects', category: 'Projects', items: [{ id: '1', title: '', subtitle: '', date: '', description: '' }] },
      { id: 'certifications', category: 'Certifications', items: [{ id: '1', title: '', subtitle: '', date: '', description: '' }] },
    ]);
    setLinks({ github: '', linkedin: '', portfolio: '', leetcode: '' });
    try {
      localStorage.removeItem('devcanvas_resume_draft');
    } catch {}
    setSaveStatus('saved');
  };

  // Auto-fill from user profile if available
  const handleAutofillFromProfile = () => {
    if (!user) return;
    setPersonal({
      name: user.personalInfo?.name || personal.name || '',
      email: user.personalInfo?.email || personal.email || '',
      phone: personal.phone || '',
      location: user.personalInfo?.location || personal.location || '',
      title: user.personalInfo?.title || personal.title || '',
      summary: user.bio || personal.summary || '',
      photo: (user as any)?.personalInfo?.avatar || (user as any)?.avatar || personal.photo || '',
    });

    if (user.experience && user.experience.length > 0) {
      setExperience(
        user.experience.map((e, idx) => ({
          id: (idx + 1).toString(),
          role: e.role || '',
          company: e.company || '',
          start: e.startDate || '',
          end: e.endDate || '',
          bullets: e.achievements && e.achievements.length > 0 ? e.achievements : [''],
        }))
      );
    }

    if (user.education && user.education.length > 0) {
      setEducation(
        user.education.map((edu, idx) => ({
          id: (idx + 1).toString(),
          school: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          gradYear: edu.gradYear || '',
        }))
      );
    }

    if (user.skills && user.skills.length > 0) {
      setSkills(user.skills);
    }

    if (user.socialLinks) {
      setLinks({
        github: user.socialLinks.github || links.github || '',
        linkedin: user.socialLinks.linkedin || links.linkedin || '',
        portfolio: user.socialLinks.blog || links.portfolio || '',
        leetcode: user.socialLinks.leetcode || links.leetcode || '',
      });
    }

    setHasAutofilled(true);
  };

  // Section completion calculations
  const isPersonalComplete = Boolean(personal.name?.trim() && (personal.email?.trim() || personal.title?.trim()));
  const isExperienceComplete = experience.some((e) => e.role?.trim() || e.company?.trim());
  const isEducationComplete = education.some((e) => e.school?.trim());
  const isSkillsComplete = skills.some((s) => s.trim());
  const isAdditionalComplete = customSections.some((sec) => sec.items.some((item) => item.title.trim()));
  const isLinksComplete = Boolean(links.github || links.linkedin || links.portfolio || links.leetcode);

  const sectionsStatus = [
    { id: 'personal', label: 'Personal Information', complete: isPersonalComplete, icon: User },
    { id: 'experience', label: 'Experience', complete: isExperienceComplete, icon: Briefcase },
    { id: 'education', label: 'Education', complete: isEducationComplete, icon: GraduationCap },
    { id: 'skills', label: 'Skills', complete: isSkillsComplete, icon: Code },
    { id: 'additional', label: 'Additional Information', complete: isAdditionalComplete, icon: Award },
    { id: 'links', label: 'Links', complete: isLinksComplete, icon: Globe },
  ] as const;

  const completedCount = sectionsStatus.filter((s) => s.complete).length;
  const progressPercentage = Math.round((completedCount / 6) * 100);

  // Transition handler from template selection to editor
  const handleSelectTemplate = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setWorkflowStep('editor');
  };

  // Download PDF using the robust, selectable vector jsPDF generator
  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;

      if (selectedTemplate === 'blue-minimalist') {
        // ====================================================
        // TEMPLATE 1: BROWN EDITORIAL SERIF CV (SINGLE COLUMN)
        // ====================================================
        const margin = 14;
        const contentWidth = pageWidth - margin * 2; // 182mm
        let y = margin;

        const checkPageBreak = (neededHeight: number) => {
          if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            drawEditorialBackground();
            y = margin;
            return true;
          }
          return false;
        };

        const drawEditorialBackground = () => {
          // Warm ivory paper background (#FAF6F0)
          doc.setFillColor(250, 246, 240);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
        };

        drawEditorialBackground();

        // SIDE-BY-SIDE HEADER: Profile photo and name/title side-by-side with proper spacing
        const hasPhoto = Boolean(personal.photo);
        const photoDiameter = hasPhoto ? 19 : 0; // mm
        const photoGap = hasPhoto ? 5.5 : 0; // mm
        const headerStartY = y;
        const textStartX = margin + photoDiameter + photoGap;
        const textWidth = contentWidth - (photoDiameter + photoGap);

        if (hasPhoto && personal.photo) {
          try {
            const circularImg = await makeCircularImage(personal.photo);
            doc.addImage(circularImg, 'PNG', margin, headerStartY, photoDiameter, photoDiameter);
            doc.setDrawColor(54, 36, 25); // #362419
            doc.setLineWidth(0.35);
            doc.circle(margin + photoDiameter / 2, headerStartY + photoDiameter / 2, photoDiameter / 2);
          } catch (e) {
            console.warn('PDF photo render error:', e);
          }
        }

        // Full Name (Serif typography in warm dark chocolate)
        const name = (personal.name || 'Your Name').trim();
        doc.setFont('times', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(54, 36, 25); // #362419
        const nameY = hasPhoto ? headerStartY + 5.5 : headerStartY + 5.5;
        doc.text(name, textStartX, nameY);

        // Professional Title (Tracked uppercase directly under name)
        let textCursorY = nameY;
        if (personal.title?.trim()) {
          const titleStr = personal.title.trim();
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.2);
          doc.setTextColor(107, 90, 81); // #6B5A51
          const spacedTitle = titleStr.toUpperCase().split('').join(' ');
          textCursorY += 4.5;
          doc.text(spacedTitle, textStartX, textCursorY);
        }

        // Contact Line (Inline bullet-separated contact info)
        const contactParts = [personal.email, personal.phone, personal.location]
          .map((p) => p?.trim())
          .filter(Boolean);
        if (contactParts.length > 0) {
          const separator = '   •   ';
          const contactLine = contactParts.join(separator);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.8);
          doc.setTextColor(141, 116, 103); // #8D7467
          textCursorY += 4.2;
          doc.text(contactLine, textStartX, textCursorY);
        }

        // Header boundary calculation ensuring zero overlap
        const sideBySideBottom = hasPhoto
          ? Math.max(headerStartY + photoDiameter, textCursorY)
          : textCursorY;
        y = sideBySideBottom + 2.5;

        // Professional Summary (Elegant editorial paragraph below header row)
        if (personal.summary?.trim()) {
          doc.setFont('times', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(73, 53, 47); // #49352F
          const summaryLines = doc.splitTextToSize(personal.summary.trim(), contentWidth);
          checkPageBreak(summaryLines.length * 3.5 + 2);
          for (const line of summaryLines) {
            doc.text(line, margin, y);
            y += 3.5;
          }
          y += 1.5;
        }

        // Header Bottom Divider Rule
        y += 1;
        doc.setDrawColor(54, 36, 25); // #362419
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentWidth, y);
        y += 4;

        const renderSectionHeader = (title: string) => {
          checkPageBreak(12);
          y += 1.5;
          doc.setFont('times', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(54, 36, 25); // #362419
          const spacedSection = title.toUpperCase().split('').join(' ');
          doc.text(spacedSection, margin, y);
          y += 1.5;
          doc.setDrawColor(54, 36, 25);
          doc.setLineWidth(0.35);
          doc.line(margin, y, margin + contentWidth, y);
          y += 3.8;
        };

        // Experience
        const expEntries = experience.filter((e) => e.role?.trim() || e.company?.trim());
        if (expEntries.length > 0) {
          renderSectionHeader('Experience');
          for (const exp of expEntries) {
            checkPageBreak(13);
            doc.setFont('times', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(54, 36, 25);
            doc.text(exp.role?.trim() || 'Role', margin, y);

            const dateRange = [exp.start?.trim(), exp.end?.trim()].filter(Boolean).join(' – ');
            if (dateRange) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              const dateWidth = doc.getTextWidth(dateRange);
              doc.setTextColor(141, 116, 103);
              doc.text(dateRange, margin + contentWidth - dateWidth, y);
            }
            y += 3.8;

            if (exp.company?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.setTextColor(107, 90, 81);
              doc.text(exp.company.trim().toUpperCase(), margin, y);
              y += 3.6;
            }

            const validBullets = exp.bullets.filter((b) => b && b.trim());
            if (validBullets.length > 0) {
              doc.setFont('times', 'normal');
              doc.setFontSize(8.5);
              for (const bullet of validBullets) {
                const bulletLines = doc.splitTextToSize(bullet.trim(), contentWidth - 5);
                checkPageBreak(bulletLines.length * 3.4 + 1);
                doc.setTextColor(54, 36, 25);
                doc.text('•', margin + 1, y);
                doc.setTextColor(73, 53, 47);
                doc.text(bulletLines, margin + 4.5, y);
                y += bulletLines.length * 3.4 + 0.6;
              }
            }
            y += 1.8;
          }
        }

        // Education
        const eduEntries = education.filter((e) => e.school?.trim());
        if (eduEntries.length > 0) {
          renderSectionHeader('Education');
          for (const edu of eduEntries) {
            checkPageBreak(10);
            doc.setFont('times', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(54, 36, 25);
            doc.text(edu.school.trim(), margin, y);

            if (edu.gradYear?.trim()) {
              const gradYearStr = edu.gradYear.trim();
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              const dateWidth = doc.getTextWidth(gradYearStr);
              doc.setTextColor(141, 116, 103);
              doc.text(gradYearStr, margin + contentWidth - dateWidth, y);
            }

            const details = [
              edu.degree?.trim(),
              edu.field?.trim() ? `in ${edu.field.trim()}` : '',
            ]
              .filter(Boolean)
              .join(' • ');
            if (details) {
              y += 3.6;
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(8);
              doc.setTextColor(107, 90, 81);
              doc.text(details, margin, y);
            }
            y += 3.8;
          }
        }

        // Skills
        const validSkills = skills.map((s) => s.trim()).filter(Boolean);
        if (validSkills.length > 0) {
          renderSectionHeader('Skills');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.8);

          let currentX = margin;
          const pillHeight = 4.6;
          const pillPadding = 3;
          const gapX = 2.2;
          const gapY = 2.2;

          for (const skill of validSkills) {
            const textWidth = doc.getTextWidth(skill);
            const pillWidth = textWidth + pillPadding * 2;
            if (currentX + pillWidth > margin + contentWidth) {
              currentX = margin;
              y += pillHeight + gapY;
              checkPageBreak(pillHeight + gapY);
            }
            doc.setFillColor(242, 236, 228); // #F2ECE4
            doc.setDrawColor(216, 204, 196); // #D8CCC4
            doc.setLineWidth(0.2);
            doc.roundedRect(currentX, y - 3.3, pillWidth, pillHeight, 0.8, 0.8, 'FD');
            doc.setTextColor(54, 36, 25);
            doc.text(skill, currentX + pillPadding, y);
            currentX += pillWidth + gapX;
          }
          y += pillHeight + 3.2;
        }

        // Additional Information
        for (const sec of customSections) {
          const validItems = sec.items.filter((item) => item.title?.trim());
          if (validItems.length > 0) {
            renderSectionHeader(sec.category.trim() || 'Additional Information');
            for (const item of validItems) {
              checkPageBreak(10);

              doc.setFont('times', 'bold');
              doc.setFontSize(9);
              doc.setTextColor(54, 36, 25);
              doc.text(item.title.trim(), margin, y);

              if (item.date?.trim()) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                const dateStr = item.date.trim();
                const dateWidth = doc.getTextWidth(dateStr);
                doc.setTextColor(141, 116, 103);
                doc.text(dateStr, margin + contentWidth - dateWidth, y);
              }
              y += 3.4;

              if (item.subtitle?.trim()) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(107, 90, 81);
                doc.text(item.subtitle.trim(), margin, y);
                y += 3.3;
              }

              if (item.description?.trim()) {
                doc.setFont('times', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(73, 53, 47);
                const descLines = doc.splitTextToSize(item.description.trim(), contentWidth);
                checkPageBreak(descLines.length * 3.3 + 1);
                doc.text(descLines, margin, y);
                y += descLines.length * 3.3 + 0.6;
              }
              y += 1.8;
            }
          }
        }

        // Links
        const validLinks = Object.entries(links)
          .map(([k, v]) => ({
            key: k,
            label: getPlatformLabel(k, v),
            url: formatUrl(v),
          }))
          .filter((item) => Boolean(item.url));

        if (validLinks.length > 0) {
          renderSectionHeader('Links');
          doc.setFont('times', 'bold');
          doc.setFontSize(8.5);
          let currentX = margin;
          const separator = '   •   ';

          validLinks.forEach((item, idx) => {
            const labelWidth = doc.getTextWidth(item.label);
            if (currentX + labelWidth > margin + contentWidth) {
              currentX = margin;
              y += 4.5;
              checkPageBreak(6);
            }
            doc.setTextColor(54, 36, 25);
            doc.textWithLink(item.label, currentX, y, { url: item.url });
            doc.setDrawColor(54, 36, 25);
            doc.setLineWidth(0.2);
            doc.line(currentX, y + 0.5, currentX + labelWidth, y + 0.5);
            currentX += labelWidth;

            if (idx < validLinks.length - 1) {
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(141, 116, 103);
              const sepWidth = doc.getTextWidth(separator);
              if (currentX + sepWidth <= margin + contentWidth) {
                doc.text(separator, currentX, y);
                currentX += sepWidth;
              }
            }
          });
          y += 4.5;
        }
      } else {
        // ====================================================
        // TEMPLATE 2: CANVA SEBASTIAN BENNETT TWO-COLUMN MINIMALIST CV
        // ====================================================
        const leftColX = 18;
        const leftColW = 52;
        const dividerX = 74;
        const rightColX = 80;
        const rightColW = pageWidth - rightColX - 18; // 112mm

        // Header: Left-aligned
        const name = (personal.name || 'SEBASTIAN BENNETT').trim();
        const spacedName = name.toUpperCase().split('').join(' ');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(19);
        doc.setTextColor(0, 0, 0);
        doc.text(spacedName, leftColX, 22);

        if (personal.title?.trim()) {
          doc.setFont('times', 'italic');
          doc.setFontSize(10.5);
          doc.setTextColor(90, 90, 90);
          doc.text(personal.title.trim(), leftColX, 28);
        }

        // Fine vertical divider line
        doc.setDrawColor(225, 225, 225);
        doc.setLineWidth(0.35);
        doc.line(dividerX, 36, dividerX, pageHeight - 16);

        // ==============================
        // LEFT COLUMN: CONTACT, EDUCATION, AWARDS, SKILLS, LANGUAGES
        // ==============================
        let leftY = 42;

        const drawLeftHeading = (title: string) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.8);
          doc.setTextColor(0, 0, 0);
          const spaced = title.toUpperCase().split('').join(' ');
          doc.text(spaced, leftColX, leftY);
          leftY += 5.5;
        };

        // 1. Contact
        const primaryLink =
          links.portfolio ||
          links.linkedin ||
          links.github ||
          Object.values(links).find(Boolean);

        if (personal.phone || personal.email || personal.location || primaryLink) {
          drawLeftHeading('Contact');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.6);
          doc.setTextColor(40, 40, 40);

          if (personal.phone?.trim()) {
            doc.text(personal.phone.trim(), leftColX, leftY);
            leftY += 3.8;
          }
          if (personal.email?.trim()) {
            const eLines = doc.splitTextToSize(personal.email.trim(), leftColW);
            doc.text(eLines, leftColX, leftY);
            leftY += eLines.length * 3.8;
          }
          if (personal.location?.trim()) {
            const lLines = doc.splitTextToSize(personal.location.trim(), leftColW);
            doc.text(lLines, leftColX, leftY);
            leftY += lLines.length * 3.8;
          }
          if (primaryLink?.trim()) {
            const cleanUrl = primaryLink.trim().replace(/^https?:\/\/(www\.)?/, '');
            const wLines = doc.splitTextToSize(cleanUrl, leftColW);
            doc.text(wLines, leftColX, leftY);
            leftY += wLines.length * 3.8;
          }
          leftY += 3;
        }

        // 2. Education
        const eduEntries = education.filter((e) => e.school?.trim());
        if (eduEntries.length > 0) {
          drawLeftHeading('Education');
          for (const edu of eduEntries) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text(edu.school.trim(), leftColX, leftY);
            leftY += 3.6;

            if (edu.gradYear?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.3);
              doc.setTextColor(110, 110, 110);
              doc.text(edu.gradYear.trim(), leftColX, leftY);
              leftY += 3.4;
            }

            const degreeText = [edu.degree?.trim(), edu.field?.trim()].filter(Boolean).join(' in ');
            if (degreeText) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.4);
              doc.setTextColor(60, 60, 60);
              const degLines = doc.splitTextToSize(degreeText, leftColW);
              doc.text(degLines, leftColX, leftY);
              leftY += degLines.length * 3.4;
            }
            leftY += 2;
          }
          leftY += 2;
        }

        // 3. Awards & Certifications
        const awardsSec = customSections.find((sec) => /award|certif/i.test(sec.category));
        if (awardsSec && awardsSec.items.some((item) => item.title?.trim())) {
          drawLeftHeading(awardsSec.category);
          for (const item of awardsSec.items.filter((item) => item.title?.trim())) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.4);
            doc.setTextColor(60, 60, 60);
            const bulletText = '•  ' + item.title.trim() + (item.subtitle ? ' — ' + item.subtitle.trim() : '');
            const bLines = doc.splitTextToSize(bulletText, leftColW);
            doc.text(bLines, leftColX, leftY);
            leftY += bLines.length * 3.4;
          }
          leftY += 3;
        }

        // 4. Skills
        const validSkills = skills.map((s) => s.trim()).filter(Boolean);
        if (validSkills.length > 0) {
          drawLeftHeading('Skills');
          for (const skill of validSkills) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.4);
            doc.setTextColor(60, 60, 60);
            const bLines = doc.splitTextToSize('•  ' + skill, leftColW);
            doc.text(bLines, leftColX, leftY);
            leftY += bLines.length * 3.4;
          }
          leftY += 3;
        }

        // 5. Languages
        const langSec = customSections.find((sec) => /language/i.test(sec.category));
        if (langSec && langSec.items.some((item) => item.title?.trim())) {
          drawLeftHeading('Languages');
          for (const item of langSec.items.filter((item) => item.title?.trim())) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.4);
            doc.setTextColor(60, 60, 60);
            const bLines = doc.splitTextToSize('•  ' + item.title.trim() + (item.subtitle ? ' (' + item.subtitle.trim() + ')' : ''), leftColW);
            doc.text(bLines, leftColX, leftY);
            leftY += bLines.length * 3.4;
          }
          leftY += 3;
        }

        // ==============================
        // RIGHT COLUMN: PROFILE, WORK EXPERIENCE, PROJECTS
        // ==============================
        let rightY = 42;

        const drawRightHeading = (title: string) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.8);
          doc.setTextColor(0, 0, 0);
          const spaced = title.toUpperCase().split('').join(' ');
          doc.text(spaced, rightColX, rightY);
          rightY += 5.5;
        };

        const checkRightPageBreak = (neededH: number) => {
          if (rightY + neededH > pageHeight - 16) {
            doc.addPage();
            doc.setDrawColor(225, 225, 225);
            doc.setLineWidth(0.35);
            doc.line(dividerX, 16, dividerX, pageHeight - 16);
            rightY = 20;
            return true;
          }
          return false;
        };

        // 1. Profile
        if (personal.summary?.trim()) {
          drawRightHeading('Profile');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.6);
          doc.setTextColor(60, 60, 60);
          const sumLines = doc.splitTextToSize(personal.summary.trim(), rightColW);
          doc.text(sumLines, rightColX, rightY);
          rightY += sumLines.length * 3.5 + 4;
        }

        // 2. Work Experience
        const expEntries = experience.filter((e) => e.role || e.company);
        if (expEntries.length > 0) {
          drawRightHeading('Work Experience');
          for (const exp of expEntries) {
            checkRightPageBreak(18);

            if (exp.role?.trim()) {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(7.8);
              doc.setTextColor(40, 40, 40);
              doc.text(exp.role.trim().toUpperCase(), rightColX, rightY);
              rightY += 3.6;
            }

            if (exp.company?.trim()) {
              doc.setFont('helvetica', 'bold');
              doc.setFontSize(8);
              doc.setTextColor(0, 0, 0);
              doc.text(exp.company.trim(), rightColX, rightY);
              rightY += 3.4;
            }

            if (exp.start?.trim() || exp.end?.trim()) {
              doc.setFont('times', 'italic');
              doc.setFontSize(7.6);
              doc.setTextColor(110, 110, 110);
              const dateText = (exp.start?.trim() || '') + (exp.start && exp.end ? ' - ' : '') + (exp.end?.trim() || '');
              doc.text(dateText, rightColX, rightY);
              rightY += 3.8;
            }

            for (const b of exp.bullets.filter((b) => b.trim())) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.4);
              doc.setTextColor(60, 60, 60);
              const bLines = doc.splitTextToSize('•  ' + b.trim(), rightColW);
              checkRightPageBreak(bLines.length * 3.4);
              doc.text(bLines, rightColX, rightY);
              rightY += bLines.length * 3.4;
            }
            rightY += 3;
          }
          rightY += 2;
        }

        // 3. Projects
        const projSec = customSections.find((sec) => /project/i.test(sec.category));
        if (projSec && projSec.items.some((item) => item.title?.trim())) {
          drawRightHeading('Projects');
          for (const item of projSec.items.filter((item) => item.title?.trim())) {
            checkRightPageBreak(14);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);
            doc.text(item.title.trim(), rightColX, rightY);
            rightY += 3.5;

            if (item.subtitle?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.3);
              doc.setTextColor(110, 110, 110);
              doc.text(item.subtitle.trim(), rightColX, rightY);
              rightY += 3.2;
            }

            if (item.description?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.4);
              doc.setTextColor(60, 60, 60);
              const dLines = doc.splitTextToSize(item.description.trim(), rightColW);
              checkRightPageBreak(dLines.length * 3.4);
              doc.text(dLines, rightColX, rightY);
              rightY += dLines.length * 3.4;
            }
            rightY += 2.5;
          }
        }

      }
      // Save document
      const cleanFileName = personal.name?.trim()
        ? `${personal.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_${selectedTemplate === 'blue-minimalist' ? 'Brown_Editorial' : 'Canva_Resume'}.pdf`
        : `Resume_${selectedTemplate === 'blue-minimalist' ? 'Brown_Editorial' : 'Canva_Modern'}.pdf`;

      doc.save(cleanFileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };


  // State manipulation helpers
  const addExperience = () => {
    setExperience([
      ...experience,
      { id: Date.now().toString(), role: '', company: '', start: '', end: '', bullets: [''] },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | string[]) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const addBullet = (id: string) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e)));
  };

  const updateBullet = (id: string, index: number, value: string) => {
    setExperience(
      experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) } : e
      )
    );
  };

  const removeBullet = (id: string, index: number) => {
    setExperience(
      experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
      )
    );
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: Date.now().toString(), school: '', degree: '', field: '', gradYear: '' },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleAddSkillFromInput = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills.filter(Boolean), trimmed]);
    }
    setNewSkillInput('');
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateLink = (field: keyof typeof links, value: string) => {
    setLinks({ ...links, [field]: value });
  };

  const addCategory = (categoryName = 'New Category') => {
    const newCat: CustomSection = {
      id: Date.now().toString(),
      category: categoryName,
      items: [{ id: Date.now().toString() + '-1', title: '', subtitle: '', date: '', description: '' }],
    };
    setCustomSections([...customSections, newCat]);
  };

  const removeCategory = (catId: string) => {
    setCustomSections(customSections.filter((c) => c.id !== catId));
  };

  const updateCategoryName = (catId: string, name: string) => {
    setCustomSections(customSections.map((c) => (c.id === catId ? { ...c, category: name } : c)));
  };

  const addItemToCategory = (catId: string) => {
    setCustomSections(
      customSections.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: [
                ...c.items,
                { id: Date.now().toString(), title: '', subtitle: '', date: '', description: '' },
              ],
            }
          : c
      )
    );
  };

  const removeCategoryItem = (catId: string, itemId: string) => {
    setCustomSections(
      customSections.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((item) => item.id !== itemId) } : c
      )
    );
  };

  const updateCategoryItem = (
    catId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    setCustomSections(
      customSections.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
            }
          : c
      )
    );
  };

  // ==========================================
  // TEMPLATE RENDERERS
  // ==========================================
  // Canva Reference Template: https://canva.link/1ipzta22q1pr3f4 (Sebastian Bennett Minimalist)
  // Palette: Pure crisp white (#FFFFFF), Jet black (#000000), Charcoal (#333333), Light gray divider (#E5E5E5)
  const renderCanvaResumeTemplate = (
    data = { personal, experience, education, skills, customSections, links }
  ) => {
    // Identify sections
    const awardsOrCertSec = data.customSections.find((sec) => /award|certif/i.test(sec.category));
    const languageSec = data.customSections.find((sec) => /language/i.test(sec.category));
    const projectSec = data.customSections.find((sec) => /project/i.test(sec.category));
    const otherSections = data.customSections.filter(
      (sec) => !/award|certif|language|project/i.test(sec.category)
    );

    // Active link for contact section
    const primaryLink =
      data.links.portfolio ||
      data.links.linkedin ||
      data.links.github ||
      Object.values(data.links).find(Boolean);

    return (
      <div className="bg-white text-black font-sans p-6 sm:p-9 min-h-full select-text shadow-sm flex flex-col justify-between">
        <div>
          {/* HEADER: Left-aligned, bold uppercase tracked name & italic serif title */}
          <div className="mb-7 sm:mb-8 pb-1">
            <h1 className="font-sans font-bold text-2xl sm:text-[28px] tracking-[0.24em] text-black uppercase leading-tight">
              {data.personal.name || 'SEBASTIAN BENNETT'}
            </h1>
            <p className="italic font-serif text-sm sm:text-base text-neutral-600 mt-1">
              {data.personal.title || 'Real Estate Agent'}
            </p>
          </div>

          {/* TWO-COLUMN GRID WITH FINE VERTICAL DIVIDER */}
          <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* LEFT COLUMN: ~36% width with right border line */}
            <div className="col-span-12 md:col-span-4 lg:col-span-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-[#E5E5E5] space-y-6 pb-6 md:pb-0">
              {/* CONTACT */}
              {(data.personal.phone || data.personal.email || data.personal.location || primaryLink) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    Contact
                  </h2>
                  <div className="space-y-2.5 text-xs text-neutral-800">
                    {data.personal.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone size={13} className="shrink-0 text-black" />
                        <span>{data.personal.phone}</span>
                      </div>
                    )}
                    {data.personal.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail size={13} className="shrink-0 text-black" />
                        <span className="break-all">{data.personal.email}</span>
                      </div>
                    )}
                    {data.personal.location && (
                      <div className="flex items-center gap-2.5">
                        <MapPin size={13} className="shrink-0 text-black" />
                        <span>{data.personal.location}</span>
                      </div>
                    )}
                    {primaryLink && (
                      <div className="flex items-center gap-2.5">
                        <Globe size={13} className="shrink-0 text-black" />
                        <span className="break-all">
                          {primaryLink.replace(/^https?:\/\/(www\.)?/, '')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {data.education.some((e) => e.school) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    Education
                  </h2>
                  <div className="space-y-3.5">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5 text-xs">
                        <p className="font-bold text-black font-sans">{edu.school}</p>
                        {edu.gradYear && (
                          <p className="text-neutral-500 font-sans">{edu.gradYear}</p>
                        )}
                        {(edu.degree || edu.field) && (
                          <p className="text-neutral-700 font-sans">
                            {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AWARDS & CERTIFICATIONS */}
              {awardsOrCertSec && awardsOrCertSec.items.some((item) => item.title?.trim()) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    {awardsOrCertSec.category.toUpperCase()}
                  </h2>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-neutral-700 leading-relaxed">
                    {awardsOrCertSec.items
                      .filter((item) => item.title?.trim())
                      .map((item) => (
                        <li key={item.id}>
                          <span>{item.title}</span>
                          {item.subtitle && <span className="text-neutral-500"> — {item.subtitle}</span>}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* SKILLS */}
              {data.skills.some((s) => s.trim()) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    Skills
                  </h2>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-neutral-700 leading-relaxed">
                    {data.skills
                      .filter((s) => s.trim())
                      .map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                  </ul>
                </div>
              )}

              {/* LANGUAGES */}
              {languageSec && languageSec.items.some((item) => item.title?.trim()) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    Languages
                  </h2>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-neutral-700 leading-relaxed">
                    {languageSec.items
                      .filter((item) => item.title?.trim())
                      .map((item) => (
                        <li key={item.id}>
                          <span>{item.title}</span>
                          {item.subtitle && <span className="text-neutral-500"> ({item.subtitle})</span>}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ~64% width */}
            <div className="col-span-12 md:col-span-8 lg:col-span-8 pl-0 md:pl-2 space-y-6">
              {/* PROFILE */}
              {data.personal.summary && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-2.5">
                    Profile
                  </h2>
                  <p className="text-xs text-neutral-700 leading-relaxed text-justify sm:text-left">
                    {data.personal.summary}
                  </p>
                </div>
              )}

              {/* WORK EXPERIENCE */}
              {data.experience.some((e) => e.role || e.company) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-4">
                    Work Experience
                  </h2>
                  <div className="space-y-5">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <p className="font-bold uppercase tracking-wider text-[11px] text-neutral-800">
                          {exp.role || 'Job Title'}
                        </p>
                        <p className="font-bold text-xs text-black">
                          {exp.company}
                        </p>
                        {(exp.start || exp.end) && (
                          <p className="italic font-serif text-[11px] text-neutral-500 mb-2">
                            {exp.start}{exp.start && exp.end && ' - '}{exp.end}
                          </p>
                        )}
                        {exp.bullets.some((b) => b.trim()) && (
                          <ul className="space-y-1 list-disc list-inside text-xs text-neutral-700 leading-relaxed">
                            {exp.bullets
                              .filter((b) => b.trim())
                              .map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS & OTHER SECTIONS */}
              {projectSec && projectSec.items.some((item) => item.title?.trim()) && (
                <div>
                  <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                    Projects
                  </h2>
                  <div className="space-y-3.5">
                    {projectSec.items
                      .filter((item) => item.title?.trim())
                      .map((proj) => (
                        <div key={proj.id} className="space-y-0.5 text-xs">
                          <p className="font-bold text-black">{proj.title}</p>
                          {proj.subtitle && (
                            <p className="text-neutral-500 text-[11px]">{proj.subtitle}</p>
                          )}
                          {proj.description && (
                            <p className="text-neutral-700 leading-relaxed mt-0.5">
                              {proj.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {otherSections.map((sec) => {
                const items = sec.items.filter((item) => item.title?.trim());
                if (items.length === 0) return null;
                return (
                  <div key={sec.id}>
                    <h2 className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-black mb-3">
                      {sec.category.toUpperCase()}
                    </h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="space-y-0.5 text-xs">
                          <p className="font-bold text-black">{item.title}</p>
                          {item.subtitle && <p className="text-neutral-500">{item.subtitle}</p>}
                          {item.description && (
                            <p className="text-neutral-700 leading-relaxed mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 1: Brown Editorial Serif CV (Classic Single-Column Editorial Layout)
  // ==========================================
  const renderBrownEditorialTemplate = (
    data = { personal, experience, education, skills, customSections, links }
  ) => (
    <div className="p-5 sm:p-7 space-y-4 bg-[#FAF6F0] text-[#362419] font-sans shadow-md select-text min-h-full">
      {/* Header: Profile photo and name/title side-by-side with proper spacing */}
      <div className="border-b-2 border-[#362419] pb-3 mb-3">
        <div className="flex flex-row items-center gap-4 sm:gap-5">
          {data.personal.photo && (
            <img
              src={data.personal.photo}
              alt={data.personal.name || 'Profile photo'}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover aspect-square border-2 border-[#362419]/30 shadow-xs shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#362419] tracking-tight leading-tight truncate">
              {data.personal.name || 'Your Name'}
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6B5A51] font-semibold mt-0.5">
              {data.personal.title || 'JOB TITLE'}
            </p>
            <p className="text-xs font-mono text-[#8D7467] mt-1 flex flex-wrap gap-x-3 gap-y-0.5 items-center">
              {[data.personal.email, data.personal.phone, data.personal.location]
                .filter(Boolean)
                .map((item, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{item}</span>
                    {idx < arr.length - 1 && <span className="text-[#362419]/40 font-bold">•</span>}
                  </React.Fragment>
                ))}
            </p>
          </div>
        </div>
        {data.personal.summary && (
          <p className="text-xs font-serif text-[#49352F] mt-2.5 leading-relaxed text-justify sm:text-left">
            {data.personal.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {data.experience.some((e) => e.role || e.company) && (
        <div>
          <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#362419] border-b border-[#362419] pb-1 mb-2.5">
            Experience
          </h3>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif font-bold text-xs sm:text-sm text-[#362419]">{exp.role || 'Role'}</p>
                  {(exp.start || exp.end) && (
                    <span className="text-[11px] font-mono text-[#8D7467] shrink-0">
                      {exp.start}
                      {exp.start && exp.end && ' – '}
                      {exp.end}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-sans uppercase tracking-wider text-[#6B5A51] font-medium">{exp.company}</p>
                {exp.bullets.some((b) => b.trim()) && (
                  <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs font-serif text-[#49352F] leading-relaxed">
                    {exp.bullets
                      .filter((b) => b.trim())
                      .map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.some((e) => e.school) && (
        <div>
          <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#362419] border-b border-[#362419] pb-1 mb-2.5">
            Education
          </h3>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-serif font-bold text-xs sm:text-sm text-[#362419]">{edu.school}</p>
                  {edu.gradYear && (
                    <span className="text-[11px] font-mono text-[#8D7467] shrink-0 text-right">
                      {edu.gradYear}
                    </span>
                  )}
                </div>
                {(edu.degree || edu.field) && (
                  <p className="text-[11px] font-sans text-[#6B5A51] mt-0.5">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.some((s) => s.trim()) && (
        <div>
          <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#362419] border-b border-[#362419] pb-1 mb-2">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {data.skills
              .filter((s) => s.trim())
              .map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#F2ECE4] text-[#362419] text-[11px] font-mono rounded border border-[#D8CCC4]"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Additional Information Sections */}
      {data.customSections.map((sec) => {
        const itemsWithTitle = sec.items.filter((item) => item.title?.trim());
        if (itemsWithTitle.length === 0) return null;
        return (
          <div key={sec.id}>
            <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#362419] border-b border-[#362419] pb-1 mb-2">
              {sec.category || 'Additional Information'}
            </h3>
            <div className="space-y-2">
              {itemsWithTitle.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif font-bold text-xs sm:text-sm text-[#362419]">{item.title}</p>
                    {item.date && (
                      <span className="text-[11px] font-mono text-[#8D7467] shrink-0 text-right">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] font-sans uppercase tracking-wider text-[#6B5A51] mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs font-serif text-[#49352F] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Links */}
      {Object.values(data.links).some((v) => Boolean(v && v.trim())) && (
        <div>
          <h3 className="font-serif text-[11px] uppercase tracking-[0.2em] font-bold text-[#362419] border-b border-[#362419] pb-1 mb-2">
            Links
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-serif">
            {Object.entries(data.links)
              .filter(([, v]) => Boolean(v && v.trim()))
              .map(([key, value]) => {
                const label = getPlatformLabel(key, value);
                const href = formatUrl(value);
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#362419] underline hover:text-[#6B5A51] transition-colors"
                  >
                    <span>{label}</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  const renderBrownMinimalistContent = renderBrownEditorialTemplate;
  const renderBlackWhiteMinimalistContent = renderCanvaResumeTemplate;
  const renderBlueMinimalistContent = renderBrownEditorialTemplate;
  const renderPurpleMinimalistContent = renderCanvaResumeTemplate;

  // ==========================================
  // SECTION FORMS FOR RESUME EDITOR
  // ==========================================
  const renderPersonalForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-lg font-bold text-on-background">Personal Information</h3>
          <p className="text-[11px] text-on-background/60">
            Contact details, optional photo, and professional executive summary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant text-on-background/60 hover:text-red-500 hover:border-red-300 text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
            title="Clear all fields"
          >
            <RotateCcw size={11} /> Clear
          </button>
          <button
            type="button"
            onClick={handleLoadReferenceSample}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#3D2D24]/30 text-[#3D2D24] dark:text-[#E8DFD8] bg-[#3D2D24]/5 hover:bg-[#3D2D24]/10 text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
            title="Load Connor Hamilton sample data"
          >
            <Sparkles size={11} /> Sample
          </button>
          {user && (
            <button
              type="button"
              onClick={handleAutofillFromProfile}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <CheckCircle2 size={11} />
              {hasAutofilled ? 'Re-sync' : 'Autofill'}
            </button>
          )}
        </div>
      </div>

      {/* Compact Profile Photo Upload Section */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/80 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {personal.photo ? (
              <div className="relative">
                <img
                  src={personal.photo}
                  alt="Profile preview"
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover aspect-square border-2 border-[#362419] shadow-2xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#362419] rounded-full border border-white flex items-center justify-center text-white text-[9px]">
                  <Check size={9} />
                </span>
              </div>
            ) : (
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FAF6F0] border border-dashed border-[#967F72] flex flex-col items-center justify-center text-[#362419]">
                <Camera size={18} className="opacity-70" />
                <span className="text-[8px] font-mono uppercase tracking-wider mt-0.5 font-semibold">Photo</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-on-background">
                Profile Photo
              </h4>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF6F0] text-[#362419] font-medium border border-[#D8CCC4]">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-on-background/60 mt-0.5 truncate">
              Auto circular-cropped beside name banner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#362419] hover:bg-[#261911] text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Upload size={12} />
            {personal.photo ? 'Change' : 'Upload'}
          </button>

          {personal.photo && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
              title="Remove photo"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label className={labelCls}>
            Full Name <span className="text-[#842A1C] font-bold">*</span>
          </label>
          <input
            type="text"
            value={personal.name}
            onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
            className={inputCls}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className={labelCls}>Professional Job Title</label>
          <input
            type="text"
            value={personal.title}
            onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
            className={inputCls}
            placeholder="Enter your job title"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelCls}>Email Address</label>
            {personal.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email) && (
              <span className="text-[10px] text-amber-600 font-mono mb-1">Check email format</span>
            )}
          </div>
          <input
            type="email"
            value={personal.email}
            onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
            className={inputCls}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label className={labelCls}>Phone Number</label>
          <input
            type="tel"
            value={personal.phone}
            onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
            className={inputCls}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Location (City, State / Country)</label>
          <input
            type="text"
            value={personal.location}
            onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
            className={inputCls}
            placeholder="Enter your location (e.g. San Francisco, CA)"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Professional Summary</label>
        <textarea
          value={personal.summary}
          onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
          rows={3}
          className="w-full p-3 bg-surface-container-lowest border border-outline-variant/80 rounded-lg text-sm text-on-background placeholder:text-on-background/35 outline-none focus:border-[#49352F] focus:ring-2 focus:ring-[#49352F]/15 transition-all resize-none shadow-2xs"
          placeholder="Enter a brief professional summary describing your experience, specialties, and goals..."
        />
      </div>
    </motion.div>
  );

  const renderExperienceForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-lg font-bold text-on-background">Work Experience</h3>
          <p className="text-[11px] text-on-background/60">
            Career positions, responsibilities, and key achievements.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
        >
          <Plus size={13} /> Add Role
        </button>
      </div>

      <div className="space-y-3.5">
        {experience.map((exp, expIdx) => (
          <div
            key={exp.id}
            className="border border-outline-variant/70 rounded-xl p-3.5 sm:p-4 bg-surface-container-low/60 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h4 className="font-serif text-sm font-bold text-on-background">
                  Position #{expIdx + 1} {exp.role ? `• ${exp.role}` : ''}
                </h4>
              </div>
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="p-1 text-on-background/40 hover:text-red-500 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Remove Experience"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className={labelCls}>Role / Title</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  className={inputCls}
                  placeholder="Enter your job title / role"
                />
              </div>

              <div>
                <label className={labelCls}>Company / Organization</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className={inputCls}
                  placeholder="Enter company or organization name"
                />
              </div>

              <div>
                <label className={labelCls}>Start Date</label>
                <input
                  type="text"
                  value={exp.start}
                  onChange={(e) => updateExperience(exp.id, 'start', e.target.value)}
                  className={inputCls}
                  placeholder="Enter start date (e.g. Jan 2022)"
                />
              </div>

              <div>
                <label className={labelCls}>End Date</label>
                <input
                  type="text"
                  value={exp.end}
                  onChange={(e) => updateExperience(exp.id, 'end', e.target.value)}
                  className={inputCls}
                  placeholder="Enter end date (e.g. Present or Dec 2023)"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className={labelCls}>Bullet Points / Achievements</label>
              <div className="space-y-2">
                {exp.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-primary text-xs font-bold">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addBullet(exp.id);
                        }
                      }}
                      className={inputCls}
                      placeholder="Enter an accomplishment or responsibility..."
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBullet(exp.id, idx)}
                        className="p-1 text-on-background/40 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-primary hover:underline cursor-pointer pt-0.5"
                >
                  <Plus size={12} /> Add achievement bullet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderEducationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-lg font-bold text-on-background">Education</h3>
          <p className="text-[11px] text-on-background/60">
            Academic credentials, degrees, or specialized training.
          </p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
        >
          <Plus size={13} /> Add Degree
        </button>
      </div>

      <div className="space-y-3.5">
        {education.map((edu, eduIdx) => (
          <div
            key={edu.id}
            className="border border-outline-variant/70 rounded-xl p-3.5 sm:p-4 bg-surface-container-low/60 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h4 className="font-serif text-sm font-bold text-on-background">
                  Education #{eduIdx + 1} {edu.school ? `• ${edu.school}` : ''}
                </h4>
              </div>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="p-1 text-on-background/40 hover:text-red-500 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Remove Education"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className={labelCls}>School / University</label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  className={inputCls}
                  placeholder="Enter your university or school"
                />
              </div>

              <div>
                <label className={labelCls}>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  className={inputCls}
                  placeholder="Enter your degree (e.g. Bachelor of Science)"
                />
              </div>

              <div>
                <label className={labelCls}>Field of Study / Major</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className={inputCls}
                  placeholder="Enter your field of study or major"
                />
              </div>

              <div>
                <label className={labelCls}>Graduation Year</label>
                <input
                  type="text"
                  value={edu.gradYear}
                  onChange={(e) => updateEducation(edu.id, 'gradYear', e.target.value)}
                  className={inputCls}
                  placeholder="Enter your graduation year (e.g. 2024)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSkillsForm = () => {
    const popularPills = [
      'React',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Node.js',
      'Python',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GraphQL',
      'Tailwind CSS',
      'Git',
      'System Architecture',
      'REST APIs',
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-4"
      >
        <div className="pb-2.5 border-b border-outline-variant/50">
          <h3 className="font-serif text-lg font-bold text-on-background">Technical Skills & Expertise</h3>
          <p className="text-xs text-on-background/60 mt-0.5">
            Add your core programming languages, frameworks, developer tools, and architectures.
          </p>
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkillFromInput();
              }
            }}
            placeholder="Enter a skill (e.g. React, Python) and press Enter..."
            className={inputCls}
          />
          <button
            type="button"
            onClick={handleAddSkillFromInput}
            className="px-3.5 h-9.5 bg-primary text-on-primary rounded-lg font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Add Skill
          </button>
        </div>

        {/* Active skill chips */}
        <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/60 min-h-[90px]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-background/50 block mb-2 font-semibold">
            Active Skills ({skills.filter(Boolean).length})
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.filter(Boolean).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-container-lowest border border-outline-variant shadow-xs text-on-background"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))}
            {skills.filter(Boolean).length === 0 && (
              <p className="text-xs text-on-background/40 italic">
                No skills added yet. Type a skill above or click from suggestions below.
              </p>
            )}
          </div>
        </div>

        {/* Quick add suggestions */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-on-background/50 block mb-2 font-semibold">
            Quick Add Suggestions
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularPills.map((p) => {
              const hasIt = skills.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  disabled={hasIt}
                  onClick={() => {
                    if (!hasIt) setSkills([...skills.filter(Boolean), p]);
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    hasIt
                      ? 'bg-surface-container-high/40 text-on-background/40 border border-outline-variant/30 cursor-not-allowed'
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  <Plus size={11} /> {p}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderAdditionalForm = () => {
    const presetCategories = [
      'Certifications',
      'Awards & Activities',
      'Languages',
      'Projects',
      'Publications',
      'Volunteer Experience',
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-outline-variant/50">
          <div>
            <h3 className="font-serif text-lg font-bold text-on-background">Additional Information</h3>
            <p className="text-xs text-on-background/60 mt-0.5">
              Organize certifications, awards, languages, or custom sections.
            </p>
          </div>
          <button
            type="button"
            onClick={() => addCategory('Custom Section')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <FolderPlus size={13} /> + New Section
          </button>
        </div>

        {/* Quick add category chips */}
        <div className="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-background/50 mr-1 font-semibold">
            Quick Add Category:
          </span>
          {presetCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => addCategory(cat)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-surface-container-lowest text-on-background border border-outline-variant/60 hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs"
            >
              <Plus size={11} /> {cat}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-3.5">
          {customSections.map((sec) => (
            <div
              key={sec.id}
              className="border border-outline-variant/70 rounded-xl p-3.5 sm:p-4 bg-surface-container-low/70 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <input
                    type="text"
                    value={sec.category}
                    onChange={(e) => updateCategoryName(sec.id, e.target.value)}
                    className="font-serif text-lg font-bold text-on-background bg-transparent border-b border-dashed border-transparent hover:border-outline-variant focus:border-primary outline-none px-1 py-0.5 rounded transition-all w-full max-w-sm"
                    placeholder="Enter category name (e.g. Certifications, Projects)"
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-on-background/40 bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/40 shrink-0">
                    {sec.items.length} {sec.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => addItemToCategory(sec.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-primary hover:bg-primary/10 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border border-outline-variant/40"
                  >
                    <Plus size={13} /> Add Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCategory(sec.id)}
                    className="p-1.5 text-on-background/40 hover:text-red-500 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                    title="Remove Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3.5">
                {sec.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-on-background/40 font-semibold">
                        Entry #{itemIdx + 1}
                      </span>
                      {sec.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategoryItem(sec.id, item.id)}
                          className="p-1 text-on-background/30 hover:text-red-500 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Title / Name</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'title', e.target.value)}
                          className={inputCls}
                          placeholder="Enter title or name"
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Subtitle / Authority</label>
                        <input
                          type="text"
                          value={item.subtitle || ''}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'subtitle', e.target.value)}
                          className={inputCls}
                          placeholder="Enter subtitle, organization, or issuer"
                        />
                      </div>

                      <div>
                        <label className={labelCls}>Date / Year (Right-Aligned)</label>
                        <input
                          type="text"
                          value={item.date || ''}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'date', e.target.value)}
                          className={inputCls}
                          placeholder="Enter date or year (e.g. 2024)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Optional Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateCategoryItem(sec.id, item.id, 'description', e.target.value)}
                        className={inputCls}
                        placeholder="Enter optional description or details..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderLinksForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <div className="pb-2.5 border-b border-outline-variant/50">
        <h3 className="font-serif text-lg font-bold text-on-background">External Links & Profiles</h3>
        <p className="text-xs text-on-background/60 mt-0.5">
          Link to your code repositories, online portfolio, and competitive programming profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {[
          { label: 'GitHub Profile', field: 'github' as const, placeholder: 'Enter your GitHub profile URL' },
          { label: 'LinkedIn Profile', field: 'linkedin' as const, placeholder: 'Enter your LinkedIn profile URL' },
          { label: 'Personal Portfolio', field: 'portfolio' as const, placeholder: 'Enter your portfolio URL' },
          { label: 'LeetCode Profile', field: 'leetcode' as const, placeholder: 'Enter your LeetCode profile URL' },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className={labelCls}>{label}</label>
            <div className="relative">
              <input
                type="url"
                value={links[field]}
                onChange={(e) => updateLink(field, e.target.value)}
                className={inputCls}
                placeholder={placeholder}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Globe size={15} className="text-on-background/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // ==========================================
  // SCREEN 1: TEMPLATE SELECTION & COMPARISON
  // ==========================================
  const renderTemplateSelectionScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Hero Header */}
      <div className="text-center max-w-xl mx-auto py-1">
        <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-on-background">
          Choose Your Resume Template
        </h1>
      </div>

      {/* Side-by-side Large Professional Template Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        {/* TEMPLATE 1: Brown & Beige Minimalist CV (Canva Reference) */}
        <div
          className={`group relative rounded-2xl border-2 transition-all p-4 sm:p-5 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'blue-minimalist'
              ? 'border-[#362419] shadow-lg ring-2 ring-[#362419]/10'
              : 'border-outline-variant hover:border-[#362419]/60 hover:shadow-md'
          }`}
        >
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#362419] font-bold bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#D8CCC4]">
                  Editorial Serif System
                </span>
                <h2 className="font-serif text-xl font-bold text-on-background mt-1.5">
                  Brown Editorial Serif CV
                </h2>
                <p className="text-xs text-on-background/60 mt-0.5">
                  Single-column editorial layout: Centered executive serif header, horizontal divider rules, and warm ivory paper.
                </p>
              </div>
              {selectedTemplate === 'blue-minimalist' && (
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#362419] text-white rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold shadow-2xs">
                  <Check size={11} /> Active
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              {[
                'Warm Ivory & Dark Chocolate',
                'Single-Column Editorial',
                'Editorial Serif Typography',
                '100% ATS-Friendly',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 bg-[#FAF6F0] text-[#362419] text-[10px] font-mono rounded border border-[#D8CCC4]"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Large, Beautiful, Readable Document Preview */}
            <div className="relative rounded-xl border border-[#D8CCC4] bg-[#FAF6F0]/50 p-2.5 sm:p-3 mb-4 shadow-inner overflow-hidden">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5C4A42] mb-1.5 flex items-center justify-between">
                <span>Readable Document Preview</span>
                <span className="text-[#362419] font-semibold">Standard A4 Layout</span>
              </div>

              {/* Rendered Preview Sheet */}
              <div className="rounded-lg overflow-hidden shadow-sm border border-[#D8CCC4] max-h-[380px] overflow-y-auto no-scrollbar transform-gpu transition-transform group-hover:scale-[1.005]">
                {renderBrownMinimalistContent(sampleResumeData)}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => handleSelectTemplate('blue-minimalist')}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              selectedTemplate === 'blue-minimalist'
                ? 'bg-[#362419] hover:bg-[#261911] text-white shadow-[#362419]/25'
                : 'bg-primary text-on-primary hover:opacity-95'
            }`}
          >
            <span>Use Brown Editorial Template</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TEMPLATE 2: Canva Sebastian Bennett Modern Minimalist CV */}
        <div
          className={`group relative rounded-2xl border-2 transition-all p-4 sm:p-5 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'black-white-minimalist'
              ? 'border-neutral-900 shadow-lg ring-2 ring-neutral-900/10'
              : 'border-outline-variant hover:border-neutral-600 hover:shadow-md'
          }`}
        >
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-black font-bold bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-300">
                  Canva Minimalist Edition
                </span>
                <h2 className="font-serif text-xl font-bold text-on-background mt-1.5">
                  Canva Modern Minimalist CV
                </h2>
                <p className="text-xs text-on-background/60 mt-0.5">
                  Clean two-column monochrome layout: Left metadata column with contact icons, education & skills, right column with profile and work experience.
                </p>
              </div>
              {selectedTemplate === 'black-white-minimalist' && (
                <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 bg-black text-white rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold shadow-2xs">
                  <Check size={11} /> Active
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-4">
              {[
                'Monochrome Black & White',
                'Left Metadata Column',
                'Right Profile & Experience',
                '100% ATS-Friendly',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-mono rounded border border-neutral-300"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Large, Beautiful, Readable Document Preview */}
            <div className="relative rounded-xl border border-neutral-300 bg-neutral-50/50 p-2.5 sm:p-3 mb-4 shadow-inner overflow-hidden">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center justify-between">
                <span>Readable Document Preview</span>
                <span className="text-black font-semibold">Standard A4 Layout</span>
              </div>

              {/* Rendered Preview Sheet */}
              <div className="rounded-lg overflow-hidden shadow-sm border border-neutral-200 max-h-[380px] overflow-y-auto no-scrollbar transform-gpu transition-transform group-hover:scale-[1.005]">
                {renderBlackWhiteMinimalistContent(sampleResumeData)}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => handleSelectTemplate('black-white-minimalist')}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              selectedTemplate === 'black-white-minimalist'
                ? 'bg-black hover:bg-neutral-800 text-white shadow-neutral-900/25'
                : 'bg-primary text-on-primary hover:opacity-95'
            }`}
          >
            <span>Use Canva Minimalist Template</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // SCREEN 2: DEDICATED RESUME EDITOR SCREEN
  // ==========================================
  const renderEditorScreen = () => {
    const currentSectionIndex = sectionsStatus.findIndex((s) => s.id === activeSection);
    const prevSection = currentSectionIndex > 0 ? sectionsStatus[currentSectionIndex - 1] : null;
    const nextSection =
      currentSectionIndex < sectionsStatus.length - 1 ? sectionsStatus[currentSectionIndex + 1] : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        {/* Top Navigation & Breadcrumb Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:px-4 sm:py-2 rounded-xl bg-surface-container-low border border-outline-variant/80 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setWorkflowStep('select-template')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-container hover:border-primary text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft size={13} /> Change Template
            </button>
            <div className="hidden sm:block h-3.5 w-px bg-outline-variant" />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold bg-surface-container-lowest border border-outline-variant/70">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedTemplate === 'blue-minimalist' ? 'bg-[#49352F]' : 'bg-[#98796F]'
                  }`}
                />
                {selectedTemplate === 'blue-minimalist'
                  ? 'Brown Editorial'
                  : 'Canva Modern'}
              </span>

              {/* Subtle Auto-Save Indicator */}
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-on-background/70 px-2 py-0.5 rounded-md bg-surface-container-lowest border border-outline-variant/50">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    saveStatus === 'saving'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                <span>{saveStatus === 'saving' ? 'Saving...' : 'Auto-saved'}</span>
              </div>
            </div>
          </div>

          {/* Quick template toggle & download actions */}
          <div className="flex items-center gap-2">
            {/* Quick Template Switcher pills */}
            <div className="flex items-center p-0.5 rounded-lg bg-surface-container-lowest border border-outline-variant">
              <button
                type="button"
                onClick={() => setSelectedTemplate('blue-minimalist')}
                className={`px-2 py-1 rounded text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedTemplate === 'blue-minimalist'
                    ? 'bg-[#49352F] text-white shadow-2xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Brown
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('black-white-minimalist')}
                className={`px-2 py-1 rounded text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedTemplate === 'black-white-minimalist'
                    ? 'bg-[#98796F] text-white shadow-2xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Canva
              </button>
            </div>

            {/* View Mode Toggle (Mobile / Desktop) */}
            <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-surface-container-lowest border border-outline-variant">
              <button
                type="button"
                onClick={() => setViewMode('editor-only')}
                className={`px-2 py-1 rounded text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'editor-only'
                    ? 'bg-primary text-on-primary shadow-2xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2 py-1 rounded text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-primary text-on-primary shadow-2xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview-only')}
                className={`px-2 py-1 rounded text-[10.5px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'preview-only'
                    ? 'bg-primary text-on-primary shadow-2xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Prominent PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#362419] hover:bg-[#261911] text-white text-xs font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <Download size={13} className={isDownloading ? 'animate-bounce' : ''} />
              {isDownloading ? 'Exporting...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Progress Indicator Card */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-2xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
                Progress
              </span>
              <span className="text-xs font-medium text-on-background">
                {completedCount} of 6 Sections Complete
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-36 h-1.5 rounded-full bg-surface-container overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
              <span className="font-mono text-xs font-bold text-primary">{progressPercentage}%</span>
            </div>
          </div>

          {/* Section Step Pills */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-0.5">
            {sectionsStatus.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 py-1.5 px-2 rounded-lg text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary shadow-2xs'
                      : sec.complete
                      ? 'bg-surface-container-low border-outline-variant/80 hover:border-primary/50 text-on-background'
                      : 'bg-surface-container-lowest border-outline-variant/40 text-on-background/50 hover:text-on-background'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-on-primary' : sec.complete ? 'text-primary' : 'text-on-background/40'} />
                  <span className="text-[11px] font-semibold truncate">{sec.label.split(' ')[0]}</span>
                  {sec.complete && (
                    <CheckCircle2
                      size={11}
                      className={isActive ? 'text-on-primary' : 'text-primary shrink-0 ml-auto hidden sm:inline'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Real-Time Live Preview Layout */}
        <div
          className={`grid gap-5 items-start ${
            viewMode === 'split'
              ? 'lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Column: Form Editor */}
          {viewMode !== 'preview-only' && (
            <div
              className={`space-y-4 ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'max-w-4xl mx-auto w-full'
              }`}
            >
              <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 sm:p-5 shadow-2xs">
                <AnimatePresence mode="wait">
                  {activeSection === 'personal' && <div key="sec-personal">{renderPersonalForm()}</div>}
                  {activeSection === 'experience' && <div key="sec-experience">{renderExperienceForm()}</div>}
                  {activeSection === 'education' && <div key="sec-education">{renderEducationForm()}</div>}
                  {activeSection === 'skills' && <div key="sec-skills">{renderSkillsForm()}</div>}
                  {activeSection === 'additional' && <div key="sec-additional">{renderAdditionalForm()}</div>}
                  {activeSection === 'links' && <div key="sec-links">{renderLinksForm()}</div>}
                </AnimatePresence>

                {/* Section Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-outline-variant/50">
                  {prevSection ? (
                    <button
                      type="button"
                      onClick={() => setActiveSection(prevSection.id as any)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                    >
                      <ArrowLeft size={12} /> {prevSection.label.split(' ')[0]}
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-[#362419] text-xs font-mono uppercase tracking-wider font-semibold text-on-background transition-all cursor-pointer shadow-2xs"
                    >
                      <Download size={12} /> PDF
                    </button>
                    {nextSection && (
                      <button
                        type="button"
                        onClick={() => setActiveSection(nextSection.id as any)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-2xs"
                      >
                        Next: {nextSection.label.split(' ')[0]} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Real-Time Live Preview Sheet */}
          {viewMode !== 'editor-only' && (
            <div
              className={`space-y-3 ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'max-w-4xl mx-auto w-full'
              }`}
            >
              <div className="rounded-xl border border-outline-variant/80 bg-surface-container-low p-3 shadow-xs space-y-2.5 sticky top-3 lg:top-4 self-start max-h-[calc(100vh-2rem)] flex flex-col">
                {/* Live Preview Header Toolbar */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-outline-variant/60 shrink-0">
                  <div className="flex items-center gap-2">
                    <Eye size={15} className="text-primary" />
                    <span className="font-serif font-bold text-xs sm:text-sm text-on-background">
                      Live Preview
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-on-background/50 uppercase tracking-wider hidden sm:inline">
                      A4 Standard
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplate(
                          selectedTemplate === 'blue-minimalist'
                            ? 'black-white-minimalist'
                            : 'blue-minimalist'
                        )
                      }
                      className="px-2 py-1 rounded-md border border-outline-variant bg-surface-container-lowest text-[10px] font-mono uppercase tracking-wider font-bold text-on-background hover:border-primary transition-all cursor-pointer shadow-2xs"
                    >
                      Switch: {selectedTemplate === 'blue-minimalist' ? 'Canva' : 'Editorial'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#362419] hover:bg-[#261911] text-white text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download size={11} />
                      PDF
                    </button>
                  </div>
                </div>

                {/* Rendered Resume Document */}
                <div className="rounded-lg overflow-hidden border border-outline-variant shadow-md bg-white flex-1 min-h-[460px] max-h-[calc(100vh-7.5rem)] overflow-y-auto no-scrollbar">
                  {selectedTemplate === 'blue-minimalist'
                    ? renderBlueMinimalistContent()
                    : renderBlackWhiteMinimalistContent()}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full min-h-screen text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <AnimatePresence mode="wait">
        {workflowStep === 'select-template'
          ? renderTemplateSelectionScreen()
          : renderEditorScreen()}
      </AnimatePresence>
    </div>
  );
}
