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

const inputCls =
  'w-full h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-background placeholder-on-background/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all';
const labelCls =
  'block text-[10px] font-mono uppercase tracking-widest text-on-background/50 mb-1';

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

  const completedSections = [
    !!personal.name,
    experience.some((e) => e.role || e.company),
    education.some((e) => e.school),
    skills.some((s) => s.trim()),
    !!links.github || !!links.linkedin || !!links.portfolio || !!links.leetcode,
  ].filter(Boolean).length;

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

  const renderPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="border border-outline-variant rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-outline-variant flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-on-background">Resume Preview</h3>
        <button className="flex items-center gap-1 px-4 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity">
          <Download size={14} />
          Download PDF
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-on-background">{personal.name || 'Your Name'}</h2>
          <p className="text-primary font-semibold">{personal.title || 'Job Title'}</p>
          <p className="text-sm text-on-background/50 mt-1">
            {[personal.email, personal.phone, personal.location].filter(Boolean).join(' • ')}
          </p>
          {personal.summary && <p className="text-sm text-on-background/70 mt-2 leading-relaxed">{personal.summary}</p>}
        </div>

        {experience.some((e) => e.role || e.company) && (
          <div>
            <h3 className="font-serif text-md font-semibold text-on-background border-b border-outline-variant pb-1 mb-2">Experience</h3>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-on-background">{exp.role || 'Role'}</p>
                    <span className="text-xs text-on-background/40">{exp.start}{exp.start && exp.end && ' – '}{exp.end}</span>
                  </div>
                  <p className="text-xs text-on-background/50">{exp.company}</p>
                  {exp.bullets.some((b) => b.trim()) && (
                    <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-on-background/50">
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
            <h3 className="font-serif text-md font-semibold text-on-background border-b border-outline-variant pb-1 mb-2">Education</h3>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-semibold text-sm text-on-background">{edu.school}</p>
                  <p className="text-xs text-on-background/50">{edu.degree}{edu.field && ` in ${edu.field}`}{edu.gradYear && ` • ${edu.gradYear}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.some((s) => s.trim()) && (
          <div>
            <h3 className="font-serif text-md font-semibold text-on-background border-b border-outline-variant pb-1 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.filter((s) => s.trim()).map((skill, idx) => (
                <span key={idx} className="px-2.5 py-0.5 bg-surface-container-low text-on-background text-xs font-semibold rounded-full border border-outline-variant/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {(links.github || links.linkedin || links.portfolio || links.leetcode) && (
          <div>
            <h3 className="font-serif text-md font-semibold text-on-background border-b border-outline-variant pb-1 mb-2">Links</h3>
            <div className="flex flex-wrap gap-3 text-xs text-primary">
              {Object.entries(links).filter(([, v]) => v.trim()).map(([key, value]) => (
                <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="hover:underline capitalize">
                  {key}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full min-h-screen space-y-8 text-on-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-background/40">Workspace / Resume Builder</p>
          <span className="w-1 h-1 rounded-full bg-on-background/30" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{completedSections} of 5 sections complete</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-1">Resume Builder</h1>
        <p className="text-on-background/50 text-sm">Fill in each section below to build a clean, professional resume.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-surface-container-low p-1 rounded-2xl border border-outline-variant">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
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
