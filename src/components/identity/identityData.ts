/**
 * Single source of truth for the sample identity used across the landing page.
 * The Identity Core, resume, and portfolio previews all read from here so the
 * same developer, same projects, and same facts flow through every scene.
 */

export const profile = {
  name: 'Ishan Gupta',
  role: 'Full Stack Developer',
  initials: 'IG',
  avatar: '/avatar_kasey.png',
  tagline: 'React · Next.js · TypeScript — building fast, thoughtful products.',
  location: 'New Delhi, India',
  stats: { contributions: '1,211', repos: '8 public repos' },
  site: 'ishangupta.dev',
} as const;

export const skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'] as const;

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  stack: string;
  image: string;
}

/** The two projects the identity starts with. */
export const baseProjects: Project[] = [
  {
    id: 'aurora',
    title: 'Project Aurora',
    subtitle: 'Real-time analytics dashboard',
    stack: 'Next.js · TypeScript · Postgres',
    image: '/project_aether.png',
  },
  {
    id: 'quotely',
    title: 'Quotely',
    subtitle: 'AI-powered quote generator',
    stack: 'Next.js · OpenAI · Tailwind',
    image: '/project_nova.png',
  },
];

/** The new project that arrives in the growth scene. */
export const newProject: Project = {
  id: 'linkops',
  title: 'LinkOps',
  subtitle: 'Developer URL shortener dashboard',
  stack: 'Next.js · Edge Functions',
  image: '/project_pulse.png',
};

export const experience = {
  title: 'Frontend Developer Intern',
  org: 'NextGen CTO',
  period: 'Jul 2024 – Aug 2024',
  detail: 'Shipped customer-facing dashboards in React and TypeScript.',
} as const;

export const education = {
  degree: 'B.Tech (CSE)',
  org: 'MAIT',
  period: '2024 – 2028',
} as const;

export const achievement = 'Hackathon — 2nd Place' as const;

/** Resolve the project list for a given state. */
export function projectsFor(includeNewProject: boolean): Project[] {
  return includeNewProject ? [...baseProjects, newProject] : baseProjects;
}
