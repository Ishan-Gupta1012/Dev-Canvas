'use client';

import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, Globe, Plus, Trash2, Eye, Download, ExternalLink, Palette, Check, Sparkles, Award, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const inputCls =
  'w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-background placeholder-on-background/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all';
const labelCls =
  'block text-[10px] font-mono uppercase tracking-widest text-on-background/50 mb-1';

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'personal' | 'experience' | 'education' | 'skills' | 'additional' | 'links' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('blue-minimalist');

  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  });

  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { id: '1', role: '', company: '', start: '', end: '', bullets: [''] },
  ]);

  const [education, setEducation] = useState<EducationEntry[]>([
    { id: '1', school: '', degree: '', field: '', gradYear: '' },
  ]);

  const [skills, setSkills] = useState<string[]>(['']);

  const [customSections, setCustomSections] = useState<CustomSection[]>([
    {
      id: 'certifications',
      category: 'Certifications',
      items: [
        { id: '1', title: '', subtitle: '', date: '', description: '' },
      ],
    },
    {
      id: 'awards',
      category: 'Awards & Activities',
      items: [
        { id: '1', title: '', subtitle: '', date: '', description: '' },
      ],
    },
    {
      id: 'languages',
      category: 'Languages',
      items: [
        { id: '1', title: '', subtitle: '', date: '', description: '' },
      ],
    },
  ]);

  const [links, setLinks] = useState({ github: '', linkedin: '', portfolio: '', leetcode: '' });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const isBlue = selectedTemplate === 'blue-minimalist';
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // 1. Top visual accent for Blue Minimalist CV
      if (isBlue) {
        doc.setFillColor(37, 99, 235); // #2563EB
        doc.rect(margin, y - 4, contentWidth, 1.2, 'F');
        y += 2.5;
      }

      // 2. Name
      const name = personal.name?.trim() || 'Your Name';
      if (isBlue) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(23);
        doc.setTextColor(15, 23, 42); // #0F172A
        doc.text(name, margin, y);
        y += 6.5;
      } else {
        doc.setFont('times', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0); // #000000
        doc.text(name, margin, y);
        y += 7;
      }

      // 3. Title
      if (personal.title?.trim()) {
        if (isBlue) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12.5);
          doc.setTextColor(37, 99, 235); // #2563EB Royal Blue
          doc.text(personal.title.trim(), margin, y);
          y += 5.5;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          doc.text(personal.title.trim().toUpperCase(), margin, y);
          y += 5.5;
        }
      }

      // 4. Contact line
      const contactParts = [personal.email, personal.phone, personal.location]
        .map((p) => p?.trim())
        .filter(Boolean);
      if (contactParts.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(isBlue ? 100 : 90, isBlue ? 116 : 90, isBlue ? 139 : 90);
        doc.text(contactParts.join('   •   '), margin, y);
        y += 5;
      }

      // 5. Summary
      if (personal.summary?.trim()) {
        y += 1.5;
        doc.setFont(isBlue ? 'helvetica' : 'times', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(isBlue ? 51 : 35, isBlue ? 65 : 35, isBlue ? 85 : 35);
        const summaryLines = doc.splitTextToSize(personal.summary.trim(), contentWidth);
        checkPageBreak(summaryLines.length * 4.4 + 2);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 4.4 + 3;
      }

      // Helper for Section Headers
      const renderSectionHeader = (title: string) => {
        checkPageBreak(12);
        y += 3;
        if (isBlue) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42); // #0F172A
          doc.text(title.toUpperCase(), margin, y);
          y += 2;
          doc.setDrawColor(226, 232, 240); // Slate 200
          doc.setLineWidth(0.35);
          doc.line(margin, y, margin + contentWidth, y);
          doc.setDrawColor(37, 99, 235); // Blue accent bar
          doc.setLineWidth(0.75);
          doc.line(margin, y, margin + 24, y);
          y += 5;
        } else {
          doc.setFont('times', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(title.toUpperCase(), margin, y);
          y += 2;
          doc.setDrawColor(0, 0, 0); // Black hairline rule
          doc.setLineWidth(0.45);
          doc.line(margin, y, margin + contentWidth, y);
          y += 5;
        }
      };

      // 6. Experience
      const expEntries = experience.filter((e) => e.role?.trim() || e.company?.trim());
      if (expEntries.length > 0) {
        renderSectionHeader('Experience');

        for (const exp of expEntries) {
          checkPageBreak(16);
          // Role
          doc.setFont(isBlue ? 'helvetica' : 'times', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(isBlue ? 15 : 0, isBlue ? 23 : 0, isBlue ? 42 : 0);
          doc.text(exp.role?.trim() || 'Role', margin, y);

          // Date Range right aligned
          const dateRange = [exp.start?.trim(), exp.end?.trim()].filter(Boolean).join(' – ');
          if (dateRange) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(isBlue ? 100 : 100, isBlue ? 116 : 100, isBlue ? 139 : 100);
            const dateWidth = doc.getTextWidth(dateRange);
            doc.text(dateRange, margin + contentWidth - dateWidth, y);
          }
          y += 4.5;

          // Company
          if (exp.company?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(isBlue ? 71 : 70, isBlue ? 85 : 70, isBlue ? 105 : 70);
            doc.text(exp.company.trim(), margin, y);
            y += 4.5;
          }

          // Bullets
          const validBullets = exp.bullets.filter((b) => b && b.trim());
          if (validBullets.length > 0) {
            doc.setFont(isBlue ? 'helvetica' : 'times', 'normal');
            doc.setFontSize(9);

            for (const bullet of validBullets) {
              const bulletLines = doc.splitTextToSize(bullet.trim(), contentWidth - 6);
              checkPageBreak(bulletLines.length * 4.2 + 2);
              if (isBlue) {
                doc.setTextColor(37, 99, 235);
                doc.text('•', margin + 1.5, y);
                doc.setTextColor(51, 65, 85);
              } else {
                doc.setTextColor(0, 0, 0);
                doc.text('•', margin + 1.5, y);
                doc.setTextColor(35, 35, 35);
              }
              doc.text(bulletLines, margin + 5.5, y);
              y += bulletLines.length * 4.2 + 1;
            }
          }
          y += 3;
        }
      }

      // 7. Education
      const eduEntries = education.filter((e) => e.school?.trim());
      if (eduEntries.length > 0) {
        renderSectionHeader('Education');

        for (const edu of eduEntries) {
          checkPageBreak(12);
          doc.setFont(isBlue ? 'helvetica' : 'times', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(isBlue ? 15 : 0, isBlue ? 23 : 0, isBlue ? 42 : 0);
          doc.text(edu.school.trim(), margin, y);

          // Right-aligned graduation year / dates
          if (edu.gradYear?.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(isBlue ? 100 : 100, isBlue ? 116 : 100, isBlue ? 139 : 100);
            const gradYearStr = edu.gradYear.trim();
            const gradWidth = doc.getTextWidth(gradYearStr);
            doc.text(gradYearStr, margin + contentWidth - gradWidth, y);
          }

          const details = [
            edu.degree?.trim(),
            edu.field?.trim() ? `in ${edu.field.trim()}` : '',
          ]
            .filter(Boolean)
            .join(' • ');

          if (details) {
            y += 4.2;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(isBlue ? 100 : 80, isBlue ? 116 : 80, isBlue ? 139 : 80);
            doc.text(details, margin, y);
          }
          y += 5.5;
        }
      }

      // 8. Skills
      const validSkills = skills.map((s) => s.trim()).filter(Boolean);
      if (validSkills.length > 0) {
        renderSectionHeader('Skills');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);

        let currentX = margin;
        const pillHeight = 6;
        const pillPadding = 3.5;
        const gapX = 3;
        const gapY = 3.5;

        for (const skill of validSkills) {
          const textWidth = doc.getTextWidth(skill);
          const pillWidth = textWidth + pillPadding * 2;

          if (currentX + pillWidth > margin + contentWidth) {
            currentX = margin;
            y += pillHeight + gapY;
            checkPageBreak(pillHeight + gapY);
          }

          if (isBlue) {
            doc.setFillColor(239, 246, 255); // #EFF6FF
            doc.setDrawColor(191, 219, 254); // #BFDBFE
            doc.setLineWidth(0.25);
            doc.roundedRect(currentX, y - 4.2, pillWidth, pillHeight, 2, 2, 'FD');
            doc.setTextColor(30, 64, 175); // #1E40AF
          } else {
            doc.setFillColor(245, 245, 245); // #F5F5F5
            doc.setDrawColor(209, 213, 219); // #D1D5DB
            doc.setLineWidth(0.25);
            doc.roundedRect(currentX, y - 4.2, pillWidth, pillHeight, 1.5, 1.5, 'FD');
            doc.setTextColor(17, 24, 39); // #111827
          }

          doc.text(skill, currentX + pillPadding, y);
          currentX += pillWidth + gapX;
        }
        y += pillHeight + 5;
      }

      // 9. Additional Information (Custom Sections: Certifications, Awards, Languages, etc.)
      for (const sec of customSections) {
        const validItems = sec.items.filter((item) => item.title?.trim());
        if (validItems.length > 0) {
          renderSectionHeader(sec.category.trim() || 'Additional Information');

          for (const item of validItems) {
            checkPageBreak(12);

            // Item Title on left
            doc.setFont(isBlue ? 'helvetica' : 'times', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(isBlue ? 15 : 0, isBlue ? 23 : 0, isBlue ? 42 : 0);
            doc.text(item.title.trim(), margin, y);

            // Date on right (consistently right-aligned on same row)
            if (item.date?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor(isBlue ? 100 : 100, isBlue ? 116 : 100, isBlue ? 139 : 100);
              const dateStr = item.date.trim();
              const dateWidth = doc.getTextWidth(dateStr);
              doc.text(dateStr, margin + contentWidth - dateWidth, y);
            }
            y += 4.2;

            // Subtitle on left
            if (item.subtitle?.trim()) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9);
              doc.setTextColor(isBlue ? 71 : 70, isBlue ? 85 : 70, isBlue ? 105 : 70);
              doc.text(item.subtitle.trim(), margin, y);
              y += 4.2;
            }

            // Description on left
            if (item.description?.trim()) {
              doc.setFont(isBlue ? 'helvetica' : 'times', 'normal');
              doc.setFontSize(8.5);
              doc.setTextColor(isBlue ? 51 : 35, isBlue ? 65 : 35, isBlue ? 85 : 35);
              const descLines = doc.splitTextToSize(item.description.trim(), contentWidth);
              checkPageBreak(descLines.length * 3.8 + 2);
              doc.text(descLines, margin, y);
              y += descLines.length * 3.8 + 1;
            }

            y += 2.5;
          }
        }
      }

      // 10. Links
      const validLinks = Object.entries(links)
        .map(([k, v]) => ({
          key: k,
          label: labelMap[k] || (k.charAt(0).toUpperCase() + k.slice(1)),
          url: formatUrl(v),
        }))
        .filter((item) => Boolean(item.url));

      if (validLinks.length > 0) {
        renderSectionHeader('Links');

        doc.setFont(isBlue ? 'helvetica' : 'times', 'bold');
        doc.setFontSize(10);

        let currentX = margin;
        const separator = '   •   ';

        validLinks.forEach((item, idx) => {
          doc.setFont(isBlue ? 'helvetica' : 'times', 'bold');
          doc.setFontSize(10);
          const labelWidth = doc.getTextWidth(item.label);

          if (currentX + labelWidth > margin + contentWidth) {
            currentX = margin;
            y += 5.5;
            checkPageBreak(8);
          }

          const linkColor = isBlue ? [37, 99, 235] : [0, 0, 0];
          doc.setTextColor(linkColor[0], linkColor[1], linkColor[2]);
          doc.textWithLink(item.label, currentX, y, { url: item.url });

          doc.setDrawColor(linkColor[0], linkColor[1], linkColor[2]);
          doc.setLineWidth(0.2);
          doc.line(currentX, y + 0.6, currentX + labelWidth, y + 0.6);

          currentX += labelWidth;

          if (idx < validLinks.length - 1) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(170, 170, 170);
            const sepWidth = doc.getTextWidth(separator);
            if (currentX + sepWidth <= margin + contentWidth) {
              doc.text(separator, currentX, y);
              currentX += sepWidth;
            }
          }
        });
        y += 6;
      }

      // Clean file name
      const cleanFileName = personal.name?.trim()
        ? `${personal.name.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_${isBlue ? 'Blue_Minimalist' : 'Classic_BW'}_Resume.pdf`
        : `Resume_${isBlue ? 'Blue_Minimalist' : 'Classic_BW'}.pdf`;

      doc.save(cleanFileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const addExperience = () => {
    setExperience([...experience, { id: Date.now().toString(), role: '', company: '', start: '', end: '', bullets: [''] }]);
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
    setExperience(experience.map((e) => (e.id === id ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) } : e)));
  };

  const removeBullet = (id: string, index: number) => {
    setExperience(experience.map((e) => (e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e)));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), school: '', degree: '', field: '', gradYear: '' }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const updateSkill = (index: number, value: string) => {
    setSkills(skills.map((s, i) => (i === index ? value : s)));
  };

  const addSkill = () => setSkills([...skills, '']);
  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

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

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'additional', label: 'Additional Info', icon: Award },
    { id: 'links', label: 'Links', icon: Globe },
    { id: 'preview', label: 'Preview', icon: Eye },
  ] as const;

  const completedSections = [
    !!personal.name,
    experience.some((e) => e.role || e.company),
    education.some((e) => e.school),
    skills.some((s) => s.trim()),
    customSections.some((sec) => sec.items.some((item) => item.title.trim())),
    !!links.github || !!links.linkedin || !!links.portfolio || !!links.leetcode,
  ].filter(Boolean).length;

  const renderTemplateSelector = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={16} className="text-primary" />
          <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">Design Collection</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-on-background">Choose Your Resume Template</h2>
        <p className="text-sm text-on-background/60 mt-1 max-w-2xl">
          Select an ATS-friendly, professional layout. Your data is dynamically rendered into the chosen design and reflected instantly in the preview and downloaded PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Template 1: Blue, White & Gray Minimalist CV */}
        <div
          className={`group relative rounded-2xl border-2 transition-all p-5 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'blue-minimalist'
              ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
              : 'border-outline-variant hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div>
            {/* Visual Thumbnail */}
            <div className="w-full h-52 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden p-4 relative shadow-inner mb-4 flex flex-col justify-between">
              {/* Blue accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600" />

              <div className="space-y-3">
                {/* Header Mock */}
                <div className="border-b border-slate-200 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="h-3 w-28 bg-slate-800 rounded-sm mb-1 font-bold" />
                      <div className="h-2 w-20 bg-blue-600 rounded-sm" />
                    </div>
                    <div className="h-2 w-24 bg-slate-300 rounded-sm" />
                  </div>
                </div>

                {/* Section 1 Mock: Experience */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-blue-600 rounded-xs" />
                    <div className="h-2 w-16 bg-slate-700 rounded-xs uppercase tracking-wider" />
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="pl-3 space-y-1">
                    <div className="flex justify-between">
                      <div className="h-2 w-24 bg-slate-800 rounded-xs" />
                      <div className="h-1.5 w-12 bg-slate-400 rounded-xs" />
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-xs" />
                    <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs" />
                  </div>
                </div>

                {/* Section 2 Mock: Skills Pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 bg-blue-600 rounded-xs" />
                    <div className="h-2 w-12 bg-slate-700 rounded-xs uppercase tracking-wider" />
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="flex flex-wrap gap-1 pl-3">
                    <div className="h-3.5 w-10 bg-blue-100 border border-blue-300 rounded-full" />
                    <div className="h-3.5 w-12 bg-blue-100 border border-blue-300 rounded-full" />
                    <div className="h-3.5 w-8 bg-blue-100 border border-blue-300 rounded-full" />
                    <div className="h-3.5 w-14 bg-blue-100 border border-blue-300 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Tag in bottom of preview */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
                <span>Canva Ref: EAHPbMzl71g</span>
                <span className="text-blue-600 font-semibold">Corporate Blue</span>
              </div>
            </div>

            {/* Template Info */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-on-background">Blue, White & Gray Minimalist CV</h3>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">Modern Corporate & Tech Focused</p>
              </div>
              {selectedTemplate === 'blue-minimalist' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                  <Check size={12} /> Active
                </span>
              )}
            </div>

            <p className="text-xs text-on-background/70 leading-relaxed mb-4">
              A contemporary layout featuring slate & navy accents, balanced hierarchy, and crisp line dividers. Tailored for software engineers, product managers, and modern professionals.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {['Deep Navy & Blue', 'Modern Sans-Serif', 'Blue Pill Badges', 'Visual Accents', 'ATS-Friendly'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-surface-container-low text-on-background/70 text-[10px] font-mono rounded-md border border-outline-variant/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('blue-minimalist');
              setActiveTab('preview');
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTemplate === 'blue-minimalist'
                ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
            }`}
          >
            {selectedTemplate === 'blue-minimalist' ? (
              <>
                <Check size={14} /> Selected (View In Preview)
              </>
            ) : (
              <>
                <Palette size={14} /> Use This Template
              </>
            )}
          </button>
        </div>

        {/* Template 2: Black & White Minimalist Professional Resume */}
        <div
          className={`group relative rounded-2xl border-2 transition-all p-5 flex flex-col justify-between bg-surface-container-lowest ${
            selectedTemplate === 'black-white-minimalist'
              ? 'border-neutral-900 shadow-md ring-2 ring-neutral-900/20'
              : 'border-outline-variant hover:border-neutral-400 hover:shadow-sm'
          }`}
        >
          <div>
            {/* Visual Thumbnail */}
            <div className="w-full h-52 rounded-xl bg-neutral-50 border border-neutral-300 overflow-hidden p-4 relative shadow-inner mb-4 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Header Mock */}
                <div className="text-center border-b-2 border-neutral-900 pb-2">
                  <div className="h-3.5 w-32 bg-neutral-900 rounded-xs mx-auto mb-1 font-serif" />
                  <div className="h-1.5 w-24 bg-neutral-500 rounded-xs mx-auto mb-1 font-mono tracking-widest" />
                  <div className="h-1.5 w-36 bg-neutral-400 rounded-xs mx-auto" />
                </div>

                {/* Section 1 Mock: Experience */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-0.5">
                    <div className="h-2 w-20 bg-neutral-900 rounded-xs uppercase tracking-wider font-serif" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="h-2 w-28 bg-neutral-900 rounded-xs font-serif" />
                      <div className="h-1.5 w-14 bg-neutral-500 rounded-xs font-mono" />
                    </div>
                    <div className="h-1.5 w-full bg-neutral-300 rounded-xs" />
                    <div className="h-1.5 w-3/4 bg-neutral-300 rounded-xs" />
                  </div>
                </div>

                {/* Section 2 Mock: Skills */}
                <div className="space-y-1.5 pt-1">
                  <div className="border-b border-neutral-900 pb-0.5">
                    <div className="h-2 w-14 bg-neutral-900 rounded-xs uppercase tracking-wider font-serif" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div className="h-3.5 w-10 bg-neutral-200 border border-neutral-400 rounded-xs" />
                    <div className="h-3.5 w-12 bg-neutral-200 border border-neutral-400 rounded-xs" />
                    <div className="h-3.5 w-8 bg-neutral-200 border border-neutral-400 rounded-xs" />
                    <div className="h-3.5 w-14 bg-neutral-200 border border-neutral-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Tag in bottom of preview */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[10px] text-neutral-400 font-mono">
                <span>Canva Ref: EAHND74dQuY</span>
                <span className="text-neutral-900 font-semibold">Editorial Monochrome</span>
              </div>
            </div>

            {/* Template Info */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-on-background">Black & White Minimalist Professional</h3>
                <p className="text-xs text-neutral-600 font-semibold mt-0.5">Timeless Editorial & Executive</p>
              </div>
              {selectedTemplate === 'black-white-minimalist' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
                  <Check size={12} /> Active
                </span>
              )}
            </div>

            <p className="text-xs text-on-background/70 leading-relaxed mb-4">
              A classic monochrome aesthetic featuring refined serif typography, crisp black rules, and 100% ATS readability. Ideal for executive, finance, corporate, and traditional leadership roles.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {['Pure Monochrome', 'Editorial Serif', '100% ATS-Friendly', 'Crisp Hairline Rules', 'Executive Appeal'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-surface-container-low text-on-background/70 text-[10px] font-mono rounded-md border border-outline-variant/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('black-white-minimalist');
              setActiveTab('preview');
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedTemplate === 'black-white-minimalist'
                ? 'bg-neutral-900 text-white shadow-sm hover:bg-black'
                : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
            }`}
          >
            {selectedTemplate === 'black-white-minimalist' ? (
              <>
                <Check size={14} /> Selected (View In Preview)
              </>
            ) : (
              <>
                <Palette size={14} /> Use This Template
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderPersonal = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Full Name', field: 'name' as const },
          { label: 'Job Title', field: 'title' as const },
          { label: 'Email', field: 'email' as const },
          { label: 'Phone', field: 'phone' as const },
          { label: 'Location', field: 'location' as const },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className={labelCls}>{label}</label>
            <input
              type="text"
              value={personal[field]}
              onChange={(e) => setPersonal({ ...personal, [field]: e.target.value })}
              className={inputCls}
              placeholder={label}
            />
          </div>
        ))}
      </div>
      <div>
        <label className={labelCls}>Professional Summary</label>
        <textarea
          value={personal.summary}
          onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
          rows={4}
          className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-background placeholder-on-background/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
          placeholder="Brief summary of your background and focus..."
        />
      </div>
    </motion.div>
  );

  const renderExperience = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      {experience.map((exp) => (
        <div key={exp.id} className="border border-outline-variant rounded-2xl p-5 bg-surface-container-low space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h4 className="font-serif text-lg font-semibold text-on-background">Experience Entry</h4>
            </div>
            {experience.length > 1 && (
              <button onClick={() => removeExperience(exp.id)} className="p-1.5 text-on-background/40 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Role / Title', value: exp.role, field: 'role' as const },
              { label: 'Company', value: exp.company, field: 'company' as const },
              { label: 'Start Date', value: exp.start, field: 'start' as const },
              { label: 'End Date', value: exp.end, field: 'end' as const },
            ].map(({ label, value, field }) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                  className={inputCls}
                  placeholder={label}
                />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Bullet Points</label>
            <div className="space-y-2">
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                    className={inputCls}
                    placeholder="Describe an achievement or responsibility..."
                  />
                  {exp.bullets.length > 1 && (
                    <button onClick={() => removeBullet(exp.id, idx)} className="p-1.5 text-on-background/40 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => addBullet(exp.id)} className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-primary hover:underline">
                <Plus size={14} /> Add bullet
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-mono uppercase tracking-wider text-on-background hover:bg-surface-container-low transition-colors">
        <Plus size={16} /> Add Experience
      </button>
    </motion.div>
  );

  const renderEducation = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      {education.map((edu) => (
        <div key={edu.id} className="border border-outline-variant rounded-2xl p-5 bg-surface-container-low space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h4 className="font-serif text-lg font-semibold text-on-background">Education Entry</h4>
            </div>
            {education.length > 1 && (
              <button onClick={() => removeEducation(edu.id)} className="p-1.5 text-on-background/40 hover:text-red-500 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'School / University', value: edu.school, field: 'school' as const },
              { label: 'Degree', value: edu.degree, field: 'degree' as const },
              { label: 'Field of Study', value: edu.field, field: 'field' as const },
              { label: 'Graduation Year', value: edu.gradYear, field: 'gradYear' as const },
            ].map(({ label, value, field }) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateEducation(edu.id, field, e.target.value)}
                  className={inputCls}
                  placeholder={label}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-mono uppercase tracking-wider text-on-background hover:bg-surface-container-low transition-colors">
        <Plus size={16} /> Add Education
      </button>
    </motion.div>
  );

  const renderSkills = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-5"
    >
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-surface-container-low border border-outline-variant rounded-full pl-3 pr-1 py-1">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(idx, e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-on-background w-32"
              placeholder="Skill"
            />
            <button onClick={() => removeSkill(idx)} className="p-1 rounded-full hover:bg-surface-container-high text-on-background/40 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addSkill} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-outline-variant text-sm font-mono uppercase tracking-wider text-primary hover:bg-primary-container/10 transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>
      <p className="text-xs font-mono uppercase tracking-wider text-on-background/40">Add technologies, tools, and expertise relevant to your target role.</p>
    </motion.div>
  );

  const renderLinks = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      {[
        { label: 'GitHub', field: 'github' as const, icon: 'github' },
        { label: 'LinkedIn', field: 'linkedin' as const, icon: 'linkedin' },
        { label: 'Portfolio Website', field: 'portfolio' as const, icon: 'globe' },
        { label: 'LeetCode', field: 'leetcode' as const, icon: 'code' },
      ].map(({ label, field, icon }) => (
        <div key={field}>
          <label className={labelCls}>{label}</label>
          <div className="relative">
            <input
              type="url"
              value={links[field]}
              onChange={(e) => updateLink(field, e.target.value)}
              className={inputCls}
              placeholder={`https://${icon}.com/username`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Globe size={14} className="text-on-background/30" />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderAdditionalInfo = () => {
    const presetCategories = [
      'Certifications',
      'Awards & Activities',
      'Languages',
      'Projects',
      'Hobbies & Interests',
      'Volunteer Experience',
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-6"
      >
        {/* Helper Banner */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-primary" />
            <h4 className="font-serif text-sm font-semibold text-on-background">
              Customizable Additional Information
            </h4>
          </div>
          <p className="text-xs text-on-background/60 leading-relaxed">
            Add dynamic categories such as Certifications, Awards, Languages, or Projects. Dates and year ranges are automatically right-aligned on the resume to match industry standards.
          </p>

          {/* Preset Buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-on-background/40 mr-1">
              Quick Add:
            </span>
            {presetCategories.map((cat) => {
              const alreadyExists = customSections.some(
                (c) => c.category.toLowerCase() === cat.toLowerCase()
              );
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => addCategory(cat)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    alreadyExists
                      ? 'bg-surface-container-high/60 text-on-background/60 hover:text-on-background border border-outline-variant/40'
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  <Plus size={12} />
                  {cat}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => addCategory('Custom Category')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-background transition-all cursor-pointer"
            >
              <FolderPlus size={12} />
              + Custom
            </button>
          </div>
        </div>

        {/* Categories List */}
        {customSections.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-outline-variant rounded-2xl bg-surface-container-low/30">
            <Award size={32} className="mx-auto text-on-background/30 mb-2" />
            <p className="text-sm font-semibold text-on-background">No additional categories added</p>
            <p className="text-xs text-on-background/50 mt-1 mb-4">
              Select one of the quick add presets above or create a custom section.
            </p>
            <button
              type="button"
              onClick={() => addCategory('Certifications')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus size={14} /> Add Certifications
            </button>
          </div>
        ) : (
          customSections.map((sec) => (
            <div
              key={sec.id}
              className="border border-outline-variant rounded-2xl p-5 bg-surface-container-low space-y-5"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <input
                    type="text"
                    value={sec.category}
                    onChange={(e) => updateCategoryName(sec.id, e.target.value)}
                    className="font-serif text-lg font-bold text-on-background bg-transparent border-b border-dashed border-transparent hover:border-outline-variant focus:border-primary outline-none px-1 py-0.5 rounded transition-all w-full max-w-sm"
                    placeholder="Category Name (e.g. Certifications, Languages)"
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

              {/* Items in Category */}
              <div className="space-y-4">
                {sec.items.map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-on-background/40 font-semibold">
                        {sec.category || 'Entry'} #{itemIdx + 1}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className={labelCls}>Title / Award / Subject</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'title', e.target.value)}
                          className={inputCls}
                          placeholder={
                            sec.category.toLowerCase().includes('lang')
                              ? 'e.g. Spanish'
                              : sec.category.toLowerCase().includes('cert')
                              ? 'e.g. AWS Solutions Architect'
                              : 'e.g. 1st Place Hackathon'
                          }
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className={labelCls}>Subtitle / Issuer / Level</label>
                        <input
                          type="text"
                          value={item.subtitle || ''}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'subtitle', e.target.value)}
                          className={inputCls}
                          placeholder={
                            sec.category.toLowerCase().includes('lang')
                              ? 'e.g. Native / Professional'
                              : sec.category.toLowerCase().includes('cert')
                              ? 'e.g. Amazon Web Services'
                              : 'e.g. DevPost & Google'
                          }
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className={labelCls}>
                          Date / Year <span className="text-primary font-bold">(Right-Aligned)</span>
                        </label>
                        <input
                          type="text"
                          value={item.date || ''}
                          onChange={(e) => updateCategoryItem(sec.id, item.id, 'date', e.target.value)}
                          className={inputCls}
                          placeholder="e.g. 2024 or May 2023"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Optional Details / Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateCategoryItem(sec.id, item.id, 'description', e.target.value)}
                        className={inputCls}
                        placeholder="Additional context, scores, or achievements..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item button */}
              <button
                type="button"
                onClick={() => addItemToCategory(sec.id)}
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary hover:underline cursor-pointer pt-1"
              >
                <Plus size={14} /> Add another entry to {sec.category || 'this category'}
              </button>
            </div>
          ))
        )}

        {/* Global Add Category Button */}
        <button
          type="button"
          onClick={() => addCategory('New Category')}
          className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-mono uppercase tracking-wider text-on-background hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Another Category
        </button>
      </motion.div>
    );
  };

  const renderBlueMinimalist = () => (
    <div className="p-8 md:p-10 space-y-6 bg-white text-slate-900 border-t-4 border-blue-600">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{personal.name || 'Your Name'}</h2>
        <p className="text-blue-600 font-semibold text-sm mt-0.5">{personal.title || 'Job Title'}</p>
        <p className="text-xs text-slate-500 mt-1.5 flex flex-wrap gap-2 items-center">
          {[personal.email, personal.phone, personal.location].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < arr.length - 1 && <span className="text-blue-400">•</span>}
            </React.Fragment>
          ))}
        </p>
        {personal.summary && (
          <p className="text-xs text-slate-600 mt-3 leading-relaxed border-l-2 border-blue-200 pl-3">
            {personal.summary}
          </p>
        )}
      </div>

      {experience.some((e) => e.role || e.company) && (
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Experience</h3>
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-slate-900">{exp.role || 'Role'}</p>
                  {(exp.start || exp.end) && (
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {exp.start}{exp.start && exp.end && ' – '}{exp.end}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-600 mt-0.5">{exp.company}</p>
                {exp.bullets.some((b) => b.trim()) && (
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-xs text-slate-600">
                    {exp.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.some((e) => e.school) && (
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Education</h3>
          </div>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-sm text-slate-900">{edu.school}</p>
                  {edu.gradYear && (
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 text-right">
                      {edu.gradYear}
                    </span>
                  )}
                </div>
                {(edu.degree || edu.field) && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.some((s) => s.trim()) && (
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.filter((s) => s.trim()).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Sections */}
      {customSections.map((sec) => {
        const itemsWithTitle = sec.items.filter((item) => item.title?.trim());
        if (itemsWithTitle.length === 0) return null;
        return (
          <div key={sec.id}>
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                {sec.category || 'Additional Information'}
              </h3>
            </div>
            <div className="space-y-3">
              {itemsWithTitle.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                    {item.date && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 text-right">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{item.subtitle}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {(links.github || links.linkedin || links.portfolio || links.leetcode) && (
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Links</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {Object.entries(links)
              .filter(([, v]) => v.trim())
              .map(([key, value]) => {
                const label = labelMap[key] || (key.charAt(0).toUpperCase() + key.slice(1));
                const href = formatUrl(value);
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {label}
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  const renderBlackWhiteMinimalist = () => (
    <div className="p-8 md:p-10 space-y-6 bg-white text-neutral-900 font-sans">
      <div className="border-b-2 border-neutral-900 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 tracking-tight">{personal.name || 'Your Name'}</h2>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-600 font-semibold mt-1">
          {personal.title || 'JOB TITLE'}
        </p>
        <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mt-2 flex flex-wrap gap-2 items-center">
          {[personal.email, personal.phone, personal.location].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < arr.length - 1 && <span className="text-neutral-400">•</span>}
            </React.Fragment>
          ))}
        </p>
        {personal.summary && (
          <p className="text-xs font-serif text-neutral-700 mt-3 leading-relaxed">
            {personal.summary}
          </p>
        )}
      </div>

      {experience.some((e) => e.role || e.company) && (
        <div>
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-900 pb-1 mb-3">
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-center justify-between">
                  <p className="font-serif font-bold text-sm text-neutral-900">{exp.role || 'Role'}</p>
                  {(exp.start || exp.end) && (
                    <span className="text-xs font-mono text-neutral-500">
                      {exp.start}{exp.start && exp.end && ' – '}{exp.end}
                    </span>
                  )}
                </div>
                <p className="text-xs font-sans uppercase tracking-wider text-neutral-600 mt-0.5">{exp.company}</p>
                {exp.bullets.some((b) => b.trim()) && (
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-xs font-serif text-neutral-700">
                    {exp.bullets.filter((b) => b.trim()).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.some((e) => e.school) && (
        <div>
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-900 pb-1 mb-3">
            Education
          </h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-serif font-bold text-sm text-neutral-900">{edu.school}</p>
                  {edu.gradYear && (
                    <span className="text-xs font-mono text-neutral-500 shrink-0 text-right">
                      {edu.gradYear}
                    </span>
                  )}
                </div>
                {(edu.degree || edu.field) && (
                  <p className="text-xs font-sans text-neutral-600 mt-0.5">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.some((s) => s.trim()) && (
        <div>
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-900 pb-1 mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.filter((s) => s.trim()).map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-neutral-100 text-neutral-900 text-xs font-mono rounded border border-neutral-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Sections */}
      {customSections.map((sec) => {
        const itemsWithTitle = sec.items.filter((item) => item.title?.trim());
        if (itemsWithTitle.length === 0) return null;
        return (
          <div key={sec.id}>
            <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-900 pb-1 mb-3">
              {sec.category || 'Additional Information'}
            </h3>
            <div className="space-y-3">
              {itemsWithTitle.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-serif font-bold text-sm text-neutral-900">{item.title}</p>
                    {item.date && (
                      <span className="text-xs font-mono text-neutral-500 shrink-0 text-right">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-xs font-sans uppercase tracking-wider text-neutral-600 mt-0.5">{item.subtitle}</p>
                  )}
                  {item.description && (
                    <p className="text-xs font-serif text-neutral-700 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {(links.github || links.linkedin || links.portfolio || links.leetcode) && (
        <div>
          <h3 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 border-b border-neutral-900 pb-1 mb-3">
            Links
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-serif">
            {Object.entries(links)
              .filter(([, v]) => v.trim())
              .map(([key, value]) => {
                const label = labelMap[key] || (key.charAt(0).toUpperCase() + key.slice(1));
                const href = formatUrl(value);
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-neutral-900 underline hover:text-neutral-600 transition-colors"
                  >
                    {label}
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <motion.div
      id="resume-preview-document"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border border-outline-variant rounded-2xl shadow-sm overflow-hidden bg-white"
    >
      {/* Preview Toolbar */}
      <div className="px-5 py-3 border-b border-outline-variant flex flex-wrap items-center justify-between gap-3 bg-surface-container-low no-print">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-lg font-semibold text-on-background">Resume Preview</h3>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-on-background/30" />
          {/* Quick template switcher */}
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setSelectedTemplate('blue-minimalist')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTemplate === 'blue-minimalist'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-on-background/60 hover:text-on-background'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Blue Minimalist
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('black-white-minimalist')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTemplate === 'black-white-minimalist'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-on-background/60 hover:text-on-background'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              Black & White
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-mono uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
          {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
        </button>
      </div>

      {/* Dynamic Template Body */}
      {selectedTemplate === 'blue-minimalist' ? renderBlueMinimalist() : renderBlackWhiteMinimalist()}
    </motion.div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full min-h-screen space-y-8 text-on-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/40">Workspace / Resume Builder</p>
            <span className="w-1 h-1 rounded-full bg-on-background/30" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{completedSections} of 6 sections complete</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-1">Resume Builder</h1>
          <p className="text-on-background/50 text-sm">Choose a template and fill in your details to build a polished, ATS-friendly resume.</p>
        </div>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-mono uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm disabled:opacity-50 self-start sm:self-auto shrink-0"
        >
          <Download size={14} className={isDownloading ? 'animate-bounce' : ''} />
          {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-surface-container-low p-1 rounded-2xl border border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-background/50 hover:text-on-background hover:bg-surface-container-lowest'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border border-outline-variant rounded-2xl p-6 bg-surface-container-lowest shadow-sm"
        >
          {activeTab === 'templates' && renderTemplateSelector()}
          {activeTab === 'personal' && renderPersonal()}
          {activeTab === 'experience' && renderExperience()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'additional' && renderAdditionalInfo()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'preview' && renderPreview()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
