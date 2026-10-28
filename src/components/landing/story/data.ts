/**
 * One sample developer, one set of information.
 *
 * Every scene in the story reads from this file. The floating cards in the
 * hero are the same objects that become profile sections, resume lines, and
 * portfolio cards later. This is deliberately illustrative data: it is labelled
 * as a sample in the interface and is not presented as a real person.
 */

export type FragmentKind =
  | "skill"
  | "project"
  | "achievement"
  | "education"
  | "experience"
  | "link"
  | "stat";

export interface FloatingFragment {
  id: string;
  kind: FragmentKind;
  label?: string;
  title: string;
  meta?: string;
  detail?: string;
  start: { x: number; y: number };
  group: { x: number; y: number };
  rotate: number;
  depth: "near" | "mid" | "far";
  className?: string;
}

export const PROFILE = {
  name: "Ishan Gupta",
  initials: "IG",
  role: "Full Stack Developer",
  location: "New Delhi, India",
  email: "ishan@example.com",
  website: "ishangupta.portfolioos.dev",
  github: "github.com/ishangupta",
  linkedin: "linkedin.com/in/ishangupta",
  summary:
    "Full stack developer building fast, thoughtful products. I like the space between a clean interface and the systems that keep it honest — from real-time data to the small details people feel but never see.",
  openToWork: true,
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Tailwind",
    "Python",
    "AWS",
  ],
  projects: [
    {
      id: "aurora",
      index: "01",
      name: "Project Aurora",
      tagline: "Real-time chat app with AI replies",
      description:
        "A multiplayer chat workspace with presence, threads, and an assistant that keeps conversations moving.",
      tech: ["Next.js", "TypeScript", "PostgreSQL"],
      stars: "412",
      year: "2025",
    },
    {
      id: "portfolioos",
      index: "02",
      name: "DevCanvas",
      tagline: "Developer portfolio platform",
      description:
        "A living profile that turns the work you already have into a resume and a portfolio you can share.",
      tech: ["React", "Next.js", "Node.js"],
      stars: "286",
      year: "2025",
    },
    {
      id: "devlog",
      index: "03",
      name: "DevLog",
      tagline: "A changelog that writes itself",
      description:
        "A release journal that turns commits and pull requests into a readable product history.",
      tech: ["Next.js", "Node.js", "PostgreSQL"],
      stars: "194",
      year: "2025",
    },
  ],
  experience: [
    {
      role: "Frontend Developer Intern",
      company: "NextGen CTO",
      period: "Jul — Aug 2024",
      location: "Remote",
      bullets: [
        "Rebuilt the account settings flow in Next.js, cutting time-to-change by 38%.",
        "Shipped a reusable data-table system used across three internal tools.",
      ],
    },
  ],
  education: [
    {
      institution: "MAIT",
      degree: "B.Tech, Computer Science",
      period: "2024 — 2028",
      detail: "First year · Web Dev Club · 8.7 CGPA",
    },
  ],
  achievements: [
    {
      title: "Hackathon Winner — 3rd Place",
      detail: "Built a privacy-first credential wallet in 36 hours.",
      year: "2025",
    },
    {
      title: "AWS Certified Cloud Practitioner",
      detail: "Foundational cloud certification.",
      year: "2024",
    },
    {
      title: "3.7k open-source contributions",
      detail: "Maintainer of a small React interaction library.",
      year: "2025",
    },
  ],
} as const;

export const FRAGMENTS: FloatingFragment[] = [
  {
    id: "skill-react",
    kind: "skill",
    title: "React",
    start: { x: 57, y: 16 },
    group: { x: 56, y: 18 },
    rotate: -1,
    depth: "near",
  },
  {
    id: "skill-ts",
    kind: "skill",
    title: "TypeScript",
    start: { x: 74, y: 18 },
    group: { x: 68, y: 18 },
    rotate: 2,
    depth: "mid",
  },
  {
    id: "skill-next",
    kind: "skill",
    title: "Next.js",
    start: { x: 94, y: 26 },
    group: { x: 94, y: 28 },
    rotate: -1,
    depth: "near",
  },
  {
    id: "project-aurora",
    kind: "project",
    title: "Project Aurora",
    detail: "• Built a real-time chat app with Next.js and Supabase",
    start: { x: 44, y: 34 },
    group: { x: 52, y: 42 },
    rotate: 1,
    depth: "near",
    className: "fragment--wide",
  },
  {
    id: "achievement-hackathon",
    kind: "achievement",
    title: "Achievement",
    meta: "Hackathon Winner (2nd Place)",
    start: { x: 45, y: 61 },
    group: { x: 54, y: 58 },
    rotate: -2,
    depth: "near",
  },
  {
    id: "link-github",
    kind: "link",
    title: "GitHub",
    meta: "140 commits this year",
    start: { x: 94, y: 40 },
    group: { x: 94, y: 40 },
    rotate: -1,
    depth: "far",
  },
  {
    id: "education-mait",
    kind: "education",
    title: "Education",
    meta: "• B.Tech - CSE",
    detail: "MAIT",
    start: { x: 94, y: 64 },
    group: { x: 93, y: 65 },
    rotate: 1,
    depth: "far",
  },
  {
    id: "experience-nextgen",
    kind: "experience",
    title: "Experience",
    meta: "• Frontend Developer Intern",
    detail: "NextGen CTO",
    start: { x: 44, y: 78 },
    group: { x: 60, y: 74 },
    rotate: 2,
    depth: "mid",
  },
];

export const PROCESS_STEPS = [
  {
    index: "01",
    label: "Add your information",
    title: "Add Your Information",
    body: "Skills, projects, experience, education, and achievements.",
    meta: "Profile",
  },
  {
    index: "02",
    label: "Generate your resume",
    title: "Generate Your Resume",
    body: "A polished, professional document from the same profile.",
    meta: "Resume",
  },
  {
    index: "03",
    label: "Create your portfolio",
    title: "Create Your Portfolio",
    body: "A personal site shaped around your work, not a blank template.",
    meta: "Portfolio",
  },
  {
    index: "04",
    label: "Publish and share",
    title: "Publish & Share",
    body: "One link you can send to a recruiter, client, or collaborator.",
    meta: "One link",
  },
] as const;

export const NEW_UPDATE = {
  label: "NEW EXPERIENCE",
  title: "AI Study Planner",
  meta: "Added just now",
  detail: "A new project entry, ready for your resume and portfolio.",
  tech: ["Next.js", "OpenAI", "Prisma"],
};
