'use client';

import React, { useState, useRef } from 'react';
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
  'w-full h-11 px-3.5 bg-surface-container-lowest border border-outline-variant/80 rounded-xl text-sm text-on-background placeholder:text-on-background/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs';
const labelCls =
  'block text-[11px] font-mono uppercase tracking-widest text-on-background/60 font-semibold mb-1.5';

// Realistic, rich sample data for high-fidelity template previews matching reference
const sampleResumeData = {
  personal: {
    name: 'Connor Hamilton',
    title: 'UI / UX Designer',
    email: 'connor.hamilton@devcanvas.io',
    phone: '123-456-7890',
    location: 'New York, NY',
    photo: '/connor_hamilton.jpg',
    summary:
      'Experienced graphic designer with 6 years of experience. Excited to help your company expand social media engagement with captivating content, video and static assets.',
  },
  experience: [
    {
      id: 'exp1',
      role: 'Art Director',
      company: 'Really Great Company | 2023',
      start: '2023',
      end: '',
      bullets: [
        'Tasked to make graphics for file output layouts',
        'Concept and develop control beaters',
        'Organization of files by files from client',
      ],
    },
    {
      id: 'exp2',
      role: 'Senior Graphic Design',
      company: 'Really Great Company | 2023',
      start: '2023',
      end: '',
      bullets: [
        'Worked with editorial, product marketing, social and creative teams to design marketing video assets, which improved ad performance by 22%',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'Wardiere University',
      degree: 'Graduated in Web Designing.',
      field: 'Gained extensive training.',
      gradYear: '2020 – 2022',
    },
    {
      id: 'edu2',
      school: 'Wardiere University',
      degree: 'Graduated in Web Designing.',
      field: 'Gained extensive training.',
      gradYear: '2020 – 2022',
    },
  ],
  skills: [
    'Layouting',
    'Illustration',
    'UI / UX Design',
    'Branding Design',
  ],
  customSections: [
    {
      id: 'ref1',
      category: 'References',
      items: [
        {
          id: 'r1',
          title: 'Juliana Silva',
          subtitle: 'Wardiere Inc. / CEO',
          description: '123-456-7890',
        },
        {
          id: 'r2',
          title: 'Reese Miller',
          subtitle: 'Wardiere Inc. / CEO',
          description: '123-456-7890',
        },
      ],
    },
    {
      id: 'lang1',
      category: 'Languages',
      items: [
        { id: 'l1', title: 'English (Fluent)' },
        { id: 'l2', title: 'Spanish (Working Knowledge)' },
      ],
    },
    {
      id: 'proj1',
      category: 'Projects',
      items: [
        {
          id: 'p1',
          title: 'Design System & Component Library',
          subtitle: 'Figma, Tailwind, React, Storybook',
          date: '2023',
          description: 'Architected end-to-end design token workflows and unified 60+ components across web and mobile surfaces.',
        },
      ],
    },
    {
      id: 'cert1',
      category: 'Certifications',
      items: [
        {
          id: 'c1',
          title: 'Advanced UI / UX Specialization',
          subtitle: 'Design Guild Institute',
          date: '2022',
          description: 'Credential ID: DGI-8842-UX',
        },
      ],
    },
  ],
  links: {
    github: 'https://github.com/connor-hamilton',
    linkedin: 'https://linkedin.com/in/connor-hamilton',
    portfolio: 'https://connorhamilton.design',
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

  // Helper to quickly reload the Connor Hamilton reference sample
  const handleLoadReferenceSample = () => {
    setPersonal(sampleResumeData.personal);
    setExperience(sampleResumeData.experience);
    setEducation(sampleResumeData.education);
    setSkills(sampleResumeData.skills);
    setCustomSections(sampleResumeData.customSections as any);
    setLinks(sampleResumeData.links);
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
        // TEMPLATE 2: CANVA TWO-COLUMN MODERN CV (EXACT CANVA REFERENCE)
        // ====================================================
      // Exact column proportions: 40% left sidebar (84mm), 60% right content (126mm)
      const sidebarW = 84;
      const rightColX = 84;
      const footerH = 5.5; // ~22px height at preview scale

      // Coordinated Canva Color Palette
      const darkBrown = [73, 53, 47] as const; // #49352F
      const dustyRose = [152, 121, 111] as const; // #98796F
      const warmBlush = [255, 244, 241] as const; // #FFF4F1
      const taupeDivider = [203, 184, 174] as const; // #CBB8AE
      const white = [255, 255, 255] as const;

      const drawPageBackground = () => {
        // 1. Full page pale blush/cream background (#FFF4F1)
        doc.setFillColor(...warmBlush);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // 2. Left sidebar 40% width in dusty rose-brown (#98796F)
        doc.setFillColor(...dustyRose);
        doc.rect(0, 0, sidebarW, pageHeight - footerH, 'F');

        // 3. Top-right folded corner and diagonal lines motif
        doc.setFillColor(...dustyRose);
        doc.triangle(185, 0, pageWidth, 0, pageWidth, 25, 'F');
        doc.setDrawColor(...dustyRose);
        doc.setLineWidth(0.3);
        doc.line(165, 0, pageWidth, 35);
        doc.line(175, 0, pageWidth, 25);
        doc.line(185, 0, pageWidth, 15);
        doc.line(155, 0, pageWidth, 45);

        // 4. Solid dark chocolate-brown horizontal footer bar across bottom (20-24px scale)
        doc.setFillColor(...darkBrown);
        doc.rect(0, pageHeight - footerH, pageWidth, footerH, 'F');
      };

      // Draw initial page background
      drawPageBackground();

      // HEADER & PROFILE PHOTO (HORIZONTALLY ALIGNED)
      const photoDiameter = 32; // mm
      const photoCenterX = sidebarW / 2; // 42mm (centered in 40% sidebar)
      const bannerY = 8;
      const bannerH = 32;
      const photoCenterY = bannerY + bannerH / 2; // 24mm
      const photoTopLeftX = photoCenterX - photoDiameter / 2; // 26mm
      const photoTopLeftY = photoCenterY - photoDiameter / 2; // 8mm

      // Top-Right Dark Chocolate Banner (#49352F) across 60% right column
      doc.setFillColor(...darkBrown);
      doc.rect(sidebarW, bannerY, pageWidth - sidebarW, bannerH, 'F');

      // User Full Name: Large, bold, white serif typography - KEPT ON ONE SINGLE LINE
      const name = (personal.name || 'Your Name').trim();
      doc.setFont('times', 'bold');
      doc.setTextColor(...white);
      let nameFontSize = 21;
      doc.setFontSize(nameFontSize);
      let nameWidth = doc.getTextWidth(name);
      const maxNameWidth = pageWidth - sidebarW - 20; // 106mm
      while (nameWidth > maxNameWidth && nameFontSize > 13) {
        nameFontSize -= 1;
        doc.setFontSize(nameFontSize);
        nameWidth = doc.getTextWidth(name);
      }
      const bannerTextX = sidebarW + 10;
      doc.text(name, bannerTextX, bannerY + 14);

      // Professional title directly beneath name in uppercase sans-serif with increased letter spacing
      if (personal.title?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 244, 241);
        const spacedTitle = personal.title.trim().toUpperCase().split('').join(' ');
        doc.text(spacedTitle, bannerTextX, bannerY + 22);
      }

      // Circular Profile Photo in upper-left with white border
      if (personal.photo) {
        try {
          const circularImg = await makeCircularImage(personal.photo);
          doc.addImage(
            circularImg,
            'PNG',
            photoTopLeftX,
            photoTopLeftY,
            photoDiameter,
            photoDiameter
          );
          doc.setDrawColor(...white);
          doc.setLineWidth(1.3);
          doc.circle(photoCenterX, photoCenterY, photoDiameter / 2);
        } catch (e) {
          console.warn('PDF photo render error:', e);
        }
      } else {
        doc.setFillColor(...darkBrown);
        doc.setDrawColor(...white);
        doc.setLineWidth(1.3);
        doc.circle(photoCenterX, photoCenterY, photoDiameter / 2, 'FD');
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...white);
        const initials = (personal.name || 'CH')
          .split(' ')
          .map((n) => n[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();
        doc.text(initials, photoCenterX, photoCenterY + 1.5, { align: 'center' });
      }

      // ==========================================
      // LEFT SIDEBAR: PROFILE, REFERENCES, SKILLS, LANGUAGES
      // ==========================================
      let leftY = 46;
      const sidebarPadding = 8;
      const sidebarContentX = sidebarPadding;
      const sidebarContentW = sidebarW - sidebarPadding * 2; // 68mm

      const drawSidebarBoxHeading = (title: string) => {
        doc.setFillColor(...darkBrown);
        const boxH = 6;
        doc.rect(sidebarContentX, leftY - 4.2, sidebarContentW, boxH, 'F');
        doc.setFont('times', 'bold');
        doc.setFontSize(8.8);
        doc.setTextColor(...white);
        doc.text(title, sidebarContentX + 3.5, leftY);
        leftY += 6;
      };

      // 1. Profile / Summary
      if (personal.summary?.trim()) {
        drawSidebarBoxHeading('Profile');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.6);
        doc.setTextColor(...warmBlush);
        const summaryLines = doc.splitTextToSize(personal.summary.trim(), sidebarContentW);
        for (const line of summaryLines) {
          doc.text(line, sidebarContentX, leftY);
          leftY += 3.5;
        }
        leftY += 3.5;
      }

      // 2. References Section
      const referenceSec = customSections.find((sec) => /reference/i.test(sec.category));
      if (referenceSec && referenceSec.items.some((item) => item.title?.trim())) {
        drawSidebarBoxHeading('References');
        for (const item of referenceSec.items.filter((item) => item.title?.trim())) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...white);
          doc.text(item.title.trim(), sidebarContentX, leftY);
          leftY += 3.5;
          if (item.subtitle?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.3);
            doc.setTextColor(...warmBlush);
            doc.text(item.subtitle.trim(), sidebarContentX, leftY);
            leftY += 3.3;
          }
          if (item.description?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.2);
            doc.setTextColor(...warmBlush);
            const descLines = doc.splitTextToSize(item.description.trim(), sidebarContentW);
            doc.text(descLines, sidebarContentX, leftY);
            leftY += descLines.length * 3.3;
          }
          leftY += 2;
        }
        leftY += 2;
      } else {
        // Contact details fallback if no references
        const hasContact = personal.email || personal.phone || personal.location;
        if (hasContact) {
          drawSidebarBoxHeading('Contact');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.6);
          doc.setTextColor(...warmBlush);
          if (personal.phone?.trim()) {
            doc.text(personal.phone.trim(), sidebarContentX, leftY);
            leftY += 3.6;
          }
          if (personal.email?.trim()) {
            const emailLines = doc.splitTextToSize(personal.email.trim(), sidebarContentW);
            doc.text(emailLines, sidebarContentX, leftY);
            leftY += emailLines.length * 3.6;
          }
          if (personal.location?.trim()) {
            const locLines = doc.splitTextToSize(personal.location.trim(), sidebarContentW);
            doc.text(locLines, sidebarContentX, leftY);
            leftY += locLines.length * 3.6;
          }
          leftY += 3;
        }
      }

      // 3. Skills (Vertical list with white checkmark icons)
      const validSkills = skills.map((s) => s.trim()).filter(Boolean);
      if (validSkills.length > 0) {
        drawSidebarBoxHeading('Skills');
        for (const skill of validSkills) {
          doc.setFont('times', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(...white);
          doc.text('✓', sidebarContentX + 1, leftY);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.8);
          doc.setTextColor(...white);
          doc.text(skill, sidebarContentX + 5, leftY);
          leftY += 4.5;
        }
        leftY += 3;
      }

      // 4. Languages
      const languageSec = customSections.find((sec) => /language/i.test(sec.category));
      if (languageSec && languageSec.items.some((item) => item.title?.trim())) {
        drawSidebarBoxHeading('Languages');
        for (const item of languageSec.items.filter((item) => item.title?.trim())) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...white);
          doc.text(item.title.trim(), sidebarContentX, leftY);
          leftY += 3.5;
          if (item.subtitle?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.3);
            doc.setTextColor(...warmBlush);
            doc.text(item.subtitle.trim(), sidebarContentX, leftY);
            leftY += 3.3;
          }
          leftY += 1.5;
        }
        leftY += 2;
      }

      // 5. Links Section (Display only platform name, clickable vector link in PDF)
      const validLinks = Object.entries(links)
        .map(([k, v]) => ({
          key: k,
          label: getPlatformLabel(k, v),
          url: formatUrl(v),
        }))
        .filter((item) => Boolean(item.url));

      if (validLinks.length > 0) {
        drawSidebarBoxHeading('Links');
        for (const item of validLinks) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(...white);
          const labelWidth = doc.getTextWidth(item.label);
          doc.textWithLink(item.label, sidebarContentX, leftY, { url: item.url });
          doc.setDrawColor(...white);
          doc.setLineWidth(0.2);
          doc.line(sidebarContentX, leftY + 0.4, sidebarContentX + labelWidth, leftY + 0.4);
          leftY += 4.2;
        }
        leftY += 2;
      }

      // ==========================================
      // RIGHT CONTENT COLUMN (X: 84mm to 200mm)
      // Continuous vertical timeline line at X=94mm
      // Circular markers beside headings
      // Exact order: Education, Work Experience, Projects, Certifications
      // ==========================================
      let rightY = 46;
      const timelineX = 94;
      const contentStartX = 98;
      const rightContentW = pageWidth - contentStartX - 10; // 102mm

      // Draw continuous vertical timeline line down right column
      doc.setDrawColor(...taupeDivider);
      doc.setLineWidth(0.4);
      doc.line(timelineX, 44, timelineX, pageHeight - footerH - 6);

      const drawMainSectionHeading = (title: string) => {
        // Circular brown marker on vertical timeline line
        doc.setFillColor(...dustyRose);
        doc.circle(timelineX, rightY - 1, 1.4, 'F');

        // Heading in bold dark-brown serif
        doc.setFont('times', 'bold');
        doc.setFontSize(11.5);
        doc.setTextColor(...darkBrown);
        doc.text(title, contentStartX, rightY);

        // Thin horizontal taupe-brown divider line extending to right
        const titleW = doc.getTextWidth(title);
        doc.setDrawColor(...taupeDivider);
        doc.setLineWidth(0.4);
        doc.line(contentStartX + titleW + 2, rightY - 1, pageWidth - 10, rightY - 1);
        rightY += 6;
      };

      const checkRightPageBreak = (neededHeight: number) => {
        if (rightY + neededHeight > pageHeight - footerH - 6) {
          doc.addPage();
          drawPageBackground();
          doc.setDrawColor(...taupeDivider);
          doc.setLineWidth(0.4);
          doc.line(timelineX, 16, timelineX, pageHeight - footerH - 6);
          rightY = 18;
          return true;
        }
        return false;
      };

      // 1. EDUCATION (DATES FIRST, THEN INSTITUTION, DEGREE/DETAILS, BULLETS)
      const eduEntries = education.filter((e) => e.school?.trim());
      if (eduEntries.length > 0) {
        drawMainSectionHeading('Education');
        for (const edu of eduEntries) {
          checkRightPageBreak(15);
          if (edu.gradYear?.trim()) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.2);
            doc.setTextColor(...darkBrown);
            doc.text(edu.gradYear.trim(), contentStartX, rightY);
            rightY += 3.8;
          }
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.2);
          doc.setTextColor(...darkBrown);
          doc.text(edu.school.trim(), contentStartX, rightY);
          rightY += 3.6;

          if (edu.degree?.trim()) {
            doc.setFontSize(7.8);
            doc.text(`• ${edu.degree.trim()}`, contentStartX, rightY);
            rightY += 3.4;
          }
          if (edu.field?.trim()) {
            doc.setFontSize(7.8);
            doc.text(`• ${edu.field.trim()}`, contentStartX, rightY);
            rightY += 3.4;
          }
          rightY += 2.5;
        }
        rightY += 2;
      }

      // 2. WORK EXPERIENCE (JOB TITLE, COMPANY, DATES, COMPACT BULLET POINTS)
      const expEntries = experience.filter((e) => e.role?.trim() || e.company?.trim());
      if (expEntries.length > 0) {
        drawMainSectionHeading('Work Experience');
        for (const exp of expEntries) {
          checkRightPageBreak(16);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...darkBrown);
          doc.text(exp.role?.trim() || 'Role', contentStartX, rightY);

          const dateStr = [exp.start?.trim(), exp.end?.trim()].filter(Boolean).join(' – ');
          if (dateStr) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...dustyRose);
            const dateW = doc.getTextWidth(dateStr);
            doc.text(dateStr, pageWidth - 10 - dateW, rightY);
          }
          rightY += 3.8;

          if (exp.company?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...darkBrown);
            doc.text(exp.company.trim(), contentStartX, rightY);
            rightY += 3.8;
          }

          const validBullets = exp.bullets.filter((b) => b && b.trim());
          if (validBullets.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.8);
            for (const bullet of validBullets) {
              const bulletLines = doc.splitTextToSize(bullet.trim(), rightContentW - 5);
              checkRightPageBreak(bulletLines.length * 3.5 + 2);
              doc.setTextColor(...darkBrown);
              doc.text('•', contentStartX, rightY);
              doc.text(bulletLines, contentStartX + 4, rightY);
              rightY += bulletLines.length * 3.5 + 0.8;
            }
          }
          rightY += 3;
        }
        rightY += 2;
      }

      // 3. PROJECTS (PROJECT NAME, SHORT DESCRIPTION, TECHNOLOGIES)
      const projectSec = customSections.find((sec) => /project/i.test(sec.category));
      if (projectSec && projectSec.items.some((item) => item.title?.trim())) {
        drawMainSectionHeading('Projects');
        for (const proj of projectSec.items.filter((item) => item.title?.trim())) {
          checkRightPageBreak(14);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.8);
          doc.setTextColor(...darkBrown);
          doc.text(proj.title.trim(), contentStartX, rightY);
          if (proj.date?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...dustyRose);
            const dWidth = doc.getTextWidth(proj.date.trim());
            doc.text(proj.date.trim(), pageWidth - 10 - dWidth, rightY);
          }
          rightY += 3.8;

          if (proj.subtitle?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...dustyRose);
            doc.text(proj.subtitle.trim(), contentStartX, rightY);
            rightY += 3.5;
          }
          if (proj.description?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.8);
            doc.setTextColor(...darkBrown);
            const pDescLines = doc.splitTextToSize(proj.description.trim(), rightContentW);
            checkRightPageBreak(pDescLines.length * 3.5 + 1);
            doc.text(pDescLines, contentStartX, rightY);
            rightY += pDescLines.length * 3.5;
          }
          rightY += 2.5;
        }
        rightY += 2;
      }

      // 4. CERTIFICATIONS, IF PROVIDED
      const certSec = customSections.find((sec) => /certif/i.test(sec.category));
      if (certSec && certSec.items.some((item) => item.title?.trim())) {
        drawMainSectionHeading('Certifications');
        for (const cert of certSec.items.filter((item) => item.title?.trim())) {
          checkRightPageBreak(12);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.2);
          doc.setTextColor(...darkBrown);
          doc.text(cert.title.trim(), contentStartX, rightY);
          rightY += 3.5;
          if (cert.subtitle?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.6);
            doc.setTextColor(...darkBrown);
            doc.text(cert.subtitle.trim(), contentStartX, rightY);
            rightY += 3.2;
          }
          if (cert.description?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.6);
            doc.setTextColor(...darkBrown);
            const cDesc = doc.splitTextToSize(cert.description.trim(), rightContentW);
            checkRightPageBreak(cDesc.length * 3.4 + 1);
            doc.text(cDesc, contentStartX, rightY);
            rightY += cDesc.length * 3.4;
          }
          rightY += 2.5;
        }
        rightY += 2;
      }

      // 5. OTHER CUSTOM SECTIONS
      const otherRightSecs = customSections.filter(
        (sec) => !/reference|language|project|certif/i.test(sec.category)
      );
      for (const sec of otherRightSecs) {
        const validItems = sec.items.filter((item) => item.title?.trim());
        if (validItems.length > 0) {
          drawMainSectionHeading(sec.category || 'Additional Information');
          for (const item of validItems) {
            checkRightPageBreak(12);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.2);
            doc.setTextColor(...darkBrown);
            doc.text(item.title.trim(), contentStartX, rightY);
            rightY += 3.5;
            if (item.subtitle?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.6);
              doc.setTextColor(...darkBrown);
              doc.text(item.subtitle.trim(), contentStartX, rightY);
              rightY += 3.2;
            }
            if (item.description?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(7.6);
              doc.setTextColor(...darkBrown);
              const iDesc = doc.splitTextToSize(item.description.trim(), rightContentW);
              checkRightPageBreak(iDesc.length * 3.4 + 1);
              doc.text(iDesc, contentStartX, rightY);
              rightY += iDesc.length * 3.4;
            }
            rightY += 2.5;
          }
          rightY += 2;
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
  // Canva Reference Template: https://www.canva.com/templates/EAE-Zp2EOLc/
  // Coordinated Palette: Dark chocolate (#49352F), Dusty rose-brown (#98796F), Warm blush (#FFF4F1), Taupe (#CBB8AE)
  const renderCanvaResumeTemplate = (
    data = { personal, experience, education, skills, customSections, links }
  ) => {
    const hasPhoto = Boolean(data.personal.photo);

    // Left Sidebar Sections
    const referenceSec = data.customSections.find((sec) => /reference/i.test(sec.category));
    const languageSec = data.customSections.find((sec) => /language/i.test(sec.category));

    // Right Content Column Sections (Exact order: Education, Work Experience, Projects, Certifications)
    const projectSec = data.customSections.find((sec) => /project/i.test(sec.category));
    const certSec = data.customSections.find((sec) => /certif/i.test(sec.category));
    const otherRightSections = data.customSections.filter(
      (sec) => !/reference|language|project|certif/i.test(sec.category)
    );

    return (
      <div className="relative bg-[#FFF4F1] text-[#49352F] font-sans shadow-md select-text min-h-full flex flex-col justify-between overflow-hidden">
        {/* TOP-RIGHT CANVA GEOMETRIC WIREFRAME & FOLDED-CORNER MOTIF */}
        <div className="absolute top-0 right-0 w-36 h-28 pointer-events-none z-10 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
            {/* Fine diagonal decorative lines */}
            <line x1="75" y1="0" x2="140" y2="65" stroke="#98796F" strokeWidth="1" strokeOpacity="0.75" />
            <line x1="95" y1="0" x2="140" y2="45" stroke="#98796F" strokeWidth="1" strokeOpacity="0.75" />
            <line x1="115" y1="0" x2="140" y2="25" stroke="#98796F" strokeWidth="1" strokeOpacity="0.75" />
            <line x1="55" y1="0" x2="140" y2="85" stroke="#98796F" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="140" y1="0" x2="55" y2="85" stroke="#98796F" strokeWidth="0.7" strokeOpacity="0.35" />
            {/* Folded-corner triangle motif */}
            <polygon points="96,0 140,0 140,44" fill="#98796F" />
          </svg>
        </div>

        <div className="flex-1 flex flex-col">
          {/* HEADER: Profile Photo on Left (40%), Wide Dark Chocolate Banner on Right (60%) */}
          <div className="flex flex-row items-center w-full">
            {/* Upper-Left Photo Area (~40% width) */}
            <div className="w-[40%] bg-[#98796F] pt-7 pb-5 px-4 flex items-center justify-center">
              <div className="relative shrink-0">
                {hasPhoto ? (
                  <img
                    src={data.personal.photo}
                    alt={data.personal.name || 'Profile photo'}
                    className="w-[125px] h-[125px] sm:w-[135px] sm:h-[135px] rounded-full object-cover aspect-square border-4 sm:border-[5px] border-white shadow-sm"
                  />
                ) : (
                  <div className="w-[125px] h-[125px] sm:w-[135px] sm:h-[135px] rounded-full bg-[#49352F]/30 border-4 sm:border-[5px] border-white flex flex-col items-center justify-center text-white shadow-sm">
                    <User size={40} className="opacity-90" />
                    <span className="text-[10px] font-mono mt-1 uppercase tracking-wider font-semibold">Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top-Right Dark Chocolate Banner (~60% width) */}
            <div className="w-[60%] bg-[#49352F] text-white px-6 py-6 sm:px-8 sm:py-7 flex flex-col justify-center min-h-[145px] sm:min-h-[160px]">
              {/* Name kept on one single line */}
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-white tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {data.personal.name || 'Your Name'}
              </h1>
              {/* Professional title directly beneath in uppercase with increased letter spacing */}
              <p className="text-xs sm:text-sm font-sans uppercase tracking-[0.25em] text-[#FFF4F1]/90 font-medium mt-1.5 truncate">
                {data.personal.title || 'JOB TITLE'}
              </p>
            </div>
          </div>

          {/* TWO-COLUMN BODY */}
          <div className="flex flex-row items-stretch flex-1 w-full">
            {/* LEFT SIDEBAR: ~40% width in Dusty Rose-Brown (#98796F) */}
            <div className="w-[40%] bg-[#98796F] text-[#FFF4F1] p-5 sm:p-6 space-y-5 flex flex-col justify-start">
              {/* 1. Profile Section */}
              {data.personal.summary && (
                <div>
                  <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                    Profile
                  </div>
                  <p className="text-xs text-[#FFF4F1]/95 leading-relaxed text-justify sm:text-left">
                    {data.personal.summary}
                  </p>
                </div>
              )}

              {/* 2. References Section */}
              {referenceSec && referenceSec.items.some((item) => item.title?.trim()) ? (
                <div>
                  <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                    References
                  </div>
                  <div className="space-y-3 text-xs text-[#FFF4F1]">
                    {referenceSec.items
                      .filter((item) => item.title?.trim())
                      .map((item) => (
                        <div key={item.id} className="space-y-0.5">
                          <p className="font-bold text-white text-xs">{item.title}</p>
                          {item.subtitle && <p className="text-[11px] text-[#FFF4F1]/90">{item.subtitle}</p>}
                          {item.description && (
                            <p className="text-[11px] text-[#FFF4F1]/90 font-sans">{item.description}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                /* Contact details fallback if no explicit references */
                (data.personal.email || data.personal.phone || data.personal.location) && (
                  <div>
                    <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                      Contact
                    </div>
                    <div className="space-y-1.5 text-xs text-[#FFF4F1]">
                      {data.personal.phone && <p>{data.personal.phone}</p>}
                      {data.personal.email && <p className="break-all">{data.personal.email}</p>}
                      {data.personal.location && <p>{data.personal.location}</p>}
                    </div>
                  </div>
                )
              )}

              {/* 3. Skills Section (Vertical list with white checkmark icons) */}
              {data.skills.some((s) => s.trim()) && (
                <div>
                  <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                    Skills
                  </div>
                  <div className="space-y-2">
                    {data.skills
                      .filter((s) => s.trim())
                      .map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white">
                          <span className="font-bold text-sm leading-none text-white select-none">
                            ✓
                          </span>
                          <span className="font-medium text-[#FFF4F1]">{skill}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 4. Languages Section */}
              {languageSec && languageSec.items.some((item) => item.title?.trim()) && (
                <div>
                  <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                    Languages
                  </div>
                  <div className="space-y-1.5 text-xs text-[#FFF4F1]">
                    {languageSec.items
                      .filter((item) => item.title?.trim())
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="font-medium text-white">{item.title}</span>
                          {item.subtitle && <span className="text-[11px] text-[#FFF4F1]/80">{item.subtitle}</span>}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 5. Links Section (Platform name only, clickable) */}
              {Object.values(data.links).some((v) => Boolean(v && v.trim())) && (
                <div>
                  <div className="w-full bg-[#49352F] text-[#FFF4F1] px-3.5 py-1.5 font-serif font-bold text-xs uppercase tracking-[0.18em] shadow-2xs mb-2.5">
                    Links
                  </div>
                  <div className="space-y-1.5 text-xs text-[#FFF4F1]">
                    {Object.entries(data.links)
                      .filter(([, v]) => Boolean(v && v.trim()))
                      .map(([key, value]) => {
                        const label = getPlatformLabel(key, value);
                        const href = formatUrl(value);
                        return (
                          <div key={key}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#FFF4F1]/80 underline transition-colors"
                            >
                              <span>{label}</span>
                              <ExternalLink size={10} className="opacity-80" />
                            </a>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT CONTENT COLUMN: ~60% width in Warm Blush (#FFF4F1) */}
            <div className="w-[60%] bg-[#FFF4F1] text-[#49352F] p-6 sm:p-8 space-y-6 flex flex-col justify-start relative">
              {/* Continuous subtle vertical brown timeline line near left edge */}
              <div className="absolute left-[28px] sm:left-[36px] top-6 bottom-6 w-[1.5px] bg-[#CBB8AE]" />

              {/* 1. EDUCATION (DATES FIRST, THEN INSTITUTION, DEGREE & BULLETS) */}
              {data.education.some((e) => e.school) && (
                <div className="relative pl-7 sm:pl-9">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="absolute left-[22px] sm:left-[30px] w-2.5 h-2.5 rounded-full bg-[#98796F] border-2 border-[#FFF4F1] shadow-xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#49352F] whitespace-nowrap">
                      Education
                    </h3>
                    <div className="flex-1 h-[1.5px] bg-[#CBB8AE]" />
                  </div>

                  <div className="space-y-3.5">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        {edu.gradYear && (
                          <p className="text-xs font-sans font-bold text-[#49352F]">
                            {edu.gradYear}
                          </p>
                        )}
                        <p className="text-xs font-sans font-semibold text-[#49352F]/90">
                          {edu.school}
                        </p>
                        {edu.degree && (
                          <p className="text-xs text-[#49352F]/80 flex items-center gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{edu.degree}</span>
                          </p>
                        )}
                        {edu.field && (
                          <p className="text-xs text-[#49352F]/80 flex items-center gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{edu.field}</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. WORK EXPERIENCE (JOB TITLE, COMPANY, DATES, COMPACT BULLET POINTS) */}
              {data.experience.some((e) => e.role || e.company) && (
                <div className="relative pl-7 sm:pl-9">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="absolute left-[22px] sm:left-[30px] w-2.5 h-2.5 rounded-full bg-[#98796F] border-2 border-[#FFF4F1] shadow-xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#49352F] whitespace-nowrap">
                      Work Experience
                    </h3>
                    <div className="flex-1 h-[1.5px] bg-[#CBB8AE]" />
                  </div>

                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <p className="font-sans font-bold text-xs sm:text-sm text-[#49352F]">
                            {exp.role || 'Job Title'}
                          </p>
                          {(exp.start || exp.end) && (
                            <span className="text-[11px] font-sans font-semibold text-[#98796F]">
                              {exp.start}{exp.start && exp.end && ' – '}{exp.end}
                            </span>
                          )}
                        </div>
                        {exp.company && (
                          <p className="text-xs text-[#49352F]/85 font-medium">
                            {exp.company}
                          </p>
                        )}
                        {exp.bullets.some((b) => b.trim()) && (
                          <ul className="space-y-1 text-xs text-[#49352F]/80 leading-relaxed pt-0.5">
                            {exp.bullets
                              .filter((b) => b.trim())
                              .map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="font-bold text-xs mt-0.5">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PROJECTS (PROJECT NAME, SHORT DESCRIPTION, TECHNOLOGIES) */}
              {projectSec && projectSec.items.some((item) => item.title?.trim()) && (
                <div className="relative pl-7 sm:pl-9">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="absolute left-[22px] sm:left-[30px] w-2.5 h-2.5 rounded-full bg-[#98796F] border-2 border-[#FFF4F1] shadow-xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#49352F] whitespace-nowrap">
                      Projects
                    </h3>
                    <div className="flex-1 h-[1.5px] bg-[#CBB8AE]" />
                  </div>

                  <div className="space-y-3">
                    {projectSec.items
                      .filter((item) => item.title?.trim())
                      .map((proj) => (
                        <div key={proj.id} className="space-y-0.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-sans font-bold text-xs sm:text-sm text-[#49352F]">
                              {proj.title}
                            </p>
                            {proj.date && (
                              <span className="text-[11px] font-sans text-[#98796F] font-medium shrink-0">
                                {proj.date}
                              </span>
                            )}
                          </div>
                          {proj.subtitle && (
                            <p className="text-[11px] font-mono font-medium text-[#98796F]">
                              {proj.subtitle}
                            </p>
                          )}
                          {proj.description && (
                            <p className="text-xs text-[#49352F]/80 leading-relaxed">
                              {proj.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 4. CERTIFICATIONS, IF PROVIDED */}
              {certSec && certSec.items.some((item) => item.title?.trim()) && (
                <div className="relative pl-7 sm:pl-9">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="absolute left-[22px] sm:left-[30px] w-2.5 h-2.5 rounded-full bg-[#98796F] border-2 border-[#FFF4F1] shadow-xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#49352F] whitespace-nowrap">
                      Certifications
                    </h3>
                    <div className="flex-1 h-[1.5px] bg-[#CBB8AE]" />
                  </div>

                  <div className="space-y-2.5">
                    {certSec.items
                      .filter((item) => item.title?.trim())
                      .map((cert) => (
                        <div key={cert.id} className="space-y-0.5">
                          <p className="font-sans font-bold text-xs text-[#49352F]">{cert.title}</p>
                          {cert.subtitle && <p className="text-xs text-[#49352F]/80">{cert.subtitle}</p>}
                          {cert.description && <p className="text-xs text-[#49352F]/80">{cert.description}</p>}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* OTHER RIGHT CUSTOM SECTIONS */}
              {otherRightSections.map((sec) => {
                const items = sec.items.filter((item) => item.title?.trim());
                if (items.length === 0) return null;
                return (
                  <div key={sec.id} className="relative pl-7 sm:pl-9">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="absolute left-[22px] sm:left-[30px] w-2.5 h-2.5 rounded-full bg-[#98796F] border-2 border-[#FFF4F1] shadow-xs" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#49352F] whitespace-nowrap">
                        {sec.category}
                      </h3>
                      <div className="flex-1 h-[1.5px] bg-[#CBB8AE]" />
                    </div>
                    <div className="space-y-2.5">
                      {items.map((item) => (
                        <div key={item.id} className="space-y-0.5">
                          <p className="font-sans font-bold text-xs text-[#49352F]">{item.title}</p>
                          {item.subtitle && <p className="text-xs text-[#49352F]/80">{item.subtitle}</p>}
                          {item.description && <p className="text-xs text-[#49352F]/80">{item.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM SOLID DARK CHOCOLATE FOOTER BAR (20-24px high) */}
        <div className="w-full h-5 sm:h-6 bg-[#49352F] shrink-0" />
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
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-xl font-bold text-on-background">Personal Information</h3>
          <p className="text-xs text-on-background/60 mt-0.5">
            Specify your contact details, photo, and a compelling executive summary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleLoadReferenceSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3D2D24]/30 text-[#3D2D24] dark:text-[#E8DFD8] bg-[#3D2D24]/5 hover:bg-[#3D2D24]/10 text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
            title="Load Connor Hamilton sample data"
          >
            <RotateCcw size={13} />
            Load Sample
          </button>
          {user && (
            <button
              type="button"
              onClick={handleAutofillFromProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={13} />
              {hasAutofilled ? 'Re-sync Profile' : 'Autofill Profile'}
            </button>
          )}
        </div>
      </div>

      {/* Profile Photo Upload Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 shadow-xs">
        <div className="relative group shrink-0">
          {personal.photo ? (
            <div className="relative">
              <img
                src={personal.photo}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover aspect-square border-2 border-[#362419] shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#362419] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
                <Check size={10} />
              </span>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#FAF6F0] border-2 border-dashed border-[#967F72] flex flex-col items-center justify-center text-[#362419]">
              <Camera size={24} className="opacity-70" />
              <span className="text-[9px] font-mono uppercase tracking-wider mt-1 font-semibold">Photo</span>
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-on-background">
              Upload Profile Photo
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF6F0] text-[#362419] font-semibold border border-[#D8CCC4]">
              Passport Size
            </span>
          </div>
          <p className="text-xs text-on-background/60">
            Upload your photograph from your device. Automatically cropped to an elegant circular portrait beside your name banner.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#362419] hover:bg-[#261911] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Upload size={13} />
              {personal.photo ? 'Replace Photo' : 'Upload Profile Photo'}
            </button>

            {personal.photo && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>
            Full Name <span className="text-primary">*</span>
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
          <label className={labelCls}>Email Address</label>
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
          rows={4}
          className="w-full p-3.5 bg-surface-container-lowest border border-outline-variant/80 rounded-xl text-sm text-on-background placeholder:text-on-background/35 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-xs"
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-xl font-bold text-on-background">Work Experience</h3>
          <p className="text-xs text-on-background/60 mt-0.5">
            Highlight career positions, responsibilities, and quantified accomplishments.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          <Plus size={14} /> Add Role
        </button>
      </div>

      <div className="space-y-5">
        {experience.map((exp, expIdx) => (
          <div
            key={exp.id}
            className="border border-outline-variant/70 rounded-2xl p-5 bg-surface-container-low/70 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h4 className="font-serif text-base font-bold text-on-background">
                  Position #{expIdx + 1} {exp.role ? `• ${exp.role}` : ''}
                </h4>
              </div>
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="p-1.5 text-on-background/40 hover:text-red-500 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Remove Experience"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="pt-2">
              <label className={labelCls}>Bullet Points / Achievements</label>
              <div className="space-y-2.5">
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
                        className="p-1.5 text-on-background/40 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBullet(exp.id)}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:underline cursor-pointer pt-1"
                >
                  <Plus size={14} /> Add achievement bullet
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50">
        <div>
          <h3 className="font-serif text-xl font-bold text-on-background">Education</h3>
          <p className="text-xs text-on-background/60 mt-0.5">
            Add academic credentials, university degrees, or ongoing degrees.
          </p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          <Plus size={14} /> Add Degree
        </button>
      </div>

      <div className="space-y-5">
        {education.map((edu, eduIdx) => (
          <div
            key={edu.id}
            className="border border-outline-variant/70 rounded-2xl p-5 bg-surface-container-low/70 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h4 className="font-serif text-base font-bold text-on-background">
                  Education #{eduIdx + 1} {edu.school ? `• ${edu.school}` : ''}
                </h4>
              </div>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="p-1.5 text-on-background/40 hover:text-red-500 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
                  title="Remove Education"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        className="space-y-6"
      >
        <div className="pb-3 border-b border-outline-variant/50">
          <h3 className="font-serif text-xl font-bold text-on-background">Technical Skills & Expertise</h3>
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
            className="px-4 h-11 bg-primary text-on-primary rounded-xl font-mono text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-xs"
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
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/50">
          <div>
            <h3 className="font-serif text-xl font-bold text-on-background">Additional Information</h3>
            <p className="text-xs text-on-background/60 mt-0.5">
              Organize certifications, awards, languages, or custom sections.
            </p>
          </div>
          <button
            type="button"
            onClick={() => addCategory('Custom Section')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <FolderPlus size={14} /> + New Section
          </button>
        </div>

        {/* Quick add category chips */}
        <div className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline-variant/50 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-background/50 mr-1 font-semibold">
            Quick Add Category:
          </span>
          {presetCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => addCategory(cat)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-container-lowest text-on-background border border-outline-variant/60 hover:border-primary hover:text-primary transition-all cursor-pointer shadow-xs"
            >
              <Plus size={12} /> {cat}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-5">
          {customSections.map((sec) => (
            <div
              key={sec.id}
              className="border border-outline-variant/70 rounded-2xl p-5 bg-surface-container-low/70 space-y-4 shadow-xs"
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
      className="space-y-6"
    >
      <div className="pb-3 border-b border-outline-variant/50">
        <h3 className="font-serif text-xl font-bold text-on-background">External Links & Profiles</h3>
        <p className="text-xs text-on-background/60 mt-0.5">
          Link to your code repositories, online portfolio, and competitive programming profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      className="space-y-10"
    >
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase tracking-widest font-semibold">
          <Sparkles size={13} />
          DevCanvas Resume Maker
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-on-background">
          Choose Your Resume Template
        </h1>
        <p className="text-sm md:text-base text-on-background/70 leading-relaxed">
          Select an ATS-optimized, professionally structured layout. Compare typography, visual hierarchy,
          and section designs below with full readable previews before personalizing your data.
        </p>
      </div>

      {/* Side-by-side Large Professional Template Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* TEMPLATE 1: Brown & Beige Minimalist CV (Canva Reference) */}
        <div
          className={`group relative rounded-3xl border-2 transition-all p-6 md:p-7 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'blue-minimalist'
              ? 'border-[#362419] shadow-xl ring-4 ring-[#362419]/10'
              : 'border-outline-variant hover:border-[#362419]/60 hover:shadow-lg'
          }`}
        >
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#362419] font-bold bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#D8CCC4]">
                  Editorial Serif System
                </span>
                <h2 className="font-serif text-2xl font-bold text-on-background mt-2">
                  Brown Editorial Serif CV
                </h2>
                <p className="text-xs text-on-background/60 mt-1">
                  Classic single-column editorial layout: Centered executive serif header, crisp horizontal divider rules, warm ivory paper, and 100% ATS readability.
                </p>
              </div>
              {selectedTemplate === 'blue-minimalist' && (
                <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-[#362419] text-white rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                  <Check size={12} /> Active
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {[
                'Warm Ivory & Dark Chocolate',
                'Single-Column Editorial',
                'Centered Executive Header',
                'Editorial Serif Typography',
                '100% ATS-Friendly',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-0.5 bg-[#FAF6F0] text-[#362419] text-[10px] font-mono rounded-md border border-[#D8CCC4]"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Large, Beautiful, Readable Document Preview */}
            <div className="relative rounded-2xl border border-[#D8CCC4] bg-[#FAF6F0]/50 p-3 sm:p-4 mb-6 shadow-inner overflow-hidden">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#5C4A42] mb-2 flex items-center justify-between">
                <span>Readable Document Preview</span>
                <span className="text-[#362419] font-semibold">Standard A4 Layout</span>
              </div>

              {/* Rendered Preview Sheet */}
              <div className="rounded-xl overflow-hidden shadow-md border border-[#D8CCC4] max-h-[460px] overflow-y-auto no-scrollbar transform-gpu transition-transform group-hover:scale-[1.01]">
                {renderBrownMinimalistContent(sampleResumeData)}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => handleSelectTemplate('blue-minimalist')}
            className={`w-full py-3.5 px-6 rounded-2xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              selectedTemplate === 'blue-minimalist'
                ? 'bg-[#362419] hover:bg-[#261911] text-white shadow-[#362419]/25'
                : 'bg-primary text-on-primary hover:opacity-95'
            }`}
          >
            <span>Use Brown Editorial Template</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* TEMPLATE 2: Rebuilt Canva Two-Column Modern CV */}
        <div
          className={`group relative rounded-3xl border-2 transition-all p-6 md:p-7 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'black-white-minimalist'
              ? 'border-[#49352F] shadow-xl ring-4 ring-[#49352F]/10'
              : 'border-outline-variant hover:border-[#49352F]/60 hover:shadow-lg'
          }`}
        >
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#49352F] font-bold bg-[#FFF4F1] px-2.5 py-0.5 rounded-full border border-[#CBB8AE]">
                  Canva Rebuilt Edition
                </span>
                <h2 className="font-serif text-2xl font-bold text-on-background mt-2">
                  Canva Two-Column Modern CV
                </h2>
                <p className="text-xs text-on-background/60 mt-1">
                  Rebuilt ground-up to Canva reference: 40% dusty rose-brown sidebar, 60% right timeline column, single-line dark chocolate banner, circular photo, and boxed headings.
                </p>
              </div>
              {selectedTemplate === 'black-white-minimalist' && (
                <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-[#49352F] text-white rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                  <Check size={12} /> Active
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {[
                'Dark Chocolate & Warm Blush',
                '40% Dusty Rose Sidebar',
                '60% Right Content Timeline',
                'Circular Profile Photo',
                'Checkmark Skill Badges',
                '100% ATS-Friendly',
              ].map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-0.5 bg-[#FFF4F1] text-[#49352F] text-[10px] font-mono rounded-md border border-[#CBB8AE]"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Large, Beautiful, Readable Document Preview */}
            <div className="relative rounded-2xl border border-[#CBB8AE] bg-[#FFF4F1]/50 p-3 sm:p-4 mb-6 shadow-inner overflow-hidden">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#98796F] mb-2 flex items-center justify-between">
                <span>Readable Document Preview</span>
                <span className="text-[#49352F] font-semibold">Standard A4 Layout</span>
              </div>

              {/* Rendered Preview Sheet */}
              <div className="rounded-xl overflow-hidden shadow-md border border-[#CBB8AE] max-h-[460px] overflow-y-auto no-scrollbar transform-gpu transition-transform group-hover:scale-[1.01]">
                {renderBlackWhiteMinimalistContent(sampleResumeData)}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={() => handleSelectTemplate('black-white-minimalist')}
            className={`w-full py-3.5 px-6 rounded-2xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              selectedTemplate === 'black-white-minimalist'
                ? 'bg-[#49352F] hover:bg-[#362723] text-white shadow-[#49352F]/25'
                : 'bg-primary text-on-primary hover:opacity-95'
            }`}
          >
            <span>Use Canva Two-Column Template</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl border border-outline-variant bg-surface-container-low/50 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-primary" />
          <h3 className="font-serif text-lg font-bold text-on-background">Side-by-Side Template Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 font-mono text-[10px] uppercase tracking-wider text-on-background/60">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-[#362419] font-bold">Brown Editorial Serif CV</th>
                <th className="py-3 px-4 text-[#49352F] font-bold">Canva Two-Column Modern CV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-background/80">
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Layout Structure</td>
                <td className="py-3 px-4">Single-Column Editorial (Centered Executive Layout)</td>
                <td className="py-3 px-4">Two-Column (40% Dusty-Brown Sidebar / 60% Content)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Header Style</td>
                <td className="py-3 px-4">Centered Serif Name, Uppercase Tracked Title & Contact Dots</td>
                <td className="py-3 px-4">Circular Photo beside Dark Chocolate Horizontal Banner</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Sidebar</td>
                <td className="py-3 px-4">None (Clean Full-Width Linear Structure)</td>
                <td className="py-3 px-4">Dusty Rose-Brown (#98796F) with Boxed Headings & Checkmarks (✓)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Dividers & Timeline</td>
                <td className="py-3 px-4">Crisp Dark Chocolate (#362419) Horizontal Rules</td>
                <td className="py-3 px-4">Continuous Vertical Taupe Line (#CBB8AE) with Circular Dots</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Palette & Canvas</td>
                <td className="py-3 px-4">Warm Ivory (#FAF6F0) Canvas + Dark Chocolate (#362419)</td>
                <td className="py-3 px-4">Dusty Rose (#98796F), Dark Chocolate (#49352F) & Warm Blush (#FFF4F1)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-on-background">Recommended For</td>
                <td className="py-3 px-4">Executive, Corporate, Traditional Leadership & High-Volume ATS</td>
                <td className="py-3 px-4">Product Designers, Creative Developers & Modern Tech Roles</td>
              </tr>
            </tbody>
          </table>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWorkflowStep('select-template')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-container hover:border-primary text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft size={14} /> Change Template
            </button>
            <div className="hidden sm:block h-4 w-px bg-outline-variant" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-background/50 font-mono uppercase tracking-wider hidden md:inline">
                Active Template:
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container-lowest border border-outline-variant">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedTemplate === 'blue-minimalist' ? 'bg-[#49352F]' : 'bg-[#98796F]'
                  }`}
                />
                {selectedTemplate === 'blue-minimalist'
                  ? 'Brown Editorial Serif'
                  : 'Canva Two-Column Modern'}
              </span>
            </div>
          </div>

          {/* Quick template toggle & download actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Template Switcher pills */}
            <div className="flex items-center p-0.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
              <button
                type="button"
                onClick={() => setSelectedTemplate('blue-minimalist')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedTemplate === 'blue-minimalist'
                    ? 'bg-[#49352F] text-white shadow-xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Brown Editorial
              </button>
              <button
                type="button"
                onClick={() => setSelectedTemplate('black-white-minimalist')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  selectedTemplate === 'black-white-minimalist'
                    ? 'bg-[#98796F] text-white shadow-xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Canva Two-Column
              </button>
            </div>

            {/* View Mode Toggle (Mobile / Desktop) */}
            <div className="hidden lg:flex items-center p-0.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
              <button
                type="button"
                onClick={() => setViewMode('editor-only')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'editor-only'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview-only')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  viewMode === 'preview-only'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-background/60 hover:text-on-background'
                }`}
              >
                Preview
              </button>
            </div>

            {/* PDF Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Progress Indicator Card */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                Resume Completion
              </span>
              <h2 className="font-serif text-lg font-bold text-on-background">
                {completedCount} of 6 Sections Completed
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">{progressPercentage}%</span>
              <span className="text-xs text-on-background/50 font-mono">Ready to Export</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>

          {/* Section Step Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
            {sectionsStatus.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                      : sec.complete
                      ? 'bg-surface-container-low border-outline-variant hover:border-primary/50 text-on-background'
                      : 'bg-surface-container-lowest border-outline-variant/50 text-on-background/50 hover:text-on-background'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-on-primary' : sec.complete ? 'text-primary' : 'text-on-background/40'} />
                  <span className="text-xs font-semibold truncate flex-1">{sec.label.split(' ')[0]}</span>
                  {sec.complete && (
                    <CheckCircle2
                      size={13}
                      className={isActive ? 'text-on-primary' : 'text-primary shrink-0'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Real-Time Live Preview Layout */}
        <div
          className={`grid gap-6 ${
            viewMode === 'split'
              ? 'lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Column: Form Editor */}
          {viewMode !== 'preview-only' && (
            <div
              className={`space-y-6 ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'max-w-4xl mx-auto w-full'
              }`}
            >
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
                <AnimatePresence mode="wait">
                  {activeSection === 'personal' && <div key="sec-personal">{renderPersonalForm()}</div>}
                  {activeSection === 'experience' && <div key="sec-experience">{renderExperienceForm()}</div>}
                  {activeSection === 'education' && <div key="sec-education">{renderEducationForm()}</div>}
                  {activeSection === 'skills' && <div key="sec-skills">{renderSkillsForm()}</div>}
                  {activeSection === 'additional' && <div key="sec-additional">{renderAdditionalForm()}</div>}
                  {activeSection === 'links' && <div key="sec-links">{renderLinksForm()}</div>}
                </AnimatePresence>

                {/* Section Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-outline-variant/50">
                  {prevSection ? (
                    <button
                      type="button"
                      onClick={() => setActiveSection(prevSection.id as any)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer"
                    >
                      <ArrowLeft size={13} /> {prevSection.label.split(' ')[0]}
                    </button>
                  ) : <div />}

                  {nextSection ? (
                    <button
                      type="button"
                      onClick={() => setActiveSection(nextSection.id as any)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    >
                      Next: {nextSection.label.split(' ')[0]} <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-mono uppercase tracking-wider font-bold hover:opacity-90 transition-all cursor-pointer shadow-xs"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Real-Time Live Preview Sheet */}
          {viewMode !== 'editor-only' && (
            <div
              className={`space-y-4 ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'max-w-4xl mx-auto w-full'
              }`}
            >
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 shadow-sm space-y-4 sticky top-20">
                {/* Live Preview Header Toolbar */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-primary" />
                    <span className="font-serif font-bold text-sm text-on-background">
                      Real-Time Live Preview
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-on-background/50 hidden sm:inline">
                      Template:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplate(
                          selectedTemplate === 'blue-minimalist'
                            ? 'black-white-minimalist'
                            : 'blue-minimalist'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg border border-outline-variant bg-surface-container-lowest text-[10px] font-mono uppercase tracking-wider font-bold text-on-background hover:border-primary transition-all cursor-pointer shadow-xs"
                    >
                      Switch to {selectedTemplate === 'blue-minimalist' ? 'Canva Two-Column' : 'Brown Editorial'}
                    </button>
                  </div>
                </div>

                {/* Rendered Resume Document */}
                <div className="rounded-xl overflow-hidden border border-outline-variant shadow-lg bg-white max-h-[780px] overflow-y-auto no-scrollbar">
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-h-screen text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <AnimatePresence mode="wait">
        {workflowStep === 'select-template'
          ? renderTemplateSelectionScreen()
          : renderEditorScreen()}
      </AnimatePresence>
    </div>
  );
}
