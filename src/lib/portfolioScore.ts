import type { PortfolioData } from '@/types/portfolio';

/* ─── Types ─────────────────────────────────────────────────── */

export type SectionStatus = 'complete' | 'in-progress' | 'needs-improvement';

export type ScoreCheck = {
  key: string;
  label: string;
  done: boolean;
  weight: number;
  href: string;
  hint?: string;
};

export type SectionBreakdown = {
  key: string;
  label: string;
  /** Points earned for this section */
  earned: number;
  /** Maximum points available */
  max: number;
  /** 0–100 */
  pct: number;
  status: SectionStatus;
  /** Short explanation of what is missing or needs improvement */
  explanation: string;
  /** CTA label for the action button */
  actionLabel: string;
  href: string;
};

export type PortfolioLike = {
  id?: string;
  title?: string;
  template_name?: string;
  status?: 'draft' | 'published';
  slug?: string;
  data?: Partial<PortfolioData> | Record<string, unknown>;
  updated_at?: string;
};

/* ─── Helpers ───────────────────────────────────────────────── */

const hasText = (v: unknown, min = 1) =>
  typeof v === 'string' && v.trim().length >= min;

const asObj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : {};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/* ─── Status helper ─────────────────────────────────────────── */

function statusFromPct(pct: number): SectionStatus {
  if (pct >= 100) return 'complete';
  if (pct >= 40) return 'in-progress';
  return 'needs-improvement';
}

/* ─── Main scoring function ─────────────────────────────────── */

export function getPortfolioCompletion(portfolio: PortfolioLike | null | undefined) {
  const data = asObj(portfolio?.data);
  const hero = asObj(data.hero);
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const achievements = Array.isArray(data.achievements) ? data.achievements : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const contact = asObj(data.contact);
  const socials = Array.isArray(hero.socials) ? hero.socials : [];

  const validProjects = projects.filter((p) => {
    const o = asObj(p);
    return hasText(o.name) || hasText(o.description);
  });
  const richProjects = validProjects.filter((p) => {
    const o = asObj(p);
    return (
      hasText(o.description, 40) &&
      (Array.isArray(o.techStack) ? o.techStack.length > 0 : false)
    );
  });
  const validSkills = skills.filter((s) => hasText(asObj(s).name));
  const validAchievements = achievements.filter((a) => {
    const o = asObj(a);
    return hasText(o.title) || hasText(o.description);
  });
  const validSocials = socials.filter((s) => hasText(asObj(s).url, 8));

  /* ── Binary checks (used for checklist + base score) ─── */
  const checks: ScoreCheck[] = [
    {
      key: 'identity',
      label: 'Name & role added',
      done: hasText(hero.name) && (hasText(hero.title) || hasText(hero.tagline)),
      weight: 12,
      href: '/dashboard/builder',
      hint: 'Add your name and a clear professional title.',
    },
    {
      key: 'bio',
      label: 'Bio written',
      done: hasText(hero.bio, 30),
      weight: 10,
      href: '/dashboard/builder',
      hint: 'Write a short bio (30+ characters) that explains what you do.',
    },
    {
      key: 'projects',
      label: 'At least 1 project',
      done: validProjects.length >= 1,
      weight: 18,
      href: '/dashboard/builder',
      hint: 'Add a project with a name and description.',
    },
    {
      key: 'project-depth',
      label: 'Project details & links',
      done: validProjects.some((p) => {
        const o = asObj(p);
        return (
          (Array.isArray(o.techStack) && o.techStack.length > 0) ||
          hasText(o.githubUrl, 8) ||
          hasText(o.liveUrl, 8) ||
          (Array.isArray(o.highlights) && o.highlights.some((h) => hasText(h)))
        );
      }),
      weight: 10,
      href: '/dashboard/builder',
      hint: 'Add tech stack, highlights, or live/GitHub links to a project.',
    },
    {
      key: 'experience',
      label: 'Experience or achievements',
      done: validAchievements.length >= 1,
      weight: 14,
      href: '/dashboard/builder',
      hint: 'Add work experience, internships, or key achievements.',
    },
    {
      key: 'skills',
      label: 'Skills listed (3+)',
      done: validSkills.length >= 3,
      weight: 12,
      href: '/dashboard/builder',
      hint: 'List at least 3 relevant skills.',
    },
    {
      key: 'contact',
      label: 'Contact information',
      done:
        hasText(contact.email) ||
        hasText(hero.location) ||
        validSocials.length >= 1,
      weight: 12,
      href: '/dashboard/builder',
      hint: 'Add an email, location, or social profile link.',
    },
    {
      key: 'template',
      label: 'Template selected',
      done: hasText(portfolio?.template_name),
      weight: 6,
      href: '/dashboard/templates',
      hint: 'Choose a template for this portfolio.',
    },
    {
      key: 'avatar',
      label: 'Profile image added',
      done: hasText(hero.avatarUrl, 8),
      weight: 6,
      href: '/dashboard/builder',
      hint: 'Add a profile photo or avatar.',
    },
  ];

  const earned = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const score = total ? Math.round((earned / total) * 100) : 0;
  const completedSections = checks.filter((c) => c.done).length;

  /* ── Rich per-section breakdown ─────────────────────────── */
  const breakdown: SectionBreakdown[] = [
    // 1. Personal Information (12 pts)
    (() => {
      const hasName = hasText(hero.name);
      const hasRole = hasText(hero.title) || hasText(hero.tagline);
      const hasLocation = hasText(hero.location);
      const hasAvatar = hasText(hero.avatarUrl, 8);
      // sub-scores: name(5) + role(5) + location(1) + avatar(1) = 12
      let e = 0;
      if (hasName) e += 5;
      if (hasRole) e += 5;
      if (hasLocation) e += 1;
      if (hasAvatar) e += 1;
      const pct = Math.round((e / 12) * 100);
      const missing: string[] = [];
      if (!hasName) missing.push('name');
      if (!hasRole) missing.push('professional title');
      if (!hasLocation) missing.push('location');
      if (!hasAvatar) missing.push('profile photo');
      return {
        key: 'personal-info',
        label: 'Personal Information',
        earned: e,
        max: 12,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? 'Name, title, location and profile photo are all set.'
            : missing.length
            ? `Missing: ${missing.join(', ')}.`
            : 'Partially complete — add more details.',
        actionLabel: 'Edit Info',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 2. Professional Bio (10 pts)
    (() => {
      const bioLen = typeof hero.bio === 'string' ? hero.bio.trim().length : 0;
      const taglineOk = hasText(hero.tagline, 10);
      // bio(7) + tagline(3) = 10
      let e = 0;
      if (bioLen >= 30) e += 7;
      else if (bioLen >= 10) e += 3;
      if (taglineOk) e += 3;
      const pct = Math.round((e / 10) * 100);
      return {
        key: 'bio',
        label: 'Professional Bio',
        earned: e,
        max: 10,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? 'Bio and tagline look great.'
            : bioLen < 30
            ? `Bio is too short (${bioLen} chars). Write at least 30 characters describing your work.`
            : !taglineOk
            ? 'Add a headline/tagline (e.g. "Frontend Engineer · React · TypeScript").'
            : 'Expand your bio for more impact.',
        actionLabel: 'Write Bio',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 3. Projects (18 pts)
    (() => {
      // 1st project(8) + 2nd project(4) + rich details(6) = 18
      let e = 0;
      if (validProjects.length >= 1) e += 8;
      if (validProjects.length >= 2) e += 4;
      if (richProjects.length >= 1) e += 6;
      e = clamp(e, 0, 18);
      const pct = Math.round((e / 18) * 100);
      return {
        key: 'projects',
        label: 'Projects',
        earned: e,
        max: 18,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? `${validProjects.length} project(s) with strong descriptions and details.`
            : validProjects.length === 0
            ? 'No projects added yet. Projects are the most important portfolio section.'
            : richProjects.length === 0
            ? 'Add a 40+ char description and tech stack to at least one project.'
            : validProjects.length < 2
            ? 'Add a second project to increase recruiter confidence.'
            : 'Projects look good — add more highlights or links.',
        actionLabel:
          validProjects.length === 0 ? 'Add Projects' : 'Improve Projects',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 4. Skills (12 pts)
    (() => {
      // 3+ skills(6) + 6+ skills(4) + 10+ skills(2) = 12
      let e = 0;
      if (validSkills.length >= 3) e += 6;
      if (validSkills.length >= 6) e += 4;
      if (validSkills.length >= 10) e += 2;
      const pct = Math.round((e / 12) * 100);
      return {
        key: 'skills',
        label: 'Skills',
        earned: e,
        max: 12,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? `${validSkills.length} skills listed — great coverage.`
            : validSkills.length === 0
            ? 'No skills added. List at least 3 role-relevant technologies.'
            : validSkills.length < 3
            ? `Only ${validSkills.length} skill(s) added. Add at least 3.`
            : validSkills.length < 6
            ? `${validSkills.length} skills listed. Adding 6+ shows deeper expertise.`
            : `${validSkills.length} skills listed. 10+ shows strong breadth.`,
        actionLabel: validSkills.length < 3 ? 'Add Skills' : 'Add More',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 5. Work Experience & Achievements (14 pts)
    (() => {
      // 1 achievement(8) + 2 achievements(6) = 14
      let e = 0;
      if (validAchievements.length >= 1) e += 8;
      if (validAchievements.length >= 2) e += 6;
      const pct = Math.round((e / 14) * 100);
      return {
        key: 'experience',
        label: 'Work Experience & Achievements',
        earned: e,
        max: 14,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? `${validAchievements.length} experience/achievement entries — good depth.`
            : validAchievements.length === 0
            ? 'No experience or achievements. Add at least one role, internship, or achievement.'
            : `${validAchievements.length} entry added. A second entry doubles your score here.`,
        actionLabel:
          validAchievements.length === 0 ? 'Add Experience' : 'Add More',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 6. Contact Details (12 pts)
    (() => {
      const hasEmail = hasText(contact.email);
      const hasLoc = hasText(hero.location);
      // email(5) + location(3) + each social up to 4(1 each) = 12
      let e = 0;
      if (hasEmail) e += 5;
      if (hasLoc) e += 3;
      e += Math.min(validSocials.length, 4);
      e = clamp(e, 0, 12);
      const pct = Math.round((e / 12) * 100);
      const missing: string[] = [];
      if (!hasEmail) missing.push('email');
      if (!hasLoc) missing.push('location');
      if (validSocials.length === 0) missing.push('at least one social link');
      return {
        key: 'contact',
        label: 'Contact Details',
        earned: e,
        max: 12,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? 'Email, location and social links are set.'
            : missing.length
            ? `Add: ${missing.join(', ')}.`
            : `${validSocials.length} social link(s) added. More links improve discoverability.`,
        actionLabel: 'Add Contact',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),

    // 7. Portfolio Template (6 pts)
    (() => {
      const done = hasText(portfolio?.template_name);
      const e = done ? 6 : 0;
      const pct = done ? 100 : 0;
      return {
        key: 'template',
        label: 'Portfolio Template',
        earned: e,
        max: 6,
        pct,
        status: done ? 'complete' : 'needs-improvement',
        explanation: done
          ? `Using "${portfolio!.template_name}" template.`
          : 'No template selected. Pick a design to make your portfolio shareable.',
        actionLabel: 'Choose Template',
        href: '/dashboard/templates',
      } satisfies SectionBreakdown;
    })(),

    // 8. Overall Content Quality (derived — 16 pts bonus pool)
    (() => {
      // Computed from overall completeness quality signals, not a direct check
      // Signals: profile photo(4) + rich bio (tagline+40 chars)(4) + 2+ rich projects(4) + 6+ skills(2) + published(2) = 16
      const hasAvatar = hasText(hero.avatarUrl, 8);
      const bioLen = typeof hero.bio === 'string' ? hero.bio.trim().length : 0;
      const richBio = bioLen >= 40 && hasText(hero.tagline, 10);
      const twoRichProjects = richProjects.length >= 2;
      const manySkills = validSkills.length >= 6;
      const pub = portfolio?.status === 'published';
      let e = 0;
      if (hasAvatar) e += 4;
      if (richBio) e += 4;
      if (twoRichProjects) e += 4;
      if (manySkills) e += 2;
      if (pub) e += 2;
      const pct = Math.round((e / 16) * 100);
      const tips: string[] = [];
      if (!hasAvatar) tips.push('add a profile photo');
      if (!richBio) tips.push('expand bio to 40+ chars with a strong tagline');
      if (!twoRichProjects) tips.push('add rich descriptions to 2+ projects');
      if (!manySkills) tips.push('list 6+ skills');
      if (!pub) tips.push('publish the portfolio');
      return {
        key: 'quality',
        label: 'Overall Content Quality',
        earned: e,
        max: 16,
        pct,
        status: statusFromPct(pct),
        explanation:
          pct >= 100
            ? 'Excellent — your portfolio content is rich and complete.'
            : tips.length
            ? `To improve: ${tips.slice(0, 3).join('; ')}.`
            : 'Good — keep polishing.',
        actionLabel: 'Improve Quality',
        href: '/dashboard/builder',
      } satisfies SectionBreakdown;
    })(),
  ];

  /* Re-derive weighted score from checks (unchanged approach) */
  return {
    score,
    checks,
    breakdown,
    completedSections,
    totalSections: checks.length,
    isPublished: portfolio?.status === 'published',
    stats: {
      projects: validProjects.length,
      roles: validAchievements.length,
      skills: validSkills.length,
    },
  };
}

/* ─── Suggestions ───────────────────────────────────────────── */

export function buildSuggestions(portfolio: PortfolioLike | null | undefined) {
  if (!portfolio) {
    return [
      {
        title: 'Create a portfolio',
        detail:
          'Start by creating a portfolio so suggestions can be tailored to your data.',
        href: '/dashboard/ai-builder',
      },
    ];
  }
  const { checks, stats, score, isPublished } = getPortfolioCompletion(portfolio);
  const data = asObj(portfolio.data);
  const hero = asObj(data.hero);
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const suggestions: { title: string; detail: string; href: string }[] = [];

  for (const check of checks.filter((c) => !c.done).slice(0, 3)) {
    suggestions.push({
      title: `Complete: ${check.label}`,
      detail: check.hint || 'Fill this section to improve portfolio quality.',
      href: check.href,
    });
  }

  const weakProject = projects.find((p) => {
    const o = asObj(p);
    return (
      hasText(o.name) &&
      (!hasText(o.description, 40) ||
        !(Array.isArray(o.highlights) && o.highlights.length))
    );
  });
  if (weakProject && suggestions.length < 4) {
    suggestions.push({
      title: 'Strengthen project descriptions',
      detail:
        'Add a clear problem, your contribution, and measurable outcomes or highlights to make projects recruiter-friendly.',
      href: '/dashboard/builder',
    });
  }

  if (stats.skills >= 3 && stats.skills < 6 && suggestions.length < 4) {
    suggestions.push({
      title: 'Highlight more skills',
      detail:
        'Add role-relevant tools, frameworks, and soft skills so recruiters can quickly match your profile.',
      href: '/dashboard/builder',
    });
  }

  if (score >= 70 && !isPublished && suggestions.length < 4) {
    suggestions.push({
      title: 'Publish when ready',
      detail:
        'Your content is in good shape. Publishing makes the portfolio shareable while completion still reflects data quality.',
      href: '/dashboard/portfolios',
    });
  }

  if (isPublished && suggestions.length < 4) {
    suggestions.push({
      title: 'Keep recruiter visibility high',
      detail:
        'Review your top projects and bio for clarity, keywords, and a strong call to action.',
      href: `/${portfolio.slug || ''}`.replace(/\/$/, '') || '/dashboard/builder',
    });
  }

  if (!hasText(hero.tagline, 10) && suggestions.length < 4) {
    suggestions.push({
      title: 'Refine your headline',
      detail:
        'Use a specific tagline (role + focus + value) to improve first impressions.',
      href: '/dashboard/builder',
    });
  }

  return suggestions.slice(0, 4);
}

export const TEMPLATE_LABELS: Record<string, string> = {
  'modern-developer': 'Modern Developer',
  'software-engineer': 'Developer Pro',
  'creative-edge': 'Creative Edge',
};
