'use client';

import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, Globe, Plus, Trash2, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'links' | 'preview'>('personal');

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
  const [links, setLinks] = useState({ github: '', linkedin: '', portfolio: '', leetcode: '' });

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

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'links', label: 'Links', icon: Globe },
    { id: 'preview', label: 'Preview', icon: Eye },
  ] as const;

  const renderPersonal = () => (
    <div className="space-y-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {[
          { label: 'Full Name', field: 'name' as const },
          { label: 'Job Title', field: 'title' as const },
          { label: 'Email', field: 'email' as const },
          { label: 'Phone', field: 'phone' as const },
          { label: 'Location', field: 'location' as const },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</label>
            <input
              type="text"
              value={personal[field]}
              onChange={(e) => setPersonal({ ...personal, [field]: e.target.value })}
              className="w-full h-10 px-md bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder={label}
            />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Professional Summary</label>
        <textarea
          value={personal.summary}
          onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
          rows={4}
          className="w-full p-md bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
          placeholder="Brief summary of your background and focus..."
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-lg">
      {experience.map((exp) => (
        <div key={exp.id} className="bg-surface-container-low p-lg rounded-2xl border border-outline-variant shadow-sm space-y-md">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-on-surface">Experience Entry</h4>
            {experience.length > 1 && (
              <button onClick={() => removeExperience(exp.id)} className="p-1.5 text-error hover:bg-error-container/10 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {[
              { label: 'Role / Title', value: exp.role, field: 'role' as const },
              { label: 'Company', value: exp.company, field: 'company' as const },
              { label: 'Start Date', value: exp.start, field: 'start' as const },
              { label: 'End Date', value: exp.end, field: 'end' as const },
            ].map(({ label, value, field }) => (
              <div key={field}>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                  className="w-full h-10 px-md bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Bullet Points</label>
            <div className="space-y-sm">
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-sm">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                    className="flex-1 h-10 px-md bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Describe an achievement or responsibility..."
                  />
                  {exp.bullets.length > 1 && (
                    <button onClick={() => removeBullet(exp.id, idx)} className="p-1.5 text-on-surface-variant hover:text-error transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => addBullet(exp.id)} className="flex items-center gap-xs text-xs font-semibold text-primary hover:underline">
                <Plus size={14} /> Add bullet
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addExperience} className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-lg">
      {education.map((edu) => (
        <div key={edu.id} className="bg-surface-container-low p-lg rounded-2xl border border-outline-variant shadow-sm space-y-md">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-on-surface">Education Entry</h4>
            {education.length > 1 && (
              <button onClick={() => removeEducation(edu.id)} className="p-1.5 text-error hover:bg-error-container/10 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {[
              { label: 'School / University', value: edu.school, field: 'school' as const },
              { label: 'Degree', value: edu.degree, field: 'degree' as const },
              { label: 'Field of Study', value: edu.field, field: 'field' as const },
              { label: 'Graduation Year', value: edu.gradYear, field: 'gradYear' as const },
            ].map(({ label, value, field }) => (
              <div key={field}>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateEducation(edu.id, field, e.target.value)}
                  className="w-full h-10 px-md bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors">
        <Plus size={16} /> Add Education
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-md">
      <div className="flex flex-wrap gap-sm">
        {skills.map((skill, idx) => (
          <div key={idx} className="flex items-center gap-xs bg-surface-container-low border border-outline-variant rounded-full pl-3 pr-1 py-1">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(idx, e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-on-surface w-32"
              placeholder="Skill"
            />
            <button onClick={() => removeSkill(idx)} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addSkill} className="flex items-center gap-xs px-3 py-1.5 rounded-full border border-outline-variant text-sm font-semibold text-primary hover:bg-primary-container/10 transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>
      <p className="text-xs text-on-surface-variant">Add technologies, tools, and expertise relevant to your target role.</p>
    </div>
  );

  const renderLinks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {[
        { label: 'GitHub', field: 'github' as const },
        { label: 'LinkedIn', field: 'linkedin' as const },
        { label: 'Portfolio Website', field: 'portfolio' as const },
        { label: 'LeetCode', field: 'leetcode' as const },
      ].map(({ label, field }) => (
        <div key={field}>
          <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{label}</label>
          <input
            type="url"
            value={links[field]}
            onChange={(e) => updateLink(field, e.target.value)}
            className="w-full h-10 px-md bg-surface-container-low border border-outline-variant rounded-xl text-sm text-on-surface placeholder-on-surface-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder={`https://${field.toLowerCase()}.com/username`}
          />
        </div>
      ))}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
      <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
        <h3 className="font-headline-md text-headline-md">Resume Preview</h3>
        <button className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          <Download size={16} />
          Download PDF
        </button>
      </div>
      <div className="p-lg space-y-lg">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">{personal.name || 'Your Name'}</h2>
          <p className="text-primary font-semibold">{personal.title || 'Job Title'}</p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            {[personal.email, personal.phone, personal.location].filter(Boolean).join(' • ')}
          </p>
          {personal.summary && <p className="text-body-sm text-on-surface mt-2 leading-relaxed">{personal.summary}</p>}
        </div>

        {experience.some((e) => e.role || e.company) && (
          <div>
            <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-xs mb-sm">Experience</h3>
            <div className="space-y-md">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-on-surface">{exp.role || 'Role'}</p>
                    <span className="text-xs text-on-surface-variant">{exp.start}{exp.start && exp.end && ' – '}{exp.end}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{exp.company}</p>
                  {exp.bullets.some((b) => b.trim()) && (
                    <ul className="mt-sm space-y-1 list-disc list-inside text-xs text-on-surface-variant">
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
            <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-xs mb-sm">Education</h3>
            <div className="space-y-sm">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-semibold text-sm text-on-surface">{edu.school}</p>
                  <p className="text-xs text-on-surface-variant">{edu.degree}{edu.field && ` in ${edu.field}`}{edu.gradYear && ` • ${edu.gradYear}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.some((s) => s.trim()) && (
          <div>
            <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-xs mb-sm">Skills</h3>
            <div className="flex flex-wrap gap-xs">
              {skills.filter((s) => s.trim()).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-surface-container-low text-on-surface text-xs font-semibold rounded-full border border-outline-variant/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(links.github || links.linkedin || links.portfolio || links.leetcode) && (
          <div>
            <h3 className="font-headline-md text-headline-md border-b border-outline-variant pb-xs mb-sm">Links</h3>
            <div className="flex flex-wrap gap-sm text-xs text-on-surface-variant">
              {Object.entries(links).filter(([, v]) => v.trim()).map(([key, value]) => (
                <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline capitalize">
                  {key}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full min-h-screen space-y-lg">
      {/* Header */}
      <div className="mb-xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Workspace / Resume Builder</p>
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">Resume Builder</h1>
        <p className="text-on-surface-variant text-sm">Fill in each section below to build a clean, professional resume.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-xs bg-surface-container-low p-xs rounded-2xl border border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-xs px-3 py-2 rounded-xl font-semibold text-sm transition-colors ${
              activeTab === tab.id ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-lowest'
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
          className="bg-surface-container-lowest p-lg md:p-xl rounded-2xl border border-outline-variant shadow-sm"
        >
          {activeTab === 'personal' && renderPersonal()}
          {activeTab === 'experience' && renderExperience()}
          {activeTab === 'education' && renderEducation()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'links' && renderLinks()}
          {activeTab === 'preview' && renderPreview()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
